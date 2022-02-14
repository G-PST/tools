#![cfg_attr(debug_assertions, allow(dead_code, unused_imports))]
#![allow(unused_imports)]
#![allow(unused_variables)]
#![allow(dead_code)]

// #![feature(plugin)]
// #![plugin(rocket_codegen)]
// #![feature(proc_macro_hygiene)]

#[macro_use]
extern crate serde_derive;

extern crate serde;
extern crate serde_json;

use std::{
  collections::HashMap,
  env,
  io::Cursor,
  path::{Path, PathBuf},
  sync::{Arc, Mutex},
  time::{Duration, Instant},
};

#[macro_use]
extern crate rocket;
use std::str::FromStr;

use anyhow::anyhow;
use hubcaps::{
  issues::{Issue, IssueListOptions, IssueOptions},
  Credentials, Github,
};
use license::License;
use log::{info, trace, warn};
use pulldown_cmark::{Event, Parser, Tag};
use regex::Regex;
use rocket::{
  fairing::{Fairing, Info, Kind},
  fs::NamedFile,
  futures::{StreamExt, TryStreamExt},
  get,
  http::{ContentType, Header, Method, Status},
  response::{content, status},
  routes,
  serde::{
    json::{self, Json, Value},
    Deserialize, Serialize,
  },
  tokio, Request, Responder, Response, State,
};
use strum::IntoEnumIterator;
use strum_macros::{EnumIter, EnumString};

#[derive(Debug, Clone, Copy)]
enum Location {
  NotImportant,
  Heading,
  Section,
}

#[get("/")]
async fn index() -> Option<NamedFile> {
  NamedFile::open("frontend/dist/index.html").await.ok()
}

#[get("/<file..>")]
async fn files(file: PathBuf) -> Option<NamedFile> {
  NamedFile::open(Path::new("frontend/dist/").join(file)).await.ok()
}

#[get("/version")]
async fn version() -> String {
  concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION")).to_string()
}

#[derive(FromForm)]
struct Options<'r> {
  emoji: bool,
  name: Option<&'r str>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, EnumIter, EnumString)]
#[serde(crate = "rocket::serde", rename_all = "lowercase")]
enum TemporalScale {
  Instant,
  Milliseconds,
  Seconds,
  Minutes,
  Hours,
  Days,
  Months,
  Years,
  Decades,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, EnumIter, EnumString)]
#[serde(crate = "rocket::serde", rename_all = "lowercase")]
enum SpatialScale {
  Component,
  Device,
  Facility,
  Municipality,
  County,
  State,
  Region,
  Country,
  Continent,
  Global,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct Tool {
  id: usize,
  number: u64,
  name: String,
  screenshots: Vec<String>,
  short_description: String,
  focus_topic: String,
  description: String,
  website: String,
  license: String,
  language: Vec<String>,
  interface: Vec<String>,
  documentation: String,
  year: u64,
  institution: String,
  funding_source: String,
  maintenance_status: bool,
  number_of_publications: Option<u64>,
  publication_list: Vec<String>,
  use_cases: Vec<String>,
  input_data_formats: Vec<String>,
  output_data_formats: Vec<String>,
  operating_systems: Vec<String>,
  source: Option<String>,
  github_stars: Option<u64>,
  infrastructure_sector: Vec<String>,
  parallel_computing_paradigm: Vec<String>,
  represented_behavior: Vec<String>,
  modeling_paradigm: Vec<String>,
  capabilities: Vec<String>,
  user_interface: String,
  required_dependencies: String,
  issue_body: String,
  issue_url: String,
  point_of_contact: Option<String>,
  typical_temporal_resolution: Option<TemporalScale>,
  highest_temporal_resolution: Option<TemporalScale>,
  typical_spatial_resolution: Option<SpatialScale>,
  highest_spatial_resolution: Option<SpatialScale>,
  typical_temporal_scope: Option<TemporalScale>,
  largest_temporal_scope: Option<TemporalScale>,
  typical_spatial_scope: Option<SpatialScale>,
  largest_spatial_scope: Option<SpatialScale>,
}

fn split_once(haystack: &str, needle: &str) -> Option<(String, String)> {
  let mut splitter = haystack.splitn(2, needle);
  let first = splitter.next()?;
  let second = splitter.next()?;
  Some((first.trim().to_string(), second.trim().to_string()))
}

impl Tool {
  fn parse_input(&self, heading: &str) -> Option<String> {
    let markdown = Parser::new(&self.issue_body);
    let mut location = Location::NotImportant;

    for event in markdown {
      match (event, location) {
        (Event::Start(Tag::Heading(3)), Location::NotImportant) => {
          location = Location::Heading;
        },
        (Event::Text(s), Location::Heading) => {
          if s.to_string().as_str() == heading {
            location = Location::Section;
          }
        },
        (Event::Text(s), Location::Section) => {
          return Some(s.to_string());
        },
        _ => (),
      }
    }
    None
  }

  fn parse_checkboxes(&self, heading: &str) -> Option<Vec<String>> {
    let markdown = Parser::new(&self.issue_body);
    let mut location = Location::NotImportant;

    let mut items = Default::default();
    let mut string: String = Default::default();

    for event in markdown {
      match (event, location) {
        (Event::Start(Tag::Heading(3)), Location::NotImportant) => {
          location = Location::Heading;
        },
        (Event::Text(s), Location::Heading) => {
          if s.to_string().as_str() == heading {
            location = Location::Section;
          }
        },
        (Event::Start(Tag::List(None)), Location::Section) => {
          items = Vec::new();
        },
        (Event::Start(Tag::Item), Location::Section) => {
          string = "".to_string();
        },
        (Event::Text(s), Location::Section) => {
          string = format!("{}{}", string, s);
        },
        (Event::End(Tag::Item), Location::Section) => {
          if string.starts_with("[x] ") || string.starts_with("[X] ") {
            items.push(string.replace("[X] ", "").replace("[x] ", "").trim().to_string());
          }
        },
        (Event::End(Tag::List(None)), Location::Section) => {
          return Some(items);
        },
        _ => (),
      }
    }

    None
  }

  fn parse_body(&mut self) {
    if let Some(s) = self.parse_input("Name") {
      self.name = s;
      dbg!(&self.name);
    }
    if let Some(s) = self.parse_input("Screenshots") {
      self.screenshots = s.lines().filter(|l| !l.is_empty()).map(|s| s.to_string()).collect::<Vec<String>>();
    }
    if let Some(s) = self.parse_input("Focus Topic") {
      self.focus_topic = s;
    }
    if let Some(s) = self.parse_input("Primary Purpose") {
      self.short_description = s;
    }
    if let Some(s) = self.parse_input("Description") {
      self.description = s;
    }
    if let Some(s) = self.parse_input("Website") {
      self.website = s;
    }
    if let Some(s) = self.parse_input("Documentation") {
      self.documentation = s;
    }
    if let Some(s) = self.parse_input("Year") {
      self.year = s.parse::<u64>().unwrap_or_default();
    }
    if let Some(s) = self.parse_input("Institution") {
      self.institution = s;
    }
    if let Some(s) = self.parse_input("Funding Source") {
      self.funding_source = s;
    }
    if let Some(s) = self.parse_input("Publications") {
      self.number_of_publications = s.parse::<u64>().ok();
    }
    if let Some(s) = self.parse_input("Publication List") {
      self.publication_list = s.lines().filter(|l| !l.is_empty()).map(|l| l.to_string()).collect();
    }
    if let Some(s) = self.parse_input("Use Cases") {
      self.use_cases = s.lines().filter(|l| !l.is_empty()).map(|l| l.to_string()).collect();
    }
    if let Some(s) = self.parse_input("Source") {
      self.source = Some(s)
    }
    if let Some(s) = self.parse_input("Contact") {
      self.point_of_contact = Some(s)
    }
    if let Some(s) = self.parse_input("What is the highest temporal resolution supported by the tool?") {
      self.highest_temporal_resolution = TemporalScale::from_str(&s).ok();
    }
    if let Some(s) = self.parse_input("What is the typical temporal resolution supported by the tool?") {
      self.typical_temporal_resolution = TemporalScale::from_str(&s).ok();
    }
    if let Some(s) = self.parse_input("What is the largest temporal scope supported by the tool?") {
      self.largest_temporal_scope = TemporalScale::from_str(&s).ok();
    }
    if let Some(s) = self.parse_input("What is the typical temporal scope supported by the tool?") {
      self.typical_temporal_scope = TemporalScale::from_str(&s).ok();
    }
    if let Some(s) = self.parse_input("What is the highest spatial resolution supported by the tool?") {
      self.highest_spatial_resolution = SpatialScale::from_str(&s).ok();
    }
    if let Some(s) = self.parse_input("What is the typical spatial resolution supported by the tool?") {
      self.typical_spatial_resolution = SpatialScale::from_str(&s).ok();
    }
    if let Some(s) = self.parse_input("What is the largest spatial scope supported by the tool?") {
      self.largest_spatial_scope = SpatialScale::from_str(&s).ok();
    }
    if let Some(s) = self.parse_input("What is the typical spatial scope supported by the tool?") {
      self.typical_spatial_scope = SpatialScale::from_str(&s).ok();
    }
    if let Some(s) = self.parse_input("Input Data Format") {
      self.input_data_formats = s.split(',').map(|w| w.trim().to_string()).collect();
    }
    if let Some(s) = self.parse_input("Output Data Format") {
      self.output_data_formats = s.split(',').map(|w| w.trim().to_string()).collect();
    }
    if let Some(s) = self.parse_input("Required Dependencies") {
      self.required_dependencies = s;
    }
    if let Some(s) = self.parse_input("User Interface") {
      self.user_interface = s;
    }
    if let Some(v) = self.parse_checkboxes("Infrastructure Sector") {
      self.infrastructure_sector = v;
    }
    if let Some(v) = self.parse_checkboxes("Represented Behavior") {
      self.represented_behavior = v;
    }
    if let Some(s) = self.parse_input("Capabilities") {
      self.capabilities = s.lines().filter(|l| !l.is_empty()).map(|l| l.to_string()).collect();
    }
    if let Some(v) = self.parse_checkboxes("Modeling Paradigm") {
      self.modeling_paradigm = v;
    }
    if let Some(v) = self.parse_checkboxes("Programming Language") {
      self.language = v;
    }
    if let Some(v) = self.parse_checkboxes("Operating System Support") {
      self.operating_systems = v;
    }
    if let Some(s) = self.parse_checkboxes("Parallel Computing Paradigm") {
      self.parallel_computing_paradigm = s;
    }
  }

  fn get_github_stars(&mut self) {
    if self.source.is_none() {
      return;
    }
    let value = self.source.as_ref().unwrap();
    if value.contains("github.com") {
      let re = Regex::new(r"^(?:git|ssh|https?|git)(://|@)(.*)[:/]((.*)/(.*))(\.git)?(/?|\#[-\d\w._]+?)$").unwrap();
      if let Some(captures) = re.captures(&value) {
        let mut s = captures[3].split('/');
        let username = s.next().unwrap().to_string();
        let repository = s.next().unwrap().to_string();
        let github = Github::new(
          concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION")),
          Credentials::Token(env::var("TOOLS_GITHUB_PAT").unwrap()),
        )
        .unwrap();
        let repo = std::thread::spawn(move || {
          let rt = tokio::runtime::Runtime::new().unwrap();
          rt.block_on(async { github.repo(username, repository).get().await })
        })
        .join()
        .unwrap();
        if let Ok(repo) = repo {
          self.github_stars = Some(repo.stargazers_count);
        }
      }
    }
  }

  fn issue_to_tool(issue: &hubcaps::issues::Issue, id: usize) -> Option<Self> {
    let number = issue.number;
    let name = issue.title.clone();
    let body = issue.body.clone();

    let screenshots = Default::default();
    let description = Default::default();
    let short_description = Default::default();
    let focus_topic = Default::default();
    let website = Default::default();
    let license = Default::default();
    let source = Default::default();
    let github_stars = Default::default();
    let infrastructure_sector = Default::default();
    let parallel_computing_paradigm = Default::default();
    let required_dependencies = Default::default();
    let represented_behavior = Default::default();
    let modeling_paradigm = Default::default();
    let capabilities = Default::default();
    let user_interface = Default::default();
    let language = Default::default();
    let documentation = Default::default();
    let year = Default::default();
    let institution = Default::default();
    let funding_source = Default::default();
    let maintenance_status = Default::default();
    let input_data_formats = Default::default();
    let output_data_formats = Default::default();
    let point_of_contact = Default::default();
    let interface = Default::default();
    let typical_temporal_resolution = None;
    let highest_temporal_resolution = None;
    let typical_spatial_resolution = None;
    let highest_spatial_resolution = None;
    let typical_temporal_scope = None;
    let largest_temporal_scope = None;
    let typical_spatial_scope = None;
    let largest_spatial_scope = None;
    let number_of_publications = Default::default();
    let publication_list = Default::default();
    let use_cases = Default::default();
    let operating_systems = Default::default();
    let issue_body = body?;
    let issue_url = issue.html_url.clone();
    Some(Self {
      id,
      number,
      name,
      screenshots,
      short_description,
      focus_topic,
      description,
      website,
      license,
      language,
      interface,
      documentation,
      year,
      institution,
      funding_source,
      maintenance_status,
      number_of_publications,
      publication_list,
      use_cases,
      input_data_formats,
      output_data_formats,
      operating_systems,
      source,
      github_stars,
      infrastructure_sector,
      parallel_computing_paradigm,
      required_dependencies,
      represented_behavior,
      modeling_paradigm,
      capabilities,
      user_interface,
      issue_body,
      issue_url,
      point_of_contact,
      typical_temporal_resolution,
      highest_temporal_resolution,
      typical_spatial_resolution,
      highest_spatial_resolution,
      typical_temporal_scope,
      largest_temporal_scope,
      typical_spatial_scope,
      largest_spatial_scope,
    })
  }
}

#[get("/labels/<kind>", format = "json")]
async fn labels(kind: String) -> Json<Vec<String>> {
  match kind.as_str() {
    "TemporalScope" => Json(TemporalScale::iter().map(|s| format!("{:?}", s)).collect::<Vec<String>>()),
    "TemporalResolution" => Json(TemporalScale::iter().map(|s| format!("{:?}", s)).collect::<Vec<String>>()),
    "SpatialResolution" => Json(SpatialScale::iter().map(|s| format!("{:?}", s)).collect::<Vec<String>>()),
    "SpatialScope" => Json(SpatialScale::iter().map(|s| format!("{:?}", s)).collect::<Vec<String>>()),
    _ => Json(vec![]),
  }
}

#[get("/tools", format = "json")]
async fn get_tools() -> Json<Vec<Tool>> {
  let github = Github::new(
    concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION")),
    Credentials::Token(env::var("TOOLS_GITHUB_PAT").unwrap()),
  )
  .unwrap();
  let repo = github.repo("kdheepak", "tools");
  let issues = repo
    .issues()
    .iter(&IssueListOptions::builder().asc().per_page(100).state(hubcaps::issues::State::All).build())
    .try_collect::<Vec<hubcaps::issues::Issue>>()
    .await;
  let issues = issues.unwrap_or_default();
  let tools = issues
    .iter()
    .filter(|issue| issue.state == "open")
    .filter(|issue| issue.labels.iter().map(|l| l.name.clone()).any(|t| t.contains(&"tool".to_string())))
    .enumerate()
    .map(move |(i, issue)| {
      match Tool::issue_to_tool(issue, i) {
        Some(mut t) => {
          t.parse_body();
          t.get_github_stars();
          Some(t)
        },
        None => None,
      }
    })
    .flatten()
    .collect();
  Json(tools)
}

#[launch]
fn rocket() -> _ {
  rocket::build().mount("/", routes![index, files]).mount("/api/", routes![get_tools, labels, version])
}

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

use std::collections::HashMap;
use std::env;
use std::io::Cursor;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

#[macro_use]
extern crate rocket;
use rocket::fairing::{Fairing, Info, Kind};
use rocket::fs::NamedFile;
use rocket::futures::StreamExt;
use rocket::futures::TryStreamExt;
use rocket::http::{ContentType, Header, Method};
use rocket::serde::json::{json, Json, Value};
use rocket::serde::{Deserialize, Serialize};
use rocket::tokio;
use rocket::{get, routes};
use rocket::{Request, Response, State};

use rocket_cors as cors;

use crate::cors::{AllowedHeaders, AllowedOrigins, CorsOptions};

use hubcaps::issues::{Issue, IssueListOptions};

use hubcaps::{Credentials, Github};

use license::License;
use log::{info, trace, warn};
use regex::Regex;

use anyhow::anyhow;
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

#[get("/")]
async fn index() -> Option<NamedFile> {
    NamedFile::open("frontend/dist/index.html").await.ok()
}

#[get("/<file..>")]
async fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("frontend/dist/").join(file))
        .await
        .ok()
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

#[derive(Debug, Clone, Copy, Serialize, Deserialize, EnumIter)]
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

#[derive(Debug, Clone, Copy, Serialize, Deserialize, EnumIter)]
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
    short_description: String,
    description: String,
    website: String,
    license: String,
    language: Vec<String>,
    source: Option<String>,
    github_stars: Option<u64>,
    infrastructure_sector: Option<Vec<String>>,
    modeling_paradigm: Option<Vec<String>>,
    capabilities: Option<Vec<String>>,
    issue_body: String,
    issue_url: String,
    lowest_temporal_resolution: Option<TemporalScale>,
    highest_temporal_resolution: Option<TemporalScale>,
    lowest_spatial_resolution: Option<SpatialScale>,
    highest_spatial_resolution: Option<SpatialScale>,
    lowest_temporal_scope: Option<TemporalScale>,
    highest_temporal_scope: Option<TemporalScale>,
    lowest_spatial_scope: Option<SpatialScale>,
    highest_spatial_scope: Option<SpatialScale>,
}

fn split_once(haystack: &str, needle: &str) -> Option<(String, String)> {
    let mut splitter = haystack.splitn(2, needle);
    let first = splitter.next()?;
    let second = splitter.next()?;
    Some((first.trim().to_string(), second.trim().to_string()))
}

impl Tool {
    fn issue_to_tool(issue: &hubcaps::issues::Issue, id: usize) -> Self {
        let number = issue.number;
        let name = issue.title.clone();
        let body = issue.body.clone();

        let mut description = Default::default();
        let mut short_description = Default::default();
        let mut website = Default::default();
        let mut license = Default::default();
        let mut source = Default::default();
        let mut github_stars = Default::default();
        let mut infrastructure_sector = Default::default();
        let mut modeling_paradigm = Default::default();
        let mut capabilities = Default::default();
        let mut language = Default::default();
        let mut issue_body = Default::default();
        let mut lowest_temporal_resolution = None;
        let mut highest_temporal_resolution = None;
        let mut lowest_spatial_resolution = None;
        let mut highest_spatial_resolution = None;
        let mut lowest_temporal_scope = None;
        let mut highest_temporal_scope = None;
        let mut lowest_spatial_scope = None;
        let mut highest_spatial_scope = None;
        let issue_url = issue.html_url.clone();

        if let Some(body) = body {
            issue_body = body.clone();
            for line in body.lines() {
                if !line.starts_with("- ") {
                    continue;
                }
                let re = Regex::new(r"^- ").unwrap();
                let line = re.replace(line, "").to_string();
                let re = Regex::new(r"<!--[\s\S]*?-->").unwrap();
                let line = re.replace(&line, "").to_string();
                if let Some((key, value)) = split_once(&line, ": ") {
                    if value.is_empty() {
                        continue;
                    }
                    let key = key.as_str();
                    match key {
                        "Description" => description = value,
                        "Short Description" => short_description = value,
                        "Website" => website = value,
                        "License" => license = value,
                        "Source" => {
                            source = Some(value.clone());
                            if value.contains("github.com") {
                                let re = Regex::new(r"^(?:git|ssh|https?|git)(://|@)(.*)[:/]((.*)/(.*))(\.git)?(/?|\#[-\d\w._]+?)$").unwrap();
                                if let Some(captures) = re.captures(&value) {
                                    let mut s = captures[3].split('/');
                                    let username = s.next().unwrap().to_string();
                                    let repository = s.next().unwrap().to_string();
                                    info!("{} {}", username, repository);
                                    let github = Github::new(
                                        concat!(
                                            env!("CARGO_PKG_NAME"),
                                            "/",
                                            env!("CARGO_PKG_VERSION")
                                        ),
                                        Credentials::Token(env::var("TOOLS_GITHUB_PAT").unwrap()),
                                    )
                                    .unwrap();
                                    let repo = std::thread::spawn(move || {
                                        let rt = tokio::runtime::Runtime::new().unwrap();
                                        rt.block_on(async {
                                            github.repo(username, repository).get().await
                                        })
                                    })
                                    .join()
                                    .unwrap();
                                    if let Ok(repo) = repo {
                                        github_stars = Some(repo.stargazers_count);
                                    }
                                }
                            }
                        }
                        "Language" => {
                            language = value.split(',').map(|w| w.trim().to_string()).collect()
                        }
                        "Infrastructure Sector" => {
                            infrastructure_sector =
                                Some(value.split(',').map(|w| w.trim().to_string()).collect())
                        }
                        "Capabilities" => {
                            capabilities =
                                Some(value.split(',').map(|w| w.trim().to_string()).collect())
                        }
                        "Modeling Paradigm" => {
                            modeling_paradigm =
                                Some(value.split(',').map(|w| w.trim().to_string()).collect())
                        }
                        "Smallest Temporal Scope" => {
                            lowest_temporal_scope = match value.as_str() {
                                "Instant" => Some(TemporalScale::Instant),
                                "Milliseconds" => Some(TemporalScale::Milliseconds),
                                "Seconds" => Some(TemporalScale::Seconds),
                                "Minutes" => Some(TemporalScale::Minutes),
                                "Hours" => Some(TemporalScale::Hours),
                                "Days" => Some(TemporalScale::Days),
                                "Months" => Some(TemporalScale::Months),
                                "Years" => Some(TemporalScale::Years),
                                "Decades" => Some(TemporalScale::Decades),
                                _ => {
                                    warn!("{}", value);
                                    Some(TemporalScale::Instant)
                                }
                            }
                        }
                        "Largest Temporal Scope" => {
                            highest_temporal_scope = match value.as_str() {
                                "Instant" => Some(TemporalScale::Instant),
                                "Milliseconds" => Some(TemporalScale::Milliseconds),
                                "Seconds" => Some(TemporalScale::Seconds),
                                "Minutes" => Some(TemporalScale::Minutes),
                                "Hours" => Some(TemporalScale::Hours),
                                "Days" => Some(TemporalScale::Days),
                                "Months" => Some(TemporalScale::Months),
                                "Years" => Some(TemporalScale::Years),
                                "Decades" => Some(TemporalScale::Decades),
                                _ => {
                                    warn!("{}", value);
                                    Some(TemporalScale::Instant)
                                }
                            }
                        }
                        "Smallest Spatial Scope" => {
                            lowest_spatial_scope = match value.as_str() {
                                "Component" => Some(SpatialScale::Component),
                                "Device" => Some(SpatialScale::Device),
                                "Facility" => Some(SpatialScale::Facility),
                                "Municipality" => Some(SpatialScale::Municipality),
                                "State" => Some(SpatialScale::State),
                                "Region" => Some(SpatialScale::Region),
                                "Country" => Some(SpatialScale::Country),
                                "Continent" => Some(SpatialScale::Continent),
                                "Global" => Some(SpatialScale::Global),
                                _ => {
                                    warn!("{}", value);
                                    Some(SpatialScale::Component)
                                }
                            }
                        }
                        "Largest Spatial Scope" => {
                            highest_spatial_scope = match value.as_str() {
                                "Component" => Some(SpatialScale::Component),
                                "Device" => Some(SpatialScale::Device),
                                "Facility" => Some(SpatialScale::Facility),
                                "Municipality" => Some(SpatialScale::Municipality),
                                "State" => Some(SpatialScale::State),
                                "Region" => Some(SpatialScale::Region),
                                "Country" => Some(SpatialScale::Country),
                                "Continent" => Some(SpatialScale::Continent),
                                "Global" => Some(SpatialScale::Global),
                                _ => {
                                    warn!("{}", value);
                                    Some(SpatialScale::Component)
                                }
                            }
                        }
                        "Lowest Temporal Resolution" => {
                            lowest_temporal_resolution = match value.as_str() {
                                "Instant" => Some(TemporalScale::Instant),
                                "Milliseconds" => Some(TemporalScale::Milliseconds),
                                "Seconds" => Some(TemporalScale::Seconds),
                                "Minutes" => Some(TemporalScale::Minutes),
                                "Hours" => Some(TemporalScale::Hours),
                                "Days" => Some(TemporalScale::Days),
                                "Months" => Some(TemporalScale::Months),
                                "Years" => Some(TemporalScale::Years),
                                "Decades" => Some(TemporalScale::Decades),
                                _ => {
                                    warn!("{}", value);
                                    Some(TemporalScale::Instant)
                                }
                            }
                        }
                        "Highest Temporal Resolution" => {
                            highest_temporal_resolution = match value.as_str() {
                                "Instant" => Some(TemporalScale::Instant),
                                "Milliseconds" => Some(TemporalScale::Milliseconds),
                                "Seconds" => Some(TemporalScale::Seconds),
                                "Minutes" => Some(TemporalScale::Minutes),
                                "Hours" => Some(TemporalScale::Hours),
                                "Days" => Some(TemporalScale::Days),
                                "Months" => Some(TemporalScale::Months),
                                "Years" => Some(TemporalScale::Years),
                                "Decades" => Some(TemporalScale::Decades),
                                _ => {
                                    warn!("{}", value);
                                    Some(TemporalScale::Instant)
                                }
                            }
                        }
                        "Lowest Spatial Resolution" => {
                            lowest_spatial_resolution = match value.as_str() {
                                "Component" => Some(SpatialScale::Component),
                                "Device" => Some(SpatialScale::Device),
                                "Facility" => Some(SpatialScale::Facility),
                                "Municipality" => Some(SpatialScale::Municipality),
                                "State" => Some(SpatialScale::State),
                                "Region" => Some(SpatialScale::Region),
                                "Country" => Some(SpatialScale::Country),
                                "Continent" => Some(SpatialScale::Continent),
                                "Global" => Some(SpatialScale::Global),
                                _ => {
                                    warn!("{}", value);
                                    Some(SpatialScale::Component)
                                }
                            }
                        }
                        "Highest Spatial Resolution" => {
                            highest_spatial_resolution = match value.as_str() {
                                "Component" => Some(SpatialScale::Component),
                                "Device" => Some(SpatialScale::Device),
                                "Facility" => Some(SpatialScale::Facility),
                                "Municipality" => Some(SpatialScale::Municipality),
                                "State" => Some(SpatialScale::State),
                                "Region" => Some(SpatialScale::Region),
                                "Country" => Some(SpatialScale::Country),
                                "Continent" => Some(SpatialScale::Continent),
                                "Global" => Some(SpatialScale::Global),
                                _ => {
                                    warn!("{}", value);
                                    Some(SpatialScale::Component)
                                }
                            }
                        }
                        _ => {}
                    }
                }
            }
        }

        Self {
            id,
            number,
            name,
            short_description,
            description,
            website,
            license,
            language,
            source,
            github_stars,
            infrastructure_sector,
            modeling_paradigm,
            capabilities,
            issue_body,
            issue_url,
            lowest_temporal_resolution,
            highest_temporal_resolution,
            lowest_spatial_resolution,
            highest_spatial_resolution,
            lowest_temporal_scope,
            highest_temporal_scope,
            lowest_spatial_scope,
            highest_spatial_scope,
        }
    }
}

#[get("/labels/<kind>", format = "json")]
async fn labels(kind: String) -> Json<Vec<String>> {
    match kind.as_str() {
        "TemporalScope" => Json(
            TemporalScale::iter()
                .map(|s| format!("{:?}", s))
                .collect::<Vec<String>>(),
        ),
        "TemporalResolution" => Json(
            TemporalScale::iter()
                .map(|s| format!("{:?}", s))
                .collect::<Vec<String>>(),
        ),
        "SpatialResolution" => Json(
            SpatialScale::iter()
                .map(|s| format!("{:?}", s))
                .collect::<Vec<String>>(),
        ),
        "SpatialScope" => Json(
            SpatialScale::iter()
                .map(|s| format!("{:?}", s))
                .collect::<Vec<String>>(),
        ),
        _ => Json(vec![]),
    }
}

#[get("/tools", format = "json")]
async fn tools() -> Json<Vec<Tool>> {
    let github = Github::new(
        concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION")),
        Credentials::Token(env::var("TOOLS_GITHUB_PAT").unwrap()),
    )
    .unwrap();
    let repo = github.repo("kdheepak", "tools");
    let issues = repo
        .issues()
        .iter(
            &IssueListOptions::builder()
                .asc()
                .per_page(100)
                .state(hubcaps::issues::State::All)
                .build(),
        )
        .try_collect::<Vec<hubcaps::issues::Issue>>()
        .await;
    let issues = issues.unwrap_or_default();
    let tools = issues
        .iter()
        .filter(|issue| issue.state == "open")
        .enumerate()
        .map(move |(i, issue)| Tool::issue_to_tool(issue, i))
        .collect();
    Json(tools)
}

#[launch]
fn rocket() -> _ {
    // The default demonstrates the "All" serialization of several of the settings
    let default: CorsOptions = Default::default();

    let allowed_origins =
        AllowedOrigins::some(&["https://tools.kdheepak.com"], &["http://localhost:3000"]);

    let options = cors::CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get, Method::Post, Method::Delete]
            .into_iter()
            .map(From::from)
            .collect(),
        allowed_headers: AllowedHeaders::some(&["Authorization", "Accept"]),
        allow_credentials: true,
        expose_headers: ["Content-Type", "X-Custom"]
            .iter()
            .map(ToString::to_string)
            .collect(),
        max_age: Some(42),
        send_wildcard: false,
        fairing_route_base: "/mycors".to_string(),
        fairing_route_rank: 0,
    };

    rocket::build()
        .mount("/", routes![index, files])
        .mount("/api/", routes![tools, labels, version])
        .attach(options.to_cors().unwrap())
}

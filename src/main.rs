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

#[derive(FromForm)]
struct Options<'r> {
    emoji: bool,
    name: Option<&'r str>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct Tool {
    number: u64,
    name: String,
    description: String,
    website: String,
    license: String,
    language: Vec<String>,
    source: Option<String>,
    source_url: Option<String>,
    github_stars: Option<u64>,
    infrastructure_sector: Option<Vec<String>>,
    modeling_paradigm: Option<Vec<String>>,
    capabilities: Option<Vec<String>>,
}

fn split_once(in_string: &str) -> Option<(&str, &str)> {
    let mut splitter = in_string.splitn(2, ": ");
    let first = splitter.next()?;
    let second = splitter.next()?;
    Some((first.trim(), second.trim()))
}

impl Tool {
    fn issue_to_tool(issue: &hubcaps::issues::Issue) -> Self {
        let number = issue.number;
        let name = issue.title.clone();
        let body = issue.body.clone();

        let mut description = Default::default();
        let mut website = Default::default();
        let mut license = Default::default();
        let mut source = Default::default();
        let mut source_url = Default::default();
        let mut github_stars = Default::default();
        let mut infrastructure_sector = Default::default();
        let mut modeling_paradigm = Default::default();
        let mut capabilities = Default::default();
        let mut language = Default::default();

        if let Some(body) = body {
            for line in body.lines() {
                if !line.starts_with("- ") {
                    continue;
                }
                let line = line.replace("- ", "");
                dbg!(&line);
                if let Some((key, value)) = split_once(&line) {
                    if value.is_empty() || value.starts_with("<!--") {
                        continue;
                    }
                    match key {
                        "Description" => description = value.to_string(),
                        "Website" => website = value.to_string(),
                        "License" => license = value.to_string(),
                        "Source" => {
                            source = Some(value.to_string());
                            if value.contains("github.com") {
                                source_url = Some("/images/gitHub-mark.png".into());
                                let re = Regex::new(r"^(?:git|ssh|https?|git)(://|@)(.*)[:/]((.*)/(.*))(\.git)?(/?|\#[-\d\w._]+?)$").unwrap();
                                warn!("{}", value);
                                if let Some(captures) = re.captures(value) {
                                    let mut s = captures[3].split('/');
                                    let username = s.next().unwrap().to_string();
                                    let repository = s.next().unwrap().to_string();
                                    warn!("{} {}", username, repository);
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
                            } else if value.contains("sourceforge.net") {
                                source_url = Some("/images/sourceforge-mark.png".into());
                            } else {
                                source_url = Some("/images/link-mark.png".into());
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
                        _ => {
                            warn!("Unable to parse line {}", line);
                        }
                    }
                }
            }
        }

        Self {
            number,
            name,
            description,
            website,
            license,
            language,
            source,
            source_url,
            github_stars,
            infrastructure_sector,
            modeling_paradigm,
            capabilities,
        }
    }
}

#[get("/tools/licenses", format = "json")]
async fn licenses() -> Json<Vec<Tool>> {
    let github = Github::new(
        concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION")),
        Credentials::Token(env::var("TOOLS_GITHUB_PAT").unwrap()),
    )
    .unwrap();
    let repo = github.repo("kdheepak", "tools");
    let tools = repo
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
    let tools = tools.unwrap_or_default();
    let tools = tools
        .iter()
        .filter(|issue| issue.state == "open")
        .map(move |issue| Tool::issue_to_tool(issue))
        .collect();
    Json(tools)
}

#[get("/tools", format = "json")]
async fn tools() -> Json<Vec<Tool>> {
    let github = Github::new(
        concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION")),
        Credentials::Token(env::var("TOOLS_GITHUB_PAT").unwrap()),
    )
    .unwrap();
    let repo = github.repo("kdheepak", "tools");
    let tools = repo
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
    let tools = tools.unwrap_or_default();
    let tools = tools
        .iter()
        .map(move |issue| Tool::issue_to_tool(issue))
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
        .mount("/api/", routes![tools])
        .attach(options.to_cors().unwrap())
}

import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://gpst-tools.herokuapp.com/api";

const client = axios.create({
  baseURL: baseURL,
});

const state = {
  tools: [],
  languages: new Set(),
  selectedLanguages: [],
  searchQuery: null,
  toolsLoaded: false,
  submitTool: null,
};

const getters = {
  getLanguages: (state) => Array.from(state.languages).sort(),
  getSelectedLanguages: (state) => state.selectedLanguages.sort(),
  getToolsLoaded: (state) => state.toolsLoaded,
  getSubmitTool: (state) => state.submitTool,
  getTools: (state) => state.tools,
  getToolsQuery: (state) => {
    var tools;
    if (state.searchQuery) {
      tools = state.tools.filter((item) =>
        state.searchQuery
          .toLowerCase()
          .split(" ")
          .every((v) => {
            return (
              item.name.toLowerCase().includes(v) ||
              item.description.toLowerCase().includes(v) ||
              item.modeling_paradigm
                .map(Function.prototype.call, String.prototype.toLowerCase)
                .includes(v) ||
              item.language
                .map(Function.prototype.call, String.prototype.toLowerCase)
                .includes(v) ||
              item.short_description.toLowerCase().includes(v)
            );
          })
      );
    } else {
      tools = state.tools;
    }
    tools = tools.filter((tool) => {
      for (var language of state.selectedLanguages) {
        if (tool.language.includes(language)) {
          return true;
        }
      }
      return false;
    });
    return tools;
  },
};

const actions = {
  async clearTools({ commit }) {
    localStorage.clear();
    commit("clearTools");
  },
  async submitTool({ commit }) {
    const response = await client.post("/tools");
    commit("updateSubmitTool", response.data);
  },
  async fetchTools({ commit }) {
    const hours = 0.25;
    const now = new Date().getTime();
    const setupTime = localStorage.getItem("setupTime");
    if (setupTime == null) {
      localStorage.setItem("setupTime", now);
    } else {
      if (now - setupTime > hours * 60 * 60 * 1000) {
        localStorage.clear();
        localStorage.setItem("setupTime", now);
      }
    }
    const localData = JSON.parse(localStorage.getItem("kdheepak.tools.data"));
    if (localData && localData.tools.length !== 0) {
      commit("setTools", localData.tools);
    } else {
      const response = await client.get("/tools");
      for (var toolObj of response.data) {
        toolObj.github_stars = toolObj.github_stars
          ? toolObj.github_stars
          : "-";
        toolObj.name_url = `<a href='/#/Tool/${toolObj.number}'>${toolObj.name}</a>`;
        if (toolObj.website) {
          toolObj.website_url = `<a target="_blank" href='${toolObj.website}'><img src='/images/link-mark.png' alt="Website" style="width: 32px; height: 32px"/></a>`;
        }
        if (toolObj.source) {
          if (toolObj.source.includes("github.com")) {
            toolObj.source_img = "/images/github-mark.png";
          } else if (toolObj.source.includes("sourceforge.net")) {
            toolObj.source_img = "/images/sourceforge-mark.png";
          } else {
            toolObj.source_img = "/images/link-mark.png";
          }
          toolObj.source_url = `<a target="_blank" href='${toolObj.source}'><img src='${toolObj.source_img}' alt="Source" style="width: 32px; height: 32px"/></a>`;
        }
      }
      localStorage.setItem(
        "kdheepak.tools.data",
        JSON.stringify({
          tools: response.data,
        })
      );
      commit("setTools", response.data);
    }
  },
};

const mutations = {
  setSelectedLanguages: (state, selectedLanguages) => {
    state.selectedLanguages = selectedLanguages;
  },
  setTools: (state, tools) => {
    state.tools = tools;
    state.toolsLoaded = true;
    for (var tool of state.tools) {
      tool.language.map((lang) => state.languages.add(lang));
    }
    for (var lang of state.languages) {
      if (!state.selectedLanguages.includes(lang)) {
        state.selectedLanguages.push(lang);
      }
    }
  },
  clearTools: (state) => {
    state.tools = [];
    state.toolsLoaded = false;
  },
  updateSearchQuery: (state, query) => {
    state.searchQuery = query;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

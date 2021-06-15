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
  searchQuery: null,
  toolsLoaded: false,
};

const getters = {
  toolsLoaded: (state) => state.toolsLoaded,
  tools: (state) => state.tools,
  toolsQuery: (state) => {
    if (state.searchQuery) {
      return state.tools.filter((item) =>
        state.searchQuery
          .toLowerCase()
          .split(" ")
          .every(
            (v) =>
              item.name.toLowerCase().includes(v) ||
              item.description.toLowerCase().includes(v)
          )
      );
    }
    return state.tools;
  },
};

const actions = {
  async fetchTools({ commit }) {
    const response = await client.get("/tools");
    for (var toolObj of response.data) {
      toolObj.github_stars = toolObj.github_stars ? toolObj.github_stars : "-";
      if (toolObj.source) {
        if (toolObj.source.includes("github.com")) {
          toolObj.source_img = "/images/github-mark.png";
        } else if (toolObj.source.includes("sourceforge.net")) {
          toolObj.source_img = "/images/sourceforge-mark.png";
        } else {
          toolObj.source_img = "/images/link.png";
        }
      }
    }
    commit("setTools", response.data);
  },
};

const mutations = {
  setTools: (state, tools) => {
    state.tools = tools;
    state.toolsLoaded = true;
  },
  updateSearchQuery: (state, query) => {
    state.searchQuery = query;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

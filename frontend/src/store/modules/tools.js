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
};

const getters = {
  allTools: (state) => state.tools,
};

const actions = {
  async fetchTools({ commit }) {
    const response = await client.get("/tools");

    commit("setTools", response.data);
  },
  async addTool({ commit }, title) {
    const response = await client.post("/todos", { title, completed: false });

    commit("newTool", response.data);
  },
  async deleteTool({ commit }, id) {
    await client.delete(`/todos/${id}`);

    commit("removeTool", id);
  },
  async filterTools({ commit }, e) {
    // Get selected number
    const limit = parseInt(
      e.target.options[e.target.options.selectedIndex].innerText
    );

    const response = await client.get(
      `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`
    );

    commit("setTools", response.data);
  },
  async updateTool({ commit }, tool) {
    const response = await client.put(`/tools/${tool.id}`, tool);

    console.log(response.data);

    commit("updateTool", response.data);
  },
};

const mutations = {
  setTools: (state, todos) => (state.todos = todos),
  newTool: (state, todo) => state.todos.unshift(todo),
  removeTool: (state, id) =>
    (state.todos = state.todos.filter((todo) => todo.id !== id)),
  updateTool: (state, tool) => {
    const index = state.todos.findIndex((todo) => todo.id === tool.id);
    if (index !== -1) {
      state.todos.splice(index, 1, tool);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Tools</h1>
      </div>
    </div>

    <br />

    <Autocomplete
      v-model="searchQuery"
      placeholder='Filter tools (e.g. "OpenDSS" or "steady state")'
      :data="['OpenDSS', 'PandaPower', 'SWITCH']"
    />
    <br />

    <table class="table table-hover align-left" id="toolsTable">
      <thead>
        <tr>
          <th>Name</th>
          <th width="32">Source</th>
          <th>Stars</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="loader.issuesLoading">
          <td class="text-center" colspan="4">
            <img src="/images/loading.svg" alt="" />
          </td>
        </tr>

        <tr v-if="showIssues" v-for="issue in issuesQuery" :key="issue.number">
          <td class="text-start">
            <a target="_blank" :href="issue.toolUrl">{{ issue.toolName }}</a>
          </td>
          <td>
            <a target="_blank" :href="issue.toolSourceUrl">
              <img
                :src="issue.toolSourceUrlImg"
                alt="Source Url"
                style="width: 32px; height: 32px"
              />
            </a>
          </td>
          <td class="text-center">{{ issue.toolGithubStars }}</td>
          <td class="text-start">{{ issue.toolDescription }}</td>
        </tr>

        <tr v-if="noIssues">
          <td class="text-center" colspan="4">No tools found...</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import axios from "axios";
import Autocomplete from "./Autocomplete.vue";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://gpst-tools.herokuapp.com/api";
const client = axios.create({
  baseURL: baseURL,
});

export default defineComponent({
  name: "Tools",
  components: {
    Autocomplete,
  },
  mounted() {
    this.getLocalData();
  },
  data() {
    return {
      username: "dkrishna",
      repository: "Tools",
      tools: [],
      autocomplete_suggestions: ["OpenDSS"],
      searchQuery: null,
      response: {
        status: "",
        message: "",
      },
      loader: {
        issuesLoading: false,
      },
    };
  },
  computed: {
    showIssues() {
      return !!this.tools.length && !this.loader.issuesLoading;
    },
    noIssues() {
      return !this.issuesQuery.length && !this.loader.issuesLoading;
    },
    issuesQuery() {
      localStorage.setItem(
        "dkrishna.tools.gitHubIssues",
        JSON.stringify({
          username: this.username,
          repository: this.repository,
          searchQuery: this.searchQuery,
        })
      );
      if (this.searchQuery) {
        return this.tools.filter((item) =>
          this.searchQuery
            .toLowerCase()
            .split(" ")
            .every(
              (v) =>
                item.toolName.toLowerCase().includes(v) ||
                item.toolDescription.toLowerCase().includes(v)
            )
        );
      }
      return this.tools;
    },
  },
  methods: {
    reset() {
      this.username = "dkrishna";
      this.repository = "Tools";
      localStorage.removeItem("dkrishna.tools.gitHubIssues");
    },
    resetResponse() {
      this.response.status = "";
      this.response.message = "";
    },
    getLabel(item) {
      return item;
    },
    getIssues() {
      this.resetResponse();
      this.tools = [];
      localStorage.setItem(
        "dkrishna.tools.gitHubIssues",
        JSON.stringify({
          username: this.username,
          repository: this.repository,
          searchQuery: this.searchQuery,
        })
      );
      this.loader.issuesLoading = true;
      this.tools = [];
      // eslint-disable-next-line
      const url = "/tools";
      client
        .get(url)
        .then((response) => {
          // eslint-disable-next-line
          for (var toolObj of response.data) {
            toolObj.toolName = toolObj.name;
            toolObj.toolDescription = toolObj.description;
            toolObj.toolUrl = toolObj.website;
            toolObj.toolSourceUrl = toolObj.source;
            toolObj.toolGithubStars = toolObj.github_stars
              ? toolObj.github_stars
              : "-";
            toolObj.toolSourceUrlImg = toolObj.source_url;
            this.tools.push(toolObj);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          this.response.status = "error";
          this.response.message = "Unable to get data from the server";
        })
        .finally(() => {
          this.loader.issuesLoading = false;
        });
    },
    getLocalData() {
      const localData = JSON.parse(
        localStorage.getItem("dkrishna.tools.gitHubIssues")
      );
      if (localData && localData.username && localData.repository) {
        this.username = localData.username;
        this.repository = localData.repository;
        this.searchQuery = localData.searchQuery;
        this.getIssues();
      }
    },
  },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>

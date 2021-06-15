<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Tools</h1>
      </div>
    </div>

    <br />

    <Autocomplete
      placeholder='Filter tools (e.g. "OpenDSS" or "steady state")'
      :data="[]"
    />
    <br />
    <table class="table table-hover align-left" id="toolsTable">
      <thead>
        <tr>
          <th width="160" data-field="name" class="text-start">Name</th>
          <th class="text-start" data-field="description">Description</th>
          <th width="32" class="text-start" data-field="source">Source</th>
          <th width="32" class="text-start" data-field="stars">GitHub Stars</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!toolsLoaded">
          <td class="text-center" colspan="4">
            <img src="/images/loading.svg" alt="" />
          </td>
        </tr>

        <tr v-if="showTools" v-for="tool in toolsQuery" :key="tool.number">
          <td class="text-start">
            <a target="_blank" :href="tool.website">{{ tool.name }}</a>
          </td>
          <td class="text-start">{{ tool.description }}</td>
          <td>
            <a target="_blank" :href="tool.source" v-if="tool.source">
              <img
                :src="tool.source_img"
                alt="Source"
                style="width: 32px; height: 32px"
              />
            </a>
          </td>
          <td class="text-center">{{ tool.github_stars }}</td>
        </tr>

        <tr v-if="noTools">
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
import $ from "jquery";

import { mapState, mapGetters, mapActions } from "vuex";

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
      options: {
        search: true,
        showColumns: true,
      },
      repository: "Tools",
      autocomplete_suggestions: ["OpenDSS"],
      response: {
        status: "",
        message: "",
      },
    };
  },
  computed: {
    showTools() {
      return this.tools.length > 0 && this.toolsLoaded;
    },
    noTools() {
      return this.toolsQuery.length === 0 && this.toolsLoaded;
    },
    ...mapGetters(["tools", "toolsQuery", "toolsLoaded"]),
  },
  methods: {
    reloadPage() {
      this.reset();
      window.location.reload();
    },
    reset() {
      this.repository = "Tools";
      localStorage.removeItem("kdheepak.tools.data");
    },
    resetResponse() {
      this.response.status = "";
      this.response.message = "";
    },
    getTools() {
      this.resetResponse();
      this.fetchTools();
    },
    getLocalData() {
      this.getTools();
    },
    ...mapActions(["fetchTools"]),
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

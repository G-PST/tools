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

    <BootstrapTable :columns="columns" :data="toolsQuery" :options="options">
    </BootstrapTable>
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
        search: false,
        showColumns: true,
        buttonsAlign: "right",
        showPaginationSwitch: true,
        sortable: true,
      },
      repository: "Tools",
      response: {
        status: "",
        message: "",
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          field: "name_url",
          title: "Name",
          align: "left",
          halign: "left",
        },
        {
          field: "description",
          title: "Description",
          align: "left",
          halign: "left",
        },
        {
          field: "source_url",
          title: "Source",
        },
        {
          field: "github_stars",
          title: "Stars",
        },
      ];
    },
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

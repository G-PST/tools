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

    <div id="toolbar">
      <button
        v-on:click="reset"
        id="button"
        class="btn btn-secondary"
        style="margin-left: 10px"
      >
        <i class="fa fa-sync"></i>
      </button>
    </div>
    <BootstrapTable :columns="columns" :data="toolsQuery" :options="options" />

    <br />

    <div class="row" v-if="!toolsLoaded">
      <div class="col">
        <img src="/images/loading.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import axios from "axios";
import Autocomplete from "./Autocomplete.vue";

import { mapState, mapGetters, mapActions } from "vuex";

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
        showExtendedPagination: true,
        pagination: true,
        sortReset: true,
        sortName: "name_url",
        sortOrder: "asc",
        toolbar: "#toolbar",
        toolbarAlign: "right",
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
          field: "state",
          checkbox: true,
        },
        {
          field: "name_url",
          title: "Name",
          align: "left",
          halign: "left",
          sortable: true,
          sortName: "name",
        },
        {
          field: "short_description",
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
          sortable: true,
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
    reset() {
      this.clearTools();
      this.getTools();
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
    ...mapActions(["fetchTools", "clearTools"]),
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

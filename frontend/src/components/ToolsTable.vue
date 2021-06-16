<template>
  <div id="toolbar">
    <button
      v-on:click="reset"
      id="button"
      class="btn btn-secondary"
      style="margin-left: 1em"
    >
      <i class="fa fa-sync"></i>
    </button>
  </div>

  <BootstrapTable :columns="columns" :data="getToolsQuery" :options="options" />

  <br />

  <div class="row" v-if="!getToolsLoaded">
    <div class="col">
      <img src="/images/loading.svg" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import axios from "axios";
import { mapState, mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "ToolsTable",
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
      return this.getTools.length > 0 && this.getToolsLoaded;
    },
    noTools() {
      return this.getToolsQuery.length === 0 && this.getToolsLoaded;
    },
    ...mapGetters("tools", ["getTools", "getToolsQuery", "getToolsLoaded"]),
  },
  mounted() {
    this.getLocalData();
  },
  methods: {
    reset() {
      this.clearTools();
      this.getLocalData();
    },
    resetResponse() {
      this.response.status = "";
      this.response.message = "";
    },
    getLocalData() {
      this.resetResponse();
      this.fetchTools();
    },
    ...mapActions("tools", ["fetchTools", "clearTools"]),
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

<template>
  <div class="row text-center" v-if="noTools">
    <div class="col">
      <p>
        <i
          >Is your tool not listed? Click
          <a
            href="https://github.com/kdheepak/tools/issues/new?template=tools.yml"
            >here</a
          >
          to submit it.</i
        >
      </p>
    </div>
  </div>

  <div id="toolbar">
    <button
      class="btn btn-secondary"
      title="Spacial Temporal Visualization"
      style="margin-left: 1em"
      v-on:click="visualizeSpaceTime"
    >
      <i class="fa fa-chart-bar"></i>
    </button>
    <button
      class="btn btn-secondary"
      title="Sunburst of Languages"
      style="margin-left: 1em"
      v-on:click="visualizeSunburst"
    >
      <i class="fa fa-chart-bar"></i>
    </button>
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

  <div class="row text-center" v-if="!getToolsLoaded">
    <div class="col">
      <p v-if="getToolsNotResponding">
        Hmm. It usually doesn't take this long. Contact the developers to find
        out what's up.
      </p>
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
        buttonsAlign: "left",
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
      getToolsNotResponding: false,
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
          field: "website_url",
          title: "Website",
          align: "center",
        },
        {
          field: "source_url",
          title: "Source",
          align: "center",
        },
        {
          field: "github_stars",
          title: "Stars",
          sortable: true,
          align: "center",
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
  created() {
    this.getLocalData();
  },
  methods: {
    visualizeSpaceTime() {
      this.$router.push("/Viz/SpaceTime");
    },
    visualizeSunburst() {
      this.$router.push("/Viz/Sunburst");
    },
    reset() {
      this.clearTools();
      this.getLocalData(true);
    },
    resetResponse() {
      this.response.status = "";
      this.response.message = "";
    },
    getLocalData(reset) {
      this.getToolsNotResponding = false;
      this.resetResponse();
      if (this.getToolsQuery.length === 0 || reset) {
        this.fetchTools();
      }
      setTimeout(() => (this.getToolsNotResponding = true), 15000);
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

<template>
  <div class="container">
    <div v-if="getToolsLoaded">
      <h2 class="text-center">{{ issue.name }}</h2>
      <br />
      <div v-html="issue.body_html" class="text-start"></div>
      <br />
      <a href="javascript:history.go(-1)" class="mx-2 btn btn-secondary"
        >Back</a
      >
      <a
        v-if="issue.number"
        :href="issue.issue_url"
        target="_blank"
        class="btn btn-primary"
        >Go to GitHub Issue</a
      >
    </div>
    <div class="row text-center" v-if="!getToolsLoaded">
      <div class="col">
        <p v-if="getToolsNotResponding">
          Hmm. It usually doesn't take this long. Contact the developers to find
          out what's up.
        </p>
        <img src="/images/loading.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
a.journal-label {
  background-color: #f5f5f5;
  color: black;
  padding: 0.1em 0.2em;
  margin: 0.1em 0.2em;
  text-decoration: none;
  text-transform: uppercase;
  border: 1px solid grey;
  border-radius: 7px;
  font-size: 0.9rem;
}

a.journal-label:hover {
  background-color: #d3d3d3;
}

a.journal-label:active {
  background-color: black;
}
</style>
<script>
import { ref, defineComponent } from "vue";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import showdown from "showdown";

showdown.setOption("simplifiedAutoLink", true);
showdown.setOption("openLinksInNewWindow", true);
showdown.setOption("emoji", true);
showdown.setFlavor("github");

export default defineComponent({
  name: "Tool",
  created() {
    this.getLocalData();
  },
  props: ["query"],
  data() {
    return {
      getToolsNotResponding: false,
      loaded: false,
    };
  },
  computed: {
    issue() {
      const n = this.$route.params.number;
      const query = this.searchQuery
        ? this.searchQuery.split(/[-./\\()"'\s,;<>~!@#$%^&*|+=[\]{}`~?:]/u)
        : [];
      if (n) {
        var tool = this.getTools.find((tool) => {
          return tool.number.toString() === n.toString();
        });
        const converter = new showdown.Converter();
        for (var q of query) {
          tool.issue_body = tool.issue_body.replace(
            new RegExp(q, "ig"),
            (match) => `<mark class="highlight">${match}</mark>`
          );
        }
        tool.body_html = converter.makeHtml(tool.issue_body);
        return tool;
      } else {
        return {
          name: "Not found",
          number: 0,
        };
      }
    },
    ...mapState("tools", ["searchQuery"]),
    ...mapGetters("tools", ["getTools", "getToolsLoaded"]),
  },
  methods: {
    reset() {
      this.clearTools();
      this.getLocalData();
    },
    getLocalData() {
      this.getToolsNotResponding = false;
      this.fetchTools();
      setTimeout(() => (this.getToolsNotResponding = true), 15000);
    },
    ...mapActions("tools", ["fetchTools", "clearTools"]),
  },
});
</script>

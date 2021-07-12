<template>
  <div class="container">
    <div class="row text-center">
      <div class="col">
        <h1>Visualization</h1>
      </div>
    </div>

    <br />

    <Autocomplete
      placeholder='Filter tools (e.g. "OpenDSS" or "steady state")'
      :data="[]"
    />

    <br />

    <LanguageCheckBox />

    <br />
    <div class="row text-center">
      <div class="col">
        <div class="form-check form-check-inline" v-if="getToolsLoaded">
          <input class="form-check-input" type="checkbox" v-model="allTools" />
          <label class="form-check-label">
            <a class="all-tool-label" target="_blank"> All </a>
          </label>
        </div>
        <div
          class="form-check form-check-inline"
          v-if="getToolsLoaded"
          v-for="tool in getTools"
          :key="tool"
        >
          <input
            class="form-check-input"
            type="checkbox"
            :id="tool"
            :value="tool.name"
            v-model="selectedTools"
          />
          <label class="form-check-label" :for="tool">
            <a class="tool-label" target="_blank">
              {{ tool.name }}
            </a>
          </label>
        </div>
      </div>
    </div>

    <br />

    <div id="chart" class="col" />
  </div>
</template>

<script lang="ts">
import * as d3 from "d3";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import Autocomplete from "./Autocomplete.vue";
import LanguageCheckBox from "./LanguageCheckBox.vue";

export default {
  name: "Sunburst",
  components: {
    Autocomplete,
    LanguageCheckBox,
  },
  props: {
    data: {},
  },
  watch: {
    selection1: {
      handler() {
        this.updatePlot();
      },
    },
    selection2: {
      handler() {
        this.updatePlot();
      },
    },
    getTools: {
      handler() {
        this.selectedTools = this.getTools.map((d) => d.name);
      },
    },
    getToolsQuery: {
      handler() {
        this.updatePlot();
      },
    },
    selectedTools: {
      handler() {
        this.updatePlot();
      },
    },
  },
  data() {
    return {
      width: window.innerWidth * 0.5,
      height: window.innerHeight * 0.5,
      margin: {
        top: 75,
        right: 75,
        left: 75,
        bottom: 75,
      },
    };
  },
  computed: {
    allTools: {
      get() {
        return this.getTools.length == this.selectedTools.length;
      },
      set(value) {
        if (value) {
          this.setSelectedTools(this.getTools.map((d) => d.name));
        } else {
          this.setSelectedTools([]);
        }
      },
    },
    selectedTools: {
      get() {
        return this.$store.state.tools.selectedTools;
      },
      set(value) {
        this.setSelectedTools(value);
      },
    },
    ...mapGetters("tools", ["getTools", "getToolsQuery", "getToolsLoaded"]),
  },

  created() {
    this.getLocalData();
  },

  mounted() {
    this.generatePlot();
    this.updatePlot();
  },

  methods: {
    reset() {
      this.clearTools();
      this.getLocalData();
    },
    getLocalData() {
      if (this.getToolsQuery.length === 0) {
        this.fetchTools();
      }
    },
    updatePlot() {
      if (!this.svg) {
        return;
      }
      var data = this.getTools;
    },
    generatePlot() {},
    ...mapActions("tools", ["fetchTools", "clearTools"]),
    ...mapMutations("tools", ["setSelectedTools"]),
  },
};
</script>

<css>
.selected {
  font-weight: bold;
}

.link {
  stroke: #000;
  stroke-width: 1.5px;
}

.node {
  display: none;
  fill: #ccc;
  stroke: #000;
  stroke-width: 1.5px;
}

.node.hidden {
  fill: red;
}

.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* aspect ratio */
  vertical-align: top;
  overflow: hidden;
}
.svg-content-responsive {
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 0;
}
</css>

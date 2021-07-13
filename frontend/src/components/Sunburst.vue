<template>
  <div class="container">
    <div class="row text-center">
      <div class="col">
        <h1>Sunburst Visualization</h1>
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
    ...mapGetters("tools", [
      "getTools",
      "getToolsQuery",
      "getToolsLoaded",
      "getLanguages",
    ]),
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
      let data = { name: "Flare", children: [] };
      for (var language of this.getLanguages) {
        let children = this.getToolsQuery
          .filter((tool) => tool.language.includes(language))
          .filter((tool) => this.selectedTools.includes(tool.name))
          .map((tool) => ({ name: tool.name, value: 1 }));
        data.children.push({ name: language, children: children });
      }

      let partition = (data) => {
        const root = d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value);
        return d3.partition().size([2 * Math.PI, root.height + 1])(root);
      };
      let color = d3.scaleOrdinal(
        d3.quantize(d3.interpolateRainbow, data.children.length + 1)
      );
      let format = d3.format(",d");
      let radius = this.width / 8;
      let arc = d3
        .arc()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius((d) => d.y0 * radius)
        .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

      const root = partition(data);

      root.each((d) => (d.current = d));

      const path = this.path
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", (d) => {
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .attr("fill-opacity", (d) =>
          arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr("d", (d) => arc(d.current));

      path
        .filter((d) => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

      path.append("title").text(
        (d) =>
          `${d
            .ancestors()
            .map((d) => d.data.name)
            .reverse()
            .join("/")}\n${format(d.value)}`
      );

      const label = this.text
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", (d) => +labelVisible(d.current))
        .attr("transform", (d) => labelTransform(d.current))
        .text((d) => d.data.name);

      const parent = this.parent
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

      let that = this;

      function clicked(event, p) {
        parent.datum(p.parent || root);

        root.each(
          (d) =>
            (d.target = {
              x0:
                Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              x1:
                Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              y0: Math.max(0, d.y0 - p.depth),
              y1: Math.max(0, d.y1 - p.depth),
            })
        );

        const t = that.svg.transition().duration(750);

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path
          .transition(t)
          .tween("data", (d) => {
            const i = d3.interpolate(d.current, d.target);
            return (t) => (d.current = i(t));
          })
          .filter(function (d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
          })
          .attr("fill-opacity", (d) =>
            arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
          )
          .attrTween("d", (d) => () => arc(d.current));

        label
          .filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
          })
          .transition(t)
          .attr("fill-opacity", (d) => +labelVisible(d.target))
          .attrTween("transform", (d) => () => labelTransform(d.current));
      }

      function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }

      function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }

      function labelTransform(d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = ((d.y0 + d.y1) / 2) * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`;
      }
    },

    generatePlot() {
      const svg = d3
        .select("#chart")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width} ${this.height * 1.5}`)
        .classed("svg-content-responsive", true);

      this.svg = svg
        .append("g")
        .attr(
          "transform",
          `translate(${this.width / 2}, ${this.height / 1.5})`
        );
      this.path = this.svg.append("g");
      this.text = this.svg
        .append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .attr("font-size", 8)
        .attr("font-family", "sans-serif");
      this.parent = this.svg.append("circle");
    },
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

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

    <div class="row">
      <div class="col">
        <select class="form-control" v-model="selection1">
          <option>temporal_resolution</option>
          <option>temporal_scope</option>
        </select>
      </div>
      <div class="col">
        <select class="form-control" v-model="selection2">
          <option>spatial_resolution</option>
          <option>spatial_scope</option>
        </select>
      </div>
    </div>

    <div id="chart" class="col" />
  </div>
</template>

<script lang="ts">
import * as d3 from "d3";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import Autocomplete from "./Autocomplete.vue";
import LanguageCheckBox from "./LanguageCheckBox.vue";

var dedupeLabels = (dedupLabels) => {
  const getOverlapFromTwoExtents = (l, r) => {
    var overlapPadding = 5;
    l.left = l.x - overlapPadding;
    l.right = l.x + l.width + overlapPadding;
    l.top = l.y - overlapPadding;
    l.bottom = l.y + l.height + overlapPadding;
    r.left = r.x - overlapPadding;
    r.right = r.x + r.width + overlapPadding;
    r.top = r.y - overlapPadding;
    r.bottom = r.y + r.height + overlapPadding;
    var a = l;
    var b = r;

    if (
      a.left >= b.right ||
      a.top >= b.bottom ||
      a.right <= b.left ||
      a.bottom <= b.top
    ) {
      return false;
    } else {
      return true;
    }
  };

  var move = 1;
  while (move > 0) {
    move = 0;
    dedupLabels.each(function (d, i) {
      // Get bounding box
      var thisBBox = this.getBBox();
      var that = this;

      dedupLabels.each(function (d) {
        var underBBox = this.getBBox();
        // If not overlapping with a subsequent item, and isn't meant to be shown always, hide it
        if (getOverlapFromTwoExtents(thisBBox, underBBox)) {
          var dx =
              (Math.max(0, thisBBox.right - underBBox.left) +
                Math.min(0, thisBBox.left - underBBox.right)) *
              0.01,
            dy =
              (Math.max(0, thisBBox.bottom - underBBox.top) +
                Math.min(0, thisBBox.top - underBBox.bottom)) *
              0.02,
            delta = 0;
          move += Math.abs(dx) + Math.abs(dy);
          d3.select(this).attr("x", (d) => {
            d.label_x -= dx;
            return d.label_x + delta;
          });
          d3.select(this).attr("y", (d) => {
            d.label_y -= dy;
            return d.label_y + delta;
          });
          d3.select(that).attr("x", (d) => {
            d.label_x += dx;
            return d.label_x - delta;
          });
          d3.select(that).attr("y", (d) => {
            d.label_y += dy;
            return d.label_y - delta;
          });
        }
      });
    });
  }
};

export default {
  name: "TemporalSpacialPlot",
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
      selection1: "temporal_resolution",
      selection2: "spatial_resolution",
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
      var myColor = d3.scaleOrdinal().domain(data).range(d3.schemeSet3);

      var data = this.getToolsQuery
        .filter((d) => {
          return this.selectedTools.includes(d.name);
        })
        .map((d) => {
          d.x_min = this.x(d["highest_" + this.selection1]);
          d.x_max = this.x(d["lowest_" + this.selection1]);
          d.y_min = this.y(d["highest_" + this.selection2]);
          d.y_max = this.y(d["lowest_" + this.selection2]);
          d.w = Math.abs(d.x_min - d.x_max);
          d.h = Math.abs(d.y_min - d.y_max);
          d.label_x = d.x_min + Math.abs(d.x_min - d.x_max) / 2;
          d.label_y = d.y_min + Math.abs(d.y_min - d.y_max) / 2;
          d.original_label_x = d.label_x;
          d.original_label_y = d.label_y;
          return d;
        });

      let rects = this.rects.selectAll("rect").data(data, (d) => d.name);
      const that = this;
      rects
        .join("rect")
        .attr("x", (d) => d.x_min)
        .attr("y", (d) => d.y_min)
        .attr("width", (d) => d.w)
        .attr("height", (d) => d.h)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("opacity", 0.5)
        .attr("fill", function (d) {
          return myColor(d);
        })
        .on("mouseover", function (d, i) {
          d3.select(this).attr("stroke-width", 3);
          d3.selectAll(".dedup").classed("selected", function (e, j) {
            return i.name == e.name;
          });
        })
        .on("mouseout", function (d, i) {
          d3.select(this).attr("stroke-width", 1);
          d3.selectAll(".dedup").classed("selected", false);
        })
        .on("click", function (e, d) {
          that.$router.push(`/Tool/${d.number}`);
          e.stopPropagation();
        });

      const labels = this.labels.selectAll("text").data(data, (d) => d.name);
      labels
        .join("text")
        .attr("x", (d) => d.label_x)
        .attr("y", (d) => d.label_y)
        .attr("class", "dedup")
        .attr("text-anchor", "middle")
        .text((d) => d.name);

      dedupeLabels(d3.selectAll(".dedup"));

      const graph = { nodes: [], links: [] };

      data.map((d, i) => {
        graph.nodes.push({
          i: i * 2,
          x: d.label_x,
          y: d.label_y,
          name: d.name,
        });
        graph.nodes.push({
          i: i * 2 + 1,
          x: d.original_label_x,
          y: d.original_label_y,
          name: null,
        });
        graph.links.push({
          source: { x: d.label_x, y: d.label_y },
          target: { x: d.original_label_x, y: d.original_label_y },
        });
        return graph;
      });

      const link = this.svg
        .selectAll(".link")
        .data(graph.links)
        .join("line")
        .classed("link", true)
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
    },
    generatePlot() {
      const svg = d3
        .select("#chart")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width * 1.5} ${this.height * 1.25}`)
        .classed("svg-content-responsive", true);

      this.svg = svg
        .append("g")
        .style(
          "transform",
          `translate(${this.margin.left}px, ${this.margin.top}px)`
        );
      this.rects = this.svg.append("g");
      this.labels = this.svg.append("g");

      this.x = d3
        .scalePoint()
        .domain([
          "",
          "instant",
          "milliseconds",
          "seconds",
          "minutes",
          "hours",
          "days",
          "months",
          "years",
          "decades",
        ])
        .range([0, this.width]);

      this.y = d3
        .scalePoint()
        .domain([
          "",
          "component",
          "device",
          "facility",
          "municipality",
          "county",
          "state",
          "region",
          "country",
          "continent",
          "global",
        ])
        .range([0, this.height]);

      this.x_axis_g = svg
        .append("g")
        .style(
          "transform",
          `translate(${this.margin.left}px, ${this.margin.top}px)`
        );
      this.xAxis = d3.axisBottom(this.x);
      this.x_axis_g.call(this.xAxis);

      this.y_axis_g = svg
        .append("g")
        .style(
          "transform",
          `translate(${this.margin.left}px, ${this.margin.top}px)`
        );
      this.yAxis = d3.axisLeft(this.y);
      this.y_axis_g.call(this.yAxis);

      var zoomed = (event) => {
        this.x.range([0, this.width].map((d) => event.transform.applyX(d)));
        this.x_axis_g.call(this.xAxis);

        this.y.range([0, this.height].map((d) => event.transform.applyY(d)));
        this.y_axis_g.call(this.yAxis);

        this.svg.selectAll("line").attr("transform", event.transform);
        this.svg.selectAll("path").attr("transform", event.transform);
        this.svg.selectAll("rect").attr("transform", event.transform);
        this.svg.selectAll("circle").attr("transform", event.transform);
        this.svg.selectAll("text").attr("transform", event.transform);
      };

      var zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

      svg.call(zoom);
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

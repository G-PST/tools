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

    <div class="row text-center" />
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
    var overlapPadding = 10;
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

  dedupLabels.each(function (d, i) {
    // Get bounding box
    var thisBBox = this.getBBox();
    var that = this;

    dedupLabels
      .filter((k, j) => j > i)
      .each(function (d) {
        var underBBox = this.getBBox();
        // If not overlapping with a subsequent item, and isn't meant to be shown always, hide it
        if (getOverlapFromTwoExtents(thisBBox, underBBox)) {
          var dx =
              (Math.max(0, thisBBox.right - underBBox.left) +
                Math.min(0, thisBBox.left - underBBox.right)) *
              0.01,
            dy =
              (Math.max(0, thisBBox.bottom - underBBox.top) +
                Math.min(0, thisBBox.top - b.bottom)) *
              0.02;
          d3.select(this).attr("x", (d) => {
            d.label_x += dx;
            return d.label_x;
          });
          d3.select(this).attr("y", (d) => {
            d.label_y += dy;
            return d.label_y + delta;
          });
          d3.select(that).attr("x", (d) => {
            d.label_x -= dx;
            return d.label_x - delta;
          });
          d3.select(that).attr("y", (d) => {
            d.label_y -= dy;
            return d.label_y - delta;
          });
        }
      });
  });
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
    getToolsQuery: {
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
      var data = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
      var myColor = d3.scaleOrdinal().domain(data).range(d3.schemeSet3);

      var data = this.getToolsQuery
        .filter(
          (d) =>
            d.lowest_temporal_resolution &&
            d.highest_temporal_resolution &&
            d.lowest_spatial_resolution &&
            d.highest_spatial_resolution
        )
        .filter(
          (d) =>
            d.lowest_temporal_resolution !== d.highest_temporal_resolution &&
            d.lowest_spatial_resolution !== d.highest_spatial_resolution
        )
        .map((d) => {
          d.x_min = this.x(d.highest_temporal_resolution);
          d.x_max = this.x(d.lowest_temporal_resolution);
          d.y_min = this.y(d.highest_spatial_resolution);
          d.y_max = this.y(d.lowest_spatial_resolution);
          d.w = Math.abs(d.x_min - d.x_max);
          d.h = Math.abs(d.y_min - d.y_max);
          d.label_x = d.x_min + Math.abs(d.x_min - d.x_max) / 2;
          d.label_y = d.y_min + Math.abs(d.y_min - d.y_max) / 2;
          d.original_label_x = d.label_x;
          d.original_label_y = d.label_y;
          return d;
        });

      let rects = this.svg.selectAll("rect").data(data, (d) => d.name);

      rects
        .join("rect")
        .attr("x", (d) => d.x_min)
        .attr("y", (d) => d.y_min)
        .attr("width", (d) => d.w)
        .attr("height", (d) => d.h)
        .attr("stroke", "black")
        .attr("fill", function (d) {
          return myColor(d);
        });

      /* const labels = this.svg.selectAll("text").data(data, (d) => d.name); */
      /* labels.join("text") */
      /*   .attr("x", d => d.label_x) */
      /*   .attr("y", d => d.label_y) */
      /*   .attr("class", "dedup") */
      /*   .text(d => d.name); */

      this.svg.selectAll(".label").html(null).remove();
      this.svg.selectAll(".node").html(null).remove();
      this.svg.selectAll(".link").html(null).remove();

      var graph = { nodes: [], links: [] };

      data.map((d, i) => {
        graph.nodes.push({ x: d.label_x, y: d.label_y, name: d.name });
        graph.nodes.push({ fx: d.label_x, fy: d.label_y, name: null });
        graph.links.push({ source: 2 * i, target: 2 * i + 1 });
        return graph;
      });

      const simulation = d3
        .forceSimulation()
        .nodes(graph.nodes)
        .force("center", d3.forceCollide(50))
        .force("link", d3.forceLink(graph.links))
        .on("tick", tick);

      const link = this.svg
        .selectAll(".link")
        .data(graph.links)
        .join("line")
        .classed("link", true);

      const node = this.svg
        .selectAll(".node")
        .data(graph.nodes)
        .join("circle")
        .attr("r", 6)
        .classed("node", (d) => d.fx === undefined)
        .classed("hidden", (d) => d.fx === undefined);

      const labels = this.svg
        .selectAll(".label")
        .data(graph.nodes.filter((d) => d.name))
        .join("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("text-anchor", "middle")
        .text((d) => d.name);

      function tick() {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
      }
    },
    generatePlot() {
      const svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", this.width * 1.5)
        .attr("height", this.height * 1.5);

      this.svg = svg
        .append("g")
        .style(
          "transform",
          `translate(${this.margin.left}px, ${this.margin.top}px)`
        );

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

      const extent = [
        [0, 0],
        [this.width, this.height],
      ];

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

      var zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed);

      svg.call(zoom);
    },
    ...mapActions("tools", ["fetchTools", "clearTools"]),
  },
};
</script>

<css>
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
</css>

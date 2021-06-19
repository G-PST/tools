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

var dedupeLabels = (allDedupeLabels) => {
  // allDedupeLabels should contain all the objects you want to consider for de-duping
  // ex. dedupeLabels(d3.selectAll('.dedupe')
  // Use class "dedupe" when generating each object. Then add "dedupe-always-show" to things you want to show regardless (like important labels)

  // A function to check whether two bounding boxes overlap
  const getOverlapFromTwoExtents = (l, r) => {
    var overlapPadding = 0;
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

  // Cycle through dedupables and dedupe them
  allDedupeLabels.each(function (d, i) {
    // Get bounding box
    var thisBBox = this.getBBox();

    // Iterate through each box to see if it overlaps with any following
    // If they do, hide them
    // And only get labels later in the order than this one
    allDedupeLabels
      .filter((k, j) => j > i)
      .each(function (d) {
        var underBBox = this.getBBox();
        // If not overlapping with a subsequent item, and isn't meant to be shown always, hide it
        if (
          getOverlapFromTwoExtents(thisBBox, underBBox) &&
          d3.select(this).attr("class").match("dedupe-always-show") == null
        ) {
          d3.select(this).style("opacity", 0.25);
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
      deep: true,
      handler() {
        console.log(this.getToolsQuery);
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

      let rects = this.svg
        .selectAll("rect")
        .data(this.getToolsQuery, (d) => d.name);

      rects.join(
        (enter) => {
          enter
            .filter(function (d) {
              console.log(
                d.name,
                d.lowest_temporal_resolution,
                d.highest_temporal_resolution,
                d.lowest_spatial_resolution,
                d.highest_spatial_resolution
              );
              return (
                d.lowest_temporal_resolution &&
                d.highest_temporal_resolution &&
                d.lowest_spatial_resolution &&
                d.highest_spatial_resolution
              );
            })
            .filter(function (d) {
              return (
                d.lowest_temporal_resolution !==
                  d.highest_temporal_resolution &&
                d.lowest_spatial_resolution !== d.highest_spatial_resolution
              );
            })
            .append("rect")
            .attr("x", (d) => this.x(d.highest_temporal_resolution))
            .attr("y", (d) => this.y(d.highest_spatial_resolution))
            .attr("width", (d) =>
              Math.abs(
                this.x(d.highest_temporal_resolution) -
                  this.x(d.lowest_temporal_resolution)
              )
            )
            .attr("height", (d) =>
              Math.abs(
                this.y(d.lowest_spatial_resolution) -
                  this.y(d.highest_spatial_resolution)
              )
            )
            .attr("stroke", "black")
            .attr("opacity", "0.25")
            .attr("fill", function (d) {
              return myColor(d);
            });
        },
        (update) => {
          update
            .filter(function (d) {
              return (
                d.lowest_temporal_resolution &&
                d.highest_temporal_resolution &&
                d.lowest_spatial_resolution &&
                d.highest_spatial_resolution
              );
            })
            .filter(function (d) {
              return (
                d.lowest_temporal_resolution !==
                  d.highest_temporal_resolution &&
                d.lowest_spatial_resolution !== d.highest_spatial_resolution
              );
            })
            .attr("x", (d) => this.x(d.highest_temporal_resolution))
            .attr("y", (d) => this.y(d.highest_spatial_resolution))
            .attr("width", (d) =>
              Math.abs(
                this.x(d.highest_temporal_resolution) -
                  this.x(d.lowest_temporal_resolution)
              )
            )
            .attr("height", (d) =>
              Math.abs(
                this.y(d.lowest_spatial_resolution) -
                  this.y(d.highest_spatial_resolution)
              )
            );
        },
        (exit) => {
          exit.remove();
        }
      );
      let texts = this.svg
        .selectAll("text")
        .data(this.getToolsQuery, (d) => d.name);

      var label_array = [];
      var anchor_array = [];
      var nsweeps = 200;
      var index = 0;

      texts.join(
        (enter) => {
          enter
            .filter(function (d) {
              return (
                d.lowest_temporal_resolution &&
                d.highest_temporal_resolution &&
                d.lowest_spatial_resolution &&
                d.highest_spatial_resolution
              );
            })
            .filter(function (d) {
              return (
                d.lowest_temporal_resolution !==
                  d.highest_temporal_resolution &&
                d.lowest_spatial_resolution !== d.highest_spatial_resolution
              );
            })
            .append("text")
            .attr("class", "dedupe")
            .attr("x", (d) => this.x(d.highest_temporal_resolution))
            .attr("y", (d) => this.y(d.highest_spatial_resolution))
            .attr(
              "dx",
              (d) =>
                Math.abs(
                  this.x(d.highest_temporal_resolution) -
                    this.x(d.lowest_temporal_resolution)
                ) / 2
            )
            .attr(
              "dy",
              (d) =>
                Math.abs(
                  this.y(d.lowest_spatial_resolution) -
                    this.y(d.highest_spatial_resolution)
                ) / 2
            )
            .attr("text-anchor", "middle")
            .style("opacity", 1)
            .style("font-weight", "bold")
            .text((d) => d.name)
            .each((datum, index, elements) => {
              const boundingBox = (elements[index] as any).getBBox();
              datum.bbox_width = boundingBox.width;
              datum.bbox_height = boundingBox.height;
            });
          dedupeLabels(d3.selectAll(".dedupe"));
        },
        (update) => {
          update
            .filter(function (d) {
              return (
                d.lowest_temporal_resolution &&
                d.highest_temporal_resolution &&
                d.lowest_spatial_resolution &&
                d.highest_spatial_resolution
              );
            })
            .filter(function (d) {
              return (
                d.lowest_temporal_resolution !==
                  d.highest_temporal_resolution &&
                d.lowest_spatial_resolution !== d.highest_spatial_resolution
              );
            })
            .style("opacity", 1)
            .attr("x", (d) => this.x(d.highest_temporal_resolution))
            .attr("y", (d) => this.y(d.highest_spatial_resolution))
            .attr(
              "dx",
              (d) =>
                Math.abs(
                  this.x(d.highest_temporal_resolution) -
                    this.x(d.lowest_temporal_resolution)
                ) / 2
            )
            .attr(
              "dy",
              (d) =>
                Math.abs(
                  this.y(d.lowest_spatial_resolution) -
                    this.y(d.highest_spatial_resolution)
                ) / 2
            );
          dedupeLabels(d3.selectAll(".dedupe"));
        },
        (exit) => {
          exit.remove();
        }
      );
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

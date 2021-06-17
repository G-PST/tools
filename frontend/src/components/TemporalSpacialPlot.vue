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
      this.fetchTools();
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
            .attr("x", (d) =>
              this.x(d.highest_temporal_resolution.toLowerCase())
            )
            .attr("y", (d) =>
              this.y(d.highest_spatial_resolution.toLowerCase())
            )
            .attr("width", (d) =>
              Math.abs(
                this.x(d.highest_temporal_resolution.toLowerCase()) -
                  this.x(d.lowest_temporal_resolution.toLowerCase())
              )
            )
            .attr("height", (d) =>
              Math.abs(
                this.y(d.lowest_spatial_resolution.toLowerCase()) -
                  this.y(d.highest_spatial_resolution.toLowerCase())
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
            .attr("x", (d) =>
              this.x(d.highest_temporal_resolution.toLowerCase())
            )
            .attr("y", (d) =>
              this.y(d.highest_spatial_resolution.toLowerCase())
            )
            .attr("width", (d) =>
              Math.abs(
                this.x(d.highest_temporal_resolution.toLowerCase()) -
                  this.x(d.lowest_temporal_resolution.toLowerCase())
              )
            )
            .attr("height", (d) =>
              Math.abs(
                this.y(d.lowest_spatial_resolution.toLowerCase()) -
                  this.y(d.highest_spatial_resolution.toLowerCase())
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
            .attr("x", (d) =>
              this.x(d.highest_temporal_resolution.toLowerCase())
            )
            .attr("y", (d) =>
              this.y(d.highest_spatial_resolution.toLowerCase())
            )
            .attr(
              "dx",
              (d) =>
                Math.abs(
                  this.x(d.highest_temporal_resolution.toLowerCase()) -
                    this.x(d.lowest_temporal_resolution.toLowerCase())
                ) / 2
            )
            .attr(
              "dy",
              (d) =>
                Math.abs(
                  this.y(d.lowest_spatial_resolution.toLowerCase()) -
                    this.y(d.highest_spatial_resolution.toLowerCase())
                ) / 2
            )
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .text((d) => d.name);
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
            .attr("x", (d) =>
              this.x(d.highest_temporal_resolution.toLowerCase())
            )
            .attr("y", (d) =>
              this.y(d.highest_spatial_resolution.toLowerCase())
            )
            .attr(
              "dx",
              (d) =>
                Math.abs(
                  this.x(d.highest_temporal_resolution.toLowerCase()) -
                    this.x(d.lowest_temporal_resolution.toLowerCase())
                ) / 2
            )
            .attr(
              "dy",
              (d) =>
                Math.abs(
                  this.y(d.lowest_spatial_resolution.toLowerCase()) -
                    this.y(d.highest_spatial_resolution.toLowerCase())
                ) / 2
            );
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

      var zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
          this.svg.selectAll("line").attr("transform", event.transform);
          this.svg.selectAll("path").attr("transform", event.transform);
          this.svg.selectAll("rect").attr("transform", event.transform);
          this.svg.selectAll("circle").attr("transform", event.transform);
          this.svg.selectAll("text").attr("transform", event.transform);
        });

      svg.call(zoom);

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
    },
    ...mapActions("tools", ["fetchTools", "clearTools"]),
  },
};
</script>

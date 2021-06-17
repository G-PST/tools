<template>
  <div id="chart" />
</template>

<script lang="ts">
import * as d3 from "d3";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "TemporalSpacialPlot",

  props: {
    data: {},
  },

  data() {
    return {
      width: 1000,
      height: 800,
      margin: {
        top: 50,
        right: 50,
        left: 50,
        bottom: 50,
      },
    };
  },

  computed: {
    ...mapGetters("tools", ["getTools", "getToolsQuery", "getToolsLoaded"]),
  },

  mounted() {
    this.getLocalData();
    this.generatePlot();
  },

  methods: {
    reset() {
      this.clearTools();
      this.getLocalData();
    },
    getLocalData() {
      this.fetchTools();
    },
    generatePlot() {
      const svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .style(
          "transform",
          `translate(${this.margin.left}px, ${this.margin.top}px)`
        );

      var x = d3
        .scalePoint()
        .domain([
          "",
          "instant",
          "milliseconds",
          "seconds",
          "minutes",
          "hours",
          "days",
          "years",
          "decades",
        ])
        .range([0, this.width]);

      var y = d3
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

      svg
        .append("g")
        .attr("transform", `translate(0,${this.height * 0.8})`)
        .call(d3.axisBottom(x));

      svg
        .append("g")
        .attr("transform", `translate(0,-${this.height * 0.2})`)
        .call(d3.axisLeft(y));

      let rects = svg.selectAll("rect").data(this.getTools).enter();
      rects
        .append("rect")
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
        .attr("x", (d) => {
          console.log(x(d.lowest_temporal_resolution));
          return x(d.lowest_temporal_resolution.toLowerCase());
        })
        .attr("y", (d) => y(d.lowest_spatial_resolution.toLowerCase()))
        .attr("width", (d) =>
          Math.abs(
            x(d.lowest_temporal_resolution.toLowerCase()) -
              x(d.highest_temporal_resolution.toLowerCase())
          )
        )
        .attr("height", (d) =>
          Math.abs(
            y(d.lowest_spatial_resolution.toLowerCase()) -
              y(d.highest_spatial_resolution.toLowerCase())
          )
        )
        .attr("stroke", "black")
        .attr("fill", "#69a3b2");
    },
    ...mapActions("tools", ["fetchTools", "clearTools"]),
  },
};
</script>

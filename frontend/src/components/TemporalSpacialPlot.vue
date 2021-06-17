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

    <div id="chart" />
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
        .attr("width", this.width * 1.5)
        .attr("height", this.height * 1.5)
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
          "months",
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
        .range([this.height, 0]);

      let rects = svg.selectAll("rect").data(this.getToolsQuery).enter();
      rects
        .append("rect")
        .filter(function (d) {
          console.log(
            d.name,
            d.lowest_temporal_resolution,
            d.highest_temporal_resolution,
            d.lowest_spatial_resolution,
            d.highest_spatial_resolution,
            x(d.lowest_temporal_resolution.toLowerCase()),
            x(d.highest_temporal_resolution.toLowerCase()),
            y(d.lowest_spatial_resolution.toLowerCase()),
            y(d.highest_spatial_resolution.toLowerCase())
          );
          return (
            d.lowest_temporal_resolution &&
            d.highest_temporal_resolution &&
            d.lowest_spatial_resolution &&
            d.highest_spatial_resolution
          );
        })
        .attr("x", (d) => x(d.highest_temporal_resolution.toLowerCase()))
        .attr("y", (d) => y(d.highest_spatial_resolution.toLowerCase()))
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

      let texts = svg.selectAll("text").data(this.getToolsQuery).enter();
      texts
        .append("text")
        .filter(function (d) {
          return (
            d.lowest_temporal_resolution &&
            d.highest_temporal_resolution &&
            d.lowest_spatial_resolution &&
            d.highest_spatial_resolution
          );
        })
        .attr("x", (d) => x(d.highest_temporal_resolution.toLowerCase()))
        .attr("y", (d) => y(d.highest_spatial_resolution.toLowerCase()))
        .attr("dx", -10)
        .attr("dy", ".42em")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text((d) => d.name);

      svg
        .append("g")
        .attr("transform", `translate(0,${this.height * 0.85})`)
        .call(d3.axisBottom(x));

      svg
        .append("g")
        .attr("transform", `translate(0,-${this.height * 0.15})`)
        .call(d3.axisLeft(y));
    },
    ...mapActions("tools", ["fetchTools", "clearTools"]),
  },
};
</script>

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
      width: 750,
      height: 400,
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
      let rects = svg.selectAll("rect").data(this.getTools).enter();
      rects
        .append("rect")
        .attr("x", (d) => d.number * 5)
        .attr("y", (d) => d.id * 5)
        .attr("width", 60)
        .attr("height", 40)
        .attr("stroke", "black")
        .attr("fill", "#69a3b2");
    },
    ...mapActions("tools", ["fetchTools", "clearTools"]),
  },
};
</script>

<template>
  <div id="chart" />
</template>

<script lang="ts">
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
};
</script>

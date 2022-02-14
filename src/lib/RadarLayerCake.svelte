<script lang="ts">
  import { onMount } from 'svelte'
  import { LayerCake, Svg, Html, Canvas } from 'layercake'
  import * as d3 from 'd3'
  import { filteredTools, searchQuery, loading, updateTools } from '$lib/stores'
  import Icon from 'svelte-awesome/components/Icon.svelte'
  import { faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons'

  import Radar from '$lib/components/Radar.svelte'
  import AxisRadial from '$lib/components/AxisRadial.svelte'

  let svg
  let path
  let text
  let parent
  let width
  let height

  const xKey = [...new Set($filteredTools.flatMap((tool) => tool.language))]

  let data = [{}]
  $: {
    let languageCount = {}
    for (const k of xKey) {
      languageCount[k] = 0
    }
    for (const l of $filteredTools.flatMap((tool) => tool.language)) {
      languageCount[l] += 1
    }
    data = [languageCount]
  }
  $: isEmpty = Object.values(data[0]).every((item) => item === 0)

  onMount(() => {
    const container = d3
      .select('#sunburst-chart')
      .append('div')
      .classed('svg-container', true)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height * 1.5}`)
      .classed('svg-content-responsive', true)
    svg = container
      .append('g')
      .attr('transform-origin', '50% 50%')
      .attr('transform', `rotate(90) translate(${width / 2}, ${height / 1.25})`)
    path = svg.append('g')
    text = svg
      .append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .attr('font-size', 10)
      .attr('font-family', 'sans-serif')
    parent = svg.append('circle')
  })
</script>

{#if $loading}
  <div class="grid-flow-row w-full items-stretch">
    <div
      class="bg-yellow-100 rounded-lg py-5 px-6 mb-3 text-base text-yellow-700 inline-flex items-center w-full"
      role="alert"
    >
      <Icon class="w-4 h-4 mr-2 fill-current" data={faSpinner} spin />
      Loading...
    </div>
  </div>
{:else if isEmpty}
  <div class="grid-flow-row w-full items-stretch">
    <div
      class="bg-yellow-100 rounded-lg py-5 px-6 mb-3 text-base text-yellow-700 inline-flex items-center w-full"
      role="alert"
    >
      <Icon class="w-4 h-4 mr-2 fill-current" data={faExclamationTriangle} />
      No tools found matching filter `{$searchQuery}`.
    </div>
  </div>
{:else}
  <div class="chart-container">
    <LayerCake
      padding={{ top: 30, right: 0, bottom: 7, left: 0 }}
      x={xKey}
      xDomain={[0, 10]}
      xRange={({ height }) => [0, height / 2]}
      {data}
    >
      <Svg>
        <AxisRadial />
        <Radar />
      </Svg>
    </LayerCake>
  </div>
{/if}

<style>
  /*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
  .chart-container {
    width: 50vh;
    height: 50vh;
  }
</style>

<script lang="ts">
  import Autocomplete from '$lib/Autocomplete.svelte'
  import LanguageChipBox from '$lib/LanguageChipBox.svelte'
  import ToolChipBox from '$lib/ToolChipBox.svelte'
  import { LayerCake, Svg } from 'layercake'
  import SpatialTemporalLayer from '$lib/SpatialTemporalLayer.svelte'
  import { onMount } from 'svelte'
  import {
    filteredTools,
    tools,
    searchQuery,
    loading,
    updateTools,
    languages,
    selectedLanguages,
  } from '$lib/stores'
  import { getContext } from 'svelte'

  import * as d3 from 'd3'

  function getData(ftools) {
    return { ftools: ftools, tools: $tools }
  }

  $: data = getData($filteredTools)
</script>

<svelte:head>
  <title>Spatial Temporal Visualization</title>
</svelte:head>

<div class="grid mx-20 mt-6">
  <h1 class="text-4xl font-medium leading-tight mt-0 mb-2">Spatial Temporal Visualization</h1>
</div>
<div class="grid mx-20 my-4 place-items-center">
  <Autocomplete />
</div>
<div class="grid mx-20 my-4 place-items-center">
  <ToolChipBox />
</div>
<div class="grid mx-20 my-4 place-items-center">
  <LanguageChipBox />
</div>
<div class="grid my-4 w-full h-1/2 place-items-center">
  <LayerCake {data}>
    <SpatialTemporalLayer />
  </LayerCake>
</div>

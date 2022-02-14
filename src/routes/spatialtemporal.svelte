<script lang="ts">
  export const prerender = true
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
  import Icon from 'svelte-awesome/components/Icon.svelte'
  import { faSpinner } from '@fortawesome/free-solid-svg-icons'

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
{#if $loading}
  <div class="grid-flow-row mx-20 my-4">
    <div
      class="bg-yellow-100 rounded-lg py-5 px-6 mb-3 text-base text-yellow-700 inline-flex items-center w-full"
      role="alert"
    >
      <Icon class="w-4 h-4 mr-2 fill-current" data={faSpinner} spin />
      Loading...
    </div>
  </div>
{:else}
  <div class="grid my-4 w-full h-1/2 place-items-center">
    <LayerCake {data}>
      <SpatialTemporalLayer />
    </LayerCake>
  </div>
{/if}

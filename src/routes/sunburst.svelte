<script lang="ts">
  import Autocomplete from '$lib/Autocomplete.svelte'
  import LanguageChipBox from '$lib/LanguageChipBox.svelte'
  import ToolChipBox from '$lib/ToolChipBox.svelte'
  import { LayerCake, Svg } from 'layercake'
  import SunburstLayer from '$lib/SunburstLayer.svelte'
  import Icon from 'svelte-awesome/components/Icon.svelte'
  import { filteredTools, searchQuery, loading, languages } from '$lib/stores'

  import { faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons'

  function getData(tools) {
    let data = { name: 'Languages', children: [] }
    for (let language of $languages) {
      let children = $filteredTools
        .filter((tool) => tool.language.includes(language))
        .map((tool) => ({
          name: tool.name,
          value: 1 / tool.language.length,
          obj: tool,
        }))
      data.children.push({ name: language, children: children })
    }
    return data
  }

  $: data = getData($filteredTools)
  $: isEmpty = $filteredTools.length === 0
</script>

<svelte:head>
  <title>Sunburst Visualization</title>
</svelte:head>

<div class="grid mx-20 mt-6">
  <h1 class="text-4xl font-medium leading-tight mt-0 mb-2">Sunburst Visualization</h1>
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
<div class="grid mx-20 my-4 h-1/2 {isEmpty ? 'place-items-start' : 'place-items-center'}">
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
    <LayerCake {data}>
      <SunburstLayer />
    </LayerCake>
  {/if}
</div>

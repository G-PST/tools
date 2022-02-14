<script lang="ts">
  import Autocomplete from '$lib/Autocomplete.svelte'
  import RadarLayerCake from '$lib/RadarLayerCake.svelte'
  import LanguageChipBox from '$lib/LanguageChipBox.svelte'
  export const prerender = true
</script>

<svelte:head>
  <title>Radar Visualization</title>
</svelte:head>

<div class="grid mx-20 mt-6">
  <h1 class="text-4xl font-medium leading-tight mt-0 mb-2">Radar</h1>
</div>
<div class="grid mx-20 my-4 place-items-center">
  <Autocomplete />
</div>
<div class="grid mx-20 my-4 place-items-center">
  <LanguageChipBox />
</div>
<div class="grid mx-20 my-4 place-items-center">
  <RadarLayerCake />
</div>

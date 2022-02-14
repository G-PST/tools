<script lang="ts">
  import Autocomplete from '$lib/Autocomplete.svelte'
  import ToolTable from '$lib/ToolTable.svelte'
  import LanguageChipBox from '$lib/LanguageChipBox.svelte'
  import { base } from '$app/paths'
</script>

<svelte:head>
  <title>G-PST Tools Portal</title>
</svelte:head>

<div class="grid mx-20 mt-6">
  <h1 class="text-4xl font-medium leading-tight mt-0 mb-2">Tools</h1>
</div>
<div class="grid mx-20 my-4 place-items-center">
  <Autocomplete />
</div>
<div class="grid mx-20 my-4 place-items-center">
  <LanguageChipBox />
</div>
<div class="grid mx-20 my-4 place-items-center">
  <ToolTable />
</div>

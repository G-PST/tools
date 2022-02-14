<script lang="ts">
  import { onMount } from 'svelte'

  import { selectedTools, tools } from './stores'

  $: allTools = $selectedTools.length == $tools.length

  function onInput() {
    if (!allTools) {
      $selectedTools = $tools.map((tool) => tool.name)
    } else {
      $selectedTools = []
    }
  }

  onMount(() => {})
</script>

<div class="flex flex-wrap justify-start space-x-2">
  {#if $tools.length > 0}
    <label>
      <input type="checkbox" bind:checked={allTools} on:input={onInput} />
      All
    </label>
    {#each $tools as tool}
      <label>
        <input type="checkbox" bind:group={$selectedTools} value={tool.name} />
        {tool.name}
      </label>
    {/each}
  {/if}
</div>

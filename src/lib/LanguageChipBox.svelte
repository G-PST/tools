<script lang="ts">
  import { onMount } from 'svelte'

  import { selectedLanguages, languages } from './stores'

  $: allLanguages = $selectedLanguages.length == [...$languages].sort().length

  let langArr = []
  $: langArr = [...$languages].sort()

  function onInput() {
    if (!allLanguages) {
      $selectedLanguages = [...$languages].sort()
    } else {
      $selectedLanguages = []
    }
  }

  onMount(() => {})
</script>

<div class="flex flex-wrap justify-start space-x-2">
  {#if langArr.length > 0}
    <label>
      <input type="checkbox" bind:checked={allLanguages} on:input={onInput} />
      All
    </label>
    {#each langArr as language}
      <label>
        <input type="checkbox" bind:group={$selectedLanguages} value={language} />
        {language}
      </label>
    {/each}
  {/if}
</div>

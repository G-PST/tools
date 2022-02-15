<script lang="ts">
  import Autocomplete from '$lib/Autocomplete.svelte'
  import { faTwitter } from '@fortawesome/free-brands-svg-icons'
  import { faDatabase, faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-awesome/components/Icon.svelte'
  import { searchQuery } from '$lib/stores'

  export let data

  function getOptions(data) {
    return [
      { i: 0, name: 'All' },
      ...data.landscape.map(({ name }, i) => {
        return { i: i + 1, name }
      }),
    ]
  }
  let selectedOption = 'G-PST'
  function getTools(data, searchQuery) {
    const tmp = data.landscape.filter((d) =>
      selectedOption == 'All' ? true : d.name == selectedOption,
    )

    const tools = []
    for (const t of tmp) {
      for (const sc of t.subcategories) {
        for (const item of sc.items) {
          tools.push(item)
        }
      }
    }

    tools.sort((d1, d2) => {
      if (d1.name < d2.name) {
        return -1
      }
      if (d1.name > d2.name) {
        return 1
      }
      return 0
    })
    const ftools = tools.filter((item) =>
      searchQuery
        .toLowerCase()
        .split(/[-./\\()"'\s,;<>~!@#$%^&*|+=[\]{}`~?:]/u)
        .every((v) => {
          return (
            item.name.toLowerCase().includes(v) ||
            item.description?.toLowerCase().includes(v) ||
            item.homepage_url.toLowerCase().includes(v)
          )
        }),
    )
    return ftools
  }
  $: tools = getTools(data, $searchQuery)
  $: options = getOptions(data)
</script>

<div class="grid mx-20 my-4 place-items-center">
  <div class="flex w-full gap-4">
    <div class="w-10/12">
      <Autocomplete />
    </div>
    <div class="flex justify-center">
      <div class="mb-3 xl:w-96">
        <select
          class="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          bind:value={selectedOption}
        >
          {#each options as o (o.name)}
            <option value={o.name}>{o.name}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
</div>
<div class="grid mx-20 my-4">
  <div>Found {tools.length} tools</div>
</div>
<div class="grid mx-20 my-4 place-items-center">
  <div class="cards w-full grid grid-cols-1 gap-2">
    {#each tools as tool}
      <div class="card w-full flex justify-center">
        <div class="block p-6 rounded-lg shadow-lg bg-white max-w">
          <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">{tool.name}</h5>
          <p class="text-gray-700 text-base mb-4">
            {tool.description}
          </p>
          <div class="flex gap-5">
            {#if tool.crunchbase_data.twitter}
              <a target="_blank" rel="external" href={tool.crunchbase_data.twitter}
                ><Icon data={faTwitter} /></a
              >
            {/if}
            <a target="_blank" rel="external" href={tool.crunchbase}><Icon data={faDatabase} /></a>
            <a target="_blank" rel="external" href={tool.repo_url}>
              <Icon data={faExternalLinkSquareAlt} />
            </a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .card {
    grid-row: auto / span 1; /* use three rows of the parent grid */
    display: grid;
    grid-template-rows: subgrid;
    grid-template-columns: subgrid;
    grid-gap: 0; /* set the gap to 0 on the subgrid so our cards don’t have gaps */
  }
</style>

<script lang="ts">
  import Autocomplete from '$lib/Autocomplete.svelte'
  import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
  import {
    faDatabase,
    faExternalLinkSquareAlt,
    faStar,
    faUserFriends,
  } from '@fortawesome/free-solid-svg-icons'
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
  <div class="grid grid-cols-1 gap-2">
    {#each tools as tool}
      <div class="flex justify-center">
        <div class="flex flex-col md:flex-row w-full rounded-lg bg-white shadow-lg">
          <img
            src="https://deploy-preview-404--lfenergy.netlify.app/logos/{tool.image_data.fileName}"
            class=" w-full h-96 pl-4 md:h-auto md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
            alt={tool.name}
          />
          <div class="p-6 flex flex-col justify-start">
            <h5 class="text-xl font-medium mb-2 text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out">
              <a target="_blank" rel="external" href={tool.homepage_url}>
                {tool.name}
              </a>
            </h5>
            <p class="text-gray-700 text-base mb-4">
              {tool.description}
            </p>
            <div class="flex gap-5">
              <a target="_blank" rel="external" href={tool.crunchbase}><Icon data={faDatabase} /></a
              >
              <a target="_blank" rel="external" href={tool.repo_url}>
                <Icon data={faGithub} />
              </a>
              {#if tool.crunchbase_data.twitter}
                <a target="_blank" rel="external" href={tool.crunchbase_data.twitter}
                  ><Icon data={faTwitter} /></a
                >
              {/if}
            </div>

            {#if tool.github_data}
              <div class="flex flex-wrap gap-5 mt-5 w-auto">
                <span
                  class="px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
                >
                  <a target="_blank" rel="external" href={tool.repo_url}
                    ><Icon data={faStar} />&nbsp;<span>{tool.github_data.stars}</span></a
                  >
                </span>
                <span
                  class="px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
                >
                  <a target="_blank" rel="external" href={tool.github_data.contributors_link}
                    ><Icon data={faUserFriends} />&nbsp;<span
                      >{tool.github_data.contributors_count}</span
                    ></a
                  >
                </span>
                {#each tool.github_data.languages as lang}
                  <span
                    class="px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
                  >
                    {lang.name}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

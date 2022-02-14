<script lang="ts">
  import { base } from '$app/paths'
  import { onDestroy, onMount } from 'svelte'
  import { tools, filteredTools, showAll, searchQuery, loading, updateTools } from '$lib/stores'
  import Icon from 'svelte-awesome/components/Icon.svelte'
  import {
    faLink,
    faCaretDown,
    faCaretUp,
    faExternalLinkAlt,
    faInfoCircle,
    faExclamationTriangle,
    faChartPie,
    faThLarge,
    faRadiation,
    faSpinner,
  } from '@fortawesome/free-solid-svg-icons'
  import { faGithub } from '@fortawesome/free-brands-svg-icons'

  let N = 10
  $: numberElementsPerPage = $showAll ? $filteredTools.length + 1 : N
  function getPages(showAll: boolean) {
    const n = showAll ? $filteredTools.length + 1 : N
    var pages = [{ number: 1, active: true }]
    for (const [index, _] of $filteredTools.entries()) {
      if (index % n === 0 && index > 0) {
        pages = [...pages, { number: index / n + 1, active: false }]
      }
    }
    return pages
  }
  $: pages = getPages($showAll)
  $: isFirstPageActive = pages.length === 1 ? true : pages[0].active
  $: isLastPageActive = pages.length === 1 ? true : pages.at(-1).active
  $: activePage = pages.findIndex((page) => page.active)
  function selectPage(i: number) {
    for (var page of pages) {
      page.number === i ? (page.active = true) : (page.active = false)
    }
    pages = pages
  }

  let tools_table = $filteredTools

  let columns = [
    {
      field: 'name_url',
      sortName: 'name',
      title: 'Name',
      show: true,
      sort: 'ascending',
      sortColor: '#fff',
      sortActive: true,
    },
    {
      field: 'short_description',
      title: 'Description',
      show: true,
      sortActive: false,
    },
    {
      field: 'website_url',
      title: 'Website',
      text_center: true,
      show: true,
      sortActive: false,
    },
    {
      field: 'source_url',
      title: 'Source',
      text_center: true,
      show: true,
      sortActive: false,
    },
    {
      field: 'github_stars',
      sortName: 'github_stars',
      title: 'Stars',
      text_center: true,
      show: true,
      sort: 'ascending',
      sortColor: '#fff',
      sortActive: false,
    },
  ]

  function resetSort() {
    for (let c of columns) {
      c.sortActive = false
    }
    columns = columns
    $tools = $tools
  }

  function handleSort(column) {
    for (let c of columns) {
      if (c.title == column.title) {
        c.sort = c.sort == 'ascending' ? 'descending' : 'ascending'
        c.sortActive = true
      } else {
        c.sortActive = false
      }
    }
    columns = columns
    $tools = $tools
  }

  onDestroy(
    filteredTools.subscribe((value) => {
      var index = 0
      for (var tool of value) {
        index += 1
        tool.github_stars = tool.github_stars ? tool.github_stars : '-'
        tool.index = index
      }
      for (const c of columns) {
        if (c.sortActive) {
          if (c.sort == 'ascending') {
            value.sort((d1, d2) => {
              let a = d1[c.sortName]
              let b = d2[c.sortName]
              a = a == '-' ? 0 : a
              b = b == '-' ? 0 : b
              if (a < b) {
                return -1
              }
              if (a > b) {
                return 1
              }
              return 0
            })
          } else if (c.sort == 'descending') {
            value.sort((d1, d2) => {
              let a = d1[c.sortName]
              let b = d2[c.sortName]
              a = a == '-' ? 0 : a
              b = b == '-' ? 0 : b
              if (a > b) {
                return -1
              }
              if (a < b) {
                return 1
              }
              return 0
            })
          }
          break
        }
      }
      tools_table = value
    }),
  )
</script>

{#if $loading === false && tools_table.length === 0 && $searchQuery.length > 0}
  <div class="grid-flow-row w-full items-stretch">
    <div
      class="bg-yellow-100 rounded-lg py-5 px-6 mb-3 text-base text-yellow-700 inline-flex items-center w-full"
      role="alert"
    >
      <Icon class="w-4 h-4 mr-2 fill-current" data={faExclamationTriangle} />
      No tools found matching filter `{$searchQuery}`.
    </div>
    <div
      class="bg-blue-100 rounded-lg py-5 px-6 mb-3 text-base text-blue-700 inline-flex items-center w-full"
      role="alert"
    >
      <Icon class="w-4 h-4 mr-2 fill-current" data={faInfoCircle} />
      Is what you are searching for not listed? Click
      <a
        target="_blank"
        href="https://github.com/kdheepak/tools/issues/new?template=tools.yml"
        class="font-bold text-blue-800 hover:text-blue-700 focus:text-blue-700 px-1"
      >
        here <Icon data={faExternalLinkAlt} />
      </a> to submit it.
    </div>
  </div>
{:else if $loading === true}
  <div class="grid-flow-row w-full items-stretch">
    <div
      class="bg-yellow-100 rounded-lg py-5 px-6 mb-3 text-base text-yellow-700 inline-flex items-center w-full"
      role="alert"
    >
      <Icon class="w-4 h-4 mr-2 fill-current" data={faSpinner} spin />
      Loading...
    </div>
  </div>
{:else}
  <div class="flex w-full flex-col mt-6">
    <div class="flex w-full justify-between">
      <button
        on:click={(_) => ($showAll = !$showAll)}
        type="button"
        class="inline-block px-6 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
      >
        {#if $showAll}
          <Icon data={faCaretUp} />
        {:else}
          <Icon data={faCaretDown} />
        {/if}
      </button>
      <div class="flex gap-2">
        <div>
          <a
            href="{base}/radar"
            class="inline-block px-6 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          >
            <Icon data={faRadiation} />
          </a>
        </div>
        <div>
          <a
            href="{base}/spatialtemporal"
            class="inline-block px-6 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          >
            <Icon data={faThLarge} />
          </a>
        </div>
        <div>
          <a
            href="{base}/sunburst"
            class="inline-block px-6 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          >
            <Icon data={faChartPie} />
          </a>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 inline-block w-full sm:px-6 lg:px-8">
        <div class="overflow-x-auto">
          <table class="table-auto w-full">
            <thead class="border-b bg-gray-800">
              <tr>
                <th scope="col" class="text-sm font-medium text-white px-6 py-4 text-left">
                  <span>ID</span>
                </th>
                {#each columns as column}
                  <th scope="col" class="text-sm font-medium text-white px-6 py-4 text-left">
                    <div class="flex">
                      <span>{column.title}</span> &nbsp;
                      {#if column.sort == 'ascending'}
                        <button on:click={() => handleSort(column)}
                          ><Icon
                            style="color: {column.sortActive ? column.sortColor : '#aaa'}"
                            data={faCaretDown}
                          /></button
                        >
                      {/if}
                      {#if column.sort == 'descending'}
                        <button on:click={() => handleSort(column)}
                          ><Icon
                            style="color: {column.sortActive ? column.sortColor : '#aaa'}"
                            data={faCaretUp}
                          /></button
                        >
                      {/if}
                    </div>
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each tools_table as tool, index (tool)}
                {#if index >= activePage * numberElementsPerPage && index < (activePage + 1) * numberElementsPerPage}
                  <tr class="border-b hover:bg-gray-100">
                    <td class="px-6 py-4 whitespace text-sm font-medium text-gray-900">
                      {tool.index}
                    </td>
                    {#each columns as column}
                      <td
                        class="px-6 py-4 whitespace text-sm font-medium text-gray-900
                        {column.text_center ? 'text-center' : ''}"
                      >
                        {#if column.field == 'website_url'}
                          <a target="_blank" href={tool.website}><Icon data={faLink} /></a>
                        {:else if column.field == 'source_url'}
                          {#if tool.source.includes('github.com')}
                            <a target="_blank" href={tool.source}><Icon data={faGithub} /></a>
                          {:else}
                            <a target="_blank" href={tool.source}><Icon data={faLink} /></a>
                          {/if}
                        {:else if column.field == 'name_url'}
                          <a
                            class="hover:text-blue-700 hover:underline text-blue-500"
                            href="{base}/Tool/{tool.number}">{tool.name}</a
                          >
                        {:else}
                          {@html tool[column.field]}
                        {/if}
                      </td>
                    {/each}
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="flex w-full justify-between mb-12">
    <div class="flex justify-center">
      {#if !$showAll}
        <span class="px-2 py-3"
          >Showing {N * activePage + 1} to {Math.min(N * (activePage + 1), $filteredTools.length)} of
          {$filteredTools.length} rows with
        </span>
        <div class="dropdown relative">
          <button
            class="
          dropdown-toggle
          px-2
          py-3
          bg-blue-600
          text-white
          font-medium
          text-xs
          leading-tight
          uppercase
          rounded
          shadow-md
          hover:bg-blue-700 hover:shadow-lg
          focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-blue-800 active:shadow-lg active:text-white
          transition
          duration-150
          ease-in-out
          flex
          items-center
          whitespace-nowrap
        "
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {N} <span class="px-1" />
            <Icon data={faCaretDown} />
          </button>
          <ul
            class="
          dropdown-menu
          min-w-max
          absolute
          bg-white
          text-base
          z-50
          float-left
          py-3
          list-none
          text-left
          rounded-lg
          shadow-lg
          mt-1
          hidden
          m-0
          bg-clip-padding
          border-none
        "
          >
            <li>
              <button
                on:click={() => (N = 10)}
                class="
              dropdown-item
              text-sm
              py-2.5
              px-6
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-100
            ">10</button
              >
            </li>
            <li>
              <button
                on:click={() => (N = 25)}
                class="
              dropdown-item
              text-sm
              py-2.5
              px-6
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-100
            ">25</button
              >
            </li>
          </ul>
        </div>
        <span class="px-2 py-3">rows per page.</span>
      {/if}
    </div>
    <nav aria-label="Page navigation example">
      {#if !$showAll}
        <ul class="flex  list-style-none">
          <li class="page-item {isFirstPageActive ? 'disabled' : ''}">
            <button
              on:click={(_) => selectPage(1)}
              class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none text-gray-800 focus:shadow-none
            {isFirstPageActive ? 'pointer-events-none' : 'hover:text-gray-800 hover:bg-gray-200'}"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          {#each pages as page (page)}
            <li class="page-item {page.active ? 'active' : ''}">
              <button
                on:click={(_) => selectPage(page.number)}
                class="page-link relative block py-1.5 px-3 border-0 outline-none rounded
                {page.active
                  ? 'bg-blue-600 text-white hover:text-white hover:bg-blue-600 shadow-md focus:shadow-md'
                  : 'bg-transparent text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none'}
                  "
              >
                {page.number}
              </button>
            </li>
          {/each}
          <li class="page-item  {isLastPageActive ? 'disabled' : ''}">
            <button
              on:click={(_) => selectPage(pages.length)}
              class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none text-gray-800 focus:shadow-none
            {isLastPageActive ? 'pointer-events-none' : 'hover:text-gray-800 hover:bg-gray-200'}"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      {/if}
    </nav>
  </div>
{/if}

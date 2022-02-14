<script context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export const prerender = false
  export async function load({ params }) {
    return {
      props: {
        id: params.id,
      },
    }
  }
</script>

<script lang="ts">
  export let id = 0

  import { tools } from '$lib/stores'
  import showdown from 'showdown'
  import { onMount } from 'svelte'
  import Icon from 'svelte-awesome/components/Icon.svelte'
  import {
    faExclamationCircle,
    faExternalLinkAlt,
    faSpinner,
  } from '@fortawesome/free-solid-svg-icons'
  let tool = null
  $: tool = $tools.find((tool) => {
    return tool.number.toString() === id.toString()
  })

  showdown.setOption('simplifiedAutoLink', true)
  showdown.setOption('openLinksInNewWindow', true)
  showdown.setOption('emoji', true)
  showdown.setFlavor('github')
  const converter = new showdown.Converter()
  let loaded = false
  let error = false
  onMount(() => {
    if (tool === undefined) {
      loaded = false
      error = true
    } else {
      tool.body_html = converter.makeHtml(tool.issue_body)
      loaded = true
    }
  })
</script>

<svelte:head>
  <title>G-PST Tools Portal {loaded ? `- Tool ${tool.number}` : ''}</title>
</svelte:head>

<div class="grid mx-40 my-12">
  {#if loaded}
    <a
      target="_blank"
      rel="external"
      class="justify-self-start inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out"
      href={tool.issue_url}>Go to GitHub Issue</a
    >
    <div class="tool-wrapper">
      {@html tool.body_html}
    </div>
  {:else if !error}
    <div class="grid-flow-row w-full items-stretch">
      <div
        class="bg-yellow-100 rounded-lg py-5 px-6 mb-3 text-base text-yellow-700 inline-flex items-center w-full"
        role="alert"
      >
        <Icon class="w-4 h-4 mr-2 fill-current" data={faSpinner} spin />
        Loading...
      </div>
    </div>
  {:else if error}
    <div class="grid-flow-row w-full items-stretch">
      <div
        class="bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full"
        role="alert"
      >
        <Icon class="w-4 h-4 mr-2 fill-current" data={faExclamationCircle} />
        Something went wrong. Please contact the developers.
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .tool-wrapper :global(h1) {
    @apply text-5xl font-medium leading-tight mt-6 mb-2 text-gray-600;
  }

  .tool-wrapper :global(h2) {
    @apply text-4xl font-medium leading-tight mt-6 mb-2 text-gray-600;
  }

  .tool-wrapper :global(h3) {
    @apply text-3xl font-medium leading-tight mt-6 mb-2 text-gray-600;
  }

  .tool-wrapper :global(h4) {
    @apply text-2xl font-medium leading-tight mt-6 mb-2 text-gray-600;
  }

  .tool-wrapper :global(h5) {
    @apply text-xl font-medium leading-tight mt-6 mb-2 text-gray-600;
  }

  .tool-wrapper :global(h6) {
    @apply text-base font-medium leading-tight mt-6 mb-2 text-gray-600;
  }

  .tool-wrapper :global(a) {
    @apply underline text-blue-600 transition duration-300 ease-in-out;
  }

  .tool-wrapper :global(a:hover) {
    @apply text-blue-800;
  }
</style>

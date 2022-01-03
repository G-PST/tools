<script context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ params }) {
    return {
      props: {
        id: params.id,
      },
    }
  }
</script>

<script lang="ts">
  export let id
  import { tools, searchQuery } from '$lib/stores'
  import showdown from 'showdown'
  import { onMount } from 'svelte'
  import Icon from 'svelte-awesome/components/Icon.svelte'
  import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

  showdown.setOption('simplifiedAutoLink', true)
  showdown.setOption('openLinksInNewWindow', true)
  showdown.setOption('emoji', true)
  showdown.setFlavor('github')
  const converter = new showdown.Converter()
  let tool = $tools.find((tool) => {
    return tool.number.toString() === id.toString()
  })
  console.log(tool)
  let loaded = false
  onMount(() => {
    tool.body_html = converter.makeHtml(tool.issue_body)
    loaded = true
  })
</script>

<svelte:head>
  <title>G-PST Tools Portal - {loaded ? `Tool ${tool.number}` : ''}</title>
</svelte:head>

<div class="grid mx-40 my-12">
  {#if loaded}
    <a
      target="_blank"
      class="justify-self-start inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out"
      href={tool.issue_url}>Go to GitHub Issue</a
    >
    <div class="tool-wrapper">
      {@html tool.body_html}
    </div>
  {:else}
    Loading...
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

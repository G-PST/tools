<script context="module">
  import { base } from '$app/paths'
  export async function load() {
    return {
      status: 302,
      redirect: `{base}/`,
    }
  }
</script>

<svelte:head>
  <title>G-PST Tools Portal</title>
</svelte:head>

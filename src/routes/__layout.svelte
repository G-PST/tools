<script>
  import '../app.css'
  import Navbar from '$lib/Navbar.svelte'
  import Footer from '$lib/Footer.svelte'
  import { updateTools } from '$lib/stores'
  import { onMount } from 'svelte'
  onMount(async () => {
    updateTools()
  })
</script>

<div class="h-screen w-screen grid grid-rows-[auto_1fr_auto]">
  <Navbar />

  <main>
    <slot />
  </main>
</div>

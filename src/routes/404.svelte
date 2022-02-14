<script>
  import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

  import Icon from 'svelte-awesome/components/Icon.svelte'
</script>

<svelte:head>
  <title>G-PST Tools Portal</title>
</svelte:head>

<div class="grid mx-40 my-12">
  <div class="grid-flow-row w-full items-stretch">
    <div
      class="bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full"
      role="alert"
    >
      <Icon class="w-4 h-4 mr-2 fill-current" data={faExclamationCircle} />
      Something went wrong. Please contact the developers.
    </div>
  </div>
</div>

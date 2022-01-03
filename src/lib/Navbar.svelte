<script lang="ts">
  import { base } from '$app/paths'
  import { getStores, navigating, page, session } from '$app/stores'
  import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
  import Icon from 'svelte-awesome/components/Icon.svelte'
</script>

<nav
  class="relative flex flex-wrap w-full py-4 justify-between items-center
  text-gray-500
  shadow-lg
  hover:text-gray-700
  focus:text-gray-700
  navbar navbar-expand navbar-light
    "
>
  <div class="container-fluid w-full flex flex-wrap items-center justify-between px-6">
    <div class="collapse navbar-collapse flex-grow items-center" id="navbarSupportedContent">
      <a class="pr-6" href="https://globalpst.org/">
        <img
          src="https://globalpst.org/wp-content/uploads/GPSTC-logo-blk.png"
          srcset="https://globalpst.org/wp-content/uploads/GPSTC-logo-blk.png 1x, https://globalpst.org/wp-content/uploads/GPSTC-logo-blk-x2.png 2x"
          width="181"
          height="90"
          style="max-height:90px;height:auto;"
          alt="Global Power System Transformation Consortium (G-PST) Logo"
        />
      </a>
      <ul class="navbar-nav flex flex-col space-between-4 list-style-none mr-auto">
        <li class="nav-item px-2">
          <a
            class="nav-link {$page.url.pathname == '/'
              ? 'active'
              : 'text-gray-500 hover:text-gray-700 focus:text-gray-700'}"
            href="{base}/">Home</a
          >
        </li>
        <li class="nav-item px-2">
          <a
            class="nav-link {$page.url.pathname == '/about'
              ? 'active'
              : 'text-gray-500 hover:text-gray-700 focus:text-gray-700'}"
            href="{base}/about">About</a
          >
        </li>
        <li class="nav-item px-2">
          <a
            class="nav-link text-gray-500 hover:text-gray-700 focus:text-gray-700"
            target="_blank"
            href="https://github.com/kdheepak/tools/issues/new?template=tools.yml"
            >Submit <Icon data={faExternalLinkAlt} /></a
          >
        </li>
      </ul>
    </div>
  </div>
</nav>

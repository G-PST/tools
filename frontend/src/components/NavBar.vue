<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="https://globalpst.org/"
        ><img
          src="/images/GPSTC-logo-blk-x2.png"
          width="181"
          height="90"
          style="max-height: 90px; height: auto"
      /></a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/About">About</router-link>
          </li>
          <li class="nav-item">
            <a
              target="_blank"
              class="nav-link"
              href="https://github.com/kdheepak/tools/issues/new?template=tools.yml"
              >Submit</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

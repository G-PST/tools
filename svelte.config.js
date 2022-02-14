import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

const isProduction = process.env.NODE_ENV == 'production' ? true : false
const productionBaseDirectory = 'tools'

function getPages() {
  let pages = ['*']
  const tools = [58, 57, 56, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 43, 31]
  for (const p of tools) {
    pages.push(`/Tool/${p}`)
  }
  return pages
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess({})],

  kit: {
    adapter: adapter({}),
    paths: isProduction
      ? {
          base: `/${productionBaseDirectory}`,
          assets: `https://g-pst.github.io/${productionBaseDirectory}`,
        }
      : {},
    prerender: {
      crawl: true,
      enabled: true,
      entries: getPages(),
    },
  },
}

export default config

import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

const isProduction = process.env.NODE_ENV == 'production' ? true : false
const productionBaseDirectory = 'tools'

import { Octokit } from '@octokit/rest'

const octokit = new Octokit()
let pages = ['*']

octokit
  .paginate('GET /repos/{owner}/{repo}/issues', { owner: 'G-PST', repo: 'tools' }, (response) =>
    response.data.filter((issue) => issue.state == 'open').map((issue) => issue.number),
  )
  .then((issues) => {
    // issueTitles is now an array with the titles only
    for (const i of issues) {
      pages.push(`/Tool/${i}`)
    }
  })

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
      entries: pages,
    },
  },
}

export default config

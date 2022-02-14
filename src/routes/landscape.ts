import { Octokit } from '@octokit/rest'

import yaml from 'js-yaml'

const octokit = new Octokit()

const owner = 'lf-energy'
const repo = 'lfenergy-landscape'
const path = 'processed_landscape.yml'
const ref = '03ddbc1903e92da0e60e146b354d755ad75bd922'

export async function get() {
  const response = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    ref,
  })
  const data = yaml.load(Buffer.from(response.data.content, 'base64').toString())
  return {
    body: { data },
  }
}

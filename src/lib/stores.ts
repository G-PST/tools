import { browser } from '$app/env'
import type { Writable } from 'svelte/store'
import { writable, get, derived } from 'svelte/store'

const storage = <T>(key: string, initValue: T): Writable<T> => {
  const store = writable(initValue)
  if (!browser) return store

  const storedValueStr = localStorage.getItem(key)
  if (storedValueStr != null) store.set(JSON.parse(storedValueStr))

  store.subscribe((val) => {
    if ([null, undefined].includes(val)) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(val))
    }
  })

  window.addEventListener('storage', () => {
    const storedValueStr = localStorage.getItem(key)
    if (storedValueStr == null) return

    const localValue: T = JSON.parse(storedValueStr)
    if (localValue !== get(store)) store.set(localValue)
  })

  return store
}

export default storage

export const loading = writable(true)
export const tools = storage('tools', [])
export const showAll = storage('showAll', false)
export const searchQuery = storage('searchQuery', '')
export const languages = derived([tools], ([$tools]) => {
  const languages = new Set()
  for (var tool of $tools) {
    tool.language.map((lang: string) => languages.add(lang))
  }
  return languages
})
export const selectedLanguages = storage('selectedLanguages', new Array())
export const selectedTools = storage('selectedTools', new Array())
export const filteredTools = derived(
  [tools, searchQuery, selectedLanguages, selectedTools],
  ([$tools, $searchQuery, $selectedLanguages, $selectedTools]) => {
    let f = $tools
      .filter((item) =>
        $searchQuery
          .toLowerCase()
          .split(/[-./\\()"'\s,;<>~!@#$%^&*|+=[\]{}`~?:]/u)
          .every((v) => {
            return (
              item.name.toLowerCase().includes(v) ||
              item.description.toLowerCase().includes(v) ||
              item.modeling_paradigm
                .map(Function.prototype.call, String.prototype.toLowerCase)
                .join(' ')
                .includes(v) ||
              item.language
                .map(Function.prototype.call, String.prototype.toLowerCase)
                .join(' ')
                .includes(v) ||
              item.short_description.toLowerCase().includes(v)
            )
          }),
      )
      .filter((item) => {
        for (const lang of $selectedLanguages) {
          if (item.language.includes(lang)) {
            return true
          }
        }
        return false
      })
      .filter((item) => {
        for (const name of $selectedTools) {
          if (item.name == name) {
            return true
          }
        }
        return false
      })
    f.sort((d1, d2) => {
      if (d1.name < d2.name) {
        return -1
      }
      if (d1.name > d2.name) {
        return 1
      }
      return 0
    })
    return f
  },
)

export function updateTools() {
  if (get(tools).length === 0) {
    loading.set(true)
    fetch('https://gpst-tools.herokuapp.com/api/tools')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        tools.set(data)
        selectedLanguages.set([...get(languages)].sort())
        selectedTools.set(get(tools).map((tool) => tool.name))
        loading.set(false)
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  } else {
    tools.set(get(tools))
    selectedLanguages.set([...get(languages)].sort())
    selectedTools.set(get(tools).map((tool) => tool.name))
    loading.set(false)
  }
}

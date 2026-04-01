import { ref, watch } from 'vue'

const BASE_URL = 'https://api.tvmaze.com'
const DEBOUNCE_DELAY = 400

export function useSearch() {
  const query = ref('')
  const searchResults = ref([])
  const searching = ref(false)
  const searchError = ref(null)
  let debounceTimer = null

  async function performSearch(q) {
    if (!q.trim()) {
      searchResults.value = []
      return
    }
    searching.value = true
    searchError.value = null
    try {
      const res = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      searchResults.value = data.map(item => item.show)
    } catch (err) {
      searchError.value = err.message
      searchResults.value = []
    } finally {
      searching.value = false
    }
  }

  watch(query, (newQuery) => {
    clearTimeout(debounceTimer)
    if (!newQuery.trim()) {
      searchResults.value = []
      searching.value = false
      return
    }
    debounceTimer = setTimeout(() => {
      performSearch(newQuery)
    }, DEBOUNCE_DELAY)
  })

  function clearSearch() {
    query.value = ''
    searchResults.value = []
    searchError.value = null
    searching.value = false
    clearTimeout(debounceTimer)
  }

  return {
    query,
    searchResults,
    searching,
    searchError,
    clearSearch,
  }
}

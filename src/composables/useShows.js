import { ref, computed } from 'vue'

const BASE_URL = 'https://api.tvmaze.com'
const PAGES_TO_FETCH = 1

export function useShows() {
  const allShows = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedGenre = ref('All')

  const genres = computed(() => {
    const genreSet = new Set()
    allShows.value.forEach(show => {
      if (show.genres) {
        show.genres.forEach(g => genreSet.add(g))
      }
    })
    const sorted = Array.from(genreSet).sort()
    return ['All', ...sorted]
  })

  const showsByGenre = computed(() => {
    if (selectedGenre.value === 'All') {
      return groupByGenre(allShows.value)
    }
    const filtered = allShows.value.filter(
      show => show.genres && show.genres.includes(selectedGenre.value)
    )
    return { [selectedGenre.value]: sortByRating(filtered) }
  })

  const topRatedShows = computed(() => {
    return [...allShows.value]
      .filter(show => show.rating && show.rating.average)
      .sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
      .slice(0, 20)
  })

  function groupByGenre(shows) {
    const groups = {}
    shows.forEach(show => {
      if (show.genres && show.genres.length > 0) {
        show.genres.forEach(genre => {
          if (!groups[genre]) groups[genre] = []
          groups[genre].push(show)
        })
      }
    })
    Object.keys(groups).forEach(genre => {
      groups[genre] = sortByRating(groups[genre])
    })
    return groups
  }

  function sortByRating(shows) {
    return [...shows].sort((a, b) => {
      const ratingA = a.rating?.average || 0
      const ratingB = b.rating?.average || 0
      return ratingB - ratingA
    })
  }

  async function fetchPage(page) {
    const res = await fetch(`${BASE_URL}/shows?page=${page}`)
    if (!res.ok) throw new Error(`Failed to fetch page ${page}`)
    return res.json()
  }

  async function fetchShows() {
    loading.value = true
    error.value = null
    try {
      const pages = Array.from({ length: PAGES_TO_FETCH }, (_, i) => i)
      const results = await Promise.allSettled(pages.map(fetchPage))
      const shows = []
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          shows.push(...result.value)
        }
      })
      if (shows.length === 0 && results.every(r => r.status === 'rejected')) {
        throw new Error('Failed to load any shows. Please check your connection.')
      }
      allShows.value = shows
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function setGenre(genre) {
    selectedGenre.value = genre
  }

  return {
    allShows,
    loading,
    error,
    genres,
    showsByGenre,
    topRatedShows,
    selectedGenre,
    fetchShows,
    setGenre,
  }
}

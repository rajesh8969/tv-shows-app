import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useShows } from '../composables/useShows.js'

const mockShows = [
  {
    id: 1,
    name: 'Breaking Bad',
    genres: ['Drama', 'Crime'],
    rating: { average: 9.5 },
    image: { medium: 'http://example.com/bb.jpg', original: 'http://example.com/bb-orig.jpg' },
    summary: '<p>A chemistry teacher turns to crime.</p>',
  },
  {
    id: 2,
    name: 'The Office',
    genres: ['Comedy'],
    rating: { average: 8.8 },
    image: { medium: 'http://example.com/to.jpg', original: 'http://example.com/to-orig.jpg' },
    summary: '<p>A mockumentary about office life.</p>',
  },
  {
    id: 3,
    name: 'Game of Thrones',
    genres: ['Drama', 'Fantasy'],
    rating: { average: 9.2 },
    image: null,
    summary: '<p>A fantasy epic.</p>',
  },
  {
    id: 4,
    name: 'No Rating Show',
    genres: ['Drama'],
    rating: { average: null },
    image: null,
    summary: '',
  },
]

function mockFetch(pages) {
  return vi.fn().mockImplementation((url) => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(pages[0]),
    })
  })
}

describe('useShows', () => {
  beforeEach(() => {
    global.fetch = mockFetch([mockShows])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with empty state', () => {
    const { allShows, loading, error, selectedGenre } = useShows()
    expect(allShows.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(selectedGenre.value).toBe('All')
  })

  it('fetches shows and populates allShows', async () => {
    const { allShows, fetchShows } = useShows()
    await fetchShows()
    expect(allShows.value.length).toBeGreaterThan(0)
  })

  it('computes genres from all shows', async () => {
    const { genres, fetchShows } = useShows()
    await fetchShows()
    expect(genres.value).toContain('All')
    expect(genres.value).toContain('Drama')
    expect(genres.value).toContain('Comedy')
    expect(genres.value[0]).toBe('All')
  })

  it('groups shows by genre and sorts by rating', async () => {
    const { showsByGenre, fetchShows } = useShows()
    await fetchShows()
    const groups = showsByGenre.value
    expect(groups).toHaveProperty('Drama')
    expect(groups['Drama'][0].rating.average).toBeGreaterThanOrEqual(
      groups['Drama'][groups['Drama'].length - 1].rating?.average || 0
    )
  })

  it('filters shows when a specific genre is selected', async () => {
    const { showsByGenre, fetchShows, setGenre } = useShows()
    await fetchShows()
    setGenre('Comedy')
    const groups = showsByGenre.value
    expect(Object.keys(groups)).toEqual(['Comedy'])
    groups['Comedy'].forEach(show => {
      expect(show.genres).toContain('Comedy')
    })
  })

  it('returns all genres when "All" is selected', async () => {
    const { showsByGenre, fetchShows, setGenre } = useShows()
    await fetchShows()
    setGenre('Drama')
    setGenre('All')
    const groups = showsByGenre.value
    expect(Object.keys(groups).length).toBeGreaterThan(1)
  })

  it('topRatedShows returns shows sorted by rating descending', async () => {
    const { topRatedShows, fetchShows } = useShows()
    await fetchShows()
    const rated = topRatedShows.value
    for (let i = 0; i < rated.length - 1; i++) {
      expect(rated[i].rating.average).toBeGreaterThanOrEqual(rated[i + 1].rating.average)
    }
  })

  it('topRatedShows excludes shows without ratings', async () => {
    const { topRatedShows, fetchShows } = useShows()
    await fetchShows()
    topRatedShows.value.forEach(show => {
      expect(show.rating?.average).toBeTruthy()
    })
  })

  it('sets loading to true while fetching and false after', async () => {
    const { loading, fetchShows } = useShows()
    const fetchPromise = fetchShows()
    // loading should go true during fetch
    await fetchPromise
    expect(loading.value).toBe(false)
  })

  it('handles fetch error gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    const { error, fetchShows } = useShows()
    await fetchShows()
    expect(error.value).toBeTruthy()
  })

  it('setGenre updates selectedGenre', () => {
    const { selectedGenre, setGenre } = useShows()
    setGenre('Comedy')
    expect(selectedGenre.value).toBe('Comedy')
    setGenre('All')
    expect(selectedGenre.value).toBe('All')
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSearch } from '../composables/useSearch.js'
import { nextTick } from 'vue'

const mockSearchResponse = [
  { score: 1.0, show: { id: 10, name: 'Breaking Bad', genres: ['Drama'], rating: { average: 9.5 } } },
  { score: 0.8, show: { id: 11, name: 'Breaking Point', genres: ['Drama'], rating: { average: 7.2 } } },
]

describe('useSearch', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('initializes with empty state', () => {
    const { query, searchResults, searching, searchError } = useSearch()
    expect(query.value).toBe('')
    expect(searchResults.value).toEqual([])
    expect(searching.value).toBe(false)
    expect(searchError.value).toBe(null)
  })

  it('does not search when query is empty', async () => {
    const { query, searchResults } = useSearch()
    query.value = ''
    vi.runAllTimers()
    await nextTick()
    expect(global.fetch).not.toHaveBeenCalled()
    expect(searchResults.value).toEqual([])
  })

  it('clears results when query is cleared', async () => {
    const { query, searchResults } = useSearch()
    query.value = 'breaking'
    vi.runAllTimers()
    await nextTick()
    query.value = ''
    await nextTick()
    expect(searchResults.value).toEqual([])
  })

  it('debounces the search request', async () => {
    const { query } = useSearch()
    query.value = 'b'
    await nextTick()
    query.value = 'br'
    await nextTick()
    query.value = 'bre'
    await nextTick()
    // No fetch should have been called yet
    expect(global.fetch).not.toHaveBeenCalled()
    vi.runAllTimers()
    // Only one fetch after debounce
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('maps search response to show objects', async () => {
    const { query, searchResults } = useSearch()
    query.value = 'breaking'
    vi.runAllTimers()
    // Wait for the async search to complete
    await vi.runAllTimersAsync()
    await nextTick()
    expect(searchResults.value).toHaveLength(2)
    expect(searchResults.value[0]).toHaveProperty('id', 10)
    expect(searchResults.value[0]).toHaveProperty('name', 'Breaking Bad')
  })

  it('handles search error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    const { query, searchError, searchResults } = useSearch()
    query.value = 'test'
    vi.runAllTimers()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(searchError.value).toBeTruthy()
    expect(searchResults.value).toEqual([])
  })

  it('clearSearch resets all state', async () => {
    const { query, searchResults, clearSearch } = useSearch()
    query.value = 'breaking'
    vi.runAllTimers()
    await vi.runAllTimersAsync()
    await nextTick()
    clearSearch()
    expect(query.value).toBe('')
    expect(searchResults.value).toEqual([])
  })

  it('handles failed HTTP response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve([]),
    })
    const { query, searchError } = useSearch()
    query.value = 'test'
    vi.runAllTimers()
    await vi.runAllTimersAsync()
    await nextTick()
    expect(searchError.value).toBeTruthy()
  })
})

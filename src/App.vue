<template>
  <div class="app">
    <header class="app-header">
      <div class="app-header__inner">
        <div class="app-header__brand">
          <span class="app-header__logo">📺</span>
          <span class="app-header__title">TVBrowse</span>
        </div>
        <SearchBar
          v-model="query"
          @clear="clearSearch"
        />
      </div>
    </header>

    <main class="app-main">
      <!-- Search Results -->
      <section v-if="query.trim()" class="section">
        <div class="section__heading">
          <h2 class="section__title">
            Search Results
            <span v-if="!searching" class="section__count">({{ searchResults.length }})</span>
          </h2>
        </div>

        <div v-if="searching" class="state-message">Searching…</div>
        <div v-else-if="searchError" class="state-message error">{{ searchError }}</div>
        <div v-else-if="searchResults.length === 0" class="state-message">No results found.</div>
        <div v-else class="show-grid">
          <ShowCard
            v-for="show in searchResults"
            :key="show.id"
            :show="show"
            @select="openPanel"
          />
        </div>
      </section>

      <!-- Dashboard -->
      <template v-else>
        <!-- Genre Filter -->
        <div class="genre-filter-bar">
          <GenreFilter
            :genres="genres"
            :active-genre="selectedGenre"
            @select="setGenre"
          />
        </div>

        <!-- Loading / Error States -->
        <div v-if="loading" class="state-message">Loading shows…</div>
        <div v-else-if="error" class="state-message error">{{ error }}</div>

        <!-- Shows by Genre -->
        <template v-else>
          <section
            v-for="(shows, genre) in showsByGenre"
            :key="genre"
            class="section"
          >
            <div class="section__heading">
              <h2 class="section__title">{{ genre }}</h2>
              <span class="section__count">{{ shows.length }} shows</span>
            </div>
            <div class="show-grid">
              <ShowCard
                v-for="show in shows.slice(0, 20)"
                :key="show.id"
                :show="show"
                @select="openPanel"
              />
            </div>
          </section>
        </template>
      </template>
    </main>

    <!-- Show Detail Panel -->
    <ShowPanel
      :show="selectedShow"
      @close="closePanel"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import GenreFilter from './components/GenreFilter.vue'
import ShowCard from './components/ShowCard.vue'
import ShowPanel from './components/ShowPanel.vue'
import { useShows } from './composables/useShows.js'
import { useSearch } from './composables/useSearch.js'

const { allShows, loading, error, genres, showsByGenre, selectedGenre, fetchShows, setGenre } = useShows()
const { query, searchResults, searching, searchError, clearSearch } = useSearch()

const selectedShow = ref(null)

function openPanel(show) {
  selectedShow.value = show
}

function closePanel() {
  selectedShow.value = null
}

onMounted(() => {
  fetchShows()
})
</script>

<style>
/* ── CSS Custom Properties ── */
:root {
  --bg: #0f1117;
  --panel-bg: #161b27;
  --card-bg: #1a2035;
  --card-bg-alt: #232c42;
  --border-color: #2a3452;
  --accent: #f5c518;
  --accent-dim: rgba(245, 197, 24, 0.12);
  --text-primary: #e8ecf0;
  --text-secondary: #b0bec5;
  --text-muted: #607d8b;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.5;
}

body {
  min-height: 100vh;
}

/* ── Header ── */
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(15, 17, 23, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-color);
}

.app-header__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.app-header__logo {
  font-size: 1.4rem;
}

.app-header__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: -0.02em;
}

/* ── Main ── */
.app-main {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* ── Genre Filter Bar ── */
.genre-filter-bar {
  position: sticky;
  top: 57px;
  z-index: 40;
  background: rgba(15, 17, 23, 0.95);
  padding: 10px 0;
  margin: -10px 0;
}

/* ── Section ── */
.section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section__heading {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.section__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.section__count {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* ── Show Grid ── */
.show-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
}

/* ── State Messages ── */
.state-message {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.state-message.error {
  color: #ef5350;
}

/* ── Responsive ── */
@media (min-width: 640px) {
  .show-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (min-width: 1024px) {
  .show-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}

@media (max-width: 480px) {
  .app-main {
    padding: 16px;
  }

  .app-header__inner {
    padding: 10px 16px;
  }

  .show-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
}
</style>

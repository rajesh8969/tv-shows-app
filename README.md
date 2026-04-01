# TVBrowse - Vue 3 TV Shows Application

A TV shows browsing application built with Vue 3, Vite, and the TVMaze public API.

## Features

- Browse TV shows organized by genre on a dashboard
- Shows sorted by rating within each genre
- Genre filter tabs to narrow the view
- Click any show card to open a detailed side panel
- Full-text search with debouncing (400ms)
- Responsive grid layout adapting from mobile to desktop
- Dark theme with gold/amber accents
- Graceful handling of missing images and missing data

## Run Instructions

### Prerequisites

- Node.js 18+

### Development

```bash
npm install
npm run dev
```

The dev server starts at http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

### Tests

```bash
# Run all tests once
npm run test -- --run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

## Project Structure

```
src/
  components/
    ShowCard.vue       # Individual show card (poster, title, rating, genre tags)
    ShowPanel.vue      # Side panel overlay with full show details
    SearchBar.vue      # Controlled search input with clear button
    GenreFilter.vue    # Scrollable genre filter tab bar
  composables/
    useShows.js        # Fetch and manage shows data; genre grouping; rating sort
    useSearch.js       # Debounced search via TVMaze search endpoint
  __tests__/
    ShowCard.test.js
    ShowPanel.test.js
    SearchBar.test.js
    GenreFilter.test.js
    useShows.test.js
    useSearch.test.js
  App.vue              # Root component, dashboard layout, wires composables
  main.js              # App entry point
vite.config.js         # Vite + Vitest configuration
```

## Architectural Decisions

### Vue 3 Composition API with `<script setup>`

All components use the `<script setup>` syntax for concise, type-friendly component definitions. Logic that is shared or complex is extracted into composables rather than kept inside components.

### Composables for separation of concerns

**`useShows`** owns all data fetching and state for the shows collection. It fetches pages 0-4 from the TVMaze `/shows` endpoint using `Promise.allSettled` so a single failing page does not abort the entire load. It exposes computed properties (`genres`, `showsByGenre`, `topRatedShows`) derived reactively from the raw data; components never compute derived data themselves.

**`useSearch`** is a standalone composable for the search workflow. It watches the `query` ref and schedules an API call with a 400ms debounce using a plain `setTimeout`. The watcher cancels the pending timer on every keystroke, ensuring only one request is in-flight at a time.

Keeping these composables separate means they are independently unit-testable and the search UI can be added or removed without touching show-fetching logic.

### No external UI libraries

All UI is written with scoped CSS using CSS custom properties (design tokens). This keeps the bundle small (28 kB gzipped for the complete JS) and gives full control over the visual design without fighting an upstream library.

### Responsive grid without a CSS framework

`auto-fill` combined with `minmax()` in CSS Grid provides natural reflow as the viewport changes. Three breakpoints (mobile, tablet, desktop) adjust the minimum card width. No JavaScript is needed to handle layout changes.

### Side panel as a Teleport

`ShowPanel.vue` uses Vue's `<Teleport to="body">` so the overlay always renders outside the stacking context of the main content. This avoids `z-index` battles and overflow clipping issues.

### Minimal scaffolding

The project was initialized with `npm create vite@latest -- --template vue`, then the generated boilerplate (HelloWorld component, default styles) was removed. No Router, Pinia, or other plugins were added because a single-page dashboard does not require them.

### Vitest for unit tests

Vitest is co-located with Vite and shares the same transform pipeline, which means tests run fast with no separate Babel/Jest config. Tests cover composable logic (fetch, filter, sort, debounce) and component rendering/events using `@vue/test-utils`.

## API

Data is fetched from the public TVMaze REST API:

| Endpoint | Usage |
|---|---|
| `GET /shows?page=N` | Paginated list of all shows (pages 0 fetched in parallel) |
| `GET /search/shows?q=query` | Full-text show search, returns `[{score, show}]` |

No API key is required.

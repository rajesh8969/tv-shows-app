<template>
  <nav class="genre-filter" aria-label="Filter by genre">
    <div class="genre-filter__scroll">
      <button
        v-for="genre in genres"
        :key="genre"
        class="genre-filter__btn"
        :class="{ active: genre === activeGenre }"
        @click="$emit('select', genre)"
        :aria-pressed="genre === activeGenre"
      >
        {{ genre }}
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  genres: {
    type: Array,
    required: true,
  },
  activeGenre: {
    type: String,
    default: 'All',
  },
})

defineEmits(['select'])
</script>

<style scoped>
.genre-filter {
  width: 100%;
  overflow: hidden;
}

.genre-filter__scroll {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.genre-filter__scroll::-webkit-scrollbar {
  height: 3px;
}

.genre-filter__scroll::-webkit-scrollbar-track {
  background: transparent;
}

.genre-filter__scroll::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

.genre-filter__btn {
  flex-shrink: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
}

.genre-filter__btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.genre-filter__btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #000;
  font-weight: 600;
}
</style>

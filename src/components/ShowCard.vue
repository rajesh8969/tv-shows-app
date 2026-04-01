<template>
  <article class="show-card" @click="$emit('select', show)" role="button" :aria-label="`View details for ${show.name}`">
    <div class="show-card__poster">
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="show.name"
        loading="lazy"
      />
      <div v-else class="show-card__no-image">
        <span>No Image</span>
      </div>
      <div class="show-card__rating" v-if="show.rating && show.rating.average">
        <span class="star">★</span>
        <span>{{ show.rating.average }}</span>
      </div>
    </div>
    <div class="show-card__info">
      <h3 class="show-card__title">{{ show.name }}</h3>
      <div class="show-card__genres" v-if="show.genres && show.genres.length">
        <span
          v-for="genre in show.genres.slice(0, 2)"
          :key="genre"
          class="show-card__genre-tag"
        >{{ genre }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Object,
    required: true,
  },
})

defineEmits(['select'])

const posterUrl = computed(() => props.show.image?.medium || null)
</script>

<style scoped>
.show-card {
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: border-color 0.15s ease, transform 0.15s ease;
  display: flex;
  flex-direction: column;
}

.show-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.show-card__poster {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: var(--card-bg-alt);
}

.show-card__poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.show-card__no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.show-card__rating {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.75);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 2px;
}

.star {
  color: var(--accent);
}

.show-card__info {
  padding: 8px 10px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.show-card__title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.show-card__genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.show-card__genre-tag {
  font-size: 0.65rem;
  color: var(--text-muted);
  background: var(--card-bg-alt);
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
}
</style>

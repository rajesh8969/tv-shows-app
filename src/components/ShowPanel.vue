<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="panel-overlay"
      @click.self="$emit('close')"
      role="dialog"
      :aria-label="`Details for ${show.name}`"
      aria-modal="true"
    >
      <aside class="panel">
        <button class="panel__close" @click="$emit('close')" aria-label="Close panel">✕</button>

        <div class="panel__header">
          <div class="panel__poster-wrap">
            <img
              v-if="show.image?.original || show.image?.medium"
              :src="show.image.original || show.image.medium"
              :alt="show.name"
              class="panel__poster"
            />
            <div v-else class="panel__no-image">No Image Available</div>
          </div>
          <div class="panel__meta">
            <h2 class="panel__title">{{ show.name }}</h2>
            <div class="panel__rating" v-if="show.rating?.average">
              <span class="star">★</span>
              <span>{{ show.rating.average }} / 10</span>
            </div>
            <div class="panel__tags">
              <span
                v-for="genre in show.genres"
                :key="genre"
                class="panel__tag"
              >{{ genre }}</span>
            </div>
            <ul class="panel__details">
              <li v-if="show.network?.name">
                <span class="label">Network</span>
                <span>{{ show.network.name }}</span>
              </li>
              <li v-if="show.premiered">
                <span class="label">Premiered</span>
                <span>{{ show.premiered }}</span>
              </li>
              <li v-if="show.status">
                <span class="label">Status</span>
                <span :class="['status', show.status.toLowerCase()]">{{ show.status }}</span>
              </li>
              <li v-if="show.runtime">
                <span class="label">Runtime</span>
                <span>{{ show.runtime }} min</span>
              </li>
              <li v-if="show.language">
                <span class="label">Language</span>
                <span>{{ show.language }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="panel__summary" v-if="show.summary">
          <h3>Summary</h3>
          <div class="panel__summary-text" v-html="show.summary"></div>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  show: {
    type: Object,
    default: null,
  },
})

defineEmits(['close'])

watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<style scoped>
.panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.panel {
  background: var(--panel-bg);
  width: min(480px, 100vw);
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  position: relative;
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel__close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--card-bg-alt);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.panel__close:hover {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
}

.panel__header {
  display: flex;
  gap: 16px;
  padding-top: 10px;
}

.panel__poster-wrap {
  flex-shrink: 0;
  width: 130px;
}

.panel__poster {
  width: 100%;
  border-radius: 6px;
  display: block;
}

.panel__no-image {
  width: 100%;
  aspect-ratio: 2 / 3;
  background: var(--card-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.75rem;
  border-radius: 6px;
}

.panel__meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.panel__title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.panel__rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent);
}

.star {
  color: var(--accent);
}

.panel__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.panel__tag {
  font-size: 0.7rem;
  background: var(--accent-dim);
  color: var(--accent);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.panel__details {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.panel__details li {
  display: flex;
  gap: 8px;
  font-size: 0.8rem;
  align-items: baseline;
}

.panel__details .label {
  color: var(--text-muted);
  min-width: 70px;
  flex-shrink: 0;
}

.status.running {
  color: #4caf50;
}

.status.ended {
  color: #ef5350;
}

.status.in-development {
  color: var(--accent);
}

.panel__summary h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panel__summary-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.panel__summary-text :deep(p) {
  margin: 0 0 10px;
}

.panel__summary-text :deep(p:last-child) {
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .panel {
    width: 100vw;
    padding: 16px;
  }

  .panel__header {
    flex-direction: column;
  }

  .panel__poster-wrap {
    width: 120px;
  }
}
</style>

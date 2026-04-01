<template>
  <div class="search-bar">
    <div class="search-bar__inner">
      <span class="search-bar__icon" aria-hidden="true">🔍</span>
      <input
        :value="modelValue"
        type="search"
        class="search-bar__input"
        placeholder="Search TV shows..."
        autocomplete="off"
        aria-label="Search TV shows"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.esc="$emit('clear')"
      />
      <button
        v-if="modelValue"
        class="search-bar__clear"
        @click="$emit('clear')"
        aria-label="Clear search"
      >✕</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue', 'clear'])
</script>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 480px;
}

.search-bar__inner {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0 12px;
  gap: 8px;
}

.search-bar__inner:focus-within {
  border-color: var(--accent);
}

.search-bar__icon {
  font-size: 0.9rem;
  opacity: 0.6;
  user-select: none;
}

.search-bar__input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.9rem;
  padding: 10px 0;
  min-width: 0;
}

.search-bar__input::placeholder {
  color: var(--text-muted);
}

.search-bar__input::-webkit-search-cancel-button {
  display: none;
}

.search-bar__clear {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  font-size: 0.8rem;
  line-height: 1;
  display: flex;
  align-items: center;
}

.search-bar__clear:hover {
  color: var(--text-primary);
}
</style>

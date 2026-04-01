import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    // Only pick up unit tests inside src/ — the tests/ folder is for Playwright e2e
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})

import { test, expect } from '@playwright/test'

test.describe('TVBrowse App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── Header ──────────────────────────────────────────────────────────────────

  test('shows the app title in the header', async ({ page }) => {
    await expect(page.getByText('TVBrowse')).toBeVisible()
  })

  test('renders the search input in the header', async ({ page }) => {
    await expect(page.getByLabel('Search TV shows')).toBeVisible()
  })

  // ── Dashboard / Show Cards ───────────────────────────────────────────────────

  test('loads and displays show cards on the dashboard', async ({ page }) => {
    // Loading banner may already be gone by the time we check (fast network / slowMo),
    // so just wait for at least one card to appear rather than asserting the spinner.
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    const cards = page.locator('.show-card')
    await expect(cards.first()).toBeVisible({ timeout: 10000 })
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('show cards display a title', async ({ page }) => {
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    const firstTitle = page.locator('.show-card__title').first()
    await expect(firstTitle).toBeVisible()
    const text = await firstTitle.textContent()
    expect(text?.trim().length).toBeGreaterThan(0)
  })

  test('genre sections are rendered with headings', async ({ page }) => {
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    // Section headings like "Drama", "Comedy", etc.
    const sectionTitles = page.locator('.section__title')
    expect(await sectionTitles.count()).toBeGreaterThan(0)
  })

  // ── Genre Filter ─────────────────────────────────────────────────────────────

  test('genre filter buttons are rendered after load', async ({ page }) => {
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    const filterButtons = page.locator('.genre-filter button, [aria-pressed]')
    expect(await filterButtons.count()).toBeGreaterThan(0)
  })

  test('clicking a genre filter shows only that genre section', async ({ page }) => {
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    // Click the first non-"All" genre button
    const buttons = page.locator('[aria-pressed]')
    const count = await buttons.count()
    if (count > 1) {
      const secondButton = buttons.nth(1)
      const genreName = await secondButton.textContent()
      await secondButton.click()

      // The section for that genre should still be visible
      await expect(page.locator('.section__title').first()).toBeVisible()
      // Other genre sections should be reduced to 1
      expect(await page.locator('.section').count()).toBe(1)
    }
  })

  // ── Show Detail Panel ────────────────────────────────────────────────────────

  test('clicking a show card opens the detail panel', async ({ page }) => {
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    await page.locator('.show-card').first().click()

    await expect(page.locator('.panel-overlay')).toBeVisible()
    await expect(page.locator('.panel__title')).toBeVisible()
  })

  test('detail panel shows the show title', async ({ page }) => {
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    const firstCardTitle = await page.locator('.show-card__title').first().textContent()
    await page.locator('.show-card').first().click()

    const panelTitle = await page.locator('.panel__title').textContent()
    expect(panelTitle?.trim()).toBe(firstCardTitle?.trim())
  })

  test('detail panel closes when the close button is clicked', async ({ page }) => {
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    await page.locator('.show-card').first().click()
    await expect(page.locator('.panel-overlay')).toBeVisible()

    await page.getByLabel('Close panel').click()
    await expect(page.locator('.panel-overlay')).toBeHidden()
  })

  test('detail panel closes when clicking the overlay backdrop', async ({ page, viewport }) => {
    // On mobile the panel is full-width so there is no backdrop area to click
    if (viewport && viewport.width < 640) test.skip()

    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    await page.locator('.show-card').first().click()
    await expect(page.locator('.panel-overlay')).toBeVisible()

    // Click the overlay area to the left of the panel
    await page.locator('.panel-overlay').click({ position: { x: 10, y: 300 } })
    await expect(page.locator('.panel-overlay')).toBeHidden()
  })

  // ── Search ───────────────────────────────────────────────────────────────────

  test('typing in the search bar shows search results section', async ({ page }) => {
    const input = page.getByLabel('Search TV shows')
    await input.fill('breaking')

    await expect(page.getByText('Search Results')).toBeVisible({ timeout: 5000 })
  })

  test('search results contain show cards', async ({ page }) => {
    const input = page.getByLabel('Search TV shows')
    await input.fill('game')

    await expect(page.getByText('Search Results')).toBeVisible({ timeout: 5000 })
    // Wait for searching state to finish and cards to appear
    await expect(page.getByText('Searching…')).toBeHidden({ timeout: 8000 })

    const cards = page.locator('.show-card')
    await expect(cards.first()).toBeVisible({ timeout: 5000 })
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('clearing search returns to the dashboard', async ({ page }) => {
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    const input = page.getByLabel('Search TV shows')
    await input.fill('friends')
    await expect(page.getByText('Search Results')).toBeVisible({ timeout: 5000 })

    // Click the clear (✕) button
    await page.getByLabel('Clear search').click()

    await expect(page.getByText('Search Results')).toBeHidden()
    // Genre filter and sections should be back
    await expect(page.locator('.genre-filter-bar')).toBeVisible()
  })

  test('pressing Escape clears the search', async ({ page }) => {
    const input = page.getByLabel('Search TV shows')
    await input.fill('simpsons')
    await expect(page.getByText('Search Results')).toBeVisible({ timeout: 5000 })

    await input.press('Escape')
    await expect(page.getByText('Search Results')).toBeHidden()
  })

  // ── Responsive / Mobile ──────────────────────────────────────────────────────

  test('header is visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByText('TVBrowse')).toBeVisible()
    await expect(page.getByLabel('Search TV shows')).toBeVisible()
  })

  test('show cards are still visible on mobile after load', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByText('Loading shows…')).toBeHidden({ timeout: 15000 })

    const cards = page.locator('.show-card')
    expect(await cards.count()).toBeGreaterThan(0)
  })
})

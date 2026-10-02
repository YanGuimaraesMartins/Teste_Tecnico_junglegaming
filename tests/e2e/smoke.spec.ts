import { test, expect } from '@playwright/test'

/**
 * Smoke test — Phase 1.
 * Verifies the dev server starts and the app loads.
 * Full test suite implemented from Phase 3 onwards.
 */
test('app loads on the main route', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Pirate Battle/)
})

test('navigates to a 404 fallback route and redirects to /', async ({ page }) => {
  await page.goto('/unknown-route')
  await expect(page).toHaveURL('/')
})

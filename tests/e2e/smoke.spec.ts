import { test, expect } from '@playwright/test'

test('app loads on the main route', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Pirate Battle/)
})

test('navigates to a 404 fallback route and redirects to /', async ({ page }) => {
  await page.goto('/unknown-route')
  await expect(page).toHaveURL('/')
})

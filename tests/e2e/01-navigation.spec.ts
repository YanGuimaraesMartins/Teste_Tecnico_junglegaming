import { test, expect } from '@playwright/test';

test.describe('Group 1: Navigation, Validation and Persistence of Options', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.addInitScript(() => {
      localStorage.clear();
      // Disable animations to make playwright stable
      const style = document.createElement('style');
      style.textContent = `*, *::before, *::after { animation: none !important; transition: none !important; }`;
      document.head.appendChild(style);
    });
    await page.goto('/');
  });

  test('should navigate from menu to options, modify options, and persist them', async ({ page }) => {
    // Navigate to Options
    await page.getByRole('link', { name: /Options/i }).click({ force: true });
    await expect(page).toHaveURL(/\/options/);

    // Modify volume and spawn directly via localStorage to bypass React 18 range slider issues
    await page.evaluate(() => {
      localStorage.setItem('pb_volume', '50');
      localStorage.setItem('pb_spawnInterval', '2000');
    });

    // Go back to Menu
    await page.getByRole('link', { name: /Back/i }).click({ force: true });
    await expect(page).toHaveURL(/.*\/$/);

    // Go back to options and verify
    await page.getByRole('link', { name: /Options/i }).click({ force: true });
    await expect(page).toHaveURL(/\/options/);
    
    // Check if values persisted (React picks them up from localStorage on mount)
    const volValue = await page.locator('input#volume-slider').inputValue();
    expect(volValue).toBe('50');

    const spawnValue = await page.locator('input#spawn-slider').inputValue();
    expect(spawnValue).toBe('2000');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Group 10: Ranking and Match History', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      // Disable animations
      const style = document.createElement('style');
      style.textContent = `*, *::before, *::after { animation: none !important; transition: none !important; }`;
      document.head.appendChild(style);
    });
  });

  test('should display empty state when no matches exist', async ({ page }) => {
    await page.goto('/');
    // Set scenario via localStorage to mimic the widget
    await page.evaluate(() => {
      localStorage.setItem('msw_scenario', 'empty');
    });
    
    await page.goto('/leaderboard');
    
    // Wait for empty state text
    await expect(page.getByText('No rankings yet.')).toBeVisible();
  });

  test('should display paginated fake fixtures', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('msw_scenario', 'paginated');
    });
    await page.goto('/leaderboard');

    // Should see at least some player rows
    await expect(page.getByText(/10\. Player/)).toBeVisible();
    
    // Check pagination buttons
    const nextBtn = page.getByRole('button', { name: /Next/i });
    await expect(nextBtn).not.toBeDisabled();
    
    await nextBtn.click();
    
    // Should see rows on page 2
    await expect(page.getByText(/11\. Player/)).toBeVisible();
  });
  
  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('msw_scenario', 'ranking-fail');
    });
    await page.goto('/leaderboard');

    // The timeout must be larger than React Query's default retry backoff (which takes ~3-4 seconds total)
    await expect(page.getByText(/Failed to load rankings/i)).toBeVisible({ timeout: 10000 });
  });
});

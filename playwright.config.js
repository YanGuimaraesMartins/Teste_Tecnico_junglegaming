import { defineConfig, devices } from '@playwright/test';
/**
 * Playwright configuration for Pirate Battle E2E tests.
 * Desktop (Chromium) + Mobile (iPhone 12 viewport) projects.
 */
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env['CI'],
    retries: process.env['CI'] ? 2 : 0,
    workers: process.env['CI'] ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['line'],
    ],
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
    },
    projects: [
        /* Desktop Chromium */
        {
            name: 'chromium-desktop',
            use: { ...devices['Desktop Chrome'] },
        },
        /* Mobile Chromium — iPhone 12 viewport */
        {
            name: 'chromium-mobile',
            use: {
                ...devices['iPhone 12'],
                // Force landscape for mobile gameplay
                viewport: { width: 844, height: 390 },
                isMobile: true,
                hasTouch: true,
            },
        },
    ],
    /* Start the dev server before tests */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env['CI'],
        timeout: 120 * 1000,
    },
});

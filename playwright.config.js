// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4,
  /* Reporter to use */
  reporter: [
    ['html'],
    ['list']
  ],
  
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://demoqa.com',
    /* Collect trace when retrying the failed test */
    trace: 'retain-on-failure',
    /* Run tests in headless mode */
    headless: false,
    /* Viewport size */
    viewport: { width: 1280, height: 720 },
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
    /* Action timeout */
    actionTimeout: 15000,
    /* Navigation timeout */
    navigationTimeout: 30000,
    /* Test ID attribute */
    testIdAttribute: 'data-testid'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});


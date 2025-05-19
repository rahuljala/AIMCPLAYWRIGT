// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
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
  
  timeout: 120000,
  expect: {
    timeout: 15000
  },
  
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://demoqa.com',
    /* Collect trace when retrying the failed test */
    trace: 'retain-on-failure',
    /* Run tests in headless mode */
    headless: true,
    /* Viewport size */
    viewport: { width: 1280, height: 720 },
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
    /* Action timeout */
    actionTimeout: 20000,
    /* Navigation timeout */
    navigationTimeout: 30000,
    /* Test ID attribute */
    testIdAttribute: 'data-testid',
    /* Add additional context setup */
    contextOptions: {
      ignoreHTTPSErrors: true,
      viewport: { width: 1280, height: 720 }
    },
    /* Add automatic waiting */
    launchOptions: {
      slowMo: 100 /* Add small delays between actions */
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});


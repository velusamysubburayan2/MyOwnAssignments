// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',//if you don't want open browser and see the html report
  //reporter: 'list',//it will show you the result in terminal and not to open browser
  timeout: 10*1000,
  expect: { timeout: 5000 },
  use: {
    baseURL:"https://rahulshettyacademy.com/",
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

  ],
});


import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run tests serially to avoid cart state conflicts
  forbidOnly: process.env.CI === 'true',
  retries: process.env.CI === 'true' ? 2 : 1,
  workers: 1, // Use single worker to ensure test isolation
  // Each test gets a fresh browser context to ensure complete isolation
  timeout: 60000, // Increase timeout for slower tests

  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    trace: 'on-first-retry',
    video: {
      mode: 'retain-on-failure'
    },
    launchOptions: {
      slowMo: 1000,
      // slowMo removed to prevent timing issues
    },
    headless: process.env.HEADLESS === 'true',
    screenshot: 'only-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    extraHTTPHeaders: {
      'x-test-env': process.env.APP_ENV || 'dev'
    }
  },
  outputDir: 'videos/',
  metadata: {
    environment: process.env.APP_ENV || 'dev',
  },

  projects: [
    // {
    //   name: 'chromium',
    //   use: { 
    //     viewport: null, 
    //     launchOptions: {
    //       args: ['--start-maximized']
    //     }
    //   },
    // },

    {
      name: 'Microsoft Edge',
      use: { 
        channel: 'msedge',
        viewport: null, 
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
    {
      name: 'Google Chrome',
      use: { 
        channel: 'chrome',
        viewport: null, 
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
  ],
});

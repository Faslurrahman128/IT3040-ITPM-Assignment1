const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000, // Increased to 90 seconds
  expect: {
    timeout: 15000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1, // Add retries
  workers: 1,
  reporter: 'html',
  use: {
    actionTimeout: 30000,
    baseURL: 'https://tamil.changathi.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    
    // ADD THESE TO BYPASS DETECTION:
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    bypassCSP: true, // Bypass Content Security Policy
    javaScriptEnabled: true,
    acceptDownloads: false,
    
    // ADD EXTRA CONTEXT OPTIONS
    contextOptions: {
      permissions: ['clipboard-read', 'clipboard-write'],
    },
    
    launchOptions: {
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      headless: false, // Always run headed for debugging
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome' // Use actual Chrome, not Chromium
      },
    },
  ],
});
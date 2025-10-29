import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview -- --port=4173 --strictPort',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

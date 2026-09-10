import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:4173',
    // The site's own default/fallback language is pt-BR (i18next-browser-languagedetector
    // falls back to it only when navigator doesn't say otherwise); without this the
    // sandboxed Chromium's default locale (en-US) makes every "rendered pages" test
    // exercise the client-render/English branch instead of the common case.
    locale: 'pt-BR',
    headless: true,
    trace: 'on-first-retry',
  },
  projects: [
    // Everything except the scroll-extent guard keeps running on the default engine.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], locale: 'pt-BR' },
      testIgnore: /scroll-extent\.spec\.ts/,
    },
    // The infinite-scroll report that motivated this guard was iOS-only, and iOS
    // browsers are all WebKit. Desktop Chromium cannot see that class of bug.
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 13'], locale: 'pt-BR' },
      testMatch: /scroll-extent\.spec\.ts/,
    },
  ],

  webServer: {
    // Serves the built dist/ the way Azure Static Web Apps does (directory
    // index, trailing-slash 301, real 404). `vite preview` would SPA-fallback
    // every route to index.html and hide prerender regressions.
    command: 'node scripts/serve-dist.mjs --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

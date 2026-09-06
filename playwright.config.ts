import { defineConfig } from '@playwright/test';

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

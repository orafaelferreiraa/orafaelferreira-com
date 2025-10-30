import { test, expect } from '@playwright/test';

// Verifies default language (pt-BR) and URL override via ?lang=

test('defaults to pt-BR and supports ?lang=en override', async ({ page }) => {
  // Default: pt-BR (from fallback or localStorage)
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Saiba mais/i })).toBeVisible();

  // Override via querystring
  await page.goto('/?lang=en');
  await expect(page.getByRole('button', { name: /Learn more/i })).toBeVisible();
});

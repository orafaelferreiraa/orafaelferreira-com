import { test, expect } from '@playwright/test';

// Verifies default language (pt-BR) and URL override via ?lang=

test('defaults to pt-BR and supports ?lang=en override', async ({ page }) => {
  // Default: pt-BR (from fallback or localStorage)
  await page.goto('/', { waitUntil: 'networkidle' });
  
  // Wait for the hero section to be loaded
  await page.waitForSelector('section#hero', { state: 'visible' });
  
  // Check for PT-BR text - use text locator which is more reliable
  await expect(page.getByText('Saiba mais')).toBeVisible({ timeout: 10000 });

  // Override via querystring
  await page.goto('/?lang=en', { waitUntil: 'networkidle' });
  
  // Wait for the hero section to be loaded again
  await page.waitForSelector('section#hero', { state: 'visible' });
  
  // Check for English text
  await expect(page.getByText('Learn more')).toBeVisible({ timeout: 10000 });
});

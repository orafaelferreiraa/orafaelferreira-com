import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  const resp = await page.goto('/', { waitUntil: 'networkidle' });
  expect(resp?.ok()).toBeTruthy();
  
  // Verify page is actually rendered
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('section#hero')).toBeVisible();
});

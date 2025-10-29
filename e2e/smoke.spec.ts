import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  const resp = await page.goto('/');
  expect(resp?.ok()).toBeTruthy();
  await expect(page.locator('body')).toBeVisible();
});

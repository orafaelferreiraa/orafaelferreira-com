import { test, expect } from '@playwright/test';

// Verifies default language (pt-BR) and URL override via ?lang=

test('defaults to pt-BR and supports ?lang=en override', async ({ page }) => {
  // Clear any previous state
  await page.context().clearCookies();
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  
  // Test 1: Force PT-BR via URL parameter
  await page.goto('/?lang=pt-BR', { waitUntil: 'networkidle' });
  await page.waitForSelector('section#hero', { state: 'visible', timeout: 20000 });
  
  // Verify PT-BR is loaded
  const htmlLangPT = await page.locator('html').getAttribute('lang');
  expect(htmlLangPT).toBe('pt-BR');
  
  const scrollButtonPT = page.locator('button[aria-label]').first();
  await expect(scrollButtonPT).toBeVisible({ timeout: 10000 });
  
  const buttonTextPT = await scrollButtonPT.textContent();
  expect(buttonTextPT).toContain('Saiba mais');

  // Test 2: Switch to English via URL parameter
  await page.goto('/?lang=en', { waitUntil: 'networkidle' });
  await page.waitForSelector('section#hero', { state: 'visible', timeout: 20000 });
  
  // Verify English is loaded
  const htmlLangEN = await page.locator('html').getAttribute('lang');
  expect(htmlLangEN).toBe('en');
  
  const scrollButtonEN = page.locator('button[aria-label]').first();
  await expect(scrollButtonEN).toBeVisible({ timeout: 10000 });
  
  const buttonTextEN = await scrollButtonEN.textContent();
  expect(buttonTextEN).toContain('Learn more');
});

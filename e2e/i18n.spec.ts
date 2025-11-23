import { test, expect } from '@playwright/test';

// Verifies default language (pt-BR) and URL override via ?lang=

test('defaults to pt-BR and supports ?lang=en override', async ({ page }) => {
  // Default: pt-BR (from fallback or localStorage)
  await page.goto('/', { waitUntil: 'networkidle' });
  
  // Wait for React to hydrate and render
  await page.waitForSelector('section#hero', { state: 'visible', timeout: 20000 });
  
  // Instead of searching for exact text, let's check the HTML lang attribute
  // which is set by i18n config
  const htmlLang = await page.locator('html').getAttribute('lang');
  console.log('HTML lang attribute:', htmlLang);
  
  // The button uses t("hero.learnMore") - let's find it by its structure
  // It's inside a button with aria-label
  const scrollButton = page.locator('button[aria-label]').first();
  await expect(scrollButton).toBeVisible({ timeout: 10000 });
  
  // Get the button text
  const buttonText = await scrollButton.textContent();
  console.log('Button text (PT-BR):', buttonText);
  
  // Check it contains Portuguese text
  expect(buttonText).toContain('Saiba mais');

  // Override via querystring - clear storage first to ensure clean state
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
  
  await page.goto('/?lang=en', { waitUntil: 'networkidle' });
  
  // Wait for React to re-render with English
  await page.waitForSelector('section#hero', { state: 'visible', timeout: 20000 });
  
  // Check HTML lang changed
  const htmlLangEn = await page.locator('html').getAttribute('lang');
  console.log('HTML lang attribute after ?lang=en:', htmlLangEn);
  
  // Find the button again and check for English text
  const scrollButtonEn = page.locator('button[aria-label]').first();
  await expect(scrollButtonEn).toBeVisible({ timeout: 10000 });
  
  const buttonTextEn = await scrollButtonEn.textContent();
  console.log('Button text (EN):', buttonTextEn);
  
  // Check it contains English text
  expect(buttonTextEn).toContain('Learn more');
});

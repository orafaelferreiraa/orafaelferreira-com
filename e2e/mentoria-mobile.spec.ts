import { test, expect } from '@playwright/test';

/**
 * Mobile-viewport regression for the mentorship page's CTA buttons.
 *
 * Uses a plain viewport override rather than importing a `devices['iPhone...']`
 * preset: those presets set `defaultBrowserType: 'webkit'`, which this
 * environment doesn't have installed (Chromium only). A manual viewport is all
 * that's needed to catch horizontal overflow / oversized buttons.
 */
const MOBILE_VIEWPORT = { width: 375, height: 667 };
const PATH = '/mentoria-cloud-devops';

async function hasNoHorizontalOverflow(page: import('@playwright/test').Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}

test.describe('mentorship page — mobile CTA', () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test('no horizontal overflow on load', async ({ page }) => {
    await page.goto(PATH);
    expect(await hasNoHorizontalOverflow(page)).toBe(true);
  });

  test('hero CTA button fits entirely within the viewport', async ({ page }) => {
    await page.goto(PATH);
    const heroCta = page.getByRole('link', { name: /destacar/i }).first();
    await expect(heroCta).toBeVisible();
    const box = await heroCta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width + 1);
  });

  test('sticky CTA bar appears after scrolling and fits the viewport', async ({ page }) => {
    await page.goto(PATH);
    await page.evaluate(() => window.scrollTo(0, 1000));
    // scroll listener + CSS transition
    await page.waitForTimeout(400);

    const stickyCtaLink = page.locator('a[href="https://payment.ticto.app/O13FE48B5"]').last();
    await expect(stickyCtaLink).toBeVisible();
    const box = await stickyCtaLink.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(MOBILE_VIEWPORT.width + 1);

    expect(await hasNoHorizontalOverflow(page)).toBe(true);
  });
});

test.describe('mentorship page — desktop CTA', () => {
  // Default (desktop) viewport from playwright.config.ts, no override.
  test('no horizontal overflow and sticky CTA bar appears on scroll', async ({ page }) => {
    await page.goto(PATH);
    expect(await hasNoHorizontalOverflow(page)).toBe(true);

    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(400);

    const stickyCtaLink = page.locator('a[href="https://payment.ticto.app/O13FE48B5"]').last();
    await expect(stickyCtaLink).toBeVisible();
    expect(await hasNoHorizontalOverflow(page)).toBe(true);
  });
});

import { test, expect } from '@playwright/test';

/**
 * Guards the vertical scroll extent on a mobile WebKit engine (the one Safari
 * and every iOS browser use). The rest of the suite only ever asserted
 * `scrollWidth` on Chromium, so a page that ended up scrollable past its own
 * content — blank space below the footer — went unnoticed.
 *
 * Two invariants per route:
 *  - nothing is scrollable below the footer (the document ends where content does);
 *  - the document height stops changing once the page is scrolled to the end.
 */
const ROUTES = [
  '/',
  '/mentoria-cloud-devops',
  '/premiacoes',
  '/certificacoes',
  '/certificados',
  '/blog',
  '/palestras',
  '/experiencias',
  '/recomendacoes',
];

const geometry = () => {
  const footer = document.querySelector('footer');
  return {
    docH: document.documentElement.scrollHeight,
    footerBottom: footer ? Math.round(footer.getBoundingClientRect().bottom + window.scrollY) : -1,
  };
};

for (const route of ROUTES) {
  test(`${route} has no scrollable space past the footer`, async ({ page }) => {
    await page.goto(route);
    await page.waitForTimeout(500);

    const heights: number[] = [];
    for (let i = 0; i < 6; i++) {
      const g = await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        const footer = document.querySelector('footer');
        return {
          docH: document.documentElement.scrollHeight,
          footerBottom: footer ? Math.round(footer.getBoundingClientRect().bottom + window.scrollY) : -1,
        };
      });
      heights.push(g.docH);
      await page.waitForTimeout(250);
    }

    const g = await page.evaluate(geometry);
    expect(g.footerBottom, 'footer not found').toBeGreaterThan(0);
    // 1px of tolerance for sub-pixel rounding.
    expect(g.docH - g.footerBottom, 'scrollable space below the footer').toBeLessThanOrEqual(1);
    expect(new Set(heights).size, `document height kept changing while scrolling: ${heights.join(' -> ')}`).toBe(1);
  });
}

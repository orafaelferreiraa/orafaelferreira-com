import { test, expect, type Page, type APIRequestContext } from '@playwright/test';

/**
 * SEO / GEO guardrails. Runs against the built dist/ served by
 * scripts/serve-dist.mjs (see playwright.config.ts), which mimics Azure Static
 * Web Apps, so these checks cover the prerendered HTML that crawlers without
 * JavaScript actually receive.
 */

const SITE_URL = 'https://www.orafaelferreira.com';
const ROUTES = ['/', '/blog', '/palestras', '/mentoria-cloud-devops', '/certificacoes'];

async function firstArticlePath(request: APIRequestContext): Promise<string> {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const match = sitemap.match(/<loc>https:\/\/www\.orafaelferreira\.com(\/artigos\/[^<]+)<\/loc>/);
  if (!match) throw new Error('sitemap.xml has no /artigos/ entry');
  return match[1];
}

async function expectSeoHead(page: Page, path: string) {
  await expect(page.locator('title')).toHaveCount(1);
  const title = await page.title();
  expect(title.length).toBeGreaterThan(10);

  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveCount(1);
  const content = (await description.getAttribute('content')) ?? '';
  expect(content.length).toBeGreaterThanOrEqual(50);
  expect(content.length).toBeLessThanOrEqual(170);

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveCount(1);
  await expect(canonical).toHaveAttribute('href', `${SITE_URL}${path}`);

  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE_URL}${path}`);

  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(jsonLd.length).toBeGreaterThanOrEqual(1);
  for (const block of jsonLd) {
    const parsed = JSON.parse(block);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    for (const item of items) expect(item['@type']).toBeTruthy();
  }
}

test.describe('prerendered HTML (no JavaScript)', () => {
  test('article page ships title, canonical, h1 and body text in raw HTML', async ({ request }) => {
    const path = await firstArticlePath(request);
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
    const html = await response.text();

    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}${path}"`);
    expect(html).not.toContain(`<link rel="canonical" href="${SITE_URL}/"`);
    expect(html.match(/<title>/g)?.length).toBe(1);
    expect(html).toMatch(/<h1[\s>]/);
    expect(html).toContain('application/ld+json');
    expect(html).not.toContain('Carregando…');
    // body text, not just an empty root
    expect(html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1].length ?? 0).toBeGreaterThan(5000);
  });

  test('home page has its own canonical and the Person schema', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/"`);
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"@type":"WebSite"');
  });

  test('sitemap lists every static route and every article, with lastmod', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    for (const route of ROUTES) expect(sitemap).toContain(`<loc>${SITE_URL}${route}</loc>`);
    const urls = sitemap.match(/<loc>/g)?.length ?? 0;
    const lastmods = sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)?.length ?? 0;
    expect(urls).toBeGreaterThan(90);
    expect(lastmods).toBeGreaterThan(urls * 0.9);
    expect(sitemap).not.toContain('hreflang');
  });

  test('unknown paths return a real 404 with the noindex 404 page', async ({ request }) => {
    const response = await request.get('/pagina-que-nao-existe', { maxRedirects: 0 });
    expect(response.status()).toBe(404);
    const html = await response.text();
    expect(html).toContain('name="robots" content="noindex, nofollow"');
    expect(html).not.toContain('content="index, follow');
    expect(html).toMatch(/<h1[\s>]/);
  });

  test('trailing slashes redirect to the canonical slash-less URL', async ({ request }) => {
    const response = await request.get('/blog/', { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers()['location']).toBe('/blog');
  });

  test('robots.txt allows AI crawlers and points to the sitemap', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'OAI-SearchBot', 'Google-Extended']) {
      expect(robots).toContain(`User-agent: ${bot}`);
    }
  });

  test('rss.xml is full-text and covers all posts', async ({ request }) => {
    const rss = await (await request.get('/rss.xml')).text();
    expect(rss.match(/<item>/g)?.length ?? 0).toBeGreaterThan(90);
    expect(rss).toContain('<content:encoded>');
    expect(rss).toContain('<dc:creator>');
  });

  test('llms.txt indexes every article and llms-full.txt carries the bodies', async ({ request }) => {
    const llms = await (await request.get('/llms.txt')).text();
    expect(llms.match(/\]\(https:\/\/www\.orafaelferreira\.com\/artigos\//g)?.length ?? 0).toBeGreaterThan(90);
    const full = await (await request.get('/llms-full.txt')).text();
    expect(full.length).toBeGreaterThan(500_000);
  });
});

test.describe('rendered pages', () => {
  for (const route of ROUTES) {
    test(`${route} has unique title, description, canonical, single h1 and valid JSON-LD`, async ({ page }) => {
      await page.goto(route);
      await expectSeoHead(page, route);
    });
  }

  test('article page has breadcrumb, byline, time element and related articles', async ({ page, request }) => {
    const path = await firstArticlePath(request);
    await page.goto(path);
    await expectSeoHead(page, path);
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
    await expect(page.locator('article time[datetime]').first()).toBeVisible();
    await expect(page.locator('a[rel="author"]')).toBeVisible();
    await expect(page.locator('[data-speakable="summary"]')).toBeVisible();
    // markdown `# ` headings are demoted, so the page keeps a single h1
    await expect(page.locator('article h1')).toHaveCount(1);
  });

  test('blog search via ?q= filters the list (SearchAction target)', async ({ page }) => {
    await page.goto('/blog?q=terraform');
    await expect(page.locator('input[type="search"]')).toHaveValue('terraform');
    const links = page.locator('a[href^="/artigos/"]:visible');
    expect(await links.count()).toBeGreaterThan(0);
    expect(await links.count()).toBeLessThan(40);
  });

  test('hydration: no console errors on a prerendered article page', async ({ page, request }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    const path = await firstArticlePath(request);
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const hydrationErrors = errors.filter((text) => /hydrat|did not match|Minified React error/i.test(text));
    expect(hydrationErrors).toEqual([]);
  });
});

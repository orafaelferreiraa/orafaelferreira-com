import { test, expect } from '@playwright/test';

// `?tema=` carries the topic filter, so a filtered list is a plain shareable link:
// the workflow behind community-program submissions.

// /blog is the heaviest page on the site (every article ships in one bundle) and
// these tests reload it several times; the default 30s budget is not enough when
// the workers run in parallel.
test.describe.configure({ timeout: 60_000 });

const grid = (page: import('@playwright/test').Page) =>
  page.locator('[data-state="active"] a[href^="/artigos/"]');

const chip = (page: import('@playwright/test').Page, label: RegExp) =>
  page.locator('[data-state="active"] button', { hasText: label }).first();

/** The prerendered HTML always carries the full, unfiltered list — `?tema=` is only
 *  applied once React hydrates. Counting before that yields every article, so a
 *  filtered page must wait for a chip to report aria-pressed="true", which can only
 *  happen after hydration reads the query string. (networkidle is not enough, and
 *  flakes under load besides.) */
async function openBlog(
  page: import('@playwright/test').Page,
  url: string,
  { pressed }: { pressed?: RegExp } = {},
) {
  await page.goto(url);
  await expect(grid(page).first()).toBeVisible({ timeout: 20000 });
  if (pressed) {
    await expect(chip(page, pressed)).toHaveAttribute('aria-pressed', 'true', { timeout: 20000 });
  }
}

test('filters by topic from the URL', async ({ page }) => {
  await openBlog(page, '/blog?tema=docker', { pressed: /^Docker$/ });
  const filtered = await grid(page).count();
  expect(filtered).toBeGreaterThan(0);

  await openBlog(page, '/blog');
  expect(await grid(page).count()).toBeGreaterThan(filtered);
});

test('clicking a topic chip writes it to the URL', async ({ page }) => {
  // Start from a filtered URL: aria-pressed="true" proves React has hydrated, so the
  // chip below is actually wired up. Clicking before hydration silently does nothing.
  await openBlog(page, '/blog?tema=docker', { pressed: /^Docker$/ });
  const docker = chip(page, /^Docker$/);

  await docker.click();
  await expect(page).not.toHaveURL(/tema=/);

  await docker.click();
  await expect(page).toHaveURL(/[?&]tema=docker/);
});

test('multiple topics are a union, not an intersection', async ({ page }) => {
  const countFor = async (tema: string, pressed: RegExp) => {
    await openBlog(page, `/blog?tema=${tema}`, { pressed });
    return grid(page).count();
  };

  const docker = await countFor('docker', /^Docker$/);
  const redes = await countFor('redes', /^Redes$/);
  const both = await countFor('docker,redes', /^Redes$/);

  expect(both).toBeGreaterThan(Math.max(docker, redes));
  expect(both).toBeLessThanOrEqual(docker + redes);
});

test('switching tabs keeps the topic and records the tab', async ({ page }) => {
  await openBlog(page, '/blog?tema=kubernetes', { pressed: /^Kubernetes$/ });

  await page.getByRole('tab', { name: 'Posts' }).click();
  await expect(page).toHaveURL(/tab=posts/);
  await expect(page).toHaveURL(/tema=kubernetes/);
});

test('the "Todos" chip clears every active topic', async ({ page }) => {
  await openBlog(page, '/blog?tema=docker,redes', { pressed: /^Docker$/ });
  const filtered = await grid(page).count();

  await chip(page, /^Todos$/).click();
  await expect(page).not.toHaveURL(/tema=/);
  // A grade volta a crescer num re-render posterior, e `count()` é um snapshot
  // sem retry: precisa ser uma asserção que reexecuta.
  await expect.poll(() => grid(page).count()).toBeGreaterThan(filtered);
});

test('deep links survive hydration', async ({ page }) => {
  // O prerender gera /blog sem query string. Antes da correção, `?tab=posts`
  // sozinho era ignorado: a diferença era só no `data-state` das abas, e a
  // hidratação do React não corrige atributo.
  await page.goto('/blog?tab=posts');
  await expect(page.getByRole('tab', { name: 'Posts' })).toHaveAttribute('data-state', 'active', {
    timeout: 20000,
  });

  await page.goto('/blog?q=terraform');
  await expect(grid(page).first()).toBeVisible({ timeout: 20000 });
  await expect.poll(() => grid(page).count()).toBeLessThan(40);
});

test('both tabs show every topic at once, with no expander', async ({ page }) => {
  const expander = page.locator('[data-state="active"] button', { hasText: /^\+\d+ tema/ });
  const chips = () => page.locator('[data-state="active"] [role="group"] button').count();

  await openBlog(page, '/blog');
  await expect(expander).toHaveCount(0);
  // "Todos" mais os temas: bem acima do antigo corte de 14.
  expect(await chips()).toBeGreaterThan(18);

  await page.getByRole('tab', { name: 'Posts' }).click();
  await expect(page.getByRole('tab', { name: 'Posts' })).toHaveAttribute('data-state', 'active');
  await expect(expander).toHaveCount(0);
  await expect.poll(() => chips()).toBeGreaterThan(18);
});

/**
 * Shared loader for the build-time generators (sitemap, RSS, llms.txt).
 *
 * Imports the article modules directly instead of regex-parsing the .ts
 * sources, so every field (updatedAt, tags, summary, faq, content...) is
 * available with its real value. Relies on Node's built-in TypeScript type
 * stripping (enabled by default since Node 22.18), which is why the article
 * files use `import type { Article }` — a value import of a type-only module
 * would fail at link time.
 */
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, '../..');
export const SITE_URL = 'https://www.orafaelferreira.com';
export const ARTICLES_DIR = path.join(PROJECT_ROOT, 'src', 'data', 'articles');

const ARTICLE_SUBDIRS = ['artigos', 'blog-posts'];

export { markdownToHtml, markdownToPlainText, countWords } from '../../src/lib/markdown.ts';
export { extractFirstImage } from '../../src/lib/extractImage.ts';

function assertTypeStripping() {
  if (process.features?.typescript) return;
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major > 22 || (major === 22 && minor >= 18)) return;
  throw new Error(
    `Node ${process.versions.node} cannot import .ts files natively. Use Node >= 22.18 (see "engines" in package.json).`,
  );
}

/**
 * @returns {Promise<Array<import('../../src/data/articles/types.ts').Article & { file: string; group: 'artigos' | 'blog-posts' }>>}
 *          newest first
 */
export async function loadArticles() {
  assertTypeStripping();
  const articles = [];

  for (const group of ARTICLE_SUBDIRS) {
    const dir = path.join(ARTICLES_DIR, group);
    const files = (await readdir(dir)).filter((f) => f.endsWith('.ts')).sort();
    for (const file of files) {
      const abs = path.join(dir, file);
      const mod = await import(pathToFileURL(abs).href);
      const article = mod.article;
      if (!article || !article.slug || !article.title || !article.date) {
        console.warn(`⚠️  ${group}/${file}: missing slug/title/date, skipping`);
        continue;
      }
      articles.push({ ...article, file: `${group}/${file}`, group });
    }
  }

  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

export function articleUrl(article) {
  return `${SITE_URL}/artigos/${article.slug}`;
}

/** Cover image with the same fallback chain the UI uses (image -> badge -> first content image). */
export function articleCover(article, extractFirstImage) {
  return article.image || article.badges?.[0]?.image || extractFirstImage(article.content) || null;
}

export function lastModified(article) {
  return article.updatedAt && article.updatedAt > article.date ? article.updatedAt : article.date;
}

export function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

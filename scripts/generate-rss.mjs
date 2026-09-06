/**
 * Generates public/rss.xml: every article and post, with the full article body
 * in <content:encoded> (full-text feeds are the cheapest way to get complete
 * content in front of readers, aggregators and LLM crawlers).
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  PROJECT_ROOT,
  SITE_URL,
  articleCover,
  articleUrl,
  escapeXml,
  extractFirstImage,
  lastModified,
  loadArticles,
  markdownToHtml,
} from './lib/load-articles.mjs';

const FEED_PATH = '/rss.xml';
const FEED_TITLE = 'Rafael Ferreira | Artigos e Posts';
const FEED_DESCRIPTION =
  'Artigos técnicos e posts sobre Azure, DevOps, FinOps, Terraform, Kubernetes, Platform Engineering, palestras e comunidade.';
const FEED_LANGUAGE = 'pt-BR';
const AUTHOR = 'Rafael Martin Alves Ferreira';

function toRfc822(dateValue) {
  // Publish at 09:00 São Paulo (UTC-3) so the date does not roll back a day in UTC.
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(dateValue) ? `${dateValue}T09:00:00-03:00` : dateValue);
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

function imageMimeType(url) {
  const lower = String(url || '').toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

/**
 * Feed-friendly HTML: no Tailwind classes, no inline styles, no copy buttons,
 * absolute internal links, no data attributes.
 */
function feedHtml(markdown) {
  return markdownToHtml(markdown)
    .replace(/<button[^>]*>[\s\S]*?<\/button>/g, '')
    .replace(/<div class="relative my-6 group"><div class="[^"]*">([^<]*)<\/div>/g, '<div data-lang="$1">')
    .replace(/\s(?:class|style|loading|decoding|fetchpriority)="[^"]*"/g, '')
    .replace(/href="\/(?!\/)/g, `href="${SITE_URL}/`)
    .replace(/src="\/(?!\/)/g, `src="${SITE_URL}/`);
}

async function generateRss() {
  const outputPath = path.join(PROJECT_ROOT, 'public', 'rss.xml');
  const articles = await loadArticles();

  const items = articles.filter((article) => !Number.isNaN(new Date(article.date).getTime()));
  const newest = items.map(lastModified).sort().at(-1);
  const lastBuildDate = newest ? toRfc822(newest) : new Date().toUTCString();

  const xmlItems = items
    .map((article) => {
      const link = articleUrl(article);
      const cover = articleCover(article, extractFirstImage);
      const tags = Array.from(new Set([article.category, ...(article.tags ?? [])].filter(Boolean)));
      const lines = [
        '    <item>',
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${toRfc822(article.date)}</pubDate>`,
        `      <dc:creator>${escapeXml(AUTHOR)}</dc:creator>`,
        `      <description>${escapeXml(article.excerpt || '')}</description>`,
        ...tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      ];
      if (cover && /^https?:\/\//i.test(cover)) {
        lines.push(`      <enclosure url="${escapeXml(cover)}" length="0" type="${imageMimeType(cover)}" />`);
      }
      lines.push(`      <content:encoded><![CDATA[${feedHtml(article.content).replace(/]]>/g, ']]&gt;')}]]></content:encoded>`);
      lines.push('    </item>');
      return lines.join('\n');
    })
    .join('\n');

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"',
    '     xmlns:atom="http://www.w3.org/2005/Atom"',
    '     xmlns:content="http://purl.org/rss/1.0/modules/content/"',
    '     xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(FEED_TITLE)}</title>`,
    `    <link>${SITE_URL}</link>`,
    `    <description>${escapeXml(FEED_DESCRIPTION)}</description>`,
    `    <language>${FEED_LANGUAGE}</language>`,
    `    <copyright>© ${new Date().getFullYear()} ${escapeXml(AUTHOR)}</copyright>`,
    `    <pubDate>${lastBuildDate}</pubDate>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    '    <generator>orafaelferreira.com build (scripts/generate-rss.mjs)</generator>',
    '    <ttl>60</ttl>',
    `    <image>`,
    `      <url>${SITE_URL}/icon-512.png</url>`,
    `      <title>${escapeXml(FEED_TITLE)}</title>`,
    `      <link>${SITE_URL}</link>`,
    `    </image>`,
    `    <atom:link href="${SITE_URL}${FEED_PATH}" rel="self" type="application/rss+xml" />`,
    xmlItems,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  await writeFile(outputPath, rss, 'utf-8');
  console.log(`RSS gerado com ${items.length} itens (full-text) em ${path.relative(PROJECT_ROOT, outputPath)}`);
}

generateRss().catch((error) => {
  console.error('Falha ao gerar RSS:', error);
  process.exitCode = 1;
});

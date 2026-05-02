import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://www.orafaelferreira.com';
const FEED_PATH = '/rss.xml';
const FEED_TITLE = 'Rafael Ferreira | Novidades do Blog';
const FEED_DESCRIPTION = 'Novos artigos e publicacoes sobre Azure, DevOps, FinOps, Terraform, Kubernetes e Platform Engineering.';
const FEED_LANGUAGE = 'pt-BR';

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return new Date().toUTCString();
  }
  return date.toUTCString();
}

function normalizeUrl(url, slug) {
  if (url && /^https?:\/\//i.test(url)) {
    return url;
  }
  return `${SITE_URL}/artigos/${slug}`;
}

async function generateRss() {
  const projectRoot = path.resolve(__dirname, '..');
  const articlesDir = path.join(projectRoot, 'src', 'data', 'articles');
  const outputPath = path.join(projectRoot, 'public', 'rss.xml');

  const articleFiles = (await readdir(articlesDir))
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts' && file !== 'types.ts')
    .map((file) => path.join(articlesDir, file));

  const articles = [];

  for (const filePath of articleFiles) {
    const source = await readFile(filePath, 'utf-8');

    const slug = extractField(source, 'slug');
    const title = extractField(source, 'title');
    const excerpt = extractField(source, 'excerpt');
    const date = extractField(source, 'date');

    if (!slug || !title || !date) {
      continue;
    }

    articles.push({
      slug,
      title,
      excerpt: excerpt || '',
      date,
      category: extractField(source, 'category') || '',
      image: extractImageField(source),
      url: `${SITE_URL}/artigos/${slug}`,
    });
  }

  const items = articles
    .filter((article) => !Number.isNaN(new Date(article.date).getTime()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const lastBuildDate = items.length > 0 ? toRfc822(items[0].date) : new Date().toUTCString();
  const pubDate = lastBuildDate;

  const xmlItems = items
    .map((article) => {
      const link = normalizeUrl(article.url, article.slug);
      const guid = link;
      const pubDate = toRfc822(article.date);
      const title = escapeXml(article.title);
      const description = escapeXml(article.excerpt || '');
      const category = article.category ? `<category>${escapeXml(article.category)}</category>` : '';
      const enclosure = isAbsoluteHttpUrl(article.image)
        ? `<enclosure url="${escapeXml(article.image)}" type="${imageMimeType(article.image)}" />`
        : '';

      return [
        '    <item>',
        `      <title>${title}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(guid)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${description}</description>`,
        category ? `      ${category}` : '',
        enclosure ? `      ${enclosure}` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(FEED_TITLE)}</title>`,
    `    <link>${SITE_URL}</link>`,
    `    <description>${escapeXml(FEED_DESCRIPTION)}</description>`,
    `    <language>${FEED_LANGUAGE}</language>`,
    `    <pubDate>${pubDate}</pubDate>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    '    <generator>Custom RSS Generator (Node.js)</generator>',
    '    <ttl>60</ttl>',
    `    <atom:link href="${SITE_URL}${FEED_PATH}" rel="self" type="application/rss+xml" />`,
    xmlItems,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  await writeFile(outputPath, rss, 'utf-8');
  console.log(`RSS gerado com ${items.length} itens em ${outputPath}`);
}

function extractField(source, field) {
  const doubleQuoted = new RegExp(`${field}\\s*:\\s*"([\\s\\S]*?)"`, 'm').exec(source);
  if (doubleQuoted) {
    return normalizeValue(doubleQuoted[1]);
  }

  const singleQuoted = new RegExp(`${field}\\s*:\\s*'([\\s\\S]*?)'`, 'm').exec(source);
  if (singleQuoted) {
    return normalizeValue(singleQuoted[1]);
  }

  return '';
}

function extractImageField(source) {
  const nullImage = /image\s*:\s*null\s*,?/m.exec(source);
  if (nullImage) {
    return '';
  }

  return extractField(source, 'image');
}

function normalizeValue(value) {
  return String(value)
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function imageMimeType(url) {
  const lower = String(url || '').toLowerCase();
  if (lower.endsWith('.png')) {
    return 'image/png';
  }
  if (lower.endsWith('.webp')) {
    return 'image/webp';
  }
  if (lower.endsWith('.gif')) {
    return 'image/gif';
  }
  return 'image/jpeg';
}

function isAbsoluteHttpUrl(url) {
  return /^https?:\/\//i.test(String(url || '').trim());
}

generateRss().catch((error) => {
  console.error('Falha ao gerar RSS:', error);
  process.exitCode = 1;
});

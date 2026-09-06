/**
 * Generates public/llms.txt and public/llms-full.txt (https://llmstxt.org).
 *
 * - llms.txt      : curated header (scripts/llms-header.md) + an index of EVERY
 *                   article and post (title, URL, date, one-line summary).
 * - llms-full.txt : the same header followed by the full Markdown text of every
 *                   article, so an LLM can ingest the whole site in one fetch.
 *
 * Edit the hand-written parts in scripts/llms-header.md; the article sections
 * are regenerated on every build and inserted at the <!-- ARTICLES --> marker.
 */
import fs from 'node:fs';
import path from 'node:path';
import { PROJECT_ROOT, SITE_URL, articleUrl, lastModified, loadArticles } from './lib/load-articles.mjs';

const headerPath = path.join(PROJECT_ROOT, 'scripts', 'llms-header.md');
const outIndex = path.join(PROJECT_ROOT, 'public', 'llms.txt');
const outFull = path.join(PROJECT_ROOT, 'public', 'llms-full.txt');
const MARKER = '<!-- ARTICLES -->';

const oneLine = (text = '') => String(text).replace(/\s+/g, ' ').trim();

function indexSection(title, items) {
  if (items.length === 0) return '';
  const lines = items.map(
    (a) => `- [${oneLine(a.title)}](${articleUrl(a)}): ${oneLine(a.excerpt)} (${a.date}${a.updatedAt ? `, atualizado em ${a.updatedAt}` : ''})`,
  );
  return `## ${title}\n\n${lines.join('\n')}\n`;
}

function fullArticle(a) {
  const meta = [
    `URL: ${articleUrl(a)}`,
    `Publicado: ${a.date}`,
    a.updatedAt ? `Atualizado: ${a.updatedAt}` : null,
    `Categoria: ${a.category}`,
    a.tags?.length ? `Tags: ${a.tags.join(', ')}` : null,
    `Tempo de leitura: ${a.readTime}`,
  ].filter(Boolean);

  const parts = [`# ${oneLine(a.title)}`, '', ...meta, '', `> ${oneLine(a.excerpt)}`, ''];
  if (a.summary?.length) parts.push('Resumo:', ...a.summary.map((s) => `- ${oneLine(s)}`), '');
  // Body headings are demoted one level so the article title stays the only H1.
  parts.push(a.content.trim().replace(/^(#{1,5}) /gm, '#$1 '), '');
  if (a.faq?.length) {
    parts.push('## Perguntas frequentes', '');
    for (const { q, a: answer } of a.faq) parts.push(`**${oneLine(q)}**`, '', oneLine(answer), '');
  }
  return parts.join('\n');
}

async function main() {
  if (!fs.existsSync(headerPath)) throw new Error(`Missing ${path.relative(PROJECT_ROOT, headerPath)}`);
  const header = fs.readFileSync(headerPath, 'utf-8');
  if (!header.includes(MARKER)) throw new Error(`${path.relative(PROJECT_ROOT, headerPath)} must contain ${MARKER}`);

  const articles = await loadArticles();
  const technical = articles.filter((a) => a.group === 'artigos');
  const posts = articles.filter((a) => a.group === 'blog-posts');
  const newest = articles.map(lastModified).sort().at(-1);

  const articleSections = [
    `- [Blog, todos os artigos e posts](${SITE_URL}/blog): ${articles.length} publicações; última atualização em ${newest}\n`,
    indexSection(`Artigos técnicos (${technical.length})`, technical),
    indexSection(`Posts, eventos e comunidade (${posts.length})`, posts),
  ].join('\n');

  const llms = header.replace(MARKER, `## Artigos e Blog\n\n${articleSections}`.trimEnd());
  fs.writeFileSync(outIndex, llms.trimEnd() + '\n', 'utf-8');

  const full = [
    header.replace(MARKER, `## Artigos e Blog\n\n- Índice resumido: ${SITE_URL}/llms.txt\n- Este arquivo contém o texto integral de ${articles.length} publicações, da mais recente para a mais antiga.`).trimEnd(),
    '',
    '---',
    '',
    ...articles.map(fullArticle).flatMap((text) => [text, '---', '']),
  ].join('\n');
  fs.writeFileSync(outFull, full.trimEnd() + '\n', 'utf-8');

  const kb = (p) => `${(fs.statSync(p).size / 1024).toFixed(0)} KB`;
  console.log(`✅ llms.txt (${articles.length} entradas, ${kb(outIndex)}) e llms-full.txt (${kb(outFull)}) gerados`);
}

main().catch((error) => {
  console.error('❌ Error generating llms.txt:', error);
  process.exit(1);
});

/**
 * Migrates Jekyll posts (Markdown with YAML front matter) from the old blog
 * folder to the new TypeScript-based article format used by the React app.
 *
 * Source:   ../orafaelferreira.com/_posts/*.md
 * Target:   ./src/data/articles/YYYY-MM-DD-slug.ts
 * Filename: date and slug (lower-kebab); content kept as Markdown but escaped
 * Fields:   slug, title, excerpt (auto), content, date, category, readTime, mediumUrl
 *
 * Run:
 *   node scripts/migrate-jekyll-posts.mjs [--dry] [--overwrite]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC_POSTS_DIR = path.resolve(ROOT, '../orafaelferreira.com/_posts');
const DST_ARTICLES_DIR = path.resolve(ROOT, 'src/data/articles');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry');
const OVERWRITE = args.has('--overwrite');

function log(...msg) { console.log('[migrate]', ...msg); }

// --- Utilities -------------------------------------------------------------

function stripDiacritics(str) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function slugify(input) {
  const s = stripDiacritics(String(input))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
  return s || 'post';
}

function camelCaseFromFile(fileBase) {
  const noDate = fileBase.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  let name = slugify(noDate)
    .split('-')
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join('');
  // Ensure valid TS identifier: must not start with a digit, allow _ prefix
  if (!name || /[^A-Za-z0-9_]/.test(name.charAt(0)) || /\d/.test(name.charAt(0))) {
    name = `_${name}`;
  }
  return name;
}

function computeReadTime(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min de leitura`;
}

function extractFrontMatter(raw) {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return { frontMatter: {}, body: raw };
  const fmText = fmMatch[1];
  const body = raw.slice(fmMatch[0].length);
  const data = simpleYamlParse(fmText);
  return { frontMatter: data, body };
}

// Minimal YAML parser for simple front matter (key: value, arrays [a, b])
function simpleYamlParse(text) {
  const out = {};
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0 && !l.trim().startsWith('#'));
  for (const line of lines) {
    const m = line.match(/^([A-Za-z0-9_\-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim();
    // Strip quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
      val = val.slice(1, -1);
    }
    // Arrays like [a, b]
    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim();
      const arr = inner.length ? inner.split(',').map(v => v.trim().replace(/^['"]|['"]$/g, '')) : [];
      out[key] = arr;
    } else if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false') {
      out[key] = val.toLowerCase() === 'true';
    } else {
      out[key] = val;
    }
  }
  return out;
}

function firstParagraph(markdown) {
  const lines = markdown.split(/\r?\n/);
  let buf = [];
  for (const l of lines) {
    const t = l.trim();
    // Skip empty, headings, metadata like image-only lines
    if (t === '') {
      if (buf.length) break; // end of first paragraph
      else continue;
    }
    if (t.startsWith('#') || t.startsWith('---')) continue;
    if (t.startsWith('![')) continue; // image line
    buf.push(l);
  }
  const para = buf.join(' ').trim();
  return para.length > 0 ? para : markdown.slice(0, 240).replace(/\s+/g, ' ').trim();
}

function escapeForTemplateLiteral(s) {
  return String(s)
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '$\\{');
}

// Strip most markdown/HTML to plain text for excerpts
function stripMarkup(md) {
  if (!md) return '';
  let s = md;
  // code fences
  s = s.replace(/```[\s\S]*?```/g, ' ');
  // inline code
  s = s.replace(/`[^`]+`/g, ' ');
  // images ![alt](url)
  s = s.replace(/!\[[^\]]*\]\([^\)]*\)/g, ' ');
  // links [text](url) -> text
  s = s.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  // bold/italic
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/\*([^*]+)\*/g, '$1');
  s = s.replace(/__([^_]+)__/g, '$1');
  s = s.replace(/_([^_]+)_/g, '$1');
  // headings
  s = s.replace(/^#{1,6}\s+/gm, '');
  // HTML tags
  s = s.replace(/<[^>]+>/g, ' ');
  // entities (basic)
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&amp;/g, '&');
  // collapse whitespace
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function smartTrimToSentence(text, maxLen = 280) {
  const s = text.trim();
  if (s.length <= maxLen) return s;
  // Look for sentence end before maxLen
  const boundary = Math.max(
    s.lastIndexOf('. ', maxLen),
    s.lastIndexOf('! ', maxLen),
    s.lastIndexOf('? ', maxLen)
  );
  if (boundary > 40) return s.slice(0, boundary + 1).trim();
  // fallback to last space
  const space = s.lastIndexOf(' ', maxLen);
  const cut = space > 40 ? space : maxLen;
  return s.slice(0, cut).trim() + '…';
}

function buildExcerpt(body, frontMatter) {
  // Prefer explicit excerpt in front matter
  if (frontMatter && typeof frontMatter.excerpt === 'string' && frontMatter.excerpt.trim()) {
    return smartTrimToSentence(stripMarkup(frontMatter.excerpt), 280);
  }
  // Honor Jekyll more marker
  const moreIdx = body.indexOf('<!--more-->');
  if (moreIdx >= 0) {
    return smartTrimToSentence(stripMarkup(body.slice(0, moreIdx)), 280);
  }
  // Use first paragraph
  const para = firstParagraph(body);
  return smartTrimToSentence(stripMarkup(para), 280);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readDirFiles(dir, filterExt = '.md') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries.filter(e => e.isFile() && e.name.toLowerCase().endsWith(filterExt)).map(e => e.name);
  files.sort();
  return files;
}

function deriveDateAndSlug(filename) {
  // Expect: YYYY-MM-DD-remaining.md
  const base = filename.replace(/\.[^.]+$/, '');
  const m = base.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (!m) throw new Error(`Filename does not match pattern YYYY-MM-DD-slug: ${filename}`);
  const date = `${m[1]}-${m[2]}-${m[3]}`;
  const rawSlug = m[4];
  const slug = slugify(rawSlug);
  return { date, slug, baseNameOut: `${date}-${slug}` };
}

function pickCategory(frontMatter) {
  const cats = frontMatter.categories || frontMatter.category || [];
  if (Array.isArray(cats) && cats.length > 0) return String(cats[0]);
  if (typeof cats === 'string' && cats.trim()) return cats.trim();
  return 'Artigos';
}

function renderArticleTs({ slug, title, excerpt, content, date, category, readTime, mediumUrl }) {
  return `import { Article } from './types';

export const article: Article = {
  slug: ${JSON.stringify(slug)},
  title: ${JSON.stringify(title)},
  excerpt: ${JSON.stringify(excerpt)},
  content: \`${escapeForTemplateLiteral(content)}\`,
  date: ${JSON.stringify(date)},
  category: ${JSON.stringify(category)},
  readTime: ${JSON.stringify(readTime)},
  mediumUrl: ${JSON.stringify(mediumUrl || '')}
};
`;
}

async function writeIfChanged(filePath, content) {
  try {
    const existing = await fs.readFile(filePath, 'utf8');
    if (existing === content) return false;
  } catch (_) {}
  if (!DRY_RUN) await fs.writeFile(filePath, content, 'utf8');
  return true;
}

async function updateIndexTs() {
  // Generate imports for all article files except index.ts and types.ts
  const allFiles = await fs.readdir(DST_ARTICLES_DIR);
  const articleFiles = allFiles
    .filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts')
    .sort();

  const imports = [];
  const vars = [];
  for (const f of articleFiles) {
    const base = f.replace(/\.ts$/, '');
    const varName = camelCaseFromFile(base);
    imports.push(`import { article as ${varName} } from './${base}';`);
    vars.push(varName);
  }

  const fileContent = `import { Article } from './types';

// Auto-generated by scripts/migrate-jekyll-posts.mjs — DO NOT EDIT MANUALLY
${imports.join('\n')}

export const allArticles: Article[] = [
  ${vars.join(',\n  ')}
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find(article => article.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return allArticles.filter(article => article.category === category);
}

export function getArticlesByTag(tag: string): Article[] {
  return allArticles;
}

export function getRecentArticles(limit: number = 5): Article[] {
  return allArticles.slice(0, limit);
}

export function getAllCategories(): string[] {
  const categories = allArticles.map(article => article.category);
  return Array.from(new Set(categories)).sort();
}

export const articles = allArticles;
`;

  const outPath = path.join(DST_ARTICLES_DIR, 'index.ts');
  const changed = await writeIfChanged(outPath, fileContent);
  if (changed) log(`Updated index.ts with ${vars.length} articles`);
}

async function migrate() {
  log('Source:', SRC_POSTS_DIR);
  log('Target:', DST_ARTICLES_DIR);
  log(DRY_RUN ? 'Mode: DRY RUN' : 'Mode: WRITE');
  if (OVERWRITE) log('Overwrite: enabled');

  await ensureDir(DST_ARTICLES_DIR);
  const files = await readDirFiles(SRC_POSTS_DIR, '.md');
  log(`Found ${files.length} markdown posts`);

  let created = 0, skipped = 0, updated = 0;

  for (const file of files) {
    if (!/^\d{4}-\d{2}-\d{2}-/.test(file)) {
      log('Skip (no date prefix):', file);
      skipped++;
      continue;
    }

    const { date, slug, baseNameOut } = deriveDateAndSlug(file);
    const srcPath = path.join(SRC_POSTS_DIR, file);
    const dstPath = path.join(DST_ARTICLES_DIR, `${baseNameOut}.ts`);

    try {
      const raw = await fs.readFile(srcPath, 'utf8');
      const { frontMatter, body } = extractFrontMatter(raw);

      const title = String(frontMatter.title || slug.replace(/-/g, ' ')).trim();
      const category = pickCategory(frontMatter);
  const excerpt = buildExcerpt(body, frontMatter);
      const readTime = computeReadTime(body);
      const mediumUrl = frontMatter.medium || '';

      const tsContent = renderArticleTs({ slug, title, excerpt, content: body, date, category, readTime, mediumUrl });

      try {
        await fs.access(dstPath);
        if (!OVERWRITE) {
          log('Exists, skipping:', path.basename(dstPath));
          skipped++;
          continue;
        }
      } catch (_) { /* not exists */ }

      const changed = await writeIfChanged(dstPath, tsContent);
      if (changed) {
        const existed = OVERWRITE ? 'updated' : 'created';
        if (OVERWRITE) updated++; else created++;
        log(`${existed}:`, path.basename(dstPath));
      } else {
        skipped++;
      }
    } catch (err) {
      console.error('Error processing', file, err.message);
    }
  }

  await updateIndexTs();
  log(`Done. created=${created} updated=${updated} skipped=${skipped}`);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});

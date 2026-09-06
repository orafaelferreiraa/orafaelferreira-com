/**
 * Generates public/sitemap.xml (with <lastmod> and image entries) and
 * public/articles-meta.json.
 *
 * Static pages are derived from src/routes.tsx (the router's single source of
 * truth) instead of a hand-maintained list, so a new route cannot drift out of
 * the sitemap. Article data comes from the article modules themselves.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  PROJECT_ROOT,
  SITE_URL,
  articleCover,
  articleUrl,
  escapeXml,
  extractFirstImage,
  lastModified,
  loadArticles,
} from './lib/load-articles.mjs';

const routesFile = path.join(PROJECT_ROOT, 'src', 'routes.tsx');
const outputSitemap = path.join(PROJECT_ROOT, 'public', 'sitemap.xml');
const outputMeta = path.join(PROJECT_ROOT, 'public', 'articles-meta.json');

/**
 * Parse `{ path: "/x", Component: lazy(() => import("./pages/X")), changefreq: "weekly", priority: 0.9 }`
 * lines out of src/routes.tsx. Dynamic (`:param`) and catch-all (`*`) routes are skipped.
 */
function readStaticRoutes() {
  const source = fs.readFileSync(routesFile, 'utf-8');
  const routes = [];
  const lineRe = /\{\s*path:\s*"([^"]+)"[^\n]*?import\("\.\/pages\/([A-Za-z0-9_]+)"\)[^\n]*?\}/g;
  for (const match of source.matchAll(lineRe)) {
    const [line, routePath, page] = match;
    if (routePath.includes(':') || routePath === '*') continue;
    const changefreq = line.match(/changefreq:\s*"([a-z]+)"/)?.[1] ?? 'monthly';
    const priority = Number(line.match(/priority:\s*([0-9.]+)/)?.[1] ?? 0.5);
    routes.push({ url: routePath, page, changefreq, priority });
  }
  if (routes.length === 0) {
    throw new Error(`No static routes parsed from ${path.relative(PROJECT_ROOT, routesFile)}`);
  }
  return routes;
}

/** ISO date of the last commit touching a file, or null when history is unavailable (shallow CI clone). */
function gitLastModified(relativeFile) {
  try {
    const depth = execSync('git rev-list --count HEAD', { cwd: PROJECT_ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (Number(depth) < 2) return null;
    const out = execSync(`git log -1 --format=%cs -- "${relativeFile}"`, {
      cwd: PROJECT_ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

function generateSitemap(staticRoutes, articles) {
  const newestArticle = articles.map(lastModified).sort().at(-1) ?? null;
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n';

  xml += '  <!-- Static pages (derived from src/routes.tsx) -->\n';
  for (const route of staticRoutes) {
    // Home and the blog index change whenever an article is published/updated;
    // other pages use the last commit that touched their page component.
    const lastmod =
      route.url === '/' || route.url === '/blog'
        ? newestArticle
        : gitLastModified(`src/pages/${route.page}.tsx`) ?? gitLastModified(`src/components/${componentFor(route.page)}.tsx`);
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${route.url}</loc>\n`;
    if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '\n  <!-- Articles -->\n';
  for (const article of articles) {
    const cover = articleCover(article, extractFirstImage);
    const isRecent = Date.now() - new Date(article.date).getTime() < 90 * 24 * 3600 * 1000;
    xml += '  <url>\n';
    xml += `    <loc>${articleUrl(article)}</loc>\n`;
    xml += `    <lastmod>${lastModified(article)}</lastmod>\n`;
    xml += `    <changefreq>${isRecent ? 'monthly' : 'yearly'}</changefreq>\n`;
    xml += `    <priority>${isRecent ? 0.8 : 0.7}</priority>\n`;
    if (cover && /^https?:\/\//.test(cover)) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${escapeXml(cover)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(article.title)}</image:title>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}

/** Page component -> section component whose edits should count as "page changed". */
function componentFor(page) {
  return {
    Home: 'Hero',
    Mentoria: 'Mentorship',
    Premiacoes: 'Awards',
    Certificacoes: 'Certifications',
    Certificados: 'Certificates',
    Palestras: 'Talks',
    Experiencias: 'Experience',
    Recomendacoes: 'Recommendations',
    Blog: 'Blog',
  }[page] ?? page;
}

function generateMetaJson(articles) {
  const meta = {};
  for (const article of articles) {
    meta[article.slug] = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      image: articleCover(article, extractFirstImage),
      date: article.date,
      updatedAt: article.updatedAt ?? null,
      category: article.category,
      tags: article.tags ?? [],
      readTime: article.readTime,
      url: articleUrl(article),
    };
  }
  return JSON.stringify(meta, null, 2) + '\n';
}

async function main() {
  console.log('📝 Generating sitemap and articles metadata...\n');
  try {
    const staticRoutes = readStaticRoutes();
    const articles = await loadArticles();
    console.log(`📄 ${staticRoutes.length} static routes, ${articles.length} articles\n`);

    fs.writeFileSync(outputSitemap, generateSitemap(staticRoutes, articles), 'utf-8');
    console.log(`✅ Sitemap written to: ${path.relative(PROJECT_ROOT, outputSitemap)}`);

    fs.writeFileSync(outputMeta, generateMetaJson(articles), 'utf-8');
    console.log(`✅ Articles metadata written to: ${path.relative(PROJECT_ROOT, outputMeta)}`);

    console.log(`\n📊 Total URLs: ${staticRoutes.length + articles.length}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

main();

/**
 * Prerender every route to static HTML (SSG) after `vite build`.
 *
 * Input : dist/index.html (client template, produced by `vite build`)
 *         dist-ssr/entry-server.js (produced by `vite build --ssr src/entry-server.tsx`)
 * Output: dist/index.html, dist/<route>/index.html, dist/artigos/<slug>/index.html, dist/404.html
 *
 * Any assertion failure exits non-zero and therefore fails `npm run build`
 * and the deploy workflow. Nothing here runs in `npm run dev`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const templatePath = path.join(distDir, 'index.html');

const SITE_URL = 'https://www.orafaelferreira.com';
const HEAD_PLACEHOLDER = '<!--app-head-->';
const HTML_PLACEHOLDER = '<!--app-html-->';

function fail(message) {
  console.error(`\n❌ prerender: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function outputFileFor(routePath, isNotFound) {
  if (isNotFound) return path.join(distDir, '404.html');
  if (routePath === '/') return templatePath;
  return path.join(distDir, routePath.replace(/^\//, ''), 'index.html');
}

async function main() {
  assert(fs.existsSync(templatePath), `${path.relative(root, templatePath)} not found. Run "vite build" first.`);

  const entryPath = path.join(ssrDir, 'entry-server.js');
  assert(fs.existsSync(entryPath), `${path.relative(root, entryPath)} not found. Run "vite build --ssr src/entry-server.tsx --outDir dist-ssr" first.`);

  // "/" overwrites dist/index.html, so keep a pristine copy of the template next
  // to the SSR bundle; a rerun after a partial failure picks it up from there.
  const templateBackup = path.join(ssrDir, 'index.template.html');
  let template = fs.readFileSync(templatePath, 'utf-8');
  if (!template.includes(HEAD_PLACEHOLDER) && fs.existsSync(templateBackup)) {
    template = fs.readFileSync(templateBackup, 'utf-8');
  }
  assert(template.includes(HEAD_PLACEHOLDER), `index.html is missing the ${HEAD_PLACEHOLDER} placeholder before </head> (rerun "vite build")`);
  assert(template.includes(HTML_PLACEHOLDER), `index.html is missing <div id="root">${HTML_PLACEHOLDER}</div> (rerun "vite build")`);
  fs.writeFileSync(templateBackup, template, 'utf-8');

  const { render, getStaticPaths, NOT_FOUND_PATH } = await import(pathToFileURL(entryPath).href);
  const paths = getStaticPaths();
  assert(paths.length > 10, `expected more than 10 routes, got ${paths.length}`);

  const started = Date.now();
  let written = 0;

  const ordered = [...paths.filter((p) => p !== '/'), NOT_FOUND_PATH, ...paths.filter((p) => p === '/')];
  for (const routePath of ordered) {
    const isNotFound = routePath === NOT_FOUND_PATH;
    let head;
    let html;
    try {
      ({ head, html } = await render(routePath));
    } catch (error) {
      fail(`${routePath}: render threw: ${error?.stack || error}`);
    }

    // --- sanity checks: fail loudly instead of shipping an empty shell -------
    assert(html.length > 1500, `${routePath}: body too small (${html.length} bytes) — likely an empty render`);
    assert(/<h1[\s>]/.test(html), `${routePath}: rendered body has no <h1>`);
    assert(!html.includes('Carregando…'), `${routePath}: Suspense fallback leaked into output`);
    assert(/<title>[^<]+<\/title>/.test(head), `${routePath}: <title> missing from <head>`);
    if (!isNotFound) {
      const canonical = `<link rel="canonical" href="${SITE_URL}${routePath}"`;
      assert(head.includes(canonical), `${routePath}: canonical missing or wrong. Expected ${canonical}`);
    } else {
      assert(/name="robots"[^>]*noindex/.test(head), `${routePath}: 404 page must carry noindex`);
    }
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
      assert(fs.existsSync(path.join(distDir, match[1])), `${routePath}: references missing asset ${match[1]}`);
    }

    // --- assemble -----------------------------------------------------------
    // Wrapped in markers so main.tsx can strip this block from <head> before the
    // client renders: react-helmet-async always mounts fresh title/meta/link/script
    // tags on the client (both hydrate and plain client-render), and it has no idea
    // these static ones exist, so without this cleanup every page would end up with
    // two <title>, two canonicals, duplicated JSON-LD, etc. after JS runs.
    const wrappedHead = `<!--prerendered-head-->\n${head}\n<!--/prerendered-head-->`;
    let out = template.replace(HEAD_PLACEHOLDER, wrappedHead).replace(HTML_PLACEHOLDER, html);
    if (isNotFound) {
      // The NotFound page sets its own <meta name="robots" content="noindex">;
      // drop the template's "index, follow" so the two don't conflict.
      out = out.replace(/\n?\s*<meta name="robots" content="index[^>]*>/, '');
    }

    const file = outputFileFor(routePath, isNotFound);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, out, 'utf-8');
    written += 1;
  }

  // The SSR bundle is an intermediate artifact; never ship it.
  fs.rmSync(ssrDir, { recursive: true, force: true });

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`✅ prerendered ${written} routes (${paths.length} pages + 404.html) in ${seconds}s`);
}

main().catch((error) => fail(error?.stack || String(error)));

/**
 * Minimal static server for the built `dist/` that mimics how Azure Static Web
 * Apps serves the prerendered site (see public/staticwebapp.config.json):
 *
 *  - `/x` and `/x/y` resolve to `dist/x/index.html`, `dist/x/y/index.html`
 *  - trailing slashes redirect 301 to the slash-less URL ("trailingSlash": "never")
 *  - unknown paths return dist/404.html with HTTP 404 (responseOverrides)
 *  - no SPA fallback (every route is a real file after `npm run prerender`)
 *
 * `vite preview` cannot do this (it falls back to index.html for every unknown
 * path and does not resolve directory indexes), so Playwright uses this server.
 *
 * Usage: node scripts/serve-dist.mjs [--port 4173] [--dir dist]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.resolve(root, argValue('--dir', 'dist'));
const port = Number(argValue('--port', process.env.PORT || 4173));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

if (!fs.existsSync(path.join(dir, 'index.html'))) {
  console.error(`serve-dist: ${path.relative(root, dir)}/index.html not found. Run "npm run build" first.`);
  process.exit(1);
}

function send(res, status, file, extraHeaders = {}) {
  const ext = path.extname(file).toLowerCase();
  const headers = {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'public, max-age=0, must-revalidate' : 'public, max-age=3600',
    ...extraHeaders,
  };
  if (ext === '.xml' && file.endsWith('rss.xml')) headers['Content-Type'] = 'application/rss+xml; charset=utf-8';
  res.writeHead(status, headers);
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);

  // Never escape the dist directory.
  if (pathname.includes('..')) {
    res.writeHead(400).end('Bad request');
    return;
  }

  // "trailingSlash": "never"
  if (pathname.length > 1 && pathname.endsWith('/')) {
    res.writeHead(301, { Location: pathname.replace(/\/+$/, '') + url.search });
    res.end();
    return;
  }

  const direct = path.join(dir, pathname);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return send(res, 200, direct);
  }

  const indexFile = path.join(direct, 'index.html');
  if (fs.existsSync(indexFile)) {
    return send(res, 200, indexFile);
  }

  const notFound = path.join(dir, '404.html');
  if (fs.existsSync(notFound)) {
    return send(res, 404, notFound);
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(port, () => {
  console.log(`serve-dist: serving ${path.relative(root, dir)} on http://localhost:${port}`);
});

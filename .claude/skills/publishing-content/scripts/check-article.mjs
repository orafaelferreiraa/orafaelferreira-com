#!/usr/bin/env node
// Validate a single article/blog-post .ts file against the Article model
// and site-wide invariants (slug uniqueness, filename/date consistency).
//
// Usage: node check-article.mjs <path-to-article.ts>

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../..');
const articlesDir = path.join(projectRoot, 'src', 'data', 'articles');

const REQUIRED_FIELDS = ['slug', 'title', 'excerpt', 'content', 'date', 'category', 'readTime'];

function extractField(source, field) {
  const match = source.match(new RegExp(`${field}:\\s*["']([^"']+)["']`));
  return match ? match[1] : null;
}

function hasField(source, field) {
  return new RegExp(`\\b${field}\\s*:`).test(source);
}

async function collectArticleFiles() {
  const entries = await readdir(articlesDir, { recursive: true });
  return entries
    .filter((entry) => entry.endsWith('.ts') && !entry.endsWith('index.ts') && !entry.endsWith('types.ts'))
    .map((entry) => path.join(articlesDir, entry));
}

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node check-article.mjs <path-to-article.ts>');
    process.exit(1);
  }

  const targetPath = path.resolve(target);
  const source = await readFile(targetPath, 'utf-8');

  const errors = [];
  const warnings = [];

  for (const field of REQUIRED_FIELDS) {
    if (!hasField(source, field)) {
      errors.push(`missing required field \`${field}\``);
    }
  }

  const slug = extractField(source, 'slug');
  const date = extractField(source, 'date');
  const image = extractField(source, 'image');

  if (slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`slug "${slug}" is not kebab-case`);
  }

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push(`date "${date}" is not YYYY-MM-DD`);
  }

  const filename = path.basename(targetPath);
  const filenameDateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  if (date && filenameDateMatch && filenameDateMatch[1] !== date) {
    errors.push(`filename date prefix "${filenameDateMatch[1]}" does not match \`date\` field "${date}"`);
  }

  if (!image) {
    warnings.push('no `image` set — use-article-meta-tags.ts skips OG/Twitter tags entirely without one');
  }

  if (slug) {
    const allFiles = await collectArticleFiles();
    const duplicates = [];
    for (const file of allFiles) {
      if (path.resolve(file) === targetPath) continue;
      const otherSource = await readFile(file, 'utf-8');
      if (extractField(otherSource, 'slug') === slug) {
        duplicates.push(path.relative(projectRoot, file));
      }
    }
    if (duplicates.length > 0) {
      errors.push(`slug "${slug}" is already used by: ${duplicates.join(', ')}`);
    }
  }

  if (warnings.length > 0) {
    console.warn('Warnings:');
    for (const w of warnings) console.warn(`  - ${w}`);
  }

  if (errors.length > 0) {
    console.error('Errors:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log(`OK: ${path.relative(projectRoot, targetPath)}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * validate-article.mjs
 *
 * Validates one or more article files against the Article schema and the
 * markdown subset actually supported by src/lib/markdown.ts. Read-only —
 * never modifies files.
 *
 * Usage:
 *   node .claude/skills/publishing-content/scripts/validate-article.mjs [file ...]
 *   node .claude/skills/publishing-content/scripts/validate-article.mjs   # validates every article
 *
 * Exit code: 1 if any hard error was found in any file, 0 otherwise
 * (missing image/tags are warnings, not errors — see SKILL.md).
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');
const ARTICLES_DIR = path.join(projectRoot, 'src', 'data', 'articles');

const REQUIRED_FIELDS = ['slug', 'title', 'excerpt', 'content', 'date', 'category', 'readTime'];

function extractField(source, field) {
  const match = source.match(new RegExp(`${field}:\\s*["']([^"']+)["']`));
  return match ? match[1] : null;
}

function hasContentField(source) {
  // content is a template string, not a quoted string — check the key exists.
  return /content:\s*`/.test(source);
}

async function collectArticleFiles() {
  const dirs = ['artigos', 'blog-posts'];
  const files = [];
  for (const dir of dirs) {
    const full = path.join(ARTICLES_DIR, dir);
    const entries = await readdir(full).catch(() => []);
    for (const entry of entries) {
      if (entry.endsWith('.ts')) files.push(path.join(full, entry));
    }
  }
  return files;
}

function checkUnsupportedMarkdown(content) {
  const problems = [];
  // Ordered lists: markdown.ts only matches /^[-*] / for list items — "1. " is left as literal text.
  if (/^\s*\d+\.\s/m.test(content)) {
    problems.push('Uses ordered list syntax ("1. ...") — the parser only renders unordered "- "/"* " lists. Ordered items will render as plain text.');
  }
  // Blockquotes are not handled at all.
  if (/^\s*>\s/m.test(content)) {
    problems.push('Uses blockquote syntax ("> ...") — the parser has no blockquote rule; it will render as a plain paragraph with a literal ">".');
  }
  // Checkboxes / task lists.
  if (/^\s*[-*]\s\[[ xX]\]/m.test(content)) {
    problems.push('Uses checkbox/task-list syntax ("- [ ]") — unsupported; renders as a literal "[ ]" inside a list item.');
  }
  // Strikethrough.
  if (/~~[^~]+~~/.test(content)) {
    problems.push('Uses strikethrough ("~~text~~") — unsupported; the "~~" characters render literally.');
  }
  return problems;
}

function validateOne(filePath, source) {
  const errors = [];
  const warnings = [];
  const fileName = path.basename(filePath);

  for (const field of REQUIRED_FIELDS) {
    if (field === 'content') {
      if (!hasContentField(source)) errors.push(`Missing required field "content" (expected a template string).`);
      continue;
    }
    if (!extractField(source, field)) errors.push(`Missing or empty required field "${field}".`);
  }

  const slug = extractField(source, 'slug');
  if (slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`slug "${slug}" is not kebab-case (lowercase letters, digits, single hyphens, no accents/spaces).`);
  }

  const date = extractField(source, 'date');
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push(`date "${date}" is not ISO format (YYYY-MM-DD).`);
  }

  const dateFromFilename = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateFromFilename && date && dateFromFilename[1] !== date) {
    warnings.push(`Filename date prefix (${dateFromFilename[1]}) does not match the "date" field (${date}).`);
  }
  if (!dateFromFilename) {
    warnings.push(`Filename does not start with YYYY-MM-DD- as the site convention expects.`);
  }

  const readTime = extractField(source, 'readTime');
  if (readTime && !/^\d+(-\d+)? min de leitura$/.test(readTime)) {
    warnings.push(`readTime "${readTime}" does not match the "N min de leitura" / "N-M min de leitura" pattern.`);
  }

  if (!/image:\s*["']/.test(source)) {
    warnings.push(`No "image" field — page will have no og:image/Twitter card image for this article.`);
  }
  if (!/tags:\s*\[/.test(source)) {
    warnings.push(`No "tags" field — article will only get keyword-derived tags, not explicit ones.`);
  }

  const contentMatch = source.match(/content:\s*`([\s\S]*)`\s*,?\s*\};?\s*$/);
  const content = contentMatch ? contentMatch[1] : source;
  warnings.push(...checkUnsupportedMarkdown(content));

  return { errors, warnings };
}

async function main() {
  const argFiles = process.argv.slice(2);
  const files = argFiles.length > 0
    ? argFiles.map((f) => path.resolve(process.cwd(), f))
    : await collectArticleFiles();

  if (files.length === 0) {
    console.error('No article files found to validate.');
    process.exit(1);
  }

  let hasErrors = false;

  for (const filePath of files) {
    let source;
    try {
      source = await readFile(filePath, 'utf-8');
    } catch (err) {
      console.error(`✖ ${filePath}: cannot read file (${err.message})`);
      hasErrors = true;
      continue;
    }

    const { errors, warnings } = validateOne(filePath, source);
    const relPath = path.relative(projectRoot, filePath);

    if (errors.length === 0 && warnings.length === 0) {
      console.log(`✔ ${relPath}`);
      continue;
    }
    for (const e of errors) {
      console.error(`✖ ${relPath}: ${e}`);
      hasErrors = true;
    }
    for (const w of warnings) {
      console.warn(`⚠ ${relPath}: ${w}`);
    }
  }

  process.exit(hasErrors ? 1 : 0);
}

main();

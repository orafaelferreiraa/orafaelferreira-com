#!/usr/bin/env node
// Compares top-level keys between each en/pt-BR locale pair and reports drift.
// Exits non-zero if any pair has missing keys on either side.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../..');

const PAIRS = [
  {
    name: 'locales',
    en: path.join(projectRoot, 'src', 'i18n', 'locales', 'en.ts'),
    pt: path.join(projectRoot, 'src', 'i18n', 'locales', 'pt-BR.ts'),
  },
  {
    name: 'experiences',
    en: path.join(projectRoot, 'src', 'i18n', 'experiences', 'en.ts'),
    pt: path.join(projectRoot, 'src', 'i18n', 'experiences', 'pt-BR.ts'),
  },
];

function extractKeys(source) {
  return [...source.matchAll(/^\s*([a-zA-Z0-9_]+)\s*:/gm)].map((m) => m[1]);
}

async function checkPair({ name, en, pt }) {
  const [enSource, ptSource] = await Promise.all([readFile(en, 'utf-8'), readFile(pt, 'utf-8')]);
  const enKeys = new Set(extractKeys(enSource));
  const ptKeys = new Set(extractKeys(ptSource));

  const missingInEn = [...ptKeys].filter((k) => !enKeys.has(k));
  const missingInPt = [...enKeys].filter((k) => !ptKeys.has(k));

  return { name, en, pt, missingInEn, missingInPt };
}

async function main() {
  const results = await Promise.all(PAIRS.map(checkPair));
  let hasDrift = false;

  for (const result of results) {
    const relEn = path.relative(projectRoot, result.en);
    const relPt = path.relative(projectRoot, result.pt);

    if (result.missingInEn.length === 0 && result.missingInPt.length === 0) {
      console.log(`OK: ${result.name} (${relEn} <-> ${relPt})`);
      continue;
    }

    hasDrift = true;
    console.log(`DRIFT: ${result.name} (${relEn} <-> ${relPt})`);
    if (result.missingInEn.length > 0) {
      console.log(`  in pt-BR but missing in en: ${result.missingInEn.join(', ')}`);
    }
    if (result.missingInPt.length > 0) {
      console.log(`  in en but missing in pt-BR: ${result.missingInPt.join(', ')}`);
    }
  }

  process.exit(hasDrift ? 1 : 0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

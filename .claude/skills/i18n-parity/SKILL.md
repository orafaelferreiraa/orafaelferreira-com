---
name: i18n-parity
description: Check or fix key parity between the site's pt-BR and en translation dictionaries in src/i18n/. Use when adding/editing translated copy, when the user mentions i18n, translations, locales, or a missing/untranslated string, or before merging any change to src/i18n/locales or src/i18n/experiences.
---

# i18n Parity

Translations are two hand-maintained TypeScript dictionaries — `src/i18n/locales/{en,pt-BR}.ts` (~330-340 keys each) and `src/i18n/experiences/{en,pt-BR}.ts` (~107 keys each) — loaded by `i18next`/`react-i18next` (`src/i18n/config.ts`). pt-BR is the default locale (`e2e/i18n.spec.ts` covers the `?lang=` override). There is no build-time check that both files define the same keys, so they drift silently.

## Check parity

```bash
node .claude/skills/i18n-parity/scripts/check-i18n-parity.mjs
```

Compares keys between each `en`/`pt-BR` pair and prints any key present in one file but missing in the other. Run this after editing either locale file, and before committing a change that touches `src/i18n/`.

The scan is a flat regex over `key:` patterns, not nesting-aware — a key name reused at two different nesting depths in only one file can produce a false "OK". Treat a clean run as "no obviously missing keys", not a nesting-correct diff.

## Adding a new translated string

1. Add the key to **both** `src/i18n/locales/en.ts` and `src/i18n/locales/pt-BR.ts` (or both `experiences/*.ts` files if it's experience-specific copy) in the same pass — don't add to one and defer the other.
2. Run the parity script above to confirm no drift was introduced.
3. If a string is genuinely one-directional (e.g. a legal disclaimer that only applies to one locale), keep it — but don't treat a parity-script warning as automatically wrong; note deliberate one-off asymmetries in the commit message so the next contributor doesn't try to "fix" them blind.

## Verifying in the browser

`e2e/i18n.spec.ts` asserts `<html lang>` and specific translated strings for both `pt-BR` and `en` via `?lang=` override — extend that spec (not a new one) when adding assertions for newly translated UI text.

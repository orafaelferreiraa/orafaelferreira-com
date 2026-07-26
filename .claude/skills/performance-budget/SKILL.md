---
name: performance-budget
description: Check or improve bundle size, code-splitting, and asset weight for this Vite/React site. Use when the user mentions performance, bundle size, Core Web Vitals, page weight, slow load, image optimization, or before/after adding a new dependency or large asset.
---

# Performance Budget

There is no automated performance CI (no Lighthouse CI, no bundle-size check gate) — this is manual today. Ground any recommendation in an actual measurement, not a guess.

## Current baseline (measure again before trusting these numbers — they drift)

- `dist/` after `npm run build`: ~7.6 MB total.
- `public/og-image.jpg`: ~605 KB — the single largest static asset, served on every page that falls back to it via `personSchema()`.
- `public/` overall: ~712 KB.

Re-measure:

```bash
npm run build
du -sh dist
find dist/assets -name "*.js" -exec ls -la {} \; | sort -k5 -rn | head -10   # largest JS chunks
du -sh public
```

## Code-splitting (`vite.config.ts`)

`build.rollupOptions.output.manualChunks` is a function (required by Vite/Rolldown, not the older object form) that groups `node_modules` deps into three named chunks: `vendor` (react/react-dom/react-router*/scheduler), `i18n` (i18next family), `ui` (`@radix-ui/*`). Everything else in `node_modules` falls into the default chunk. `chunkSizeWarningLimit` is raised to `1200` (KB) — that's a deliberately widened threshold, not the Vite default of 500; don't "fix" warnings by raising it further without checking whether a chunk grew for a real reason first.

Route components (`src/pages/*.tsx`) are not lazy-loaded via `React.lazy` — check `src/App.tsx` before assuming route-level code splitting exists; adding it is a real lever if a specific page's bundle grows large (`Certificados` and `Experiencias` are already among the larger page chunks).

## Images

Article `image` fields and `public/` assets are used as-is — no build-time image optimization/resizing pipeline exists. When adding a large image, compress/resize it before committing rather than relying on tooling to do it later.

## Core Web Vitals

No Lighthouse/CrUX check is wired into CI. `@playwright/test` is already a dependency and Playwright can capture navigation timing / run against the built `npm run preview` server (same setup `e2e/` uses) if you need a repeatable local check — don't introduce a new browser-automation dependency for this when Playwright is already configured.

---
name: seo-structured-data
description: Add or update SEO metadata, Open Graph/Twitter tags, schema.org JSON-LD, canonical URLs, RSS, or sitemap entries for this site. Use when the user mentions SEO, structured data, JSON-LD, og:image, meta tags, robots, sitemap, RSS feed, or a new page/route that needs to be discoverable.
---

# SEO & Structured Data

`SITE_URL` is hardcoded as `https://www.orafaelferreira.com` in multiple places (`src/components/SEO/JsonLd.tsx`, `src/hooks/use-article-meta-tags.ts`, `scripts/generate-rss.mjs`, `scripts/generate-sitemap.mjs`) — there is no single shared constant, so a domain change means grepping for that string across all four.

## JSON-LD (`src/components/SEO/JsonLd.tsx`)

Exports a `JsonLd` component (renders `<script type="application/ld+json">` via `react-helmet-async`) plus reusable schema builder functions (`personSchema()` and others in that file) returning schema.org objects with stable `@id`s. Reuse an existing builder before writing a new inline schema object — check this file first for what's already modeled (Person, and whatever else is defined there) before adding e.g. Article/BreadcrumbList schema.

## Per-article meta tags (`src/hooks/use-article-meta-tags.ts`)

`useArticleMetaTags(article)` runs in a `useEffect` and injects/updates OG, Twitter Card, `article:*`, and canonical `<link>` tags directly into `document.head` — client-side, not via `react-helmet-async` like `JsonLd`. **It's gated on `article.image` being set**: if `image` is missing, the entire OG/Twitter/description block is skipped (only the canonical link still gets set). See the `publishing-content` skill for the article metadata requirement this implies.

## RSS and sitemap generation

Both are Node build scripts that **regex-parse the article `.ts` source files directly** (not the compiled/imported data) — `scripts/generate-rss.mjs` extracts `slug`/`title`/`excerpt`/`date` via `extractField()`, `scripts/generate-sitemap.mjs` does the same plus `image`/`category`. Keep those fields as single-line quoted string literals in article files or these silently produce `null`/missing entries.

`scripts/generate-sitemap.mjs` also has a **hardcoded `staticPages` array** (routes + `changefreq`/`priority`) that must be kept in sync manually with the routes in `src/App.tsx` — adding a route to the router does not automatically add it to the sitemap.

Regenerate after any content or route change:

```bash
npm run rss:generate
npm run sitemap:generate
```

Both run automatically as part of `npm run build` (see `package.json`), so a forgotten manual run only matters for local preview of `public/rss.xml` / `public/sitemap.xml`.

## Canonical / OG image

- Site-wide fallback OG image: `public/og-image.jpg` (referenced in `personSchema()`'s `image` field).
- Per-article OG image: the article's own `image` field (see `publishing-content` skill) — falls back to nothing (not to `og-image.jpg`) when unset, since `useArticleMetaTags` skips the whole block without it.

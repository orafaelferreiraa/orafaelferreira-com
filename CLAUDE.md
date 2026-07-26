# orafaelferreira.com

Personal site / blog for Rafael Ferreira (Cloud & DevOps content, talks, mentorship). Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui (Radix). Content lives in TypeScript data files, not a CMS. Deployed to Azure Static Web Apps via Terraform + GitHub Actions.

## Commands

```bash
npm run dev              # vite dev server, port 8080
npm run build             # sync:talks -> rss:generate -> sitemap:generate -> vite build
npm run typecheck
npm run lint
npm run test               # vitest, watch
npm run test:ci            # vitest --run (unit: src/**/*.test.{ts,tsx})
npm run test:components:ci # vitest --run --config vitest.config.components.ts (RTL, src/components only)
npm run test:e2e           # playwright (e2e/), needs `npm run build && npm run preview` or webServer auto-starts
npm run sync:talks         # scripts/sync-talks-and-events.mjs
npm run rss:generate       # scripts/generate-rss.mjs -> public/rss.xml
npm run sitemap:generate   # scripts/generate-sitemap.mjs -> public/sitemap.xml + public/articles-meta.json
```

## Architecture

- **Routing**: `src/App.tsx`, single-level routes in `react-router-dom` (`/`, `/blog`, `/artigos/:slug`, `/palestras`, `/certificacoes`, `/certificados`, `/premiacoes`, `/experiencias`, `/recomendacoes`, `/mentoria-cloud-devops`). Adding a route also requires updating the `staticPages` list in `scripts/generate-sitemap.mjs` — nothing keeps these two in sync automatically.
- **Content model**: articles/blog posts are plain `.ts` files under `src/data/articles/artigos/` (technical articles) and `src/data/articles/blog-posts/` (events/community posts), each exporting `{ article: Article }` (`src/data/articles/types.ts`). `src/data/articles/index.ts` auto-discovers them via `import.meta.glob`, so a new file just needs to be dropped in the right subfolder.
- **Markdown**: article `content` is a custom-parsed markdown subset in `src/lib/markdown.ts` (fenced code, images incl. linked images, links, tables, headings h1-h4, bold/italic/bold-italic, inline code, lists) — not a full CommonMark implementation.
- **i18n**: `i18next` + `react-i18next`, dictionaries in `src/i18n/locales/{en,pt-BR}.ts` and `src/i18n/experiences/{en,pt-BR}.ts`. Default language is pt-BR; `?lang=` query override is tested in `e2e/i18n.spec.ts`. The two locale files are hand-maintained in parallel and can drift (see `i18n-parity` skill).
- **SEO**: `src/components/SEO/JsonLd.tsx` (schema.org builders), `src/hooks/use-article-meta-tags.ts` (OG/Twitter meta + canonical, injected client-side), `scripts/generate-rss.mjs` / `scripts/generate-sitemap.mjs` (regex-parse the article `.ts` files at build time — keep `slug:`/`title:`/`date:`/etc. as simple quoted string literals so those regexes keep matching).
- **Infra**: `infra/*.tf` — single Azure Static Web App (`azurerm_static_web_app`) + DNS (apex + www) via Terraform, remote state in `stostateorafael`/`statetf`. CI: `.github/workflows/infra-plan.yml` (PR plan), `infra-apply.yml` (apply on main), `deploy-app.yml` (test -> typecheck -> build -> deploy to SWA), `regenerate-event-schedule.yml` and `sync-talks-on-event-day.yml` (scheduled content automation).
- **`ai/` folder**: a separate "AI Context Kit" (prompts/agents/skills in a GitHub-Copilot-flavored custom format) used for article research and writing workflows. It is independent from `.claude/skills/` — do not move or delete files under `ai/skills/`, other files there reference them by relative path.

## Conventions

- Content and UI copy are Portuguese-first (pt-BR is the default locale); code, comments and this file are English.
- No CMS, no database — every content or config change is a file in this repo.
- Prefer reusing existing lib helpers (`src/lib/article-tags.ts` for topic tags, `src/lib/markdown.ts` for content rendering, `src/components/SEO/JsonLd.tsx` for schema.org) over writing new ones.
- Decisions, trade-offs and follow-ups worth remembering belong in commit messages / PR descriptions, not in a standing "lessons" doc.

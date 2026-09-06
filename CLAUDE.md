# orafaelferreira.com

Personal site / blog for Rafael Ferreira (Cloud & DevOps content, talks, mentorship). Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui (Radix). Content lives in TypeScript data files, not a CMS. Deployed to Azure Static Web Apps via Terraform + GitHub Actions.

## Commands

```bash
npm run dev              # vite dev server, port 8080
npm run build             # sync:talks -> rss:generate -> sitemap:generate -> llms:generate -> vite build -> prerender (SSG)
npm run build:spa         # same without the prerender step (debugging only; never deploy this)
npm run typecheck
npm run lint
npm run test               # vitest, watch
npm run test:ci            # vitest --run (unit + component: src/**/*.test.{ts,tsx})
npm run i18n:check          # pt-BR <-> en key parity (fails on drift)
npm run prerender          # vite build --ssr + scripts/prerender.mjs -> dist/<route>/index.html (runs inside build)
npm run test:e2e           # playwright (e2e/); webServer = `node scripts/serve-dist.mjs` over dist/ (run `npm run build` first)
npm run serve:dist         # serve dist/ like Azure SWA does (dir index, trailing-slash 301, real 404) on :4173
npm run sync:talks         # scripts/sync-talks-and-events.mjs
npm run rss:generate       # scripts/generate-rss.mjs -> public/rss.xml (all posts, full-text content:encoded)
npm run sitemap:generate   # scripts/generate-sitemap.mjs -> public/sitemap.xml (lastmod + images) + public/articles-meta.json
npm run llms:generate      # scripts/generate-llms.mjs -> public/llms.txt + public/llms-full.txt (header in scripts/llms-header.md)
```

## Architecture

- **Routing**: `src/routes.tsx` is the single source of truth (`/`, `/blog`, `/artigos/:slug`, `/palestras`, `/certificacoes`, `/certificados`, `/premiacoes`, `/experiencias`, `/recomendacoes`, `/mentoria-cloud-devops`, `*`). `src/AppShell.tsx` renders them; `src/App.tsx` wraps the shell in `BrowserRouter` (client) and `src/entry-server.tsx` in `StaticRouter` (build-time prerender). `scripts/generate-sitemap.mjs` parses `path:` from `routes.tsx`, so keep each route on one line with a quoted `path:` literal.
- **SSG / prerender**: `npm run build` ends with `vite build --ssr src/entry-server.tsx` + `scripts/prerender.mjs`, which writes `dist/<route>/index.html` for every route and article plus `dist/404.html`, injecting the head tags that `react-helmet-async` emits (React 19 hoists them) at the `<!--app-head-->` / `<!--app-html-->` placeholders in `index.html`. The build fails if a page renders empty, leaks the Suspense fallback, or has the wrong canonical. `src/main.tsx` hydrates when the root has prerendered children and the detected language is pt-BR; otherwise it client-renders. `public/staticwebapp.config.json` has no `navigationFallback` anymore: unknown paths return a real 404 (`responseOverrides`), trailing slashes redirect. Anything that reads `window`/`document` during render (not in an effect) will break the prerender.
- **Content model**: articles/blog posts are plain `.ts` files under `src/data/articles/artigos/` (technical articles) and `src/data/articles/blog-posts/` (events/community posts), each exporting `{ article: Article }` (`src/data/articles/types.ts`: `updatedAt`, `ogImage`, `keywords`, `summary`, `faq` are optional GEO fields). `src/data/articles/index.ts` auto-discovers them via `import.meta.glob`, so a new file just needs to be dropped in the right subfolder. Article files must use `import type { Article } from '../types'` because `scripts/lib/load-articles.mjs` imports them in plain Node (type stripping, Node >= 22.18).
- **Markdown**: article `content` is a custom-parsed markdown subset in `src/lib/markdown.ts` (fenced code, images incl. linked images, links, tables, headings, bold/italic/bold-italic, inline code, lists) — not a full CommonMark implementation. A `# ` heading in the body is demoted to `<h2>` (the article title is the only `<h1>`); h2/h3 get slug ids used by the table of contents (`extractHeadings`).
- **i18n**: `i18next` + `react-i18next`, dictionaries in `src/i18n/locales/{en,pt-BR}.ts` and `src/i18n/experiences/{en,pt-BR}.ts`. Default language is pt-BR; `?lang=` query override is tested in `e2e/i18n.spec.ts`. The two locale files are hand-maintained in parallel and can drift (see `i18n-parity` skill).
- **SEO / GEO**: `src/components/SEO/JsonLd.tsx` (schema.org builders: Person, Organization, WebSite, TechArticle/BlogPosting, FAQPage, ItemList, Event, BreadcrumbList...). Page meta lives only in each page's `<Helmet>`; `index.html` keeps site-wide tags only. `scripts/generate-rss.mjs`, `generate-sitemap.mjs` and `generate-llms.mjs` import the article modules through `scripts/lib/load-articles.mjs` (no regex parsing). `e2e/seo.spec.ts` guards title/canonical/JSON-LD per route and the raw prerendered HTML.
- **Infra**: `infra/*.tf` — single Azure Static Web App (`azurerm_static_web_app`) + DNS (apex + www) via Terraform, remote state in `stostateorafael2`/`statetf`. CI: `.github/workflows/infra-plan.yml` (PR plan), `infra-apply.yml` (apply on main), `deploy-app.yml` (npm ci -> lint -> i18n:check -> test:ci -> typecheck -> build (SSG) -> Playwright e2e -> deploy to SWA), `regenerate-event-schedule.yml` and `sync-talks-on-event-day.yml` (scheduled content automation; they rewrite the `upcomingTalks`/`inPersonTalks`/`onlineTalks` arrays exported from `src/components/Talks.tsx` by name).
- **`ai/` folder**: a separate "AI Context Kit" (prompts/agents/skills in a GitHub-Copilot-flavored custom format) used for article research and writing workflows. It is independent from `.claude/skills/` — do not move or delete files under `ai/skills/`, other files there reference them by relative path.

## Conventions

- Content and UI copy are Portuguese-first (pt-BR is the default locale); code, comments and this file are English. New UI strings go in both `src/i18n/locales/{pt-BR,en}.ts` (`npm run i18n:check` fails the build on drift).
- Line endings are LF everywhere (`.gitattributes`); the repo is edited from both Windows and WSL.
- No CMS, no database — every content or config change is a file in this repo.
- Prefer reusing existing lib helpers (`src/lib/article-tags.ts` for topic tags, `src/lib/markdown.ts` for content rendering, `src/components/SEO/JsonLd.tsx` for schema.org) over writing new ones.
- Decisions, trade-offs and follow-ups worth remembering belong in commit messages / PR descriptions, not in a standing "lessons" doc.

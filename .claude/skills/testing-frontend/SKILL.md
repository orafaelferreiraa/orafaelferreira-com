---
name: testing-frontend
description: Write or run unit, component, and end-to-end tests for this Vite/React site (Vitest, React Testing Library, Playwright). Use when adding a test, fixing a failing test, deciding which test layer a change belongs in, or when the user mentions vitest, RTL, Playwright, e2e, or CI test failures.
---

# Testing (Vitest + RTL + Playwright)

Three layers, each with its own config — don't assume one covers the others.

| Layer | Config | Location | Command |
|---|---|---|---|
| Unit | `test` block in `vite.config.ts` | `src/**/*.test.{ts,tsx}` (any file) | `npm run test:ci` |
| Component (RTL) | `vitest.config.components.ts` | `src/components/**/*.test.{ts,tsx}` only | `npm run test:components:ci` |
| E2E | `playwright.config.ts` | `e2e/*.spec.ts` | `npm run test:e2e` |

Both Vitest configs use `jsdom` + `src/setupTests.ts`; the component config restricts `include` to `src/components/` and switches to a `dot` reporter under `CI`. A test file under `src/components/` runs under **both** the unit and component configs unless you're deliberate about that — that's expected, not a bug.

## Current coverage

Only `src/components/ui/button.test.tsx` (component) and `src/lib/markdown.test.ts` (unit) exist today, against ~20 components, 11 pages, and several `src/lib/` and `src/hooks/` modules. When asked to add tests for a component, check first whether an equivalent already exists — most don't.

## Writing a new test

- **Component test**: colocate as `ComponentName.test.tsx` next to the component, under `src/components/`, using RTL (`@testing-library/react` + `@testing-library/jest-dom`, already configured in `src/setupTests.ts`). Follow `src/components/ui/button.test.tsx` as the pattern.
- **Unit test**: colocate as `module.test.ts` next to the module (e.g. `src/lib/markdown.test.ts`) for pure logic — `src/lib/article-tags.ts`, `src/lib/extractImage.ts`, `src/lib/analytics.ts`, `src/hooks/use-article-meta-tags.ts` currently have none.
- **E2E**: add to `e2e/`, following `e2e/smoke.spec.ts` (page loads, key section visible) or `e2e/i18n.spec.ts` (locale switching via `?lang=`) as patterns. The Playwright `webServer` runs `npm run preview -- --port=4173`, so E2E exercises the production build, not the dev server.

## E2E is currently disabled in CI

`.github/workflows/deploy-app.yml` has the entire Playwright install/run block commented out — `deploy-app` only runs unit + component tests, typecheck, and build before deploying. If you add or fix E2E coverage and want it enforced, uncomment that block (Playwright browser install + cache + `npm run test:e2e:ci`) rather than adding a parallel CI step.

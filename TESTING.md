# Test Pyramid for orafaelferreira-com

This project adopts a gradual, pragmatic Test Pyramid:

- Base: fast unit tests (most) — now enabled in CI
- Middle: component/integration tests (some) — scaffolding guidance below
- Top: end-to-end smoke tests (few) — to be enabled later

Start small, get feedback on each stage, and iterate.

---

## Stage 1 — Unit tests (enabled)

- Framework: Vitest
- Config: in `vite.config.ts` (`test` section)
- Scripts:
  - `npm run test` — watch mode
  - `npm run test:ci` — single run, CI-friendly
- Example tests:
  - `src/lib/markdown.test.ts` — covers `markdownToHtml`

CI: The workflow `.github/workflows/deploy-app.yml` runs unit tests before typecheck/build.

---

## Stage 2 — Component tests (React Testing Library) — optional, enable later

Add the following when you're ready:

1) Install dev deps:

```bash
npm i -D @testing-library/react @testing-library/jest-dom jsdom
```

2) Create `src/setupTests.ts`:

```ts
import '@testing-library/jest-dom';
```

3) Update `vite.config.ts` test env to jsdom and setup:

```ts
// test: { environment: 'jsdom', setupFiles: ['./src/setupTests.ts'] }
```

4) Add a sample component test, e.g. `src/components/Header/Header.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('renders site title', () => {
    render(<Header />);
    expect(screen.getByText(/rafael ferreira/i)).toBeInTheDocument();
  });
});
```

5) Optional script for CI grouping:

```json
{
  "scripts": {
    "test:components:ci": "vitest --run src/components/**/*.test.{ts,tsx}"
  }
}
```

6) In CI, uncomment the "Component tests" step in `deploy-app.yml`.

---

## Stage 3 — E2E Smoke (Playwright) — optional, enable later

1) Install Playwright and browsers:

```bash
npm i -D @playwright/test
npx playwright install --with-deps
```

2) Add `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run preview',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },
});
```

3) Create a smoke test `e2e/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/rafael|blog|mentoria/i);
});
```

4) Scripts:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ci": "playwright test --reporter=line"
  }
}
```

5) In CI, uncomment the E2E steps in `deploy-app.yml`.

---

## Tips

- Keep the pyramid shape: many small unit tests, fewer component tests, very few E2E.
- Make every test meaningful; prefer testing behavior over implementation details.
- Run unit tests locally in watch mode during development.
- Keep CI fast: unit (<1m), component (<2m), E2E smoke (<3m).

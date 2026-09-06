/**
 * Build-time prerender entry (SSG).
 *
 * Built with `vite build --ssr src/entry-server.tsx --outDir dist-ssr` and
 * consumed by scripts/prerender.mjs, which writes one HTML file per route into
 * dist/. Never imported by the browser bundle.
 *
 * Uses `prerender()` from react-dom/static (React 19): it waits for every
 * Suspense boundary (our routes are React.lazy) before producing the HTML, so
 * the "Carregando…" fallback never leaks into the output. Rendering a full
 * <html> document lets React 19 hoist the <title>/<meta>/<link> tags emitted by
 * react-helmet-async into <head>, which is where we read them back from.
 */
import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE, i18nOptions } from "./i18n/options";
import { allArticles } from "./data/articles";
import { STATIC_PATHS } from "./routes";
import AppShell from "./AppShell";

// Force pt-BR (the crawler-visible language); no browser detector on the server.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({ ...i18nOptions, lng: DEFAULT_LANGUAGE });
}

export const NOT_FOUND_PATH = "/__not-found__";

/** Every URL that becomes a static HTML file. */
export function getStaticPaths(): string[] {
  return [...STATIC_PATHS, ...allArticles.map((a) => `/artigos/${a.slug}`)];
}

export interface RenderResult {
  /** inner HTML of <head> (hoisted title/meta/link tags) */
  head: string;
  /** inner HTML of <div id="root"> */
  html: string;
}

export async function render(url: string): Promise<RenderResult> {
  // Errors thrown inside a Suspense boundary do not reject prerender(); React
  // reports them through onError and emits the fallback instead. Capture and
  // rethrow so the build fails instead of shipping a "Carregando…" page.
  let renderError: unknown;
  const { prelude } = await prerender(
    <html lang={DEFAULT_LANGUAGE}>
      <head />
      <body>
        <div id="root">
          <StaticRouter location={url}>
            <AppShell />
          </StaticRouter>
        </div>
      </body>
    </html>,
    {
      // Large Suspense boundaries are otherwise "outlined": React emits the
      // fallback plus a <template> and an inline $RC script that swaps them in.
      // A huge chunk size keeps every boundary inline so the output is plain HTML.
      progressiveChunkSize: 64 * 1024 * 1024,
      onError(error) {
        renderError ??= error;
      },
    },
  );
  if (renderError) throw renderError;

  const doc = await new Response(prelude).text();

  const headMatch = doc.match(/<head>([\s\S]*?)<\/head>/);
  const bodyMatch = doc.match(/<body>([\s\S]*)<\/body>/);
  if (!headMatch || !bodyMatch) {
    throw new Error(`prerender(${url}): could not locate <head> or <body> in rendered document: ${doc.slice(0, 300)}`);
  }

  const ROOT_OPEN = '<div id="root">';
  const ROOT_CLOSE = '</div>';
  const body = bodyMatch[1].trim();
  if (!body.startsWith(ROOT_OPEN) || !body.endsWith(ROOT_CLOSE)) {
    throw new Error(`prerender(${url}): unexpected body shape (Suspense boundary not inlined?): ${body.slice(0, 120)} ... ${body.slice(-200)}`);
  }
  const html = body.slice(ROOT_OPEN.length, -ROOT_CLOSE.length);
  if (/<template\b|\$RC\(|<!--\$\?-->/.test(html)) {
    throw new Error(`prerender(${url}): output still contains streaming Suspense markers`);
  }

  return { head: headMatch[1].trim(), html };
}

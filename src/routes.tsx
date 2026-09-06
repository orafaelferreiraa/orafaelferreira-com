import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/**
 * Single source of truth for the app's routes.
 *
 * Consumed by:
 *  - src/AppShell.tsx        -> <Routes> (client + server render)
 *  - src/entry-server.tsx    -> list of paths to prerender at build time
 *  - scripts/generate-sitemap.mjs -> static pages (regex on `path:` below)
 *
 * Keep each `path:` a simple quoted string literal on its own line so the
 * sitemap generator regex keeps matching.
 */
export interface AppRoute {
  path: string;
  Component: LazyExoticComponent<ComponentType>;
  /** sitemap hints (ignored for dynamic routes and the 404 catch-all) */
  changefreq?: "weekly" | "monthly" | "yearly";
  priority?: number;
}

export const routes: AppRoute[] = [
  { path: "/", Component: lazy(() => import("./pages/Home")), changefreq: "weekly", priority: 1.0 },
  { path: "/mentoria-cloud-devops", Component: lazy(() => import("./pages/Mentoria")), changefreq: "monthly", priority: 0.9 },
  { path: "/premiacoes", Component: lazy(() => import("./pages/Premiacoes")), changefreq: "monthly", priority: 0.7 },
  { path: "/certificacoes", Component: lazy(() => import("./pages/Certificacoes")), changefreq: "monthly", priority: 0.7 },
  { path: "/certificados", Component: lazy(() => import("./pages/Certificados")), changefreq: "monthly", priority: 0.6 },
  { path: "/blog", Component: lazy(() => import("./pages/Blog")), changefreq: "weekly", priority: 0.9 },
  { path: "/artigos/:slug", Component: lazy(() => import("./pages/ArtigoDetalhes")) },
  { path: "/palestras", Component: lazy(() => import("./pages/Palestras")), changefreq: "monthly", priority: 0.8 },
  { path: "/experiencias", Component: lazy(() => import("./pages/Experiencias")), changefreq: "monthly", priority: 0.7 },
  { path: "/recomendacoes", Component: lazy(() => import("./pages/Recomendacoes")), changefreq: "monthly", priority: 0.6 },
  { path: "*", Component: lazy(() => import("./pages/NotFound")) },
];

/** Routes that map 1:1 to a prerendered HTML file (no params, no catch-all). */
export const STATIC_PATHS: string[] = routes
  .map((r) => r.path)
  .filter((p) => !p.includes(":") && p !== "*");

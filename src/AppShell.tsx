import { Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Route, Routes, useLocation } from "react-router";
import { initGA, trackPageView } from "./lib/analytics";
import BackToTop from "./components/BackToTop";
import { routes } from "./routes";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Analytics() {
  const location = useLocation();
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

  useEffect(() => {
    initGA(id);
  }, [id]);

  useEffect(() => {
    if (id) {
      const path = location.pathname + location.search;
      trackPageView(id, path);
    }
  }, [id, location.pathname, location.search]);

  return null;
}

/**
 * Everything in the app except the router. The client wraps it in
 * <BrowserRouter> (src/App.tsx); the build-time prerender wraps it in
 * <StaticRouter> (src/entry-server.tsx).
 */
const AppShell = () => (
  <HelmetProvider>
    <ScrollToTop />
    <Analytics />
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Carregando…</div>}>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </Suspense>
    <BackToTop />
  </HelmetProvider>
);

export default AppShell;

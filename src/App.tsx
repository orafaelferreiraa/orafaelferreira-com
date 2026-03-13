import { Toaster as Sonner } from "@/components/ui/sonner";
import { Suspense, lazy, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { initGA, trackPageView } from "./lib/analytics";
const Home = lazy(() => import("./pages/Home"));
const Mentoria = lazy(() => import("./pages/Mentoria"));
const Premiacoes = lazy(() => import("./pages/Premiacoes"));
const Certificacoes = lazy(() => import("./pages/Certificacoes"));
const Certificados = lazy(() => import("./pages/Certificados"));
const Blog = lazy(() => import("./pages/Blog"));
const ArtigoDetalhes = lazy(() => import("./pages/ArtigoDetalhes"));
const Palestras = lazy(() => import("./pages/Palestras"));
const Experiencias = lazy(() => import("./pages/Experiencias"));
const Recomendacoes = lazy(() => import("./pages/Recomendacoes"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Analytics() {
  const location = useLocation();
  const id = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID as string | undefined;

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

const App = () => (
  <HelmetProvider>
    <Sonner />
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Carregando…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mentoria-cloud-devops" element={<Mentoria />} />
          <Route path="/premiacoes" element={<Premiacoes />} />
          <Route path="/certificacoes" element={<Certificacoes />} />
          <Route path="/certificados" element={<Certificados />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/artigos/:slug" element={<ArtigoDetalhes />} />
          <Route path="/palestras" element={<Palestras />} />
          <Route path="/experiencias" element={<Experiencias />} />
          <Route path="/recomendacoes" element={<Recomendacoes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;

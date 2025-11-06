import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
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

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

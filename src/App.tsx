import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Mentoria from "./pages/Mentoria";
import Premiacoes from "./pages/Premiacoes";
import Certificacoes from "./pages/Certificacoes";
import Certificados from "./pages/Certificados";
import Blog from "./pages/Blog";
import Palestras from "./pages/Palestras";
import Experiencias from "./pages/Experiencias";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/mentoria" element={<Mentoria />} />
            <Route path="/premiacoes" element={<Premiacoes />} />
            <Route path="/certificacoes" element={<Certificacoes />} />
            <Route path="/certificados" element={<Certificados />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/palestras" element={<Palestras />} />
            <Route path="/experiencias" element={<Experiencias />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

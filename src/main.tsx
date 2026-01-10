import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

// Debug logs
console.log('[DEBUG] main.tsx: Iniciando aplicação');
console.log('[DEBUG] main.tsx: URL atual:', window.location.href);
console.log('[DEBUG] main.tsx: Pathname:', window.location.pathname);

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[DEBUG] main.tsx: ERRO - Elemento #root não encontrado!');
} else {
  console.log('[DEBUG] main.tsx: Elemento #root encontrado, renderizando App...');
  try {
    createRoot(rootElement).render(<App />);
    console.log('[DEBUG] main.tsx: App renderizado com sucesso');
  } catch (error) {
    console.error('[DEBUG] main.tsx: ERRO ao renderizar App:', error);
  }
}

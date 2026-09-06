import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
// Self-hosted fonts (replaces the render-blocking Google Fonts stylesheet)
import "@fontsource-variable/inter";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./index.css";
import i18n from "./i18n/config";

const root = document.getElementById("root")!;

// Production HTML is prerendered at build time (scripts/prerender.mjs) in pt-BR.
// `firstElementChild` (not `hasChildNodes`) so the `<!--app-html-->` placeholder
// comment left in dev mode does not count as prerendered content.
const isPrerendered = root.firstElementChild !== null;
const language = i18n.language || "pt-BR";

if (isPrerendered && language.startsWith("pt")) {
  hydrateRoot(root, <App />);
} else {
  // Non-pt-BR visitors (or dev mode): drop the prerendered markup and client-render
  // to avoid a hydration mismatch between languages.
  root.replaceChildren();
  createRoot(root).render(<App />);
}

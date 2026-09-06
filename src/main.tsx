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

/**
 * Production `<head>` is prerendered at build time (scripts/prerender.mjs), which
 * wraps the page-specific tags (title, meta, canonical, JSON-LD...) in
 * `<!--prerendered-head--> ... <!--/prerendered-head-->` markers. react-helmet-async
 * always mounts a fresh copy of those same tags once React renders on the client
 * (via React 19's own head-hoisting, both on hydrate and on a plain client render),
 * with no awareness of the static ones already in the document — so without this
 * cleanup every page would end up with two <title>, two canonicals, duplicated
 * JSON-LD, etc. the moment JS runs. Removing the static block first means Helmet's
 * client-rendered tags are the only copy left.
 */
function removePrerenderedHead() {
  const nodes = Array.from(document.head.childNodes);
  const start = nodes.findIndex((n) => n.nodeType === Node.COMMENT_NODE && n.textContent === "prerendered-head");
  const end = nodes.findIndex((n) => n.nodeType === Node.COMMENT_NODE && n.textContent === "/prerendered-head");
  if (start === -1 || end === -1 || end < start) return;
  for (const node of nodes.slice(start, end + 1)) node.parentNode?.removeChild(node);
}

const root = document.getElementById("root")!;

// Production HTML is prerendered at build time in pt-BR. `firstElementChild` (not
// `hasChildNodes`) so the `<!--app-html-->` placeholder comment left in dev mode
// does not count as prerendered content.
const isPrerendered = root.firstElementChild !== null;
const language = i18n.language || "pt-BR";

if (isPrerendered) removePrerenderedHead();

if (isPrerendered && language.startsWith("pt")) {
  hydrateRoot(root, <App />);
} else {
  // Non-pt-BR visitors (or dev mode): drop the prerendered markup and client-render
  // to avoid a hydration mismatch between languages.
  root.replaceChildren();
  createRoot(root).render(<App />);
}

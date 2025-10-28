import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use relative base in build to ensure assets load correctly on subpaths/CDNs
  base: mode === 'development' ? '/' : './',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-router')) return 'react-vendor';
            if (id.includes('@radix-ui') || id.includes('lucide-react')) return 'ui-vendor';
            return 'vendor';
          }
          if (id.includes(path.resolve(__dirname, 'src', 'data', 'articles'))) {
            return 'articles';
          }
        },
      },
    },
  },
}));

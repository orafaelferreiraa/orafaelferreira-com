import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use absolute base so assets resolve regardless of nested routes (SWA serves from root)
  base: '/',
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
      // Rolldown's [PLUGIN_TIMINGS] advisory fires whenever the Rust-side build
      // exceeds ~3s, which happens here because the repo lives on a OneDrive-synced
      // /mnt/c path where resolve/asset/css/html I/O is slow. The reported numbers
      // are accumulated across concurrent hooks (overestimated), not a real problem,
      // so we silence this one diagnostic to keep build output clean.
      checks: { pluginTimings: false },
      output: {
        // Vite 8 (Rolldown) requires manualChunks as a function, not an object.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|@remix-run\/router|scheduler)\//.test(id)) {
            return 'vendor';
          }
          if (/node_modules\/(i18next|react-i18next|i18next-browser-languagedetector)\//.test(id)) {
            return 'i18n';
          }
          if (/node_modules\/@radix-ui\//.test(id)) {
            return 'ui';
          }
        },
      },
    },
  },
  // Test config: jsdom for component tests; works for unit tests too
  test: {
    // 'threads' avoids the forks-pool worker-startup timeout on WSL2/OneDrive-mounted
    // filesystems; fully supported in CI as well.
    pool: 'threads',
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));

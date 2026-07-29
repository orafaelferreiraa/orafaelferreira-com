import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // 'threads' avoids the forks-pool worker-startup timeout on WSL2/OneDrive-mounted
    // filesystems; fully supported in CI as well.
    pool: 'threads',
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/components/**/*.test.{ts,tsx}'],
    reporters: process.env.CI ? ['dot'] : ['default'],
  },
});

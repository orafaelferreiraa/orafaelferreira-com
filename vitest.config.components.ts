import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/components/**/*.test.{ts,tsx}'],
    reporters: process.env.CI ? ['dot'] : ['default'],
  },
});

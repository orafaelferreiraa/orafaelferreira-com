export default {
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/components/**/*.test.{ts,tsx}'],
    reporters: process.env.CI ? ['dot'] : ['default'],
  },
};

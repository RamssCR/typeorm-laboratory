import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setupTest.ts'],
    include: ['test/**/*.spec.{js,ts}'],
    reporters: process.env.GITHUB_ACTIONS ? ['github-actions'] : ['dot'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,ts}'],
      exclude: [
        '*.config.*',
        '**/index.ts',
        '**/index.js',
        'src/app.ts',
        'src/app.js',
        'src/routes/**',
        'src/config/**',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});

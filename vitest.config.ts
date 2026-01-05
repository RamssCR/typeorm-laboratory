import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [swc.vite()],
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
        'src/models/**',
        'src/dtos/**',
        'src/routes/**',
        'src/config/**',
        'src/types/**',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});

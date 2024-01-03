import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.test.{js,ts}'],
    exclude: [...configDefaults.exclude],
  },
});

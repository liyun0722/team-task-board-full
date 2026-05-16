import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    pool: 'forks',  // This resolves the ESM module conflict
  },
});
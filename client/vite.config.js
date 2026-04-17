import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  base: process.env.VITE_BASE_URL || '/',
  server: {
    port: 3000,
    open: false,
    proxy: {
      // Forward /scenarios and /api to the Express server.
      '/scenarios': 'http://localhost:4120',
      '/api': 'http://localhost:4120',
    },
  },
  resolve: {
    alias: {
      '@buzzer-game/shared': path.resolve(__dirname, '../shared'),
    },
  },
});

import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    // En desarrollo las llamadas a /api se redirigen a la API local (sin CORS).
    proxy: { '/api': 'http://localhost:3000' },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});

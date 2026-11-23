import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Cuando VITE_USE_MOCKS=false, el backend NestJS debe correr en :3000
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
});

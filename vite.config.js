import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // No longer needed as './' for file:// packaging (that was an
  // Electron-only requirement) — Vercel serves over real HTTP, so the
  // default root-relative base is correct.
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});

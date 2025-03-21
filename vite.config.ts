import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    }
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    }
  },
  // Configuration du HTML
  experimental: {
    renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
      return filename.replace(/^_assets/, 'assets')
    }
  }
});

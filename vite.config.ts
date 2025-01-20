import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'admin': [
            './src/components/AdminDashboard.tsx',
            './src/components/AdminLogin.tsx',
            './src/components/LocationSettings.tsx',
          ],
        },
      },
    },
  },
});
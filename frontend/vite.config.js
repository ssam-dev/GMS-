import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            'framer-motion',
            'lucide-react'
          ],
          // Google OAuth
          'auth-vendor': ['@react-oauth/google'],
          // Utilities
          'utils-vendor': [
            'date-fns',
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'sonner'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})

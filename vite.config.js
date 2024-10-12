import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // This allows you to use '@' as an alias for 'src' directory
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Your Django backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true, // Generates source maps for better debugging
    rollupOptions: {
      output: {
        manualChunks: {
          // This splits your vendor code into a separate chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly', // This makes CSS module class names camelCase in JS
    },
  },
})
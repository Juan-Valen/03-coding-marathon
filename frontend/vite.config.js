import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external connections
    port: process.env.PORT || 3000, // Use environment PORT or fallback to 3000
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true,
      },
    }
  },
  preview: {
    host: '0.0.0.0', // Also set for preview mode
    port: process.env.PORT || 3000,
  }
})

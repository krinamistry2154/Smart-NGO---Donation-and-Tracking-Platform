import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      // Proxy API and Auth calls to backend to avoid CORS during dev
      '/api': {
        target: 'https://localhost:7002',
        changeOrigin: true,
        secure: false
      },
      '/Auth': {
        target: 'https://localhost:7002',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

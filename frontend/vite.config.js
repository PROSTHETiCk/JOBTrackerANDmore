import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests starting with /api to the Flask backend
      '/api': {
        target: 'http://127.0.0.1:5000', // Default Flask dev server address
        changeOrigin: true, // Recommended for most setups
        secure: false,      // Change to true if backend uses HTTPS locally
        // No rewrite needed if Flask routes are prefixed with /api
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    port: 5173 // Default Vite port
  }
})
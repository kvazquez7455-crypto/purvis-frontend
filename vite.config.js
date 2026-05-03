import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': { target: 'https://purvis-v11-production-8ad7.up.railway.app', changeOrigin: true } }
  }
})

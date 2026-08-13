import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In Docker the backend is reachable via the service name (backend:3001);
// locally it's on localhost. Override with VITE_API_TARGET when needed.
const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:3001'

const proxy = {
  '/api': {
    target: apiTarget,
    changeOrigin: true,
  },
  '/uploads': {
    target: apiTarget,
    changeOrigin: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy,
  },
  preview: {
    host: true,
    port: 5000,
    allowedHosts: ['zqai.kz', 'www.zqai.kz'],
    proxy,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: [
      'financeiro-moura-solutions-v3.onrender.com',
      '.onrender.com'
    ]
  }
})

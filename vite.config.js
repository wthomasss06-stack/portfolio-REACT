import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,
    port: 3000,
    open: true,
    proxy: {
      /* En dev local, /api est proxifié vers vercel dev (port 3001)
         Lance : vercel dev --listen 3001  (dans un second terminal)
         Puis   : vite (dans le terminal principal)                   */
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
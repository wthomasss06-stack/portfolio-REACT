import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ════════════════════════════════════════════════════════════════
// VITE CONFIG — akaFOLIO (React + Vite + SSG)
//
// Stratégie SEO : vite-ssg génère un index.html PRÉ-RENDU
// au build pour chaque route → Google lit le HTML complet,
// pas un <div id="root"></div> vide.
//
// Ce que ça change côté DX : RIEN. Tu continues en React,
// GSAP, tout comme avant. Seul le build produit du HTML statique.
// ════════════════════════════════════════════════════════════════

export default defineConfig({
  plugins: [react()],

  // !! IMPORTANT : retire base: './' — SSG a besoin de '/'
  // pour que les liens internes soient absolus (Vercel l'attend aussi).
  base: '/',

  server: {
    host: true,
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  build: {
    // SSG génère du HTML — on veut que les chunks soient stables
    rollupOptions: {
      output: {
        manualChunks: {
          gsap:  ['gsap'],
          three: ['three'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})

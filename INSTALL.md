# Upgrade SEO — Elvis Portfolio (React Vite → SSG)

## Fichiers modifiés / ajoutés

| Fichier | Action |
|---|---|
| `package.json` | Remplace l'original — 2 nouvelles deps : `vite-ssg` + `react-helmet-async` |
| `vite.config.js` | Remplace l'original — retire `base: './'`, ajoute `manualChunks` |
| `src/main.jsx` | Remplace l'original — ViteSSG au lieu de ReactDOM.createRoot |
| `src/RootApp.jsx` | Remplace l'original — HelmetProvider + SEOHead |
| `src/useSEO.jsx` | **NOUVEAU** — hook + structured data + SEOHead component |
| `vercel.json` | **NOUVEAU** — rewrites pour Vercel (SPA fallback) |

## Installation (3 commandes)

```bash
# 1. Remplacer les fichiers (voir ci-dessus)
# 2. Installer les nouvelles dépendances
npm install vite-ssg react-helmet-async

# 3. Build → génère HTML pré-rendu dans dist/
npm run build
```

## Différence vs avant

| | Avant (SPA) | Après (SSG) |
|---|---|---|
| Google crawl | `<div id="root"></div>` | HTML complet avec title, meta, structured data |
| `npm run dev` | identique | identique |
| Composants React | inchangés | inchangés |
| GSAP / Three.js | inchangés | inchangés |
| `npm run build` | `vite build` | `vite-ssg build` |

## Pourquoi pas de SSR classique ?

SSR (Server-Side Rendering) = un serveur Node tourne en permanence pour générer le HTML à chaque requête.
SSG (Static Site Generation) = le HTML est généré UNE FOIS au build, servi comme fichier statique → Vercel gratuit, aucun serveur, même perf qu'avant.

AKATech (Next.js) utilise SSG via `generateStaticParams` — c'est exactement la même chose ici.

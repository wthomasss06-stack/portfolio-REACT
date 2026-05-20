<div align="center">

<img src="public/assets/images/logo-akatech.png" alt="AKATech Logo" width="200" />

<br /><br />

# ✦ AKAFOLIO — Elvis M'BOLLO

### Portfolio Full-Stack · React 18 · OGL WebGL · GSAP · Neo-Brutalism

<br />

[![Live Demo](https://img.shields.io/badge/🌐_VOIR_LE_SITE-FF5500?style=for-the-badge&logoColor=white)](https://akafolio160502.vercel.app/)
[![AKATech](https://img.shields.io/badge/🏢_AKATech-0A0A0A?style=for-the-badge)](https://akatech.vercel.app/)

<br />

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat-square)
![OGL](https://img.shields.io/badge/OGL-WebGL-FF5500?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel)
![Version](https://img.shields.io/badge/Version-3.4-FF5500?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

<br />

*SPA · 3 Versions · Neo-Brutalism × Glassmorphism · WebGL · Animations immersives*

</div>

---

## 🎯 À propos

**AKAFOLIO** est mon portfolio personnel interactif — une vitrine technique conçue pour impressionner au premier regard. Il embarque **trois expériences distinctes** servies dynamiquement selon le contexte (device + préférence utilisateur), toutes construites sur mesure sans composants UI tiers.

---

## 🔀 Architecture — 3 Versions

Le point d'entrée `main.jsx` détecte automatiquement le device et sert la bonne version :

```
Visiteur arrive
      │
      ├─ Largeur > 900px  ──► Mode Win95 (défaut) → basculable en Mode Moderne Desktop
      │
      └─ Largeur ≤ 900px  ──► AppMobile directement (aucun switcher affiché)
```

| Version | Fichiers | Chargement |
|---|---|---|
| 🖥️ **Desktop** | `App.jsx` + `style.css` | Mode "Moderne" sur écrans > 900px |
| 📱 **Mobile** | `Appmobile.jsx` + `stylemobile.css` | Automatique sur écrans ≤ 900px |
| 🖥️ **Win95** | `Win95Portfolio.jsx` | Mode par défaut au premier chargement (desktop) |

### Routage (`main.jsx`)

- **CSS dynamique** : `style.css` ou `stylemobile.css` injecté via `<style id="dynamic-portfolio-styles">` selon `isMobile`
- **Détection device** : `window.matchMedia('(max-width: 900px)')` + listener resize
- **Persistance** : le mode choisi (win95/modern) est sauvegardé dans `localStorage`
- **Switcher Win95 ↔ Moderne** : bouton fixe visible uniquement sur desktop

---

## ✨ Fonctionnalités

### 🖥️ Version Desktop (`App.jsx`)

| Section | Description |
|---|---|
| **Loader** | Écran de chargement animé avec scan line |
| **Navbar** | Topbar : logo, horloge temps réel, statut disponible, bouton thème neo-brutalism |
| **Hero** | Fond wireframe Three.js, TextPressure sur le nom, toujours en mode sombre |
| **Sticky Panels** | Services défilants GSAP ScrollTrigger |
| **About** | Portrait + description, typographie premium |
| **Timeline** | Parcours chronologique animé ScrollReveal |
| **Skills** | Icônes SVG animées CSS (40+ technologies) |
| **Showcase** | Cartes services en carousel |
| **Pricing** | Plans tarifaires 4 catégories, tabs neo-brutalism |
| **Galerie OGL** | Galerie WebGL 3D scrollable — cartes rectangulaires avec distorsion |
| **Testimonials** | Avis clients en carousel horizontal |
| **Contact** | Formulaire + grille de liens sociaux, titre ScrollReveal |
| **Footer** | SVG animé + CV card + bas de page cliquable AKATech |
| **Win95 Easter Egg** | Interface rétro Windows 95 complète |

### 📱 Version Mobile (`Appmobile.jsx`)
Interface entièrement repensée pour le tactile avec `stylemobile.css` dédié — expérience optimisée pour les petits écrans.

### 🕹️ Version Win95 (`Win95Portfolio.jsx`)
Easter egg interactif : interface Windows 95 complète avec fenêtres, icônes de bureau, menu Démarrer.

---

## 🌙 Thèmes (Desktop)

| Mode | Palette | Déclencheur |
|---|---|---|
| **Sombre** (défaut) | `#0A0A0A` fond + `#FF5500` accent | 18h–6h ou manuel |
| **Clair** | `#F2EDE8` fond + `#0A0A0A` texte | Manuel (bouton neo-brutalism) |

> Le Hero reste **toujours sombre**, quel que soit le thème actif.

---

## 🛠 Stack technique

| Couche | Technologies |
|---|---|
| **Orchestration** | `main.jsx` — routage device + injection CSS dynamique |
| **Frontend Desktop** | React 18, Vite 5, `App.jsx` |
| **Frontend Mobile** | React 18, `Appmobile.jsx` |
| **Styles Desktop** | `style.css` — variables CSS, thèmes, animations |
| **Styles Mobile** | `stylemobile.css` — layout mobile-first dédié |
| **Typographie** | Outfit (titres), Plus Jakarta Sans (corps), Space Mono, Syne |
| **3D & WebGL** | OGL (galerie projets), Three.js (hero background) |
| **Animations** | GSAP 3 + ScrollTrigger, ScrollReveal, CSS natif |
| **Composants** | ScrambleText, TextPressure, RotatingText, TargetCursor, ScrollFloat |
| **Formulaire** | FormSubmit (sans backend) |
| **Déploiement** | Vercel (CI/CD GitHub) |

---

## 🗂 Structure du projet

```
elvis-portfolio/
├── public/
│   ├── assets/
│   │   ├── images/           # Logo AKATech, QR code CV, images projets
│   │   └── qrcodeCV.png
│   └── demos/                # Démos HTML standalone des projets
│
├── src/
│   │
│   ├── main.jsx              # ★ Routeur principal — détection device, injection CSS
│   │
│   ├── ── VERSION DESKTOP ──
│   ├── App.jsx               # Composants desktop + données (PROJECTS, PRICING…)
│   ├── style.css             # Styles desktop : variables, thèmes clair/sombre, animations
│   │
│   ├── ── VERSION MOBILE ──
│   ├── Appmobile.jsx         # Composants mobile dédiés
│   ├── stylemobile.css       # Styles mobile-first dédiés
│   │
│   ├── ── EASTER EGG ──
│   ├── Win95Portfolio.jsx    # Interface Windows 95 complète
│   │
│   ├── scope-reset.css       # Reset CSS global isolé
│   ├── index.css             # Styles de base
│   │
│   └── components/
│       ├── ScrollDepthScene.jsx   # Background WebGL Three.js + GSAP
│       ├── ScrambleText.jsx       # Décodage texte au scroll
│       ├── ScrollReveal.jsx       # Révélation au scroll
│       ├── TextPressure.jsx       # Effet pression typographique
│       ├── RotatingText.jsx       # Texte rotatif animé
│       ├── TargetCursor.jsx       # Curseur personnalisé
│       └── ScrollFloat.jsx        # Flottement au scroll
│
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚡ Installation & Démarrage

```bash
# 1. Cloner le repo
git clone https://github.com/wthomasss06-stack/portfolio-REACT.git
cd portfolio-REACT

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
# → http://localhost:5173

# 4. Build production
npm run build

# 5. Prévisualiser le build
npm run preview
```

> ⚠️ **Node.js ≥ 18** requis.

---

## 🌍 Projets en production

| Projet | Description | Stack | Lien |
|---|---|---|---|
| **AKATech** ⭐ | Agence digitale — site officiel | Next.js 15, Framer Motion, WebGL | [→ Voir](https://akatech.vercel.app/) |
| **ShopCI** | Marketplace multi-vendeurs Côte d'Ivoire | React, Django, Bootstrap | [→ Voir](https://shop-ci.vercel.app/) |
| **TechFlow** | Site vitrine professionnel | HTML, Tailwind, JS | [→ Voir](https://techflow-ten.vercel.app/) |
| **TerraSafe** | Plateforme anti-arnaque foncière | Flask, MySQL, Bootstrap | [→ Voir](https://wthomassss06.pythonanywhere.com) |
| **Tati** | Portfolio & vitrine double | React, Tailwind, Framer Motion | [→ Voir](https://tatii.vercel.app/) |
| **MK** | Portfolio graphiste sur-mesure | React, Tailwind, Framer Motion | [→ Voir](https://mory01ff.vercel.app/) |
| **ManoBeat 777** | Portfolio beatmaker | React, Howler.js | [→ Voir](https://xxx-x.vercel.app/) |
| **New Horizon Service** | Location résidences meublées | Next.js, Flask, MySQL | [→ Voir](https://new-horizonservice.vercel.app/) |
| **Université les Anges** | Site institutionnel | HTML, CSS, Bulma | [→ Voir](https://universitelesanges.vercel.app/) |

> 4 démos supplémentaires accessibles depuis la galerie du portfolio.

---

## 💼 Services & Tarifs

> 💡 Tous les plans incluent un **nom de domaine offert (1 an)**.

<details>
<summary><b>🖥️ Portfolio personnel</b></summary>

| Plan | Prix | Délai |
|---|---|---|
| Starter | 70 000 FCFA | 3–5 jours |
| Pro | 120 000 FCFA | 5–7 jours |
| Elite | 180 000 FCFA | 7–10 jours |

</details>

<details>
<summary><b>🏢 Site Vitrine</b></summary>

| Plan | Prix | Délai |
|---|---|---|
| Starter | 150 000 FCFA | 5 jours |
| Pro ⭐ | 270 000 FCFA | 7–10 jours |
| Premium | 450 000 FCFA | 10–14 jours |

</details>

<details>
<summary><b>🛒 E-commerce</b></summary>

| Plan | Prix | Délai |
|---|---|---|
| Starter | 400 000 FCFA | 14 jours |
| Pro ⭐ | 650 000 FCFA | 21 jours |
| Scale | 1 000 000 FCFA | 30 jours |

</details>

<details>
<summary><b>⚙️ Application SaaS / Web App</b></summary>

| Plan | Prix | Délai |
|---|---|---|
| MVP | 700 000 FCFA | 3–4 semaines |
| Pro ⭐ | Sur devis | 4–6 semaines |
| Enterprise | À partir de 2 500 000 FCFA | 6–10 semaines |

</details>

---

## 📦 Variables CSS clés

```css
/* Thème sombre (défaut) — style.css */
:root {
  --accent:  #FF5500;
  --text:    #F2EDE8;
  --bg:      #0A0A0A;
  --muted:   rgba(242,237,232,.45);
  --fd: 'Outfit', 'Syne', sans-serif;        /* Headings */
  --fb: 'Plus Jakarta Sans', sans-serif;      /* Body */
}

/* Thème clair */
body.light-mode {
  --text:  #0A0A0A;
  --bg:    #F2EDE8;
  --muted: rgba(10,10,10,.45);
}
```

---

## 📅 Changelog

### v3.4 — Mai 2026
- 🏗️ Architecture clarifiée : **3 versions distinctes** (Desktop / Mobile / Win95) via `main.jsx`
- 🎨 Nouvelle typographie : **Outfit** (titres) + **Plus Jakarta Sans** (texte)
- 🃏 Galerie OGL redessinée : cartes **rectangulaires paysage** (800×550)
- 🌙 Hero **verrouillé en mode sombre** permanent
- 🔲 Bouton thème en **Neo-Brutalism** (border + box-shadow décalé + rebond au clic)
- 📍 `.nb-bottombar` repositionné en bas à droite
- 🔗 **AKATech** cliquable dans le footer
- ✍️ Footer bas de page : texte noir en mode clair
- 📐 Titre "Mes Réalisations" + "Restons connectés." animés `ScrollReveal`

### v3.3 — Avril 2026
- `PricingAnimIcon` : icônes CSS animées pour les plans
- `StackedCard` dans Timeline mobile
- `ScrambleText` sur Hero, About, Contact

### v3.2 — Avril 2026
- `ScrollDepthScene` WebGL Three.js + GSAP ScrollTrigger
- Système `LI` v2 (40+ icônes CSS natives)
- Logo AKATech v4, Section Testimonials

### v3.0–v3.1 — Mars 2026
- Loader avec scan line et messages dynamiques
- Carte AKATech générative 100% CSS

### v2.0 — Janvier 2026
- FanDeck 3D glassmorphism, filtres pill, PricingTabs

### v1.0 — 2025
- Version initiale SPA React

---

## 📬 Contact

**Elvis M'BOLLO** — Développeur Web Full-Stack — Abidjan, Côte d'Ivoire

[![Email](https://img.shields.io/badge/Email-wthomasss06@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:wthomasss06@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-m--bollo--aka-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/m-bollo-aka-60a1b1340/)
[![GitHub](https://img.shields.io/badge/GitHub-wthomasss06--stack-181717?style=flat-square&logo=github)](https://github.com/wthomasss06-stack)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-%2B225_01_42_50_77_50-25D366?style=flat-square&logo=whatsapp)](https://wa.me/2250142507750)
[![AKATech](https://img.shields.io/badge/AKATech-akatech.vercel.app-FF5500?style=flat-square)](https://akatech.vercel.app/)

---

<div align="center">

© 2026 Elvis M'BOLLO — Tous droits réservés

</div>

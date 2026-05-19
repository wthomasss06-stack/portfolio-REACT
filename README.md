<div align="center">

<img src="public/assets/images/logo-akatech.png" alt="AKATech Logo" width="200" />

<br />
<br />

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

*SPA · Neo-Brutalism × Glassmorphism · Galerie WebGL 3D · Animations immersives*

</div>

---

## 🎯 À propos du projet

**AKAFOLIO** est mon portfolio personnel interactif — une vitrine technique conçue pour impressionner au premier regard. Il combine un design **Neo-Brutalism** tranchant avec des animations WebGL fluides, une galerie 3D de projets scrollable, et une identité visuelle forte centrée sur l'orange `#FF5500`.

Tout est construit sur mesure : pas de composants UI tiers, pas de CSS framework inutile. Chaque animation, chaque interaction, chaque pixel a été pensé pour refléter mon niveau d'exigence en tant que développeur Full-Stack.

---

## ✨ Fonctionnalités

### 🎮 Galerie de projets WebGL — OGL
Galerie 3D scrollable avec une courbure en arc de cercle. Les projets défilent horizontalement en WebGL pur via la librairie **OGL** (ultra-légère). Effet de distorsion ondulatoire sur chaque carte en temps réel.

### 🖥️ Héro animé
Fond de terrain wireframe Three.js + particules synchronisées au scroll via **GSAP ScrollTrigger**. Texte animé avec **Pressure Text** sur le nom, tagline ScrambleText.

### 📜 Sections immersives
- **À propos** — merge élégant titre + texte, typographie premium (Outfit + Plus Jakarta Sans)
- **Parcours** — Timeline animée avec révélation au scroll
- **Skills** — Icônes SVG animées CSS, 40+ technologies
- **Services** — Sticky panels en cascade (GSAP ScrollTrigger)
- **Tarifs** — Carousel neo-brutalism 4 catégories de plans
- **Contact** — Formulaire avec grille de liens sociaux et beam animé

### 🌙 Thèmes
| Mode | Palette | Détail |
|---|---|---|
| **Sombre** (défaut) | `#0A0A0A` + `#FF5500` | Heure 18h–6h |
| **Clair** | `#F2EDE8` + `#0A0A0A` | Neo-Brutalism éditorial |

Le Hero reste **toujours sombre**, quel que soit le thème actif.

### 🚀 Easter Egg Windows 95
Un mode secret `Win95Portfolio.jsx` accessible via commande cachée — interface complète style rétro Win95.

---

## 🛠 Stack technique

| Couche | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, JSX |
| **Styles** | Vanilla CSS custom, variables CSS, Scope Reset |
| **Typographie** | Outfit, Plus Jakarta Sans, Space Mono, Syne |
| **3D & WebGL** | OGL (galerie projets), Three.js (hero background) |
| **Animations** | GSAP 3 + ScrollTrigger, ScrollReveal, CSS natif |
| **Composants** | ScrambleText, TextPressure, RotatingText, TargetCursor |
| **Formulaire** | FormSubmit (sans backend) |
| **Déploiement** | Vercel (CI/CD via GitHub) |

---

## 🗂 Structure du projet

```
elvis-portfolio/
├── public/
│   ├── assets/
│   │   ├── images/           # Logo, QR code, images projets
│   │   └── qrcodeCV.png
│   └── demos/                # Démos HTML standalone des projets
├── src/
│   ├── App.jsx               # ★ Composants principaux + données PROJECTS/PRICING
│   ├── Appmobile.jsx         # Version mobile dédiée
│   ├── Win95Portfolio.jsx    # Easter egg Windows 95
│   ├── style.css             # Variables CSS, thèmes, animations globales
│   ├── stylemobile.css       # Styles mobile spécifiques
│   ├── scope-reset.css       # Reset CSS isolé
│   └── components/
│       ├── ScrollDepthScene.jsx   # Background WebGL Three.js
│       ├── ScrambleText.jsx       # Décodage texte au scroll
│       ├── ScrollReveal.jsx       # Révélation au scroll
│       ├── TextPressure.jsx       # Effet pression typographique
│       ├── RotatingText.jsx       # Texte rotatif animé
│       ├── TargetCursor.jsx       # Curseur personnalisé
│       └── ScrollFloat.jsx        # Flottement au scroll
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

> 4 démos supplémentaires (Chap-chapMAP, ElvisMarket, MonCashJour, LivreurTrack Pro) accessibles directement depuis la galerie du portfolio.

---

## 💼 Services & Tarifs

> 💡 Tous les plans incluent un **nom de domaine offert (1 an)** et un hébergement selon le plan.

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
/* Thème sombre (défaut) */
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
- 🎨 Nouvelle typographie : **Outfit** (titres) + **Plus Jakarta Sans** (texte)
- 🃏 Galerie projets OGL redessinée : cartes **rectangulaires paysage** (800×550)
- 🌙 Hero **verrouillé en mode sombre** permanent
- 🔲 Bouton thème en **Neo-Brutalism** (border + box-shadow décalé)
- 📍 `.nb-bottombar` repositionné en **bas à droite**
- 🔗 **AKATech** cliquable dans le footer → `akatech.vercel.app`
- ✍️ Footer bas de page : texte **noir en mode clair**
- 📐 Titre "Mes Réalisations" avec `ScrollReveal` (taille grand titre)
- 📝 Contact : titre "Restons connectés." animé `ScrollReveal`

### v3.3 — Avril 2026
- `PricingAnimIcon` : icônes CSS animées pour les plans tarifaires
- `StackedCard` dans Timeline mobile
- `ScrambleText` sur 3 sections (Hero, About, Contact)

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

Made with ❤️ in Abidjan · © 2026 Elvis M'BOLLO — AKATech · Tous droits réservés

</div>

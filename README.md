# 🚀 Portfolio AKAFOLIO v3 — Elvis M'BOLLO

> Portfolio professionnel moderne d'un développeur web Full-Stack spécialisé en Python, React et MySQL — Version React

[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge)](https://akafolio160502.vercel.app/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Last Update](https://img.shields.io/badge/Mise%20à%20jour-Mars%202026-FF5500?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🎯 À propos

Portfolio personnel interactif développé avec **React 18**, présentant mes compétences, projets et expériences en développement web. Conçu avec une approche moderne incluant animations fluides, design Neo-Brutalism/Glassmorphism, navigation single-page et logo animé génératif.

**Objectif** : Démontrer mes compétences en développement frontend/backend et ma capacité à créer des interfaces modernes, performantes et accessibles.

---

## 🌐 Démo en ligne

🔗 **[Voir le portfolio](https://akafolio160502.vercel.app/)**

### Projets phares en production :

- **[ShopCI](https://shop-ci.vercel.app/)** — Marketplace e-commerce multi-vendeurs (65%)
- **[TechFlow](https://techflow-ten.vercel.app/)** — Site vitrine professionnel (97%)
- **[TerraSafe](https://wthomassss06.pythonanywhere.com)** — Plateforme foncière sécurisée (85%)
- **[Tati](https://tatii.vercel.app/)** — Portfolio & vitrine moderne (100%)
- **[MK](https://mory01ff.vercel.app/)** — Portfolio graphiste client (100%)

---

## ✨ Caractéristiques

### 🎨 Design & Interface

- **Architecture React** : Single Page Application (SPA) avec composants réutilisables
- **Design Neo-Brutalism** (mode clair) + **Glassmorphism** (mode sombre) avec animations fluides
- **2 modes d'affichage** :
  - 🌙 **Mode Sombre** (par défaut) — vert néon sur fond noir profond
  - ☀️ **Mode Clair** — orange bold sur fond blanc éditorial
- **Responsive complet** : mobile, tablette, desktop avec composants dédiés
- **Navigation fluide** : scroll smooth vers les sections + persistance thème (`localStorage`)

### 🔥 Logo AKATech v3 — `AkafolioLogo` *(refonte complète)*

Nouveau logo génératif entièrement réécrit, identique au HTML animé — injecté via `<style>` dans le `<head>` au premier rendu :

| Élément | Animation |
|---------|-----------|
| **Fond sombre** | `radial-gradient(#2a1200 → #0d0600)` + bordure orange subtile |
| **Scan line** | Balayage vertical en boucle `3s linear infinite` |
| **Grille de points** | Pattern SVG orange `opacity: 0.05` |
| **Halo orange** | Pulse `scale(1 → 1.2)` · `2.4s ease-in-out infinite` |
| **Engrenage** | Rotation complète `8s linear infinite` via CSS |
| **Circuit intérieur** | Contre-rotation `−360deg` — reste lisible |
| **Lignes de circuit** | Tracé séquentiel `stroke-dashoffset` · 6 segments décalés |
| **Points de circuit** | Pulse d'opacité décalé par index |
| **Particules** | Spawn DOM `every 360ms`, flottent et disparaissent |
| **"AKA"** | Orbitron 900 · glow orange · `akaAkaGlow 3s infinite` |
| **"Tech"** | Exo 2 Light · couleur `#f0c8a0` |
| **Accent line** | Expansion horizontale au chargement |
| **Tagline** | Masquée si `size < 34` (navbar compacte) |

Props : `size` (px référence, défaut 48) · `animate` (bool) · `onClick` · `dark` (compatibilité)

Utilisé avec `animate={true}` dans le **Loader** (`size=56`), `animate={false}` dans la **Navbar** (`size=26`), le **Drawer mobile** (`size=22`) et le **Footer** (`size=26`).

---

### 🌐 Réseaux sociaux — Facebook ajouté 🆕

Lien Facebook ajouté aux 3 emplacements sociaux du portfolio :

```jsx
const FACEBOOK_URL = "https://web.facebook.com/profile.php?id=61577494705852";
```

- **Menu drawer mobile** — bas du tiroir
- **Section Contact** — groupe d'icônes sociales
- **Footer** — barre d'icônes

Hover Facebook : `background: #1877F2` (bleu officiel) au lieu de l'orange pour les 3 emplacements.

---

### 🌟 Loader *(mis à jour)* 🆕

| Élément | Détail |
|---------|--------|
| **Fond** | `#080400` (noir brun profond) — cohérent avec le logo |
| **Logo** | `AkafolioLogo size=56` avec `animate=true` + `box-shadow` orange double couche |
| **Scan line** | Balayage vertical `2.2s linear infinite` |
| **Brackets** | 4 coins animés `cornerPulse 2s ease-in-out infinite` |
| **Compteur %** | `clamp(56px, 18vw, 160px)` — responsive mobile |
| **Barre** | `min(260px, 80vw)` + glow dot qui suit la progression |
| **Message statut** | Dynamique : *Initialisation…* → *Chargement des modules…* → *Préparation interface…* → *Lancement ✦* |
| **Sous-titre** | `AKA ELVIS · AKATECH · ABIDJAN` |
| **Responsive** | `padding: 0 24px` · `max-width: 90vw` sur le logo · tailles `clamp()` partout |

---

### 🎯 Navbar *(mise à jour)*

- Lien actif : **soulignement orange** (`border-bottom: 2px solid var(--acc)`) — sans encadrement
- Hamburger **strictement mobile** (≤ 768px)
- Breakpoint 1024px : liens réduits à `10px` + padding compact
- Logo `size=26` = même taille que le footer

---

## 📱 Sections du portfolio

### 1. **Hero**
- **Salutation dynamique** selon heure locale : `Bonjour je suis` (6h–18h) / `Bonsoir je suis` (18h–6h)
- **Horloge temps réel** : `Jj JJ · HHh MMmn SSs` — `setInterval(1000)` avec cleanup
- Indicateur de disponibilité : `● Disponible — Abidjan, Côte d'Ivoire`
- **Effet typing cyclique** : Full-Stack → React & Python → Django & Flask → orienté produit
- Statistiques : `9+ Projets · 2+ Années exp. · 5 En production · 9+ Outils`
- CTAs : **Voir mes projets ↗** + **Télécharger CV**

### 2. **Marquee**
Défilement infini : React, Django, Flask, Python, TypeScript, Tailwind, MySQL, Vercel, Node.js, Git, REST API, Bootstrap, JavaScript

### 3. **Vitrine — Dernière Création**
- Mise en avant de **ShopCI** avec mockup desktop + mobile côte à côte
- Badge `100% Responsive` + lien direct en production

### 4. **Services** *(carousel mobile)*
6 services avec cartes interactives (TiltCard + SpotlightCard) :

| # | Service | Description |
|---|---------|-------------|
| 01 | Applications Web | Apps CRUD complètes, dashboards de gestion |
| 02 | API RESTful | APIs Python/Flask documentées et sécurisées |
| 03 | Interfaces Responsives | Design et intégration d'interfaces modernes |
| 04 | Bases de Données | Conception et optimisation MySQL |
| 05 | Sécurité Applicative | Bonnes pratiques intégrées dès la conception |
| 06 | Support Technique | Maintenance informatique et assistance |

**Mobile** : carousel 1 carte à la fois avec navigation par points et flèches.

### 5. **Tarification** — `PricingTabs`
Système d'onglets pill interactif avec **4 catégories** :

| Onglet | Icône | Plans |
|--------|-------|-------|
| **Site Vitrine** | 🌐 | Starter · Standard ⭐ · Premium |
| **E-commerce** | 🛒 | Starter · Standard ⭐ · Premium |
| **Application SaaS** | ⚙️ | Starter · Standard ⭐ · Premium |
| **Portfolio** | ⭐ | Starter · Standard ⭐ · Premium |

**Mobile** : carousel 1 plan à la fois avec navigation par points et flèches.

### 6. **À Propos**
- Citation de Kevin Ressegaire
- Photo de profil avec badges flottants (Pro · Créatif · Curieux)
- Parcours : Réseau & Sécurité Informatique, Django & React, MySQL
- Soft skills : Esprit d'équipe · Créativité · Rigueur · Adaptabilité · Innovation
- CTA : **Disponible pour opportunités →**

### 7. **Expérience & Formation** — `Timeline`
- Stage Informaticien — Mairie d'Agboville (Mai–Nov. 2025)
- Projet Académique ARTICI — UVCI (2023–2024)
- Licence Réseau & Sécurité Informatique — UVCI (Certification E-Banking)
- Baccalauréat Série D — Lycée Moderne d'Arrah (Mention Assez Bien)

### 8. **Projets** — Carousel 3D Glassmorphism
10 projets avec **filtres pill interactifs** (Tous / En ligne / Démos / En cours) :

| Filtre | Couleur | Projets |
|--------|---------|---------|
| 🟢 En ligne | Vert néon / Rouge brique | ShopCI, TechFlow, TerraSafe, Tati, MK |
| 🔵 Démos | Rose néon / Marron | Chap-chapMAP, ElvisMarket, MonCashJour, LivreurTrack Pro |
| 🟡 En cours | Ambre | LinkedIn Banner Pro (30%) |

Carousel 3D avec drag & swipe, rotation perspective, auto-play 4,5s, navigation clavier (←→).

### 9. **Compétences** — `Skills`
4 bandes défilantes infinies bidirectionnelles (pause au survol) :
- **Frontend** : React, JavaScript, TypeScript, Vue.js, Tailwind, HTML5, CSS3, Bootstrap
- **Backend** : Python, Flask, Django, Node.js, MySQL
- **Outils & IA** : Git, VS Code, GitHub, ChatGPT, Claude AI, Gemini, PythonAnywhere, Vercel, Netlify
- **Autres** : Windows, Android, Suite MS Office, Peinture, Maintenance, Support Tech

### 10. **Contact**
- Formulaire avec validation (FormSubmit · `formsubmit.co/ajax`)
- Coordonnées : téléphone, email pro, email UVCI, localisation
- Réseaux sociaux : GitHub · LinkedIn · **Facebook** 🆕
- QR Code CV + téléchargement direct
- Bloc code décoratif : `responseTime · availability · status`

---

## 💰 Tarification complète

### 🌐 Site Vitrine

| Plan | Prix | Délai | Populaire |
|------|------|-------|-----------|
| Starter | 60 000 FCFA | 5–7 jours | |
| Standard | 120 000 FCFA | 7–10 jours | ⭐ |
| Premium | 200 000 FCFA | 10–14 jours | |

### 🛒 E-commerce

| Plan | Prix | Délai | Populaire |
|------|------|-------|-----------|
| Starter | 200 000 FCFA | 10–14 jours | |
| Standard | 350 000 FCFA | 15–20 jours | ⭐ |
| Premium | 500 000 FCFA | 3–4 semaines | |

### ⚙️ Application SaaS

| Plan | Prix | Délai | Populaire |
|------|------|-------|-----------|
| Starter | 500 000 FCFA | 3–4 semaines | |
| Standard | 800 000 FCFA | 4–6 semaines | ⭐ |
| Premium | 1 200 000 FCFA | 6–8 semaines | |

### ⭐ Portfolio

| Plan | Prix | Délai | Populaire |
|------|------|-------|-----------|
| Starter | 50 000 FCFA | 3–5 jours | |
| Standard | 100 000 FCFA | 5–7 jours | ⭐ |
| Premium | 150 000 FCFA | 7–10 jours | |

> 📩 Devis gratuit — [wthomasss06@gmail.com](mailto:wthomasss06@gmail.com) · [+225 01 42 50 77 50](tel:+2250142507750)

---

## 🛠️ Technologies

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

### Frameworks & Bibliothèques
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat&logo=fontawesome&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-F56565?style=flat)

### Backend (Projets hébergés)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

### Polices (Google Fonts)
- **Unbounded** — titres & logo (`--fd`)
- **Space Mono** — corps de texte & code (`--fb`)
- **Orbitron** — texte "AKA" du logo
- **Exo 2** — texte "Tech" du logo & tagline

### Animations & Effets
- **Logo AKATech v3** — CSS `@keyframes` injectés dynamiquement, particules DOM spawned
- Particules canvas full custom avec répulsion curseur (100px) et connexions dynamiques
- Carrousel 3D glassmorphism — perspective CSS + drag & swipe + autoplay
- Loader responsive : scan line · brackets · glow dot · messages dynamiques
- Cursor personnalisé orange SVG (desktop uniquement)
- Rocket ScrollTop avec son moteur **Web Audio API** (grondement + whoosh au décollage)
- Scroll-triggered animations via **Intersection Observer API**
- Micro-interactions : Ripple · TiltCard · SpotlightCard · Pill sliding indicator

### React Hooks utilisés
`useState` · `useEffect` · `useRef` · `useCallback` · `useContext` · `createContext`

---

## 📂 Structure du projet

```
portfolio-akafolio-react/
│
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── projects/          # Previews des 10 projets
│   │   │   ├── IMG_20250124_124101KK.jpg
│   │   │   └── qrcodeCV.png
│   │   └── CV_MBOLLO_AKA_ELVIS.pdf
│   ├── demos/
│   │   ├── projet1.html           # MonCashJour
│   │   ├── projet2.html           # ElvisMarket
│   │   ├── projet3.html           # LivreurTrack Pro
│   │   ├── chap-chapMAP.html
│   │   └── projet7.html           # LinkedIn Banner Pro
│   └── favicon.png
│
├── src/
│   ├── App.jsx        # Tous les composants React + données
│   ├── style.css      # Styles globaux, variables CSS, animations, responsive
│   └── main.jsx
│
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

### Composants React (`App.jsx`)

| Composant | Rôle | Nouveauté |
|-----------|------|-----------|
| `AkafolioLogo` | Logo SVG animé — loader, navbar, footer | 🆕 v3 refonte complète |
| `ParticleCanvas` | Fond de particules interactif (canvas) | |
| `Noise` | Filtre SVG grain | |
| `Loader` | Écran de chargement avec progression | 🆕 fond noir, scan, brackets, messages |
| `ThemeToggle` | Bouton bascule sombre/clair | |
| `Navbar` | Navigation desktop + drawer mobile | 🆕 actif = underline, logo réduit |
| `ScrollTop` | Bouton retour haut + son moteur Web Audio | |
| `Hero` | Accueil — salutation, horloge, typing | |
| `Marquee` | Bandeau défilant des technologies | |
| `FeaturedCreation` | Vitrine ShopCI (mockup desktop + mobile) | |
| `PricingTabs` | Onglets tarification + carousel mobile | |
| `Services` | 6 services — grille desktop + carousel mobile | |
| `About` | Présentation + photo + soft skills | |
| `Projects` | 10 projets + filtres + carrousel 3D | |
| `Skills` | 4 bandes infinies bidirectionnelles | |
| `Contact` | Formulaire + coordonnées + QR Code | 🆕 Facebook ajouté |
| `Footer` | Pied de page | 🆕 Facebook ajouté |

### Données (`App.jsx`)

| Constante | Type | Contenu |
|-----------|------|---------|
| `FACEBOOK_URL` | `string` | URL page Facebook officielle |
| `PROJECTS` | `array[10]` | Titre, description, tech, url, image, progress, cat |
| `SERVICES` | `array[6]` | Numéro, icône, titre, description, features |
| `PRICING_TABS` | `array[4]` | Onglets avec plans (badge, price, delivery, features) |
| `SKILLS` | `object{4}` | frontend · backend · tools · autres |
| `TIMELINE` | `array[4]` | Expériences et formations |
| `GRAD` | `array[10]` | Gradients fallback cartes projets |
| `BADGE_LIGHT/DARK` | `object` | Couleurs badges filtres selon thème |

---

## 🎨 Variables CSS (`style.css`)

### Palette principale

```css
:root {
  --ink:     #0D0D0D;   /* Texte mode clair */
  --paper:   #FFFFFF;   /* Fond mode clair */
  --acc:     #FF5500;   /* Orange — couleur principale */
  --acc-2:   #FF6B1A;   /* Orange secondaire */
  --border:  #0D0D0D;   /* Bordures Neo-Brutalism */
  --shadow:  4px 4px 0 #0D0D0D;
  --fd: 'Unbounded', sans-serif;
  --fb: 'Space Mono', monospace;
}
```

### Mode sombre (`.app--light`)
```css
.app--light {
  --paper:  #0A0A0A;   /* Fond sombre */
  --ink:    #F0F0F0;   /* Texte clair */
}
```
> 💡 Le mode est appelé `--light` mais représente le **thème sombre** (convention inversée héritée du projet).

---

## 🎯 Projets hébergés

### 🟢 En Production

| Projet | Description | Technologies | Statut | Lien |
|--------|-------------|--------------|--------|------|
| **ShopCI** | Marketplace multi-vendeurs | React, Django, Bootstrap 5 | 65% | [→](https://shop-ci.vercel.app/) |
| **TechFlow** | Site vitrine professionnel | HTML/Tailwind, JavaScript | 97% | [→](https://techflow-ten.vercel.app/) |
| **TerraSafe** | Plateforme foncière anti-arnaque | Flask, MySQL, Bootstrap 5 | 85% | [→](https://wthomassss06.pythonanywhere.com) |
| **Tati** | Portfolio double vitrine | React, Tailwind, Framer Motion | 100% | [→](https://tatii.vercel.app/) |
| **MK** | Portfolio sur-mesure graphiste | React, Tailwind, Framer Motion | 100% | [→](https://mory01ff.vercel.app/) |

### 🔵 Démos Fonctionnelles

| Projet | Description | Technologies |
|--------|-------------|--------------|
| **Chap-chapMAP** | Navigation GPS intelligente | JavaScript, Leaflet.js, OSRM API |
| **ElvisMarket** | E-commerce avec panier dynamique | HTML, Tailwind, LocalStorage |
| **MonCashJour** | Gestion de ventes + analytics | HTML, Tailwind, Chart.js |
| **LivreurTrack Pro** | Suivi logistique + validation photo | JavaScript, Bootstrap 5, Camera API |

### 🟡 En Développement

| Projet | Technologies | Statut |
|--------|--------------|--------|
| **LinkedIn Banner Pro** | JavaScript, Canvas API, Tailwind | 30% |

---

## ⚡ Performance & SEO

- ✅ React 18 optimisé — `useCallback`, `useRef`, cleanup corrects (`clearInterval`, `cancelAnimationFrame`)
- ✅ Logo CSS injecté une seule fois via `document.getElementById(AKALOGO_CSS_ID)`
- ✅ Lazy loading images avec fallback placeholder
- ✅ Build Vite optimisé (code splitting)
- ✅ SEO — Meta tags, Open Graph
- ✅ Responsive mobile-first complet (breakpoints : 1024px · 768px · 480px)
- ✅ Accessibility — ARIA labels, navigation clavier (←→ sur carousel)
- ✅ Canvas animations natives sans librairie externe
- ✅ Cursor custom désactivé automatiquement sur mobile (`@media max-width:768px`)

**Lighthouse estimé** : 90+ Performance · Mobile-Friendly 100% · Bundle < 200KB gzipped

---

## 📦 Installation & Démarrage

```bash
# Cloner le dépôt
git clone https://github.com/wthomasss06-stack/portfolio-akafolio.git
cd portfolio-akafolio

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

### Dépendances principales

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "lucide-react": "latest",
  "vite": "^5.x"
}
```

> 📌 **Aucune dépendance d'animation externe** — toutes les animations utilisent CSS `@keyframes` natif et Canvas API.

---

## 📊 Changelog

### [Mars 2026] — v3 *(version actuelle)*

| Changement | Détail |
|------------|--------|
| 🆕 **Logo AKATech v3** | Refonte complète : engrenage rotatif, circuit animé, halo, particules, scan line |
| 🆕 **Facebook** | Lien `profile.php?id=61577494705852` ajouté aux 3 emplacements sociaux |
| 🆕 **Loader** | Fond sombre `#080400`, scan, brackets coins, glow dot, messages dynamiques, responsive `clamp()` |
| 🆕 **Navbar** | Actif = underline orange (pas d'encadrement), logo réduit `size=26` = footer |
| 🆕 **Responsive** | Loader entièrement fluide mobile · Footer `flex-direction:column` ≤768px |
| 🔧 **Hover Facebook** | `background: #1877F2` (bleu officiel) sur contact, footer, drawer |

### [Janvier 2026] — v2

- Ajout PricingTabs avec 4 onglets et carousel mobile
- Ajout carrousel 3D glassmorphism pour les projets
- Filtres pill interactifs sur la section Projets
- Window Chrome macOS sur chaque section
- Système de micro-interactions : Ripple · TiltCard · SpotlightCard

### [2025] — v1

- Version initiale : SPA React avec particules, hero animé et sections principales

---

## 📧 Contact

**M'BOLLO AKA Elvis** — Développeur Web Full-Stack — Abidjan, Côte d'Ivoire

- 📧 [wthomasss06@gmail.com](mailto:wthomasss06@gmail.com)
- 📧 [aka.mbollo@uvci.edu.ci](mailto:aka.mbollo@uvci.edu.ci)
- 📱 [+225 01 42 50 77 50](tel:+2250142507750)
- 💼 [LinkedIn](https://www.linkedin.com/in/m-bollo-aka-60a1b1340/)
- 🐙 [GitHub @wthomasss06-stack](https://github.com/wthomasss06-stack)
- 📘 [Facebook](https://web.facebook.com/profile.php?id=61577494705852)
- 📍 Abidjan, Côte d'Ivoire

---

## 🔗 Liens utiles

| | |
|---|---|
| 🌐 Portfolio | [akafolio160502.vercel.app](https://akafolio160502.vercel.app/) |
| 🛒 ShopCI | [shop-ci.vercel.app](https://shop-ci.vercel.app/) |
| 🏠 TechFlow | [techflow-ten.vercel.app](https://techflow-ten.vercel.app/) |
| 🏡 TerraSafe | [wthomassss06.pythonanywhere.com](https://wthomassss06.pythonanywhere.com) |
| 🎨 Tati | [tatii.vercel.app](https://tatii.vercel.app/) |
| 🖌️ MK | [mory01ff.vercel.app](https://mory01ff.vercel.app/) |

---

## 📊 Statistiques

![GitHub repo size](https://img.shields.io/github/repo-size/wthomasss06-stack/portfolio-akafolio?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/wthomasss06-stack/portfolio-akafolio?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/wthomasss06-stack/portfolio-akafolio?style=social)

---

## 📄 Licence

© 2026 Elvis M'BOLLO. Tous droits réservés.

Ce portfolio est une vitrine technique démontrant mes compétences en développement web. Les projets présentés illustrent ma logique de développement et ma vision produit.

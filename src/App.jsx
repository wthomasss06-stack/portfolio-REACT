import React, { useState, useEffect, useRef, useCallback } from 'react';
import './style.css';
import ScrollDepthScene from './components/ScrollDepthScene';


/* ── SVG icon replacements (pas de dépendance lucide-react) ── */
const SvgArrowRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const SvgStar = ({ size = 14, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const SvgCheck = ({ size = 13, strokeWidth = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const SvgGlobe = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const SvgShoppingCart = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const SvgCpu = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
);

// ─── Logo AKATech (v4 — style page.js, orange) ───────────────────
const AKALOGO_CSS_ID = 'akalogo-v4-styles';
const AKALOGO_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');
@keyframes aka4Pulse  { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.45)} }
@keyframes aka4Glow   { 0%,100%{text-shadow:0 0 8px rgba(255,85,0,.35),0 0 20px rgba(255,85,0,.15)} 50%{text-shadow:0 0 18px rgba(255,85,0,.9),0 0 36px rgba(255,85,0,.4)} }
@keyframes aka4Scan   { 0%{background-position:0 -40px} 100%{background-position:0 200%} }
.aka4-wrap { display:inline-flex; align-items:center; position:relative; flex-shrink:0; }
.aka4-scan { position:absolute; inset:0; pointer-events:none; border-radius:100px; z-index:0;
  background:linear-gradient(180deg,transparent 0%,rgba(255,85,0,.06) 50%,transparent 100%);
  background-size:100% 36px; animation:aka4Scan 2.4s linear infinite; }
.aka4-pill { position:relative; z-index:1; display:inline-flex; align-items:center;
  border-radius:100px; border:1px solid rgba(255,85,0,.28);
  background:rgba(255,85,0,.07); backdrop-filter:blur(10px);
  transition:border-color .3s,background .3s; overflow:hidden; white-space:nowrap; }
.aka4-pill:hover { border-color:rgba(255,85,0,.55); background:rgba(255,85,0,.13); }
.aka4-dot { border-radius:50%; background:#ff5500; flex-shrink:0; box-shadow:0 0 5px rgba(255,85,0,.6); }
.aka4-dot--anim { animation:aka4Pulse 1.6s ease-in-out infinite; }
.aka4-prefix { font-family:'JetBrains Mono',monospace; font-weight:600;
  color:rgba(255,120,50,.55); line-height:1; flex-shrink:0; user-select:none; }
.aka4-aka { font-family:'Syne',sans-serif; font-weight:800; color:#ff5500;
  line-height:1; letter-spacing:-.025em; flex-shrink:0; }
.aka4-aka--anim { animation:aka4Glow 3s ease-in-out infinite; }
.aka4-tech { font-family:'Syne',sans-serif; font-weight:700; line-height:1;
  letter-spacing:-.015em; flex-shrink:0; }
.aka4-tech--dk { color:rgba(255,255,255,.82); }
.aka4-tech--lt { color:rgba(12,12,12,.82); }
`;

const AkafolioLogo = ({ size = 48, dark = true, onClick, animate = true }) => {
  useEffect(() => {
    if (!document.getElementById(AKALOGO_CSS_ID)) {
      const s = document.createElement('style');
      s.id = AKALOGO_CSS_ID;
      s.textContent = AKALOGO_CSS;
      document.head.appendChild(s);
    }
  }, []);

  const sc      = size / 48;
  const fontSize = Math.round(19 * sc);
  const dotSz    = Math.round(7 * sc);
  const prefSz   = Math.round(11 * sc);
  const padV     = Math.round(8 * sc);
  const padH     = Math.round(14 * sc);
  const gap      = Math.round(6 * sc);

  return (
    <div
      className="aka4-wrap"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {animate && <div className="aka4-scan"/>}
      <div className="aka4-pill" style={{ padding:`${padV}px ${padH}px`, gap }}>
        <span
          className={`aka4-dot${animate ? ' aka4-dot--anim' : ''}`}
          style={{ width:dotSz, height:dotSz }}
        />
        <span className="aka4-prefix" style={{ fontSize:prefSz }}>{'// '}</span>
        <span
          className={`aka4-aka${animate ? ' aka4-aka--anim' : ''}`}
          style={{ fontSize }}
        >AKA</span>
        <span
          className={`aka4-tech ${dark ? 'aka4-tech--dk' : 'aka4-tech--lt'}`}
          style={{ fontSize }}
        >Tech</span>
      </div>
    </div>
  );
};


const WindowChrome = ({ title, dark, inner = false }) => (
  <div className={`win-chrome${inner ? ' win-chrome--inner' : ' win-chrome--section'}`}>
    <span className="win-chrome-title">{title}</span>
    <div className="win-chrome-dots">
      <span className={`wc-dot wc-dot--min ${dark?'wc-dot--dk':''}`} aria-hidden title="Réduire">&#x2212;</span>
      <span className={`wc-dot wc-dot--max ${dark?'wc-dot--dk':''}`} aria-hidden title="Agrandir">&#x25A1;</span>
      <span className={`wc-dot wc-dot--cls ${dark?'wc-dot--dk':''}`} aria-hidden title="Fermer">&#x2715;</span>
    </div>
  </div>
);

const FACEBOOK_URL = "https://web.facebook.com/profile.php?id=61577494705852";

const PROJECTS = [
  { id:1, title:"ShopCI", subtitle:"Marketplace E-commerce", cat:"en-ligne", progress:65,
    description:"Marketplace multi-vendeurs conçue pour répondre aux problèmes de fiabilité, de visibilité et de gestion des ventes dans le e-commerce local ivoirien.",
    image:"/assets/images/projects/monmarket-preview.jpg",
    tech:["React","Django","Bootstrap 5","Vercel + PythonAnywhere"],
    stats:[{icon:"users",label:"Multi-vendeurs"},{icon:"shopping-cart",label:"Panier temps réel"},{icon:"shield-alt",label:"Paiement sécurisé"}],
    url:"https://shop-ci.vercel.app/", year:"2024", isPremium:true },
  { id:2, title:"TechFlow", subtitle:"Site Vitrine Professionnel", cat:"en-ligne", progress:97,
    description:"Site vitrine moderne destiné à présenter une activité technologique de manière claire et professionnelle.",
    image:"/assets/images/projects/techflow-preview.jpg",
    tech:["HTML / Tailwind CSS","JavaScript","Vercel"],
    stats:[{icon:"users",label:"Tailwind CSS"},{icon:"shopping-cart",label:"UI propre & responsive"},{icon:"shield-alt",label:"Déployé en production"}],
    url:"https://techflow-ten.vercel.app/", year:"2024", isPremium:true },
  { id:3, title:"TerraSafe", subtitle:"Marketplace Foncière", cat:"en-ligne", progress:85,
    description:"Plateforme foncière visant à réduire les risques d'arnaques liées à la vente de terrains. Backend sécurisé avec recherche avancée.",
    image:"/assets/images/projects/terrasafe-preview.jpg",
    tech:["Python/Flask","MySQL","JavaScript","Bootstrap 5"],
    stats:[{icon:"database",label:"MySQL + Flask"},{icon:"lock",label:"Auth sécurisée"},{icon:"search",label:"Recherche avancée"}],
    url:"https://wthomassss06.pythonanywhere.com", year:"2024", isPremium:true },
  { id:4, title:"Chap-chapMAP", subtitle:"Navigation Intelligente", cat:"demo", progress:100,
    description:"Application de cartographie intelligente permettant de localiser un utilisateur en temps réel et de calculer des itinéraires optimisés.",
    image:"/assets/images/projects/chapchapmap-preview.jpg",
    tech:["JavaScript","Leaflet.js","OSRM API","Geolocation API"],
    stats:[{icon:"map-marked-alt",label:"API Leaflet"},{icon:"route",label:"Calcul itinéraires"},{icon:"location-arrow",label:"GPS temps réel"}],
    url:"/demos/chap-chapMAP.html", year:"2023" },
  { id:5, title:"ElvisMarket", subtitle:"Interface E-commerce", cat:"demo", progress:100,
    description:"Interface e-commerce développée pour expérimenter la gestion d'état, le panier dynamique et l'optimisation de l'UX.",
    image:"/assets/images/projects/elvismarket-preview.jpg",
    tech:["HTML + JS vanilla","Tailwind CSS","LocalStorage"],
    stats:[{icon:"shopping-bag",label:"Panier dynamique"},{icon:"filter",label:"Filtres avancés"},{icon:"mobile-alt",label:"Responsive"}],
    url:"/demos/projet2.html", year:"2023" },
  { id:6, title:"MonCashJour", subtitle:"Gestion de Ventes", cat:"demo", progress:100,
    description:"Application de gestion de ventes quotidiennes destinée aux petits commerçants, avec visualisation des performances et export des données.",
    image:"/assets/images/projects/moncashjour-preview.jpg",
    tech:["HTML + JS vanilla","Tailwind CSS","Chart.js"],
    stats:[{icon:"chart-line",label:"Analytiques"},{icon:"file-export",label:"Export CSV"},{icon:"history",label:"Historique"}],
    url:"/demos/projet1.html", year:"2023" },
  { id:7, title:"LivreurTrack Pro", subtitle:"Suivi Logistique", cat:"demo", progress:100,
    description:"Système de suivi logistique simulant un workflow réel de livraison, avec validation par photo et suivi d'étapes.",
    image:"/assets/images/projects/livreurtrack-preview.jpg",
    tech:["JavaScript","Bootstrap 5","LocalStorage","Camera API"],
    stats:[{icon:"tasks",label:"Workflow 5 étapes"},{icon:"camera",label:"Validation photo"},{icon:"history",label:"Historique complet"}],
    url:"/demos/projet3.html", year:"2023" },
  { id:8, title:"LinkedIn Banner Pro", subtitle:"Générateur SaaS", cat:"en-cours", progress:30,
    description:"Outil SaaS en cours de développement permettant de générer des bannières LinkedIn professionnelles via un éditeur visuel.",
    image:"/assets/images/projects/linkedin-banner-preview.jpg",
    tech:["JavaScript","Canvas API","Tailwind CSS"],
    stats:[{icon:"paint-brush",label:"Éditeur visuel"},{icon:"eye",label:"Preview temps réel"},{icon:"download",label:"Export PNG"}],
    url:"/demos/projet7.html", year:"2025" },
  { id:9, title:"Tati", subtitle:"Portfolio & Vitrine Moderne", cat:"en-ligne", progress:100,
    description:"Portfolio personnel double fonction : vitrine professionnelle et page de présentation. Animations fluides, thème sombre/clair, design 100% responsive.",
    image:"/assets/images/projects/tati-preview.jpg",
    tech:["React","Tailwind CSS","Framer Motion","Vercel"],
    stats:[{icon:"user",label:"Portfolio & Vitrine"},{icon:"adjust",label:"Thème sombre/clair"},{icon:"mobile-alt",label:"100% Responsive"}],
    url:"https://tatii.vercel.app/", year:"2024", isPremium:true },
  { id:10, title:"MK", subtitle:"Portfolio Graphiste Client", cat:"en-ligne", progress:100,
    description:"Portfolio professionnel sur-mesure pour un client graphiste. Galerie immersive, animations soignées et thème sombre élégant.",
    image:"/assets/images/projects/mk-preview.jpg",
    tech:["React","Tailwind CSS","Framer Motion","Vercel"],
    stats:[{icon:"paint-brush",label:"Galerie créative"},{icon:"star",label:"Design sur-mesure"},{icon:"globe",label:"En production"}],
    url:"https://mory01ff.vercel.app/", year:"2024", isPremium:true },
  { id:11, title:"ManoBeat 777", subtitle:"Portfolio Beatmaker", cat:"en-ligne", progress:100,
    description:"Portfolio d'un beatmaker ivoirien : découvrez et écoutez ses créations directement en ligne, puis achetez vos beats préférés via WhatsApp en quelques clics.",
    image:"/assets/images/projects/beatstore-preview.jpg",
    tech:["React","Tailwind CSS","Howler.js","Vercel"],
    stats:[{icon:"headphones",label:"Écoute en ligne"},{icon:"whatsapp",label:"Achat via WhatsApp"},{icon:"music",label:"Catalogue beats"}],
    url:"https://xxx-x.vercel.app/", year:"2025", isPremium:true },
  { id:12, title:"New Horizon Service", subtitle:"Location de Résidences", cat:"en-ligne", progress:100,
    description:"Plateforme de location de résidences meublées haut de gamme. Interface moderne côté client, backend Flask sécurisé avec API REST, recherche avancée et gestion des disponibilités.",
    image:"/assets/images/projects/newhorizon-preview.jpg",
    tech:["Next.js","Flask","Python","MySQL","Vercel"],
    stats:[{icon:"home",label:"Résidences meublées"},{icon:"search",label:"Recherche avancée"},{icon:"calendar-check",label:"Réservation en ligne"}],
    url:"https://new-horizonservice.vercel.app/", year:"2025", isPremium:true },
  { id:13, title:"AKATech", subtitle:"Agence Digitale Abidjan", cat:"en-ligne", progress:100,
    description:"Site officiel de mon agence — AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire avec des solutions web modernes : sites vitrines, e-commerce, SaaS. Aurora WebGL, animations Framer Motion, design vert/noir premium.",
    image:"/assets/images/projects/akatech-preview.jpg",
    tech:["Next.js 15","Framer Motion","WebGL Aurora","Vercel"],
    stats:[{icon:"rocket",label:"Agence officielle"},{icon:"palette",label:"Design premium"},{icon:"globe",label:"En production"}],
    url:"https://akatech.vercel.app/", year:"2025", isPremium:true, isAgency:true },
  { id:14, title:"Université les Anges", subtitle:"Site Institutionnel", cat:"en-ligne", progress:100,
    description:"Site institutionnel moderne pour l'Université les Anges : présentation de l'établissement, des formations, des actualités et des contacts. Interface responsive, design soigné.",
    image:"/assets/images/projects/universitelesanges-preview.jpg",
    tech:["HTML","CSS","Bulma","Bootstrap","Vercel"],
    stats:[{icon:"university",label:"Site institutionnel"},{icon:"mobile-alt",label:"Responsive"},{icon:"globe",label:"En production"}],
    url:"https://universitelesanges.vercel.app/", year:"2025", isPremium:true },
];

const SERVICES = [
  { n:"01", icon:"code",       title:"Applications Web",       desc:"Apps CRUD complètes, dashboards de gestion, solutions sur-mesure.", features:["Applications CRUD complètes","Dashboards de gestion","Solutions sur-mesure"] },
  { n:"02", icon:"server",     title:"API RESTful",             desc:"APIs Python/Flask documentées, sécurisées, prêtes pour la production.", features:["API RESTful avec Python","Documentation complète","Sécurité intégrée"] },
  { n:"03", icon:"mobile-alt", title:"Interfaces Responsives",  desc:"Design et intégration d'interfaces modernes et adaptatives.", features:["Design responsive","UX optimale","Performance maximale"] },
  { n:"04", icon:"database",   title:"Bases de Données",        desc:"Conception et optimisation de bases de données MySQL.", features:["Modélisation de données","Requêtes SQL optimisées","Intégrité des données"] },
  { n:"05", icon:"shield-alt", title:"Sécurité Applicative",    desc:"Bonnes pratiques de sécurité intégrées dès la conception.", features:["Protection des données","Gestion des accès","Sécurisation Python"] },
  { n:"06", icon:"tools",      title:"Support Technique",       desc:"Maintenance informatique et assistance technique utilisateur.", features:["Maintenance matérielle","Support utilisateur","Résolution de problèmes"] },
];

const PRICING_TABS = [
  {
    key:"vitrine", label:"Site Vitrine", icon:"Globe",
    plans:[
      { badge:"STARTER",   price:"60 000 FCFA",  title:"Starter",  delivery:"5 à 7 jours",
        features:["Design moderne responsive","Jusqu'à 3 pages","Formulaire de contact","Intégration WhatsApp","Liens réseaux sociaux","SEO de base","Mise en ligne incluse"] },
      { badge:"STANDARD",  price:"120 000 FCFA", title:"Standard", delivery:"7 à 10 jours", isPopular:true,
        features:["Design professionnel responsive","Jusqu'à 5 pages","Formulaire de contact","Google Maps intégré","Intégration WhatsApp","SEO optimisé","Optimisation vitesse"] },
      { badge:"PREMIUM",   price:"200 000 FCFA", title:"Premium",  delivery:"10 à 14 jours",
        features:["Jusqu'à 8 pages","Design personnalisé","Blog intégré","Optimisation SEO avancée","Formulaire avancé","Newsletter intégrée","Formation incluse"] },
    ]
  },
  {
    key:"ecommerce", label:"E-commerce", icon:"ShoppingCart",
    plans:[
      { badge:"STARTER",  price:"200 000 FCFA", title:"Starter",  delivery:"10 à 14 jours",
        features:["Catalogue produits","Jusqu'à 20 produits","Panier d'achat","Paiement à la livraison","Interface admin","Gestion des commandes"] },
      { badge:"STANDARD", price:"350 000 FCFA", title:"Standard", delivery:"15 à 20 jours", isPopular:true,
        features:["Jusqu'à 50 produits","Paiement en ligne","Gestion des stocks","Filtres produits","SEO e-commerce","Formation incluse"] },
      { badge:"PREMIUM",  price:"500 000 FCFA", title:"Premium",  delivery:"3 à 4 semaines",
        features:["Jusqu'à 150 produits","Paiement sécurisé","Gestion commandes complète","Avis clients","Statistiques de vente","Optimisation performance"] },
    ]
  },
  {
    key:"saas", label:"Application SaaS", icon:"Cpu",
    plans:[
      { badge:"STARTER",  price:"500 000 FCFA",   title:"Starter",  delivery:"3 à 4 semaines",
        features:["Backend Python / Flask","Base de données MySQL","Interface utilisateur","Dashboard admin","API REST"] },
      { badge:"STANDARD", price:"800 000 FCFA",   title:"Standard", delivery:"4 à 6 semaines", isPopular:true,
        features:["Backend Django / Flask","Authentification utilisateurs","Dashboard avancé","API REST sécurisée","Optimisation performance"] },
      { badge:"PREMIUM",  price:"1 200 000 FCFA", title:"Premium",  delivery:"6 à 8 semaines",
        features:["Architecture complète","Gestion des abonnements","Dashboard complet","API avancée","Documentation technique","Support 3 mois inclus"] },
    ]
  },
  {
    key:"portfolio", label:"Portfolio", icon:"Star",
    plans:[
      { badge:"STARTER",  price:"50 000 FCFA",  title:"Starter",  delivery:"3 à 5 jours",
        features:["Design responsive","3 pages","Section projets","Formulaire de contact"] },
      { badge:"STANDARD", price:"100 000 FCFA", title:"Standard", delivery:"5 à 7 jours", isPopular:true,
        features:["5 pages","Animations modernes","Section projets détaillés","SEO de base"] },
      { badge:"PREMIUM",  price:"150 000 FCFA", title:"Premium",  delivery:"7 à 10 jours",
        features:["Design personnalisé","Animations avancées","Blog intégré","Optimisation performance"] },
    ]
  },
];

const FAQ = [
  { q:"Combien coûte un site web ?", a:"Les projets commencent à partir de 60 000 FCFA pour un site vitrine simple. Le prix final dépend des fonctionnalités demandées." },
  { q:"Combien de temps prend la création d'un site ?", a:"Un site vitrine est livré en 5 à 10 jours. Un projet plus complexe (e-commerce, SaaS) peut prendre plusieurs semaines selon la complexité." },
  { q:"Puis-je modifier mon site moi-même ?", a:"Oui. Une formation rapide est incluse dans la plupart des offres pour que vous puissiez gérer votre site facilement." },
  { q:"Proposez-vous un support après la livraison ?", a:"Oui. Un support technique est disponible après la livraison pour vous accompagner si nécessaire." },
  { q:"Les prix sont-ils fixes ?", a:"Chaque projet étant unique, les tarifs peuvent varier selon les fonctionnalités demandées. Un devis gratuit est établi après discussion." },
];

const SKILLS = {
  frontend: [
    { name:"React",      icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name:"JavaScript", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name:"TypeScript", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name:"Next.js",    icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name:"Tailwind",   icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name:"HTML5",      icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name:"CSS3",       icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name:"Bootstrap",  icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
  ],
  backend: [
    { name:"Python",  icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name:"Flask",   icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
    { name:"Django",  icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
    { name:"Node.js", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name:"MySQL",   icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  ],
  tools: [
    { name:"Git",           icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name:"VS Code",       icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name:"GitHub",        icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name:"ChatGPT",       icon:"https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
    { name:"Gemini",        icon:"https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" },
    { name:"Claude AI",     icon:"https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg" },
    { name:"PythonAnywhere",icon:"https://www.pythonanywhere.com/static/anywhere/images/PA-logo.svg" },
    { name:"Vercel",        icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
    { name:"Netlify",       icon:"https://logo.svgcdn.com/logos/netlify.svg" },
  ],
  autres: [
    { name:"Windows",     icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" },
    { name:"Android",     icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" },
    { name:"Word",        icon:"https://img.icons8.com/fluency/48/microsoft-word-2019.png" },
    { name:"Excel",       icon:"https://img.icons8.com/fluency/48/microsoft-excel-2019.png" },
    { name:"PowerPoint",  icon:"https://img.icons8.com/fluency/48/microsoft-powerpoint-2019.png" },
    { name:"MS Project",  icon:"https://img.icons8.com/fluency/48/microsoft-project-2019.png" },
    { name:"Facebook",    icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" },
    { name:"Peinture",    icon:"https://img.icons8.com/fluency/48/paint-palette.png" },
    { name:"Maintenance", icon:"https://img.icons8.com/fluency/48/maintenance.png" },
    { name:"Support Tech",icon:"https://img.icons8.com/fluency/48/technical-support.png" },
  ],
};

const TIMELINE = [
  { date:"2025 – 2026", icon:"rocket", title:"Développeur Freelance Fullstack", company:"AKATech",
    items:[
      "Conception et déploiement de plus de 10 applications web (SaaS, e-commerce, plateformes)",
      "Développement d'API REST avec Django et Flask",
      "Mise en place de dashboards et systèmes de gestion de données",
    ],
    progLabels:["Apps web","API REST","Dashboards","Déploiement"],
    progValues:[95,88,82,90],
    tags:["Freelance","Full-Stack","Django","React","SaaS","Data"] },
  { date:"Mai – Nov. 2025", icon:"briefcase", title:"Informaticien Stagiaire", company:"Mairie d'Agboville",
    items:["Maintenance du parc informatique et du réseau","Support technique aux utilisateurs","Contribution à la gestion et à la numérisation des données","Appui à la création d'outils numériques internes"],
    progLabels:["Maintenance","Support","Gestion","Outils"],
    progValues:[90,85,75,80] },
  { date:"2023-2024", icon:"laptop-code", title:"Projet Académique – ARTICI", company:"UVCI",
    items:["Plateforme web de promotion de l'artisanat local","Travail collaboratif en équipe pluridisciplinaire","Optimisation des performances","Intégration de bonnes pratiques de sécurité"],
    progLabels:["Frontend","Backend","Perf.","Sécurité"],
    progValues:[80,75,85,90] },
  { date:"2023-2024", icon:"graduation-cap", title:"Licence en Réseau et Sécurité Informatique", company:"UVCI",
    desc:"Formation complète en développement web, bases de données et sécurité des applications.", tags:["Certification E-Banking","Réf: CC/24-002485"] },
  { date:"2020-2021", icon:"school", title:"Baccalauréat Série D", company:"Lycée Moderne d'Arrah", desc:"Mention : Assez Bien" },
];

const GRAD = [
  "linear-gradient(135deg,#0d1b2a,#1a3a5c)",
  "linear-gradient(135deg,#0a1628,#1e3a5f)",
  "linear-gradient(135deg,#1a0a2e,#2d1b69)",
  "linear-gradient(135deg,#0d2818,#1a4a2e)",
  "linear-gradient(135deg,#2a0a0a,#5c1a1a)",
  "linear-gradient(135deg,#1a1a0a,#3a3a1a)",
  "linear-gradient(135deg,#0a1a2a,#1a3050)",
  "linear-gradient(135deg,#1a0a28,#3a1a58)",
  "linear-gradient(135deg,#0a2a1a,#1a5a3a)",
  "linear-gradient(135deg,#2a1a0a,#5a3a1a)",
  "linear-gradient(135deg,#060e09,#0a2a12)",  // AKATech — vert forêt profond
];

const BADGE_LIGHT = {"en-ligne":"#C94B2A","demo":"#A0522D","en-cours":"#E06B2A"};
const BADGE_DARK  = {"en-ligne":"#00ff88","demo":"#ff4466","en-cours":"#ffaa00"};
const CAT_LABELS  = {all:"Tous","en-ligne":"En ligne","demo":"Démos","en-cours":"En cours"};

function useInView(thr=0.1){
  const r=useRef(null); const [v,setV]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting) setV(true); },{threshold:thr});
    if(r.current) o.observe(r.current);
    return ()=>o.disconnect();
  },[thr]);
  return [r,v];
}

function useRipple() {
  const ref = useRef(null);
  const trigger = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const x = (e.clientX ?? e.touches?.[0]?.clientX ?? rect.left + rect.width/2) - rect.left - size/2;
    const y = (e.clientY ?? e.touches?.[0]?.clientY ?? rect.top + rect.height/2) - rect.top  - size/2;
    const wave = document.createElement('span');
    wave.className = 'mi-ripple-wave';
    wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    el.classList.add('mi-ripple-host');
    el.appendChild(wave);
    setTimeout(() => wave.remove(), 600);
  }, []);
  return [ref, trigger];
}

const MagBtn = ({ className='', onClick, children, ...rest }) => {
  const [ref, ripple] = useRipple();
  return (
    <button ref={ref} className={`mi-ripple-host mi-glint ${className}`}
      onClick={e => { ripple(e); onClick?.(e); }} {...rest}>{children}</button>
  );
};

// ── Vrai 3D Tilt Card — mouse (PC) + touch natif (mobile) ──────
const TiltCard = ({ children, className='', style={}, onClick, intensity=12, perspective=900 }) => {
  const ref     = useRef(null);
  const glowRef = useRef(null);
  const rafRef  = useRef(null);

  // Fonction centrale : applique le tilt à partir de coordonnées écran
  const applyTilt = useCallback((mx, my, intens) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const rx = ((my - cy) / (rect.height / 2)) * -intens;
    const ry = ((mx - cx) / (rect.width  / 2)) *  intens;
    const px = ((mx - rect.left) / rect.width)  * 100;
    const py = ((my - rect.top)  / rect.height) * 100;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
      el.style.transition = 'transform .08s linear';
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(280px circle at ${px}% ${py}%, rgba(255,85,0,.13) 0%, transparent 68%)`;
        glowRef.current.style.opacity = '1';
      }
    });
  }, [perspective]);

  const resetTilt = useCallback(() => {
    const el = ref.current; if (!el) return;
    cancelAnimationFrame(rafRef.current);
    el.style.transition = 'transform .45s cubic-bezier(.25,.46,.45,.94)';
    el.style.transform  = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }, [perspective]);

  // Mouse (PC) — via React synthetic (fiable sur desktop)
  const onMouseMove  = useCallback(e => applyTilt(e.clientX, e.clientY, intensity),       [applyTilt, intensity]);
  const onMouseLeave = useCallback(()  => resetTilt(),                                      [resetTilt]);

  // Touch (mobile) — listeners natifs ajoutés via useEffect
  // (les synthetic onTouchMove de React peuvent perdre e.touches sur certains navigateurs mobiles)
  useEffect(() => {
    const el = ref.current; if (!el) return;
    // Intensité réduite sur mobile (doigt = geste plus ample)
    const mobIntensity = intensity * 0.65;

    const onTouchMove = e => {
      if (!e.touches || !e.touches[0]) return;
      applyTilt(e.touches[0].clientX, e.touches[0].clientY, mobIntensity);
    };
    const onTouchEnd = () => resetTilt();

    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend',  onTouchEnd,  { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchmove',   onTouchMove);
      el.removeEventListener('touchend',    onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [applyTilt, resetTilt, intensity]);

  return (
    <div
      ref={ref}
      className={`tilt3d ${className}`}
      style={{ ...style, willChange:'transform', transformStyle:'preserve-3d' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div ref={glowRef} className="tilt3d-glow"/>
      {children}
    </div>
  );
};

const SpotlightCard = ({ children, className='', style={} }) => {
  const ref = useRef(null);
  const layerRef = useRef(null);
  const onMove = useCallback(e => {
    const el = ref.current; if (!el || !layerRef.current) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    layerRef.current.style.background =
      `radial-gradient(320px circle at ${x}px ${y}px, rgba(255,85,0,.09) 0%, transparent 70%)`;
  }, []);
  return (
    <div ref={ref} className={`mi-spotlight ${className}`} style={style} onMouseMove={onMove}>
      <div ref={layerRef} className="mi-spotlight-layer" style={{display:'block',position:'absolute',inset:0,pointerEvents:'none',zIndex:0,transition:'background .08s'}}/>{children}
    </div>
  );
};

function useStagger(thr=0.08){ const [r,v] = useInView(thr); return [r, v]; }

/* ── usePhotoColor : couleur si la section est active (scroll à son niveau) ── */
function usePhotoColor() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = ref.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const mid = window.innerHeight * 0.5;
      setActive(rect.top <= mid && rect.bottom >= mid);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);
  return [ref, active];
}

/* ══════════════════════════════════════════════════════════════
   STACKED CARD — swipe horizontal, mobile uniquement
   Swipe gauche → carte suivante (s'envole vers l'arrière)
   Swipe droite → carte précédente (revient vers l'avant)
   Cartes fantômes = prochaines cartes en attente.
   ══════════════════════════════════════════════════════════════ */
const StackedCard = ({ items, renderCard }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx,   setPrevIdx]   = useState(null);
  const [dir,       setDir]       = useState(1); // 1=forward, -1=backward
  const total    = items.length;
  const busy     = useRef(false);
  const touchX0  = useRef(null);
  const activeRef= useRef(0);
  useEffect(() => { activeRef.current = activeIdx; }, [activeIdx]);

  const goTo = useCallback((next) => {
    if (busy.current) return;
    const cur = activeRef.current;
    if (next < 0 || next >= total) return;
    busy.current = true;
    setDir(next > cur ? 1 : -1);
    setPrevIdx(cur);
    setActiveIdx(next);
    setTimeout(() => { setPrevIdx(null); busy.current = false; }, 480);
  }, [total]);

  const onTouchStart = e => { touchX0.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchX0.current === null) return;
    const dx = touchX0.current - e.changedTouches[0].clientX;
    touchX0.current = null;
    if (Math.abs(dx) < 40) return; // trop petit → ignoré
    goTo(dx > 0 ? activeRef.current + 1 : activeRef.current - 1);
  };

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
         style={{ userSelect:'none', touchAction:'pan-y' }}>

      {/* Barre de progression */}
      <div className="sc-progress-bar">
        <div className="sc-progress-fill"
             style={{ width:`${((activeIdx+1)/total)*100}%` }}/>
      </div>
      <div className="sc-counter">
        <span className="sc-counter-cur">{String(activeIdx+1).padStart(2,'0')}</span>
        <span className="sc-counter-sep"> / </span>
        <span>{String(total).padStart(2,'0')}</span>
      </div>

      {/* Zone empilée */}
      <div className="sc-stack-area">
        {/* Cartes fantômes = prochaines cartes en attente */}
        {[2,1].map(offset => {
          const gi = activeIdx + offset;
          if (gi >= total) return null; // plus de cartes → pas de fantôme
          return (
            <div key={`g${offset}`} className="sc-ghost" style={{
              opacity: 1 - offset * 0.22,
              filter: `blur(${offset * 0.8}px)`,
              transform: `translateY(${-offset * 8}px) scale(${1 - offset * 0.03})`,
            }} aria-hidden>
              {renderCard(items[gi], gi)}
            </div>
          );
        })}

        {/* Carte sortante */}
        {prevIdx !== null && (
          <div className={`sc-card sc-card--exit-${dir > 0 ? 'back' : 'fwd'}`}
               key={`p${prevIdx}`}>
            {renderCard(items[prevIdx], prevIdx)}
          </div>
        )}

        {/* Carte active */}
        <div className={`sc-card sc-card--enter-${dir > 0 ? 'fwd' : 'back'}`}
             key={`a${activeIdx}`}>
          {renderCard(items[activeIdx], activeIdx)}
        </div>
      </div>

      {/* Dots de navigation (tap) */}
      <div className="sc-dots">
        {items.map((_,i) => (
          <button key={i}
            className={`sc-dot${i===activeIdx?' sc-dot--on':''}`}
            onClick={()=>goTo(i)}
            aria-label={`Carte ${i+1}`}/>
        ))}
      </div>
    </div>
  );
};

function useReveal(thr=0.1){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if (!el) return;
    el.classList.add('mi-reveal');
    const o = new IntersectionObserver(([e])=>{
      if (e.isIntersecting) { el.classList.add('mi-reveal--vis'); o.disconnect(); }
    },{threshold:thr});
    o.observe(el);
    return ()=>o.disconnect();
  },[thr]);
  return ref;
}

const ProgressBar = ({ value=0, label='', visible=false }) => {
  const fillRef = useRef(null);
  useEffect(()=>{ if (fillRef.current) { fillRef.current.style.width = visible ? `${value}%` : '0%'; } },[visible, value]);
  return (
    <div>
      <div className="mi-progress-row">
        {label && <span className="mi-progress-label">{label}</span>}
        <span className="mi-progress-val">{value}%</span>
      </div>
      <div className="mi-progress-track"><div ref={fillRef} className="mi-progress-fill"/></div>
    </div>
  );
};

const ParticleCanvas = ({global: isGlobal = false, light: isLight = false}) => {
  const cvRef = useRef(null);
  useEffect(()=>{
    const cv = cvRef.current; if(!cv) return;
    const ctx = cv.getContext('2d'); let raf;
    const COLORS = isLight ? ['#ff8c00','#ff6b00','#ffa533','#ffb347','#e65c00'] : ['#00ff88','#7EE787','#00e676','#69f0ae','#b9f6ca'];
    const CONN_COLOR = isLight ? '#ff8c00' : '#00ff88';
    const resize = () => { cv.width=cv.offsetWidth; cv.height=cv.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const mouse = { x: null, y: null };
    // Canvas a pointer-events:none → impossible de catcher mousemove sur lui.
    // On écoute window et on convertit en coords locales si besoin.
    const onWindowMouse = e => {
      if (isGlobal) {
        mouse.x = e.clientX; mouse.y = e.clientY;
      } else {
        const rect = cv.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }
    };
    const onWindowLeave = () => { mouse.x = null; mouse.y = null; };
    window.addEventListener('mousemove', onWindowMouse);
    window.addEventListener('mouseleave', onWindowLeave);
    const pts = Array.from({length:110},()=>({
      x: Math.random()*cv.width, y: Math.random()*cv.height,
      r: Math.random()*2.2+0.7, vx:(Math.random()-.5)*0.8, vy:(Math.random()-.5)*0.8,
      c: COLORS[Math.floor(Math.random()*COLORS.length)], a: Math.random()*.55+.28,
    }));
    const draw = () => {
      ctx.clearRect(0,0,cv.width,cv.height);

      // ── Lignes d'attraction vers le curseur ──
      if (mouse.x !== null) {
        pts.forEach(p => {
          const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
          if (d < 180) {
            ctx.globalAlpha = (1 - d / 180) * 0.22;
            ctx.strokeStyle = CONN_COLOR;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      }

      pts.forEach(p=>{
        if (mouse.x !== null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
          if (d < 160) { const force = (160 - d) / 160, angle = Math.atan2(dy, dx); p.vx -= Math.cos(angle) * force * 1.4; p.vy -= Math.sin(angle) * force * 1.4; }
        }
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 1.5) { p.vx = (p.vx/spd)*1.5; p.vy = (p.vy/spd)*1.5; }
        p.vx *= 0.995; p.vy *= 0.995;
        if (Math.abs(p.vx) < 0.15) p.vx += (Math.random()-.5)*0.25;
        if (Math.abs(p.vy) < 0.15) p.vy += (Math.random()-.5)*0.25;
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>cv.width) p.vx*=-1; if(p.y<0||p.y>cv.height) p.vy*=-1;
        ctx.save(); ctx.globalAlpha=p.a*.35;
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*10);
        g.addColorStop(0,p.c); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*10,0,Math.PI*2); ctx.fill(); ctx.restore();
        ctx.globalAlpha=p.a; ctx.fillStyle=p.c; ctx.shadowBlur=12; ctx.shadowColor=p.c;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1; ctx.shadowBlur=0;
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
        if(d<140){ ctx.globalAlpha=(1-d/140)*.28; ctx.strokeStyle=CONN_COLOR; ctx.lineWidth=.7;
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); ctx.globalAlpha=1; }
      }

      // ── Halo curseur ──
      if (mouse.x !== null) {
        const cg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
        cg.addColorStop(0, CONN_COLOR.replace(')', ',0.12)').replace('rgb','rgba').replace('#ff8c00','rgba(255,140,0,0.12)').replace('#00ff88','rgba(0,255,136,0.12)'));
        cg.addColorStop(1, 'transparent');
        ctx.globalAlpha = 1;
        ctx.fillStyle = isLight ? 'rgba(255,140,0,0.10)' : 'rgba(0,255,136,0.10)';
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2); ctx.fill();
      }

      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{
      cancelAnimationFrame(raf); window.removeEventListener('resize',resize);
      window.removeEventListener('mousemove', onWindowMouse);
      window.removeEventListener('mouseleave', onWindowLeave);
    };
  },[isLight]);
  return <canvas ref={cvRef} className={isGlobal ? "particle-canvas particle-canvas--global" : "particle-canvas"}/>
};

const CustomCursor = () => {
  const dotRef = useRef(null);
  useEffect(()=>{
    const dot = dotRef.current; if(!dot) return;
    const move = e => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; };
    const over = e => {
      if(e.target.closest('a,button,[role=button],.sk-m-card,.c3d-card,.c3d-arrow,.mob-arr')) dot.classList.add('cursor-hover');
      else dot.classList.remove('cursor-hover');
    };
    window.addEventListener('mousemove', move); window.addEventListener('mouseover', over);
    return ()=>{ window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
  },[]);
  return <div ref={dotRef} className="cursor-dot"/>;
};

const Noise = () => (
  <svg className="noise" xmlns="http://www.w3.org/2000/svg">
    <filter id="nf"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <rect width="100%" height="100%" filter="url(#nf)"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// LOADER v4 — page.js style, orange, responsive, dark/light
// ═══════════════════════════════════════════════════════════════
const LOADER_CSS_ID = 'akaloader-v4-styles';
const LOADER_CSS = `
@keyframes aka4LoaderScan { 0%{top:-2%} 100%{top:104%} }
@keyframes aka4FadeUp     { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes aka4OrbPulse   { 0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.08)} }
@keyframes aka4DotBlink   { 0%,100%{opacity:.4} 50%{opacity:1} }
@keyframes aka4BarGlow    { 0%,100%{opacity:.6} 50%{opacity:1} }
/* backgrounds */
.ldv4-bg-dark  { position:absolute; inset:0;
  background:linear-gradient(150deg,#090200 0%,#070100 55%,#0c0300 100%); }
.ldv4-bg-light { position:absolute; inset:0;
  background:linear-gradient(150deg,#fdf8f5 0%,#fff5ef 55%,#fef0e8 100%); }
.ldv4-grid { position:absolute; inset:0; opacity:.055; pointer-events:none;
  background-image:linear-gradient(rgba(255,85,0,.5) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(255,85,0,.5) 1px,transparent 1px);
  background-size: clamp(30px,4.5vw,52px) clamp(30px,4.5vw,52px); }
.ldv4-grid--light { opacity:.04; }
.ldv4-orb { position:absolute; top:50%; left:50%;
  width:min(560px,85vw); height:min(560px,85vw); border-radius:50%;
  background:radial-gradient(circle,rgba(255,85,0,.07) 0%,transparent 65%);
  pointer-events:none; animation:aka4OrbPulse 3.5s ease-in-out infinite; }
.ldv4-scan { position:absolute; left:0; right:0; height:1px; pointer-events:none;
  background:linear-gradient(90deg,transparent 0%,rgba(255,100,30,.45) 50%,transparent 100%);
  animation:aka4LoaderScan 5s linear infinite 1s; }
/* inner layout */
.ldv4-inner { position:relative; z-index:2; display:flex; flex-direction:column;
  align-items:center; text-align:center; width:100%;
  padding:0 clamp(16px,5vw,40px); gap:0; }
.ldv4-logo-wrap  { margin-bottom:clamp(20px,4vh,44px); animation:aka4FadeUp .55s ease .05s both; }
.ldv4-tag        { display:inline-flex; align-items:center; gap:.5em;
  padding:.28em .9em; border-radius:100px; border:1px solid rgba(255,85,0,.22);
  background:rgba(255,85,0,.07); backdrop-filter:blur(8px);
  font-family:'JetBrains Mono',monospace; letter-spacing:.14em; text-transform:uppercase;
  font-size:clamp(.5rem,.85vw,.7rem); color:rgba(255,110,30,.7);
  margin-bottom:clamp(14px,3vh,28px); animation:aka4FadeUp .55s ease .12s both; }
.ldv4-tag--light { color:rgba(180,60,0,.65); border-color:rgba(255,85,0,.18); background:rgba(255,85,0,.05); }
.ldv4-tag-dot    { width:5px; height:5px; border-radius:50%; background:#ff5500; display:inline-block;
  animation:aka4DotBlink 1.4s ease-in-out infinite; }
.ldv4-num        { font-family:'Syne',sans-serif; font-weight:800; line-height:.88;
  letter-spacing:-.045em; color:#f4efe8;
  font-size:clamp(60px,15vw,148px);
  text-shadow:0 0 50px rgba(255,85,0,.2);
  margin-bottom:clamp(18px,3.5vh,32px); animation:aka4FadeUp .55s ease .18s both; }
.ldv4-num--light { color:#1a0800; text-shadow:0 0 30px rgba(255,85,0,.15); }
.ldv4-num span   { font-size:.34em; vertical-align:super; color:#ff5500; font-weight:700; }
.ldv4-bar-wrap   { width:min(300px,76vw); position:relative;
  margin-bottom:clamp(14px,2.5vh,24px); animation:aka4FadeUp .55s ease .24s both; }
.ldv4-bar-track  { height:2px; width:100%; background:rgba(255,85,0,.1); border-radius:2px;
  position:relative; overflow:visible; }
.ldv4-bar-fill   { height:100%; border-radius:2px;
  background:linear-gradient(90deg,rgba(180,40,0,.55),#ff5500);
  transition:width .13s linear; box-shadow:0 0 10px rgba(255,85,0,.35); }
.ldv4-bar-tip    { position:absolute; top:50%; transform:translate(-50%,-50%);
  width:7px; height:7px; border-radius:50%; background:#ff6520;
  box-shadow:0 0 0 3px rgba(255,85,0,.18),0 0 12px 4px rgba(255,85,0,.45);
  transition:left .13s linear; animation:aka4BarGlow 1s ease-in-out infinite; pointer-events:none; }
.ldv4-msg        { font-family:'JetBrains Mono',monospace; letter-spacing:.16em;
  text-transform:uppercase; font-size:clamp(.58rem,1.1vw,.78rem);
  color:rgba(255,130,50,.6); min-height:1.3em;
  margin-bottom:.5rem; animation:aka4FadeUp .55s ease .3s both; }
.ldv4-msg--light { color:rgba(160,55,0,.55); }
.ldv4-sub        { font-family:'JetBrains Mono',monospace; letter-spacing:.28em;
  text-transform:uppercase; font-size:clamp(.46rem,.82vw,.6rem);
  color:rgba(255,85,0,.24); animation:aka4FadeUp .55s ease .36s both; }
.ldv4-sub--light { color:rgba(200,70,0,.22); }
`;

const Loader = ({ onDone }) => {
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState('Initialisation…');
  // detect saved theme to match loader bg
  const [isLight] = useState(() => {
    try { return localStorage.getItem('aka-theme') === 'light'; } catch { return false; }
  });

  useEffect(() => {
    if (!document.getElementById(LOADER_CSS_ID)) {
      const s = document.createElement('style');
      s.id = LOADER_CSS_ID;
      s.textContent = LOADER_CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPct(p => {
      const n = p + Math.random() * 7 + 2;
      if (n >= 100) { clearInterval(t); setTimeout(onDone, 500); return 100; }
      return n;
    }), 75);
    return () => clearInterval(t);
  }, [onDone]);

  useEffect(() => {
    if (pct < 30) setMsg('Initialisation…');
    else if (pct < 60) setMsg('Chargement des modules…');
    else if (pct < 90) setMsg('Préparation interface…');
    else setMsg('Lancement ✦');
  }, [pct]);

  const p = Math.min(100, Math.round(pct));
  const lt = isLight; // light theme = dark neon bg (see CSS vars naming)

  return (
    <div className="loader">
      <div className={lt ? 'ldv4-bg-light' : 'ldv4-bg-dark'}/>
      <div className={`ldv4-grid${lt ? ' ldv4-grid--light' : ''}`}/>
      <div className="ldv4-orb"/>
      <div className="ldv4-scan"/>
      <div className="loader-corner loader-corner--tl"/>
      <div className="loader-corner loader-corner--tr"/>
      <div className="loader-corner loader-corner--bl"/>
      <div className="loader-corner loader-corner--br"/>
      <div className="ldv4-inner">
        <div className="ldv4-logo-wrap">
          <AkafolioLogo
            size={typeof window !== 'undefined' ? Math.max(44, Math.min(76, Math.round(window.innerWidth * .13))) : 60}
            dark={!lt}
            animate={true}
          />
        </div>
        <div className={`ldv4-tag${lt ? ' ldv4-tag--light' : ''}`}>
          <span className="ldv4-tag-dot"/>
          aka.dev · abidjan
        </div>
        <div className={`ldv4-num${lt ? ' ldv4-num--light' : ''}`}>
          {p}<span>%</span>
        </div>
        <div className="ldv4-bar-wrap">
          <div className="ldv4-bar-track">
            <div className="ldv4-bar-fill" style={{ width:`${pct}%` }}/>
            <div className="ldv4-bar-tip"  style={{ left:`${Math.min(pct, 99.5)}%` }}/>
          </div>
        </div>
        <div className={`ldv4-msg${lt ? ' ldv4-msg--light' : ''}`}>{msg}</div>
        <div className={`ldv4-sub${lt ? ' ldv4-sub--light' : ''}`}>AKA ELVIS · AKATECH · ABIDJAN</div>
      </div>
    </div>
  );
};

const ThemeToggle = ({dark, onToggle}) => (
  <button className={`theme-toggle ${dark?'theme-toggle--dark':''}`} onClick={onToggle} title={dark?"Passer en mode clair":"Passer en mode sombre"}>
    {dark ? <><i className="fas fa-sun"/><span>Clair</span></> : <><i className="fas fa-moon"/><span>Sombre</span></>}
  </button>
);

const NAV_LINKS = [
  {id:"home",label:"Accueil"},{id:"creations",label:"Vitrine"},{id:"services",label:"Services"},
  {id:"about",label:"À propos"},{id:"experience",label:"Parcours"},
  {id:"projects",label:"Projets"},{id:"skills",label:"Skills"},{id:"contact",label:"Contact"}
];

const Navbar = ({dark, onToggle}) => {
  const [active,setActive]=useState("home");
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const fn=()=>{
      setScrolled(window.scrollY>40);
      document.querySelectorAll('section[id]').forEach(s=>{
        const absTop=s.getBoundingClientRect().top+window.scrollY;
        if(window.scrollY>=absTop-120) setActive(s.id);
      });
    };
    fn();
    window.addEventListener('scroll',fn,{passive:true}); return ()=>window.removeEventListener('scroll',fn);
  },[]);
  const go=id=>{ setOpen(false); document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); };
  return (
    <>
      {open&&<div className="mob-overlay" onClick={()=>setOpen(false)}/>}
      <nav className={`nav ${scrolled?'nav--scrolled':''} ${dark?'nav--dark':''}`}>
        <div className="nav-logo" onClick={()=>go('home')}><AkafolioLogo size={26} dark={dark} animate={false} onClick={()=>go('home')}/></div>
        <div className="nav-links">
          {NAV_LINKS.map(l=>(<button key={l.id} className={`nav-link ${active===l.id?'nav-link--active':''}`} onClick={()=>go(l.id)}>{l.label}</button>))}
          <ThemeToggle dark={dark} onToggle={onToggle}/>
        </div>
        <div className="nav-mob-right">
          <ThemeToggle dark={dark} onToggle={onToggle}/>
          <button className={`nav-hamburger ${open?'nav-hamburger--open':''} ${dark?'nav-hamburger--dark':''}`} onClick={()=>setOpen(o=>!o)} aria-label="Menu" aria-expanded={open}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div className={`mob-drawer ${open?'mob-drawer--open':''} ${dark?'mob-drawer--dark':''}`} aria-hidden={!open}>
        <div className="mob-drawer-header">
          <AkafolioLogo size={22} dark={dark} animate={false}/>
          <button className="mob-drawer-close" onClick={()=>setOpen(false)} aria-label="Fermer le menu"><i className="fas fa-times"/></button>
        </div>
        <nav className="mob-drawer-nav">
          {NAV_LINKS.map((l,i)=>(
            <button key={l.id} className={`mob-drawer-link ${active===l.id?'mob-drawer-link--active':''} ${open?'mob-drawer-link--in':''}`}
              style={{animationDelay:`${i*0.055}s`}} onClick={()=>go(l.id)}>
              <span className="mob-drawer-num">0{i+1}</span><span>{l.label}</span><SvgArrowRight size={14}/>
            </button>
          ))}
        </nav>
        <div className="mob-drawer-theme">
          <span className="mob-drawer-theme-label">
            <i className={`fas fa-${dark?'moon':'sun'}`}/> Thème {dark?'sombre':'clair'}
          </span>
          <ThemeToggle dark={dark} onToggle={onToggle}/>
        </div>
        <div className="mob-drawer-footer">
          <a href="https://github.com/wthomasss06-stack" target="_blank" rel="noreferrer"><i className="fab fa-github"/></a>
          <a href="https://www.linkedin.com/in/m-bollo-aka-60a1b1340/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"/></a>
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer"><i className="fab fa-facebook"/></a>
          <a href="https://akatech.vercel.app/" target="_blank" rel="noreferrer" title="AKATech"><i className="fas fa-globe"/></a>
          <a href="mailto:wthomasss06@gmail.com"><i className="fas fa-envelope"/></a>
        </div>
      </div>
    </>
  );
};

const RocketFlames = () => (
  <svg className="rocket-big-flames" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 100" style={{position:'absolute',bottom:'-70px',left:'50%',transform:'translateX(-50%)',width:'40px',height:'80px',pointerEvents:'none',zIndex:9999}}>
    <ellipse cx="20" cy="10" rx="7" ry="14" fill="#FF5500" opacity="0.95">
      <animate attributeName="ry" values="14;20;11;18;14" dur=".18s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".95;1;.85;1;.95" dur=".22s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="20" cy="22" rx="5" ry="16" fill="#FF8C00" opacity="0.8">
      <animate attributeName="ry" values="16;22;12;20;16" dur=".22s" repeatCount="indefinite"/>
      <animate attributeName="cx"  values="20;19;21;20;20" dur=".15s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="20" cy="38" rx="3" ry="12" fill="#FFD600" opacity="0.6">
      <animate attributeName="ry" values="12;18;8;16;12" dur=".25s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".6;.9;.4;.8;.6" dur=".2s" repeatCount="indefinite"/>
    </ellipse>
    <circle cx="12" cy="18" r="2.5" fill="#FF5500" opacity="0.5">
      <animate attributeName="cy" values="18;30;18" dur=".3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".5;0;.5" dur=".3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="28" cy="20" r="2" fill="#FF8C00" opacity="0.5">
      <animate attributeName="cy" values="20;34;20" dur=".35s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".5;0;.5" dur=".35s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

const ScrollTop = ({dark}) => {
  const [vis,setVis]=useState(false); const [launching,setLaunch]=useState(false);
  const btnRef=useRef(null); const audioCtx=useRef(null); const engineRef=useRef(null);
  useEffect(()=>{
    const fn=()=>{ const footer=document.querySelector('footer'); if(footer) setVis(footer.getBoundingClientRect().top<window.innerHeight); };
    window.addEventListener('scroll',fn); return ()=>window.removeEventListener('scroll',fn);
  },[]);
  const getCtx=()=>{ if(!audioCtx.current||audioCtx.current.state==='closed') audioCtx.current=new(window.AudioContext||window.webkitAudioContext)(); if(audioCtx.current.state==='suspended') audioCtx.current.resume(); return audioCtx.current; };
  const makeNoise=(ctx,loop=true)=>{ const sz=ctx.sampleRate*2,buf=ctx.createBuffer(1,sz,ctx.sampleRate),d=buf.getChannelData(0); for(let i=0;i<sz;i++) d[i]=Math.random()*2-1; const src=ctx.createBufferSource(); src.buffer=buf; src.loop=loop; return src; };
  const startEngine=()=>{
    if(engineRef.current) return;
    try{
      const ctx=getCtx(),now=ctx.currentTime,master=ctx.createGain();
      master.gain.setValueAtTime(0,now); master.gain.linearRampToValueAtTime(1,now+0.25); master.connect(ctx.destination);
      const ng=makeNoise(ctx),fg=ctx.createBiquadFilter(); fg.type='lowpass'; fg.frequency.value=140; fg.Q.value=0.9;
      const gg=ctx.createGain(); gg.gain.value=0.55; ng.connect(fg); fg.connect(gg); gg.connect(master); ng.start();
      const nj=makeNoise(ctx),fj=ctx.createBiquadFilter(); fj.type='bandpass'; fj.frequency.value=480; fj.Q.value=0.7;
      const gj=ctx.createGain(); gj.gain.value=0.40; nj.connect(fj); fj.connect(gj); gj.connect(master); nj.start();
      const nh=makeNoise(ctx),fh=ctx.createBiquadFilter(); fh.type='highpass'; fh.frequency.value=1800;
      const gh=ctx.createGain(); gh.gain.value=0.18; nh.connect(fh); fh.connect(gh); gh.connect(master); nh.start();
      const osc=ctx.createOscillator(); osc.type='sawtooth'; osc.frequency.value=48;
      const lfo=ctx.createOscillator(); lfo.type='sine'; lfo.frequency.value=3.5;
      const lg=ctx.createGain(); lg.gain.value=7; lfo.connect(lg); lg.connect(osc.frequency); lfo.start();
      const ws=ctx.createWaveShaper(),cv2=new Float32Array(512);
      for(let i=0;i<512;i++){const x=(i*2)/512-1; cv2[i]=(3+200)*x/(Math.PI+200*Math.abs(x));} ws.curve=cv2; ws.oversample='4x';
      const og=ctx.createGain(); og.gain.value=0.32; osc.connect(ws); ws.connect(og); og.connect(master); osc.start();
      const sub=ctx.createOscillator(); sub.type='sine'; sub.frequency.value=28;
      const sg=ctx.createGain(); sg.gain.value=0.38; sub.connect(sg); sg.connect(master); sub.start();
      engineRef.current={master,nodes:[ng,nj,nh,osc,lfo,sub]};
    }catch(e){}
  };
  const stopEngine=()=>{
    if(!engineRef.current) return;
    try{
      const ctx=getCtx(),now=ctx.currentTime,{master,nodes}=engineRef.current;
      master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(master.gain.value,now);
      master.gain.linearRampToValueAtTime(0,now+0.3);
      setTimeout(()=>{nodes.forEach(n=>{try{n.stop();}catch(_){}});engineRef.current=null;},350);
    }catch(e){engineRef.current=null;}
  };
  const playLaunch=()=>{
    stopEngine();
    try{
      const ctx=getCtx(),now=ctx.currentTime;
      const boom=ctx.createOscillator(); boom.type='sine'; boom.frequency.setValueAtTime(120,now); boom.frequency.exponentialRampToValueAtTime(22,now+0.18);
      const bg=ctx.createGain(); bg.gain.setValueAtTime(0.7,now); bg.gain.exponentialRampToValueAtTime(0.001,now+0.22);
      boom.connect(bg); bg.connect(ctx.destination); boom.start(now); boom.stop(now+0.25);
      const sz=Math.floor(ctx.sampleRate*2.2),nb=ctx.createBuffer(1,sz,ctx.sampleRate),nd=nb.getChannelData(0);
      for(let i=0;i<sz;i++) nd[i]=Math.random()*2-1;
      const ns=ctx.createBufferSource(); ns.buffer=nb;
      const wf=ctx.createBiquadFilter(); wf.type='bandpass'; wf.frequency.setValueAtTime(100,now); wf.frequency.exponentialRampToValueAtTime(4000,now+1.8); wf.Q.value=1.0;
      const wg=ctx.createGain(); wg.gain.setValueAtTime(0,now); wg.gain.linearRampToValueAtTime(0.65,now+0.06); wg.gain.setValueAtTime(0.65,now+0.5); wg.gain.exponentialRampToValueAtTime(0.001,now+2.2);
      ns.connect(wf); wf.connect(wg); wg.connect(ctx.destination); ns.start(now); ns.stop(now+2.2);
      const ru=ctx.createOscillator(); ru.type='sawtooth'; ru.frequency.setValueAtTime(60,now); ru.frequency.linearRampToValueAtTime(42,now+1.5);
      const rg=ctx.createGain(); rg.gain.setValueAtTime(0,now); rg.gain.linearRampToValueAtTime(0.35,now+0.08); rg.gain.setValueAtTime(0.35,now+0.6); rg.gain.exponentialRampToValueAtTime(0.001,now+1.6);
      const rw=ctx.createWaveShaper(),rc=new Float32Array(256);
      for(let i=0;i<256;i++){const x=(i*2)/256-1; rc[i]=(Math.PI+180)*x/(Math.PI+180*Math.abs(x));} rw.curve=rc;
      ru.connect(rw); rw.connect(rg); rg.connect(ctx.destination); ru.start(now); ru.stop(now+1.6);
    }catch(e){}
  };
  const go=()=>{
    playLaunch(); setLaunch(true);
    if(btnRef.current){ for(let i=0;i<8;i++){ const p=document.createElement('div'); p.className='rocket-fire-particle'; p.style.setProperty('--xo',`${(Math.random()-0.5)*30}px`); p.style.animationDelay=`${i*0.1}s`; btnRef.current.appendChild(p); setTimeout(()=>p.remove(),1000); } }
    setTimeout(()=>{ window.scrollTo({top:0,behavior:'smooth'}); setTimeout(()=>setLaunch(false),800); },300);
  };
  return (
    <button ref={btnRef} className={`scroll-top ${vis?'scroll-top--vis':''} ${launching?'scroll-top--launch':''} ${dark?'scroll-top--dark':''}`}
      onClick={go} onMouseEnter={startEngine} onMouseLeave={stopEngine} title="Décollage vers le haut !">
      <i className="fas fa-rocket"/><div className="rocket-flame"/>{launching && <RocketFlames/>}
    </button>
  );
};

/* ══════════════════════════════════════════════
   PLASMA CANVAS BG — version légère pour bandeaux
   Même shader plasma, optimisé pour petits conteneurs
   ══════════════════════════════════════════════ */
const PlasmaCanvasBg = ({ intensity = 1.0 }) => {
  const cvRef  = useRef(null);
  const rafRef = useRef(null);
  const glRef  = useRef(null);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
    if (!gl) { glRef.current = null; return; }
    glRef.current = gl;

    const resize = () => {
      const p = cv.parentElement;
      cv.width  = Math.round((p ? p.offsetWidth  : cv.offsetWidth)  * 0.5);
      cv.height = Math.round((p ? p.offsetHeight : cv.offsetHeight) * 0.5);
      if (cv.width  < 1) cv.width  = 320;
      if (cv.height < 1) cv.height = 120;
      gl.viewport(0, 0, cv.width, cv.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv.parentElement || cv);

    const vert = `attribute vec2 a; void main(){gl_Position=vec4(a,0.,1.);}`;
    const frag = `
      precision mediump float;
      uniform vec2  u_res;
      uniform float u_time;
      #define TAU 6.28318530
      void main(){
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 p  = uv * 2.0 - 1.0; p.x *= u_res.x / u_res.y;
        float t = u_time * 0.55;
        float v = 0.0;
        v += sin(p.x * 5.0 + t);
        v += sin(p.y * 4.5 + t * 0.85);
        v += sin((p.x + p.y) * 3.5 + t * 0.7);
        float cx = p.x + 0.5 * sin(t * 0.38);
        float cy = p.y + 0.5 * cos(t * 0.30);
        v += sin(sqrt(90.0*(cx*cx+cy*cy)+1.0)+t);
        v += sin((p.x-p.y)*2.8+t*0.6)*0.5;
        v = v*0.5+0.5;
        vec3 a2 = vec3(0.04,  0.02,  0.01);
        vec3 b2 = vec3(0.18,  0.07,  0.01);
        vec3 c2 = vec3(1.0,   0.333, 0.0);
        vec3 d2 = vec3(1.0,   0.549, 0.0);
        vec3 e2 = vec3(1.0,   0.85,  0.55);
        vec3 col;
        if      (v < 0.22) col = mix(a2, b2, v/0.22);
        else if (v < 0.52) col = mix(b2, c2, (v-0.22)/0.30);
        else if (v < 0.78) col = mix(c2, d2, (v-0.52)/0.26);
        else               col = mix(d2, e2, (v-0.78)/0.22);
        col *= (0.75 + 0.25*sin(t*0.45));
        float vig = 1.0 - smoothstep(0.3, 1.2, length(uv-0.5)*1.8);
        col *= vig * 0.9 + 0.1;
        float grain = fract(sin(dot(gl_FragCoord.xy,vec2(127.1,311.7))+u_time*80.)*43758.5)*0.022-0.011;
        gl_FragColor = vec4(clamp(col+grain,0.,1.),1.0);
      }
    `;

    const comp = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, comp(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, comp(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');

    const render = ts => {
      if (!glRef.current) return;
      rafRef.current = requestAnimationFrame(render);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, ts * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      glRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={cvRef}
      className="plasma-bg-canvas"
      aria-hidden
      style={{ position:'absolute', inset:0, width:'100%', height:'100%',
               pointerEvents:'none', zIndex:0, opacity: intensity,
               imageRendering:'pixelated', display:'block' }}
    />
  );
};

/* ══════════════════════════════════════════════
   PLASMA CANVAS — WebGL background hero
   Shader plasma AKAfolio : noir profond → orange #FF5500 → ambre
   ══════════════════════════════════════════════ */
const AuroraCanvas = ({ dark }) => {
  const cvRef   = useRef(null);
  const rafRef  = useRef(null);
  const glRef   = useRef(null);
  const uRef    = useRef({});
  const darkRef = useRef(dark);
  const mouseRef= useRef({ x: 0, y: 0 });
  const lastTs  = useRef(0);
  const INTERVAL= 1000 / 60;

  useEffect(() => { darkRef.current = dark; }, [dark]);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
    if (!gl) return;
    glRef.current = gl;

    const SCALE = 0.75;
    const resize = () => {
      const parent = cv.parentElement;
      const w = parent ? parent.getBoundingClientRect().width  : cv.offsetWidth;
      const h = parent ? parent.getBoundingClientRect().height : (cv.offsetHeight || window.innerHeight);
      cv.width  = Math.round(w * SCALE);
      cv.height = Math.round(h * SCALE);
      if (cv.width < 1)  cv.width  = Math.round(window.innerWidth  * SCALE);
      if (cv.height < 1) cv.height = Math.round(window.innerHeight * SCALE);
      gl.viewport(0, 0, cv.width, cv.height);
    };
    resize();
    const resizeDeferred = setTimeout(resize, 150);
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    const vert = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.,1.);}`;

    /* ── Plasma shader — palette AKAfolio : noir #0A0A0A → orange #FF5500 → ambre #FF8C00 ── */
    const frag = `
      precision highp float;
      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_mouse;
      uniform float u_light;
      #define TAU 6.28318530

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 p  = uv * 2.0 - 1.0; p.x *= u_res.x / u_res.y;
        vec2 m  = (u_mouse / u_res) * 2.0 - 1.0; m.x *= u_res.x / u_res.y;
        float t = u_time * 0.5;

        /* layered plasma sines */
        float v = 0.0;
        v += sin(p.x * 5.0 + t);
        v += sin(p.y * 4.5 + t * 0.85);
        v += sin((p.x + p.y) * 3.5 + t * 0.7);
        float cx = p.x + 0.55 * sin(t * 0.38) + m.x * 0.28;
        float cy = p.y + 0.55 * cos(t * 0.30) + m.y * 0.28;
        v += sin(sqrt(90.0 * (cx*cx + cy*cy) + 1.0) + t);
        /* extra diagonal wave for richness */
        v += sin((p.x - p.y) * 2.8 + t * 0.6) * 0.5;
        v = v * 0.5 + 0.5; /* normalise 0..1 */

        /* AKAfolio palette :
           a = noir profond   #0A0A0A  (0.04, 0.04, 0.04)
           b = gris chaud     #1C1008  (0.11, 0.063, 0.031)
           c = orange vif     #FF5500  (1.0,  0.333, 0.0)
           d = ambre brillant #FF8C00  (1.0,  0.549, 0.0)
           e = blanc chaud    #FFF0D8  (1.0,  0.94,  0.847) */
        vec3 a = vec3(0.04,  0.04,  0.04);
        vec3 b = vec3(0.11,  0.063, 0.031);
        vec3 c = vec3(1.0,   0.333, 0.0);
        vec3 d = vec3(1.0,   0.549, 0.0);
        vec3 e = vec3(1.0,   0.94,  0.847);

        vec3 col;
        if      (v < 0.25) col = mix(a, b, v * 4.0);
        else if (v < 0.55) col = mix(b, c, (v - 0.25) / 0.30);
        else if (v < 0.80) col = mix(c, d, (v - 0.55) / 0.25);
        else               col = mix(d, e, (v - 0.80) / 0.20);

        /* pulsing brightness */
        col *= 0.78 + 0.22 * sin(t * 0.45);

        /* vignette douce */
        float vig = 1.0 - smoothstep(0.45, 1.35, length(uv - 0.5) * 1.9);
        col *= vig;

        /* bottom darkness — conserve le noir en bas */
        col *= mix(0.08, 1.0, smoothstep(0.0, 0.38, uv.y));

        /* mouse orange glow */
        float mdist = length(p - m);
        col += vec3(1.0, 0.333, 0.0) * exp(-mdist * 2.8) * 0.22;

        /* mode clair : légèrement plus clair */
        col = mix(col, col * 1.18 + vec3(0.02, 0.01, 0.0), u_light * 0.35);

        /* grain subtil */
        float grain = fract(sin(dot(gl_FragCoord.xy, vec2(127.1, 311.7)) + u_time * 80.0) * 43758.5) * 0.025 - 0.0125;
        col += grain;

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    `;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uRef.current = {
      res:   gl.getUniformLocation(prog, 'u_res'),
      time:  gl.getUniformLocation(prog, 'u_time'),
      mouse: gl.getUniformLocation(prog, 'u_mouse'),
      light: gl.getUniformLocation(prog, 'u_light'),
    };

    const onMouse = e => { mouseRef.current = { x: e.clientX, y: cv.height - e.clientY }; };
    const onTouch = e => {
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX, y: cv.height - t.clientY };
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });

    const render = ts => {
      if (!glRef.current) return;
      rafRef.current = requestAnimationFrame(render);
      if (ts - lastTs.current < INTERVAL) return;
      lastTs.current = ts;
      const u = uRef.current;
      gl.uniform2f(u.res, cv.width, cv.height);
      gl.uniform1f(u.time, ts * 0.001);
      gl.uniform2f(u.mouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(u.light, darkRef.current ? 0.0 : 1.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeDeferred);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      glRef.current = null;
    };
  }, []);

  return <canvas ref={cvRef} className="aurora-canvas" aria-hidden />;
};

const Hero = ({ dark }) => {
  const phrases = ["Full-Stack","React & Python","Django & Flask","orienté produit","orienté Data & Carto"];
  const [wi,setWi]=useState(0); const [typed,setTyped]=useState(''); const [del,setDel]=useState(false); const [ch,setCh]=useState(0); const [now,setNow]=useState(new Date());

  const heroRef    = useRef(null);
  const [photoColorRef, heroPhotoColor] = usePhotoColor();
  const bgRef      = useRef(null);   // aurora bg layer — zooms on scroll
  const sceneRef   = useRef(null);   // grid wrapper — rotates on mouse
  const fadeRef    = useRef(null);   // inner grid — fades+blurs on scroll
  const leftRef    = useRef(null);
  const rightRef   = useRef(null);
  const cardARef   = useRef(null);
  const cardBRef   = useRef(null);
  const raysRef    = useRef(null);
  const cursorRef  = useRef(null);
  const dustRef    = useRef(null);
  const rafRef     = useRef(null);
  const mTarget    = useRef({ x:0, y:0 });
  const mCurrent   = useRef({ x:typeof window!=='undefined'?window.innerWidth/2:0, y:typeof window!=='undefined'?window.innerHeight/2:0 });

  /* ── lerp mouse loop ── */
  useEffect(() => {
    const onMove = e => { mTarget.current.x=e.clientX; mTarget.current.y=e.clientY; };
    window.addEventListener('mousemove', onMove);
    const loop = () => {
      mCurrent.current.x += (mTarget.current.x - mCurrent.current.x) * 0.07;
      mCurrent.current.y += (mTarget.current.y - mCurrent.current.y) * 0.07;
      const mx=mCurrent.current.x, my=mCurrent.current.y;
      const W=window.innerWidth, H=window.innerHeight;
      /* light cursor */
      if(cursorRef.current){ cursorRef.current.style.left=`${mx}px`; cursorRef.current.style.top=`${my}px`; }
      /* god rays follow cursor */
      const gx=50-(mx/W-0.5)*28, gy=50-(my/H-0.5)*20;
      if(raysRef.current) raysRef.current.style.background=`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,85,0,0.15) 0%, transparent 55%)`;
      /* scene rotation (like hhjjj layer-mid) */
      if(sceneRef.current){
        const rx=(my/H-0.5)*10, ry=(mx/W-0.5)*-10;
        sceneRef.current.style.transform=`perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      /* depth offsets per layer */
      const dx=(W/2-mx)/(W/2), dy=(H/2-my)/(H/2);
      if(bgRef.current)    bgRef.current.style.transform   =`translate3d(${dx*-8}px,${dy*-6}px,0) scale(1.04)`;
      if(leftRef.current)  leftRef.current.style.transform  =`translate3d(${dx*12}px,${dy*8}px,0)`;
      if(rightRef.current) rightRef.current.style.transform =`translate3d(${dx*-20}px,${dy*-14}px,0) rotateY(${dx*-2}deg) rotateX(${dy*1.5}deg)`;
      if(cardARef.current) cardARef.current.style.transform =`translate3d(${dx*28}px,${dy*20}px,0)`;
      if(cardBRef.current) cardBRef.current.style.transform =`translate3d(${dx*-34}px,${dy*-24}px,0)`;
      rafRef.current=requestAnimationFrame(loop);
    };
    rafRef.current=requestAnimationFrame(loop);
    return()=>{ window.removeEventListener('mousemove',onMove); cancelAnimationFrame(rafRef.current); };
  },[]);

  /* ── dust canvas ── */
  useEffect(()=>{
    const cv=dustRef.current; if(!cv) return;
    const ctx=cv.getContext('2d'); let id;
    const resize=()=>{ cv.width=cv.parentElement?.offsetWidth||window.innerWidth; cv.height=cv.parentElement?.offsetHeight||window.innerHeight; };
    resize(); window.addEventListener('resize',resize);
    const pts=Array.from({length:90},()=>({ x:Math.random()*cv.width, y:Math.random()*cv.height, r:Math.random()*1.5+0.2, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35, op:Math.random()*.4+.05 }));
    const tick=()=>{ ctx.clearRect(0,0,cv.width,cv.height); pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=cv.width; if(p.x>cv.width)p.x=0; if(p.y<0)p.y=cv.height; if(p.y>cv.height)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${p.op})`; ctx.fill(); }); id=requestAnimationFrame(tick); };
    tick();
    return()=>{ cancelAnimationFrame(id); window.removeEventListener('resize',resize); };
  },[]);

  /* ── scroll: zoom bg + fade+blur text (starts at 50% vh) ── */
  useEffect(()=>{
    const onScroll=()=>{
      const s=window.pageYOffset, vh=window.innerHeight;
      /* bg zoom like hhjjj layer-bg */
      if(bgRef.current) bgRef.current.style.transform=`scale(${1+s/4000}) translate3d(0,${s*0.3}px,0)`;
      /* text fade only after 50% scroll */
      const start=vh*0.5, end=vh*1.0;
      const p=Math.min(1,Math.max(0,(s-start)/(end-start)));
      if(fadeRef.current){
        fadeRef.current.style.opacity=`${1-p}`;
        fadeRef.current.style.filter=`blur(${p*10}px)`;
        fadeRef.current.style.transform=`translateY(${s*0.1}px)`;
      }
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);

  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(t); },[]);
  const hour=now.getHours(), isDaytime=hour>=6&&hour<18;
  const DAYS=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'], MONTHS=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  const pad=n=>String(n).padStart(2,'0');
  const dateStr=`${DAYS[now.getDay()]} ${pad(now.getDate())} ${MONTHS[now.getMonth()]}`;
  const timeStr=`${pad(hour)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  useEffect(()=>{
    const w=phrases[wi];
    const t=setTimeout(()=>{ if(!del&&ch<w.length){setTyped(w.slice(0,ch+1));setCh(c=>c+1);} else if(!del&&ch===w.length){setTimeout(()=>setDel(true),1800);} else if(del&&ch>0){setTyped(w.slice(0,ch-1));setCh(c=>c-1);} else if(del&&ch===0){setDel(false);setWi(i=>(i+1)%phrases.length);} },del?45:90);
    return()=>clearTimeout(t);
  },[ch,del,wi]);

  return (
    <section id="home" ref={el => { heroRef.current = el; photoColorRef.current = el; }} className={`hero hv4 hv4-cinematic ${dark?'hero--dark':''}`}>

      {/* ── film grain ── */}
      <div className="hv4-grain" aria-hidden/>

      

      {/* ── god rays ── */}
      <div className="hv4-god-rays" ref={raysRef} aria-hidden/>

      {/* ── aurora bg layer (zoom on scroll, parallax on mouse) ── */}
      <div className="hv4-bg-layer" ref={bgRef} aria-hidden>
        <AuroraCanvas dark={dark}/>
      </div>

      {/* ── scan line ── */}
      <div className="hv4-scan" aria-hidden/>

      

      {/* ── scene wrapper: handles perspective rotation ── */}
      <div className="hv4-scene-wrap" ref={sceneRef}>

        {/* ── fade wrapper: handles scroll fade/blur/translateY ── */}
        <div className="hero-content hv4-grid" ref={fadeRef}>

          {/* ════ LEFT ════ */}
          <div className="hv4-left" ref={leftRef}>
            <div className="hv4-badge" style={{'--d':'0s'}}>
              <span className="hero-dot"/>
              <span className="hv4-badge-status">disponible · Abidjan, CI</span>
              <span className="hv4-badge-sep" aria-hidden>|</span>
              <span className="hv4-clock-wrap">
                <span className="hv4-clock-icon">{isDaytime?'☀':'🌙'}</span>
                <span className="hv4-clock-date">{dateStr}</span>
                <span className="hv4-clock-dot" aria-hidden>·</span>
                <span className="hv4-clock-time">{timeStr}</span>
                <span className="hv4-clock-tz">UTC+0</span>
              </span>
            </div>

            <h1 className="hv4-name" aria-label="M'Bollo Aka Elvis">
              <span className="hv4-name-line" style={{'--d':'0.12s'}}>M'BOLLO</span>
              <span className="hv4-name-line hv4-name-line--u" style={{'--d':'0.26s'}}>AKA ELVIS</span>
            </h1>

            <div className="hv4-photo-mob hv4-rv" style={{'--d':'0.3s'}}>
              <div className="hv4-photo-mob-inner">
                <img src="/assets/images/IMG_20250124_124101KK.jpg" alt="M'Bollo Aka Elvis" className={`hv4-photo photo-bw ${heroPhotoColor?'photo-bw--on':''}`}/>
                <div className="hv4-photo-mob-badge"><span className="hero-dot"/><span>disponible</span></div>
              </div>
            </div>

            <p className="hv4-typed hv4-rv" style={{'--d':'0.42s'}}>
              Développeur&nbsp;<span className="hero-word">{typed}</span><span className="cursor">|</span>
            </p>

            <p className="hv4-desc hv4-rv" style={{'--d':'0.56s'}}>
              Développeur web orienté produits, spécialisé Django &amp; React.<br/>
              Je construis des applications pensées pour des usages réels.
            </p>

            <div className="hv4-ctas hv4-rv" style={{'--d':'0.7s'}}>
              <MagBtn className={`btn ${dark?'btn--neon':'btn--primary'} mi-btn-grad-solid`}
                onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}>
                Voir mes projets <span>↗</span>
              </MagBtn>
              <a className={`btn ${dark?'btn--ghost-neon':'btn--ghost'} mi-glint`}
                href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" download>
                <i className="fas fa-download"/> Télécharger CV
              </a>
            </div>

            <div className="hv4-stats hv4-rv" style={{'--d':'0.85s'}}>
              {[['14','Projets'],['3+','Années exp.'],['9','En prod.'],['33','Outils']].map(([n,l])=>(
                <div key={l} className="hv4-stat">
                  <span className="hv4-stat-n">{n}</span>
                  <span className="hv4-stat-l">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ════ RIGHT ════ */}
          <div className="hv4-right hv4-rv" style={{'--d':'0.32s'}} ref={rightRef}>
            <div className="hv4-photo-wrap hv4-photo-wrap--full">
              <img src="/assets/images/IMG_20250124_124101KK.jpg" alt="M'Bollo Aka Elvis" className={`hv4-photo hv4-photo--portrait photo-bw ${heroPhotoColor?'photo-bw--on':''}`}/>
              <div className="hv4-photo-overlay">
                <span><i className="fas fa-map-marker-alt"/> Abidjan, CI</span>
                <span><i className="fas fa-code"/> Full-Stack Dev</span>
              </div>
              <div className="hv4-photo-status">
                <span className="hero-dot"/>
                <span>Open to work · Freelance &amp; CDI</span>
              </div>
            </div>
          </div>

        </div>{/* /hv4-grid */}
      </div>{/* /hv4-scene-wrap */}

      <div className="hero-scroll"><span>scroll</span><div className="hsl"/></div>

    </section>
  );
};
const Marquee = ({dark}) => {
  const words=["React","Django","Flask","Python","TypeScript","Tailwind","MySQL","Vercel","Node.js","Git","REST API","Bootstrap","JavaScript"];
  const d=[...words,...words];
  return (<div className={`marquee ${dark?'marquee--dark':''}`}><div className="marquee-track">{d.map((w,i)=><span key={i} className="mw">{w}<span className="mdot">◆</span></span>)}</div></div>);
};

const FeaturedCreation = ({dark}) => {
  const [ref,vis]=useInView(0.08);
  const proj=PROJECTS.find(p=>p.id===1);
  return (
    <section id="creations" ref={ref} className={`creations-section ${vis?'creations-section--vis':''} ${dark?'section--dark':''}`}>
      <WindowChrome title="Vitrine" dark={dark}/>
      <div className={`s-hd ${dark?'s-hd--dark':''}`}><h2 className="s-ttl">Dernière<br/>création.</h2></div>
      <div className="cr-showcase">
        <div className="cr-mockups">
          <div className="cr-desktop-wrap">
            <div className="cr-desktop-shell">
              <div className="cr-desktop-bar">
                <span className="cr-dot cr-dot--r"/><span className="cr-dot cr-dot--y"/><span className="cr-dot cr-dot--g"/>
                <span className="cr-bar-url">shop-ci.vercel.app</span>
              </div>
              <div className="cr-desktop-screen">
                <img src={proj.image} alt="ShopCI desktop" className="cr-screen-img" onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}}/>
                <div className="cr-screen-ph" style={{display:'none'}}><i className="fas fa-desktop"/></div>
              </div>
            </div>
          </div>
          <div className="cr-mobile-wrap">
            <div className="cr-mobile-shell">
              <div className="cr-mobile-notch"/>
              <div className="cr-mobile-screen">
                <img src="/assets/images/projects/shopci-responsive.jpg" alt="ShopCI mobile" className="cr-screen-img" onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}}/>
                <div className="cr-screen-ph cr-screen-ph--sm" style={{display:'none'}}><i className="fas fa-mobile-alt"/></div>
              </div>
              <div className="cr-mobile-home"/>
            </div>
            <div className="cr-resp-badge"><i className="fas fa-check-circle"/> 100% Responsive</div>
          </div>
          <div className="cr-glow"/>
        </div>
        <div className="cr-info">
          <div><h3 className="cr-title">ShopCI</h3><p className="cr-sub">Marketplace E-commerce</p></div>
          <div className="cr-meta-block">
            <div className="cr-meta-row"><span className="cr-ml">Type</span><span className="cr-mv">Application Web</span></div>
            <div className="cr-meta-row"><span className="cr-ml">Mon rôle</span><span className="cr-mv">Conception et développement</span></div>
          </div>
          <div className="cr-tags">{proj.tech.map(t=><span key={t} className="cr-tag">{t}</span>)}</div>
          <p className="cr-desc">{proj.description}</p>
          <a href={proj.url} target="_blank" rel="noreferrer" className={`btn ${dark?'btn--neon':'btn--primary'} cr-cta mi-glint`}><i className="fas fa-external-link-alt"/> Voir le site</a>
        </div>
      </div>
    </section>
  );
};

const LUCIDE_TAB_ICONS = { Globe: SvgGlobe, ShoppingCart: SvgShoppingCart, Cpu: SvgCpu, Star: SvgStar };
const TAB_SUBTITLES = { vitrine:"Pour présenter votre activité avec élégance.", ecommerce:"Pour vendre en ligne et gérer vos commandes.", saas:"Pour des applications web complètes sur-mesure.", portfolio:"Pour mettre en valeur vos réalisations." };

const PricingTabs = ({dark}) => {
  const [activeTab,setActiveTab]=useState(0); const [animKey,setAnimKey]=useState(0);
  const pillRef=useRef(null); const btnRefs=useRef([]); const tab=PRICING_TABS[activeTab];
  useEffect(()=>{
    const pill=pillRef.current,btn=btnRefs.current[activeTab];
    if(!pill||!btn) return;
    const parent=btn.parentElement.getBoundingClientRect(),r=btn.getBoundingClientRect();
    pill.style.width=`${r.width}px`; pill.style.height=`${r.height}px`; pill.style.transform=`translateX(${r.left-parent.left}px)`;
  },[activeTab]);
  const switchTab=(i)=>{ setActiveTab(i); setAnimKey(k=>k+1); };
  const strikePrice=(s)=>{
    const n=parseInt(s.replace(/\s/g,'').replace('FCFA',''));
    return isNaN(n)?s:Math.round(n*1.25).toLocaleString('fr-FR')+' FCFA';
  };
  const PricingCard=({p,idx=0,tilt=false})=>{
    const inner=(
      <div className={`pc3-card ${p.isPopular?'pc3-card--pop':''} ${dark?'pc3-card--dark':''}`}>
        {p.isPopular&&<div className={`pc3-pop-label ${dark?'pc3-pop-label--dark':''}`}><SvgStar size={11} strokeWidth={2.5}/> PLUS POPULAIRE</div>}
        <div className="pc3-top">
          <span className="pc3-num">0{idx+1}</span>
          <span className="pc3-promo-badge"><SvgStar size={10} strokeWidth={2.5}/> −25%</span>
        </div>
        <div className="pc3-plan">{p.badge}</div>
        <p className="pc3-tagline">{TAB_SUBTITLES[tab.key]||''}</p>
        <div className="pc3-prices">
          <span className="pc3-original">{strikePrice(p.price)}</span>
          <div className="pc3-discounted">
            <span className="pc3-amount">{p.price.replace(' FCFA','')}</span>
            <span className="pc3-currency"> FCFA</span>
          </div>
        </div>
        <p className="pc3-delivery"><i className="fas fa-clock"/> {p.delivery}</p>
        <div className="pc3-sep"/>
        <ul className="pc3-feat">{p.features.map((f,fi)=>(
          <li key={fi}><span className={`pc3-check ${dark?'pc3-check--dark':''}`}><SvgCheck size={11} strokeWidth={3}/></span>{f}</li>
        ))}</ul>
        <div className="pc3-ctas">
          <a href="https://akatech.vercel.app/" target="_blank" rel="noreferrer"
            className={`btn ${dark?'btn--ghost-neon':'btn--ghost'} btn--full mi-glint pc3-cta`}>
            <SvgGlobe size={14}/> Détails
          </a>
          <MagBtn className={`btn ${dark?'btn--neon':'btn--primary'} btn--full mi-glint pc3-cta`}
            onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
            Me contacter <SvgArrowRight size={14}/>
          </MagBtn>
        </div>
      </div>
    );
    return tilt?<TiltCard intensity={8} perspective={1000} style={{height:'100%'}}>{inner}</TiltCard>:inner;
  };
  return (
    <div className={`ptabs2 ${dark?'ptabs2--dark':''}`}>
      <div className={`ptabs2-toggle-wrap ${dark?'ptabs2-toggle-wrap--dark':''}`}>
        <div className={`ptabs2-toggle ${dark?'ptabs2-toggle--dark':''}`}>
          <span ref={pillRef} className={`ptabs2-pill ${dark?'ptabs2-pill--dark':''}`}/>
          {PRICING_TABS.map((t,i)=>{const Icon=LUCIDE_TAB_ICONS[t.icon];return(<button key={t.key} ref={el=>btnRefs.current[i]=el} className={`ptabs2-tab ${i===activeTab?'ptabs2-tab--active':''} ${dark?'ptabs2-tab--dark':''}`} onClick={()=>switchTab(i)}>{Icon&&<Icon size={14} strokeWidth={2}/>}<span>{t.label}</span></button>);})}
        </div>
      </div>
      <div key={animKey} className="pc3-grid ptabs2-desk">{tab.plans.map((p,i)=><PricingCard key={i} p={p} idx={i} tilt={true}/>)}</div>
      <div className="ptabs2-mob">
        <StackedCard items={tab.plans} renderCard={(p,idx)=><PricingCard p={p} idx={idx} tilt={true}/>}/>
      </div>
      <p className={`ptabs-note ${dark?'ptabs-note--dark':''}`}><i className="fas fa-info-circle"/> Chaque projet étant unique, les tarifs peuvent varier selon les fonctionnalités demandées.</p>
    </div>
  );
};

const Services = ({dark}) => {
  const [ref,vis]=useInView();
  return (
    <section id="services" ref={ref} className={dark?'section--dark':''}>
      <WindowChrome title="Services & Tarifs" dark={dark}/>
      <div className={`s-hd ${dark?'s-hd--dark':''}`}><h2 className="s-ttl">Ce que je<br/>fais bien.</h2></div>
      <div className={`svc-grid ${vis?'anim':''} svc-desk mi-stagger ${vis?'mi-stagger--vis':''}`}>
        {SERVICES.map((s,i)=>(
          <TiltCard key={i} className="svc-card" style={{animationDelay:`${i*0.08}s`}}>
            <SpotlightCard className="svc-spotlight-inner" style={{height:'100%',width:'100%'}}>
              <div className="svc-top"><span className="svc-n">{s.n}</span><div className="svc-ico mi-pulse"><i className={`fas fa-${s.icon}`}/></div></div>
              <h3 className="svc-title">{s.title}</h3><p className="svc-desc">{s.desc}</p>
              <ul className="svc-feat">{SERVICES[i].features.map((f,fi)=><li key={fi}><span>→</span>{f}</li>)}</ul>
            </SpotlightCard>
          </TiltCard>
        ))}
      </div>
      <div className="svc-mob">
        <StackedCard
          items={SERVICES}
          renderCard={(s, idx) => (
            <TiltCard intensity={6} perspective={900} className="svc-mob-tilt">
              <div className="pricing-card">
                <div className="svc-top" style={{marginBottom:'8px'}}><span className="svc-n">{s.n}</span><div className="svc-ico"><i className={`fas fa-${s.icon}`}/></div></div>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-desc">{s.desc}</p>
                <ul className="svc-feat">{s.features.map((f,fi)=><li key={fi}><span>→</span>{f}</li>)}</ul>
              </div>
            </TiltCard>
          )}
        />
      </div>
      <div className={`s-hd ${dark?'s-hd--dark':''}`} style={{marginTop:'60px'}}><span className="s-lbl">Tarifs</span><h2 className="s-ttl" style={{fontSize:'clamp(24px,3.5vw,44px)'}}>Mes offres.</h2></div>
      <PricingTabs dark={dark}/>
    </section>
  );
};

const About = ({dark}) => {
  const [r1,v1] = useInView();
  const [aboutPhotoRef, aboutPhotoColor] = usePhotoColor();
  const [openIdx, setOpenIdx] = useState(0);

  const total         = TIMELINE.length;
  const expSectionRef = useRef(null);
  const scrollAccum   = useRef(0);
  const lastTouchY    = useRef(null);
  // Ref miroir — toujours à jour dans les handlers natifs (évite le stale-closure)
  const openIdxRef    = useRef(0);
  useEffect(() => { openIdxRef.current = openIdx; }, [openIdx]);

  const STEP_THRESH = 60;

  const goNext = () => setOpenIdx(i => Math.min(total - 1, i + 1));
  const goPrev = () => setOpenIdx(i => Math.max(0, i - 1));

  const isSectionVisible = () => {
    const el = expSectionRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
  };

  // Un seul useEffect, monté une fois — lit openIdxRef au lieu de openIdx
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 768;

    const onWheel = e => {
      if (isMobile() || !isSectionVisible()) return;
      const cur       = openIdxRef.current;
      const goingDown = e.deltaY > 0;
      const goingUp   = e.deltaY < 0;
      // Aux extrémités → libérer le scroll de page
      if ((cur === 0 && goingUp) || (cur === total - 1 && goingDown)) {
        scrollAccum.current = 0;
        return;
      }
      e.preventDefault();
      scrollAccum.current += e.deltaY;
      if (scrollAccum.current >= STEP_THRESH) {
        setOpenIdx(i => Math.min(total - 1, i + 1));
        scrollAccum.current = 0;
      } else if (scrollAccum.current <= -STEP_THRESH) {
        setOpenIdx(i => Math.max(0, i - 1));
        scrollAccum.current = 0;
      }
    };
    const onTouchStart = e => {
      if (isMobile() || !isSectionVisible()) return;
      lastTouchY.current = e.touches[0].clientY;
    };
    const onTouchMove = e => {
      if (isMobile() || !isSectionVisible() || lastTouchY.current === null) return;
      const cur = openIdxRef.current;
      const dy  = lastTouchY.current - e.touches[0].clientY;
      if ((cur === 0 && dy < 0) || (cur === total - 1 && dy > 0)) return;
      e.preventDefault();
    };
    const onTouchEnd = e => {
      if (isMobile() || !isSectionVisible() || lastTouchY.current === null) return;
      const cur = openIdxRef.current;
      const dy  = lastTouchY.current - (e.changedTouches[0]?.clientY ?? lastTouchY.current);
      if (!((cur === 0 && dy < 0) || (cur === total - 1 && dy > 0))) {
        if      (dy >  40) setOpenIdx(i => Math.min(total - 1, i + 1));
        else if (dy < -40) setOpenIdx(i => Math.max(0, i - 1));
      }
      lastTouchY.current = null;
    };
    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  });
    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] intentionnel — on lit via ref pour éviter le stale closure

  return (
    <>
      <section id="about" ref={el => { r1.current = el; aboutPhotoRef.current = el; }} className={dark?'section--dark':''}>
        <WindowChrome title="À propos" dark={dark}/>
        <div className={`s-hd ${dark?'s-hd--dark':''}`}><h2 className="s-ttl">Alors,<br/>c'est moi.</h2></div>
        <SpotlightCard className={`about-grid ${v1?'anim':''} mi-stagger ${v1?'mi-stagger--vis':''}`}>
          <div className="about-left">
            <div className={`about-quote ${dark?'about-quote--dark':''}`} style={{position:'relative',overflow:'hidden'}}>
              <PlasmaCanvasBg intensity={0.82}/>
              <div style={{position:'relative',zIndex:1}}><p>"Ce n'est pas important de réussir du premier coup. L'essentiel est de réussir au final."</p><span>— Kevin Ressegaire</span></div>
            </div>
            <div className="about-img-wrap">
              <img src="/assets/images/IMG_20250124_124101KK.jpg" alt="Elvis M'Bollo" className={`about-img photo-bw ${aboutPhotoColor?'photo-bw--on':''}`}/>
              <div className="about-badges"><span><i className="fas fa-code"/> Pro</span><span><i className="fas fa-lightbulb"/> Créatif</span><span><i className="fas fa-eye"/> Curieux</span></div>
            </div>
          </div>
          <div className="about-right">
            <h3>Développeur Full-Stack · Django &amp; React / Vite &amp; Next.js · Data &amp; Carto</h3>
            <p>Formé en <strong>Réseau et Sécurité Informatique</strong>, je conçois et mets en œuvre des applications web complètes — de l'interface React jusqu'au back-end Python — en appliquant les bonnes pratiques de développement et de sécurité dès la conception.</p>
            <p>À l'aise avec <strong>Django, Flask, React, Next.js</strong> et <strong>MySQL</strong>, je développe aussi des solutions orientées <strong>Data &amp; Cartographie</strong> : dashboards de gestion, visualisations interactives et intégration de cartes (Leaflet, OpenStreetMap).</p>
            <p>Via mon agence <strong>AKATech</strong>, j'ai livré plus de <strong>10 applications web</strong> — SaaS, e-commerce, plateformes — avec une approche orientée produit, sécurité et usages réels.</p>
            <div className={`about-tags ${dark?'about-tags--dark':''}`}>{["Esprit d'équipe","Créativité","Rigueur","Adaptabilité","Innovation"].map(t=><span key={t}>{t}</span>)}</div>
            <MagBtn className={`btn ${dark?'btn--neon':'btn--primary'} mi-glint`} onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Disponible pour opportunités →</MagBtn>
          </div>
        </SpotlightCard>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EXPÉRIENCE & FORMATION — Timeline scroll-hijack
          ═══════════════════════════════════════════════════════ */}
      <section id="experience" ref={expSectionRef} className={dark?'section--dark':''}>
        <WindowChrome title="Parcours" dark={dark}/>
        <div className={`s-hd ${dark?'s-hd--dark':''}`}><h2 className="s-ttl">Expérience &amp;<br/>Formation.</h2></div>

        {/* ── Hint scroll ── */}
        <p style={{
          textAlign:'center', color:'var(--muted)', fontSize:'12px',
          marginBottom:'24px', letterSpacing:'0.08em', opacity: 0.7,
        }}>
          <i className="fas fa-mouse" style={{marginRight:'6px'}}/>
          Scrollez pour naviguer entre les étapes
        </p>

        {/* ── Timeline horizontale ── */}
        <div className={`exp-steps ${dark?'exp-steps--dark':''}`}>
          {TIMELINE.map((t,i)=>(
            <button key={i}
              className={`exp-step ${openIdx===i?'exp-step--active':''} ${dark?'exp-step--dark':''}`}
              onClick={()=>setOpenIdx(i)}
              style={{ cursor:'pointer' }}>
              <div className={`exp-step-dot ${openIdx===i?'exp-step-dot--active':''}`}>
                <i className={`fas fa-${t.icon}`}/>
              </div>
              <div className="exp-step-line"/>
              <span className="exp-step-label">{t.date}</span>
            </button>
          ))}
        </div>

        {/* ── Carte unique animée (desktop) ── */}
        <div className="exp-desk-only">
        <div style={{ position:'relative', minHeight:'320px' }}>
          {TIMELINE.map((t, i) => {
            const active = openIdx === i;
            return (
              <div key={i} style={{
                position: active ? 'relative' : 'absolute',
                top: 0, left: 0, right: 0,
                opacity: active ? 1 : 0,
                transform: active ? 'translateX(0) scale(1)' : `translateX(${i < openIdx ? '-60px' : '60px'}) scale(0.97)`,
                transition: 'opacity .38s ease, transform .38s cubic-bezier(.4,0,.2,1)',
                pointerEvents: active ? 'auto' : 'none',
              }}>
                <div className={`exp-card exp-card--open ${dark?'exp-card--dark':''}`}>
                  {/* Header */}
                  <div className="exp-card-hd" style={{ cursor:'default' }}>
                    <div className="exp-card-hd-left">
                      <div className={`exp-dot exp-dot--on ${dark?'exp-dot--dark':''}`}>
                        <i className={`fas fa-${t.icon}`}/>
                      </div>
                      <div className="exp-card-hd-info">
                        <span className="exp-date"><i className="far fa-calendar-alt"/> {t.date}</span>
                        <h4 className="exp-title">{t.title}</h4>
                        <p className="exp-company"><i className="fas fa-building"/> {t.company}</p>
                      </div>
                    </div>
                    {/* Indicateur étape X/N */}
                    <div style={{
                      display:'flex', alignItems:'center', gap:'6px',
                      color:'var(--acc)', fontFamily:'var(--fb)', fontSize:'13px', fontWeight:700,
                    }}>
                      {openIdx + 1}<span style={{color:'var(--muted)'}}>/ {total}</span>
                    </div>
                  </div>

                  {/* Corps */}
                  <div className="exp-card-body" style={{ maxHeight:'600px', opacity:1, overflow:'hidden' }}>
                    <div className="exp-card-inner">
                      {t.items && t.progLabels && (
                        <div className="exp-prog-row">
                          {t.progLabels.map((l,j)=>(
                            <div key={j} className="exp-prog-item">
                              <span className="exp-prog-label">{l}</span>
                              <div className="exp-prog-track">
                                <div className="exp-prog-fill exp-prog-fill--on"
                                  style={{transitionDelay:`${j*0.08+0.1}s`, width:`${(t.progValues||[90,85,75,80])[j]}%`}}/>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {t.desc && <p className="exp-desc">{t.desc}</p>}
                      {t.items && (
                        <ul className="exp-list">
                          {t.items.map((li,j)=>(
                            <li key={j}><span className="exp-arrow">→</span>{li}</li>
                          ))}
                        </ul>
                      )}
                      {t.tags && (
                        <div className="exp-tags">
                          {t.tags.map(tag=><span key={tag} className={dark?'exp-tag--dark':''}>{tag}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Boutons navigation manuels (desktop) ── */}
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'16px', marginTop:'32px' }}>
          <button
            onClick={goPrev} disabled={openIdx === 0}
            className={`btn ${dark?'btn--ghost-neon':'btn--ghost'}`}
            style={{ opacity: openIdx===0 ? 0.3 : 1, transition:'opacity .2s' }}>
            <i className="fas fa-arrow-left"/> Précédent
          </button>

          {/* Dots */}
          <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            {TIMELINE.map((_,i)=>(
              <button key={i} onClick={()=>setOpenIdx(i)}
                style={{
                  width: openIdx===i ? '28px' : '8px',
                  height:'8px', borderRadius:'4px',
                  background: openIdx===i ? 'var(--acc)' : 'var(--muted-2)',
                  border:'none', cursor:'pointer',
                  transition:'width .3s var(--spring), background .2s',
                  padding:0,
                }}/>
            ))}
          </div>

          <button
            onClick={goNext} disabled={openIdx === total - 1}
            className={`btn ${dark?'btn--ghost-neon':'btn--ghost'}`}
            style={{ opacity: openIdx===total-1 ? 0.3 : 1, transition:'opacity .2s' }}>
            Suivant <i className="fas fa-arrow-right"/>
          </button>
        </div>
        </div>{/* /exp-desk-only */}

        {/* ── StackedCard Parcours — mobile uniquement (EN DEHORS de exp-desk-only) ── */}
        <div className="exp-sc-mob">
          <StackedCard
            items={TIMELINE}
            renderCard={(t, i) => (
              <div className={`exp-card exp-card--open ${dark?'exp-card--dark':''}`}>
                <div className="exp-card-hd" style={{ cursor:'default' }}>
                  <div className="exp-card-hd-left">
                    <div className={`exp-dot exp-dot--on ${dark?'exp-dot--dark':''}`}>
                      <i className={`fas fa-${t.icon}`}/>
                    </div>
                    <div className="exp-card-hd-info">
                      <span className="exp-date"><i className="far fa-calendar-alt"/> {t.date}</span>
                      <h4 className="exp-title">{t.title}</h4>
                      <p className="exp-company"><i className="fas fa-building"/> {t.company}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--acc)', fontFamily:'var(--fb)', fontSize:'13px', fontWeight:700 }}>
                    {i + 1}<span style={{color:'var(--muted)'}}>/ {total}</span>
                  </div>
                </div>
                <div className="exp-card-body" style={{ maxHeight:'600px', opacity:1, overflow:'hidden' }}>
                  <div className="exp-card-inner">
                    {t.items && t.progLabels && (
                      <div className="exp-prog-row">
                        {t.progLabels.map((l,j)=>(
                          <div key={j} className="exp-prog-item">
                            <span className="exp-prog-label">{l}</span>
                            <div className="exp-prog-track">
                              <div className="exp-prog-fill exp-prog-fill--on"
                                style={{transitionDelay:`${j*0.08+0.1}s`, width:`${(t.progValues||[90,85,75,80])[j]}%`}}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {t.desc && <p className="exp-desc">{t.desc}</p>}
                    {t.items && (
                      <ul className="exp-list">
                        {t.items.map((li,j)=>(
                          <li key={j}><span className="exp-arrow">→</span>{li}</li>
                        ))}
                      </ul>
                    )}
                    {t.tags && (
                      <div className="exp-tags">
                        {t.tags.map(tag=><span key={tag} className={dark?'exp-tag--dark':''}>{tag}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        <div className={`cta-band ${dark?'cta-band--neon':''}`} style={{ marginTop:'48px', position:'relative', overflow:'hidden' }}>
          <PlasmaCanvasBg intensity={0.78}/>
          <div style={{position:'relative',zIndex:1,display:'contents'}}>
          <h3>Intéressé par mon profil ?</h3>
          <p>N'hésitez pas à me contacter pour discuter de vos projets ou opportunités.</p>
          <div className="cta-btns">
            <MagBtn className={`btn ${dark?'btn--neon':'btn--cta-light'} mi-glint`} onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}><i className="fas fa-paper-plane"/> Me contacter</MagBtn>
            <a className={`btn ${dark?'btn--ghost-neon':'btn--cta-ghost-light'} mi-glint`} href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" download><i className="fas fa-download"/> Télécharger CV</a>
          </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ══════════════════════════════════════════════════════════
   PROJECT MODAL — fenêtre détail projet (utilisé par FanDeck)
   ══════════════════════════════════════════════════════════ */
const ProjectModal = ({ project, dark, onClose }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (project) { requestAnimationFrame(() => setVisible(true)); document.body.style.overflow = 'hidden'; }
    else { setVisible(false); document.body.style.overflow = ''; }
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className={`fd-modal-bg ${visible ? 'fd-modal-bg--show' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`fd-modal ${dark ? 'fd-modal--dark' : ''} ${visible ? 'fd-modal--show' : ''}`}>
        {/* Image */}
        <div className="fd-modal-img-wrap" style={{ background: GRAD[(project.id - 1) % GRAD.length] }}>
          <img src={project.image} alt={project.title} className="fd-modal-img"
            onError={e => { e.target.style.display = 'none'; }} />
          <div className="fd-modal-img-grad" />
          {project.cat === 'en-ligne' && (
            <div className="fd-modal-live"><span className="c3d-live-dot" /><span>EN LIGNE</span></div>
          )}
          <button className="fd-modal-close-btn" onClick={onClose} aria-label="Fermer">
            <i className="fas fa-times" />
          </button>
        </div>
        {/* Body */}
        <div className="fd-modal-body">
          <div className="fd-modal-meta">
            <span className="fd-modal-tag">{CAT_LABELS[project.cat]}</span>
            <span className="fd-modal-year">{project.year}</span>
            <span className="fd-modal-num">#{String(project.id).padStart(2,'0')}</span>
          </div>
          <h3 className="fd-modal-title">{project.title}</h3>
          <p className="fd-modal-sub">{project.subtitle}</p>
          <p className="fd-modal-desc">{project.description}</p>
          <div className="fd-modal-techs">
            {project.tech.map(t => <span key={t}>{t}</span>)}
          </div>
          <div className="fd-modal-actions">
            {project.url && (
              <a href={project.url} target={project.url.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                className={`btn ${dark ? 'btn--neon' : 'btn--primary'} fd-modal-btn-primary`}>
                {project.cat === 'demo'
                  ? <><i className="fas fa-play-circle" />Voir la démo</>
                  : <><i className="fas fa-external-link-alt" />Voir le site</>}
              </a>
            )}
            <button className={`btn ${dark ? 'btn--ghost-neon' : 'btn--ghost'}`} onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   FAN DECK — effet éventail inspiré portfolio.html
   ══════════════════════════════════════════════════════════ */
const FanDeck = ({ items, dark }) => {
  const [phase,    setPhase]   = useState('stack');   // 'stack' | 'fan' | 'focus'
  const [active,   setActive]  = useState(0);
  const [modal,    setModal]   = useState(null);
  const [dragging, setDragging]= useState(false);
  const [dragDx,   setDragDx]  = useState(0);

  const deckRef    = useRef(null);
  const touchX0    = useRef(null);
  const touchY0    = useRef(null);
  const dragLocked = useRef(false); // true = scroll vertical verrouillé
  const isDragMove = useRef(false);
  const total = items.length;

  // Reset sur changement de filtre
  useEffect(() => { setPhase('stack'); setActive(0); setDragDx(0); }, [items]);

  /* ── Navigation ── */
  const goPrev = useCallback(() => setActive(a => Math.max(0, a - 1)), []);
  const goNext = useCallback(() => setActive(a => Math.min(total - 1, a + 1)), [total]);

  // Clavier ← →
  useEffect(() => {
    if (phase !== 'focus') return;
    const fn = e => {
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [phase, goPrev, goNext]);

  /* ── Clic sur le deck empilé → ouvre le fan ── */
  const handleStackClick = () => { if (phase === 'stack') setPhase('fan'); };

  /* ── Clic sur une carte en mode fan → passe en focus ── */
  const handleFanCardClick = (e, idx) => {
    e.stopPropagation();
    setActive(idx);
    setPhase('focus');
  };

  /* ── Clic sur la carte active en mode focus → ouvre la modal ── */
  const handleFocusCardClick = (e, item) => {
    e.stopPropagation();
    if (!isDragMove.current) setModal(item);
  };

  /* ── Retour fan depuis focus ── */
  const backToFan = e => {
    e.stopPropagation();
    setPhase('fan');
    setDragDx(0);
  };

  /* ════════════════════════════════════════════════════
     DRAG / SWIPE — mode focus uniquement
     ════════════════════════════════════════════════════ */
  // Mouse
  const onMouseDown = e => {
    if (phase !== 'focus') return;
    touchX0.current = e.clientX;
    isDragMove.current = false;
    setDragging(true);
  };
  const onMouseMove = useCallback(e => {
    if (!dragging || touchX0.current === null) return;
    const dx = e.clientX - touchX0.current;
    if (Math.abs(dx) > 4) isDragMove.current = true;
    setDragDx(dx);
  }, [dragging]);
  const onMouseUp = useCallback(e => {
    if (!dragging) return;
    const dx = e.clientX - (touchX0.current ?? e.clientX);
    commitDrag(dx);
    touchX0.current = null;
    setDragging(false);
  }, [dragging, active, total]); // eslint-disable-line

  // Touch
  const onTouchStart = e => {
    touchX0.current = e.touches[0].clientX;
    touchY0.current = e.touches[0].clientY;
    dragLocked.current = false;
    isDragMove.current = false;
    if (phase === 'stack') setPhase('fan');
  };
  const onTouchMove = useCallback(e => {
    if (phase !== 'focus' || touchX0.current === null) return;
    const dx = e.touches[0].clientX - touchX0.current;
    const dy = e.touches[0].clientY - (touchY0.current ?? 0);
    // Verrouille direction au premier mouvement
    if (!dragLocked.current) {
      dragLocked.current = true;
      if (Math.abs(dy) > Math.abs(dx)) return; // scroll vertical → ignore
    }
    if (Math.abs(dx) > 4) { isDragMove.current = true; e.preventDefault(); }
    setDragDx(dx);
    setDragging(true);
  }, [phase]);
  const onTouchEnd = useCallback(e => {
    if (phase === 'fan') { /* déjà ouvert via onTouchStart */ return; }
    if (phase !== 'focus') return;
    const dx = e.changedTouches[0].clientX - (touchX0.current ?? 0);
    commitDrag(dx);
    touchX0.current = null;
    touchY0.current = null;
    setDragging(false);
  }, [phase, active, total]); // eslint-disable-line

  const commitDrag = dx => {
    const threshold = 60;
    if (dx < -threshold && active < total - 1) setActive(a => a + 1);
    else if (dx > threshold && active > 0)     setActive(a => a - 1);
    setDragDx(0);
  };

  // Attach touchmove passive:false pour e.preventDefault()
  useEffect(() => {
    const el = deckRef.current; if (!el) return;
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, [onTouchMove]);

  /* ════════════════════════════════════════════════════
     Calcul positions par phase
     ════════════════════════════════════════════════════ */
  // STACK : cartes empilées légèrement décalées
  const stackStyle = i => ({
    transform: `rotate(${(i - (total-1)/2) * 3}deg) translateY(${i * -3}px)`,
    zIndex: total - i,
    opacity: 1,
    transition: 'transform .45s cubic-bezier(.34,1.4,.64,1)',
  });

  // FAN : éventail bien espacé, zIndex croissant = carte du dessus visible
  const fanStyle = i => {
    if (total === 1) return { transform: 'rotate(0deg) translateY(-60px)', zIndex: 1, opacity: 1, transition: 'transform .45s cubic-bezier(.34,1.4,.64,1)' };
    // Spread adaptatif : plus de cartes = spread plus large
    const spread = Math.min(38, 6 + total * 4);
    const angle  = -spread + (i / (total - 1)) * spread * 2;
    // On sépare horizontalement aussi pour éviter le chevauchement
    const cardW  = typeof window !== 'undefined' ? Math.min(240, window.innerWidth * 0.52) : 220;
    const gap    = Math.min(cardW * 0.42, 100); // espacement horizontal entre cartes
    const cx     = (total - 1) / 2;
    const tx     = (i - cx) * gap;
    const ty     = -Math.abs(i - cx) * 18 - 50; // cartes latérales légèrement plus basses
    return {
      transform: `translateX(${tx}px) translateY(${ty}px) rotate(${angle}deg)`,
      zIndex: i + 1,
      opacity: 1,
      transition: `transform .48s cubic-bezier(.34,1.4,.64,1) ${i * 0.03}s`,
    };
  };

  // FOCUS : carte active centrée grande, voisines sur les côtés visibles mais dégagées
  const focusStyle = (i, liveOffset) => {
    const rel = i - active; // distance depuis l'active
    const absRel = Math.abs(rel);
    if (absRel > 2) return { opacity: 0, pointerEvents: 'none', zIndex: 0, transform: `translateX(${rel > 0 ? 200 : -200}%) scale(0.5)`, transition: 'all .42s cubic-bezier(.25,.46,.45,.94)' };

    // Décalage live (drag en cours)
    const dragOffset = dragging || dragDx !== 0 ? liveOffset : 0;

    const cardW = typeof window !== 'undefined' ? Math.min(240, window.innerWidth * 0.52) : 220;
    const sideOffset = cardW * 0.7 + 24; // distance centre→carte latérale

    const baseX = rel === 0 ? 0 : rel > 0 ? sideOffset : -sideOffset;
    const scale = rel === 0 ? 1 : 0.72;
    const opacity = rel === 0 ? 1 : 0.45;
    const rotY = rel === 0 ? 0 : rel > 0 ? 8 : -8;
    const ty = rel === 0 ? -20 : 30;

    return {
      transform: `translateX(${baseX + dragOffset}px) translateY(${ty}px) scale(${scale}) perspective(800px) rotateY(${rotY}deg)`,
      zIndex: rel === 0 ? 10 : (absRel === 1 ? 5 : 2),
      opacity,
      pointerEvents: rel === 0 ? 'all' : 'none',
      transition: dragging ? 'none' : `transform .42s cubic-bezier(.25,.46,.45,.94), opacity .3s ease`,
    };
  };

  const getCardStyle = i => {
    if (phase === 'stack') return stackStyle(i);
    if (phase === 'fan')   return fanStyle(i);
    // focus
    const vel = Math.sign(dragDx) === -1 ? 1 : -1;
    const resistance = 0.35;
    const live = dragging ? dragDx * resistance : dragDx * resistance;
    return focusStyle(i, live);
  };

  /* ════ RENDER ════ */
  return (
    <>
      <div
        className={`fd-root fd-root--${phase} ${dark ? 'fd-root--dark' : ''}`}
        ref={deckRef}
        onClick={phase === 'stack' ? handleStackClick : undefined}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={e => { if (dragging) onMouseUp(e); }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ── Deck ── */}
        <div className="fd-wrap" style={{ cursor: phase === 'focus' ? (dragging ? 'grabbing' : 'grab') : 'pointer' }}>
          {items.map((item, i) => {
            const style = getCardStyle(i);
            const isActive = phase === 'focus' && i === active;
            const isAgency = !!item.isAgency;
            return (
              <div
                key={item.id}
                className={`fd-card ${isActive ? 'fd-card--active' : ''} ${isAgency ? 'fd-card--agency' : ''}`}
                style={style}
                onClick={e => {
                  if (phase === 'fan')   handleFanCardClick(e, i);
                  if (phase === 'focus' && isActive) handleFocusCardClick(e, item);
                }}
              >
                {/* ── Carte spéciale AKATech ── */}
                {isAgency ? (
                  <div className="fd-agency-card">
                    {/* Grille animée en arrière-plan */}
                    <div className="fd-agency-grid" aria-hidden />
                    {/* Aurora orbs */}
                    <div className="fd-agency-orb fd-agency-orb--1" aria-hidden />
                    <div className="fd-agency-orb fd-agency-orb--2" aria-hidden />
                    {/* Scan line */}
                    <div className="fd-agency-scan" aria-hidden />
                    {/* Logo text */}
                    <div className="fd-agency-logo">
                      <span className="fd-agency-aka">AKA</span><span className="fd-agency-tech">Tech</span>
                    </div>
                    <div className="fd-agency-tagline">Agence Digitale · Abidjan</div>
                    {/* Tech pills */}
                    <div className="fd-agency-pills">
                      {item.tech.map(t => <span key={t} className="fd-agency-pill">{t}</span>)}
                    </div>
                    {/* Live badge */}
                    <div className="fd-agency-live"><span className="fd-agency-dot"/><span>EN LIGNE</span></div>
                    {/* Overlay label en fan/focus */}
                    <div className={`fd-card-overlay ${isActive || phase === 'fan' ? 'fd-card-overlay--show' : ''}`} style={{background:'linear-gradient(to top,rgba(3,8,6,.92) 0%,transparent 60%)'}}>
                      <span className="fd-card-label" style={{color:'#22c864'}}>{item.title}</span>
                      <span className="fd-card-sub">{item.subtitle}</span>
                      {isActive && <span className="fd-card-cta" style={{color:'#22c864',borderColor:'rgba(34,200,100,.4)'}}>Visiter l'agence →</span>}
                    </div>
                    <div className="fd-card-num" style={{color:'rgba(34,200,100,.5)'}}>#13</div>
                  </div>
                ) : (
                  <>
                    <div className="fd-card-img" style={{ background: GRAD[(item.id - 1) % GRAD.length] }}>
                      <img src={item.image} alt={item.title} onError={e => { e.target.style.display = 'none'; }} />
                      <div className="fd-card-img-grad" />
                      {item.cat === 'en-ligne' && (
                        <div className="fd-card-live"><span className="c3d-live-dot" /><span>EN LIGNE</span></div>
                      )}
                    </div>
                    <div className={`fd-card-overlay ${isActive || phase === 'fan' ? 'fd-card-overlay--show' : ''}`}>
                      <span className="fd-card-label">{item.title}</span>
                      <span className="fd-card-sub">{item.subtitle}</span>
                      {isActive && <span className="fd-card-cta">Cliquer pour voir →</span>}
                    </div>
                    <div className="fd-card-num">#{String(item.id).padStart(2,'0')}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* ── UI par phase ── */}
        {phase === 'stack' && (
          <p className="fd-hint">
            <span className="fd-hint-line" />
            Cliquer pour ouvrir
            <span className="fd-hint-line" />
          </p>
        )}

        {phase === 'fan' && (
          <p className="fd-hint fd-hint--fan">
            <span className="fd-hint-line" />
            Choisir une carte
            <span className="fd-hint-line" />
          </p>
        )}

        {phase === 'focus' && (
          <div className="fd-nav">
            {/* Retour fan */}
            <button className={`fd-nav-back ${dark ? 'fd-nav-back--dark' : ''}`} onClick={backToFan} title="Retour">
              <i className="fas fa-th-large" />
            </button>
            {/* Flèche gauche */}
            <button className={`fd-nav-arr ${dark ? 'fd-nav-arr--dark' : ''}`} onClick={e => { e.stopPropagation(); goPrev(); }} disabled={active === 0} aria-label="Précédent">
              <i className="fas fa-chevron-left" />
            </button>
            {/* Dots */}
            <div className="fd-nav-dots">
              {items.map((_, i) => (
                <button key={i}
                  className={`fd-nav-dot ${i === active ? 'fd-nav-dot--on' : ''}`}
                  onClick={e => { e.stopPropagation(); setActive(i); }}
                  aria-label={`Projet ${i + 1}`}
                />
              ))}
            </div>
            {/* Flèche droite */}
            <button className={`fd-nav-arr ${dark ? 'fd-nav-arr--dark' : ''}`} onClick={e => { e.stopPropagation(); goNext(); }} disabled={active === total - 1} aria-label="Suivant">
              <i className="fas fa-chevron-right" />
            </button>
            {/* Compteur */}
            <span className="fd-nav-count">
              <span className="fd-nav-count-n">{String(active + 1).padStart(2, '0')}</span>
              /{String(total).padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Compteur bas (stack + fan) */}
        {phase !== 'focus' && (
          <div className={`fd-counter ${dark ? 'fd-counter--dark' : ''}`}>
            <span>{total}</span> projet{total > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <ProjectModal project={modal} dark={dark} onClose={() => setModal(null)} />
    </>
  );
};

/* ══ SPOTLIGHT PROJECTS ══ */
const SpotlightProjects = ({ items, dark }) => {
  const [selected, setSelected] = useState(0);
  const [imgErr, setImgErr] = useState({});
  const thumbsRef = useRef(null);

  const goPrev = () => setSelected(s => Math.max(0, s - 1));
  const goNext = () => setSelected(s => Math.min(items.length - 1, s + 1));

  useEffect(() => {
    const rail = thumbsRef.current; if (!rail) return;
    const thumb = rail.children[selected];
    if (!thumb) return;
    const targetLeft = thumb.offsetLeft - (rail.clientWidth - thumb.clientWidth) / 2;
    rail.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }, [selected]);
  useEffect(() => { setSelected(0); setImgErr({}); }, [items]);

  const proj = items[selected] ?? items[0];
  if (!proj) return null;
  const isExternal = proj.url?.startsWith('http');
  const isDemo = proj.cat === 'demo';

  return (
    <div className={`sp-root ${dark?'sp-root--dark':''}`}>
      <div className="sp-viewer">
        {/* Preview */}
        <div className="sp-preview" style={{background:GRAD[(proj.id-1)%GRAD.length]}}>
          {!imgErr[proj.id]
            ? <img src={proj.image} alt={proj.title} className="sp-preview-img" onError={()=>setImgErr(e=>({...e,[proj.id]:true}))}/>
            : <div className="sp-preview-placeholder"><i className="fas fa-code"/></div>}
          {proj.cat==='en-ligne' && <div className="sp-live-badge"><span className="hero-dot"/><span>EN LIGNE</span></div>}
          {proj.isPremium && <div className="sp-prem-badge"><i className="fas fa-star"/> Premium</div>}
        </div>
        {/* Détails */}
        <div className={`sp-details ${dark?'sp-details--dark':''}`}>
          <div className="sp-num">{String(selected+1).padStart(2,'0')}</div>
          <div className="sp-title-wrap">
            <h3 className="sp-title">{proj.title}</h3>
            <span className={`sp-cat-badge sp-cat-badge--${proj.cat}`}>{CAT_LABELS[proj.cat]}</span>
          </div>
          <p className="sp-sub">{proj.subtitle}</p>
          <p className="sp-desc">{proj.description}</p>
          <div className="sp-meta">
            <span className="sp-year"><i className="far fa-calendar-alt"/> {proj.year}</span>
            {proj.progress!=null&&(
              <div className="sp-progress-wrap">
                <div className="sp-progress-track"><div className="sp-progress-fill" style={{width:`${proj.progress}%`}}/></div>
                <span className="sp-progress-pct">{proj.progress}%</span>
              </div>
            )}
          </div>
          <div className="sp-techs">{proj.tech.map(t=><span key={t} className="sp-tech">{t}</span>)}</div>
          {proj.url&&(
            <div className="sp-actions">
              <a href={proj.url} target={isExternal?'_blank':'_self'} rel="noreferrer"
                className={`btn ${dark?'btn--neon':'btn--primary'} sp-cta mi-glint`}>
                <i className={`fas fa-${isDemo?'play-circle':'external-link-alt'}`}/>{isDemo?'Voir la démo':'Voir le site →'}
              </a>
            </div>
          )}
          {/* Navigation : boutons slide + dots */}
          <div className="sp-nav-row">
            <button
              className={`sp-nav-btn ${dark?'sp-nav-btn--dark':''}`}
              onClick={goPrev}
              disabled={selected===0}
              aria-label="Projet précédent">
              <i className="fas fa-chevron-left"/>
            </button>
            <div className="sp-dots">
              {items.map((_,i)=><button key={i} className={`sp-dot ${i===selected?'sp-dot--on':''}`} onClick={()=>setSelected(i)} aria-label={`Projet ${i+1}`}/>)}
            </div>
            <button
              className={`sp-nav-btn ${dark?'sp-nav-btn--dark':''}`}
              onClick={goNext}
              disabled={selected===items.length-1}
              aria-label="Projet suivant">
              <i className="fas fa-chevron-right"/>
            </button>
          </div>
        </div>
      </div>
      {/* Thumbnails */}
      <div className="sp-thumbs-wrap">
        <div className="sp-thumbs" ref={thumbsRef}>
          {items.map((item,i)=>(
            <button key={item.id} className={`sp-thumb ${i===selected?'sp-thumb--active':''} ${dark?'sp-thumb--dark':''}`}
              onClick={()=>setSelected(i)} title={item.title}>
              <div className="sp-thumb-img" style={{background:GRAD[(item.id-1)%GRAD.length]}}>
                {!imgErr[item.id]
                  ? <img src={item.image} alt={item.title} onError={()=>setImgErr(e=>({...e,[item.id]:true}))}/>
                  : <i className="fas fa-code"/>}
                {item.cat==='en-ligne'&&<div className="sp-thumb-live"/>}
              </div>
              <span className="sp-thumb-title">{item.title}</span>
              {i===selected&&<div className="sp-thumb-bar"/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Projects = ({dark}) => {
  const [filter,setFilter]=useState('all');
  const filtered=filter==='all'?PROJECTS:PROJECTS.filter(p=>p.cat===filter);
  const count=k=>k==='all'?PROJECTS.length:PROJECTS.filter(p=>p.cat===k).length;
  const pillRef=useRef(null); const btnRefs=useRef([]); const keys=Object.keys(CAT_LABELS);
  useEffect(()=>{
    const pill=pillRef.current,idx=keys.indexOf(filter),btn=btnRefs.current[idx];
    if(!pill||!btn) return;
    const parent=btn.parentElement.getBoundingClientRect(),r=btn.getBoundingClientRect();
    pill.style.width=`${r.width}px`; pill.style.height=`${r.height}px`; pill.style.transform=`translateX(${r.left-parent.left}px)`;
  },[filter]);
  return (
    /* overflow:hidden + position:relative → empêche le décalage gauche lors du scroll des thumbnails */
    <section id="projects" className={`projects-section ${dark?'projects-section--dark':''}`} style={{overflowX:'hidden',position:'relative'}}>
      <WindowChrome title="Projets" dark={dark}/>
      <div className={`s-hd ${dark?'s-hd--dark':''}`}><h2 className="s-ttl">Réalisations<br/>récentes.</h2></div>
      <div className="pf-toggle-wrap">
        <div className={`pf-toggle ${dark?'pf-toggle--dark':''}`}>
          <span ref={pillRef} className={`pf-pill ${dark?'pf-pill--dark':''}`}/>
          {Object.entries(CAT_LABELS).map(([k,v],i)=>(<button key={k} ref={el=>btnRefs.current[i]=el} className={`pf-tab ${filter===k?'pf-tab--active':''} ${dark?'pf-tab--dark':''}`} onClick={()=>setFilter(k)}>{v}<span className={`pf-count ${filter===k?'pf-count--active':''} ${dark?'pf-count--dark':''}`}>{count(k)}</span></button>))}
        </div>
      </div>
      <SpotlightProjects key={filter} items={filtered} dark={dark}/>
    </section>
  );
};

const SkillBand = ({title,icon,items,dir,dark})=>(
  <div className="sk-row">
    <div className="sk-row-lbl"><i className={`fas fa-${icon}`}/>{title}</div>
    <div className="sk-wrap"><div className={`sk-band sk-band--${dir}`}>
      {[...items,...items,...items].map((sk,i)=>(<div key={i} className="sk-item"><img src={sk.icon} alt={sk.name} style={dark&&(sk.icon.includes('flask')||sk.icon.includes('django')||sk.icon.includes('github')||sk.icon.includes('vercel'))?{filter:'brightness(0) invert(1)'}:{}}/><span>{sk.name}</span></div>))}
    </div></div>
  </div>
);

const Skills = ({dark}) => {
  const [ref,vis]=useInView();
  const master=[...SKILLS.frontend.slice(0,4),...SKILLS.backend.slice(0,3)];
  return (
    <section id="skills" className="skills-section" ref={ref}>
      <div className="skills-inner">
        <WindowChrome title="Skills" dark={dark}/>
        <div className={`s-hd ${dark?'s-hd--dark':''}`}><h2 className="s-ttl">Mes outils<br/>de travail.</h2></div>
        <div className="sk-mastery-wrap">
          <div className="sk-label-tag"><span>//</span> maîtrise principale</div>
          <div className={`sk-mastery ${vis?'anim':''} mi-stagger ${vis?'mi-stagger--vis':''}`}>
            {master.map((sk,i)=>(<TiltCard key={i} className="sk-m-card" style={{animationDelay:`${i*0.07}s`}}><div className="sk-m-glow"/><img src={sk.icon} alt={sk.name} style={dark&&(sk.icon.includes('flask')||sk.icon.includes('django'))?{filter:'brightness(0) invert(1)'}:{}}/><span>{sk.name}</span></TiltCard>))}
          </div>
        </div>
        <div className="sk-bands">
          <SkillBand title="Frontend"    icon="laptop-code" items={SKILLS.frontend} dir="left"  dark={dark}/>
          <SkillBand title="Backend"     icon="server"      items={SKILLS.backend}  dir="right" dark={dark}/>
          <SkillBand title="Outils & IA" icon="tools"       items={SKILLS.tools}    dir="left"  dark={dark}/>
          <SkillBand title="Autres"      icon="plus-circle" items={SKILLS.autres}   dir="right" dark={dark}/>
        </div>
        <div className={`cta-band ${dark?'cta-band--neon':''}`} style={{position:'relative',overflow:'hidden'}}>
          <PlasmaCanvasBg intensity={0.78}/>
          <div style={{position:'relative',zIndex:1,display:'contents'}}>
          <h3>Besoin de ces compétences ?</h3>
          <p>Mettons mes compétences au service de votre projet. Discutons-en !</p>
          <div className="cta-btns">
            <MagBtn className={`btn ${dark?'btn--neon':'btn--cta-light'} mi-glint`} onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}><i className="fas fa-paper-plane"/> Me contacter</MagBtn>
            <MagBtn className={`btn ${dark?'btn--ghost-neon':'btn--cta-ghost-light'} mi-glint`} onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}><i className="fas fa-eye"/> Voir mes projets</MagBtn>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = ({dark}) => {
  const [ref,vis]=useInView();
  const [form,setForm]=useState({name:'',email:'',projectType:'',message:''});
  const [sending,setSending]=useState(false); const [sent,setSent]=useState(false);
  const onChange=e=>setForm(f=>({...f,[e.target.id]:e.target.value}));
  const onSubmit=async e=>{
    e.preventDefault(); setSending(true);
    try{
      await fetch('https://formsubmit.co/ajax/wthomasss06@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name:form.name,email:form.email,'Type de projet':form.projectType,message:form.message,_subject:`🚀 Nouveau contact : ${form.name}`,_template:'table',_captcha:'false'})});
      setSent(true); setForm({name:'',email:'',projectType:'',message:''});
    }catch{ alert('❌ Erreur. Contactez-moi sur WhatsApp : +225 01 42 50 77 50'); }
    finally{ setSending(false); }
  };
  return (
    <section id="contact" ref={ref} className={dark?'section--dark':''}>
      <WindowChrome title="Contact" dark={dark}/>
      <div className={`s-hd ${dark?'s-hd--dark':''}`}><h2 className="s-ttl">Transformons<br/>votre idée.</h2></div>

      {/* ── Formulaire + bloc code ── */}
      <div className={`contact-grid ${vis?'anim':''} mi-stagger ${vis?'mi-stagger--vis':''}`}>
        <div className="contact-left">
          <div className="contact-status"><span className="cdot"/><span>Disponible maintenant</span></div>
          <div className="code-block">
            <div className="code-hd"><span className="cd"/><span className="cy"/><span className="cg"/><span>contact.js</span></div>
            <div className="code-body">
              <div><span className="ck">const</span> [<span className="cv">responseTime</span>] = <span className="cs">"&lt;24h"</span>;</div>
              <div><span className="ck">const</span> [<span className="cv">availability</span>] = <span className="cs">"100%"</span>;</div>
              <div><span className="ck">const</span> [<span className="cv">status</span>] = <span className="cs">"ready"</span>;</div>
              <div><span className="cc">{'// 🚀 Prêt pour de nouveaux défis !'}</span></div>
            </div>
          </div>
        </div>
        <div className="contact-right">
          <h3>Envoyez-moi un message</h3>
          <p>Remplissez le formulaire et je vous réponds rapidement.</p>
          {sent?(
            <div className="form-success"><div className="form-ok">✓</div><p>Message envoyé ! Je vous réponds sous 24h. 🚀</p></div>
          ):(
            <form className={`cform ${dark?'cform--dark':''}`} onSubmit={onSubmit}>
              <div className="form-row">
                <div className="ff"><label htmlFor="name">Nom complet *</label><input id="name" type="text" placeholder="Jean Kouassi" value={form.name} onChange={onChange} required/></div>
                <div className="ff"><label htmlFor="email">Email *</label><input id="email" type="email" placeholder="jean@exemple.com" value={form.email} onChange={onChange} required/></div>
              </div>
              <div className="ff">
                <label htmlFor="projectType">Type de projet *</label>
                <select id="projectType" value={form.projectType} onChange={onChange} required>
                  <option value="">Sélectionnez votre besoin…</option>
                  <option value="site-vitrine">Site Vitrine</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="application-web">Application Web</option>
                  <option value="api">API / Backend</option>
                  <option value="maintenance">Maintenance / Support</option>
                  <option value="recrutement">Candidature spontanée</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="ff">
                <label htmlFor="message">Message *</label>
                <textarea id="message" rows={6} placeholder="Décrivez votre projet…" value={form.message} onChange={onChange} required/>
              </div>
              <MagBtn type="submit" className={`btn ${dark?'btn--neon':'btn--primary'} btn--full mi-btn-grad-solid`} disabled={sending}>
                <i className="fas fa-paper-plane"/>{sending?'Envoi en cours…':'Envoyer le message'}{sending&&<i className="fas fa-spinner fa-spin"/>}
              </MagBtn>
              <p className="form-privacy"><i className="fas fa-lock"/> Vos données sont sécurisées et ne seront jamais partagées.</p>
            </form>
          )}
        </div>
      </div>

      {/* ── OÙ ME JOINDRE — après le formulaire ── */}
      <div className={`coj-wrap ${dark?'coj-wrap--dark':''}`}>
        <div className="coj-hd">
          <span className={`coj-label ${dark?'coj-label--dark':''}`}>// Où me joindre</span>
          <div className="coj-infos">
            <a href="tel:+2250142507750" className={`coj-info ${dark?'coj-info--dark':''}`}>
              <i className="fas fa-phone"/><div><b>Téléphone</b><span>+225 01 42 50 77 50</span></div>
            </a>
            <a href="mailto:wthomasss06@gmail.com" className={`coj-info ${dark?'coj-info--dark':''}`}>
              <i className="fas fa-envelope"/><div><b>Email</b><span>wthomasss06@gmail.com</span></div>
            </a>
            <div className={`coj-info ${dark?'coj-info--dark':''}`}>
              <i className="fas fa-map-marker-alt"/><div><b>Localisation</b><span>Abidjan, Côte d'Ivoire</span></div>
            </div>
          </div>
        </div>

        {/* Grille sociale — icônes TOUTES en orange */}
        <div className={`csg-root ${dark?'csg-root--dark':''}`}>
          <div className="csg-heading">
            <span className="csg-label">// un clic, chaque canal</span>
            <h4 className="csg-title">UN RÉSEAU.<br/><span className="csg-accent">CHAQUE LIEN.</span></h4>
            <p className="csg-sub">Retrouvez-moi sur toutes les plateformes.</p>
          </div>
          <div className="csg-grid">
            {[
              {ico:'fab fa-github',   label:'GitHub',   url:'https://github.com/wthomasss06-stack'},
              {ico:'fab fa-linkedin', label:'LinkedIn',  url:'https://www.linkedin.com/in/m-bollo-aka-60a1b1340/'},
              {ico:'fab fa-facebook', label:'Facebook',  url:FACEBOOK_URL},
              {ico:'fab fa-whatsapp', label:'WhatsApp',  url:'https://wa.me/2250142507750'},
              {ico:'fas fa-globe',    label:'AKATech',   url:'https://akatech.vercel.app/'},
              {ico:'fas fa-envelope', label:'Gmail',     url:'mailto:wthomasss06@gmail.com'},
              {ico:'fas fa-university',label:'UVCI',    url:'mailto:aka.mbollo@uvci.edu.ci'},
              {ico:'fas fa-file-pdf', label:'Mon CV',    url:'/assets/CV_MBOLLO_AKA_ELVIS.pdf', download:true},
            ].map((s,i)=>(
              <a key={i} href={s.url}
                target={s.url.startsWith('http')?'_blank':'_self'}
                rel="noreferrer"
                download={s.download||undefined}
                className={`csg-item ${dark?'csg-item--dark':''}`}
                title={s.label}>
                <i className={`${s.ico} csg-ico`}/>
                <span className="csg-name">{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* QR + CV */}
        <div className={`contact-cv ${dark?'contact-cv--dark':''}`}>
          <div className="cv-qr"><img src="/assets/images/qrcodeCV.png" alt="QR Code CV"/></div>
          <div>
            <p><b>Télécharger mon CV</b></p>
            <p>Scannez le QR code ou cliquez</p>
            <a href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" className={`btn ${dark?'btn--neon':'btn--primary'} mi-glint`} download>
              <i className="fas fa-download"/> Télécharger CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({dark}) => (
  <footer className={`footer ${dark?'footer--dark':'footer--light'}`}>
    <div className="footer-inner">
      <div className="footer-logo"><AkafolioLogo size={26} dark={dark} animate={false}/></div>
      <div className="footer-mid">
        <p>© 2026 — M'Bollo Aka Elvis — Développeur Full-Stack</p>
        <p>Abidjan, Côte d'Ivoire</p>
      </div>
      <div className="footer-links">
        <a href="https://github.com/wthomasss06-stack" target="_blank" rel="noreferrer"><i className="fab fa-github"/></a>
        <a href="https://www.linkedin.com/in/m-bollo-aka-60a1b1340/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"/></a>
        <a href={FACEBOOK_URL} target="_blank" rel="noreferrer"><i className="fab fa-facebook"/></a>
        <a href="https://akatech.vercel.app/" target="_blank" rel="noreferrer" title="AKATech"><i className="fas fa-globe"/></a>
        <a href="mailto:wthomasss06@gmail.com"><i className="fas fa-envelope"/></a>
      </div>
    </div>
  </footer>
);

const getAutoLight = () => { try { const h = new Date().getHours(); return h < 6 || h >= 18; } catch { return true; } };

export default function App() {
  const [loaded,setLoaded]=useState(false);
  const [light,setLight]=useState(()=>{
    try {
      const saved=localStorage.getItem('aka-theme');
      if(saved==='light') return true;
      if(saved==='dark') return false;
      return getAutoLight();
    } catch { return getAutoLight(); }
  });

  const toggleDark=()=>setLight(l=>{
    const next=!l;
    try { localStorage.setItem('aka-theme',next?'light':'dark'); } catch {}
    return next;
  });
  const dark=!light;
  return !loaded ? (
    <Loader onDone={()=>setLoaded(true)}/>
  ) : (
    <div className={`app ${light?'app--light':''}`}>
      <CustomCursor/>
      <Navbar dark={dark} onToggle={toggleDark}/>
      <ScrollTop dark={dark}/>
      <main>
  <ScrollDepthScene dark={dark}>
    <Hero dark={dark}/>
    <Marquee dark={dark}/>
    <FeaturedCreation dark={dark}/>
    <Services dark={dark}/>
    <About dark={dark}/>
    <Projects dark={dark}/>
    <Skills dark={dark}/>
    <Contact dark={dark}/>
  </ScrollDepthScene>
</main>
      <Footer dark={dark}/>
    </div>
  );
}
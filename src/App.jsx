import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Monitor, Star, Cpu, Check, Globe, ShoppingCart, Zap, Wrench, Hammer, Briefcase, Sparkles, ArrowRight, Send, Eye, Coffee, Hand } from 'lucide-react';
import './style.css';

// ═══════════════════════════════════════════════════════════════
// LOGO — AKATech (SVG réécrit, sans fond, thème dynamique)
// ═══════════════════════════════════════════════════════════════
const AkafolioLogo = ({ size = 48, dark = true, onClick, animate = true }) => {
  const acc = '#FF5500';
  // dark=true = fond BLANC réel → Tech noir
  // dark=false = fond NOIR réel → Tech blanc
  const ink   = dark ? '#0D0D0D' : '#FFFFFF';
  const cross = dark ? '#FFFFFF' : '#0D0D0D';
  const W = size * (220 / 48);
  const H = size;
  return (
    <svg
      onClick={onClick}
      width={W} height={H}
      viewBox="0 0 220 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AKATech"
      style={{ cursor: onClick ? 'pointer' : 'default', display: 'block', overflow: 'visible', transition: 'all .3s' }}
    >
      {/* ── ICÔNE ENGRENAGE HEXAGONAL ── */}
      {/* Hexagone */}
      <polygon points="24,3 36,10 36,24 24,31 12,24 12,10"
        fill="none" stroke={acc} strokeWidth="2.2"
        strokeLinejoin="round" strokeLinecap="round"/>
      {/* Dents haut/bas/gauche/droite */}
      <rect x="22" y="0"  width="4" height="5"  rx="1" fill={acc}/>
      <rect x="22" y="33" width="4" height="5"  rx="1" fill={acc}/>
      <rect x="0"  y="14" width="5" height="4"  rx="1" fill={acc}/>
      <rect x="0"  y="20" width="5" height="4"  rx="1" fill={acc}/>
      <rect x="43" y="14" width="5" height="4"  rx="1" fill={acc}/>
      <rect x="43" y="20" width="5" height="4"  rx="1" fill={acc}/>
      {/* Centre orange */}
      <circle cx="24" cy="17" r="5.5" fill={acc}/>
      {/* Croix blanche/noire au centre */}
      <line x1="24" y1="13" x2="24" y2="21" stroke={cross} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="20" y1="17" x2="28" y2="17" stroke={cross} strokeWidth="1.8" strokeLinecap="round"/>
      {/* Fils circuit */}
      <line x1="24" y1="31" x2="24" y2="42" stroke={acc} strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="24" cy="44" r="2" fill={acc}/>
      <line x1="12" y1="17" x2="3"  y2="17" stroke={acc} strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="1"  cy="17" r="2" fill={acc}/>
      <line x1="36" y1="17" x2="45" y2="17" stroke={acc} strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="47" cy="17" r="2" fill={acc}/>
      {/* Pulse ring */}
      <circle cx="24" cy="17" r="5.5" fill="none" stroke={acc} strokeWidth="1" opacity="0">
        <animate attributeName="r"       values="5.5;18;5.5" dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0;0.6"  dur="2.2s" repeatCount="indefinite"/>
      </circle>

      {/* ── TEXTE AKA (orange, gras) ── */}
      <text
        x="54" y="37"
        fontFamily="'Syne','Arial Black','Impact',sans-serif"
        fontWeight="900" fontSize="30" letterSpacing="-0.5"
        fill={acc}
      >AKA</text>

      {/* ── SÉPARATEUR ── */}
      <line x1="139" y1="10" x2="139" y2="42" stroke={acc} strokeWidth="1.5" opacity="0.45"/>

      {/* ── TEXTE Tech (ink, semi-bold) ── */}
      <text
        x="144" y="37"
        fontFamily="'Syne','Arial','Helvetica',sans-serif"
        fontWeight="600" fontSize="28" letterSpacing="0.3"
        className="logo-tech-text"
        fill={ink}
        style={{fill: ink}}
      >Tech</text>

      {/* Ligne déco pointillée sous Tech */}
      <line x1="144" y1="43" x2="210" y2="43"
        stroke={acc} strokeWidth="1" opacity="0.35"
        strokeDasharray="3 3"/>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// WINDOW CHROME — macOS-style title bar per section
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
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
    { name:"Vue.js",     icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
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
  { date:"Mai - Novembre 2025", icon:"briefcase", title:"Informaticien Stagiaire", company:"Mairie d'Agboville",
    items:["Maintenance du parc informatique et du réseau","Support technique aux utilisateurs","Contribution à la gestion et à la numérisation des données","Appui à la création d'outils numériques internes"] },
  { date:"2023-2024", icon:"laptop-code", title:"Projet Académique – ARTICI", company:"UVCI",
    items:["Plateforme web de promotion de l'artisanat local","Travail collaboratif en équipe pluridisciplinaire","Optimisation des performances","Intégration de bonnes pratiques de sécurité"] },
  { date:"2023-2024", icon:"graduation-cap", title:"Licence en Réseau et Sécurité Informatique", company:"UVCI",
    desc:"Formation complète en développement web, bases de données et sécurité des applications.", tags:["Certification E-Banking","Réf: CC/24-002485"] },
  { date:"2020-2021", icon:"school", title:"Baccalauréat Série D", company:"Lycée Moderne d'Arrah", desc:"Mention : Assez Bien" },
];

// Project gradient fallbacks
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
];

// Couleurs badge selon mode : clair = chaud, sombre = neon
const BADGE_LIGHT = {"en-ligne":"#C94B2A","demo":"#A0522D","en-cours":"#E06B2A"};
const BADGE_DARK  = {"en-ligne":"#00ff88","demo":"#ff4466","en-cours":"#ffaa00"};
const CAT_LABELS  = {all:"Tous","en-ligne":"En ligne","demo":"Démos","en-cours":"En cours"};

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════
function useInView(thr=0.1){
  const r=useRef(null); const [v,setV]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting) setV(true); },{threshold:thr});
    if(r.current) o.observe(r.current);
    return ()=>o.disconnect();
  },[thr]);
  return [r,v];
}

// ═══════════════════════════════════════════════════════════════
// MICRO-INTERACTIONS LAYER
// ═══════════════════════════════════════════════════════════════

// 1. useRipple — attach to any clickable
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

// MagBtn — drop-in button wrapper with ripple + glint
const MagBtn = ({ className='', onClick, children, ...rest }) => {
  const [ref, ripple] = useRipple();
  return (
    <button
      ref={ref}
      className={`mi-ripple-host mi-glint ${className}`}
      onClick={e => { ripple(e); onClick?.(e); }}
      {...rest}
    >{children}</button>
  );
};

// 2. TiltCard — wraps any card element
const TiltCard = ({ children, className='', style={}, onClick }) => {
  const ref = useRef(null);
  const onMove = useCallback(e => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    const mx = e.clientX ?? e.touches?.[0]?.clientX ?? cx;
    const my = e.clientY ?? e.touches?.[0]?.clientY ?? cy;
    const rx = ((my - cy) / (rect.height/2)) * -10;
    const ry = ((mx - cx) / (rect.width/2))  *  10;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);
  return (
    <div
      ref={ref} className={`mi-tilt ${className}`} style={style}
      onMouseMove={onMove} onMouseLeave={onLeave} onTouchMove={onMove} onTouchEnd={onLeave}
      onClick={onClick}
    >{children}</div>
  );
};

// 8. Spotlight — mouse-following radial glow layer
const SpotlightCard = ({ children, className='', style={} }) => {
  const ref = useRef(null);
  const layerRef = useRef(null);
  const onMove = useCallback(e => {
    const el = ref.current; if (!el || !layerRef.current) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    layerRef.current.style.background =
      `radial-gradient(320px circle at ${x}px ${y}px, rgba(0,204,106,.10) 0%, transparent 70%)`;
  }, []);
  return (
    <div ref={ref} className={`mi-spotlight ${className}`} style={style} onMouseMove={onMove}>
      <div ref={layerRef} className="mi-spotlight-layer"/>
      {children}
    </div>
  );
};

// 9. useStagger — returns [ref, isVisible] and applies stagger class
function useStagger(thr=0.08){
  const [r,v] = useInView(thr);
  return [r, v];
}

// 4+9 combined: useReveal — single element fade-up on scroll
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

// 7. ProgressBar component
const ProgressBar = ({ value=0, label='', visible=false }) => {
  const fillRef = useRef(null);
  useEffect(()=>{
    if (fillRef.current) {
      fillRef.current.style.width = visible ? `${value}%` : '0%';
    }
  },[visible, value]);
  return (
    <div>
      <div className="mi-progress-row">
        {label && <span className="mi-progress-label">{label}</span>}
        <span className="mi-progress-val">{value}%</span>
      </div>
      <div className="mi-progress-track">
        <div ref={fillRef} className="mi-progress-fill"/>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PARTICLE CANVAS
// ═══════════════════════════════════════════════════════════════
const ParticleCanvas = ({global: isGlobal = false, light: isLight = false}) => {
  const cvRef = useRef(null);
  useEffect(()=>{
    const cv = cvRef.current; if(!cv) return;
    const ctx = cv.getContext('2d');
    let raf;
    // 🟢 Mode sombre = vert | 🟠 Mode clair = orange
    const COLORS = isLight
      ? ['#ff8c00','#ff6b00','#ffa533','#ffb347','#e65c00']   // oranges
      : ['#00ff88','#7EE787','#00e676','#69f0ae','#b9f6ca'];  // verts
    const CONN_COLOR = isLight ? '#ff8c00' : '#00ff88';

    const resize = () => { cv.width=cv.offsetWidth; cv.height=cv.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Suivi souris pour interaction curseur
    const mouse = { x: null, y: null };
    const onMouseMove = e => {
      const rect = cv.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = null; mouse.y = null; };
    cv.addEventListener('mousemove', onMouseMove);
    cv.addEventListener('mouseleave', onMouseLeave);
    // Pour particle-canvas--global qui couvre tout l'écran
    const globalMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    if (isGlobal) window.addEventListener('mousemove', globalMouseMove);

    const pts = Array.from({length:70},()=>({
      x: Math.random()*cv.width, y: Math.random()*cv.height,
      r: Math.random()*1+0.3,
      vx:(Math.random()-.5)*0.8, vy:(Math.random()-.5)*0.8,
      c: COLORS[Math.floor(Math.random()*COLORS.length)],
      a: Math.random()*.4+.15,
    }));

    const draw = () => {
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.forEach(p=>{
        // Interaction curseur — répulsion douce
        if (mouse.x !== null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 100) {
            const force = (100 - d) / 100;
            const angle = Math.atan2(dy, dx);
            p.vx -= Math.cos(angle) * force * 0.6;
            p.vy -= Math.sin(angle) * force * 0.6;
          }
        }
        // Limite de vitesse + friction légère
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 1.5) { p.vx = (p.vx/spd)*1.5; p.vy = (p.vy/spd)*1.5; }
        p.vx *= 0.995; p.vy *= 0.995;
        // Réinjection de drift si trop lent — garantit le mouvement permanent
        if (Math.abs(p.vx) < 0.15) p.vx += (Math.random()-.5)*0.25;
        if (Math.abs(p.vy) < 0.15) p.vy += (Math.random()-.5)*0.25;

        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>cv.width)  p.vx*=-1;
        if(p.y<0||p.y>cv.height) p.vy*=-1;
        // glow halo subtil
        ctx.save(); ctx.globalAlpha=p.a*.2;
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
        g.addColorStop(0,p.c); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*8,0,Math.PI*2); ctx.fill(); ctx.restore();
        // core dot
        ctx.globalAlpha=p.a; ctx.fillStyle=p.c;
        ctx.shadowBlur=8; ctx.shadowColor=p.c;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1; ctx.shadowBlur=0;
      });
      // connexions
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
        if(d<130){ ctx.globalAlpha=(1-d/130)*.15; ctx.strokeStyle=CONN_COLOR; ctx.lineWidth=.5;
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); ctx.globalAlpha=1; }
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',resize);
      if (isGlobal) window.removeEventListener('mousemove',globalMouseMove);
      cv.removeEventListener('mousemove',onMouseMove);
      cv.removeEventListener('mouseleave',onMouseLeave);
    };
  },[isLight]);
  return <canvas ref={cvRef} className={isGlobal ? "particle-canvas particle-canvas--global" : "particle-canvas"}/>
};

// ═══════════════════════════════════════════════════════════════
// CUSTOM ORANGE CURSOR
// ═══════════════════════════════════════════════════════════════
const CustomCursor = () => {
  const dotRef = useRef(null);
  useEffect(()=>{
    const dot = dotRef.current;
    if(!dot) return;
    const move = e => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; };
    const over = e => {
      if(e.target.closest('a,button,[role=button],.sk-m-card,.c3d-card,.c3d-arrow,.mob-arr'))
        dot.classList.add('cursor-hover');
      else dot.classList.remove('cursor-hover');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return ()=>{ window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
  },[]);
  return <div ref={dotRef} className="cursor-dot"/>;
};

// ═══════════════════════════════════════════════════════════════
// NOISE
// ═══════════════════════════════════════════════════════════════
const Noise = () => (
  <svg className="noise" xmlns="http://www.w3.org/2000/svg">
    <filter id="nf"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <rect width="100%" height="100%" filter="url(#nf)"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════════════════════════
const Loader = ({onDone}) => {
  const [pct,setPct]=useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setPct(p=>{
      const n=p+Math.random()*7+2;
      if(n>=100){clearInterval(t);setTimeout(onDone,400);return 100;}
      return n;
    }),75);
    return ()=>clearInterval(t);
  },[onDone]);
  return (
    <div className="loader">
      <Noise/>
      <div className="loader-inner">
        <div className="loader-logo"><AkafolioLogo size={44} dark={true} animate={true}/></div>
        <div className="loader-num">{Math.min(100,Math.round(pct))}<span>%</span></div>
        <div className="loader-bar"><div className="loader-fill" style={{width:`${pct}%`}}/></div>
        <div className="loader-name">AKA ELVIS · AKATECH</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// THEME TOGGLE BUTTON
// ═══════════════════════════════════════════════════════════════
const ThemeToggle = ({dark, onToggle}) => (
  <button className={`theme-toggle ${dark?'theme-toggle--dark':''}`} onClick={onToggle} title={dark?"Mode clair":"Mode sombre néon"}>
    {dark
      ? <><i className="fas fa-sun"/><span>Clair</span></>
      : <><i className="fas fa-moon"/><span>Néon</span></>}
  </button>
);

// ═══════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════
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
        if(window.scrollY>=s.offsetTop-120) setActive(s.id);
      });
    };
    window.addEventListener('scroll',fn);
    return ()=>window.removeEventListener('scroll',fn);
  },[]);
  const go=id=>{ setOpen(false); document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); };

  return (
    <>
      {/* Overlay drawer */}
      {open&&<div className="mob-overlay" onClick={()=>setOpen(false)}/>}

      {/* Navbar top */}
      <nav className={`nav ${scrolled?'nav--scrolled':''} ${dark?'nav--dark':''}`}>
        <div className="nav-logo" onClick={()=>go('home')}><AkafolioLogo size={34} dark={dark} animate={false} onClick={()=>go('home')}/></div>

        {/* Desktop links */}
        <div className="nav-links">
          {NAV_LINKS.map(l=>(
            <button key={l.id} className={`nav-link ${active===l.id?'nav-link--active':''}`} onClick={()=>go(l.id)}>{l.label}</button>
          ))}
          <ThemeToggle dark={dark} onToggle={onToggle}/>
        </div>

        {/* Mobile right — theme toggle + hamburger */}
        <div className="nav-mob-right">
          <ThemeToggle dark={dark} onToggle={onToggle}/>
          <button
            className={`nav-hamburger ${open?'nav-hamburger--open':''} ${dark?'nav-hamburger--dark':''}`}
            onClick={()=>setOpen(o=>!o)}
            aria-label="Menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mob-drawer ${open?'mob-drawer--open':''} ${dark?'mob-drawer--dark':''}`}>
        <div className="mob-drawer-header">
          <AkafolioLogo size={26} dark={dark} animate={false}/>
          <button className="mob-drawer-close" onClick={()=>setOpen(false)}>
            <i className="fas fa-times"/>
          </button>
        </div>
        <nav className="mob-drawer-nav">
          {NAV_LINKS.map((l,i)=>(
            <button key={l.id}
              className={`mob-drawer-link ${active===l.id?'mob-drawer-link--active':''}`}
              style={{animationDelay:`${i*0.06}s`}}
              onClick={()=>go(l.id)}>
              <span className="mob-drawer-num">0{i+1}</span>
              <span>{l.label}</span>
              <ArrowRight size={14}/>
            </button>
          ))}
        </nav>
        <div className="mob-drawer-footer">
          <a href="https://github.com/wthomasss06-stack" target="_blank" rel="noreferrer"><i className="fab fa-github"/></a>
          <a href="https://www.linkedin.com/in/m-bollo-aka-60a1b1340/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"/></a>
          <a href="mailto:wthomasss06@gmail.com"><i className="fas fa-envelope"/></a>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// ROCKET FLAMES
// ═══════════════════════════════════════════════════════════════
const RocketFlames = () => (
  <svg className="rocket-big-flames" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 100" style={{position:'absolute',bottom:'-70px',left:'50%',transform:'translateX(-50%)',width:'40px',height:'80px',pointerEvents:'none',zIndex:9999}}>
    {/* Core jet */}
    <ellipse cx="20" cy="10" rx="7" ry="14" fill="#FF5500" opacity="0.95">
      <animate attributeName="ry" values="14;20;11;18;14" dur=".18s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".95;1;.85;1;.95" dur=".22s" repeatCount="indefinite"/>
    </ellipse>
    {/* Mid flame */}
    <ellipse cx="20" cy="22" rx="5" ry="16" fill="#FF8C00" opacity="0.8">
      <animate attributeName="ry" values="16;22;12;20;16" dur=".22s" repeatCount="indefinite"/>
      <animate attributeName="cx"  values="20;19;21;20;20" dur=".15s" repeatCount="indefinite"/>
    </ellipse>
    {/* Tip flicker */}
    <ellipse cx="20" cy="38" rx="3" ry="12" fill="#FFD600" opacity="0.6">
      <animate attributeName="ry" values="12;18;8;16;12" dur=".25s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".6;.9;.4;.8;.6" dur=".2s" repeatCount="indefinite"/>
    </ellipse>
    {/* Side sparks L */}
    <circle cx="12" cy="18" r="2.5" fill="#FF5500" opacity="0.5">
      <animate attributeName="cy" values="18;30;18" dur=".3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".5;0;.5" dur=".3s" repeatCount="indefinite"/>
    </circle>
    {/* Side sparks R */}
    <circle cx="28" cy="20" r="2" fill="#FF8C00" opacity="0.5">
      <animate attributeName="cy" values="20;34;20" dur=".35s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".5;0;.5" dur=".35s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// SCROLL TOP ROCKET
// ═══════════════════════════════════════════════════════════════
const ScrollTop = ({dark}) => {
  const [vis,setVis]           = useState(false);
  const [launching,setLaunch]  = useState(false);
  const btnRef     = useRef(null);
  const audioCtx   = useRef(null);
  const engineRef  = useRef(null);

  useEffect(()=>{
    const fn = () => {
      const footer = document.querySelector('footer');
      if (footer) setVis(footer.getBoundingClientRect().top < window.innerHeight);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  },[]);

  // ── Contexte audio ──────────────────────────────────────────
  const getCtx = () => {
    if (!audioCtx.current || audioCtx.current.state === 'closed')
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
    return audioCtx.current;
  };

  const makeNoise = (ctx, loop=true) => {
    const sz  = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i=0; i<sz; i++) d[i] = Math.random()*2-1;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = loop;
    return src;
  };

  // ── HOVER : moteur qui tourne ────────────────────────────────
  const startEngine = () => {
    if (engineRef.current) return;
    try {
      const ctx = getCtx(); const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(1, now+0.25);
      master.connect(ctx.destination);

      // Couche 1 : grondement grave
      const ng = makeNoise(ctx); const fg = ctx.createBiquadFilter();
      fg.type='lowpass'; fg.frequency.value=140; fg.Q.value=0.9;
      const gg = ctx.createGain(); gg.gain.value=0.55;
      ng.connect(fg); fg.connect(gg); gg.connect(master); ng.start();

      // Couche 2 : jet médium
      const nj = makeNoise(ctx); const fj = ctx.createBiquadFilter();
      fj.type='bandpass'; fj.frequency.value=480; fj.Q.value=0.7;
      const gj = ctx.createGain(); gj.gain.value=0.40;
      nj.connect(fj); fj.connect(gj); gj.connect(master); nj.start();

      // Couche 3 : sifflement haute pression
      const nh = makeNoise(ctx); const fh = ctx.createBiquadFilter();
      fh.type='highpass'; fh.frequency.value=1800;
      const gh = ctx.createGain(); gh.gain.value=0.18;
      nh.connect(fh); fh.connect(gh); gh.connect(master); nh.start();

      // Couche 4 : rumble tonique avec LFO
      const osc = ctx.createOscillator(); osc.type='sawtooth'; osc.frequency.value=48;
      const lfo = ctx.createOscillator(); lfo.type='sine'; lfo.frequency.value=3.5;
      const lg  = ctx.createGain(); lg.gain.value=7;
      lfo.connect(lg); lg.connect(osc.frequency); lfo.start();
      const ws = ctx.createWaveShaper();
      const cv = new Float32Array(512);
      for (let i=0;i<512;i++){const x=(i*2)/512-1; cv[i]=(3+200)*x/(Math.PI+200*Math.abs(x));}
      ws.curve=cv; ws.oversample='4x';
      const og = ctx.createGain(); og.gain.value=0.32;
      osc.connect(ws); ws.connect(og); og.connect(master); osc.start();

      // Couche 5 : sub
      const sub = ctx.createOscillator(); sub.type='sine'; sub.frequency.value=28;
      const sg  = ctx.createGain(); sg.gain.value=0.38;
      sub.connect(sg); sg.connect(master); sub.start();

      engineRef.current = { master, nodes:[ng,nj,nh,osc,lfo,sub] };
    } catch(e){}
  };

  const stopEngine = () => {
    if (!engineRef.current) return;
    try {
      const ctx = getCtx(); const now = ctx.currentTime;
      const {master, nodes} = engineRef.current;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now+0.3);
      setTimeout(()=>{ nodes.forEach(n=>{try{n.stop();}catch(_){}}); engineRef.current=null; }, 350);
    } catch(e){ engineRef.current=null; }
  };

  // ── CLICK : décollage (boom + whoosh + grondement) ───────────
  const playLaunch = () => {
    stopEngine();
    try {
      const ctx = getCtx(); const now = ctx.currentTime;

      // 1. BOOM d'allumage
      const boom = ctx.createOscillator(); boom.type='sine';
      boom.frequency.setValueAtTime(120,now);
      boom.frequency.exponentialRampToValueAtTime(22,now+0.18);
      const bg = ctx.createGain();
      bg.gain.setValueAtTime(0.7,now);
      bg.gain.exponentialRampToValueAtTime(0.001,now+0.22);
      boom.connect(bg); bg.connect(ctx.destination);
      boom.start(now); boom.stop(now+0.25);

      // 2. WHOOSH bruit qui sweep vers le haut
      const sz = Math.floor(ctx.sampleRate*2.2);
      const nb = ctx.createBuffer(1,sz,ctx.sampleRate);
      const nd = nb.getChannelData(0);
      for(let i=0;i<sz;i++) nd[i]=Math.random()*2-1;
      const ns = ctx.createBufferSource(); ns.buffer=nb;
      const wf = ctx.createBiquadFilter(); wf.type='bandpass';
      wf.frequency.setValueAtTime(100,now);
      wf.frequency.exponentialRampToValueAtTime(4000,now+1.8); wf.Q.value=1.0;
      const wg = ctx.createGain();
      wg.gain.setValueAtTime(0,now);
      wg.gain.linearRampToValueAtTime(0.65,now+0.06);
      wg.gain.setValueAtTime(0.65,now+0.5);
      wg.gain.exponentialRampToValueAtTime(0.001,now+2.2);
      ns.connect(wf); wf.connect(wg); wg.connect(ctx.destination);
      ns.start(now); ns.stop(now+2.2);

      // 3. GRONDEMENT moteur qui monte
      const ru = ctx.createOscillator(); ru.type='sawtooth';
      ru.frequency.setValueAtTime(60,now);
      ru.frequency.linearRampToValueAtTime(42,now+1.5);
      const rg = ctx.createGain();
      rg.gain.setValueAtTime(0,now);
      rg.gain.linearRampToValueAtTime(0.35,now+0.08);
      rg.gain.setValueAtTime(0.35,now+0.6);
      rg.gain.exponentialRampToValueAtTime(0.001,now+1.6);
      const rw = ctx.createWaveShaper();
      const rc = new Float32Array(256);
      for(let i=0;i<256;i++){const x=(i*2)/256-1; rc[i]=(Math.PI+180)*x/(Math.PI+180*Math.abs(x));}
      rw.curve=rc;
      ru.connect(rw); rw.connect(rg); rg.connect(ctx.destination);
      ru.start(now); ru.stop(now+1.6);
    } catch(e){}
  };

  const go = () => {
    playLaunch();
    setLaunch(true);
    // Particules de feu
    if (btnRef.current) {
      for (let i=0; i<8; i++) {
        const p = document.createElement('div');
        p.className = 'rocket-fire-particle';
        p.style.setProperty('--xo', `${(Math.random()-0.5)*30}px`);
        p.style.animationDelay = `${i*0.1}s`;
        btnRef.current.appendChild(p);
        setTimeout(()=>p.remove(), 1000);
      }
    }
    setTimeout(()=>{ window.scrollTo({top:0,behavior:'smooth'}); setTimeout(()=>setLaunch(false),800); },300);
  };

  return (
    <button
      ref={btnRef}
      className={`scroll-top ${vis?'scroll-top--vis':''} ${launching?'scroll-top--launch':''} ${dark?'scroll-top--dark':''}`}
      onClick={go}
      onMouseEnter={startEngine}
      onMouseLeave={stopEngine}
      title="Décollage vers le haut !"
    >
      <i className="fas fa-rocket"/>
      <div className="rocket-flame"/>
      {launching && <RocketFlames/>}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════
const Hero = ({dark}) => {
  const phrases=["Full-Stack","React & Python","Django & Flask","orienté produit"];
  const [wi,setWi]=useState(0); const [typed,setTyped]=useState(''); const [del,setDel]=useState(false); const [ch,setCh]=useState(0);

  // Horloge temps réel
  const [now, setNow] = useState(new Date());
  useEffect(()=>{
    const tick = setInterval(()=>setNow(new Date()), 1000);
    return ()=>clearInterval(tick);
  },[]);

  // Salutation selon l'heure
  const hour = now.getHours();
  const greeting = (hour >= 6 && hour < 18) ? 'Bonjour je suis' : 'Bonsoir je suis';

  // Formatage horloge : jj hh mn ss
  const DAYS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const pad = n => String(n).padStart(2,'0');
  const clockStr = `${DAYS[now.getDay()]} ${pad(now.getDate())} · ${pad(hour)}h ${pad(now.getMinutes())}mn ${pad(now.getSeconds())}s`;

  useEffect(()=>{
    const w=phrases[wi];
    const t=setTimeout(()=>{
      if(!del&&ch<w.length){setTyped(w.slice(0,ch+1));setCh(c=>c+1);}
      else if(!del&&ch===w.length) setTimeout(()=>setDel(true),1800);
      else if(del&&ch>0){setTyped(w.slice(0,ch-1));setCh(c=>c-1);}
      else if(del&&ch===0){setDel(false);setWi(i=>(i+1)%phrases.length);}
    },del?45:90);
    return ()=>clearTimeout(t);
  },[ch,del,wi]);

  return (
    <section id="home" className={`hero ${dark?'hero--dark':''}`}>

      <Noise/>
      <div className="hero-grid" aria-hidden>
        {Array.from({length:20}).map((_,i)=><div key={i} className="hgc"/>)}
      </div>
      <div className="hero-content">
        <div className="hero-eye">
          <span className="hero-dot"/>
          <span>Disponible — Abidjan, Côte d'Ivoire</span>
          <span className="hero-clock">{clockStr}</span>
        </div>
        <h1 className="hero-h1">
          <span className="hero-wave">{greeting} <Hand size={Math.min(28, 0.45*28)} style={{display:'inline',verticalAlign:'middle',marginLeft:'4px'}}/></span>
          <span className="hero-name">M'BOLLO<br/>AKA ELVIS</span>
        </h1>
        <p className="hero-typed">
          Développeur <span className="hero-word">{typed}</span><span className="cursor">|</span>
        </p>
        <p className="hero-desc">
          Développeur web orienté produits, spécialisé Django &amp; React.<br/>
          Je construis des applications pensées pour des usages réels.
        </p>
        <div className="hero-ctas">
          <MagBtn className={`btn ${dark?'btn--neon':'btn--primary'} mi-btn-grad-solid`} onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}>
            Voir mes projets <span>↗</span>
          </MagBtn>
          <a className={`btn ${dark?'btn--ghost-neon':'btn--ghost'} mi-glint`} href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" download>
            <i className="fas fa-download"/> Télécharger CV
          </a>
        </div>
        <div className="hero-stats mi-stagger mi-stagger--vis">
          {[["9+","Projets"],["2+","Années exp."],["5","En production"],["9+","Outils"]].map(([n,l])=>(
            <div key={l} className="hstat"><span className="hstat-n">{n}</span><span className="hstat-l">{l}</span></div>
          ))}
        </div>
      </div>
      <div className="hero-scroll"><span>scroll</span><div className="hsl"/></div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// MARQUEE
// ═══════════════════════════════════════════════════════════════
const Marquee = ({dark}) => {
  const words=["React","Django","Flask","Python","TypeScript","Tailwind","MySQL","Vercel","Node.js","Git","REST API","Bootstrap","JavaScript"];
  const d=[...words,...words];
  return (
    <div className={`marquee ${dark?'marquee--dark':''}`}>
      <div className="marquee-track">
        {d.map((w,i)=><span key={i} className="mw">{w}<span className="mdot">◆</span></span>)}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DERNIÈRE CRÉATION — ShopCI vitrine
// ═══════════════════════════════════════════════════════════════
const FeaturedCreation = ({dark}) => {
  const [ref,vis] = useInView(0.08);
  const proj = PROJECTS.find(p => p.id === 1);
  return (
    <section id="creations" ref={ref} className={`creations-section ${vis?'creations-section--vis':''} ${dark?'section--dark':''}`}>
      <WindowChrome title="Vitrine" dark={dark}/>
      <div className={`s-hd ${dark?'s-hd--dark':''}`}>
        <h2 className="s-ttl">Dernière<br/>création.</h2>
      </div>
      <div className="cr-showcase">
        <div className="cr-mockups">
          <div className="cr-desktop-wrap">
            <div className="cr-desktop-shell">
              <div className="cr-desktop-bar">
                <span className="cr-dot cr-dot--r"/><span className="cr-dot cr-dot--y"/><span className="cr-dot cr-dot--g"/>
                <span className="cr-bar-url">shop-ci.vercel.app</span>
              </div>
              <div className="cr-desktop-screen">
                <img src={proj.image} alt="ShopCI desktop" className="cr-screen-img"
                  onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}}/>
                <div className="cr-screen-ph" style={{display:'none'}}><i className="fas fa-desktop"/></div>
              </div>
            </div>
          </div>
          <div className="cr-mobile-wrap">
            <div className="cr-mobile-shell">
              <div className="cr-mobile-notch"/>
              <div className="cr-mobile-screen">
                <img src="/assets/images/projects/shopci-responsive.jpg" alt="ShopCI mobile" className="cr-screen-img"
                  onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}}/>
                <div className="cr-screen-ph cr-screen-ph--sm" style={{display:'none'}}><i className="fas fa-mobile-alt"/></div>
              </div>
              <div className="cr-mobile-home"/>
            </div>
            <div className="cr-resp-badge"><i className="fas fa-check-circle"/> 100% Responsive</div>
          </div>
          <div className="cr-glow"/>
        </div>
        <div className="cr-info">
          <div>
            <h3 className="cr-title">ShopCI</h3>
            <p className="cr-sub">Marketplace E-commerce</p>
          </div>
          <div className="cr-meta-block">
            <div className="cr-meta-row"><span className="cr-ml">Type</span><span className="cr-mv">Application Web</span></div>
            <div className="cr-meta-row"><span className="cr-ml">Mon rôle</span><span className="cr-mv">Conception et développement</span></div>
          </div>
          <div className="cr-tags">{proj.tech.map(t=><span key={t} className="cr-tag">{t}</span>)}</div>
          <p className="cr-desc">{proj.description}</p>
          <a href={proj.url} target="_blank" rel="noreferrer" className={`btn ${dark?'btn--neon':'btn--primary'} cr-cta mi-glint`}>
            <i className="fas fa-external-link-alt"/> Voir le site
          </a>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// PRICING TABS — pill toggle (style capture)
// ═══════════════════════════════════════════════════════════════
const LUCIDE_TAB_ICONS = { Globe, ShoppingCart, Cpu, Star };

const TAB_SUBTITLES = {
  vitrine:   "Pour présenter votre activité avec élégance.",
  ecommerce: "Pour vendre en ligne et gérer vos commandes.",
  saas:      "Pour des applications web complètes sur-mesure.",
  portfolio: "Pour mettre en valeur vos réalisations.",
};

const PricingTabs = ({dark}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [mobCard,   setMobCard]   = useState(0);
  const [animKey,   setAnimKey]   = useState(0);
  const pillRef  = useRef(null);
  const btnRefs  = useRef([]);
  const tab = PRICING_TABS[activeTab];

  // Move the sliding pill indicator
  useEffect(() => {
    const pill = pillRef.current;
    const btn  = btnRefs.current[activeTab];
    if (!pill || !btn) return;
    const parent = btn.parentElement.getBoundingClientRect();
    const r      = btn.getBoundingClientRect();
    pill.style.width  = `${r.width}px`;
    pill.style.height = `${r.height}px`;
    pill.style.transform = `translateX(${r.left - parent.left}px)`;
  }, [activeTab]);

  const switchTab = (i) => {
    setActiveTab(i);
    setMobCard(0);
    setAnimKey(k => k + 1);
  };

  const PricingCard = ({ p, isMob }) => (
    <div className={`ptabs2-card ${p.isPopular ? 'ptabs2-card--pop' : ''} ${dark ? 'ptabs2-card--dark' : ''}`}>
      {p.isPopular && (
        <div className={`ptabs2-pop-banner ${dark ? 'ptabs2-pop-banner--dark' : ''}`}>
          <Star size={11} strokeWidth={2.5}/> LE PLUS POPULAIRE
        </div>
      )}
      <div className="ptabs2-card-body">
        <div className="ptabs2-badge">{p.badge}</div>
        <p className="ptabs2-tagline">{TAB_SUBTITLES[tab.key] || ''}</p>
        <div className={`ptabs2-price ${dark ? 'ptabs2-price--dark' : ''}`}>
          <span className="ptabs2-amount">{p.price.replace(' FCFA','')}</span>
          <span className="ptabs2-currency"> FCFA</span>
        </div>
        <p className="ptabs2-delivery"><i className="fas fa-clock"/> Livraison : {p.delivery}</p>
        <ul className="ptabs2-feat">
          {p.features.map((f, fi) => (
            <li key={fi}>
              <span className={`ptabs2-check ${dark ? 'ptabs2-check--dark' : ''}`}><Check size={11} strokeWidth={3}/></span>
              {f}
            </li>
          ))}
        </ul>
        <MagBtn
          className={`btn ${dark ? 'btn--neon' : 'btn--primary'} btn--full mi-glint ptabs2-cta`}
          onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>
          Me contacter <ArrowRight size={14}/>
        </MagBtn>
      </div>
    </div>
  );

  return (
    <div className={`ptabs2 ${dark ? 'ptabs2--dark' : ''}`}>

      {/* ── Pill toggle ── */}
      <div className={`ptabs2-toggle-wrap ${dark ? 'ptabs2-toggle-wrap--dark' : ''}`}>
        <div className={`ptabs2-toggle ${dark ? 'ptabs2-toggle--dark' : ''}`}>
          {/* Sliding indicator */}
          <span ref={pillRef} className={`ptabs2-pill ${dark ? 'ptabs2-pill--dark' : ''}`}/>
          {PRICING_TABS.map((t, i) => {
            const Icon = LUCIDE_TAB_ICONS[t.icon];
            return (
              <button
                key={t.key}
                ref={el => btnRefs.current[i] = el}
                className={`ptabs2-tab ${i === activeTab ? 'ptabs2-tab--active' : ''} ${dark ? 'ptabs2-tab--dark' : ''}`}
                onClick={() => switchTab(i)}>
                {Icon && <Icon size={14} strokeWidth={2}/>}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Cards grid (desktop) ── */}
      <div key={animKey} className="ptabs2-grid ptabs2-desk">
        {tab.plans.map((p, i) => <PricingCard key={i} p={p}/>)}
      </div>

      {/* ── Carousel (mobile) ── */}
      <div className="ptabs2-mob">
        <PricingCard p={tab.plans[mobCard]}/>
        <div className="mob-nav">
          <button className="mob-arr" onClick={() => setMobCard(i => (i - 1 + tab.plans.length) % tab.plans.length)}>
            <i className="fas fa-chevron-left"/>
          </button>
          <div className="mob-dots">
            {tab.plans.map((_, i) => (
              <button key={i} className={`mob-dot${i === mobCard ? ' mob-dot--on' : ''}`} onClick={() => setMobCard(i)}/>
            ))}
          </div>
          <button className="mob-arr" onClick={() => setMobCard(i => (i + 1) % tab.plans.length)}>
            <i className="fas fa-chevron-right"/>
          </button>
        </div>
      </div>

      <p className={`ptabs-note ${dark ? 'ptabs-note--dark' : ''}`}>
        <i className="fas fa-info-circle"/> Chaque projet étant unique, les tarifs peuvent varier selon les fonctionnalités demandées.
      </p>
    </div>
  );
};



// ═══════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════

const Services = ({dark}) => {
  const [ref,vis] = useInView();
  const [svcIdx, setSvcIdx] = useState(0);

  return (
    <section id="services" ref={ref} className={dark?'section--dark':''}>
      <WindowChrome title="Services & Tarifs" dark={dark}/>
      <div className={`s-hd ${dark?'s-hd--dark':''}`}>
        <h2 className="s-ttl">Ce que je<br/>fais bien.</h2>
      </div>

      {/* Desktop — grille originale inchangée */}
      <div className={`svc-grid ${vis?'anim':''} svc-desk mi-stagger ${vis?'mi-stagger--vis':''}`}>
        {SERVICES.map((s,i)=>(
          <TiltCard key={i} className="svc-card" style={{animationDelay:`${i*0.08}s`}}>
            <SpotlightCard className="svc-spotlight-inner" style={{height:'100%',width:'100%'}}>
            <div className="svc-top"><span className="svc-n">{s.n}</span><div className="svc-ico mi-pulse"><i className={`fas fa-${s.icon}`}/></div></div>
            <h3 className="svc-title">{s.title}</h3>
            <p className="svc-desc">{s.desc}</p>
            <ul className="svc-feat">{SERVICES[i].features.map((f,fi)=><li key={fi}><span>→</span>{f}</li>)}</ul>
            </SpotlightCard>
          </TiltCard>
        ))}
      </div>

      {/* Mobile — une carte visible à la fois, rendu pricing-card */}
      <div className="svc-mob">
        <div className="pricing-grid" style={{gridTemplateColumns:'1fr',background:'none',border:'none',gap:'0'}}>
          <div className="pricing-card">
            <div className="svc-top" style={{marginBottom:'8px'}}>
              <span className="svc-n">{SERVICES[svcIdx].n}</span>
              <div className="svc-ico"><i className={`fas fa-${SERVICES[svcIdx].icon}`}/></div>
            </div>
            <h3 className="pricing-title">{SERVICES[svcIdx].title}</h3>
            <p className="pricing-desc">{SERVICES[svcIdx].desc}</p>
            <ul className="pricing-feat">
              {SERVICES[svcIdx].features.map((f,fi)=><li key={fi}><Check size={13} strokeWidth={2.5}/>{f}</li>)}
            </ul>
          </div>
        </div>
        <div className="mob-nav">
          <button className="mob-arr" onClick={()=>setSvcIdx(i=>(i-1+SERVICES.length)%SERVICES.length)}><i className="fas fa-chevron-left"/></button>
          <div className="mob-dots">{SERVICES.map((_,i)=><button key={i} className={`mob-dot${i===svcIdx?' mob-dot--on':''}`} onClick={()=>setSvcIdx(i)}/>)}</div>
          <button className="mob-arr" onClick={()=>setSvcIdx(i=>(i+1)%SERVICES.length)}><i className="fas fa-chevron-right"/></button>
        </div>
      </div>

      {/* TARIFS */}
      <div className={`s-hd ${dark?'s-hd--dark':''}`} style={{marginTop:'60px'}}>
        <span className="s-lbl">Tarifs</span>
        <h2 className="s-ttl" style={{fontSize:'clamp(24px,3.5vw,44px)'}}>Mes offres.</h2>
      </div>

      <PricingTabs dark={dark}/>

    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// ABOUT + TIMELINE
// ═══════════════════════════════════════════════════════════════
const About = ({dark}) => {
  const [r1,v1]=useInView(); const [r2,v2]=useInView();
  return (
    <>
      <section id="about" ref={r1} className={dark?'section--dark':''}>
        <WindowChrome title="À propos" dark={dark}/>
        <div className={`s-hd ${dark?'s-hd--dark':''}`}>
          <h2 className="s-ttl">Alors,<br/>c'est moi.</h2>
        </div>
        <SpotlightCard className={`about-grid ${v1?'anim':''} mi-stagger ${v1?'mi-stagger--vis':''}`}>
          <div className="about-left">
            <div className={`about-quote ${dark?'about-quote--dark':''}`}>
              <p>"Ce n'est pas important de réussir du premier coup. L'essentiel est de réussir au final."</p>
              <span>— Kevin Ressegaire</span>
            </div>
            <div className="about-img-wrap">
              <img src="/assets/images/IMG_20250124_124101KK.jpg" alt="Elvis M'Bollo" className="about-img"/>
              <div className="about-badges">
                <span><i className="fas fa-code"/> Pro</span>
                <span><i className="fas fa-lightbulb"/> Créatif</span>
                <span><i className="fas fa-eye"/> Curieux</span>
              </div>
            </div>
          </div>
          <div className="about-right">
            <h3>Développeur Web Full-Stack</h3>
            <p>Développeur web formé en <strong>Réseau et Sécurité Informatique</strong>, je développe des applications web complètes en combinant front-end moderne et back-end Python.</p>
            <p>J'utilise principalement <strong>Python, MySQL et React</strong> pour concevoir des solutions claires, maintenables et adaptées aux usages réels. La sécurité applicative est intégrée dès la conception.</p>
            <p>Mon expérience en <strong>support informatique</strong> à la Mairie d'Agboville m'a apporté une approche pragmatique et orientée résolution de problèmes.</p>
            <div className={`about-tags ${dark?'about-tags--dark':''}`}>
              {["Esprit d'équipe","Créativité","Rigueur","Adaptabilité","Innovation"].map(t=><span key={t}>{t}</span>)}
            </div>
            <MagBtn className={`btn ${dark?'btn--neon':'btn--primary'} mi-glint`} onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Disponible pour opportunités →</MagBtn>
          </div>
        </SpotlightCard>
      </section>
      <section id="experience" ref={r2} className={dark?'section--dark':''}>
        <WindowChrome title="Parcours" dark={dark}/>
        <div className={`s-hd ${dark?'s-hd--dark':''}`}>
          <h2 className="s-ttl">Expérience &amp;<br/>Formation.</h2>
        </div>
        <div className={`timeline ${v2?'anim':''} ${dark?'timeline--dark':''} mi-stagger ${v2?'mi-stagger--vis':''}`}>
          {TIMELINE.map((item,i)=>(
            <div key={i} className="tl-item" style={{animationDelay:`${i*0.12}s`}}>
              <div className="tl-dot mi-pulse"><i className={`fas fa-${item.icon}`}/></div>
              <div className="tl-body">
                <span className="tl-date"><i className="far fa-calendar-alt"/> {item.date}</span>
                <h4 className="tl-title">{item.title}</h4>
                <p className="tl-company"><i className="fas fa-building"/> {item.company}</p>
                {item.desc&&<p className="tl-desc">{item.desc}</p>}
                {item.items&&<ul className="tl-list">{item.items.map((li,j)=><li key={j}>{li}</li>)}</ul>}
                {item.tags&&<div className="tl-tags">{item.tags.map(t=><span key={t}>{t}</span>)}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className={`cta-band ${dark?'cta-band--neon':''}`}>
          <h3>Intéressé par mon profil ?</h3>
          <p>N'hésitez pas à me contacter pour discuter de vos projets ou opportunités.</p>
          <div className="cta-btns">
            <MagBtn className={`btn ${dark?'btn--neon':'btn--cta-light'} mi-glint`} onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}><i className="fas fa-paper-plane"/> Me contacter</MagBtn>
            <a className={`btn ${dark?'btn--ghost-neon':'btn--cta-ghost-light'} mi-glint`} href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" download><i className="fas fa-download"/> Télécharger CV</a>
          </div>
        </div>
      </section>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3D GLASSMORPHISM CAROUSEL
// ═══════════════════════════════════════════════════════════════
const Carousel3D = ({items, dark}) => {
  const [active,setActive]=useState(0);
  const isDrag=useRef(false); const dragX=useRef(0);
  const autoRef=useRef(null);
  const total=items.length;

  const resetAuto=useCallback(()=>{
    clearInterval(autoRef.current);
    autoRef.current=setInterval(()=>setActive(p=>(p+1)%total),4500);
  },[total]);

  useEffect(()=>{ resetAuto(); return ()=>clearInterval(autoRef.current); },[resetAuto]);
  useEffect(()=>setActive(0),[items]);

  const go=useCallback(dir=>{ setActive(p=>(p+dir+total)%total); resetAuto(); },[total,resetAuto]);

  useEffect(()=>{
    const fn=e=>{ if(e.key==='ArrowRight')go(1); if(e.key==='ArrowLeft')go(-1); };
    window.addEventListener('keydown',fn); return ()=>window.removeEventListener('keydown',fn);
  },[go]);

  const onDS=e=>{ dragX.current=e.clientX??e.touches?.[0]?.clientX; isDrag.current=true; };
  const onDE=e=>{
    if(!isDrag.current)return;
    const dx=(e.clientX??e.changedTouches?.[0]?.clientX)-dragX.current;
    if(Math.abs(dx)>48) go(dx<0?1:-1);
    isDrag.current=false;
  };

  const cardStyle=pos=>{
    const abs=Math.abs(pos);
    if(abs>2) return {display:'none'};
    const tx=pos*clampedPct(300);
    return {
      transform:`translateX(${tx}px) translateZ(${-(abs*110)}px) rotateY(${pos*-14}deg) scale(${pos===0?1:abs===1?.80:.60})`,
      opacity:pos===0?1:abs===1?.55:.25,
      zIndex:10-abs,
      transition:'all .55s cubic-bezier(.25,.46,.45,.94)',
      pointerEvents:pos===0?'all':'none',
    };
  };

  return (
    <>
    <div className={`c3d-root ${dark?'':'c3d-root--dark'}`}
      onMouseDown={onDS} onMouseUp={onDE} onTouchStart={onDS} onTouchEnd={onDE}>
      {/* Window chrome */}
      <WindowChrome title="Réalisations récentes" dark={dark} inner/>
      {/* Stage */}
      <div className="c3d-stage">
        <div className="c3d-perspective">
          {items.map((proj,i)=>{
            const pos=((i-active+total)%total+total)%total;
            const rel=pos>total/2?pos-total:pos;
            const neon = dark
              ? (BADGE_DARK[proj.cat]||'#00ff88')
              : (BADGE_LIGHT[proj.cat]||'#C94B2A');
            const neonBg = dark ? neon+'14' : neon+'18';
            const neonBorder = dark ? neon+'44' : neon+'55';
            return (
              <div key={proj.id} className={`c3d-card ${rel===0?'c3d-card--active':''}`}
                style={cardStyle(rel)}
                onClick={()=>rel!==0&&go(rel>0?1:-1)}>

                {/* Image zone */}
                <div className="c3d-img-zone" style={{background:GRAD[(proj.id-1)%GRAD.length]}}>
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="c3d-img"
                    onError={e=>{e.target.style.display='none';}}
                  />
                  <div className="c3d-img-overlay" style={{background:`linear-gradient(to bottom, transparent 30%, rgba(0,0,0,.85) 100%)`}}/>
                  {proj.cat==='en-ligne'&&(
                    <div className="c3d-live"><span className="c3d-live-dot"/><span>EN LIGNE</span></div>
                  )}
                </div>

                {/* Glassmorphism content */}
                <div className="c3d-glass">
                  <div className="c3d-glass-top">
                    <span className="c3d-num">#{String(proj.id).padStart(2,'0')}</span>
                    <span className="c3d-badge" style={{color:neon,borderColor:neonBorder,background:neonBg}}>{CAT_LABELS[proj.cat]}</span>
                  </div>
                  <h3 className="c3d-title">{proj.title}</h3>
                  <p className="c3d-sub">{proj.subtitle}</p>
                  <p className="c3d-desc">{proj.description}</p>
                  {proj.stats&&(
                    <div className="c3d-stats">
                      {proj.stats.slice(0,3).map((s,si)=>(
                        <span key={si} style={{color:neon,borderColor:neonBorder,background:neonBg}}>
                          <i className={`fas fa-${s.icon}`}/>{s.label}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="c3d-footer">
                    <div className="c3d-techs">
                      {proj.tech.slice(0,3).map(t=><span key={t}>{t}</span>)}
                    </div>
                    {proj.url&&(
                      <a
                        href={proj.url}
                        target={proj.url.startsWith('http')?'_blank':'_self'}
                        rel="noreferrer"
                        className="c3d-link"
                        onClick={e=>e.stopPropagation()}>
                        {proj.cat==='demo'
                          ?<><i className="fas fa-play-circle"/>Démo</>
                          :<><i className="fas fa-external-link-alt"/>Voir le site</>}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      <button className="c3d-arrow c3d-arrow--l" onClick={()=>go(-1)}><i className="fas fa-chevron-left"/></button>
      <button className="c3d-arrow c3d-arrow--r" onClick={()=>go(1)}><i className="fas fa-chevron-right"/></button>
    </div>

    {/* Nav bar — outside root so it never covers links */}
    <div className="c3d-nav">
      <span className="c3d-counter"><span className="c3d-counter-num">{String(active+1).padStart(2,'0')}</span>/{String(total).padStart(2,'0')}</span>
      <div className="c3d-dots">
        {items.map((_,i)=><button key={i} className={`c3d-dot ${i===active?'c3d-dot--active':''}`} onClick={()=>{setActive(i);resetAuto();}}/>)}
      </div>
      <span className="c3d-hint">← glissez ou ←→</span>
    </div>
    </>
  );
};

// viewport-aware translation clamp
function clampedPct(base){
  if(typeof window==='undefined') return base;
  return Math.min(base, window.innerWidth*0.3);
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS SECTION
// ═══════════════════════════════════════════════════════════════
const Projects = ({dark}) => {
  const [filter,setFilter]=useState('all');
  const filtered=filter==='all'?PROJECTS:PROJECTS.filter(p=>p.cat===filter);
  const count=k=>k==='all'?PROJECTS.length:PROJECTS.filter(p=>p.cat===k).length;

  const pillRef  = useRef(null);
  const btnRefs  = useRef([]);
  const keys = Object.keys(CAT_LABELS);

  // Move sliding pill to active button
  useEffect(()=>{
    const pill = pillRef.current;
    const idx  = keys.indexOf(filter);
    const btn  = btnRefs.current[idx];
    if(!pill || !btn) return;
    const parent = btn.parentElement.getBoundingClientRect();
    const r      = btn.getBoundingClientRect();
    pill.style.width     = `${r.width}px`;
    pill.style.height    = `${r.height}px`;
    pill.style.transform = `translateX(${r.left - parent.left}px)`;
  },[filter]);

  return (
    <section id="projects" className={`projects-section ${dark?'projects-section--dark':''}`}>
      <WindowChrome title="Projets" dark={dark}/>
      <div className={`s-hd ${dark?'s-hd--dark':''}`}>
        <h2 className="s-ttl">Réalisations<br/>récentes.</h2>
      </div>

      {/* ── Pill toggle filtre ── */}
      <div className="pf-toggle-wrap">
        <div className={`pf-toggle ${dark?'pf-toggle--dark':''}`}>
          <span ref={pillRef} className={`pf-pill ${dark?'pf-pill--dark':''}`}/>
          {Object.entries(CAT_LABELS).map(([k,v],i)=>(
            <button
              key={k}
              ref={el=>btnRefs.current[i]=el}
              className={`pf-tab ${filter===k?'pf-tab--active':''} ${dark?'pf-tab--dark':''}`}
              onClick={()=>setFilter(k)}>
              {v}
              <span className={`pf-count ${filter===k?'pf-count--active':''} ${dark?'pf-count--dark':''}`}>
                {count(k)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Carousel3D key={filter} items={filtered} dark={dark}/>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// SKILLS — DARK NEON section always dark bg
// ═══════════════════════════════════════════════════════════════
const SkillBand = ({title,icon,items,dir,dark})=>(
  <div className="sk-row">
    <div className="sk-row-lbl"><i className={`fas fa-${icon}`}/>{title}</div>
    <div className="sk-wrap">
      <div className={`sk-band sk-band--${dir}`}>
        {[...items,...items,...items].map((sk,i)=>(
          <div key={i} className="sk-item">
            <img src={sk.icon} alt={sk.name}
              style={dark&&(sk.icon.includes('flask')||sk.icon.includes('django')||sk.icon.includes('github')||sk.icon.includes('vercel'))?{filter:'brightness(0) invert(1)'}:{}}/>
            <span>{sk.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Skills = ({dark}) => {
  const [ref,vis]=useInView();
  const master=[...SKILLS.frontend.slice(0,4),...SKILLS.backend.slice(0,3)];
  return (
    <section id="skills" className="skills-section" ref={ref}>

      <div className="skills-inner">
        <WindowChrome title="Skills" dark={dark}/>
        <div className={`s-hd ${dark?'s-hd--dark':''}`}>
          <h2 className="s-ttl">Mes outils<br/>de travail.</h2>
        </div>

        {/* ── Maîtrise principale CENTRÉ ── */}
        <div className="sk-mastery-wrap">
          <div className="sk-label-tag"><span>//</span> maîtrise principale</div>
          <div className={`sk-mastery ${vis?'anim':''} mi-stagger ${vis?'mi-stagger--vis':''}`}>
            {master.map((sk,i)=>(
              <TiltCard key={i} className="sk-m-card" style={{animationDelay:`${i*0.07}s`}}>
                <div className="sk-m-glow"/>
                <img src={sk.icon} alt={sk.name}
                  style={dark&&(sk.icon.includes('flask')||sk.icon.includes('django'))?{filter:'brightness(0) invert(1)'}:{}}/>
                <span>{sk.name}</span>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── Bandes carrousel ── */}
        <div className="sk-bands">
          <SkillBand title="Frontend"    icon="laptop-code" items={SKILLS.frontend} dir="left"  dark={dark}/>
          <SkillBand title="Backend"     icon="server"      items={SKILLS.backend}  dir="right" dark={dark}/>
          <SkillBand title="Outils & IA" icon="tools"       items={SKILLS.tools}    dir="left"  dark={dark}/>
          <SkillBand title="Autres"      icon="plus-circle" items={SKILLS.autres}   dir="right" dark={dark}/>
        </div>

        <div className={`cta-band ${dark?'cta-band--neon':''}`}>
          <h3>Besoin de ces compétences ?</h3>
          <p>Mettons mes compétences au service de votre projet. Discutons-en !</p>
          <div className="cta-btns">
            <MagBtn className={`btn ${dark?'btn--neon':'btn--cta-light'} mi-glint`} onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}><i className="fas fa-paper-plane"/> Me contacter</MagBtn>
            <MagBtn className={`btn ${dark?'btn--ghost-neon':'btn--cta-ghost-light'} mi-glint`} onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}><i className="fas fa-eye"/> Voir mes projets</MagBtn>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════
const Contact = ({dark}) => {
  const [ref,vis]=useInView();
  const [form,setForm]=useState({name:'',email:'',projectType:'',message:''});
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);
  const onChange=e=>setForm(f=>({...f,[e.target.id]:e.target.value}));
  const onSubmit=async e=>{
    e.preventDefault(); setSending(true);
    try{
      await fetch('https://formsubmit.co/ajax/wthomasss06@gmail.com',{method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({name:form.name,email:form.email,'Type de projet':form.projectType,message:form.message,
          _subject:`🚀 Nouveau contact : ${form.name}`,_template:'table',_captcha:'false'})});
      setSent(true); setForm({name:'',email:'',projectType:'',message:''});
    }catch{ alert('❌ Erreur. Contactez-moi sur WhatsApp : +225 01 42 50 77 50'); }
    finally{ setSending(false); }
  };
  return (
    <section id="contact" ref={ref} className={dark?'section--dark':''}>
      <WindowChrome title="Contact" dark={dark}/>
      <div className={`s-hd ${dark?'s-hd--dark':''}`}>
        <h2 className="s-ttl">Transformons<br/>votre idée.</h2>
      </div>
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
          <div className="contact-infos">
            <a href="tel:+2250142507750" className="cinfo"><i className="fas fa-phone"/><div><b>Téléphone</b><span>+225 01 42 50 77 50</span></div></a>
            <a href="mailto:wthomasss06@gmail.com" className="cinfo"><i className="fas fa-envelope"/><div><b>Email</b><span>wthomasss06@gmail.com</span></div></a>
            <a href="mailto:aka.mbollo@uvci.edu.ci" className="cinfo"><i className="fas fa-envelope"/><div><b>Email UVCI</b><span>aka.mbollo@uvci.edu.ci</span></div></a>
            <div className="cinfo"><i className="fas fa-map-marker-alt"/><div><b>Localisation</b><span>Abidjan, Côte d'Ivoire</span></div></div>
          </div>
          <div className="contact-socials">
            <a href="https://github.com/wthomasss06-stack" target="_blank" rel="noreferrer"><i className="fab fa-github"/></a>
            <a href="https://www.linkedin.com/in/m-bollo-aka-60a1b1340/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"/></a>
          </div>
          <div className="contact-cv">
            <div className="cv-qr"><img src="/assets/images/qrcodeCV.png" alt="QR Code CV"/></div>
            <div>
              <p><b>Télécharger mon CV</b></p>
              <p>Scannez le QR code ou cliquez</p>
              <a href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" className={`btn ${dark?'btn--neon':'btn--primary'} mi-glint`} download><i className="fas fa-download"/> Télécharger CV</a>
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
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════
const Footer = ({dark}) => (
  <footer className={`footer ${dark?'footer--dark':'footer--light'}`}>
    <div className="footer-inner">
      <div className="footer-logo"><AkafolioLogo size={52} dark={dark} animate={false}/></div>
      <div className="footer-mid">
        <p>© 2026 — M'Bollo Aka Elvis — Développeur Full-Stack</p>
        <p>Abidjan, Côte d'Ivoire</p>
      </div>
      <div className="footer-links">
        <a href="https://github.com/wthomasss06-stack" target="_blank" rel="noreferrer"><i className="fab fa-github"/></a>
        <a href="https://www.linkedin.com/in/m-bollo-aka-60a1b1340/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"/></a>
        <a href="mailto:wthomasss06@gmail.com"><i className="fas fa-envelope"/></a>
      </div>
    </div>
    
  </footer>
);

// ═══════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [loaded,setLoaded]=useState(false);
  const [light,setLight]=useState(false);

  // Persist theme — MODE SOMBRE PAR DEFAUT
  useEffect(()=>{
    const saved=localStorage.getItem('aka-theme');
    if(saved==='light') setLight(true);
  },[]);
  const toggleDark=()=>setLight(l=>{ localStorage.setItem('aka-theme',!l?'light':'dark'); return !l; });

  const dark = !light; // dark=true par défaut

  return !loaded ? (
    <Loader onDone={()=>setLoaded(true)}/>
  ) : (
    <div className={`app ${light?'app--light':''}`}>
      <CustomCursor/>
      <ParticleCanvas global light={light}/>
      <Navbar dark={dark} onToggle={toggleDark}/>
      <ScrollTop dark={dark}/>
      <main>
        <Hero dark={dark}/>
        <Marquee dark={dark}/>
        <FeaturedCreation dark={dark}/>
        <Services dark={dark}/>
        <About dark={dark}/>
        <Projects dark={dark}/>
        <Skills dark={dark}/>
        <Contact dark={dark}/>
      </main>
      <Footer dark={dark}/>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import useAnimations from './useAnimations'; 
// ============================================================
// DONNÉES STATIQUES
// ============================================================

const projectsData = [
  {
    id: 1,
    title: "ShopCI — Marketplace E-commerce",
    description: "Marketplace multi-vendeurs conçue pour répondre aux problèmes de fiabilité, de visibilité et de gestion des ventes dans le e-commerce local ivoirien.",
    category: "en-ligne",
    image: "/assets/images/projects/monmarket-preview.jpg",
    progress: 65,
    tech: ["React", "Django", "Bootstrap 5", "Vercel + PythonAnywhere"],
    liveUrl: "https://shop-ci.vercel.app/",
    isPremium: true,
    stats: [
      { icon: "users", label: "Multi-vendeurs" },
      { icon: "shopping-cart", label: "Panier temps réel" },
      { icon: "shield-alt", label: "Paiement sécurisé" }
    ]
  },
  {
    id: 2,
    title: "TechFlow — Site Vitrine Professionnel",
    description: "Site vitrine moderne destiné à présenter une activité technologique de manière claire et professionnelle.",
    category: "en-ligne",
    image: "/assets/images/projects/techflow-preview.jpg",
    progress: 97,
    tech: ["HTML / Tailwind CSS", "JavaScript", "Vercel"],
    liveUrl: "https://techflow-ten.vercel.app/",
    isPremium: true,
    stats: [
      { icon: "users", label: "Tailwind CSS" },
      { icon: "shopping-cart", label: "UI propre & responsive" },
      { icon: "shield-alt", label: "Déployé en production" }
    ]
  },
  {
    id: 3,
    title: "TerraSafe — Marketplace Foncière",
    description: "Plateforme foncière visant à réduire les risques d'arnaques liées à la vente de terrains. Backend sécurisé avec recherche avancée.",
    category: "en-ligne",
    image: "/assets/images/projects/terrasafe-preview.jpg",
    progress: 85,
    tech: ["Python/Flask", "MySQL", "JavaScript", "Bootstrap 5"],
    liveUrl: "https://wthomassss06.pythonanywhere.com",
    isPremium: true,
    stats: [
      { icon: "database", label: "MySQL + Flask" },
      { icon: "lock", label: "Auth sécurisée" },
      { icon: "search", label: "Recherche avancée" }
    ]
  },
  {
    id: 4,
    title: "chap-chapMAP — Navigation Intelligente",
    description: "Application de cartographie intelligente permettant de localiser un utilisateur en temps réel et de calculer des itinéraires optimisés.",
    category: "demo",
    image: "/assets/images/projects/chapchapmap-preview.jpg",
    progress: 100,
    tech: ["JavaScript", "Leaflet.js", "OSRM API", "Geolocation API"],
    demoUrl: "/demos/chap-chapMAP.html",
    stats: [
      { icon: "map-marked-alt", label: "API Leaflet" },
      { icon: "route", label: "Calcul itinéraires" },
      { icon: "location-arrow", label: "GPS temps réel" }
    ]
  },
  {
    id: 5,
    title: "ElvisMarket — Interface E-commerce",
    description: "Interface e-commerce développée pour expérimenter la gestion d'état, le panier dynamique et l'optimisation de l'UX.",
    category: "demo",
    image: "/assets/images/projects/elvismarket-preview.jpg",
    progress: 100,
    tech: ["HTML + JS vanilla", "Tailwind CSS", "LocalStorage"],
    demoUrl: "/demos/projet2.html",
    stats: [
      { icon: "shopping-bag", label: "Panier dynamique" },
      { icon: "filter", label: "Filtres avancés" },
      { icon: "mobile-alt", label: "Responsive" }
    ]
  },
  {
    id: 6,
    title: "MonCashJour — Gestion de Ventes",
    description: "Application de gestion de ventes quotidiennes destinée aux petits commerçants, avec visualisation des performances et export des données.",
    category: "demo",
    image: "/assets/images/projects/moncashjour-preview.jpg",
    progress: 100,
    tech: ["HTML + JS vanilla", "Tailwind CSS", "Chart.js"],
    demoUrl: "/demos/projet1.html",
    stats: [
      { icon: "chart-line", label: "Analytiques" },
      { icon: "file-export", label: "Export CSV" },
      { icon: "history", label: "Historique" }
    ]
  },
  {
    id: 7,
    title: "LivreurTrack Pro — Système de Suivi Logistique",
    description: "Système de suivi logistique simulant un workflow réel de livraison, avec validation par photo et suivi d'étapes.",
    category: "demo",
    image: "/assets/images/projects/livreurtrack-preview.jpg",
    progress: 100,
    tech: ["JavaScript", "Bootstrap 5", "LocalStorage", "Camera API"],
    demoUrl: "/demos/projet3.html",
    stats: [
      { icon: "tasks", label: "Workflow 5 étapes" },
      { icon: "camera", label: "Validation photo" },
      { icon: "history", label: "Historique complet" }
    ]
  },
  {
    id: 8,
    title: "LinkedIn Banner Pro — Générateur de bannières",
    description: "Outil SaaS en cours de développement permettant de générer des bannières LinkedIn professionnelles via un éditeur visuel.",
    category: "en-cours",
    image: "/assets/images/projects/linkedin-banner-preview.jpg",
    progress: 30,
    tech: ["JavaScript", "Canvas API", "Tailwind CSS"],
    demoUrl: "/demos/projet7.html",
    stats: [
      { icon: "paint-brush", label: "Éditeur visuel" },
      { icon: "eye", label: "Preview temps réel" },
      { icon: "download", label: "Export PNG" }
    ]
  },
  {
    id: 9,
    title: "Tati — Portfolio & Vitrine Moderne",
    description: "Portfolio personnel double fonction : vitrine professionnelle et page de présentation. Animations fluides, thème sombre/clair, design 100% responsive et identité visuelle soignée.",
    category: "en-ligne",
    image: "/assets/images/projects/tati-preview.jpg",
    progress: 100,
    tech: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
    liveUrl: "https://tatii.vercel.app/",
    isPremium: true,
    stats: [
      { icon: "user", label: "Portfolio & Vitrine" },
      { icon: "adjust", label: "Thème sombre/clair" },
      { icon: "mobile-alt", label: "100% Responsive" }
    ]
  },
  {
    id: 10,
    title: "MK — Portfolio Graphiste Client",
    description: "Portfolio professionnel sur-mesure pour un client graphiste. Mise en valeur des créations visuelles avec galerie immersive, animations soignées et thème sombre élégant.",
    category: "en-ligne",
    image: "/assets/images/projects/mk-preview.jpg",
    progress: 100,
    tech: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
    liveUrl: "https://mory01ff.vercel.app/",
    isPremium: true,
    stats: [
      { icon: "paint-brush", label: "Galerie créative" },
      { icon: "star", label: "Design sur-mesure" },
      { icon: "globe", label: "En production" }
    ]
  }
];

const servicesData = [
  {
    icon: "code",
    title: "Développement d'Applications Web",
    description: "Création d'applications web complètes avec interfaces modernes et fonctionnalités métier.",
    features: [
      "Applications CRUD complètes",
      "Dashboards de gestion",
      "Solutions sur-mesure"
    ]
  },
  {
    icon: "server",
    title: "Création d'API",
    description: "Développement d'API RESTful avec Flask pour connecter vos applications.",
    features: [
      "API RESTful avec Python",
      "Documentation complète",
      "Sécurité intégrée"
    ]
  },
  {
    icon: "mobile-alt",
    title: "Interfaces Responsives",
    description: "Design et intégration d'interfaces utilisateur modernes et adaptatives.",
    features: [
      "Design responsive",
      "Expérience utilisateur optimale",
      "Performance optimisée"
    ]
  },
  {
    icon: "database",
    title: "Gestion de Bases de Données",
    description: "Conception et optimisation de bases de données MySQL.",
    features: [
      "Modélisation de données",
      "Requêtes SQL optimisées",
      "Intégrité des données"
    ]
  },
  {
    icon: "shield-alt",
    title: "Sécurité Applicative",
    description: "Application des bonnes pratiques de sécurité dès la conception.",
    features: [
      "Protection des données",
      "Gestion des accès",
      "Sécurisation Python"
    ]
  },
  {
    icon: "tools",
    title: "Support Technique",
    description: "Maintenance informatique et assistance technique utilisateur.",
    features: [
      "Maintenance matérielle",
      "Support utilisateur",
      "Résolution de problèmes"
    ]
  }
];

const skillsData = {
  frontend: [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" }
  ],
  backend: [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
    { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" }
  ],
  tools: [
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "ChatGPT", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
    { name: "Gemini", icon: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" },
    { name: "Claude AI", icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg" },
    { name: "PythonAnywhere", icon: "https://www.pythonanywhere.com/static/anywhere/images/PA-logo.svg" },
    { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
    { name: "Netlify", icon: "https://logo.svgcdn.com/logos/netlify.svg" }
  ],
  autres: [
    { name: "Windows", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" },
    { name: "Android", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" },
    { name: "Word", icon: "https://img.icons8.com/fluency/48/microsoft-word-2019.png" },
    { name: "Excel", icon: "https://img.icons8.com/fluency/48/microsoft-excel-2019.png" },
    { name: "PowerPoint", icon: "https://img.icons8.com/fluency/48/microsoft-powerpoint-2019.png" },
    { name: "MS Project", icon: "https://img.icons8.com/fluency/48/microsoft-project-2019.png" },
    { name: "Facebook", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" },
    { name: "Community", icon: "https://cdn-icons-png.flaticon.com/512/3308/3308395.png" },
    { name: "Design Jean", icon: "https://cdn-icons-png.flaticon.com/512/2329/2329921.png" },
    { name: "Peinture", icon: "https://img.icons8.com/fluency/48/paint-palette.png" },
    { name: "Maintenance", icon: "https://img.icons8.com/fluency/48/maintenance.png" },
    { name: "Support Tech", icon: "https://img.icons8.com/fluency/48/technical-support.png" }
  ]
};
// ============================================================
// COMPOSANTS RÉUTILISABLES
// ============================================================

const SectionHeader = ({ tag, title, description, children }) => (
  <div className="section-header">
    <span className="section-tag">{tag}</span>
    <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />
    {description && <p className="section-description">{description}</p>}
    {children}
  </div>
);

// ============================================================
// COMPOSANT BUTTON - VERSION ONE-PAGE (SANS REACT ROUTER)
// Remplacer les lignes 253-277 dans App.jsx
// ============================================================

const Button = ({ children, variant = "primary", to, href, onClick, ...props }) => {
  const className = `btn-${variant}`;
  
  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Si c'est un lien vers une section (ex: to="/projects")
  if (to) {
    const sectionId = to.replace('/', ''); // Enlever le / pour obtenir l'id
    
    return (
      <a 
        href={`#${sectionId}`} 
        className={className} 
        onClick={(e) => {
          e.preventDefault();
          scrollToSection(sectionId);
          if (onClick) onClick(e);
        }}
        {...props}
      >
        {children}
      </a>
    );
  }
  
  // Si c'est un lien externe normal (ex: href="/assets/CV.pdf")
  if (href) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  }
  
  // Si c'est un bouton normal
  return (
    <button className={className} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
// ============================================================
// NAVBAR
// ============================================================

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Appel initial
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return (
    <nav className="navbar-vertical">
      <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="logo" title="Accueil">
        AKAFOLIO!
      </a>
      
      <ul className="nav-links-vertical">
        <li>
          <a 
            href="#services"
            onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
            className={activeSection === 'services' ? 'active' : ''} 
            title="Services"
          >
            <span className="material-symbols-outlined">work</span>
          </a>
        </li>
        <li>
          <a 
            href="#about"
            onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            className={activeSection === 'about' ? 'active' : ''} 
            title="À Propos"
          >
            <span className="material-symbols-outlined">person</span>
          </a>
        </li>
        <li>
          <a 
            href="#skills"
            onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}
            className={activeSection === 'skills' ? 'active' : ''} 
            title="Compétences"
          >
            <span className="material-symbols-outlined">bolt</span>
          </a>
        </li>
        <li>
          <a 
            href="#projects"
            onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
            className={activeSection === 'projects' ? 'active' : ''} 
            title="Projets"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
          </a>
        </li>
        <li>
          <a 
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            className={activeSection === 'contact' ? 'active' : ''} 
            title="Contact"
          >
            <span className="material-symbols-outlined">mail</span>
          </a>
        </li>
      </ul>

      <div className="nav-actions-vertical">
        <button id="theme-mode-toggle" className="theme-btn-vertical">
          <span className="material-symbols-outlined">light_mode</span>
        </button>
      </div>
    </nav>
  );
};
// ============================================================
// FOOTER
// ============================================================

const Footer = () => (
  <footer>
    <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
      © 2026 Elvis M'BOLLO | Développeur Web Full-Stack
    </p>
    
    <div className="social-links" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '1.5rem' }}>
      <a href="https://github.com/wthomasss06-stack" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
        <i className="fab fa-github"></i>
      </a>
      <a href="https://www.linkedin.com/in/aka-m-bollo-60a1b1340" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
        <i className="fab fa-linkedin-in"></i>
      </a>
      <a href="https://wa.me/2250142507750" target="_blank" rel="noopener noreferrer" className="social-link" title="WhatsApp">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
    
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
      Fait avec <span style={{ color: 'var(--primary)' }}>❤</span> en Côte d'Ivoire
    </p>
  </footer>
);

// ============================================================
// SCROLL TO TOP
// ============================================================

const ScrollToTop = () => {
  const [visible, setVisible]     = useState(false);
  const [launching, setLaunching] = useState(false);
  const buttonRef   = useRef(null);
  const audioCtxRef = useRef(null);
  // Nœuds du moteur en veille — gardés pour fade-out au mouseLeave
  const engineRef   = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) setVisible(footer.getBoundingClientRect().top < window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Contexte audio ────────────────────────────────────────────
  const getCtx = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  // ── Génère un buffer de bruit infini (loopé) ─────────────────
  const makeNoiseSource = (ctx, loop = true) => {
    // 2 secondes de bruit blanc — suffisant pour looper de façon imperceptible
    const bufSz  = ctx.sampleRate * 2;
    const buf    = ctx.createBuffer(1, bufSz, ctx.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < bufSz; i++) data[i] = Math.random() * 2 - 1;
    const src    = ctx.createBufferSource();
    src.buffer   = buf;
    src.loop     = loop;
    return src;
  };

  // ── HOVER : moteur de fusée continu qui dure tant que le curseur reste ──
  const startEngineHover = () => {
    // Ne pas démarrer si déjà actif
    if (engineRef.current) return;
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      // Master gain — pour le fade-in/out global
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(1, now + 0.25); // fade-in 250ms
      master.connect(ctx.destination);

      // ── Couche 1 : grondement grave (bruit rose filtré passe-bas) ──
      const noiseGrave = makeNoiseSource(ctx);
      const filtGrave  = ctx.createBiquadFilter();
      filtGrave.type   = 'lowpass';
      filtGrave.frequency.value = 140;
      filtGrave.Q.value = 0.9;
      const gainGrave  = ctx.createGain();
      gainGrave.gain.value = 0.55;
      noiseGrave.connect(filtGrave); filtGrave.connect(gainGrave); gainGrave.connect(master);
      noiseGrave.start();

      // ── Couche 2 : jet de gaz chaud (bruit passe-bande médium) ──
      const noiseJet  = makeNoiseSource(ctx);
      const filtJet   = ctx.createBiquadFilter();
      filtJet.type    = 'bandpass';
      filtJet.frequency.value = 480;
      filtJet.Q.value = 0.7;
      const gainJet   = ctx.createGain();
      gainJet.gain.value = 0.40;
      noiseJet.connect(filtJet); filtJet.connect(gainJet); gainJet.connect(master);
      noiseJet.start();

      // ── Couche 3 : sifflement haute pression (bruit passe-haut) ──
      const noiseHigh  = makeNoiseSource(ctx);
      const filtHigh   = ctx.createBiquadFilter();
      filtHigh.type    = 'highpass';
      filtHigh.frequency.value = 1800;
      const gainHigh   = ctx.createGain();
      gainHigh.gain.value = 0.18;
      noiseHigh.connect(filtHigh); filtHigh.connect(gainHigh); gainHigh.connect(master);
      noiseHigh.start();

      // ── Couche 4 : oscillateur de chambre de combustion (rumble tonique) ──
      const osc1 = ctx.createOscillator();
      osc1.type  = 'sawtooth';
      osc1.frequency.value = 48;
      // Légère modulation de fréquence pour donner une texture vivante
      const lfo  = ctx.createOscillator();
      lfo.type   = 'sine';
      lfo.frequency.value = 3.5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 7;
      lfo.connect(lfoGain); lfoGain.connect(osc1.frequency);
      lfo.start();

      const ws = ctx.createWaveShaper();
      const curve = new Float32Array(512);
      for (let i = 0; i < 512; i++) {
        const x = (i * 2) / 512 - 1;
        // Saturation douce type "tube"
        curve[i] = (3 + 200) * x / (Math.PI + 200 * Math.abs(x));
      }
      ws.curve = curve;
      ws.oversample = '4x';

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.32;
      osc1.connect(ws); ws.connect(oscGain); oscGain.connect(master);
      osc1.start();

      // ── Couche 5 : vibration basse fréquence (sub) ──
      const sub = ctx.createOscillator();
      sub.type  = 'sine';
      sub.frequency.value = 28;
      const subGain = ctx.createGain();
      subGain.gain.value = 0.38;
      sub.connect(subGain); subGain.connect(master);
      sub.start();

      // Stocker tous les noeuds pour les arrêter proprement
      engineRef.current = { master, nodes: [noiseGrave, noiseJet, noiseHigh, osc1, lfo, sub] };

    } catch (e) { console.warn('Web Audio engine:', e); }
  };

  const stopEngineHover = () => {
    if (!engineRef.current) return;
    try {
      const ctx    = getCtx();
      const now    = ctx.currentTime;
      const { master, nodes } = engineRef.current;

      // Fade-out rapide puis stop
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.3);

      setTimeout(() => {
        nodes.forEach(n => { try { n.stop(); } catch(_) {} });
        engineRef.current = null;
      }, 350);
    } catch (e) {
      engineRef.current = null;
    }
  };

  // ── CLICK : décollage (whoosh qui monte + boom initial) ───────
  const playLaunchSound = () => {
    // Couper le moteur hover d'abord pour pas superposer
    stopEngineHover();
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      // 1. BOOM d'allumage (impact grave)
      const boom = ctx.createOscillator();
      boom.type  = 'sine';
      boom.frequency.setValueAtTime(120, now);
      boom.frequency.exponentialRampToValueAtTime(22, now + 0.18);
      const boomGain = ctx.createGain();
      boomGain.gain.setValueAtTime(0.7, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      boom.connect(boomGain); boomGain.connect(ctx.destination);
      boom.start(now); boom.stop(now + 0.25);

      // 2. WHOOSH bruit filtré qui sweep vers le haut (jet qui s'éloigne)
      const bufSz  = Math.floor(ctx.sampleRate * 2.2);
      const nBuf   = ctx.createBuffer(1, bufSz, ctx.sampleRate);
      const nData  = nBuf.getChannelData(0);
      for (let i = 0; i < bufSz; i++) nData[i] = Math.random() * 2 - 1;
      const nSrc   = ctx.createBufferSource();
      nSrc.buffer  = nBuf;
      const filt   = ctx.createBiquadFilter();
      filt.type    = 'bandpass';
      filt.frequency.setValueAtTime(100, now);
      filt.frequency.exponentialRampToValueAtTime(4000, now + 1.8);
      filt.Q.value = 1.0;
      const nGain  = ctx.createGain();
      nGain.gain.setValueAtTime(0, now);
      nGain.gain.linearRampToValueAtTime(0.65, now + 0.06);
      nGain.gain.setValueAtTime(0.65, now + 0.5);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      nSrc.connect(filt); filt.connect(nGain); nGain.connect(ctx.destination);
      nSrc.start(now); nSrc.stop(now + 2.2);

      // 3. GRONDEMENT moteur puissant qui monte puis s'estompe (fusée qui monte)
      const rumble = ctx.createOscillator();
      rumble.type  = 'sawtooth';
      rumble.frequency.setValueAtTime(60, now);
      rumble.frequency.linearRampToValueAtTime(42, now + 1.5);
      const rGain  = ctx.createGain();
      rGain.gain.setValueAtTime(0, now);
      rGain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      rGain.gain.setValueAtTime(0.35, now + 0.6);
      rGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
      const rWs    = ctx.createWaveShaper();
      const rCurve = new Float32Array(256);
      for (let i = 0; i < 256; i++) { const x=(i*2)/256-1; rCurve[i]=(Math.PI+180)*x/(Math.PI+180*Math.abs(x)); }
      rWs.curve = rCurve;
      rumble.connect(rWs); rWs.connect(rGain); rGain.connect(ctx.destination);
      rumble.start(now); rumble.stop(now + 1.6);

    } catch (e) { console.warn('Web Audio launch:', e); }
  };

  const scrollToTop = () => {
    playLaunchSound();
    setLaunching(true);
    if (buttonRef.current) {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        particle.style.setProperty('--x-offset', `${(Math.random() - 0.5) * 30}px`);
        particle.style.animationDelay = `${i * 0.1}s`;
        buttonRef.current.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
      }
    }
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setLaunching(false), 800);
    }, 300);
  };

  return (
    <button
      ref={buttonRef}
      className={`scroll-top-btn ${visible ? 'visible' : ''} ${launching ? 'launching' : ''}`}
      onClick={scrollToTop}
      onMouseEnter={startEngineHover}
      onMouseLeave={stopEngineHover}
      title="Décollage vers le haut !"
    >
      <i className="fas fa-rocket"></i>
      <div className="rocket-flame"></div>
    </button>
  );
};

// ============================================================
// PAGE HOME
// ============================================================

const Home = () => {
  const [typedText, setTypedText] = useState('');
  const textArray = [
    "Développeur Web Full-Stack (Python & Front-end)",
    "Spécialisé en Python, MySQL et interfaces modernes",
    "Sensible aux bonnes pratiques de sécurité applicative"
  ];
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < textArray[textIndex].length) {
        setTypedText(textArray[textIndex].substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setTypedText(textArray[textIndex].substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === textArray[textIndex].length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTextIndex((textIndex + 1) % textArray.length);
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);
  
  return (
    <>
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>
              Saluuut <span className="wave">👋</span><br />
              M'BOLLO AKA ELVIS
            </h1>
            <p className="hero-subtitle">
              Je suis <span id="typing-text">{typedText}</span>
            </p>
            <p className="hero-description">
              Développeur web orienté produits, spécialisé Django & React, je construis des applications pensées pour des usages réels.
            </p>
            <div className="hero-buttons">
              <Button to="/projects">
                Voir mes projets
                <i className="fas fa-arrow-right"></i>
              </Button>
              <Button variant="secondary" href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" download>
                <i className="fas fa-download"></i>
                Télécharger CV
              </Button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">9<span>+</span></div>
                <div className="stat-label">Projets</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2<span>+</span></div>
                <div className="stat-label">Années</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">9<span>+</span></div>
                <div className="stat-label">Outils</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-wrapper">
              <div className="animated-bubble">
                <img src="/assets/images/IMG_20250124_124101KK.jpg" alt="Elvis M'Bollo" />
                <div className="bubble-shine"></div>
              </div>
              <div className="floating-badge badge-professional">
                <i className="fas fa-code"></i>
                <span>Pro</span>
              </div>
              <div className="floating-badge badge-creative">
                <i className="fas fa-lightbulb"></i>
                <span>Créatif</span>
              </div>
              <div className="floating-badge badge-experience">
                <i className="fas fa-eye"></i>
                <span>Curieux</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services-preview">
        <SectionHeader 
          tag="Services"
          title="&lt;Ce Que <span class='highlight'>Je Fais/&gt;</span>"
          description="Solutions digitales complètes adaptées aux besoins métier"
        />
        <div className="services-grid">
          {servicesData.slice(0, 3).map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <i className={`fas fa-${service.icon}`}></i>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Button to="/services">
            Voir tous les services
            <i className="fas fa-arrow-right"></i>
          </Button>
        </div>
      </section>

      <section id="projects-preview">
        <SectionHeader 
          tag="Portfolio"
          title="&lt;Projets <span class='highlight'>Récents/&gt;</span>"
          description="Applications web fonctionnelles en production"
        />
        <div className="projects-grid-preview">
          {projectsData.filter(p => p.isPremium).slice(0, 2).map(project => (
            <div key={project.id} className="project-card project-card-premium">
              <div className="premium-badge">
                <i className="fas fa-crown"></i>
                <span>En production</span>
              </div>
              <div className="project-image-screenshot">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="project-overlay">
                  <div className="live-badge">
                    <i className="fas fa-circle"></i> EN LIGNE
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag tech-tag-premium">{tech}</span>
                  ))}
                </div>
                <div className="project-links-premium">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link-primary">
                    <i className="fas fa-globe"></i>
                    Voir le site
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Button to="/projects">
            Voir tous les projets
            <i className="fas fa-arrow-right"></i>
          </Button>
        </div>
      </section>

      <section id="cta-section">
        <div className="cta-container">
          <h2>Prêt à démarrer votre projet ?</h2>
          <p>Discutons de votre besoin et créons quelque chose d'incroyable ensemble.</p>
          <div className="cta-buttons">
            <Button to="/contact">
              <i className="fas fa-paper-plane"></i>
              Me contacter
            </Button>
            <Button variant="secondary" to="/services">
              <i className="fas fa-briefcase"></i>
              Voir mes services
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

// ============================================================
// PAGE PROJECTS — 3D CAROUSEL
// ============================================================

const CARD_WIDTH  = 320;
const CARD_HEIGHT = 430;

const techColor = (tech) => {
  const map = {
    React: '#61DAFB', Python: '#3776AB', Django: '#092E20', Flask: '#555',
    JavaScript: '#F7DF1E', TypeScript: '#3178C6', 'Tailwind CSS': '#38BDF8',
    'Bootstrap 5': '#7952B3', MySQL: '#4479A1', 'HTML / Tailwind CSS': '#E34F26',
    Netlify: '#00C7B7', Vercel: '#000000', 'Leaflet.js': '#199900', 'Chart.js': '#FF6384',
    'Canvas API': '#FF7F50', LocalStorage: '#aaa', 'Camera API': '#EF4444',
  };
  for (const [k, v] of Object.entries(map)) {
    if (tech.includes(k)) return v;
  }
  return '#7EE787';
};

const ProgressRing = ({ value }) => {
  const r = 18, c = 2 * Math.PI * r;
  const dash  = (value / 100) * c;
  const color = value >= 90 ? '#7EE787' : value >= 60 ? '#58A6FF' : '#F7A25E';
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
      <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3.5"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      <text x="22" y="22" textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize="9" fontWeight="700"
        style={{ transform: 'rotate(90deg)', transformOrigin: '22px 22px' }}>
        {value}%
      </text>
    </svg>
  );
};

const CategoryBadge3D = ({ cat }) => {
  const cfg = {
    'en-ligne': { label: 'EN LIGNE', color: '#7EE787', icon: '🌐' },
    'demo':     { label: 'DÉMO',     color: '#58A6FF', icon: '🧪' },
    'en-cours': { label: 'EN COURS', color: '#F7A25E', icon: '⚙️' },
  };
  const { label, color, icon } = cfg[cat] || { label: cat, color: '#aaa', icon: '📁' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.08em',
      color, border: `1px solid ${color}40`, background: `${color}12`,
    }}>{icon} {label}</span>
  );
};

const ProjectCard3D = ({ project, position, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  const [tilt,    setTilt]    = React.useState({ x: 0, y: 0 });
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || position !== 0) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - rect.top)  / rect.height - 0.5) * -12,
      y: ((e.clientX - rect.left) / rect.width  - 0.5) *  14,
    });
  };

  const absPos  = Math.abs(position);
  const scale   = position === 0 ? 1 : absPos === 1 ? 0.82 : 0.66;
  const tx      = position * (CARD_WIDTH * 0.68);
  const tz      = position === 0 ? 0 : absPos === 1 ? -120 : -240;
  const ry      = position * -30;
  const opacity = position === 0 ? 1 : absPos === 1 ? 0.75 : 0.45;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setTilt({ x:0, y:0 }); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      onClick={() => position !== 0 && onClick(position)}
      style={{
        position: 'absolute',
        width: CARD_WIDTH, height: CARD_HEIGHT,
        borderRadius: '20px', overflow: 'hidden',
        cursor: position === 0 ? 'default' : 'pointer',
        transition: hovered && position === 0
          ? 'transform 0.08s ease, opacity 0.4s ease'
          : 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease',
        transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry + (position===0?tilt.y:0)}deg) rotateX(${position===0?tilt.x:0}deg) scale(${scale})`,
        opacity,
        zIndex: 10 - absPos,
        boxShadow: position === 0
          ? '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 15px 40px rgba(0,0,0,0.35)',
        background: 'linear-gradient(160deg, rgba(22,27,34,0.97) 0%, rgba(13,17,23,0.99) 100%)',
        border: position === 0 ? '1px solid rgba(126,231,135,0.2)' : '1px solid rgba(255,255,255,0.06)',
        pointerEvents: absPos <= 2 ? 'auto' : 'none',
      }}
    >
      {/* ── Image ── */}
      <div style={{ position:'relative', height:175, overflow:'hidden' }}>
        <img src={project.image} alt={project.title} style={{
          width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.85)',
          transition:'transform 0.5s ease',
          transform: hovered && position===0 ? 'scale(1.06)' : 'scale(1)',
        }} onError={e=>{e.target.style.display='none'; e.target.parentElement.style.background='linear-gradient(135deg,#0d1117,#161b22)';}} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 40%, rgba(13,17,23,0.95) 100%)' }} />
        <div style={{ position:'absolute', top:12, left:12, right:12, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <CategoryBadge3D cat={project.category} />
          {project.isPremium && (
            <span style={{ background:'linear-gradient(135deg,#F7A25E,#FF6B35)', color:'#fff', fontSize:'0.6rem', fontWeight:'800', padding:'3px 8px', borderRadius:'20px' }}>
              👑 PROD
            </span>
          )}
        </div>
        <div style={{ position:'absolute', bottom:12, left:14, right:14, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div style={{ display:'flex', gap:6 }}>
            {project.tech?.slice(0,2).map((t,i)=>(
              <span key={i} style={{ fontSize:'0.6rem', fontWeight:'600', background:`${techColor(t)}20`, border:`1px solid ${techColor(t)}50`, color:techColor(t), padding:'2px 7px', borderRadius:'10px' }}>
                {t.split('/')[0].trim()}
              </span>
            ))}
          </div>
          <ProgressRing value={project.progress} />
        </div>
      </div>

      {/* ── Contenu ── */}
      <div style={{ padding:'16px 18px 14px', display:'flex', flexDirection:'column', gap:9, height: CARD_HEIGHT-175-2, boxSizing:'border-box' }}>
        <h3 style={{ fontSize:'0.95rem', fontWeight:'700', color:'#e6edf3', lineHeight:1.35, margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {project.title}
        </h3>
        <p style={{ fontSize:'0.78rem', color:'#8b949e', lineHeight:1.5, margin:0, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {project.description}
        </p>
        {project.stats && (
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {project.stats.slice(0,3).map((s,i)=>(
              <span key={i} style={{ fontSize:'0.62rem', color:'#7EE787', background:'rgba(126,231,135,0.08)', border:'1px solid rgba(126,231,135,0.15)', padding:'2px 7px', borderRadius:'12px', display:'flex', alignItems:'center', gap:4 }}>
                <i className={`fas fa-${s.icon}`} style={{ fontSize:'0.55rem' }} />{s.label}
              </span>
            ))}
          </div>
        )}
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {project.tech?.slice(2).map((t,i)=>(
            <span key={i} style={{ fontSize:'0.57rem', fontWeight:'600', background:`${techColor(t)}15`, border:`1px solid ${techColor(t)}35`, color:techColor(t), padding:'1px 6px', borderRadius:'8px' }}>
              {t.split('/')[0].trim()}
            </span>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:'auto' }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
              style={{ flex:1, padding:'8px 0', borderRadius:'10px', fontSize:'0.72rem', fontWeight:'700', background:'linear-gradient(135deg,#7EE787,#58A6FF)', color:'#0d1117', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:5, boxShadow:'0 4px 14px rgba(126,231,135,0.25)' }}>
              <i className="fas fa-external-link-alt" style={{ fontSize:'0.65rem' }} />Voir le site
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} onClick={e=>e.stopPropagation()}
              style={{ flex:1, padding:'8px 0', borderRadius:'10px', fontSize:'0.72rem', fontWeight:'700', background:'rgba(88,166,255,0.12)', border:'1px solid rgba(88,166,255,0.3)', color:'#58A6FF', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
              <i className="fas fa-play-circle" style={{ fontSize:'0.65rem' }} />Démo
            </a>
          )}
        </div>
      </div>

      {/* Shine tilt */}
      {position === 0 && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', borderRadius:'20px',
          background:`radial-gradient(circle at ${50+tilt.y*2}% ${50+tilt.x*2}%, rgba(255,255,255,0.04) 0%, transparent 60%)`,
          transition:'background 0.1s ease' }} />
      )}
    </div>
  );
};

const Projects = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [filter,      setFilter]      = React.useState('all');
  const isDragging  = React.useRef(false);
  const dragStartX  = React.useRef(0);
  const autoRef     = React.useRef(null);

  const categories = [
    { key:'all',      label:'Tous',     icon:'apps' },
    { key:'en-ligne', label:'En ligne', icon:'public' },
    { key:'demo',     label:'Démos',    icon:'visibility' },
    { key:'en-cours', label:'En cours', icon:'pending' },
  ];

  const filtered = filter === 'all' ? projectsData : projectsData.filter(p => p.category === filter);

  React.useEffect(() => { setActiveIndex(0); }, [filter]);

  const resetAuto = React.useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() =>
      setActiveIndex(prev => (prev + 1) % filtered.length), 4500);
  }, [filtered.length]);

  React.useEffect(() => { resetAuto(); return () => clearInterval(autoRef.current); }, [resetAuto]);

  const go = (dir) => {
    setActiveIndex(prev => (prev + dir + filtered.length) % filtered.length);
    resetAuto();
  };

  React.useEffect(() => {
    const fn = e => { if (e.key==='ArrowRight') go(1); if (e.key==='ArrowLeft') go(-1); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [filtered.length]);

  const onDragStart = e => { dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX; isDragging.current = true; };
  const onDragEnd   = e => {
    if (!isDragging.current) return;
    const dx = (e.clientX ?? e.changedTouches?.[0]?.clientX) - dragStartX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    isDragging.current = false;
  };

  return (
    <section id="projects" style={{ padding:'100px 0', minHeight:'100vh', position:'relative' }}>
      <style>{`
        @keyframes proj3d-pulse {
          from { opacity:.4; transform:scale(.93); }
          to   { opacity:1;  transform:scale(1.07); }
        }
        .proj3d-arrow { transition: all .2s ease !important; }
        .proj3d-arrow:hover { background: rgba(126,231,135,0.15) !important; transform: translateY(-50%) scale(1.12) !important; box-shadow: 0 6px 24px rgba(126,231,135,0.2) !important; }
      `}</style>

      {/* Header */}
      <motion.div className="section-header"
        initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:.7 }}>
        <span className="section-tag">Portfolio</span>
        <h2 className="section-title">{'<'}Projets <span className="highlight">Réalisés{'/>'}</span></h2>
        <p className="section-description">Applications web fonctionnelles et projets en production</p>
      </motion.div>

      {/* Filtres */}
      <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ delay:.15 }}
        style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:55 }}>
        {categories.map(cat => {
          const count  = cat.key==='all' ? projectsData.length : projectsData.filter(p=>p.category===cat.key).length;
          const active = filter === cat.key;
          return (
            <button key={cat.key} className="filter-btn"
              onClick={() => { setFilter(cat.key); resetAuto(); }}
              style={{
                padding:'8px 20px', borderRadius:'30px', cursor:'pointer',
                fontSize:'0.82rem', fontWeight:'600', display:'flex', alignItems:'center', gap:7,
                transition:'all 0.25s ease',
                background: active ? 'linear-gradient(135deg,rgba(126,231,135,0.18),rgba(88,166,255,0.18))' : 'rgba(255,255,255,0.05)',
                color:  active ? '#7EE787' : '#8b949e',
                border: `1px solid ${active ? 'rgba(126,231,135,0.4)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: active ? '0 0 20px rgba(126,231,135,0.15)' : 'none',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize:'1rem' }}>{cat.icon}</span>
              {cat.label}
              <span style={{ background: active?'rgba(126,231,135,0.2)':'rgba(255,255,255,0.07)', color:active?'#7EE787':'#555', borderRadius:'50%', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:'800' }}>
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Scène 3D */}
      <div style={{ position:'relative', height: CARD_HEIGHT+80, display:'flex', alignItems:'center', justifyContent:'center' }}
        onMouseDown={onDragStart} onMouseUp={onDragEnd}
        onTouchStart={onDragStart} onTouchEnd={onDragEnd}>

        {/* Halo */}
        <div style={{ position:'absolute', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(126,231,135,0.08) 0%,transparent 70%)', pointerEvents:'none', zIndex:0, animation:'proj3d-pulse 3s ease-in-out infinite alternate' }} />

        {/* Conteneur perspective */}
        <div style={{ position:'relative', width:CARD_WIDTH, height:CARD_HEIGHT, perspective:'1100px', transformStyle:'preserve-3d' }}>
          {[-2,-1,0,1,2].map(pos => {
            const idx = ((activeIndex + pos) % filtered.length + filtered.length) % filtered.length;
            return <ProjectCard3D key={`${filter}-${idx}-${pos}`} project={filtered[idx]} position={pos} onClick={dir=>go(dir)} />;
          })}
        </div>

        {/* Flèches */}
        {[{dir:-1,side:'left',icon:'chevron-left'},{dir:1,side:'right',icon:'chevron-right'}].map(({dir,side,icon})=>(
          <button key={side} className="proj3d-arrow"
            onClick={() => go(dir)}
            style={{
              position:'absolute', top:'50%', transform:'translateY(-50%)',
              [side]: 'calc(50% - 340px)',
              width:48, height:48, borderRadius:'50%',
              border:'1px solid rgba(126,231,135,0.25)',
              background:'rgba(13,17,23,0.85)', backdropFilter:'blur(12px)',
              color:'#7EE787', fontSize:'1rem', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              zIndex:50, boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <i className={`fas fa-${icon}`} />
          </button>
        ))}
      </div>

      {/* Dots + compteur */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, marginTop:10 }}>
        <span style={{ fontSize:'0.75rem', color:'#555', letterSpacing:'0.1em', fontWeight:'600', fontFamily:'var(--font-mono)' }}>
          <span style={{ color:'#7EE787' }}>{String(activeIndex+1).padStart(2,'0')}</span> / {String(filtered.length).padStart(2,'0')}
        </span>
        <div style={{ display:'flex', gap:8 }}>
          {filtered.map((_,i)=>(
            <button key={i} onClick={()=>{ setActiveIndex(i); resetAuto(); }}
              style={{ width:i===activeIndex?24:8, height:8, borderRadius:4, border:'none', cursor:'pointer', padding:0, transition:'all 0.3s ease',
                background:i===activeIndex?'linear-gradient(90deg,#7EE787,#58A6FF)':'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
        <p style={{ fontSize:'0.7rem', color:'#3a3f47', margin:0, fontFamily:'var(--font-mono)' }}>← glissez ou utilisez les touches ← →</p>
      </div>
    </section>
  );
};


// ============================================================
// PAGE CONTACT
// ============================================================

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('https://formsubmit.co/ajax/wthomasss06@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          'Type de projet': formData.projectType,
          message: formData.message,
          _subject: `🚀 Nouveau contact : ${formData.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });
      
      alert('✅ Message envoyé ! Je vous réponds sous 24h.');
      setFormData({ name: '', email: '', projectType: '', message: '' });
    } catch (error) {
      alert('❌ Erreur. Contactez-moi sur WhatsApp : +225 01 42 50 77 50');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  
  return (
    <section id="contact">
      <SectionHeader 
        tag="Contact"
        title="&lt;Discutons de <span class='highlight'>votre projet/&gt;</span>"
      />

      <div className="contact-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-circle" style={{ color: 'var(--primary)', fontSize: '0.6rem', animation: 'pulse 2s infinite' }}></i>
            Disponible maintenant
          </div>

          <h1 className="hero-title">
            Transformons votre <span className="highlight">idée</span> en <span className="highlight">réalité</span>
          </h1>

          <div className="code-block">
            <div className="code-header">
              <span className="code-dot dot-red"></span>
              <span className="code-dot dot-yellow"></span>
              <span className="code-dot dot-green"></span>
              <span className="code-title">contact.js</span>
            </div>
            <div className="code-line">
              <span className="keyword">import</span> {'{'}  <span className="function">useState</span> {'}'} <span className="keyword">from</span> <span className="string">"react"</span>;
            </div>
            <div className="code-line">
              <span className="comment">// <i className="fas fa-star"></i> Configuration du système de contact</span>
            </div>
            <div className="code-line">
              <span className="keyword">const</span> [<span className="variable">responseTime</span>] = <span className="string">"&lt;24h"</span>;
            </div>
            <div className="code-line">
              <span className="keyword">const</span> [<span className="variable">availability</span>] = <span className="string">"100%"</span>;
            </div>
            <div className="code-line">
              <span className="keyword">const</span> [<span className="variable">status</span>] = <span className="string">"ready"</span>;
            </div>
            <div className="code-line">
              <span className="comment">// <i className="fas fa-rocket"></i> Prêt pour de nouveaux défis !</span><span className="cursor"></span>
            </div>
          </div>

          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="stat-value">&lt;24h</div>
              <div className="stat-label">Temps de réponse</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-globe"></i>
              </div>
              <div className="stat-value">100%</div>
              <div className="stat-label">Disponibilité</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="stat-value">7+</div>
              <div className="stat-label">Projets</div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-grid">
        <div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-light)', marginBottom: '8px' }}>
                <i className="fas fa-envelope-open-text" style={{ color: 'var(--primary)', marginRight: '10px' }}></i>
                Envoyez-moi un message
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Remplissez le formulaire ci-dessous et je vous répondrai rapidement
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-user"></i>
                  Nom complet *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-input" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Jean Kouassi"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-envelope"></i>
                  Email *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.kouassi@exemple.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-briefcase"></i>
                Type de projet *
              </label>
              <select 
                id="projectType" 
                className="form-select" 
                required
                value={formData.projectType}
                onChange={handleChange}
              >
                <option value="">Sélectionnez votre besoin...</option>
                <option value="site-vitrine">🌐 Site Vitrine</option>
                <option value="e-commerce">🛒 E-commerce</option>
                <option value="application-web">⚡ Application Web</option>
                <option value="api">🔧 API / Backend</option>
                <option value="maintenance">🔨 Maintenance / Support</option>
                <option value="recrutement">💼 Candidature spontanée</option>
                <option value="autre">✨ Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-comment-dots"></i>
                Message *
              </label>
              <textarea 
                id="message" 
                className="form-textarea" 
                required 
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre projet en quelques lignes..."
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <i className="fas fa-paper-plane"></i>
              <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
              {isSubmitting && <i className="fas fa-spinner fa-spin"></i>}
            </button>

            <p className="privacy-notice">
              <i className="fas fa-lock"></i>
              Vos données sont sécurisées et ne seront jamais partagées
            </p>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '35px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '25px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-address-card" style={{ color: 'var(--primary)' }}></i>
              Mes coordonnées
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h4>Téléphone</h4>
                  <a href="tel:+2250142507750">+225 01 42 50 77 50</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <a href="mailto:aka.mbollo@uvci.edu.ci">aka.mbollo@uvci.edu.ci</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h4>Localisation</h4>
                  <p>Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cv-download">
            <div className="qr-code">
              <img src="/assets/images/qrcodeCV.png" alt="QR Code CV" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '15px' }} />
            </div>
            <h3>Télécharger mon CV</h3>
            <p>Scannez le QR code ou cliquez sur le bouton</p>
            <a href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" className="btn-download" download>
              <i className="fas fa-download"></i>
              Télécharger CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// PAGE ABOUT
// ============================================================

const About = () => {
  const timelineData = [
    {
      date: "Mai - Novembre 2025",
      title: "Informaticien Stagiaire",
      company: "Mairie d'Agboville",
      items: [
        "Maintenance du parc informatique et du réseau",
        "Support technique aux utilisateurs",
        "Contribution à la gestion et à la numérisation des données",
        "Appui à la création d'outils numériques internes"
      ]
    },
    {
      date: "2023-2024",
      title: "Projet Académique – ARTICI",
      company: "UVCI",
      items: [
        "Plateforme web de promotion de l'artisanat local",
        "Travail collaboratif en équipe pluridisciplinaire",
        "Optimisation des performances",
        "Intégration de bonnes pratiques de sécurité"
      ]
    },
    {
      date: "2023-2024",
      title: "Licence en Réseau et Sécurité Informatique",
      company: "Université Virtuelle de Côte d'Ivoire (UVCI)",
      description: "Formation complète en développement web, bases de données et sécurité des applications.",
      tags: ["Certification E-Banking", "Réf: CC/24-002485"]
    },
    {
      date: "2020-2021",
      title: "Baccalauréat Série D",
      company: "Lycée Moderne d'Arrah",
      description: "Mention : Assez Bien"
    }
  ];

  return (
    <>
      <section id="about">
        <SectionHeader 
          tag="À Propos"
          title="&lt;Alors <span class='highlight'>Moi/&gt;</span>"
        />
        <div className="about-grid">
          <div className="about-images">
            <motion.div
              className="about-quote-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="quote-text">"Ce n'est pas important de réussir du premier coup. L'essentiel est de réussir au final."</p>
              <p className="quote-author">Kevin Ressegaire</p>
            </motion.div>
          </div>
          <div className="about-content">
            <h3>Développeur Web Full-Stack</h3>
            <p>
              Développeur web formé en <strong>Réseau et Sécurité Informatique</strong>, je développe des applications web complètes en combinant front-end moderne et back-end Python.
            </p>
            <p>
              J'utilise principalement <strong>Python, MySQL et React</strong> pour concevoir des solutions claires, maintenables et adaptées aux usages réels. La sécurité applicative (bonnes pratiques Python, gestion des accès) est intégrée dès la conception.
            </p>
            <p>
              Mon expérience en <strong>support informatique et maintenance</strong> à la Mairie d'Agboville m'a apporté une approche pragmatique, orientée résolution de problèmes et collaboration.
            </p>
            <div className="skills-tags">
              <span className="skill-tag">Esprit d'équipe</span>
              <span className="skill-tag">Créativité</span>
              <span className="skill-tag">Rigueur</span>
              <span className="skill-tag">Adaptabilité</span>
              <span className="skill-tag">Innovation</span>
            </div>
            <div style={{ marginTop: '30px' }}>
              <Button to="/contact">
                Disponible pour opportunités
                <i className="fas fa-arrow-right"></i>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="experience">
        <SectionHeader 
          tag="Parcours"
          title="&lt;Expérience & <span class='highlight'>Formation/&gt;</span>"
        />
        <div className="timeline">
          {timelineData.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-date">
                  <i className="far fa-calendar-alt"></i>
                  {item.date}
                </div>
                <h4 className="timeline-title">{item.title}</h4>
                <p className="timeline-company">
                  <i className="fas fa-building"></i>
                  {item.company}
                </p>
                <div className="timeline-description">
                  {item.description && <p>{item.description}</p>}
                  {item.items && (
                    <ul>
                      {item.items.map((listItem, i) => (
                        <li key={i}>{listItem}</li>
                      ))}
                    </ul>
                  )}
                  {item.tags && (
                    <div className="skills-tags" style={{ marginTop: '15px' }}>
                      {item.tags.map((tag, i) => (
                        <span key={i} className="skill-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="cta-section">
        <div className="cta-container">
          <h2>Intéressé par mon profil ?</h2>
          <p>N'hésitez pas à me contacter pour discuter de vos projets ou opportunités.</p>
          <div className="cta-buttons">
            <Button to="/contact">
              <i className="fas fa-paper-plane"></i>
              Me contacter
            </Button>
            <Button variant="secondary" href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" download>
              <i className="fas fa-download"></i>
              Télécharger CV
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

// ============================================================
// PAGE SERVICES
// ============================================================

const Services = () => {
  const pricingData = [
    {
      badge: "💼 STARTER",
      badgeClass: "badge-starter",
      icon: "rocket",
      title: "Site Vitrine",
      description: "Pour démarrer votre présence en ligne simplement",
      features: [
        "Design moderne responsive",
        "Jusqu'à 5 pages",
        "Formulaire de contact",
        "SEO de base",
        "Hébergement 1 an inclus",
        "Livraison : 7-10 jours"
      ]
    },
    {
      badge: "⭐ POPULAIRE",
      badgeClass: "badge-popular",
      icon: "shopping-cart",
      title: "Site E-commerce",
      description: "Pour vendre vos produits en ligne",
      features: [
        "Catalogue produits",
        "Panier + paiement en ligne",
        "Interface admin",
        "Gestion des stocks",
        "Intégration mobile money",
        "Formation à l'utilisation",
        "Livraison : 15-20 jours"
      ],
      isPopular: true
    },
    {
      badge: "👑 SUR MESURE",
      badgeClass: "badge-premium",
      icon: "code",
      title: "Application Web",
      description: "Projet spécifique adapté à vos besoins",
      features: [
        "Développement personnalisé",
        "Backend Python/Flask",
        "Base de données MySQL",
        "Interface admin",
        "Documentation complète",
        "Support 3 mois inclus",
        "Livraison : selon projet"
      ]
    }
  ];

  return (
    <>
      <section id="services">
        <SectionHeader 
          tag="Services"
          title="&lt;Ce Que <span class='highlight'>Je Fais/&gt;</span>"
          description="Solutions digitales complètes adaptées aux besoins métier"
        />
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <i className={`fas fa-${service.icon}`}></i>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing">
        <SectionHeader 
          tag="Ce que je propose"
          title="&lt;Comment je peux <span class='highlight'>vous aider/&gt;</span>"
          description="Solutions web adaptées • Budget flexible • Disponible en Côte d'Ivoire"
        />

        <div className="pricing-grid">
          {pricingData.map((pricing, index) => (
            <div 
              key={index} 
              className={`pricing-card ${pricing.isPopular ? 'pricing-card-popular' : ''}`}
            >
              {/* Electric border SVG */}
              <svg className="electric-border" aria-hidden="true">
                <rect
                  className={`electric-rect ${pricing.isPopular ? 'electric-rect-popular' : ''}`}
                  x="1" y="1"
                  width="calc(100% - 2px)" height="calc(100% - 2px)"
                  rx="19" ry="19"
                />
              </svg>

              <div className={`pricing-badge ${pricing.badgeClass}`}>
                {pricing.badge}
              </div>
              {pricing.isPopular && <div className="popular-glow"></div>}
              <div className="pricing-icon">
                <i className={`fas fa-${pricing.icon}`}></i>
              </div>
              <h3 className="pricing-title">{pricing.title}</h3>
              <p className="pricing-description">{pricing.description}</p>
              <ul className="pricing-features">
                {pricing.features.map((feature, i) => (
                  <li key={i}>
                    <i className="fas fa-check-circle"></i> {feature}
                  </li>
                ))}
              </ul>
              <div className="pricing-cta">
                <Button 
                  to="/contact" 
                  variant={pricing.isPopular ? "primary" : "secondary"}
                  className={pricing.isPopular ? "btn-pricing-popular" : "btn-pricing"}
                >
                  <i className={`fas fa-${pricing.isPopular ? 'paper-plane' : 'comments'}`}></i>
                  {pricing.isPopular ? 'Demander un devis' : pricing.title === 'Application Web' ? 'Parlons-en' : 'Demander un devis'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="cta-section">
        <div className="cta-container">
          <h2>Prêt à lancer votre projet ?</h2>
          <p>Contactez-moi pour un devis gratuit et discutons de vos besoins.</p>
          <div className="cta-buttons">
            <Button to="/contact">
              <i className="fas fa-paper-plane"></i>
              Demander un devis
            </Button>
            <Button variant="secondary" to="/projects">
              <i className="fas fa-eye"></i>
              Voir mes réalisations
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

// ============================================================
// SKILLS — VERSION ÉPOUSTOUFLANTE
// ============================================================

// Mini SVG ring de progression
const SkillRing = ({ level, size = 52 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (level / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="skill-ring-svg">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="3"/>
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="var(--accent)" strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        className="skill-ring-progress"
        style={{ '--dash': dash, '--circ': circ }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".35em"
        fontSize={size < 48 ? "9" : "10"} fill="var(--accent)" fontFamily="var(--font-mono)" fontWeight="600">
        {level}%
      </text>
    </svg>
  );
};

// Carrousel infini pur CSS — items suffisamment dupliqués pour éviter tout trou
const SkillTrack = ({ skills, direction = 'left', speed = 18 }) => {
  const needsInvert = (icon) =>
    icon.includes('flask') || icon.includes('django') || icon.includes('OpenAI') || icon.includes('github');

  // Quadrupler pour garantir un remplissage sans trou sur tous les écrans
  const MIN_ITEMS = 16;
  const times = Math.max(4, Math.ceil(MIN_ITEMS / skills.length));
  const items = Array.from({ length: times }, () => skills).flat();
  // La première moitié anime, la seconde est le clone invisible pour le loop
  const half = items.length / 2;

  return (
    <div className="skill-track-viewport">
      <div
        className={`skill-track skill-track-${direction}`}
        style={{ '--speed': `${speed}s` }}
      >
        {items.map((skill, i) => (
          <div
            key={i}
            className="skill-chip"
            aria-hidden={i >= half ? 'true' : undefined}
          >
            <div className="skill-chip-inner">
              <img
                src={skill.icon}
                alt={skill.name}
                loading="lazy"
                width="38" height="38"
                style={needsInvert(skill.icon) ? { filter: 'brightness(0) invert(1)' } : {}}
              />
              <span>{skill.name}</span>
              {skill.level && (
                <div className="skill-chip-level">
                  <div className="skill-chip-bar" style={{ '--w': `${skill.level}%` }}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Catégorie avec header animé + track
const SkillBand = ({ title, icon, label, skills, direction, speed, index }) => (
  <motion.div
    className="skill-band"
    initial={{ opacity: 0, x: direction === 'left' ? -40 : 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="skill-band-header">
      <span className="skill-band-label">
        <i className={`fas fa-${icon}`}></i>
        <span className="skill-band-label-text">{title}</span>
      </span>
      <span className="skill-band-count">{skills.length} technos</span>
    </div>
    <SkillTrack skills={skills} direction={direction} speed={speed} />
  </motion.div>
);

// Stats globales
const skillStats = [
  { value: '2+', label: 'Ans d\'expérience', icon: 'calendar-alt' },
  { value: '20+', label: 'Technologies', icon: 'layer-group' },
  { value: '8+', label: 'Projets livrés', icon: 'rocket' },
];

const Skills = () => {
  // Enrichir les données avec niveaux de maîtrise
  const frontendWithLevels = [
    { ...skillsData.frontend[0], level: 85 }, // React
    { ...skillsData.frontend[1], level: 90 }, // JS
    { ...skillsData.frontend[2], level: 70 }, // TS
    { ...skillsData.frontend[3], level: 65 }, // Vue
    { ...skillsData.frontend[4], level: 88 }, // Tailwind
    { ...skillsData.frontend[5], level: 95 }, // HTML5
    { ...skillsData.frontend[6], level: 88 }, // CSS3
    { ...skillsData.frontend[7], level: 80 }, // Bootstrap
  ];
  const backendWithLevels = [
    { ...skillsData.backend[1], level: 80 }, // Flask
    { ...skillsData.backend[2], level: 72 }, // Django
    { ...skillsData.backend[4], level: 82 }, // MySQL
  ];

  return (
    <section id="skills">
      {/* ── HEADER ── */}
      <motion.div
        className="skills-hero-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <span className="section-tag">Compétences</span>
        <h2 className="section-title">
          {'<'}Skills &amp; <span className="highlight">Experience{'/>'}</span>
        </h2>

        {/* Stats rapides */}
        <div className="skills-stats-row">
          {skillStats.map((s, i) => (
            <motion.div
              key={i} className="skills-stat-pill"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <i className={`fas fa-${s.icon}`}></i>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          className="skills-quote-wrapper"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="skills-quote">
            "Le web est comme une toile, et le code est ma peinture. Avec lui, je crée mon chef-d'œuvre."
          </p>
        </motion.div>
      </motion.div>

      {/* ── MAÎTRISE PRINCIPALE — cards avec ring ── */}
      <motion.div
        className="skills-mastery-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="skills-mastery-label">
          <span className="section-tag" style={{ marginBottom: 0 }}>// maîtrise principale</span>
        </div>
        <div className="skills-mastery-cards">
          {[...frontendWithLevels.slice(0,4), ...backendWithLevels.slice(0,3)].map((skill, i) => (
            <motion.div
              key={i}
              className="mastery-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <SkillRing level={skill.level} size={56} />
              <img
                src={skill.icon} alt={skill.name} width="32" height="32"
                style={
                  skill.icon.includes('flask') || skill.icon.includes('django')
                    ? { filter: 'brightness(0) invert(1)' } : {}
                }
              />
              <span className="mastery-name">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── BANDES CARROUSEL ── */}
      <div className="skills-bands">
        <SkillBand title="Frontend" icon="laptop-code" skills={frontendWithLevels}
          direction="left" speed={16} index={0} />
        <SkillBand title="Backend" icon="server" skills={backendWithLevels}
          direction="right" speed={13} index={1} />
        <SkillBand title="Outils & IA" icon="tools" skills={skillsData.tools}
          direction="left" speed={15} index={2} />
        <SkillBand title="Autres" icon="plus-circle" skills={skillsData.autres}
          direction="right" speed={18} index={3} />
      </div>

      {/* ── CTA ── */}
      <section id="cta-section">
        <div className="cta-container">
          <h2>Besoin de ces compétences ?</h2>
          <p>Mettons mes compétences au service de votre projet. Discutons-en !</p>
          <div className="cta-buttons">
            <Button to="/contact">
              <i className="fas fa-paper-plane"></i>
              Me contacter
            </Button>
            <Button variant="secondary" to="/projects">
              <i className="fas fa-eye"></i>
              Voir mes projets
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
};
// ✅ CRÉER CE COMPOSANT POUR ACTIVER LES ANIMATIONS APRÈS LE LOADER
const Portfolio = () => {
  useAnimations();
  
  return (
    <div className="App">
      <Navbar />
      <ScrollToTop />
      
      {/* Tout sur une seule page */}
      <Home />
      <Services />
      <About />
      <Skills />
      <Projects />
      <Contact />
      
      <Footer />
    </div>
  );
};
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
  return (
    <div className="page-loader">
      <div className="loader-content">

        {/* Cyclist crossing the screen */}
        <div className="cyclist-scene">
          <div className="cyclist-wrapper">
            <svg className="cyclist-svg" viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#58A6FF"/>
                  <stop offset="100%" stopColor="#7EE787"/>
                </linearGradient>
                <filter id="cglow">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* === WHEELS === */}
              {/* Rear wheel */}
              <g className="wheel-rear">
                <circle cx="38" cy="80" r="24" stroke="url(#cg1)" strokeWidth="3" fill="none" filter="url(#cglow)"/>
                <circle cx="38" cy="80" r="4"  stroke="url(#cg1)" strokeWidth="2" fill="none"/>
                <line x1="38" y1="56" x2="38" y2="104" stroke="url(#cg1)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="14" y1="80" x2="62" y2="80"  stroke="url(#cg1)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="21" y1="63" x2="55" y2="97"  stroke="url(#cg1)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="55" y1="63" x2="21" y2="97"  stroke="url(#cg1)" strokeWidth="1.5" strokeLinecap="round"/>
              </g>

              {/* Front wheel */}
              <g className="wheel-front">
                <circle cx="122" cy="80" r="24" stroke="url(#cg1)" strokeWidth="3" fill="none" filter="url(#cglow)"/>
                <circle cx="122" cy="80" r="4"  stroke="url(#cg1)" strokeWidth="2" fill="none"/>
                <line x1="122" y1="56" x2="122" y2="104" stroke="url(#cg1)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="98"  y1="80" x2="146" y2="80"  stroke="url(#cg1)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="105" y1="63" x2="139" y2="97"  stroke="url(#cg1)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="139" y1="63" x2="105" y2="97"  stroke="url(#cg1)" strokeWidth="1.5" strokeLinecap="round"/>
              </g>

              {/* === FRAME === */}
              {/* Chain stay rear axle → bottom bracket */}
              <line x1="38" y1="80" x2="80" y2="72" stroke="#C9D1D9" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Seat tube */}
              <line x1="80" y1="72" x2="72" y2="44" stroke="#C9D1D9" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Down tube bottom bracket → head tube */}
              <line x1="80" y1="72" x2="112" y2="55" stroke="#C9D1D9" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Top tube */}
              <line x1="72" y1="44" x2="112" y2="52" stroke="#C9D1D9" strokeWidth="2" strokeLinecap="round"/>
              {/* Fork front wheel */}
              <line x1="112" y1="55" x2="122" y2="80" stroke="#C9D1D9" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Seat post */}
              <line x1="72" y1="44" x2="74" y2="33" stroke="#C9D1D9" strokeWidth="2" strokeLinecap="round"/>
              {/* Handlebar stem */}
              <line x1="112" y1="52" x2="114" y2="42" stroke="#C9D1D9" strokeWidth="2" strokeLinecap="round"/>
              <line x1="110" y1="40" x2="120" y2="42" stroke="#C9D1D9" strokeWidth="2.5" strokeLinecap="round"/>

              {/* === RIDER === */}
              {/* Head */}
              <circle cx="102" cy="18" r="7" fill="#F0F6FC"/>
              {/* Torso leaning forward */}
              <line x1="102" y1="25" x2="112" y2="40" stroke="#F0F6FC" strokeWidth="3" strokeLinecap="round"/>
              {/* Arms to handlebar */}
              <line x1="106" y1="30" x2="116" y2="40" stroke="#F0F6FC" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Hips */}
              <line x1="112" y1="40" x2="78" y2="36" stroke="#F0F6FC" strokeWidth="3" strokeLinecap="round"/>
              {/* Seat */}
              <line x1="70" y1="33" x2="80" y2="33" stroke="#8B949E" strokeWidth="3" strokeLinecap="round"/>
              {/* Legs — pedaling */}
              <line x1="78"  y1="36" x2="88"  y2="60" stroke="#F0F6FC" strokeWidth="2.5" strokeLinecap="round" className="leg-down"/>
              <line x1="88"  y1="60" x2="80"  y2="72" stroke="#F0F6FC" strokeWidth="2.5" strokeLinecap="round" className="leg-down"/>
              <line x1="78"  y1="36" x2="72"  y2="58" stroke="#F0F6FC" strokeWidth="2.5" strokeLinecap="round" className="leg-up"/>
              <line x1="72"  y1="58" x2="80"  y2="72" stroke="#F0F6FC" strokeWidth="2.5" strokeLinecap="round" className="leg-up"/>
            </svg>
          </div>

          {/* Ground line */}
          <div className="ground-line">
            <div className="ground-scroll"></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="loader-track" style={{marginTop: '24px'}}>
          <div className="loader-fill"></div>
        </div>

        <div className="loader-text-container">
          <span className="loading-text">ATTEND UN PEU</span>
          <span className="loading-dots">...</span>
        </div>
      </div>
    </div>
  );
}

  return <Portfolio />;
}
export default App;
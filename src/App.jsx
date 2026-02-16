import React, { useState, useEffect, useRef } from 'react';

import useAnimations from './useAnimations'; 
// ============================================================
// DONNÉES STATIQUES
// ============================================================

const projectsData = [
  {
    id: 1,
    title: "MonMarket CI — Marketplace E-commerce",
    description: "Marketplace multi-vendeurs conçue pour répondre aux problèmes de fiabilité, de visibilité et de gestion des ventes dans le e-commerce local ivoirien.",
    category: "en-ligne",
    image: "/assets/images/projects/monmarket-preview.jpg",
    progress: 60,
    tech: ["React", "Python/Django", "Bootstrap 5", "Netlify + PythonAnywhere"],
    liveUrl: "https://ecommerce-aka.netlify.app/",
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
  const [visible, setVisible] = useState(false);
  const [launching, setLaunching] = useState(false);
  const buttonRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        setVisible(footerRect.top < windowHeight);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    // Déclencher l'animation de décollage
    setLaunching(true);
    
    // Créer des particules de feu
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
    
    // Attendre un peu avant de scroller (pour voir le décollage)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Réinitialiser après le scroll
      setTimeout(() => {
        setLaunching(false);
      }, 800);
    }, 300);
  };
  
  return (
    <button 
      ref={buttonRef}
      className={`scroll-top-btn ${visible ? 'visible' : ''} ${launching ? 'launching' : ''}`}
      onClick={scrollToTop}
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
                <div className="stat-number">7<span>+</span></div>
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
// PAGE PROJECTS
// ============================================================

const Projects = () => {
  const [filter, setFilter] = useState('tous');
  
  const filteredProjects = filter === 'tous' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);
  
  const counts = {
    tous: projectsData.length,
    'en-ligne': projectsData.filter(p => p.category === 'en-ligne').length,
    demo: projectsData.filter(p => p.category === 'demo').length,
    'en-cours': projectsData.filter(p => p.category === 'en-cours').length
  };
  
  return (
    <section id="projects">
      <SectionHeader 
        tag="Portfolio"
        title="&lt;Projets <span class='highlight'>Réalisés/&gt;</span>"
        description="Applications web fonctionnelles et projets en production"
      />
      
      <div className="projects-filters">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            <span className="material-symbols-outlined">
              {key === 'tous' ? 'apps' : key === 'en-ligne' ? 'public' : key === 'demo' ? 'visibility' : 'pending'}
            </span>
            <span>{key === 'tous' ? 'Tous' : key === 'en-ligne' ? 'En ligne' : key === 'demo' ? 'Démo' : 'En cours'}</span>
            <span className="filter-count">{count}</span>
          </button>
        ))}
      </div>
      
      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className={`project-card ${project.isPremium ? 'project-card-premium' : ''}`}>
            {project.isPremium && (
              <div className="premium-badge">
                <i className="fas fa-crown"></i>
                <span>En production</span>
              </div>
            )}
            <div className="project-image-screenshot">
              <img src={project.image} alt={project.title} loading="lazy" />
              {project.isPremium && (
                <div className="project-overlay">
                  <div className="live-badge">
                    <i className="fas fa-circle"></i> EN LIGNE
                  </div>
                </div>
              )}
            </div>
            <div className="project-content">
              <h3 className="project-title">
                {project.title}
                {!project.isPremium && project.progress === 100 && (
                  <span className="badge badge-completed">Démo fonctionnelle</span>
                )}
                {project.category === 'en-cours' && (
                  <span className="badge badge-progress">En développement</span>
                )}
              </h3>
              <p className="project-description">{project.description}</p>
              <div className="project-stats">
                {project.stats.map((stat, i) => (
                  <div key={i} className="stat">
                    <i className={`fas fa-${stat.icon}`}></i>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="project-progress">
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${project.progress}%` }}>
                    {project.progress === 100 ? 'Complété' : `Avancement : ${project.progress}%`}
                  </div>
                </div>
              </div>
              <div className="project-tech">
                {project.tech.map((tech, i) => (
                  <span key={i} className={project.isPremium ? "tech-tag tech-tag-premium" : "tech-tag"}>
                    {tech}
                  </span>
                ))}
              </div>
              {project.liveUrl ? (
                <div className="project-links-premium">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link-primary">
                    <i className="fas fa-globe"></i>
                    Voir le site
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              ) : project.demoUrl ? (
                <a href={project.demoUrl} className="project-link">
                  Voir la démo
                  <i className="fas fa-arrow-right"></i>
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="no-projects-message">
          <span className="material-symbols-outlined">search_off</span>
          <p>Aucun projet dans cette catégorie</p>
        </div>
      )}
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
            <div className="about-quote-card">
              <div className="quote-icon">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="quote-text">"Ce n'est pas important de réussir du premier coup. L'essentiel est de réussir au final."</p>
              <p className="quote-author">— Kevin Ressegaire</p>
            </div>
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
// PAGE SKILLS - VERSION CORRIGÉE
// ============================================================
const Skills = () => {
  useEffect(() => {
    // Attendre que le DOM soit complètement chargé
    const timer = setTimeout(() => {
      const wrappers = document.querySelectorAll('.skill-category-wrapper');
      
      wrappers.forEach((wrapper, wrapperIndex) => {
        const skillLogos = wrapper.querySelector('.skill-logos');
        if (!skillLogos) {
          console.warn('skill-logos non trouvé dans wrapper', wrapperIndex);
          return;
        }
        
        // Dupliquer les logos pour l'effet infinite scroll
        const logos = Array.from(skillLogos.children);
        if (logos.length === 0) {
          console.warn('Aucun logo trouvé dans', wrapperIndex);
          return;
        }
        
        // Dupliquer 2 fois pour un scroll fluide
        logos.forEach(logo => {
          const clone = logo.cloneNode(true);
          skillLogos.appendChild(clone);
        });
        
        // Appliquer l'animation
        const direction = wrapperIndex % 2 === 0 ? 'scroll-left' : 'scroll-right';
        skillLogos.style.animation = `${direction} 30s linear infinite`;
        
        // Pause au survol
        const handleMouseEnter = () => {
          skillLogos.style.animationPlayState = 'paused';
        };
        
        const handleMouseLeave = () => {
          skillLogos.style.animationPlayState = 'running';
        };
        
        wrapper.addEventListener('mouseenter', handleMouseEnter);
        wrapper.addEventListener('mouseleave', handleMouseLeave);
      });

      // Observer pour faire apparaître les catégories
      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
          }
        });
      }, { threshold: 0.2 });

      wrappers.forEach(wrapper => {
        const category = wrapper.querySelector('.skill-category');
        if (category) {
          category.style.opacity = '0';
          category.style.transform = 'translateX(-50px)';
          category.style.transition = 'all 0.8s ease';
          skillObserver.observe(category);
        }
      });
      
      return () => {
        skillObserver.disconnect();
      };
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const SkillCategory = ({ title, icon, skills, index }) => {
    return (
      <div className="skill-category-wrapper">
        <h3 className="skill-category-title">
          <i className={`fas fa-${icon}`}></i> {title}
        </h3>
        <div className="skill-category">
          <div className="skill-logos">
            {skills.map((skill, i) => (
              <div key={i} className="skill-logo-item">
                <img 
                  src={skill.icon} 
                  alt={skill.name}
                  loading="lazy"
                  style={
                    skill.icon.includes('flask') || skill.icon.includes('django') || skill.icon.includes('OpenAI') ? 
                    { filter: 'brightness(0) invert(1)' } : {}
                  } 
                />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="skills">
      <SectionHeader 
        tag="Compétences"
        title="&lt;Skills & <span class='highlight'>Experience/&gt;</span>"
        description="Technologies et outils que je maîtrise"
      >
        <p className="skills-quote">"Le web est comme une toile, et le code est ma peinture. Avec je crée mon chef-d'œuvre."</p>
      </SectionHeader>

      <SkillCategory title="Frontend" icon="laptop-code" skills={skillsData.frontend} index={0} />
      <SkillCategory title="Backend" icon="server" skills={skillsData.backend} index={1} />
      <SkillCategory title="Design & Outils" icon="tools" skills={skillsData.tools} index={2} />
      <SkillCategory title="Autres Compétences" icon="plus-circle" skills={skillsData.autres} index={3} />

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
          <div className="loader-logo">
            <span className="loader-text">&lt;BIENVENU(E)!/&gt;</span>
          </div>
          <div className="loader-bar">
            <div className="loader-progress"></div>
          </div>
          <p className="loader-message">Chargement du portfolio...</p>
        </div>
      </div>
    );
  }

  return <Portfolio />;  // Plus besoin de Router !
}
export default App;
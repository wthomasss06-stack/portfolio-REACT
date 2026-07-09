// ════════════════════════════════════════════════════════════════
// src/data/portfolioData.js
// Source de vérité unique pour le contenu partagé entre les
// variantes du portfolio (App.jsx desktop, à terme Appmobile.jsx,
// Win95Portfolio.jsx, Appv4.jsx).
//
// Objectif : un changement de prix, de projet ou de contact se fait
// UNE fois ici, pas 4 fois dans 4 fichiers différents.
//
// Généré le 2026-07-04 à partir du contenu le plus à jour trouvé
// dans App.jsx (vérifié plus récent/complet que Win95Portfolio.jsx
// sur PROJECTS, PRICING_TABS et FAQ_ITEMS — voir notes dans le chat).
//
// Contenu volontairement PAS encore inclus (à discuter avant de
// centraliser, car les versions divergent sur le fond, pas juste
// la forme) : SERVICES vs SERVICES_DATA, PROCESS_STEPS,
// TESTIMONIALS, ABOUT_STATS.
// ════════════════════════════════════════════════════════════════

// ─── Identité / contact ────────────────────────────────────────
// Reconcilié entre useSEO.jsx (JSON-LD) et le README — Win95Portfolio.jsx
// avait 2 erreurs corrigées ici : l'URL akaTech ("akatech-agence.vercel.app"
// au lieu de "akatech.vercel.app") et un LinkedIn tronqué.
export const CONTACT = {
  name: "M'Bollo aka",
  shortName: 'Elvis',
  short: 'Elvis K.', // alias attendu par Win95Portfolio.jsx
  title: 'Développeur Web Full Stack',
  tagline: "Je construis des apps web modernes pour l'Afrique",
  agency: 'akaTech',
  agencyUrl: 'https://akatech.vercel.app/',
  site: 'https://akatech.vercel.app/', // alias attendu par Win95Portfolio.jsx
  location: "Abidjan, Côte d'Ivoire",
  email: 'wthomasss06@gmail.com',
  phone: '+225 01 42 50 77 50',
  whatsapp: '+225 01 42 50 77 50', // format brut — Win95 fait .replace(/\D/g,'') dessus
  whatsappUrl: 'https://wa.me/2250142507750',
  github: 'https://github.com/wthomasss06-stack',
  // App.jsx (code live, 2 occurrences) + Win95Portfolio.jsx utilisent cette version
  // courte -> traitée comme canonique. Le README, lui, a la version longue
  // "m-bollo-aka-60a1b1340" : à corriger dans le README si la courte est bien la bonne.
  linkedin: 'https://www.linkedin.com/in/m-bollo-aka',
  facebook: 'https://web.facebook.com/profile.php?id=61577494705852',
  photo: '/assets/images/IMG_20250124_124101KK.webp',
  cv: '/assets/CV_MBOLLO_aka_ELVIS.pdf',
}

// ─── Projets ────────────────────────────────────────────────────
// Version App.jsx (la plus complète : narratif problem/solution/result,
// variantes d'images). Win95Portfolio.jsx a une version plus pauvre
// (mêmes projets, sans le narratif) — à migrer vers celle-ci.
export const PROJECTS = [
  { id: 1, title: 'ShopCI', sub: 'Marketplace E-commerce', cat: 'en-ligne', img: '/assets/images/projects/monmarket-preview.webp', responsive: '/assets/images/projects/shopci-responsive.webp', imgFb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600', tech: ['React', 'Django', 'Bootstrap 5', 'Vercel + PythonAnywhere'], url: 'https://shop-ci.vercel.app/', desc: "Marketplace multi-vendeurs conçue pour répondre aux problèmes de fiabilité, de visibilité et de gestion des ventes dans le e-commerce local ivoirien.", year: '2026',
    private: true,
    problem: "Les vendeurs locaux n'avaient pas de vitrine en ligne fiable pour centraliser leurs produits et rassurer les acheteurs.",
    solution: "Marketplace multi-vendeurs avec back-office Django, fiches produits structurées et parcours d'achat simplifié.",
    result: "Estimation : temps de mise en ligne d'un produit réduit à quelques minutes pour un vendeur, contre plusieurs heures avant." },
  { id: 2, title: 'TechFlow', sub: 'Site Vitrine Professionnel', cat: 'en-ligne', img: '/assets/images/projects/techflow-preview.webp', responsive: '/assets/images/projects/techflow.webp', imgFb: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600', tech: ['HTML / Tailwind CSS', 'JavaScript', 'Vercel'], url: 'https://techflow-ten.vercel.app/', desc: 'Site vitrine moderne destiné à présenter une activité technologique de manière claire et professionnelle.', year: '2026',
    problem: "Le client n'avait aucune présence web pour présenter son activité tech de façon crédible.",
    solution: "Site vitrine one-page rapide, structuré autour de l'offre et des preuves de confiance.",
    result: "Estimation : site livré en moins d'une semaine, prêt à être partagé en prospection commerciale." },
  { id: 3, title: 'TerraSafe', sub: 'Marketplace Foncière', cat: 'en-ligne', img: '/assets/images/projects/terrasafe-preview.webp', responsive: '/assets/images/projects/terrasafe.webp', imgFb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600', tech: ['Python/Flask', 'MySQL', 'JavaScript', 'Bootstrap 5'], url: 'https://wthomassss06.pythonanywhere.com', desc: "Plateforme foncière visant à réduire les risques d'arnaques liées à la vente de terrains. Backend sécurisé avec recherche avancée.", year: '2026',
    problem: "Trop d'arnaques sur la vente de terrains, faute de vérification des annonces et des vendeurs.",
    solution: "Backend sécurisé Flask/MySQL avec recherche avancée et structuration des annonces foncières.",
    result: "Architecture validée qui a servi de socle technique à NEXURA — preuve qu'elle tenait la route à l'échelle." },
  { id: 4, title: 'Chap-chapMAP', sub: 'Navigation Intelligente', cat: 'demo', img: '/assets/images/projects/chapchapmap-preview.webp', responsive: '/assets/images/projects/chapchapmap.webp', imgFb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600', tech: ['JavaScript', 'Leaflet.js', 'OSRM API', 'Geolocation API'], url: '/demos/chap-chapMAP.html', desc: "Application de cartographie intelligente permettant de localiser un utilisateur en temps réel et de calculer des itinéraires optimisés.", year: '2023',
    problem: "Se déplacer efficacement à Abidjan sans application de navigation locale fiable.",
    solution: "Cartographie interactive avec géolocalisation temps réel et calcul d'itinéraires via l'API OSRM.",
    result: "Démo technique validant la maîtrise des API de cartographie et de géolocalisation en conditions réelles." },
  { id: 5, title: 'ElvisMarket', sub: 'Interface E-commerce', cat: 'demo', img: '/assets/images/projects/elvismarket-preview.webp', responsive: '/assets/images/projects/elvismarket.webp', imgFb: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600', tech: ['HTML + JS vanilla', 'Tailwind CSS', 'LocalStorage'], url: '/demos/projet2.html', desc: "Interface e-commerce développée pour expérimenter la gestion d'état, le panier dynamique et l'optimisation de l'UX.", year: '2023',
    problem: "Maîtriser la gestion d'état et le panier dynamique en JS vanilla, sans framework, avant de passer à l'échelle.",
    solution: "Interface e-commerce complète construite en JS vanilla + LocalStorage, sans dépendance lourde.",
    result: "Projet d'entraînement dont l'architecture front a directement nourri ShopCI et TechFlow." },
  { id: 6, title: 'MonCashJour', sub: 'Gestion de Ventes', cat: 'demo', img: '/assets/images/projects/moncashjour-preview.webp', responsive: '/assets/images/projects/moncashjour.webp', imgFb: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600', tech: ['HTML + JS vanilla', 'Tailwind CSS', 'Chart.js'], url: '/demos/projet1.html', desc: 'Application de gestion de ventes quotidiennes destinée aux petits commerçants.', year: '2023',
    problem: "Les petits commerçants n'ont pas d'outil simple pour suivre leurs ventes journalières.",
    solution: "Application de gestion de ventes avec visualisation Chart.js, pensée pour un usage terrain rapide.",
    result: "Estimation : saisie et suivi des ventes du jour en moins de 2 minutes pour un commerçant." },
  { id: 7, title: 'LivreurTrack Pro', sub: 'Suivi Logistique', cat: 'demo', img: '/assets/images/projects/livreurtrack-preview.webp', responsive: '/assets/images/projects/livreurtrack.webp', imgFb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', tech: ['JavaScript', 'Bootstrap 5', 'LocalStorage', 'Camera API'], url: '/demos/projet3.html', desc: "Système de suivi logistique simulant un workflow réel de livraison, avec validation par photo et suivi d'étapes.", year: '2023',
    problem: "Les livraisons locales manquent de traçabilité : pas de preuve de dépôt, pas de suivi d'étapes.",
    solution: "Système de suivi logistique avec validation photo (Camera API) et statuts de livraison en direct.",
    result: "Simulation d'un vrai workflow logistique, de la prise en charge jusqu'à la preuve de livraison." },
  { id: 8, title: 'LinkedIn Banner Pro', sub: 'Générateur SaaS', cat: 'en-cours', img: '/assets/images/projects/linkedin-banner-preview.webp', responsive: '/assets/images/projects/linkedin-banner.webp', imgFb: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600', tech: ['JavaScript', 'Canvas API', 'Tailwind CSS'], url: '/demos/projet7.html', desc: 'Outil SaaS en cours de développement permettant de générer des bannières LinkedIn professionnelles.', year: '2026',
    problem: "Créer une bannière LinkedIn pro demande des outils de design payants ou complexes à prendre en main.",
    solution: "Générateur SaaS avec rendu Canvas API, pensé pour un export rapide sans compétence design.",
    result: "Projet en cours — objectif : générer une bannière personnalisée en moins de 60 secondes." },
  { id: 9, title: 'Tati', sub: 'Portfolio & Vitrine Moderne', cat: 'en-ligne', img: '/assets/images/projects/tati-preview.webp', responsive: '/assets/images/projects/tati.webp', imgFb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'], url: 'https://tatii.vercel.app/', desc: 'Portfolio personnel double fonction avec animations fluides, thème sombre/clair, design 100% responsive.', year: '2026',
    github: 'https://github.com/wthomasss06-stack/tatii',
    problem: "Besoin d'un portfolio personnel qui sorte du template classique, avec une vraie identité visuelle.",
    solution: "Portfolio React/Framer Motion sur-mesure, thème clair/sombre, animations soignées de bout en bout.",
    result: "Livré et déployé en production — utilisé activement comme vitrine professionnelle." },
  { id: 10, title: 'MK', sub: 'Portfolio Graphiste Client', cat: 'en-ligne', img: '/assets/images/projects/mk-preview.webp', responsive: '/assets/images/projects/mk.webp', imgFb: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600', tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'], url: 'https://mory01ff.vercel.app/', desc: 'Portfolio professionnel sur-mesure pour un client graphiste. Galerie immersive, animations soignées.', year: '2026',
    problem: "Un graphiste avait besoin d'une galerie en ligne qui valorise ses créations sans les noyer dans un template.",
    solution: "Portfolio sur-mesure avec galerie immersive et animations pensées pour mettre le visuel en avant.",
    result: "Livré au client et en ligne — sert de vitrine commerciale directe pour ses prestations." },
  { id: 11, title: 'ManoBeat 777', sub: 'Portfolio Beatmaker', cat: 'en-ligne', img: '/assets/images/projects/beatstore-preview.webp', responsive: '/assets/images/projects/beatstore.webp', imgFb: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', tech: ['React', 'Tailwind CSS', 'Howler.js', 'Vercel'], url: 'https://xxx-x.vercel.app/', desc: "Portfolio d'un beatmaker ivoirien : découvrez et écoutez ses créations directement en ligne.", year: '2026',
    problem: "Un beatmaker ivoirien n'avait aucun moyen de faire écouter ses créations en ligne de façon professionnelle.",
    solution: "Portfolio audio avec lecteur intégré Howler.js pour écouter les créations directement sur le site.",
    result: "Estimation : écoute d'un beat ramenée à un simple clic, sans passer par un lien externe." },
  { id: 12, title: 'New Horizon Service', sub: 'Location de Résidences', cat: 'en-ligne', img: '/assets/images/projects/newhorizon-preview.webp', responsive: '/assets/images/projects/newhorizon.webp', imgFb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600', tech: ['Next.js', 'Flask', 'Python', 'MySQL', 'Vercel'], url: 'https://new-horizonservice.vercel.app/', desc: 'Plateforme de location de résidences meublées haut de gamme avec backend Flask sécurisé.', year: '2026',
    github: 'https://github.com/wthomasss06-stack/AllonsSomo',
    problem: "Les résidences meublées haut de gamme manquaient d'une plateforme de location fiable et sécurisée.",
    solution: "Plateforme Next.js/Flask avec backend sécurisé pour la gestion des annonces et des réservations.",
    result: "En production — a servi de base validée avant l'évolution vers NEXURA." },
  { id: 13, title: 'akaTech', sub: 'Agence Digitale Abidjan', cat: 'en-ligne', img: '/assets/images/projects/akatech-preview.webp', responsive: '/assets/images/projects/akatech.webp', imgFb: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600', tech: ['Next.js 15', 'Framer Motion', 'WebGL Aurora', 'Vercel'], url: 'https://akatech.vercel.app/', desc: "Site officiel de mon agence — akaTech accompagne les entrepreneurs et PME en Côte d'Ivoire.", year: '2026',
    github: 'https://github.com/wthomasss06-stack/akatech-agencenext',
    problem: "Mon agence n'avait pas de site propre capable de convertir les prospects en clients.",
    solution: "Site agence Next.js 15 avec WebGL Aurora, animations Framer Motion et structure orientée conversion (process, pricing, projets).",
    result: "En production, indexé rapidement sur Google — sert de vitrine commerciale principale." },
  { id: 14, title: 'Université les Anges', sub: 'Site Institutionnel', cat: 'en-ligne', img: '/assets/images/projects/universitelesanges-preview.webp', responsive: '/assets/images/projects/universitelesanges.webp', imgFb: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600', tech: ['HTML', 'CSS', 'Bulma', 'Bootstrap', 'Vercel'], url: 'https://universitelesanges.vercel.app/', desc: "Site institutionnel moderne pour l'Université les Anges.", year: '2026',
    github: 'https://github.com/wthomasss06-stack/universite-les-anges',
    problem: "Une université privée avait besoin d'un site institutionnel crédible pour rassurer futurs étudiants et parents.",
    solution: "Site institutionnel structuré (présentation, filières, contact) en HTML/Bulma/Bootstrap.",
    result: "Livré et en ligne — utilisé comme point d'entrée officiel de l'établissement." },
  { id: 15, title: 'NEXURA', sub: 'Marketplace Nouvelle Génération', cat: 'en-ligne', img: '/assets/images/projects/nexura-preview.webp', responsive: '/assets/images/projects/nexura-responsive.webp', imgFb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600', tech: ['Next.js 14', 'Django REST', 'PostgreSQL', 'WebSockets', 'Redis & Celery'], url: 'https://nexura-one.vercel.app/', desc: "Marketplace nouvelle génération — évolution de TerraSafe. Location de résidences meublées, motos & véhicules, bureaux & salles de conférence, terrains & immobilier. Auth sécurisée, KYC intégré, temps réel.", year: '2026',
    private: true,
    problem: "TerraSafe avait besoin de passer à l'échelle : plus de catégories, plus de sécurité, du temps réel.",
    solution: "Marketplace nouvelle génération Next.js 14 + Django REST + WebSockets, KYC intégré, architecture pensée pour réduire le risque légal.",
    result: "Projet le plus avancé techniquement du portfolio — repo privé (client), en évolution continue." },
  { id: 16, title: 'KokoEat', sub: 'Livraison Alimentaire', cat: 'en-cours', img: '/assets/images/projects/kokoeat-preview.webp', responsive: '/assets/images/projects/kokoeat-responsive.webp', imgFb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', tech: ['React', 'Django REST', 'PostgreSQL', 'Vercel'], url: '#', desc: "Application de livraison de repas pensée pour le marché ivoirien. Commande en ligne, suivi en temps réel et paiement Mobile Money.", year: '2026',
    problem: "Le marché ivoirien manque d'une app de livraison de repas pensée pour le paiement Mobile Money.",
    solution: "App de commande en ligne avec suivi temps réel et intégration Mobile Money prévue.",
    result: "Projet en cours de développement." },
  { id: 17, title: 'Jean Edy · Portfolio', sub: 'Portfolio React UI Avancé', cat: 'en-ligne', img: '/assets/images/projects/jean-edy-preview.webp', responsive: '/assets/images/projects/jean-edy.webp', imgFb: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600', tech: ['React 18', 'Vite', 'GSAP', 'Framer Motion', 'TailwindCSS'], url: 'https://jean-edy-dev.vercel.app/', desc: "Portfolio personnel de Jean Edy — Software Developer basé à Abidjan. et skeuomorphisme complet.", year: '2026',
    private: true,
    problem: "Un développeur avait besoin d'un portfolio qui démontre un niveau UI avancé pour ses candidatures.",
    solution: "Portfolio React 18/GSAP avec direction artistique skeuomorphisme complet, sur-mesure.",
    result: "Livré et en ligne — repo privé (client)." },
  { id: 18, title: 'MD Laverie Pressing', sub: 'Site Vitrine Pressing', cat: 'en-ligne', img: '/assets/images/projects/laverie-preview.webp', responsive: '/assets/images/projects/laverie.webp', imgFb: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', tech: ['React 18', 'Vite', 'GSAP', 'React Router v6', 'EmailJS'], url: 'https://laverie-plus.vercel.app/', desc: "Site vitrine complet pour MD Laverie Pressing, Abidjan. Hero slider GSAP, grille packs pricing, formulaire contact EmailJS.", year: '2026',
    github: 'https://github.com/wthomasss06-stack/PRESSING',
    problem: "Un pressing à Abidjan n'avait aucune présence en ligne pour présenter ses tarifs et être contacté.",
    solution: "Site vitrine React/GSAP avec hero slider, grille de tarifs claire et formulaire de contact EmailJS.",
    result: "Livré et en ligne — génère des demandes de contact directement depuis le site." },
  { id: 19, title: 'Chez Florence', sub: 'Vente & Réservation de Lapins', cat: 'en-ligne', img: '/assets/images/projects/chez-florence-preview.webp', responsive: '/assets/images/projects/chez-florence-responsive.webp', responsive2: '/assets/images/projects/chez-florence-responsive2.webp', imgFb: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600', tech: ['Next.js 14', 'Express.js', 'Prisma', 'PostgreSQL (Neon)', 'Cloudinary'], url: 'https://lapinou.vercel.app/', desc: "Plateforme de présentation et réservation de lapins pour éleveurs et particuliers : fiches par race, réservation en ligne, stock synchronisé en temps réel et notification WhatsApp automatique.", year: '2026',
    problem: "Les éleveurs de lapins n'avaient aucune vitrine en ligne pour présenter leurs races et centraliser les réservations.",
    solution: "App Next.js/Express avec fiches détaillées par race, réservation en ligne (quantité, stock auto-décrémenté) et double notification — email admin et WhatsApp pré-rempli.",
    result: "PWA installable avec tableau de bord admin (stock, réservations, stats de vente) — livré et en production." },
]

// ─── Tarifs ─────────────────────────────────────────────────────
// ⚠️ Win95Portfolio.jsx avait des prix DIFFÉRENTS (ex: portfolio Starter
// à 70 000 FCFA au lieu de 100 000). Version ci-dessous confirmée par
// recoupement avec le README et le JSON-LD (useSEO.jsx) — donc traitée
// comme la version correcte/actuelle. À confirmer de ton côté.
export const PRICING_TABS = [
  {
    key: 'portfolio', label: 'Portfolio',
    plans: [
      { title: 'Starter', price: '100 000 FCFA', delivery: '3 à 5 jours' },
      { title: 'Standard', price: '175 000 FCFA', delivery: '5 à 7 jours', isPopular: true },
      { title: 'Premium', price: '275 000 FCFA', delivery: '7 à 10 jours' },
    ],
    rows: [
      { label: 'Nombre de pages', cells: ['3 pages', '5 pages', 'Illimité'] },
      { label: 'Design responsive', cells: [true, true, true] },
      { label: 'Animations modernes', cells: [false, true, true] },
      { label: 'Section projets', cells: [true, true, true] },
      { label: 'Formulaire contact', cells: [true, true, true] },
      { label: 'SEO', cells: [false, 'SEO de base', 'SEO + AEO/GEO'] },
      { label: 'CRO (CTA + preuve sociale)', cells: [false, false, true] },
      { label: 'Projets détaillés', cells: [false, true, true] },
      { label: 'Design personnalisé', cells: [false, false, true] },
      { label: 'Blog intégré', cells: [false, false, true] },
      { label: 'Optimisation perf. (SXO)', cells: [false, false, true] },
      { label: 'Nom de domaine (1 an)', cells: [true, true, true] },
      { label: 'Hébergement (1 an)', cells: [true, true, true] },
      { label: 'Support', cells: [false, false, '1 mois'] },
      { label: 'Maintenance mensuelle', cells: ['20 000 à 40 000/mois', '20 000 à 40 000/mois', '20 000 à 40 000/mois'] },
    ],
  },
  {
    key: 'vitrine', label: 'Site Vitrine',
    plans: [
      { title: 'Starter', price: '220 000 FCFA', delivery: '5 à 7 jours' },
      { title: 'Pro', price: '350 000 FCFA', delivery: '7 à 10 jours', isPopular: true },
      { title: 'Elite', price: '550 000 FCFA', delivery: '10 à 14 jours' },
    ],
    rows: [
      { label: 'Nombre de pages', cells: ['5 pages', '10 pages', '15–20 pages'] },
      { label: 'Design responsive', cells: [true, true, true] },
      { label: 'Design premium', cells: [false, true, true] },
      { label: 'Design sur mesure', cells: [false, false, true] },
      { label: 'Formulaire contact', cells: [true, true, true] },
      { label: 'SEO', cells: ['Base', 'Avancé (SEO + AEO)', 'SEO + AEO + GEO + Analytics'] },
      { label: 'CRO (CTA + preuve sociale)', cells: [false, true, true] },
      { label: 'Optimisation SXO', cells: [false, true, true] },
      { label: 'Blog intégré', cells: [false, true, true] },
      { label: 'CMS complet', cells: [false, false, true] },
      { label: 'Nom de domaine (1 an)', cells: [true, true, true] },
      { label: 'Hébergement (1 an)', cells: [false, true, true] },
      { label: 'Support', cells: ['1 mois', '3 mois', '6 mois'] },
      { label: 'Formation', cells: [false, '2h', 'Complète'] },
      { label: 'Maintenance mensuelle', cells: ['20 000 à 40 000/mois', '20 000 à 40 000/mois', '20 000 à 40 000/mois'] },
      { label: 'Page supp.', cells: ['15 000 à 25 000 FCFA', '15 000 à 25 000 FCFA', '15 000 à 25 000 FCFA'] },
    ],
  },
  {
    key: 'ecommerce', label: 'E-commerce',
    plans: [
      { title: 'Starter', price: '450 000 FCFA', delivery: '14 jours' },
      { title: 'Pro', price: '750 000 FCFA', delivery: '21 jours', isPopular: true },
      { title: 'Elite', price: '1 200 000 FCFA', delivery: '30 jours' },
    ],
    rows: [
      { label: 'Produits', cells: ["Jusqu'à 50", '200–500', 'Illimités'] },
      { label: 'Paiement Mobile Money', cells: [true, true, true] },
      { label: 'Multi-paiement', cells: [false, true, true] },
      { label: 'API paiement custom', cells: [false, false, true] },
      { label: 'Gestion commandes', cells: [true, true, true] },
      { label: 'Gestion stock temps réel', cells: [false, true, true] },
      { label: 'Tableau de bord', cells: [true, true, true] },
      { label: 'SEO produits (SEO/AEO)', cells: [false, true, true] },
      { label: 'Optimisation IA (GEO)', cells: [false, false, true] },
      { label: "CRO (tunnel d'achat optimisé)", cells: [false, true, true] },
      { label: 'Analytics', cells: [false, true, true] },
      { label: 'Rapports avancés', cells: [false, false, true] },
      { label: 'Automatisations', cells: [false, false, true] },
      { label: 'Nom de domaine (1 an)', cells: [true, true, true] },
      { label: 'Hébergement (1 an)', cells: [true, true, true] },
      { label: 'Support', cells: ['1 mois', '3 mois', '6 mois'] },
      { label: 'Formation', cells: [false, 'Admin', 'Équipe'] },
      { label: 'Maintenance mensuelle', cells: ['20 000 à 40 000/mois', '20 000 à 40 000/mois', '20 000 à 40 000/mois'] },
    ],
  },
  {
    key: 'saas', label: 'App Web / SaaS',
    plans: [
      {
        title: 'Sur devis', price: 'Étude personnalisée', delivery: 'Après diagnostic gratuit',
        desc: "Chaque projet SaaS est unique. J'étudie la complexité réelle (architecture, intégrations, sécurité, volume) avant de donner un prix juste et engageant."
      },
    ],
    rows: [
      { label: 'Diagnostic gratuit de votre besoin', cells: [true] },
      { label: 'Authentification + rôles', cells: [true] },
      { label: 'API REST', cells: [true] },
      { label: 'Dashboard sur mesure', cells: [true] },
      { label: 'Intégrations tierces (paiement, email…)', cells: [true] },
      { label: 'Multi-tenant (si besoin)', cells: [true] },
      { label: 'Onboarding optimisé (CRO)', cells: [true] },
      { label: 'Déploiement cloud', cells: [true] },
      { label: 'Devis détaillé sous 48h', cells: [true] },
      { label: 'Accompagnement post-lancement', cells: [true] },
    ],
  },
  {
    key: 'gbp', label: 'Fiche Google',
    plans: [
      { title: 'Création', price: '20 000 FCFA', delivery: '1 à 2 jours', isPopular: true, desc: "Vous n'avez pas encore de fiche Google ? Création complète de zéro." },
      { title: 'Optimisation', price: '12 000 FCFA', delivery: '1 jour', desc: 'Fiche déjà existante ? On corrige et améliore ce qui est en place.' },
      { title: 'Suivi mensuel', price: '10 000 FCFA/mois', delivery: 'Continu', desc: 'Gestion continue : avis, publications et statistiques chaque mois.' },
    ],
    rows: [
      { label: 'Création de la fiche (de zéro)', cells: [true, false, false] },
      { label: 'Vérification infos (NAP)', cells: [true, true, false] },
      { label: 'Horaires + zone de service', cells: [true, true, false] },
      { label: 'Catégorie + attributs', cells: [true, true, false] },
      { label: 'Lien vers le site web', cells: [true, true, false] },
      { label: 'Ajout photos (logo, local, produits)', cells: [true, true, false] },
      { label: 'Description optimisée SEO local', cells: [true, true, false] },
      { label: "Mots-clés locaux ciblés", cells: [true, true, false] },
      { label: 'Intégration carte sur le site', cells: [true, false, false] },
      { label: 'Réponse aux avis clients', cells: [false, false, true] },
      { label: 'Posts Google réguliers', cells: [false, false, true] },
      { label: 'Suivi statistiques de fiche', cells: [false, false, true] },
    ],
  },
]

// ─── Compétences ────────────────────────────────────────────────
// Win95Portfolio.jsx liste des compétences différentes (icônes CDN,
// pourcentages, catégorie 'autres' avec Word/Excel/etc.) — pas fusionné
// automatiquement, c'est un choix de contenu, pas juste un format.
export const SKILLS = {
  frontend: [
    { name: 'React', icon: '/assets/icons/devicon/react/react-original.svg', color: '#61DAFB' },
    { name: 'JavaScript', icon: '/assets/icons/devicon/javascript/javascript-original.svg', color: '#F7DF1E' },
    { name: 'TypeScript', icon: '/assets/icons/devicon/typescript/typescript-original.svg', color: '#3178C6' },
    { name: 'Next.js', icon: '/assets/icons/devicon/nextjs/nextjs-original.svg', color: '#ffffff' },
    { name: 'Tailwind', icon: '/assets/icons/devicon/tailwindcss/tailwindcss-original.svg', color: '#38BDF8' },
    { name: 'HTML5', icon: '/assets/icons/devicon/html5/html5-original.svg', color: '#E34F26' },
    { name: 'CSS3', icon: '/assets/icons/devicon/css3/css3-original.svg', color: '#1572B6' },
    { name: 'Bootstrap', icon: '/assets/icons/devicon/bootstrap/bootstrap-original.svg', color: '#7952B3' },
  ],
  backend: [
    { name: 'Python', icon: '/assets/icons/devicon/python/python-original.svg', color: '#4B8BBE' },
    { name: 'Flask', icon: '/assets/icons/devicon/flask/flask-original.svg', color: '#AAAAAA' },
    { name: 'Django', icon: '/assets/icons/devicon/django/django-plain.svg', color: '#44B78B' },
    { name: 'Node.js', icon: '/assets/icons/devicon/nodejs/nodejs-original.svg', color: '#539E43' },
    { name: 'MySQL', icon: '/assets/icons/devicon/mysql/mysql-original.svg', color: '#F29111' },
  ],
  tools: [
    { name: 'Git', icon: '/assets/icons/devicon/git/git-original.svg', color: '#F05032' },
    { name: 'VS Code', icon: '/assets/icons/devicon/vscode/vscode-original.svg', color: '#007ACC' },
    { name: 'GitHub', icon: '/assets/icons/devicon/github/github-original.svg', color: '#ffffff' },
    { name: 'Vercel', icon: '/assets/icons/devicon/vercel/vercel-original.svg', color: '#ffffff' },
    { name: 'Prisma', icon: '/assets/icons/devicon/prisma/prisma-original.svg', color: '#2D3748' },
  ],
}

// ─── Parcours ───────────────────────────────────────────────────
export const TIMELINE = [
  { date: '2025–2026', title: 'Développeur Freelance Fullstack', company: 'akaTech', items: ["Conception et déploiement de +10 Projets web (SaaS, e-commerce, plateformes)", "Développement d'API REST avec Django et Flask", "Mise en place de dashboards et systèmes de gestion de données"], tags: ['Freelance', 'Full-Stack', 'Django', 'React', 'SaaS'] },
  { date: 'Mai–Nov. 2025', title: 'Informaticien Stagiaire', company: "Mairie d'Agboville", items: ['Maintenance du parc informatique et du réseau', 'Support technique aux utilisateurs', 'Contribution à la gestion et numérisation des données'], tags: ['Maintenance', 'Réseau', 'Support'] },
  { date: '2023–2024', title: 'Projet Académique – ARTICI', company: 'UVCI', items: ["Plateforme web de promotion de l'artisanat local", "Travail collaboratif en équipe pluridisciplinaire", "Intégration de bonnes pratiques de sécurité"], tags: ['Frontend', 'Backend', 'Sécurité'] },
  { date: '2023–2024', title: 'Licence Réseau et Sécurité Informatique', company: 'UVCI', items: ['Formation complète en développement web, bases de données et sécurité', 'Certification E-Banking — Réf: CC/24-002485'], tags: ['Diplôme', 'Certification'] },
  { date: '2020–2021', title: 'Baccalauréat Série D', company: "Lycée Moderne d'Arrah", items: ['Mention : Assez Bien'], tags: ['Diplôme'] },
]

// ─── Enrichissement du parcours (icônes + desc courte, utilisés par ───
// Win95Portfolio.jsx / Appmobile.jsx, absents de la version App.jsx) ───
// Mappé par index : les 5 entrées sont dans le même ordre partout.
const TIMELINE_EXTRAS = [
  { icon: 'fa-rocket', desc: 'Conception et déploiement de 10+ apps web (SaaS, e-commerce, plateformes). APIs REST Django/Flask, dashboards, déploiement cloud.', progLabels: ['Apps web', 'API REST', 'Dashboards', 'Déploiement'], progValues: [95, 88, 82, 90] },
  { icon: 'fa-briefcase', desc: "Maintenance parc informatique, support technique, numérisation des données et création d'outils numériques internes.", progLabels: ['Maintenance', 'Support', 'Gestion', 'Outils'], progValues: [90, 85, 75, 80] },
  { icon: 'fa-graduation-cap', desc: "Plateforme web de promotion de l'artisanat local. Travail collaboratif pluridisciplinaire, optimisation et sécurité.", progLabels: ['Frontend', 'Backend', 'Perf.', 'Sécurité'], progValues: [80, 75, 85, 90] },
  { icon: 'fa-book', desc: 'Formation complète en développement web, bases de données et sécurité des applications.' },
  { icon: 'fa-school', desc: 'Mention : Assez Bien.' },
]
TIMELINE.forEach((t, i) => { Object.assign(t, TIMELINE_EXTRAS[i]) })


// ─── Compatibilité champs PROJECTS ───────────────────────────────
// Win95Portfolio.jsx / Appmobile.jsx utilisent .subtitle/.image/.progress/
// .isPremium/.isAgency/.color au lieu de .sub/.img — on ajoute les alias +
// les valeurs (progress/couleur) trouvées dans l'ancien Win95Portfolio.jsx,
// pour que ces fichiers puissent importer PROJECTS sans rien casser.
const PROJECT_EXTRAS = {
  1: { progress: 65, isPremium: true, color: '#0066cc' },
  2: { progress: 97, isPremium: true, color: '#006644' },
  3: { progress: 85, isPremium: true, color: '#8B0000' },
  4: { progress: 100, color: '#005580' },
  5: { progress: 100, color: '#555500' },
  6: { progress: 100, color: '#006633' },
  7: { progress: 100, color: '#660066' },
  8: { progress: 30, color: '#003366' },
  9: { progress: 100, isPremium: true, color: '#336600' },
  10: { progress: 100, isPremium: true, color: '#006699' },
  11: { progress: 100, isPremium: true, color: '#660033' },
  12: { progress: 100, isPremium: true, color: '#003355' },
  13: { progress: 100, isPremium: true, isAgency: true, color: '#002211' },
  14: { progress: 100, isPremium: true, color: '#3B006B' },
  15: { progress: 85, isPremium: true, color: '#003344' },
  16: { progress: 40, color: '#cc4400' },
  17: { progress: 100, isPremium: true, color: '#1a1a66' },
  18: { progress: 100, isPremium: true, color: '#004466' },
  19: { progress: 100, isPremium: true, color: '#7a4b1e' },
}
PROJECTS.forEach(p => {
  p.subtitle = p.sub
  p.image = p.img
  Object.assign(p, PROJECT_EXTRAS[p.id] || {})
})

// ─── Compatibilité champs PRICING_TABS ───────────────────────────
// Win95Portfolio.jsx / Appmobile.jsx / Appv4.jsx attendent plan.badge et
// plan.features (liste plate) au lieu de tab.rows (tableau comparatif).
// On dérive badge/features automatiquement à partir de rows, pour ne pas
// avoir à maintenir 2 formats à la main. Le libellé généré est un peu
// moins soigné que les listes écrites à la main à l'origine (ex :
// "Nombre de pages: 5 pages" au lieu de juste "5 pages") mais reste
// exact et se met à jour automatiquement avec les prix/tableaux.
PRICING_TABS.forEach(tab => {
  tab.plans.forEach((plan, i) => {
    if (!plan.badge) plan.badge = (plan.title || '').toUpperCase()
    if (!plan.features) {
      plan.features = (tab.rows || [])
        .map(row => {
          const cell = row.cells[i]
          if (cell === true) return row.label
          if (cell === false || cell == null) return null
          return `${row.label} : ${cell}`
        })
        .filter(Boolean)
    }
  })
})

// Version App.jsx : 14 questions orientées process de commande.
// Win95Portfolio.jsx n'a que 5 questions génériques et mentionne
// encore un prix de départ à 60 000 FCFA (obsolète) — à remplacer
// par cette version lors de la migration Win95.
// ─── FAQ ────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  { q: 'Comment se déroule le paiement de mon site ?', a: "Le paiement se fait en deux fois : 50% à la commande pour démarrer le projet, et les 50% restants à la livraison, juste avant de recevoir les fichiers finaux et les accès." },
  { q: 'Pourquoi un acompte est-il demandé avant de commencer ?', a: "L'acompte confirme votre commande et me permet de démarrer le développement immédiatement, de récupérer vos contenus (logo, textes, photos) et de vous garantir le délai annoncé. Sans acompte, le projet n'est pas priorisé dans mon planning." },
  { q: 'Quels moyens de paiement acceptez-vous ?', a: "Orange Money, MTN Mobile Money, Wave ou virement bancaire. Vous précisez votre moyen préféré au moment de la commande et je vous envoie les coordonnées correspondantes." },
  { q: 'Quel est le délai pour recevoir mon site ?', a: "Cela dépend du pack choisi : 3 à 5 jours pour un portfolio simple, davantage pour une vitrine, une boutique e-commerce ou une application plus complexe. Le délai exact est précisé dans le devis et démarre dès réception de l'acompte et de vos contenus." },
  { q: 'Quand mon site est-il mis en ligne ?', a: "Une fois le solde réglé. Avant cela, je vous partage un lien de prévisualisation pour valider le design et le contenu." },
  { q: "Puis-je voir mon site avant qu'il soit en ligne ?", a: "Oui, toujours. Vous recevez un lien de prévisualisation pour tester le site, faire vos retours et demander des ajustements avant la mise en ligne officielle." },
  { q: 'Combien de modifications sont incluses ?', a: "Les petites corrections — textes, couleurs, ajustements visuels — sont incluses pendant la phase de validation. Les modifications majeures, comme un changement de structure ou l'ajout de pages, font l'objet d'un devis complémentaire." },
  { q: 'Quel pack choisir pour mon projet ?', a: "Tout dépend de vos besoins : portfolio, vitrine, boutique e-commerce ou application plus complexe type SaaS. Je vous conseille gratuitement lors du brief initial pour identifier le pack le plus adapté." },
  { q: "Le nom de domaine et l'hébergement sont-ils vraiment gratuits ?", a: "Oui, la première année est offerte sur tous les packs. Après cette période, vous payez simplement le renouvellement — environ 15 000 à 30 000 FCFA par an selon le domaine — et je vous envoie un rappel avant l'expiration." },
  { q: 'Quels contenus dois-je fournir ?', a: "Votre logo, vos photos, vos textes de présentation et vos informations de contact. Plus ces éléments arrivent vite, plus le développement avance rapidement." },
  { q: "Je n'ai pas de logo ni de textes, pouvez-vous m'aider ?", a: "Oui. Je peux proposer un logo simple, utiliser des visuels libres de droits adaptés à votre activité, ou rédiger une trame de textes professionnels que vous ajustez ensuite. Ces services s'ajoutent au devis initial." },
  { q: 'Qui gère mon site après la livraison ?', a: "Vous. Je vous transmets tous les accès — administration, hébergement, nom de domaine — ainsi qu'un tutoriel simple pour modifier vos textes et images sans dépendre de moi." },
  { q: "Que se passe-t-il si le délai annoncé n'est pas respecté ?", a: "C'est rare, mais si cela arrive de mon fait, une pénalité s'applique sur le montant total et vous pouvez demander l'annulation du projet avec un remboursement partiel. Ces conditions figurent dans le devis signé." },
  { q: 'Mon site a un bug après la livraison, que faites-vous ?', a: "Je corrige gratuitement tout bug lié à mon développement pendant le mois suivant la livraison — inclus dans le pack Premium, possible en option sur les autres packs." },
  { q: 'Comment commander mon site ?', a: "Trois étapes : on échange sur votre projet et le pack adapté, je vous envoie un devis avec l'acompte de 50%, puis dès réception du paiement je démarre le développement." },
]

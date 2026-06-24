// ════════════════════════════════════════════════════════════════
// useSEO.jsx — Hook de méta-données dynamiques
//
// Équivalent de ce que fait next/head + generateMetadata dans AKATech.
// Utilise react-helmet-async (SSR-safe, pas de race condition).
//
// USAGE :
//   import { useSEO } from './useSEO'
//   useSEO({ title: '...', description: '...', path: '/' })
//
// Colle ça dans RootApp ou directement dans ModernApp / AppMobile.
// ════════════════════════════════════════════════════════════════

import { Helmet } from 'react-helmet-async'

// ─── Données SEO par "section" du portfolio ───────────────────
// Miroir exact de ce qu'AKATech fait dans ses page.js respectifs.
export const SEO_CONFIG = {
  default: {
    title: "M'Bollo Aka Elvis — Développeur Web Full Stack à Abidjan | AKATech",
    description:
      "M'Bollo Aka Elvis, développeur web full stack à Abidjan (Côte d'Ivoire) : sites vitrines, e-commerce, applications React/Django/Flask. Devis rapide, livraison sous 3 à 14 jours, nom de domaine et hébergement offerts 1 an.",
    keywords:
      "développeur web Abidjan, développeur full stack Côte d'Ivoire, créer un site web Abidjan, développeur React Django, AKATech, agence web Abidjan, création site e-commerce Côte d'Ivoire",
    url: 'https://akafolio160502.vercel.app/',
    image: 'https://akafolio160502.vercel.app/assets/images/IMG_20250124_124101KK.webp',
  },
}

// ─── Structured Data — Person + ProfessionalService ───────────
// Même logique que layout.js d'AKATech, adapté à un portfolio perso.
export const STRUCTURED_DATA = {
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: "M'Bollo Aka Elvis",
    alternateName: 'Aka Elvis',
    url: 'https://akafolio160502.vercel.app/',
    image: 'https://akafolio160502.vercel.app/assets/images/IMG_20250124_124101KK.webp',
    jobTitle: 'Développeur Web Full Stack',
    description:
      "Développeur web full stack basé à Abidjan, Côte d'Ivoire, spécialisé en React, Django et Flask. Fondateur de AKATech.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    email: 'mailto:wthomasss06@gmail.com',
    telephone: '+225-01-42-50-77-50',
    worksFor: {
      '@type': 'Organization',
      name: 'AKATech',
      url: 'https://akatech.vercel.app/',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'UVCI - Université Virtuelle de Côte d\'Ivoire',
      url: 'https://uvci.edu.ci/',
    },
    sameAs: [
      'https://github.com/wthomasss06-stack',
      'https://www.linkedin.com/in/m-bollo-aka-60a1b1340/',
      'https://web.facebook.com/profile.php?id=61577494705852',
      'https://akatech.vercel.app/',
    ],
    knowsAbout: [
      'Développement Web',
      'React.js',
      'Next.js',
      'Django',
      'Flask',
      'Python',
      'JavaScript',
      'MySQL',
      'GSAP',
      'Three.js',
    ],
  },

  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'AKATech',
    founder: {
      '@type': 'Person',
      name: "M'Bollo Aka Elvis",
    },
    url: 'https://akatech.vercel.app/',
    logo: 'https://akatech.vercel.app/favicon.png',
    image: 'https://akafolio160502.vercel.app/assets/images/IMG_20250124_124101KK.webp',
    description:
      "AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire avec des solutions digitales sur-mesure : sites vitrines, e-commerce, applications SaaS et portfolios modernes.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    areaServed: {
      '@type': 'Country',
      name: "Côte d'Ivoire",
    },
    priceRange: '100 000 – 1 200 000 FCFA',
    telephone: '+225-01-42-50-77-50',
    email: 'wthomasss06@gmail.com',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '20:00',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services Web AKATech',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Portfolio Web',
            description: 'Portfolio moderne animé — 3 à 14 jours, dès 100 000 FCFA',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Site Vitrine',
            description: "Site vitrine professionnel — 5 à 14 jours, dès 220 000 FCFA",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'E-commerce',
            description: "Boutique en ligne Mobile Money — dès 450 000 FCFA",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Application SaaS',
            description: 'Application web sur devis, Django + React',
          },
        },
      ],
    },
  },
}

// ─── Composant SEO Head ────────────────────────────────────────
export function SEOHead({ config = SEO_CONFIG.default }) {
  return (
    <Helmet>
      <html lang="fr" />
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      {config.keywords && <meta name="keywords" content={config.keywords} />}
      <meta name="author" content="M'Bollo Aka Elvis" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="language" content="French" />
      <meta name="geo.region" content="CI" />
      <meta name="geo.placename" content="Abidjan" />

      {/* Canonical */}
      <link rel="canonical" href={config.url || SEO_CONFIG.default.url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={config.url || SEO_CONFIG.default.url} />
      <meta property="og:title" content={config.title} />
      <meta property="og:description" content={config.description} />
      <meta property="og:image" content={config.image || SEO_CONFIG.default.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:locale" content="fr_CI" />
      <meta property="og:site_name" content="M'Bollo Aka Elvis — AKATech" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.title} />
      <meta name="twitter:description" content={config.description} />
      <meta name="twitter:image" content={config.image || SEO_CONFIG.default.image} />

      {/* Structured Data — Person */}
      <script type="application/ld+json">
        {JSON.stringify(STRUCTURED_DATA.person)}
      </script>

      {/* Structured Data — LocalBusiness / ProfessionalService */}
      <script type="application/ld+json">
        {JSON.stringify(STRUCTURED_DATA.localBusiness)}
      </script>
    </Helmet>
  )
}

// ─── Hook utilitaire (optionnel, pour override par section) ───
export function useSEO(config = {}) {
  return <SEOHead config={{ ...SEO_CONFIG.default, ...config }} />
}

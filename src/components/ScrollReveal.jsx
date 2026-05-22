/**
 * ScrollReveal.jsx — version robuste
 *
 * PROBLÈME RÉSOLU : En prod (connexion lente / Vercel cold start),
 * les titres restaient bloqués à translateY(110%) opacity:0 parce que :
 *   1. Les polices CDN ne chargeaient pas → GSAP ne calculait pas
 *      la bonne hauteur → ScrollTrigger ne s'activait pas
 *   2. IntersectionObserver échouait si l'élément était hors viewport
 *      au moment du mount
 *
 * SOLUTION : Les éléments sont VISIBLES par défaut (aucun style inline
 * qui cache). L'animation est un bonus progressif, pas un pré-requis.
 * On utilise IntersectionObserver natif (pas de dépendance GSAP).
 */

import { useEffect, useRef } from 'react'

export default function ScrollReveal({ children, delay = 0, className = '' }) {
  const wrapRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return

    // Applique le style de départ SEULEMENT si IntersectionObserver
    // est disponible (prod moderne) — sinon reste visible
    if (!('IntersectionObserver' in window)) return

    // Style initial : caché, prêt pour l'animation
    inner.style.transform = 'translateY(105%)'
    inner.style.opacity = '0'
    inner.style.transition = `transform 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 0.6s ease ${delay}ms`
    inner.style.willChange = 'transform, opacity'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Délai minimum pour laisser le layout se stabiliser
            requestAnimationFrame(() => {
              inner.style.transform = 'translateY(0%)'
              inner.style.opacity = '1'
            })
            observer.unobserve(wrap)
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px',
      }
    )

    observer.observe(wrap)

    // Filet de sécurité : si après 3s l'élément n'a pas été révélé
    // (ex: ScrollTrigger/IO bugué), on force la visibilité
    const fallback = setTimeout(() => {
      inner.style.transform = 'translateY(0%)'
      inner.style.opacity = '1'
    }, 3000)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [delay])

  return (
    <span ref={wrapRef} className={`tx-reveal ${className}`} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
      <span ref={innerRef} className="tx-inner" style={{ display: 'inline-block' }}>
        {children}
      </span>
    </span>
  )
}

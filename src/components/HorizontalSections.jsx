/**
 * HorizontalSections.jsx
 * Navigation horizontale entre sections via scroll vertical capturé
 * Effet double-wrap outer/inner xPercent (inspiré de prochain.html)
 * — Sans hint scroll —
 */
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

const SECTION_LABELS = ['Parcours', 'Mon Approche', 'Compétences', 'Services', 'Tarifs']

export default function HorizontalSections({ children }) {
  const containerRef = useRef(null)
  const currentRef   = useRef(-1)
  const animatingRef = useRef(false)
  const [activeIdx, setActiveIdx] = useState(0)

  /* Exposer goTo pour les flèches et les dots */
  const goToRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sections      = container.querySelectorAll('.hs-section')
    const outerWrappers = container.querySelectorAll('.hs-outer')
    const innerWrappers = container.querySelectorAll('.hs-inner')
    const total = sections.length
    const wrap  = gsap.utils.wrap(0, total)

    gsap.set(outerWrappers, { xPercent: 100 })
    gsap.set(innerWrappers, { xPercent: -100 })

    function goTo(index, direction) {
      index = wrap(index)
      if (animatingRef.current || index === currentRef.current) return
      animatingRef.current = true

      const dFactor = direction === -1 ? -1 : 1

      const tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'power1.inOut' },
        onComplete: () => {
          animatingRef.current = false
          setActiveIdx(index)
        }
      })

      const prev = currentRef.current
      if (prev >= 0) {
        gsap.set(sections[prev], { zIndex: 0 })
        tl.to(sections[prev], {
          xPercent: -5 * dFactor,
          autoAlpha: 0,
          duration: .75,
          ease: 'power2.inOut'
        })
      }

      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1, xPercent: 0 })

      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { xPercent: i => i ? -100 * dFactor : 100 * dFactor },
        { xPercent: 0 },
        0
      )

      currentRef.current = index
    }

    goToRef.current = goTo

    /* ── Observer wheel + touch ── */
    const obs = Observer.create({
      target: container,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onDown: () => { if (!animatingRef.current) goTo(currentRef.current - 1, -1) },
      onUp:   () => { if (!animatingRef.current) goTo(currentRef.current + 1,  1) },
      tolerance: 10,
      preventDefault: true,
    })

    /* ── Clavier ── */
    const onKey = e => {
      if (animatingRef.current) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentRef.current + 1,  1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(currentRef.current - 1, -1)
    }
    window.addEventListener('keydown', onKey)

    /* Premier slide */
    goTo(0, 1)

    return () => {
      obs.kill()
      window.removeEventListener('keydown', onKey)
      gsap.killTweensOf([sections, outerWrappers, innerWrappers])
    }
  }, [])

  const childArray = Array.isArray(children) ? children : [children]

  const handleDotClick = i => {
    if (!goToRef.current || animatingRef.current) return
    const dir = i > currentRef.current ? 1 : -1
    goToRef.current(i, dir)
  }

  return (
    <div className="hs-host" ref={containerRef}>

      {/* Sections */}
      {childArray.map((child, i) => (
        <div key={i} className="hs-section">
          <div className="hs-outer">
            <div className="hs-inner">
              <div className="hs-bg">
                {child}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicateur nom section — top left */}
      <div className="hs-section-title">
        <span>// </span>{SECTION_LABELS[activeIdx]}
      </div>

      {/* Compteur — top right */}
      <div className="hs-counter">
        <span className="hs-counter-cur">{String(activeIdx + 1).padStart(2, '0')}</span>
        <span className="hs-counter-sep"> / </span>
        <span className="hs-counter-tot">{String(childArray.length).padStart(2, '0')}</span>
      </div>

      {/* Flèche précédente */}
      <button
        className="hs-arrow hs-arrow--prev"
        aria-label="Section précédente"
        onClick={() => { if (!animatingRef.current && goToRef.current) goToRef.current(currentRef.current - 1, -1) }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Flèche suivante */}
      <button
        className="hs-arrow hs-arrow--next"
        aria-label="Section suivante"
        onClick={() => { if (!animatingRef.current && goToRef.current) goToRef.current(currentRef.current + 1, 1) }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Dots nav — bottom center */}
      <nav className="hs-nav" aria-label="Navigation entre sections">
        {SECTION_LABELS.map((lbl, i) => (
          <button
            key={i}
            className={`hs-nav-dot${i === activeIdx ? ' active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={lbl}
            title={lbl}
          >
            <span className="hs-nav-label">{lbl}</span>
          </button>
        ))}
      </nav>

    </div>
  )
}

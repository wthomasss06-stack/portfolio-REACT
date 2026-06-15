import { useEffect, useRef, Children, cloneElement } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

/*
  SectionSlider.jsx
  ─────────────────────────────────────────────────────────────────
  Wrappe les sections du portfolio dans le système de slide
  vertical GSAP Observer de prochain.html.

  • Chaque child devient une "slide" full-screen
  • Observer capture wheel/touch → transition yPercent outer+inner
  • La navbar reçoit l'index actif via un event custom 'sectionChange'
  • Les sections avec contenu scrollable (gallery, timeline, hscroll)
    sont détectées et on laisse le scroll natif dedans avant de passer
    à la slide suivante

  Usage dans App.jsx :
    <SectionSlider>
      <Hero />
      <StickyStack />
      ...
      <Footer />
    </SectionSlider>
─────────────────────────────────────────────────────────────────
*/

/* Sections qui ont un scroll interne → nécessitent d'atteindre
   le bord avant de changer de slide */
const SCROLLABLE_IDS = [
  'gallery-section',
  'timeline-section',
  'hscroll-section',
  'showcase-section',
]

export default function SectionSlider({ children, onSectionChange }) {
  const containerRef  = useRef(null)
  const slidesRef     = useRef([])
  const outersRef     = useRef([])
  const innersRef     = useRef([])
  const currentRef    = useRef(0)
  const animatingRef  = useRef(false)
  const observerRef   = useRef(null)
  const tlRef         = useRef(null)

  const slides = Children.toArray(children)
  const N      = slides.length

  useEffect(() => {
    const wrap = gsap.utils.wrap(0, N)

    const secs   = slidesRef.current.slice(0, N)
    const outers = outersRef.current.slice(0, N)
    const inners = innersRef.current.slice(0, N)
    const bgs    = secs.map(s => s?.querySelector('.ss-bg, .hv4-scene-wrap, .sec, section > div') || s)

    /* ── Positions initiales ── */
    gsap.set(secs,   { autoAlpha: 0, zIndex: 0 })
    gsap.set(outers, { yPercent: 100 })
    gsap.set(inners, { yPercent: -100 })

    /* ── gotoSection ── */
    function gotoSection(index, direction) {
      index = wrap(index)
      if (index === currentRef.current && currentRef.current !== -1) return
      animatingRef.current = true

      const dFactor = direction === -1 ? -1 : 1
      const prev    = currentRef.current

      if (tlRef.current) tlRef.current.kill()

      const tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'power1.inOut' },
        onComplete: () => { animatingRef.current = false },
      })
      tlRef.current = tl

      /* Sortie section précédente */
      if (prev >= 0 && secs[prev]) {
        gsap.set(secs[prev], { zIndex: 0 })
        tl.to(outers[prev], { yPercent: -100 * dFactor }, 0)
          .to(inners[prev], { yPercent:  100 * dFactor }, 0)
          .set(secs[prev], { autoAlpha: 0 }, '>')
      }

      /* Entrée nouvelle section */
      if (secs[index]) {
        gsap.set(secs[index], { autoAlpha: 1, zIndex: 1 })
        tl.fromTo(outers[index],
          { yPercent:  100 * dFactor },
          { yPercent: 0 }, 0
        )
        .fromTo(inners[index],
          { yPercent: -100 * dFactor },
          { yPercent: 0 }, 0
        )
      }

      currentRef.current = index

      /* Notifier navbar */
      onSectionChange?.(index)
      const sectionEl = secs[index]?.querySelector('section[id]') || secs[index]
      const id = sectionEl?.id || ''
      window.dispatchEvent(new CustomEvent('sectionChange', { detail: { index, id } }))
    }

    /* ── Détecter si on est au bord d'une section scrollable ── */
    function isAtScrollBoundary(el, direction) {
      if (!el) return true
      const scrollEl = el.querySelector('[style*="overflow"],.pricing-scroll-outer,.gallery-container') || el
      const { scrollTop, scrollHeight, clientHeight } = scrollEl
      if (direction === 1)  return scrollTop + clientHeight >= scrollHeight - 4  // bas atteint
      if (direction === -1) return scrollTop <= 4                                  // haut atteint
      return true
    }

    /* ── Observer ── */
    observerRef.current = Observer.create({
      target:      containerRef.current,
      type:        'wheel,touch,pointer',
      wheelSpeed:  -1,
      tolerance:   12,
      preventDefault: false, // laisser scroll interne fonctionner
      onDown: () => {
        if (animatingRef.current) return
        const cur = secs[currentRef.current]
        const id  = cur?.querySelector('section[id]')?.id || ''
        if (SCROLLABLE_IDS.includes(id) && !isAtScrollBoundary(cur, -1)) return
        gotoSection(currentRef.current - 1, -1)
      },
      onUp: () => {
        if (animatingRef.current) return
        const cur = secs[currentRef.current]
        const id  = cur?.querySelector('section[id]')?.id || ''
        if (SCROLLABLE_IDS.includes(id) && !isAtScrollBoundary(cur, 1)) return
        gotoSection(currentRef.current + 1, 1)
      },
    })

    /* ── Première slide ── */
    gsap.set(secs[0], { autoAlpha: 1, zIndex: 1 })
    gsap.set(outers[0], { yPercent: 0 })
    gsap.set(inners[0], { yPercent: 0 })
    currentRef.current = 0
    onSectionChange?.(0)

    /* ── Écouter scrollTo (navbar) ── */
    const handleScrollTo = (e) => {
      const targetId = e.detail?.id
      if (!targetId) return
      const idx = secs.findIndex(s =>
        s?.querySelector(`#${targetId}`) ||
        s?.id === targetId
      )
      if (idx >= 0 && idx !== currentRef.current) {
        gotoSection(idx, idx > currentRef.current ? 1 : -1)
      }
    }
    window.addEventListener('sliderScrollTo', handleScrollTo)

    return () => {
      observerRef.current?.kill()
      if (tlRef.current) tlRef.current.kill()
      window.removeEventListener('sliderScrollTo', handleScrollTo)
    }
  }, [N])

  return (
    <div
      ref={containerRef}
      className="ss-slider-container"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {slides.map((child, i) => (
        <div
          key={i}
          ref={el => slidesRef.current[i] = el}
          className="ss-slider-slide"
          style={{
            position: 'absolute',
            inset: 0,
            visibility: 'hidden',
            zIndex: 0,
          }}
        >
          {/* Outer : clip du slide-in/out */}
          <div
            ref={el => outersRef.current[i] = el}
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
          >
            {/* Inner : contre-mouvement pour effet parallax neutre */}
            <div
              ref={el => innersRef.current[i] = el}
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden auto',  /* scroll interne possible */
              }}
            >
              {child}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

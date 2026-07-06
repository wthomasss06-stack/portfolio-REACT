import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

/*
  AnimatedSections.jsx
  ─────────────────────────────────────────────────────────────────
  Remplace StickyStack dans App.jsx.

  Mécanique : inspirée de prochain.html
  • N slides en position: fixed + visibility:hidden
  • GSAP Observer capture wheel / touch / pointer
  • Transition : outer (yPercent 100→0) + inner (yPercent -100→0)
    + parallax de l'image de fond + chars SplitText stagger

  Design : adapté au portfolio akaTech (couleurs ss-01…ss-dark3,
  bg-dots, fonts var(--fd), accent #FF5500)
  ─────────────────────────────────────────────────────────────────
*/

const SLIDES = [
  {
    num: '01 — UI / UX',
    title: 'INTERFACES\n& ÉMOTIONS',
    body: "J'aime créer des interfaces qui bougent, respirent et donnent une vraie sensation d'expérience. Beaucoup de mes inspirations viennent du motion design, des sites immersifs et des expériences web modernes.",
    cls: 'as-s1',
    bg: 'rgba(10,10,10,1)',
    dotsClass: 'bg-dots',
  },
  {
    num: '02 — Produit & Solutions',
    title: 'PRODUITS\nUTILES',
    body: "Je développe des solutions web pensées pour résoudre de vrais problèmes : plateformes, dashboards, outils métier, systèmes de gestion ou expériences SaaS orientées usages réels.",
    cls: 'as-s2',
    bg: '#FFFFFF',
    dotsClass: 'bg-dots-acc',
  },
  {
    num: '03 — Sécurité d\'abord',
    title: 'SÉCURITÉ\nD\'ABORD',
    body: "Ancien étudiant en réseau et sécurité informatique, j'ai gardé une vraie logique de protection et de structure dans ma manière de développer : authentification, permissions, validation et architecture propre.",
    cls: 'as-s3',
    bg: '#110700',
    dotsClass: 'bg-dots',
  },
  {
    num: '04 — Autodidacte',
    title: 'CURIEUX\n& AUTODIDACTE',
    body: "Je suis en grande partie autodidacte. J'apprends vite, j'expérimente beaucoup et je progresse projet après projet. akaTech est devenu mon terrain d'expression pour transformer mes idées en expériences web concrètes.",
    cls: 'as-s4',
    bg: 'var(--bg)',
    dotsClass: 'bg-dots',
  },
]

/* ── Mini SplitText maison (pas de dépendance club GSAP) ── */
function splitToChars(el) {
  const raw = el.textContent
  el.innerHTML = raw.split(/(\s+)/).map(part => {
    if (!part.trim()) return `<span style="display:inline-block;width:.28em"> </span>`
    const chars = part.split('').map(c =>
      `<span class="as-ch" style="display:inline-block;will-change:transform,opacity">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('')
    return `<span style="display:inline-block">${chars}</span>`
  }).join('')
  return el.querySelectorAll('.as-ch')
}

export default function AnimatedSections() {
  const containerRef  = useRef(null)
  const sectionsRef   = useRef([])
  const bgRef         = useRef([])
  const headingRef    = useRef([])
  const currentRef    = useRef(-1)
  const animatingRef  = useRef(false)
  const observerRef   = useRef(null)
  const splitCache    = useRef([])
  const tlRef         = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const secs   = sectionsRef.current
    const bgs    = bgRef.current
    const wrap   = gsap.utils.wrap(0, SLIDES.length)

    /* ── Split headings una tantum ── */
    headingRef.current.forEach((el, i) => {
      if (!el) return
      splitCache.current[i] = splitToChars(el)
      // Posizione iniziale (fuori) per tutti
      gsap.set(splitCache.current[i], { yPercent: 120, autoAlpha: 0 })
    })

    /* ── Position initiale des wrappers ── */
    const outers = secs.map(s => s.querySelector('.as-outer'))
    const inners = secs.map(s => s.querySelector('.as-inner'))

    gsap.set(outers, { yPercent: 100 })
    gsap.set(inners, { yPercent: -100 })

    /* ─────────────────────────────────────────
       gotoSection — cœur de l'animation
    ───────────────────────────────────────── */
    function gotoSection(index, direction) {
      index = wrap(index)
      animatingRef.current = true

      const dFactor = direction === -1 ? -1 : 1
      const prev    = currentRef.current

      // Tuer la timeline précédente si elle tourne encore
      if (tlRef.current) tlRef.current.kill()

      const tl = gsap.timeline({
        defaults: { duration: 1.2, ease: 'power1.inOut' },
        onComplete: () => { animatingRef.current = false },
      })
      tlRef.current = tl

      /* Sortie de la section précédente */
      if (prev >= 0) {
        gsap.set(secs[prev], { zIndex: 0 })
        tl.to(bgs[prev], { yPercent: -12 * dFactor }, 0)
          .set(secs[prev], { autoAlpha: 0 }, '>')
      }

      /* Entrée de la nouvelle section */
      gsap.set(secs[index], { autoAlpha: 1, zIndex: 1 })

      tl.fromTo(
        [outers[index], inners[index]],
        { yPercent: i => i ? -100 * dFactor : 100 * dFactor },
        { yPercent: 0 },
        0
      )
      .fromTo(bgs[index], { yPercent: 12 * dFactor }, { yPercent: 0 }, 0)

      /* Chars — stagger depuis random */
      if (splitCache.current[index]?.length) {
        // Reset d'abord
        gsap.set(splitCache.current[index], { yPercent: 130 * dFactor, autoAlpha: 0 })
        tl.to(
          splitCache.current[index],
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1,
            ease: 'power2.out',
            stagger: { each: 0.022, from: 'random' },
          },
          0.18
        )
      }

      currentRef.current = index
    }

    /* ── Helpers: find scrollable descendant and check boundary ── */
    function findScrollable(el) {
      if (!el) return null
      // If the element itself is scrollable
      if (el.scrollHeight > el.clientHeight) return el
      // Otherwise look for descendant scrollable elements
      const nodes = el.querySelectorAll('*')
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        try {
          const style = window.getComputedStyle(n)
          const oy = style.overflowY
          if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay') && n.scrollHeight > n.clientHeight + 1) {
            return n
          }
        } catch (e) {
          // ignore possible cross-origin or computedStyle errors
        }
      }
      return null
    }

    function isAtScrollBoundary(el, direction) {
      if (!el) return true
      const scrollEl = findScrollable(el) || el
      const { scrollTop = 0, scrollHeight = 0, clientHeight = 0 } = scrollEl
      if (direction === 1) return scrollTop + clientHeight >= scrollHeight - 4
      if (direction === -1) return scrollTop <= 4
      return true
    }

    /* ── Observer GSAP ── */
    observerRef.current = Observer.create({
      target:      container,
      type:        'wheel,touch,pointer',
      wheelSpeed:  -1,
      tolerance:   10,
      preventDefault: false, // allow native scroll inside sections
      onDown: () => {
        if (animatingRef.current) return
        const cur = secs[currentRef.current]
        if (!isAtScrollBoundary(cur, -1)) return
        gotoSection(currentRef.current - 1, -1)
      },
      onUp: () => {
        if (animatingRef.current) return
        const cur = secs[currentRef.current]
        if (!isAtScrollBoundary(cur, 1)) return
        gotoSection(currentRef.current + 1, 1)
      },
    })

    /* ── Première slide ── */
    gotoSection(0, 1)

    return () => {
      observerRef.current?.kill()
      if (tlRef.current) tlRef.current.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="as-container"
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {SLIDES.map((slide, i) => (
        <section
          key={i}
          ref={el => sectionsRef.current[i] = el}
          className={`as-section ${slide.cls}`}
          style={{
            position: 'absolute',
            inset: 0,
            visibility: 'hidden',
            zIndex: 0,
          }}
        >
          <div className="as-outer" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <div className="as-inner" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>

              {/* Fond coloré + dot-grid */}
              <div
                ref={el => bgRef.current[i] = el}
                className={`as-bg ${slide.dotsClass}`}
                style={{ background: slide.bg }}
              >
                {/* Overlay gradient léger pour contraste texte */}
                <div className="as-overlay" />

                {/* Contenu centré */}
                <div className="as-content">
                  <div className="as-num">{slide.num}</div>

                  <h2
                    ref={el => headingRef.current[i] = el}
                    className="as-title"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {slide.title}
                  </h2>

                  <p className="as-body">{slide.body}</p>

                  {/* Indicateur de progression */}
                  <div className="as-progress">
                    {SLIDES.map((_, j) => (
                      <span
                        key={j}
                        className={`as-dot ${j === i ? 'as-dot--active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      ))}

      {/* Flèche bas (hint scroll) */}
      <div className="as-hint">
        <span>scroll</span>
        <div className="as-hint-arrow" />
      </div>
    </div>
  )
}

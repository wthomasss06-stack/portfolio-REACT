/**
 * GooeyTransition.jsx
 * ─────────────────────────────────────────────────────────
 * Transition "Volets Lignes Fines" — effet 10 du lab de transitions.
 *
 * cover  → 30 lignes passent de scaleY:0 à scaleY:1, stagger depuis le
 *          centre (les lignes du milieu partent en premier, l'effet se
 *          propage vers les bords) — l'écran se couvre en orange.
 * reveal → les mêmes lignes repassent de scaleY:1 à scaleY:0, stagger
 *          depuis les bords (la fermeture se referme vers le centre) —
 *          elles finissent déjà à scaleY:0, prêtes pour la prochaine fois.
 *
 * Adapté pour SPA React scroll-based (pas de barba) :
 *   - layer fixe plein-écran créé dynamiquement avec 30 .gooey-line
 *   - onMidpoint déclenché une fois l'écran entièrement couvert
 *   - layer retiré du DOM à la fin
 *
 * EXPORTS :
 *   runGridTransition(onMidpoint)   — impératif (loader, etc.)
 *   useGooeyTransition()            — hook React → goTo(sectionId)
 */

import { useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './GooeyTransition.css'
import './GooeyTransition.mobile.css'

/* ── Timings (effet 10 — "Volets Lignes Fines") ── */
const LINE_COUNT   = 30
const COVER_DUR    = 0.4
const COVER_STAG   = 0.5
const REVEAL_DUR   = 0.4
const REVEAL_STAG  = 0.3
const LINE_COLOR   = '#FF5500'   /* couleur des lignes — orange akaFOLIO (référence, la couleur réelle vient de GooeyTransition.css / .mobile.css) */
const EASE_COVER   = 'power3.inOut'
const EASE_REVEAL  = 'power3.inOut'

/* ── Build the transition layer ──
   variant: 'desktop' | 'mobile' → choisit la feuille de style appliquée
   (gooey-line--desktop vient de GooeyTransition.css,
    gooey-line--mobile  vient de GooeyTransition.mobile.css) */
function buildLayer(variant = 'desktop') {
  const layer = document.createElement('div')
  layer.className = `gooey-layer gooey-layer--${variant}`

  const lines = []
  for (let i = 0; i < LINE_COUNT; i++) {
    const line = document.createElement('div')
    line.className = `gooey-line gooey-line--${variant}`
    layer.appendChild(line)
    lines.push(line)
  }

  return { layer, lines }
}

/* ── Verrouille scroll-behavior:auto sur <html> et retourne un unlock ──
   Problème : après les sections sticky géantes (#hscroll-section ~1800vh,
   #hpx-section ~600vh), un scrollIntoView({behavior:'instant'}) sur 1 seul
   rAF ne suffit pas : le CSS scroll-behavior:smooth est restauré AU FRAME
   SUIVANT et reprend la main, annulant le saut avant que GSAP ne lâche
   les lignes. Le scroll revient à la position précédente, donc on
   atterrit sur la mauvaise section.
   Fix : on neutralise scroll-behavior AVANT le saut et on le restitue
   UNIQUEMENT quand les lignes sont entièrement refermées. */
function lockScrollBehavior() {
  const root = document.documentElement
  const prev = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  // Retourne la fonction de restauration
  return () => { root.style.scrollBehavior = prev }
}

/* ── Saut instantané garanti ──
   Force scrollTop directement sur window pour ignorer toute logique
   smooth résiduelle. scrollIntoView peut déclencher du smooth même
   avec behavior:'instant' si le CSS scroll-behavior:smooth est actif.
   On utilise getBoundingClientRect() + scrollY pour la position absolue :
   contrairement à offsetTop/offsetParent, ce calcul reste correct même
   quand un ancêtre est en position:sticky (ex: .fcx-sticky, .about-left,
   .sc-sticky…) — un offsetParent sticky casse silencieusement la somme
   cumulative d'offsetTop pour tout ce qui vient après dans le DOM. */
function hardJumpTo(sectionId) {
  const el = document.getElementById(sectionId)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY

  window.scrollTo({ top, left: 0, behavior: 'instant' })

  /* Sections pinnées (tunnel WebGL des projets, etc.) : ScrollTrigger ne
     recalcule son état de pin qu'à son propre prochain tick de scroll.
     Un saut programmatique instantané peut arriver "entre deux" — le
     pin-spacer garde alors la section pinnée collée en position:fixed
     par-dessus la destination (le hero, par ex.) jusqu'au scroll suivant
     de l'utilisateur. On force la resync tout de suite pour éviter ce
     flash où la destination ne s'affiche pas. */
  ScrollTrigger.update()
}

/* ── Core runner ── */
export function runGridTransition(onMidpoint, variant = 'desktop') {
  const { layer, lines } = buildLayer(variant)
  document.body.appendChild(layer)

  /* reset initial : toutes les lignes aplaties (invisibles) */
  gsap.set(lines, { scaleY: 0 })

  const tl = gsap.timeline({ onComplete: () => layer.remove() })

  /* ── COVER : les lignes se déploient depuis le centre vers les bords ── */
  tl.to(lines, {
    scaleY: 1,
    stagger: { amount: COVER_STAG, from: 'center' },
    duration: COVER_DUR,
    ease: EASE_COVER,
  }, 0)

  /* ── Midpoint : scroll une fois l'écran ENTIÈREMENT couvert ──
     Avec stagger:{amount:COVER_STAG,from:'center'}, les dernières lignes
     (aux bords) démarrent à t=COVER_STAG et durent COVER_DUR → fin de
     couverture totale à t = COVER_STAG + COVER_DUR. Le midpoint doit
     tomber après ce point, sinon on scrolle/jump alors que l'écran est
     encore partiellement transparent (on voit le contenu changer "à
     travers" les lignes). */
  const coverDoneAt = COVER_STAG + COVER_DUR
  const midAt = coverDoneAt + 0.05
  tl.add(() => { try { onMidpoint?.() } catch {} }, midAt)

  /* ── REVEAL : les lignes se referment depuis les bords vers le centre.
     Démarre juste après le midpoint, jamais avant la fin du COVER.
     Termine naturellement à scaleY:0 — pas besoin de reset séparé,
     contrairement à l'ancienne staircase (y:100% → reset y:-100%). ── */
  const revealStart = midAt + 0.05
  tl.to(lines, {
    scaleY: 0,
    stagger: { amount: REVEAL_STAG, from: 'edges' },
    duration: REVEAL_DUR,
    ease: EASE_REVEAL,
  }, revealStart)
}

export function useGooeyTransition(variant = 'desktop') {
  const runningRef = useRef(false)

  const goTo = useCallback((sectionId) => {
    if (runningRef.current) {
      // Transition déjà en cours : saut simple, pas de nouvelle transition
      hardJumpTo(sectionId)
      return
    }
    runningRef.current = true

    /* Verrouiller scroll-behavior AVANT de lancer la transition.
       Le unlock ne sera appelé qu'à la fin de la transition (lignes
       entièrement refermées), pas au frame suivant. */
    const unlockScroll = lockScrollBehavior()

    runGridTransition(() => {
      /* midpoint — lignes couvrent tout l'écran : saut instantané */
      hardJumpTo(sectionId)
    }, variant)

    /* Durée totale de la transition + marge de sécurité */
    const total = (COVER_DUR + COVER_STAG + REVEAL_DUR + REVEAL_STAG) * 1000 + 300
    setTimeout(() => {
      unlockScroll()
      runningRef.current = false
    }, total)
  }, [variant])

  return goTo
}
// HMR compat
export default function GooeyTransitionNoop() { return null }
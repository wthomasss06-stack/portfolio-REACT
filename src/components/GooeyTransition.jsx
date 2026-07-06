/**
 * GooeyTransition.jsx
 * ─────────────────────────────────────────────────────────
 * Transition "Staircase" inspirée de barba-js-staircase-transition-03.
 *
 * leave  → 8 colonnes descendent de y:-100% → y:0%  (stagger .7s)
 * enter  → 8 colonnes remontent  de y:0%   → y:100% (stagger .7s)
 *          puis reset y:-100% pour la prochaine fois
 *
 * Adapté pour SPA React scroll-based (pas de barba) :
 *   - layer fixe plein-écran créé dynamiquement avec 8 .stair
 *   - onMidpoint déclenché au pic (entre leave et enter)
 *   - layer retiré du DOM à la fin
 *
 * EXPORTS :
 *   runGridTransition(onMidpoint)   — impératif (loader, etc.)
 *   useGooeyTransition()            — hook React → goTo(sectionId)
 */

import { useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import './GooeyTransition.css'
import './GooeyTransition.mobile.css'

/* ── Timings (calqués sur l'original staircase-03) ── */
const STAIR_COUNT  = 8
const LEAVE_DUR    = 1.0
const LEAVE_STAG   = 0.7
const ENTER_DUR    = 0.8
const ENTER_STAG   = 0.7
const STAIR_COLOR  = '#FF5500'   /* couleur des colonnes — orange akaFOLIO (référence, la couleur réelle vient de GooeyTransition.css / .mobile.css) */
const EASE_LEAVE   = 'power3.inOut'
const EASE_ENTER   = 'power3.inOut'

/* ── Build the transition layer ──
   variant: 'desktop' | 'mobile' → choisit la feuille de style appliquée
   (gooey-stair--desktop vient de GooeyTransition.css,
    gooey-stair--mobile  vient de GooeyTransition.mobile.css) */
function buildLayer(variant = 'desktop') {
  const layer = document.createElement('div')
  layer.className = `gooey-layer gooey-layer--${variant}`

  const stairs = []
  for (let i = 0; i < STAIR_COUNT; i++) {
    const stair = document.createElement('div')
    stair.className = `gooey-stair gooey-stair--${variant}`
    layer.appendChild(stair)
    stairs.push(stair)
  }

  return { layer, stairs }
}

/* ── Verrouille scroll-behavior:auto sur <html> et retourne un unlock ──
   Problème : après les sections sticky géantes (#hscroll-section ~1800vh,
   #hpx-section ~600vh), un scrollIntoView({behavior:'instant'}) sur 1 seul
   rAF ne suffit pas : le CSS scroll-behavior:smooth est restauré AU FRAME
   SUIVANT et reprend la main, annulant le saut avant que GSAP ne lâche
   les colonnes. Le scroll revient à la position précédente, donc on
   atterrit sur la mauvaise section.
   Fix : on neutralise scroll-behavior AVANT le saut et on le restitue
   UNIQUEMENT quand les colonnes sont entièrement sorties de l'écran. */
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
}

/* ── Core runner ── */
export function runGridTransition(onMidpoint, variant = 'desktop') {
  const { layer, stairs } = buildLayer(variant)
  document.body.appendChild(layer)

  /* reset initial : toutes les colonnes au-dessus de l'écran */
  gsap.set(stairs, { y: '-100%' })

  const tl = gsap.timeline({ onComplete: () => layer.remove() })

  /* ── LEAVE : colonnes descendent en stagger ── */
  tl.to(stairs, {
    y: '0%',
    stagger: { amount: LEAVE_STAG, from: 'start' },
    duration: LEAVE_DUR,
    ease: EASE_LEAVE,
  }, 0)

  /* ── Midpoint : scroll une fois l'écran ENTIÈREMENT couvert ──
     Avec stagger:{amount:LEAVE_STAG,from:'start'}, la dernière colonne
     démarre à t=LEAVE_STAG et dure LEAVE_DUR → fin de couverture totale
     à t = LEAVE_STAG + LEAVE_DUR. Le midpoint doit tomber après ce point,
     sinon on scrolle/jump alors que l'écran est encore partiellement
     transparent (on voit le contenu changer "à travers" les colonnes). */
  const coverDoneAt = LEAVE_STAG + LEAVE_DUR
  const midAt = coverDoneAt + 0.05
  tl.add(() => { try { onMidpoint?.() } catch {} }, midAt)

  /* ── ENTER : colonnes remontent en stagger, puis reset ──
     Démarre juste après le midpoint, jamais avant la fin du LEAVE. */
  const enterStart = midAt + 0.05
  tl.to(stairs, {
    y: '100%',
    stagger: { amount: ENTER_STAG, from: 'start' },
    duration: ENTER_DUR,
    ease: EASE_ENTER,
    onComplete: () => gsap.set(stairs, { y: '-100%' }),
  }, enterStart)
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
       Le unlock ne sera appelé qu'à la fin de la transition (colonnes
       entièrement sorties), pas au frame suivant. */
    const unlockScroll = lockScrollBehavior()

    runGridTransition(() => {
      /* midpoint — colonnes couvrent tout l'écran : saut instantané */
      hardJumpTo(sectionId)
    }, variant)

    /* Durée totale de la transition + marge de sécurité */
    const total = (LEAVE_DUR + LEAVE_STAG + ENTER_DUR + ENTER_STAG) * 1000 + 300
    setTimeout(() => {
      unlockScroll()
      runningRef.current = false
    }, total)
  }, [variant])

  return goTo
}
// HMR compat
export default function GooeyTransitionNoop() { return null }
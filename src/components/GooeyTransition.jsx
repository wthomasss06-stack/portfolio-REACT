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
const STAIR_COLOR  = '#FF5500'   /* couleur des colonnes — orange AKAFOLIO (référence, la couleur réelle vient de GooeyTransition.css / .mobile.css) */
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

  /* ── Midpoint : scroll pendant que l'écran est couvert ── */
  const midAt = LEAVE_DUR * 0.55 + LEAVE_STAG * 0.5
  tl.add(() => { try { onMidpoint?.() } catch {} }, midAt)

  /* ── ENTER : colonnes remontent en stagger, puis reset ── */
  const enterStart = LEAVE_DUR + LEAVE_STAG * 0.6
  tl.to(stairs, {
    y: '100%',
    stagger: { amount: ENTER_STAG, from: 'start' },
    duration: ENTER_DUR,
    ease: EASE_ENTER,
    onComplete: () => gsap.set(stairs, { y: '-100%' }),
  }, enterStart)
}

/* ── React hook ──
   variant: 'desktop' | 'mobile' → passe automatiquement la bonne classe CSS
   (App.jsx → useGooeyTransition() reste 'desktop' par défaut,
    Appmobile.jsx → useGooeyTransition('mobile')) */
export function useGooeyTransition(variant = 'desktop') {
  const runningRef = useRef(false)

  const goTo = useCallback((sectionId) => {
    if (runningRef.current) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    runningRef.current = true

    runGridTransition(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant' })
    }, variant)

    const total = (LEAVE_DUR + LEAVE_STAG + ENTER_DUR + ENTER_STAG) * 1000 + 300
    setTimeout(() => { runningRef.current = false }, total)
  }, [variant])

  return goTo
}

/**
 * GooeyTransition.jsx
 * ─────────────────────────────────────────────────────────
 * Transition grille dynamique inspirée de barba-js-dynamic-grid-transition-08.
 * 4 rangées × 15 cellules, clipPath alterné gauche/droite, couleur #FF5500.
 *
 * EXPORTS :
 *   runGridTransition(onMidpoint)   — appel impératif (loader, etc.)
 *   useGooeyTransition()            — hook React → goTo(sectionId)
 */

import { useCallback, useRef } from 'react'
import { gsap } from 'gsap'

/* ── Config ─────────────────────────────────── */
const ROWS        = 4
const COLS        = 15
const COLOR_1     = 'var(--accent, #FF5500)'
const COLOR_2     = '#FF6B1A'           /* légère variation pour la grille */
const ENTRY_DUR   = 0.9
const ENTRY_AMT   = 0.5
const HOLD_DUR    = 0.10
const EXIT_DUR    = 0.8
const EXIT_AMT    = 0.5

/* ── Directions par rangée (alternance gauche/droite comme l'original) ── */
const ROW_DIRS = [
  { entry: 'inset(0% 0% 0% 101%)', exit: 'inset(0% 0% 0% 101%)', from: 'end'   },  // row-0 : droite→gauche
  { entry: 'inset(0% 101% 0% 0%)', exit: 'inset(0% 101% 0% 0%)', from: 'start' },  // row-1 : gauche→droite
  { entry: 'inset(0% 0% 0% 101%)', exit: 'inset(0% 0% 0% 101%)', from: 'end'   },  // row-2 : droite→gauche
  { entry: 'inset(0% 101% 0% 0%)', exit: 'inset(0% 101% 0% 0%)', from: 'start' },  // row-3 : gauche→droite
]

/* ── Build overlay DOM ───────────────────────────────────── */
function buildOverlay() {
  const wrapper = document.createElement('div')
  wrapper.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:999999',
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'justify-content:space-between',
    'pointer-events:none',
    'overflow:hidden',
  ].join(';')

  const rowEls  = []
  const cellsByRow = []

  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement('div')
    row.style.cssText = [
      'width:100%',
      `height:${100 / ROWS}vh`,
      'display:flex',
      'align-items:stretch',
      'justify-content:space-between',
    ].join(';')

    const cells = []
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div')
      /* légère variation de teinte selon la rangée */
      const bg = r % 2 === 0 ? COLOR_1 : COLOR_2
      cell.style.cssText = [
        `flex:1`,
        `background:${bg}`,
        'height:105%',
        'margin-left:-1px',
        'will-change:clip-path',
      ].join(';')
      row.appendChild(cell)
      cells.push(cell)
    }

    wrapper.appendChild(row)
    rowEls.push(row)
    cellsByRow.push(cells)
  }

  return { wrapper, rowEls, cellsByRow }
}

/* ── Core imperative runner ──────────────────────────────── */
export function runGridTransition(onMidpoint) {
  const { wrapper, cellsByRow } = buildOverlay()
  document.body.appendChild(wrapper)

  const tl = gsap.timeline()

  /* Entry : chaque rangée entre depuis sa direction */
  cellsByRow.forEach((cells, r) => {
    const dir = ROW_DIRS[r]
    gsap.set(cells, { clipPath: dir.entry })
    tl.to(
      cells,
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: ENTRY_DUR,
        ease: 'power3.inOut',
        stagger: { amount: ENTRY_AMT, from: dir.from },
      },
      0
    )
  })

  /* Midpoint — scroll / callback */
  tl.add(() => { try { onMidpoint?.() } catch {} }, '>')

  /* Hold */
  tl.to({}, { duration: HOLD_DUR })

  /* Exit : chaque rangée repart dans sa direction d'origine */
  cellsByRow.forEach((cells, r) => {
    const dir = ROW_DIRS[r]
    tl.to(
      cells,
      {
        clipPath: dir.exit,
        duration: EXIT_DUR,
        ease: 'power4.inOut',
        stagger: { amount: EXIT_AMT, from: dir.from },
      },
      /* décalage léger pour que les rangées se libèrent en cascade */
      `>-${EXIT_DUR * 0.85}`
    )
  })

  /* Cleanup */
  tl.add(() => { wrapper.remove() })
}

/* ── Hook React ─────────────────────────────────────────── */
export function useGooeyTransition() {
  const runningRef = useRef(false)

  const goTo = useCallback((sectionId) => {
    if (runningRef.current) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    runningRef.current = true

    runGridTransition(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant' })
    })

    const total = (ENTRY_DUR + HOLD_DUR + EXIT_DUR + EXIT_AMT) * 1000 + 200
    setTimeout(() => { runningRef.current = false }, total)
  }, [])

  return goTo
}

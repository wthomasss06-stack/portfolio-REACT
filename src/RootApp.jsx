// ════════════════════════════════════════════════════════════════
// RootApp.jsx — MODIFIÉ pour SSG + SEO
//
// 2 changements uniquement par rapport à l'original :
//   1. HelmetProvider wrappe tout l'arbre
//   2. <SEOHead /> injecté une seule fois ici (pas dans chaque App)
//
// Tout le reste (modes, switcher, CSS dynamique) est IDENTIQUE.
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { HelmetProvider }      from 'react-helmet-async'
import { SEOHead }             from './useSEO.jsx'

// ── Les trois portfolios ──
import ModernApp from './App.jsx'
import AppMobile from './Appmobile.jsx'
import Win95App  from './Win95Portfolio.jsx'

// ── CSS via Vite inline strings ──
import styleDesktop from './style.css?inline'
import styleMobile  from './stylemobile.css?inline'

const MODE_KEY         = 'akafolio-mode'
const VALID_MODES      = ['app', 'appmobile', 'win95']
const DESKTOP_ONLY_MODES = ['app']
const MOBILE_ONLY_MODES  = ['appmobile']
const DESKTOP_CYCLE    = ['app', 'win95']
const MOBILE_CYCLE     = ['appmobile', 'win95']

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 900
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const check = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', check)
    return () => mq.removeEventListener('change', check)
  }, [])
  return isMobile
}

function readSavedMode() {
  try {
    const saved = localStorage.getItem(MODE_KEY)
    if (saved && VALID_MODES.includes(saved)) return saved
  } catch {}
  return null
}

const switcherStyle = {
  position: 'fixed', bottom: '50px', right: '12px', zIndex: 99999,
  display: 'flex', alignItems: 'center', gap: '6px',
  background: '#c0c0c0', border: '2px solid #000',
  borderTopColor: '#fff', borderLeftColor: '#fff',
  padding: '4px 10px', cursor: 'pointer',
  fontFamily: "'Nunito', sans-serif", fontWeight: 900,
  fontSize: '11px', boxShadow: '2px 2px 0 rgba(0,0,0,.5)',
  userSelect: 'none', whiteSpace: 'nowrap',
}

const NEXT_LABEL_DESKTOP = {
  app:   { label: '🖥 Mode Win95',   title: 'Passer au mode Win95' },
  win95: { label: '🌐 Mode Moderne', title: 'Revenir au mode moderne' },
}

const NEXT_LABEL_MOBILE = {
  win95:     { label: '🌐 Mode Moderne', title: 'Passer au portfolio moderne' },
  appmobile: { label: '🖥 Mode Win95',   title: 'Passer au mode Win95' },
}

function SwitcherBtn({ mode, isMobile, onToggle }) {
  const [hovered, setHovered] = useState(false)
  const map     = isMobile ? NEXT_LABEL_MOBILE : NEXT_LABEL_DESKTOP
  const current = map[mode] || NEXT_LABEL_DESKTOP.app
  return (
    <button
      style={{ ...switcherStyle, background: hovered ? '#d4d4d4' : '#c0c0c0', transition: 'background .1s' }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={current.title}
    >
      {current.label}
    </button>
  )
}

export default function RootApp() {
  const isMobile = useIsMobile()

  const [mode, setMode] = useState(() => {
    const saved = readSavedMode()
    if (saved) return saved
    return isMobile ? 'appmobile' : 'app'
  })

  useEffect(() => {
    if (!VALID_MODES.includes(mode)) {
      setMode(isMobile ? 'appmobile' : 'app')
      return
    }
    if (isMobile  && DESKTOP_ONLY_MODES.includes(mode)) setMode('appmobile')
    if (!isMobile && MOBILE_ONLY_MODES.includes(mode))  setMode('app')
  }, [isMobile, mode])

  useEffect(() => {
    document.body.classList.toggle('mobile-root', isMobile)
  }, [isMobile])

  useEffect(() => {
    const activeCss =
      mode === 'app'       ? styleDesktop :
      mode === 'appmobile' ? styleMobile  : null
    let styleEl = document.getElementById('dynamic-portfolio-styles')
    if (activeCss) {
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = 'dynamic-portfolio-styles'
        document.head.appendChild(styleEl)
      }
      if (styleEl.textContent !== activeCss) styleEl.textContent = activeCss
    } else {
      if (styleEl) styleEl.remove()
    }
  }, [mode])

  useEffect(() => {
    try { localStorage.setItem(MODE_KEY, mode) } catch {}
    const isWin95 = mode === 'win95'
    const elems = [document.documentElement, document.body]
    if (isWin95) {
      elems.forEach(el => { el.style.overflow = 'hidden'; el.style.height = '100%' })
      const root = document.getElementById('root')
      if (root) { root.style.overflow = 'hidden'; root.style.height = '100%' }
    } else {
      elems.forEach(el => { el.style.overflow = ''; el.style.height = ''; el.style.cursor = '' })
      const root = document.getElementById('root')
      if (root) { root.style.overflow = ''; root.style.height = '' }
      const w95css = document.getElementById('w95-v3-css')
      if (w95css) w95css.remove()
    }
  }, [mode])

  const toggle = () => {
    const cycle = isMobile ? MOBILE_CYCLE : DESKTOP_CYCLE
    setMode(m => {
      const idx = cycle.indexOf(m)
      return cycle[(idx === -1 ? 0 : idx + 1) % cycle.length]
    })
  }

  return (
    // ── NOUVEAU : HelmetProvider active react-helmet-async ──
    // SEOHead injecte title, meta, og, structured data dans le <head>
    // Au build SSG → ces balises sont dans le HTML statique
    // Google les lit directement sans exécuter JS.
    <HelmetProvider>
      <SEOHead />
      {mode === 'win95'     && <div style={{ height: '100%' }}><Win95App /></div>}
      {mode === 'appmobile' && <AppMobile />}
      {mode === 'app'       && <ModernApp />}
      <SwitcherBtn mode={mode} isMobile={isMobile} onToggle={toggle} />
    </HelmetProvider>
  )
}

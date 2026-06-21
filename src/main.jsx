import '@fortawesome/fontawesome-free/css/all.min.css'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

// ── Polices bundlées (zéro CDN externe) ──
// Doit être importé ici, PAS dans style.css?inline
import './fonts.css'

// ── Les trois portfolios ──
import ModernApp from './App.jsx'
import AppMobile from './Appmobile.jsx'
import Win95App  from './Win95Portfolio.jsx'

// ── CSS via Vite inline strings ──
import styleDesktop from './style.css?inline'
import styleMobile from './stylemobile.css?inline'

const MODE_KEY = 'akafolio-mode'

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

function SwitcherBtn({ mode, isMobile, onToggle }) {
  const [hovered, setHovered] = useState(false)

  const labels = isMobile
    ? { win95: '🌐 Mode Moderne', appmobile: '🖥 Mode Win95' }
    : { app: '🖥 Mode Win95', win95: '📱 Voir version mobile', appmobile: '💻 Mode Moderne' }

  const titles = isMobile
    ? { win95: 'Passer au portfolio moderne', appmobile: 'Passer au mode Win95' }
    : { app: 'Passer au mode Win95', win95: 'Voir la version mobile', appmobile: 'Revenir au portfolio moderne' }

  return (
    <button
      style={{ ...switcherStyle, background: hovered ? '#d4d4d4' : '#c0c0c0', transition: 'background .1s' }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={titles[mode]}
    >
      {labels[mode]}
    </button>
  )
}

function Root() {
  const isMobile = useIsMobile()

  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(MODE_KEY)
      if (saved) return saved
    } catch {}
    return isMobile ? 'appmobile' : 'app'
  })

  // Sécurité : App (desktop) n'est jamais accessible sur mobile
  useEffect(() => {
    if (isMobile && mode === 'app') setMode('appmobile')
  }, [isMobile, mode])

  useEffect(() => {
    document.body.classList.toggle('mobile-root', isMobile)
  }, [isMobile])

  useEffect(() => {
    const activeCss = mode === 'app' ? styleDesktop : mode === 'appmobile' ? styleMobile : null
    let styleEl = document.getElementById('dynamic-portfolio-styles')
    if (activeCss) {
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = 'dynamic-portfolio-styles'
        document.head.appendChild(styleEl)
      }
      if (styleEl.textContent !== activeCss) {
        styleEl.textContent = activeCss
      }
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
    if (isMobile) {
      setMode(m => m === 'win95' ? 'appmobile' : 'win95')
    } else {
      setMode(m => m === 'app' ? 'win95' : m === 'win95' ? 'appmobile' : 'app')
    }
  }

  return (
    <>
      {mode === 'win95' && (
        <div style={{ height: '100%' }}>
          <Win95App />
        </div>
      )}
      {mode === 'appmobile' && <AppMobile />}
      {mode === 'app' && <ModernApp />}
      <SwitcherBtn mode={mode} isMobile={isMobile} onToggle={toggle} />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
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

function SwitcherBtn({ mode, onToggle }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      style={{ ...switcherStyle, background: hovered ? '#d4d4d4' : '#c0c0c0', transition: 'background .1s' }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={mode === 'win95' ? 'Passer au portfolio moderne' : 'Passer au mode Win95'}
    >
      {mode === 'win95' ? '🌐 Mode Moderne' : '🖥 Mode Win95'}
    </button>
  )
}

function Root() {
  const isMobile = useIsMobile()

  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem(MODE_KEY) || 'win95' }
    catch { return 'win95' }
  })

  useEffect(() => {
    document.body.classList.toggle('mobile-root', isMobile)
  }, [isMobile])

  useEffect(() => {
    const activeCss = mode === 'modern' ? (isMobile ? styleMobile : styleDesktop) : null
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
  }, [mode, isMobile])

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

  const toggle = () => setMode(m => m === 'win95' ? 'modern' : 'win95')

  // Un seul portfolio monté à la fois (plus de display:none qui laissait
  // les 3 arbres DOM coexister → c'était ça qui cassait les ancres #contact etc.)
  return (
    <>
      {mode === 'win95' && (
        <div style={{ height: '100%' }}>
          <Win95App />
        </div>
      )}
      {mode === 'modern' && isMobile && <AppMobile />}
      {mode === 'modern' && !isMobile && <ModernApp />}
      {!isMobile && <SwitcherBtn mode={mode} onToggle={toggle} />}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

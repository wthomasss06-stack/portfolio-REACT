import '@fortawesome/fontawesome-free/css/all.min.css'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

// ── Polices bundlées (zéro CDN externe) ──
// Doit être importé ici, PAS dans style.css?inline
import './fonts.css'

// ── Les quatre portfolios ──
import ModernApp from './App.jsx'
import ModernAppV4 from './Appv4.jsx'
import AppMobile from './Appmobile.jsx'
import Win95App  from './Win95Portfolio.jsx'

// ── CSS via Vite inline strings ──
import styleDesktop from './style.css?inline'
import styleV4 from './stylev4.css?inline'
import styleMobile from './stylemobile.css?inline'

const MODE_KEY = 'akafolio-mode'
const VALID_MODES = ['app', 'appv4', 'appmobile', 'win95']

// Modes desktop-only : jamais accessibles sur mobile (sécurité ci-dessous)
const DESKTOP_ONLY_MODES = ['app', 'appv4']

// Ordres de cycle pour le bouton switcher
const DESKTOP_CYCLE = ['app', 'win95', 'appmobile', 'appv4']
const MOBILE_CYCLE  = ['appmobile', 'win95']

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

// Lit le mode sauvegardé, mais ignore toute valeur héritée d'une ancienne
// version (ex: "modern") qui ne correspond plus à rien ici → évite l'écran blanc.
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

// Le bouton affiche toujours la destination (le mode vers lequel on bascule)
const NEXT_LABEL_DESKTOP = {
  app:       { label: '🖥 Mode Win95',           title: 'Passer au mode Win95' },
  win95:     { label: '📱 Voir version mobile',   title: 'Voir la version mobile' },
  appmobile: { label: '🚀 Nouvelle version (v4)', title: 'Découvrir la nouvelle version' },
  appv4:     { label: '💻 Version actuelle',      title: 'Revenir à la version actuelle' },
}

const NEXT_LABEL_MOBILE = {
  win95:     { label: '🌐 Mode Moderne', title: 'Passer au portfolio moderne' },
  appmobile: { label: '🖥 Mode Win95',   title: 'Passer au mode Win95' },
}

function SwitcherBtn({ mode, isMobile, onToggle }) {
  const [hovered, setHovered] = useState(false)
  const map = isMobile ? NEXT_LABEL_MOBILE : NEXT_LABEL_DESKTOP
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

function Root() {
  const isMobile = useIsMobile()

  const [mode, setMode] = useState(() => {
    const saved = readSavedMode()
    if (saved) return saved
    return isMobile ? 'appmobile' : 'app'
  })

  // Sécurité : modes desktop-only jamais sur mobile, et on rattrape toute
  // valeur de mode invalide qui aurait pu se glisser dans le state/localStorage
  // (ex: un vieux "modern" laissé par une ancienne version).
  useEffect(() => {
    if (!VALID_MODES.includes(mode)) {
      setMode(isMobile ? 'appmobile' : 'app')
      return
    }
    if (isMobile && DESKTOP_ONLY_MODES.includes(mode)) setMode('appmobile')
  }, [isMobile, mode])

  useEffect(() => {
    document.body.classList.toggle('mobile-root', isMobile)
  }, [isMobile])

  useEffect(() => {
    const activeCss =
      mode === 'app' ? styleDesktop :
      mode === 'appv4' ? styleV4 :
      mode === 'appmobile' ? styleMobile :
      null
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
    const cycle = isMobile ? MOBILE_CYCLE : DESKTOP_CYCLE
    setMode(m => {
      const idx = cycle.indexOf(m)
      return cycle[(idx === -1 ? 0 : idx + 1) % cycle.length]
    })
  }

  // Un seul portfolio monté à la fois (pas de display:none qui ferait
  // coexister plusieurs arbres DOM → c'était ça qui cassait les ancres #contact etc.)
  return (
    <>
      {mode === 'win95' && (
        <div style={{ height: '100%' }}>
          <Win95App />
        </div>
      )}
      {mode === 'appmobile' && <AppMobile />}
      {mode === 'app' && <ModernApp />}
      {mode === 'appv4' && <ModernAppV4 />}
      <SwitcherBtn mode={mode} isMobile={isMobile} onToggle={toggle} />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

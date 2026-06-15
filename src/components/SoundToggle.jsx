/**
 * SoundToggle.jsx
 * ─────────────────────────────────────────────────────────
 * Texte vertical discret fixe à droite.
 * Couleur adaptée au thème : blanc (dark) / noir (light).
 * Dot : rouge clair (actif) / rouge atténué (muted).
 * Badge flash 2s après chaque toggle.
 */

import { useEffect, useRef, useState } from 'react'

export default function SoundToggle({ muted, onToggle }) {
  const [visible, setVisible]   = useState(false)
  const [isDark, setIsDark]     = useState(true)
  const timerRef   = useRef(null)
  const prevMuted  = useRef(muted)

  /* Detect theme — elvis uses body.light-mode, oscar uses <html>.dark */
  useEffect(() => {
    const check = () => {
      const bodyLight = document.body.classList.contains('light-mode') || document.body.classList.contains('app--light')
      const htmlDark  = document.documentElement.classList.contains('dark')
      setIsDark(!bodyLight || htmlDark)
    }
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  /* Flash badge on toggle */
  useEffect(() => {
    if (prevMuted.current === muted) return
    prevMuted.current = muted
    setVisible(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 2000)
  }, [muted])

  /* Derived colors */
  const baseTextColor   = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.35)'
  const mutedTextColor  = isDark ? 'rgba(239,68,68,0.55)'   : 'rgba(200,30,30,0.55)'
  const hoverText       = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.75)'
  const hoverMuted      = isDark ? 'rgba(239,68,68,0.9)'    : 'rgba(200,30,30,0.85)'
  const dotActive       = '#f87171'   /* rouge clair */
  const dotMuted        = '#fca5a5'   /* rose pâle  */

  return (
    <>
      {/* ── Badge tooltip flash 2s ── */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 56,
          zIndex: 99990,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 14px 7px 10px',
          borderRadius: 100,
          background: isDark ? 'rgba(12,12,12,0.82)' : 'rgba(240,240,240,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: isDark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.12em',
          color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
          pointerEvents: 'none',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: muted ? '#ef4444' : '#4ade80' }}>
          {muted ? 'SON COUPÉ' : 'SON ACTIVÉ'}
        </span>
        <span style={{
          marginLeft: 4,
          padding: '1px 6px',
          borderRadius: 4,
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
          fontSize: 9,
          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)',
        }}>S</span>
      </div>

      {/* ── Label vertical discret fixe à droite ── */}
      <button
        onClick={onToggle}
        title={muted ? 'Activer le son (S)' : 'Couper le son (S)'}
        aria-label={muted ? 'Activer le son' : 'Couper le son'}
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center center',
          zIndex: 99989,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: muted ? mutedTextColor : baseTextColor,
          transition: 'color 0.2s ease, opacity 0.2s ease',
          opacity: 0.7,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.color = muted ? hoverMuted : hoverText
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '0.7'
          e.currentTarget.style.color = muted ? mutedTextColor : baseTextColor
        }}
      >
        {/* Dot rouge clair */}
        <span style={{
          display: 'inline-block',
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: muted ? dotMuted : dotActive,
          flexShrink: 0,
          opacity: muted ? 0.55 : 0.9,
          boxShadow: muted ? 'none' : `0 0 6px ${dotActive}99`,
          transition: 'background 0.2s, box-shadow 0.2s',
        }} />
        <span>{muted ? 'son coupé' : 'son activé'}</span>
        <span style={{
          padding: '0 4px',
          border: '1px solid currentColor',
          borderRadius: 3,
          fontSize: 8,
          opacity: 0.55,
        }}>S</span>
      </button>
    </>
  )
}
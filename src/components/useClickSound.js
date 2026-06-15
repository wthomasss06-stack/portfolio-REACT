/**
 * useClickSound.js
 * ─────────────────────────────────────────────────────────
 * Hook global de son de clic + raccourci clavier S (mute/unmute).
 *
 * USAGE dans App.jsx (une seule fois, racine) :
 *   import { useSoundSystem } from './components/useClickSound'
 *   const { muted, toggleMute } = useSoundSystem()
 *
 * Synthèse Web Audio : aucun asset externe requis.
 * Sons générés via OscillatorNode + BiquadFilter.
 *
 * Raccourci : touche [S] → toggle mute
 * Indicateur visuel : badge flottant en haut à droite (2s)
 */

import { useEffect, useRef, useState, useCallback } from 'react'

/* ── Catalogue de sons ────────────────────────────────────
   Chaque son est une fonction (ctx) => void qui joue immédiatement.
   Fréquences et enveloppes fine-tuned pour un rendu "keyboard tactile".
──────────────────────────────────────────────────────────── */

function playClick(ctx) {
  /* Bruit blanc court + filtre passe-haut → clic de touche mécanique */
  const bufSize = ctx.sampleRate * 0.012
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 3)
  }

  const src = ctx.createBufferSource()
  src.buffer = buf

  const hpf = ctx.createBiquadFilter()
  hpf.type = 'highpass'
  hpf.frequency.value = 3200

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.18, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.018)

  src.connect(hpf)
  hpf.connect(gain)
  gain.connect(ctx.destination)
  src.start()
}

function playHover(ctx) {
  /* Sine très courte, fréquence haute → tick discret */
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(1800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.04)

  gain.gain.setValueAtTime(0.045, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.05)
}

function playLink(ctx) {
  /* Double-tick : descente fréquentielle rapide → clic de lien */
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(900, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06)

  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.08)
}

function playToggle(ctx, on) {
  /* Son confirmation mute/unmute : deux tons enchaînés */
  const freqs = on ? [600, 900] : [900, 500]
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const t = ctx.currentTime + i * 0.09

    osc.type = 'sine'
    osc.frequency.setValueAtTime(f, t)

    gain.gain.setValueAtTime(0.13, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.1)
  })
}

/* ── SELECTORS qui reçoivent le son de clic ─────────────── */
const CLICK_SELECTORS = [
  'a',
  'button',
  '[role="button"]',
  '.cursor-target',
  '.ss-view-btn',
  '.cpx-btn',
  '.nav-link',
  '[data-sound="click"]',
].join(', ')

/* ═══════════════════════════════════════════════════════════
   HOOK PRINCIPAL
═══════════════════════════════════════════════════════════ */
export function useSoundSystem() {
  const ctxRef   = useRef(null)
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem('sound-muted') === 'true' } catch { return false }
  })
  const mutedRef = useRef(muted)

  /* Sync ref with state (for listeners that close over ref) */
  useEffect(() => {
    mutedRef.current = muted
    try { localStorage.setItem('sound-muted', String(muted)) } catch {}
  }, [muted])

  /* Lazy-init AudioContext on first user gesture */
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      /* Play toggle sound only when unmuting (son de confirmation) */
      try {
        const ctx = getCtx()
        playToggle(ctx, !next) // !next = we're now unmuted when next=false
      } catch {}
      return next
    })
  }, [getCtx])

  /* ── Raccourci clavier S ── */
  useEffect(() => {
    const onKey = (e) => {
      /* Ignorer si focus sur input / textarea / contenteditable */
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (document.activeElement?.isContentEditable) return

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        toggleMute()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleMute])

  /* ── Global click listener (délégation) ── */
  useEffect(() => {
    const onClick = (e) => {
      if (mutedRef.current) return
      const target = e.target?.closest(CLICK_SELECTORS)
      if (!target) return
      try {
        const ctx = getCtx()
        /* Son selon le type de cible */
        if (target.tagName === 'A' && target.href && !target.href.startsWith('#')) {
          playLink(ctx)
        } else {
          playClick(ctx)
        }
      } catch {}
    }

    document.addEventListener('click', onClick, { passive: true })
    return () => document.removeEventListener('click', onClick)
  }, [getCtx])

  /* ── Global hover listener (délégation, throttled) ── */
  useEffect(() => {
    let lastHover = 0
    const onEnter = (e) => {
      if (mutedRef.current) return
      const target = e.target?.closest('button, [role="button"], .cursor-target, a')
      if (!target) return
      const now = Date.now()
      if (now - lastHover < 60) return  /* throttle 60ms */
      lastHover = now
      try {
        const ctx = getCtx()
        playHover(ctx)
      } catch {}
    }
    document.addEventListener('mouseover', onEnter, { passive: true })
    return () => document.removeEventListener('mouseover', onEnter)
  }, [getCtx])

  return { muted, toggleMute }
}

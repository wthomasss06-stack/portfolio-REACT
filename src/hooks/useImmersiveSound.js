import { useEffect, useRef, useState, useCallback } from 'react'

/* ════════════════════════════════════════════════════════════════
   useImmersiveSound — Musique d'ambiance procédurale
   Pure Web Audio API, zéro dépendance.

   Génère une texture sonore atmosphérique continue :
   · Sub-drone basse fréquence (22 Hz) — fondation
   · Pad synthé oscillant (intervalles de quinte)
   · Texture de bruit filtrée (shimmer haute fréq)
   · LFO lent sur gain → respiration organique

   Toggle : on/off avec fade in/out progressif.
   Persistance : localStorage 'aka-sound-enabled'.
   Off par défaut (opt-in, jamais de son surprise).
   ════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'aka-sound-enabled'

export function useImmersiveSound() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved === 'true'
    } catch { return false }
  })

  const ctxRef    = useRef(null)
  const masterRef = useRef(null)   // master gain (fade in/out)
  const nodesRef  = useRef([])     // tous les noeuds actifs (pour stop propre)
  const startedRef = useRef(false) // moteur démarré ?

  /* ── Obtenir / créer AudioContext ── */
  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  /* ── Generateur bruit blanc ── */
  const mkNoise = (ctx, dur = 4, loop = true) => {
    const sz  = Math.ceil(ctx.sampleRate * dur)
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate)
    const d   = buf.getChannelData(0)
    for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop   = loop
    return src
  }

  /* ── Démarre l'ambiance ── */
  const startAmbience = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true

    try {
      const ctx = getCtx()
      const now = ctx.currentTime
      const nodes = []

      /* ── MASTER GAIN — fade in 3s ── */
      const master = ctx.createGain()
      master.gain.setValueAtTime(0, now)
      master.gain.linearRampToValueAtTime(0.48, now + 3.0)
      master.connect(ctx.destination)
      masterRef.current = master

      /* ── COMPRESSEUR doux ── */
      const comp = ctx.createDynamicsCompressor()
      comp.threshold.value = -20
      comp.knee.value      = 12
      comp.ratio.value     = 3
      comp.attack.value    = 0.01
      comp.release.value   = 0.4
      master.connect(comp)
      comp.connect(ctx.destination)
      master.disconnect(ctx.destination) // passe par comp uniquement

      /* ════════════════════════════════
         COUCHE 1 — Sub drone 22 Hz
         Fondation grave, presque inaudible
         mais ressenti physiquement
         ════════════════════════════════ */
      const sub = ctx.createOscillator()
      sub.type = 'sine'
      sub.frequency.setValueAtTime(22, now)
      /* Légère dérive lente */
      sub.frequency.linearRampToValueAtTime(24, now + 20)
      sub.frequency.linearRampToValueAtTime(21, now + 45)
      sub.frequency.linearRampToValueAtTime(23, now + 75)
      const subG = ctx.createGain(); subG.gain.value = 0.55
      sub.connect(subG); subG.connect(comp)
      sub.start(now)
      nodes.push(sub)

      /* ════════════════════════════════
         COUCHE 2 — Pad synthé 3 voix
         Intervalles consonants : fondamentale +
         quinte (×1.5) + octave (×2)
         Chaque voix oscille légèrement (détune)
         ════════════════════════════════ */
      const PAD_FREQ = 55 // La2
      const padFreqs = [PAD_FREQ, PAD_FREQ * 1.498, PAD_FREQ * 2.0]
      const padGains = [0.28,     0.18,              0.12]
      const padDetune= [0,        +3,                -2]

      padFreqs.forEach((f, i) => {
        /* Oscillateur principal */
        const oA = ctx.createOscillator()
        oA.type = 'triangle'
        oA.frequency.value = f
        oA.detune.value    = padDetune[i]

        /* LFO vibrato très lent */
        const lfo = ctx.createOscillator()
        lfo.type = 'sine'
        lfo.frequency.value = 0.07 + i * 0.03
        const lfoG = ctx.createGain(); lfoG.gain.value = 0.6
        lfo.connect(lfoG); lfoG.connect(oA.frequency)
        lfo.start(now)
        nodes.push(lfo)

        /* Gain de voix */
        const vG = ctx.createGain(); vG.gain.value = padGains[i]

        /* Filtre passe-bas doux */
        const lpf = ctx.createBiquadFilter()
        lpf.type = 'lowpass'
        lpf.frequency.setValueAtTime(280 + i * 80, now)
        lpf.Q.value = 0.7

        oA.connect(lpf); lpf.connect(vG); vG.connect(comp)
        oA.start(now)
        nodes.push(oA)
      })

      /* ════════════════════════════════
         COUCHE 3 — Shimmer haute-fréq
         Bruit blanc filtré bande-passante
         haute → texture "espace"
         ════════════════════════════════ */
      const shimNoise = mkNoise(ctx, 6, true)
      const shimBPF   = ctx.createBiquadFilter()
      shimBPF.type = 'bandpass'
      shimBPF.frequency.setValueAtTime(2800, now)
      shimBPF.Q.value = 1.8
      /* Sweep lent de la fréquence centrale */
      shimBPF.frequency.linearRampToValueAtTime(3600, now + 18)
      shimBPF.frequency.linearRampToValueAtTime(2400, now + 40)
      shimBPF.frequency.linearRampToValueAtTime(3200, now + 65)
      const shimG = ctx.createGain(); shimG.gain.value = 0.06
      shimNoise.connect(shimBPF); shimBPF.connect(shimG); shimG.connect(comp)
      shimNoise.start(now)
      nodes.push(shimNoise)

      /* ════════════════════════════════
         COUCHE 4 — Respiration globale
         LFO très lent sur le master gain
         → "inspire / expire" ~8s cycle
         ════════════════════════════════ */
      const breathLFO = ctx.createOscillator()
      breathLFO.type = 'sine'
      breathLFO.frequency.value = 0.12 // ~8s cycle
      const breathG = ctx.createGain(); breathG.gain.value = 0.08
      breathLFO.connect(breathG); breathG.connect(master.gain)
      breathLFO.start(now)
      nodes.push(breathLFO)

      /* ════════════════════════════════
         COUCHE 5 — Texture mid
         Bruit rose simulé (bruit blanc + EQ)
         → remplissage médium discret
         ════════════════════════════════ */
      const midNoise = mkNoise(ctx, 5, true)
      const midLPF   = ctx.createBiquadFilter(); midLPF.type = 'lowpass'; midLPF.frequency.value = 600
      const midHPF   = ctx.createBiquadFilter(); midHPF.type = 'highpass'; midHPF.frequency.value = 120
      const midG     = ctx.createGain(); midG.gain.value = 0.035
      midNoise.connect(midLPF); midLPF.connect(midHPF); midHPF.connect(midG); midG.connect(comp)
      midNoise.start(now)
      nodes.push(midNoise)

      nodesRef.current = nodes
    } catch (_) {}
  }, [getCtx])

  /* ── Arrête l'ambiance (fade out 2s) ── */
  const stopAmbience = useCallback(() => {
    if (!startedRef.current || !masterRef.current) return
    startedRef.current = false

    try {
      const ctx = getCtx()
      const now = ctx.currentTime
      const master = masterRef.current

      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 2.0)

      const nodesToStop = [...nodesRef.current]
      nodesRef.current = []
      masterRef.current = null

      setTimeout(() => {
        nodesToStop.forEach(n => { try { n.stop() } catch (_) {} })
      }, 2200)
    } catch (_) {
      startedRef.current = false
      nodesRef.current = []
    }
  }, [getCtx])

  /* ── Réagir au changement de soundEnabled ── */
  useEffect(() => {
    if (soundEnabled) {
      startAmbience()
    } else {
      stopAmbience()
    }
    return () => {}
  }, [soundEnabled, startAmbience, stopAmbience])

  /* ── Cleanup au démontage ── */
  useEffect(() => {
    return () => {
      stopAmbience()
      setTimeout(() => {
        try { ctxRef.current?.close() } catch (_) {}
      }, 2500)
    }
  }, [stopAmbience])

  /* ── Toggle ── */
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev
      try { localStorage.setItem(STORAGE_KEY, String(next)) } catch (_) {}
      return next
    })
  }, [])

  return { soundEnabled, toggleSound }
}

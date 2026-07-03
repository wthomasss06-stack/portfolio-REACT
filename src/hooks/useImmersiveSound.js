import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import immersionTrack from '../assets/sound/immersion-loop.wav'

/* ════════════════════════════════════════════════════════════════
   useImmersiveSound — Ambiance sonore en boucle (fichier réel)
   ────────────────────────────────────────────────────────────────
   · Démarre dès que `started` passe à true (appelé depuis
     handleLoaderDone, une fois l'explosion du nom/rôle terminée).
   · Boucle en continu (loop natif <audio>, aucun redémarrage manuel).
   · Coupée par le même mute global que les sons de clic/hover
     (touche S) — reçu en paramètre. Ce hook ne pose PAS son propre
     listener clavier, pour ne jamais entrer en conflit avec
     useSoundSystem (système de sons de clic — on n'y touche pas).
   · Fondu d'entrée doux (2.4s) pour une arrivée immersive plutôt
     qu'un démarrage brutal.
   · Contourne poliment les politiques d'autoplay des navigateurs :
     lecture tentée immédiatement, puis retentée au premier geste
     utilisateur (clic / touche / tap) si le navigateur l'a bloquée.
   ════════════════════════════════════════════════════════════════ */

const TARGET_VOLUME    = 0.4
const FADE_IN_DURATION = 2.4

export function useImmersiveSound(muted, started) {
  const audioRef = useRef(null)

  /* ── Crée l'élément audio une seule fois, au montage ── */
  useEffect(() => {
    const audio = new Audio(immersionTrack)
    audio.loop    = true
    audio.preload = 'auto'
    audio.volume  = 0
    audio.muted   = muted
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Démarrage + fade-in dès que le loader a terminé ── */
  useEffect(() => {
    if (!started) return
    const audio = audioRef.current
    if (!audio) return

    const tryPlay = () => {
      const p = audio.play()
      if (p?.catch) p.catch(() => { /* autoplay bloqué — filet ci-dessous prend le relais */ })
    }
    tryPlay()

    /* Filet anti-blocage autoplay : premier geste utilisateur relance la lecture */
    const unlock = () => tryPlay()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })

    gsap.to(audio, { volume: TARGET_VOLUME, duration: FADE_IN_DURATION, ease: 'power2.out' })

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [started])

  /* ── Coupure/rétablissement immédiat via la touche S (muted partagé) ── */
  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.muted = muted
  }, [muted])
}

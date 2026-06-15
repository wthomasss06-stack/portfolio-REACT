import { useEffect, useRef } from 'react'

/*
  FireBackground.jsx — v2
  Vrai algorithme de simulation feu cellulaire (demoscene fire)
  sur canvas 2D, en fond du bloc QR/CV footer.

  Technique : grille de "chaleur" (0–255) qui se propage vers le haut
  avec diffusion + refroidissement aléatoire → flammes organiques réelles.
  Palette : noir → rouge → orange → jaune → blanc au cœur.
*/

export default function FireBackground({ className = '' }) {
  const canvasRef    = useRef(null)
  const offCanvasRef = useRef(null)   // offscreen pour le rendu feu
  const rafRef       = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* ── Setup ── */
    const W_FIRE = 220   // résolution interne grille (largeur)
    const H_FIRE = 90    // résolution interne grille (hauteur)

    // Canvas offscreen pour le feu basse résolution
    const off = document.createElement('canvas')
    off.width  = W_FIRE
    off.height = H_FIRE
    offCanvasRef.current = off
    const octx = off.getContext('2d')

    const ctx = canvas.getContext('2d')

    /* ── Resize ── */
    const resize = () => {
      const parent = canvas.parentElement
      canvas.width  = parent ? parent.offsetWidth  : window.innerWidth
      canvas.height = parent ? parent.offsetHeight : 420
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    window.addEventListener('resize', resize)

    /* ── Palette feu (256 couleurs) ── */
    // Noir → rouge foncé → rouge → orange → jaune → blanc
    const palette = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let r, g, b, a
      if (i < 60) {
        // noir → rouge sombre
        r = Math.round(i * 3.2)
        g = 0
        b = 0
        a = Math.round(i * 3.5)
      } else if (i < 120) {
        // rouge → orange
        const t = (i - 60) / 60
        r = Math.min(255, 180 + Math.round(t * 75))
        g = Math.round(t * 120)
        b = 0
        a = 200 + Math.round(t * 55)
      } else if (i < 190) {
        // orange → jaune
        const t = (i - 120) / 70
        r = 255
        g = 120 + Math.round(t * 120)
        b = Math.round(t * 30)
        a = 255
      } else {
        // jaune → blanc
        const t = (i - 190) / 65
        r = 255
        g = 240 + Math.round(t * 15)
        b = Math.round(t * 220)
        a = 255
      }
      // Packing RGBA en little-endian (abgr pour putImageData)
      palette[i] = (a << 24) | (b << 16) | (g << 8) | r
    }

    /* ── Grille de chaleur ── */
    // On travaille sur W_FIRE x (H_FIRE+1) pour avoir une ligne source en bas
    const fireGrid = new Uint8Array(W_FIRE * (H_FIRE + 1))

    /* ── Allumer la source (ligne du bas) ── */
    const igniteLine = () => {
      const base = H_FIRE * W_FIRE
      for (let x = 0; x < W_FIRE; x++) {
        // Flamme plus intense au centre, qui ondule
        const centerBias = 1 - Math.abs((x / W_FIRE) - 0.5) * 1.1
        const v = Math.max(0, Math.min(255, Math.round(
          (200 + Math.random() * 55) * Math.max(0, centerBias)
        )))
        fireGrid[base + x] = v
        // Quelques "pics" aléatoires pour simuler les langues de feu
        if (Math.random() > 0.7) fireGrid[base + x] = Math.min(255, v + Math.round(Math.random() * 55))
      }
    }

    /* ── Étape de propagation ── */
    const stepFire = () => {
      igniteLine()

      for (let y = 0; y < H_FIRE; y++) {
        for (let x = 0; x < W_FIRE; x++) {
          // Moyenne des 3 cellules en dessous + cellule actuelle
          const below  = fireGrid[(y + 1) * W_FIRE + x]
          const belowL = fireGrid[(y + 1) * W_FIRE + Math.max(0, x - 1)]
          const belowR = fireGrid[(y + 1) * W_FIRE + Math.min(W_FIRE - 1, x + 1)]
          const curr   = fireGrid[y * W_FIRE + x]

          // Diffusion : la chaleur monte et se refroidit légèrement
          const cool   = Math.floor(Math.random() * 3)   // 0, 1 ou 2
          let   newVal = Math.floor((below + belowL + belowR + curr) / 4) - cool

          newVal = Math.max(0, Math.min(255, newVal))
          fireGrid[y * W_FIRE + x] = newVal
        }
      }
    }

    /* ── Rendu grille → imageData ── */
    const imgData = octx.createImageData(W_FIRE, H_FIRE)
    const pixels  = new Uint32Array(imgData.data.buffer)

    const renderFire = () => {
      for (let y = 0; y < H_FIRE; y++) {
        for (let x = 0; x < W_FIRE; x++) {
          const heat = fireGrid[y * W_FIRE + x]
          pixels[y * W_FIRE + x] = palette[heat]
        }
      }
      octx.putImageData(imgData, 0, 0)
    }

    /* ── Braises (points au-dessus de la flamme principale) ── */
    const embers = []
    const MAX_EMBERS = 35

    const spawnEmber = () => {
      const cw = canvas.width
      const ch = canvas.height
      embers.push({
        x: cw * 0.5 + (Math.random() - 0.5) * cw * 0.6,
        y: ch * 0.85,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(1.5 + Math.random() * 3.0),
        life: 1.0,
        decay: 0.011 + Math.random() * 0.014,
        size: 0.8 + Math.random() * 2.0,
        hue: 15 + Math.random() * 35,
        osc: Math.random() * Math.PI * 2,
      })
    }

    /* ── Boucle principale ── */
    let frame = 0

    const draw = () => {
      frame++
      const cw = canvas.width
      const ch = canvas.height

      ctx.clearRect(0, 0, cw, ch)

      /* ── 1. Simulation feu ── */
      stepFire()
      renderFire()

      // Projection du canvas feu (basse résolution) → canvas final
      // On le pose en bas, étiré en pleine largeur, mais il dépasse vers le haut
      ctx.save()
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      const fireH = ch * 1.1   // Le feu dépasse un peu en bas
      const fireY = ch - fireH  // Ancré en bas

      ctx.drawImage(off, 0, fireY, cw, fireH)
      ctx.restore()

      /* ── 2. Lueur de base pulsante ── */
      const pulse = 0.85 + Math.sin(frame * 0.03) * 0.1
      const gGrd = ctx.createRadialGradient(
        cw * 0.5, ch, 0,
        cw * 0.5, ch, cw * 0.45 * pulse
      )
      gGrd.addColorStop(0,   `rgba(255,130,0,${0.28 * pulse})`)
      gGrd.addColorStop(0.5, `rgba(255,60,0,${0.14 * pulse})`)
      gGrd.addColorStop(1,   'rgba(150,20,0,0)')
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.fillStyle = gGrd
      ctx.fillRect(0, 0, cw, ch)
      ctx.restore()

      /* ── 3. Braises ── */
      if (embers.length < MAX_EMBERS && Math.random() > 0.45) spawnEmber()

      for (let j = embers.length - 1; j >= 0; j--) {
        const e = embers[j]
        e.osc += 0.03
        e.x   += e.vx + Math.sin(e.osc) * 0.5
        e.y   += e.vy
        e.vy  *= 0.992
        e.life -= e.decay

        if (e.life <= 0) { embers.splice(j, 1); continue }

        const alpha = Math.pow(e.life, 1.3)
        ctx.save()
        ctx.shadowBlur  = 5 + e.size * 3
        ctx.shadowColor = `hsla(${e.hue},100%,62%,${alpha})`
        ctx.globalAlpha = alpha
        ctx.fillStyle   = `hsl(${e.hue},100%,${42 + e.life * 22}%)`
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size * Math.max(0.15, e.life), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`ft-fire-bg ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',    /* le CSS contrôle la taille, pas ici */
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

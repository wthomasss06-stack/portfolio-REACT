import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/* ═══════════════════════════════════════════════════════
   Fireakatech.jsx
   Remplace le bloc iridescent du footer (.ft-aka-wrap)
   Animation feu GSAP — 60 layers + embers canvas

   Usage dans Footer() de App.jsx :
     import Fireakatech from './components/Fireakatech.jsx'
     ...
     <Fireakatech />   ← remplace la div .ft-aka-wrap
═══════════════════════════════════════════════════════ */

const NUM_LAYERS = 60

/* Couleur en fonction de la position dans la flamme (0=bas, 1=haut) */
function getFireColor(p) {
  if (p < 0.08) {
    return { r: 255, g: 255, b: Math.round(255 - (p / 0.08) * 130) }
  } else if (p < 0.35) {
    const t = (p - 0.08) / 0.27
    return { r: 255, g: Math.round(255 - t * 125), b: Math.round(112 - t * 112) }
  } else if (p < 0.65) {
    const t = (p - 0.35) / 0.30
    return { r: 255, g: Math.round(130 - t * 105), b: 0 }
  } else {
    const t = (p - 0.65) / 0.35
    return { r: Math.round(255 - t * 115), g: Math.round(25 - t * 25), b: 0 }
  }
}

export default function Fireakatech({ className = '' }) {
  const wrapRef    = useRef(null)
  const canvasRef  = useRef(null)
  const tweensRef  = useRef([])
  const embersRef  = useRef([])
  const rafRef     = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    /* ── 1. Créer les layers texte ── */
    const layers = []

    for (let i = 0; i < NUM_LAYERS; i++) {
      const el = document.createElement('div')
      el.className = 'fak-layer'
      el.textContent = 'akaTECH'

      const p = i / NUM_LAYERS
      const { r, g, b } = getFireColor(p)
      const baseAlpha = p < 0.65
        ? 1
        : Math.max(0, 1 - Math.pow((p - 0.65) / 0.35, 1.5))
      const blur = p * 16

      el.style.cssText = `
        font-family:'Arial Black','Impact',sans-serif;
        font-size:14vw;
        font-weight:900;
        font-style:italic;
        text-transform:uppercase;
        letter-spacing:-3px;
        position:absolute;
        transform-origin:center bottom;
        pointer-events:none;
        mix-blend-mode:screen;
        will-change:transform,opacity;
        filter:blur(${blur}px);
        color:rgba(${r},${g},${b},${baseAlpha});
        z-index:${50 - i};
      `
      el._p         = p
      el._baseAlpha = baseAlpha

      wrap.appendChild(el)
      layers.push(el)
    }

    /* ── 2. Position initiale ── */
    layers.forEach(el => {
      const p = el._p
      gsap.set(el, {
        y: -p * 240,
        x: Math.pow(p, 1.6) * 80,
        scaleY: 1 + p * 1.5,
      })
    })

    /* ── 3. GSAP timelines infinies par layer ── */
    layers.forEach((el, i) => {
      const p = el._p
      const phase = (i / NUM_LAYERS) * Math.PI * 2

      const durX = 1.3 + Math.random() * 0.7
      const durY = 0.9 + Math.random() * 0.55
      const durS = 0.65 + Math.random() * 0.4

      const xAmp     = 20 + p * 50
      const baseY    = -p * 240
      const baseX    = Math.pow(p, 1.6) * 80
      const scaleBase = 1 + p * 1.5

      // X oscillation
      tweensRef.current.push(
        gsap.to(el, {
          x: baseX + xAmp,
          duration: durX,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: (phase / (Math.PI * 2)) * durX,
        })
      )

      // Y oscillation
      tweensRef.current.push(
        gsap.to(el, {
          y: baseY - (8 + p * 20),
          duration: durY,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: (phase / (Math.PI * 2)) * durY * 0.7,
        })
      )

      // ScaleY étirement
      tweensRef.current.push(
        gsap.to(el, {
          scaleY: scaleBase + 0.06 + p * 0.16,
          duration: durS,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: (phase / (Math.PI * 2)) * durS * 0.5,
        })
      )

      // Flicker opacité
      ;(function flicker() {
        const flick   = 0.82 + Math.random() * 0.36
        const alpha   = Math.min(1, el._baseAlpha * flick)
        const tw = gsap.to(el, {
          opacity: alpha,
          duration: 0.06 + Math.random() * 0.11,
          ease: 'none',
          onComplete: flicker,
        })
        tweensRef.current.push(tw)
      })()
    })

    /* ── 4. Embers canvas ── */
    const canvas = canvasRef.current
    if (canvas) {
      const resize = () => {
        canvas.width  = wrap.offsetWidth  || window.innerWidth
        canvas.height = wrap.offsetHeight || 220
      }
      resize()
      window.addEventListener('resize', resize)

      const ctx = canvas.getContext('2d')
      const embers = embersRef.current

      const spawnEmber = () => {
        const cw = canvas.width, ch = canvas.height
        const cx = cw / 2 + (Math.random() - 0.5) * cw * 0.45
        embers.push({
          x: cx, y: ch * 0.72,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(1.2 + Math.random() * 3.0),
          life: 1,
          decay: 0.009 + Math.random() * 0.013,
          size: 1 + Math.random() * 2.2,
          hue: 10 + Math.random() * 38,
          glow: Math.random() > 0.55,
        })
      }

      const drawEmbers = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (embers.length < 40 && Math.random() > 0.4) spawnEmber()

        for (let j = embers.length - 1; j >= 0; j--) {
          const e = embers[j]
          e.x  += e.vx + Math.sin(Date.now() * 0.003 + j) * 0.35
          e.y  += e.vy
          e.vy *= 0.993
          e.life -= e.decay
          if (e.life <= 0) { embers.splice(j, 1); continue }

          const alpha = Math.pow(e.life, 1.4)
          ctx.save()
          if (e.glow) {
            ctx.shadowBlur  = 7 + e.size * 3
            ctx.shadowColor = `hsla(${e.hue},100%,62%,${alpha})`
          }
          ctx.globalAlpha = alpha
          ctx.fillStyle   = `hsl(${e.hue},100%,${38 + e.life * 24}%)`
          ctx.beginPath()
          ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
        rafRef.current = requestAnimationFrame(drawEmbers)
      }
      drawEmbers()

      return () => {
        window.removeEventListener('resize', resize)
        cancelAnimationFrame(rafRef.current)
        tweensRef.current.forEach(t => t.kill())
        tweensRef.current = []
        embersRef.current = []
        // Nettoyer les layers injectés
        layers.forEach(el => el.remove())
      }
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      tweensRef.current.forEach(t => t.kill())
      tweensRef.current = []
      embersRef.current = []
      layers.forEach(el => el.remove())
    }
  }, [])

  return (
    <div
      className={`ft-aka-wrap ft-aka-fire ${className}`}
      style={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        height: 'clamp(120px, 18vw, 260px)',
        overflow: 'hidden',
        marginTop: '4rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* Overrides the CSS mask from style.css — pas de masque ici */
        WebkitMaskImage: 'none',
        maskImage: 'none',
      }}
      ref={wrapRef}
    >
      {/* Texte de base (visible en dessous des layers feu) */}
      <div
        style={{
          fontFamily: "'Arial Black','Impact',sans-serif",
          fontSize: '14vw',
          fontWeight: 900,
          fontStyle: 'italic',
          textTransform: 'uppercase',
          letterSpacing: '-3px',
          position: 'absolute',
          zIndex: 100,
          color: '#fff',
          textShadow: `
            -1px 1px 0 #fff,
            -2px 2px 0 #ffffee,
            -3px 3px 0 #ffee99,
            -4px 4px 0 #ffcc00,
            -5px 5px 0 #ffaa00,
            -6px 6px 0 #ff8800,
            -7px 7px 0 #ff5500,
            -8px 8px 0 #ee2200,
            -9px 9px 0 #cc1100,
            -10px 10px 0 #aa0000,
            -12px 12px 20px rgba(0,0,0,0.92)
          `,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        akaTECH
      </div>

      {/* Canvas pour les braises */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 150,
          opacity: 0.8,
        }}
      />
    </div>
  )
}

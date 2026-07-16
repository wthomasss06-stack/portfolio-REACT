import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { VERTEX_SHADER, FRONT_FRAGMENT_SHADER } from './DissolveTransition.jsx'

/* ════════════════════════════════════════════════════════════════
   LOADER — composant unique partagé App.jsx (desktop) / Appmobile.jsx
   ────────────────────────────────────────────────────────────────
   Fusion des deux Loader quasi identiques (compteur, liquid blur,
   explosion des lettres du nom/rôle). Les seules vraies différences
   entre desktop et mobile sont regroupées dans VARIANTS ci-dessous :
   préfixe de classes CSS (ld- / mob-ld-), textes, et magnitudes de
   l'explosion (portée en X/Y/Z, perspective, dispersion du scale).
   Le reste du code (timing, easing, structure JSX) est commun.

   SORTIE — dissolve WebGL (repris de transitions.html /
   DissolveTransition.jsx) à la place du fade opacity plat :
   dès que l'explosion des lettres se termine, un seul mesh "front"
   (shader FRONT_FRAGMENT_SHADER, sobel edge-glow + sparkle radial)
   texturé par un canvas généré (plate + halo, sans texte — juste
   l'effet de dissolve/sparkle, pas de mot à faire briller) se
   dissout à l'écran. Pas de mesh "back" : la vraie page est déjà
   montée derrière l'overlay fixed (#loader / #mob-loader), donc
   elle apparaît directement à travers l'alpha qui se dissout — nul
   besoin de la simuler avec une 2e texture. Le renderer/shader est
   initialisé dès le mount (pendant le compteur, temps mort largement
   suffisant) pour que la compil. du shader ne coûte rien au moment
   critique de l'explosion.
   ════════════════════════════════════════════════════════════════ */

const VARIANTS = {
  desktop: {
    rootId: 'loader',
    prefix: 'ld',
    nameLine2: 'Aka',
    roleText: 'FULL-STACK DEVELOPER · UI/UX · PRODUCT BUILDER',
    nameTextExtraClass: 'decrypt-text--xl',
    percentExtraClass: ' ld-percent--small',
    xUnit: 120, yRange: 300, zRange: 400, perspective: 1200, scaleRand: 0.6,
  },
  mobile: {
    rootId: 'mob-loader',
    prefix: 'mob-ld',
    nameLine2: 'aka',
    roleText: 'FULL-STACK · UI/UX · PRODUCT BUILDER',
    nameTextExtraClass: 'mob-ld-name-xl',
    percentExtraClass: '',
    xUnit: 80, yRange: 200, zRange: 300, perspective: 800, scaleRand: 0.5,
  },
}

/* ── Layer WebGL de sortie — 1 seul mesh (front), pas de back.
   Retourne l'API utilisée plus tard par runExit(). ── */
function createDissolveLayer(canvas, dark) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 1
  const scene = new THREE.Scene()
  const geometry = new THREE.PlaneGeometry(2, 2)

  const uniforms = {
    uTexture: { value: null },
    uResolution: { value: new THREE.Vector2() },
    uImageResolution: { value: new THREE.Vector2(1, 1) },
    uDissolve: { value: 0 },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uGrayscale: { value: 0 },
    uEdgeIntensity: { value: 0 },
    uEdgeBrightness: { value: 1 },
  }

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRONT_FRAGMENT_SHADER,
    uniforms,
    transparent: true,
  })
  scene.add(new THREE.Mesh(geometry, material))

  function render() { renderer.render(scene, camera) }

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    uniforms.uResolution.value.set(w, h)
    render()
  }

  /* Texture canvas — pas de mot dessus (retour Aka) : juste la plaque
     (fond + halo, même traitement que le CSS de #loader), pour un
     handoff visuel propre. L'effet repose sur le dissolve + le
     sparkle radial du shader (transitions.html), pas sur un contour
     de texte à faire briller. */
  const plate = document.createElement('canvas')
  plate.width = 1920
  plate.height = 1080
  const pctx = plate.getContext('2d')
  const texture = new THREE.CanvasTexture(plate)
  if ('colorSpace' in texture) texture.colorSpace = THREE.SRGBColorSpace
  uniforms.uTexture.value = texture
  uniforms.uImageResolution.value.set(plate.width, plate.height)

  function drawPlate() {
    const base = dark ? '#080400' : '#f3efe8'
    pctx.clearRect(0, 0, plate.width, plate.height)
    pctx.fillStyle = base
    pctx.fillRect(0, 0, plate.width, plate.height)

    /* Halo radial haut — reprend le radial-gradient CSS de #loader */
    const halo = pctx.createRadialGradient(plate.width / 2, 0, 0, plate.width / 2, 0, plate.width * 0.42)
    halo.addColorStop(0, dark ? 'rgba(255,85,0,.16)' : 'rgba(255,85,0,.10)')
    halo.addColorStop(1, 'rgba(255,85,0,0)')
    pctx.fillStyle = halo
    pctx.fillRect(0, 0, plate.width, plate.height)

    texture.needsUpdate = true
  }
  drawPlate()

  resize()
  window.addEventListener('resize', resize)

  /* Uniforms dérivés du dissolve — identique à syncDissolve() dans
     HeroZoomSection (App.jsx), rejoué ici via onUpdate GSAP. */
  function syncDissolve() {
    const p = uniforms.uDissolve.value
    uniforms.uGrayscale.value = Math.min(1, p / 0.4)
    uniforms.uEdgeIntensity.value = p * 0.5
    uniforms.uEdgeBrightness.value = 1 - p
    render()
  }

  function dispose() {
    window.removeEventListener('resize', resize)
    geometry.dispose()
    material.dispose()
    texture.dispose()
    renderer.dispose()
  }

  return { uniforms, syncDissolve, dispose }
}

export default function Loader({ onDone, isMobile = false, dark = true }) {
  const cfg = isMobile ? VARIANTS.mobile : VARIANTS.desktop
  const p = cfg.prefix

  const [progress, setProgress] = useState(0)
  const loaderRef = useRef(null)
  const nameRef = useRef(null)
  const canvasRef = useRef(null)
  const dissolveRef = useRef(null)
  const explodedRef = useRef(false)
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone }, [onDone])

  /* ── Dissolve layer : préparé dès le mount (shader compilé pendant
     le compteur — coût perçu nul au moment de l'explosion). Repli
     silencieux sur `null` si WebGL indisponible ; runExit() bascule
     alors sur l'ancien fade opacity plat. ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let layer = null
    try {
      layer = createDissolveLayer(canvas, dark)
      dissolveRef.current = layer
    } catch {
      dissolveRef.current = null
    }
    return () => {
      dissolveRef.current = null
      if (layer) {
        gsap.killTweensOf(layer.uniforms.uDissolve)
        layer.dispose()
      }
    }
  }, [dark])

  /* ── Liquid blur init ── */
  useEffect(() => {
    const blurEl = document.getElementById(`${p}-liquid-blur`)
    if (blurEl) blurEl.setAttribute('stdDeviation', '28')
  }, [p])

  /* ── Entrance animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(`.${p}-logo-wrap`,
        { y: -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.08 }
      )
      gsap.fromTo(`.${p}-percent`,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      )
      gsap.fromTo(`.${p}-name`, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.28 })
      gsap.fromTo(`.${p}-role`,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.5 }
      )
      gsap.fromTo(`.${p}-corner`,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.55 }
      )
      gsap.fromTo(`.${p}-place`,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.55 }
      )
    }, loaderRef)
    return () => ctx.revert()
  }, [p])

  /* ── Sortie : dissolve WebGL si le layer a pu s'initialiser,
     sinon fallback fade opacity (comportement d'origine). ── */
  function runExit(loader) {
    const layer = dissolveRef.current
    if (!layer) {
      gsap.to(loader, {
        opacity: 0, duration: 0.4, ease: 'power2.inOut',
        onComplete: () => {
          loader.style.visibility = 'hidden'
          loader.style.pointerEvents = 'none'
          onDoneRef.current()
        }
      })
      return
    }

    /* Le fond CSS de #loader/#mob-loader passe transparent : c'est
       le canvas (déjà visuellement identique au fond, uDissolve=0)
       qui prend le relais sans coupure visible. */
    loader.style.background = 'transparent'
    loader.style.pointerEvents = 'none' /* la page en dessous redevient cliquable dès le début du dissolve */

    gsap.to(layer.uniforms.uDissolve, {
      value: 1,
      duration: 1.6,
      ease: 'power1.inOut',
      onUpdate: layer.syncDissolve,
      onComplete: () => {
        loader.style.visibility = 'hidden'
        onDoneRef.current()
      },
    })
  }

  /* ── Progress counter + liquid blur sync + explosion ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const eased = 3 + (prev / 100) * 7
        const next = prev + Math.random() * eased

        const blurEl = document.getElementById(`${p}-liquid-blur`)
        if (blurEl) {
          const blurVal = Math.max(0, 28 * (1 - next / 100))
          blurEl.setAttribute('stdDeviation', String(blurVal.toFixed(2)))
        }

        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            if (explodedRef.current) return
            explodedRef.current = true

            const loader = loaderRef.current
            if (!loader) { onDoneRef.current(); return }

            const nameEl = nameRef.current
            if (!nameEl) { onDoneRef.current(); return }
            const nameTextEl = nameEl.querySelector(`.${p}-name-text`)
            if (!nameTextEl) { onDoneRef.current(); return }

            const blurEl2 = document.getElementById(`${p}-liquid-blur`)
            if (blurEl2) blurEl2.setAttribute('stdDeviation', '0')

            /* Split en chars pour l'explosion */
            const raw = "M'BOLLO ELVIS"
            nameTextEl.innerHTML = ''
            const chars = Array.from(raw).map(letter => {
              const span = document.createElement('span')
              span.className = `${p}-char`
              span.textContent = letter
              nameTextEl.appendChild(span)
              return span
            })

            /* Le rôle explose exactement comme le nom */
            const roleEl = loader.querySelector(`.${p}-role`)
            let roleChars = []
            if (roleEl) {
              const roleRaw = roleEl.textContent.trim() || ''
              roleEl.innerHTML = ''
              roleChars = Array.from(roleRaw).map(letter => {
                const span = document.createElement('span')
                span.className = `${p}-char ${p}-role-char`
                span.textContent = letter
                roleEl.appendChild(span)
                return span
              })
            }

            gsap.to([`.${p}-percent`, `.${p}-corner`, `.${p}-logo-wrap`, `.${p}-place`], {
              opacity: 0, y: -10, duration: 0.25, ease: 'power2.in',
            })

            gsap.set(nameEl, { perspective: cfg.perspective, transformStyle: 'preserve-3d' })
            gsap.set(nameTextEl, { transformStyle: 'preserve-3d', display: 'inline-block' })
            if (roleEl) gsap.set(roleEl, { transformStyle: 'preserve-3d', display: 'inline-block' })

            const mid = (chars.length - 1) / 2
            const tl = gsap.timeline({
              delay: 0.1,
              onComplete: () => runExit(loader),
            })
            chars.forEach((span, i) => {
              const dist = i - mid
              tl.to(span, {
                x: dist * cfg.xUnit,
                y: (Math.random() - 0.5) * cfg.yRange,
                z: Math.random() * cfg.zRange - cfg.zRange / 2,
                rotationX: (Math.random() - 0.5) * 720,
                rotationY: (Math.random() - 0.5) * 720,
                scale: 0.2 + Math.random() * cfg.scaleRand,
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out',
                delay: i * 0.022,
              }, 0)
            })

            if (roleChars.length) {
              const rMid = (roleChars.length - 1) / 2
              roleChars.forEach((span, i) => {
                const rDist = i - rMid
                tl.to(span, {
                  x: rDist * cfg.xUnit,
                  y: (Math.random() - 0.5) * cfg.yRange,
                  z: Math.random() * cfg.zRange - cfg.zRange / 2,
                  rotationX: (Math.random() - 0.5) * 720,
                  rotationY: (Math.random() - 0.5) * 720,
                  scale: 0.2 + Math.random() * cfg.scaleRand,
                  opacity: 0,
                  duration: 0.7,
                  ease: 'power2.out',
                  delay: i * 0.022,
                }, 0)
              })
            }
          }, 180)
          return 100
        }
        return next
      })
    }, 90)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id={cfg.rootId} ref={loaderRef}>

      {/* Canvas dissolve — 1er enfant : peint sous tout le reste
         (aucun z-index, ordre DOM), invisible tant que #loader garde
         son propre fond CSS opaque par-dessus. */}
      <canvas ref={canvasRef} className={`${p}-dissolve-canvas`} aria-hidden="true" />

      {/* SVG filter pour Liquid Blur Fusion — inline, invisible */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id={`${p}-liquid-filter`}>
            <feGaussianBlur id={`${p}-liquid-blur`} in="SourceGraphic" stdDeviation="28" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10"
              result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* LOGO — coin haut-gauche */}
      <div className={`${p}-logo-wrap`}>
        <img
          src="/assets/images/logo-akatech.webp"
          alt="AKATech"
          className={`${p}-logo`}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      {/* VILLE — coin haut-droite */}
      <div className={`${p}-place`}>Abidjan</div>

      {/* CENTER */}
      <div className={`${p}-center`}>

        {/* NAME — GRAND — 2 lignes fixes */}
        <div className={`${p}-name ${p}-name--liquid`} ref={nameRef}>
          <div className={`${p}-name-text ${cfg.nameTextExtraClass}`}>
            <span className={`${p}-name-line`}>M'BOLLO</span>
            <span className={`${p}-name-line`}>{cfg.nameLine2}</span>
          </div>
        </div>

        {/* ROLE */}
        <div className={`${p}-role ${p}-role--liquid`}>
          {cfg.roleText}
        </div>

      </div>

      {/* COMPTEUR % — coin bas-droite */}
      <div className={`${p}-percent${cfg.percentExtraClass}`}>
        {Math.floor(progress)}
        <span>%</span>
      </div>

      {/* CORNER — bas-gauche */}
      <div className={`${p}-corner`}>
        AKATECH 2026
      </div>

    </div>
  )
}
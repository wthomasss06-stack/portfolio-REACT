'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════
   PlasmaHero — Remplacement du AuroraHero par un shader Plasma
   Palette AKATech en symbiose : noir #030806 → vert forêt → émeraude #22c864 → mint #66ffaa
   Sinus layerés (style Nexura Plasma) + influence souris + grain
   Props :
     labels   – [{ text, x, y, delay? }] pour les badges flottants
     overlay  – opacité du voile sombre final (défaut 0.55)
   ═══════════════════════════════════════════════════════════════ */
export default function AuroraHero({ labels = [], overlay = 0.55 }) {
  const cvRef    = useRef(null)
  const rafRef   = useRef(null)
  const glRef    = useRef(null)
  const uRef     = useRef({})
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 })
  const lastTs   = useRef(0)
  const INTERVAL = 1000 / 60

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl')
    if (!gl) return
    glRef.current = gl

    const SCALE = 0.75

    const resize = () => {
      const parent = cv.parentElement
      const w = parent ? parent.getBoundingClientRect().width  : cv.offsetWidth
      const h = parent ? parent.getBoundingClientRect().height : (cv.offsetHeight || window.innerHeight)
      cv.width  = Math.round(w * SCALE)
      cv.height = Math.round(h * SCALE)
      if (cv.width  < 1) cv.width  = Math.round(window.innerWidth  * SCALE)
      if (cv.height < 1) cv.height = Math.round(window.innerHeight * SCALE)
      gl.viewport(0, 0, cv.width, cv.height)
    }
    resize()
    const resizeDeferred = setTimeout(resize, 150)
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    /* ── Vertex shader ── */
    const vert = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.,1.);}`

    /* ── Fragment shader — Plasma palette AKATech ── */
    /* Palette :
         a = #030806  (quasi noir, fond du site)
         b = #0d2415  (vert très sombre)
         c = #17a354  (vert forêt intermédiaire)
         d = #22c864  (émeraude dominant AKATech)
         e = #66ffaa  (mint lumineux pour les pics chauds)
    */
    const frag = `
      precision highp float;
      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_mouse;

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 p  = uv * 2.0 - 1.0;
        p.x    *= u_res.x / u_res.y;

        /* souris normalisée */
        vec2 m  = (u_mouse / u_res) * 2.0 - 1.0;
        m.x    *= u_res.x / u_res.y;

        float t = u_time * 0.55;

        /* ── Plasma : sinus layerés ── */
        float v = 0.0;
        v += sin(p.x * 5.5 + t);
        v += sin(p.y * 4.8 + t * 0.88);
        v += sin((p.x + p.y) * 3.6 + t * 0.72);
        v += sin((p.x - p.y) * 2.8 + t * 0.5);

        /* cercle animé centré + influence souris */
        float cx = p.x + 0.5 * sin(t * 0.38) + m.x * 0.28;
        float cy = p.y + 0.5 * cos(t * 0.29) + m.y * 0.28;
        v += sin(sqrt(90.0 * (cx * cx + cy * cy) + 1.0) + t * 1.1);

        /* onde supplémentaire liée à la souris */
        float md = length(p - m);
        v += sin(md * 8.0 - t * 1.4) * 0.4;

        v = v * 0.5 + 0.5;   /* → [0, 1] */

        /* ── Palette AKATech :
              noir #030806 → vert sombre #0d2415 → vert forêt #17a354 → émeraude #22c864 → mint #66ffaa ── */
        vec3 ca = vec3(0.012, 0.031, 0.024);   /* #030806 */
        vec3 cb = vec3(0.051, 0.141, 0.082);   /* #0d2415 */
        vec3 cc = vec3(0.090, 0.639, 0.329);   /* #17a354 */
        vec3 cd = vec3(0.133, 0.784, 0.392);   /* #22c864 */
        vec3 ce = vec3(0.400, 1.000, 0.667);   /* #66ffaa */

        vec3 col;
        float t1 = smoothstep(0.0,  0.25, v);
        float t2 = smoothstep(0.25, 0.5,  v);
        float t3 = smoothstep(0.5,  0.75, v);
        float t4 = smoothstep(0.75, 1.0,  v);

        col = mix(ca, cb, t1);
        col = mix(col, cc, t2);
        col = mix(col, cd, t3);
        col = mix(col, ce, t4);

        /* ── Pulsation douce de luminosité ── */
        col *= 0.82 + 0.18 * sin(t * 0.45);

        /* ── Vignette radiale ── */
        float vig = 1.0 - dot(uv - 0.5, (uv - 0.5) * 2.2);
        col *= clamp(vig * 1.1, 0.0, 1.0);

        /* ── Assombrissement du bas ── */
        col *= mix(0.08, 1.0, smoothstep(0.0, 0.42, uv.y));

        /* ── Halo souris émeraude ── */
        col += cd * exp(-md * 2.8) * 0.28;

        /* ── Grain subtil ── */
        float grain = fract(sin(dot(gl_FragCoord.xy, vec2(127.1, 311.7)) + t * 80.0) * 43758.5453) * 0.028;
        col += grain;

        gl_FragColor = vec4(col, 1.0);
      }
    `

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    uRef.current = {
      res:   gl.getUniformLocation(prog, 'u_res'),
      time:  gl.getUniformLocation(prog, 'u_time'),
      mouse: gl.getUniformLocation(prog, 'u_mouse'),
    }

    /* Souris avec inertie douce */
    const onMouse = e => {
      mouseRef.current.tx = e.clientX
      mouseRef.current.ty = cv.height - e.clientY
    }
    const onTouch = e => {
      const t0 = e.touches[0]
      mouseRef.current.tx = t0.clientX
      mouseRef.current.ty = cv.height - t0.clientY
    }

    /* Initialiser au centre */
    mouseRef.current = {
      x: cv.width * 0.5, y: cv.height * 0.5,
      tx: cv.width * 0.5, ty: cv.height * 0.5,
    }

    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })

    const render = ts => {
      if (!glRef.current) return
      rafRef.current = requestAnimationFrame(render)
      if (ts - lastTs.current < INTERVAL) return
      lastTs.current = ts

      /* inertie souris */
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.06
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.06

      const u = uRef.current
      gl.uniform2f(u.res,   cv.width, cv.height)
      gl.uniform1f(u.time,  ts * 0.001)
      gl.uniform2f(u.mouse, mouseRef.current.x, mouseRef.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(resizeDeferred)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      glRef.current = null
    }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>

      {/* ── Canvas WebGL Plasma ── */}
      <canvas
        ref={cvRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          display: 'block',
        }}
      />

      {/* ── Ligne de scan plasma ── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(34,200,100,.45),rgba(102,255,170,.6),rgba(34,200,100,.45),transparent)',
        animation: 'plasma-scan 7s linear infinite',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* ── Overlay foncé pour lisibilité du texte ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: `linear-gradient(to bottom,
          rgba(3,8,6,${overlay}) 0%,
          rgba(3,8,6,${overlay * 0.28}) 35%,
          rgba(3,8,6,${overlay * 0.22}) 60%,
          rgba(3,8,6,${overlay * 0.92}) 100%)`,
      }} />

      {/* ── Badges flottants contextuels — masqués sur mobile ── */}
      {labels.map(({ text, x, y, delay = 0 }, i) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, -5, 0] }}
          transition={{
            opacity: { delay: 0.6 + delay, duration: 0.6 },
            y: { duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay },
          }}
          style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            zIndex: 4,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 100,
            background: 'rgba(3,8,6,0.72)',
            border: '1px solid rgba(34,200,100,.28)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 16px rgba(34,200,100,.15)',
            pointerEvents: 'none',
          }}
          className="aurora-pill"
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#22c864',
            boxShadow: '0 0 8px rgba(34,200,100,.9)',
            display: 'inline-block',
            animation: 'dot-blink 2s ease-in-out infinite',
            animationDelay: `${i * 0.3}s`,
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem', fontWeight: 600,
            color: 'rgba(255,255,255,.72)',
            letterSpacing: '.1em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {text}
          </span>
        </motion.div>
      ))}

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes plasma-scan {
          0%   { top: -2%; }
          100% { top: 104%; }
        }
        @media (max-width: 768px) {
          .aurora-pill { display: none !important; }
        }
      `}</style>
    </div>
  )
}

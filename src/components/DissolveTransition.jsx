import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

/* ════════════════════════════════════════════
   DISSOLVE TRANSITION — WebGL scroll-dissolve
   Port React de transition.html : deux plans
   (front qui se dissout / back qui se révèle,
   avec glow de bord type "scan" + grain de bruit),
   pilotés non plus par un scroll-listener manuel
   + rAF continu, mais par ScrollTrigger (scrub),
   qui ne redessine qu'au changement de progress.
   ════════════════════════════════════════════ */

export const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const FRONT_FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uGrayscale;
  uniform float uEdgeIntensity;
  uniform float uEdgeBrightness;
  varying vec2 vUv;

  mat3 sobelX = mat3(-1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0);
  mat3 sobelY = mat3(-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0);

  float getLuminance(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0; float gy = 0.0;
    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }
    return sqrt(gx * gx + gy * gy);
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0; float amplitude = 0.5; float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5; frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 texColor = texture2D(uTexture, uv);
    float gray = getLuminance(texColor.rgb);
    texColor.rgb = mix(texColor.rgb, vec3(gray), uGrayscale);

    vec2 centeredUv = vUv - uCenter;
    float aspect = uResolution.x / uResolution.y;
    centeredUv.x *= aspect;
    float dist = length(centeredUv);
    float angle = atan(centeredUv.y, centeredUv.x);

    float noiseScale = 6.0;
    vec2 pixelatedUv = floor(vUv * uResolution / noiseScale) * noiseScale / uResolution;
    float blockNoise = fbm(pixelatedUv * 100.0) * 0.15;
    float angularNoise = fbm(vec2(angle * 5.0, 0.0)) * 0.15;

    float totalNoise = blockNoise + angularNoise;
    float noisyDist = dist + totalNoise;
    float maxDist = length(vec2(aspect * 0.5, 0.5));
    float normalizedDist = noisyDist / maxDist;

    float dissolveThreshold = uDissolve * 1.5;
    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);

    edge = pow(edge, 0.7) * 2.0;
    edge = clamp(edge, 0.0, 1.0);

    float dissolveMask = smoothstep(dissolveThreshold - 0.03, dissolveThreshold, normalizedDist);
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    vec3 baseColor = mix(texColor.rgb, vec3(0.0), uGrayscale);
    vec3 finalColor = baseColor;

    float edgeGlowIntensity = uEdgeIntensity * 2.0;
    float edgeGlow = edge * edgeGlowIntensity * (1.0 + uGrayscale * 3.0);
    finalColor += edgeColor * edgeGlow * uEdgeBrightness;

    float edgeZoneWidth = 0.15 * (1.0 - uDissolve) + 0.02;
    float edgeZone = smoothstep(dissolveThreshold - edgeZoneWidth, dissolveThreshold - edgeZoneWidth + 0.04, normalizedDist) *
                     smoothstep(dissolveThreshold + 0.02, dissolveThreshold - 0.02, normalizedDist);
    float sparkle = hash(floor(vUv * uResolution / 4.0)) * edgeZone;

    float edgeBrightness = (1.0 - uDissolve) * uEdgeBrightness * (1.0 + uGrayscale * 2.0);
    finalColor += vec3(sparkle * 3.0 * edgeBrightness);

    float alpha = dissolveMask * texColor.a;
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export const BACK_FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uEdgeIntensity;
  uniform float uDarkness;
  uniform float uGrayscale;
  varying vec2 vUv;

  mat3 sobelX = mat3(-1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0);
  mat3 sobelY = mat3(-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0);

  float getLuminance(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0; float gy = 0.0;
    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }
    return sqrt(gx * gx + gy * gy);
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 texColor = texture2D(uTexture, uv);
    float gray = getLuminance(texColor.rgb);
    texColor.rgb = mix(texColor.rgb, vec3(gray), uGrayscale);

    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);
    edge = pow(edge, 0.7) * 2.0;
    edge = clamp(edge, 0.0, 1.0);

    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    vec3 baseColor = mix(texColor.rgb, vec3(0.0), uDarkness);

    float edgeGlow = edge * uEdgeIntensity * 2.0;
    baseColor += edgeColor * edgeGlow;

    gl_FragColor = vec4(clamp(baseColor, 0.0, 1.0), texColor.a);
  }
`

/**
 * DissolveTransition
 * Section pinnée (heightVh) qui dissout `frontSrc` pour révéler `backSrc`
 * au fil du scroll, avec le même look "scan/glow" que transition.html.
 * Si `cta` est fourni, un texte + bouton apparaissent, centrés par-dessus,
 * dans la seconde moitié du dissolve.
 *
 * Props :
 *  - id, className
 *  - frontSrc, backSrc (obligatoires)
 *  - heightVh (durée du scroll pinné, défaut 240)
 *  - cta: { eyebrow?, title, subtitle?, buttonLabel?, href? } | null
 */
export default function DissolveTransition({
  id,
  className = '',
  frontSrc,
  backSrc,
  heightVh = 240,
  revealVh = 0,
  cta = null,
}) {
  const pinRef = useRef(null)
  const canvasRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const pinEl = pinRef.current
    const canvas = canvasRef.current
    if (!pinEl || !canvas || !frontSrc || !backSrc) return

    let destroyed = false
    let frontTexture = null
    let backTexture = null

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1
    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniformsFront = {
      uTexture: { value: null },
      uResolution: { value: new THREE.Vector2() },
      uImageResolution: { value: new THREE.Vector2(1, 1) },
      uDissolve: { value: 0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uGrayscale: { value: 0 },
      uEdgeIntensity: { value: 0 },
      uEdgeBrightness: { value: 1 },
    }
    const uniformsBack = {
      uTexture: { value: null },
      uResolution: { value: new THREE.Vector2() },
      uImageResolution: { value: new THREE.Vector2(1, 1) },
      uEdgeIntensity: { value: 0.6 },
      uDarkness: { value: 1 },
      uGrayscale: { value: 1 },
    }

    const materialFront = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRONT_FRAGMENT_SHADER,
      uniforms: uniformsFront,
      transparent: true,
    })
    const materialBack = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: BACK_FRAGMENT_SHADER,
      uniforms: uniformsBack,
      transparent: true,
    })

    const meshBack = new THREE.Mesh(geometry, materialBack)
    meshBack.position.z = -0.1
    scene.add(meshBack)
    const meshFront = new THREE.Mesh(geometry, materialFront)
    meshFront.position.z = 0
    scene.add(meshFront)

    function render() {
      if (destroyed) return
      renderer.render(scene, camera)
    }

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      uniformsFront.uResolution.value.set(w, h)
      uniformsBack.uResolution.value.set(w, h)
      render()
    }

    const loader = new THREE.TextureLoader()
    loader.load(frontSrc, tex => {
      if (destroyed) { tex.dispose(); return }
      if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace
      frontTexture = tex
      uniformsFront.uTexture.value = tex
      uniformsFront.uImageResolution.value.set(tex.image.width, tex.image.height)
      render()
    })
    loader.load(backSrc, tex => {
      if (destroyed) { tex.dispose(); return }
      if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace
      backTexture = tex
      uniformsBack.uTexture.value = tex
      uniformsBack.uImageResolution.value.set(tex.image.width, tex.image.height)
      render()
    })

    function setProgress(p) {
      uniformsFront.uDissolve.value = p
      uniformsFront.uGrayscale.value = Math.min(1, p / 0.4)
      uniformsFront.uEdgeIntensity.value = p * 0.5
      uniformsFront.uEdgeBrightness.value = 1 - p

      const acc = Math.min(1, p * 1.1)
      uniformsBack.uEdgeIntensity.value = 0.6 * (1 - acc)
      uniformsBack.uDarkness.value = 1 - acc
      uniformsBack.uGrayscale.value = 1 - acc

      render()

      if (ctaRef.current) {
        const ctaP = Math.max(0, Math.min(1, (p - 0.55) / 0.45))
        ctaRef.current.style.opacity = String(ctaP)
        ctaRef.current.style.transform = `translate(-50%, calc(-50% + ${(1 - ctaP) * 26}px))`
        ctaRef.current.style.pointerEvents = ctaP > 0.5 ? 'auto' : 'none'
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const st = ScrollTrigger.create({
      trigger: pinEl,
      start: 'top top',
      // Par défaut (revealVh=0) : identique à 'bottom bottom'.
      // Avec revealVh>0 : le scrub se termine plus tôt, laissant
      // 'revealVh' de scroll figé (uDissolve déjà à 1) avant que
      // le pin ne se libère vraiment — le temps qu'une section
      // suivante vienne le recouvrir sans le surprendre en pleine
      // animation (cf. .full-beams-zone / --stk-reveal).
      end: () => `+=${pinEl.offsetHeight - window.innerHeight - (revealVh / 100) * window.innerHeight}`,
      scrub: 1,
      onUpdate: self => setProgress(self.progress),
    })

    return () => {
      destroyed = true
      window.removeEventListener('resize', resize)
      st.kill()
      geometry.dispose()
      materialFront.dispose()
      materialBack.dispose()
      frontTexture?.dispose()
      backTexture?.dispose()
      renderer.dispose()
    }
  }, [frontSrc, backSrc])

  return (
    <section id={id} className={`dsv-section force-dark ${className}`}>
      <div ref={pinRef} className="dsv-pin" style={{ height: `${heightVh}vh` }}>
        <div className="dsv-sticky">
          <canvas ref={canvasRef} className="dsv-canvas" aria-hidden="true" />

          {cta && (
            <div ref={ctaRef} className="dsv-cta">
              {cta.eyebrow && <span className="dsv-cta-eyebrow">{cta.eyebrow}</span>}
              <h2 className="dsv-cta-title">{cta.title}</h2>
              {cta.subtitle && <p className="dsv-cta-sub">{cta.subtitle}</p>}
              {cta.buttonLabel && (
                <a href={cta.href || '#contact'} className="btn-fill dsv-cta-btn">
                  <span>{cta.buttonLabel}</span>
                  <span className="btn-arr" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
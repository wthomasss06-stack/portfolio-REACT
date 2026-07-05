import { useEffect, useRef } from 'react'

/* ════════════════════════════════════════════
   PIXEL SLICE TRAIL
   Port React du moteur vanilla de image.html :
   des images suivent le curseur, révélées par un
   balayage de tranches (clip-path) qui claque à
   l'entrée et se referme à la sortie. Le moteur
   DOM reste impératif comme l'original — piloté
   par le cycle de vie React via useEffect, pas
   réécrit en state React (on ne réinvente pas une
   mécanique déjà réglée à la frame près).

   Différence avec image.html : les images sont ici
   des logos (SVG à fond transparent), donc chaque
   tranche affiche une carte (fond + bordure, cohérent
   avec .skill-card) contenant un <img object-fit:
   contain> au lieu d'un background-image en "cover"
   qui aurait rogné les logos non carrés.
   ════════════════════════════════════════════ */

const MAX_ACTIVE_IMAGES = 14

class PixelSliceTrailEngine {
  constructor(container, options = {}) {
    this.container = container
    this.images = (options.images || []).filter(Boolean)

    this.slices = Math.max(1, Math.floor(options.slices || 6))
    this.spawnThreshold = Math.max(1, options.spawnThreshold || 55)
    this.smoothing = Math.min(Math.max(options.smoothing || 0.28, 0.01), 1)
    this.imageSize = Math.max(40, options.imageSize || 140)

    this.config = {
      imageLifespan: 1300,
      inDuration: 260,
      outDuration: 560,
      staggerIn: 11,
      staggerOut: 8,
      slideDuration: 1100,
      slideEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      ...options.config,
    }

    this.currentImageIndex = 0
    this.timeouts = []
    this.activeImages = []
    this.pointerActive = false
    this.pointerPos = { x: 0, y: 0 }
    this.lastSpawnPos = { x: 0, y: 0 }
    this.interpolatedPointerPos = { x: 0, y: 0 }
    this.animationFrameId = null

    this.updatePointer = this.updatePointer.bind(this)
    this.handlePointerLeave = this.handlePointerLeave.bind(this)
    this.render = this.render.bind(this)

    this.init()
  }

  init() {
    if (!this.images.length) return
    this.container.addEventListener('pointerenter', this.updatePointer)
    this.container.addEventListener('pointermove', this.updatePointer)
    this.container.addEventListener('pointerleave', this.handlePointerLeave)
    this.animationFrameId = requestAnimationFrame(this.render)
  }

  schedule(callback, delay) {
    const timeout = window.setTimeout(() => {
      this.timeouts = this.timeouts.filter(id => id !== timeout)
      callback()
    }, delay)
    this.timeouts.push(timeout)
    return timeout
  }

  updatePointer(event) {
    const rect = this.container.getBoundingClientRect()
    const next = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    this.pointerPos = next
    if (!this.pointerActive) {
      this.pointerActive = true
      this.interpolatedPointerPos = next
      this.lastSpawnPos = next
    }
  }

  handlePointerLeave() {
    this.pointerActive = false
  }

  distanceFromLastSpawn() {
    const dx = this.interpolatedPointerPos.x - this.lastSpawnPos.x
    const dy = this.interpolatedPointerPos.y - this.lastSpawnPos.y
    return Math.hypot(dx, dy)
  }

  getSliceDelay(index, stagger) {
    return Math.abs(index - (this.slices - 1) / 2) * stagger
  }

  getMaxSliceDelay(stagger) {
    return ((this.slices - 1) / 2) * stagger
  }

  createTrailImage() {
    if (!this.images.length) return

    const src = this.images[this.currentImageIndex % this.images.length]
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length

    const startX = this.interpolatedPointerPos.x - this.imageSize / 2
    const startY = this.interpolatedPointerPos.y - this.imageSize / 2
    const targetX = startX + (this.pointerPos.x - this.interpolatedPointerPos.x) * 0.45
    const targetY = startY + (this.pointerPos.y - this.interpolatedPointerPos.y) * 0.45

    const wrap = document.createElement('div')
    const fragment = document.createDocumentFragment()

    Object.assign(wrap.style, {
      position: 'absolute',
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${this.imageSize}px`,
      height: `${this.imageSize}px`,
      pointerEvents: 'none',
      overflow: 'hidden',
      borderRadius: '14px',
      opacity: '1',
      transform: 'translate3d(0, 0, 0) scale(1)',
      transition: [
        `left ${this.config.slideDuration}ms ${this.config.slideEasing}`,
        `top ${this.config.slideDuration}ms ${this.config.slideEasing}`,
        `opacity ${this.config.outDuration}ms ${this.config.easing}`,
        `transform ${this.config.outDuration}ms ${this.config.easing}`,
      ].join(', '),
      willChange: 'left, top, opacity, transform',
      zIndex: '1',
      filter: 'drop-shadow(0 14px 22px rgb(0 0 0 / 0.35))',
      contain: 'layout style paint',
      backfaceVisibility: 'hidden',
    })

    const layers = []

    for (let index = 0; index < this.slices; index += 1) {
      const sliceSize = 100 / this.slices
      const startClipY = index * sliceSize
      const endClipY = (index + 1) * sliceSize

      const layer = document.createElement('div')
      const card = document.createElement('div')
      const img = document.createElement('img')

      Object.assign(layer.style, {
        position: 'absolute',
        inset: '0',
        overflow: 'hidden',
        clipPath: `polygon(50% ${startClipY}%, 50% ${startClipY}%, 50% ${endClipY}%, 50% ${endClipY}%)`,
        transition: `clip-path ${this.config.inDuration}ms ${this.config.easing}`,
        transitionDelay: `${this.getSliceDelay(index, this.config.staggerIn)}ms`,
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'clip-path',
        contain: 'layout style',
      })

      Object.assign(card.style, {
        position: 'absolute',
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '14px',
        background: 'rgba(255,85,0,.07)',
        border: '2px solid rgba(255,85,0,.4)',
        boxShadow: '3px 3px 0 rgba(255,85,0,.4)',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      })

      Object.assign(img.style, {
        width: '52%',
        height: '52%',
        objectFit: 'contain',
        pointerEvents: 'none',
      })
      img.src = src
      img.alt = ''
      img.loading = 'eager'
      img.draggable = false

      card.appendChild(img)
      layer.appendChild(card)
      fragment.appendChild(layer)
      layers.push(layer)
    }

    wrap.appendChild(fragment)
    this.container.appendChild(wrap)
    this.activeImages.push(wrap)

    while (this.activeImages.length > MAX_ACTIVE_IMAGES) {
      this.activeImages.shift()?.remove()
    }

    requestAnimationFrame(() => {
      if (wrap.parentElement !== this.container) return
      wrap.style.left = `${targetX}px`
      wrap.style.top = `${targetY}px`
      layers.forEach((layer, index) => {
        const sliceSize = 100 / this.slices
        const startClipY = index * sliceSize
        const endClipY = (index + 1) * sliceSize
        layer.style.clipPath = `polygon(0% ${startClipY}%, 100% ${startClipY}%, 100% ${endClipY}%, 0% ${endClipY}%)`
      })
    })

    this.schedule(() => {
      wrap.style.opacity = '0'
      wrap.style.transform = 'translate3d(0, 0, 0) scale(0.24)'
      layers.forEach((layer, index) => {
        const sliceSize = 100 / this.slices
        const startClipY = index * sliceSize
        const endClipY = (index + 1) * sliceSize
        layer.style.transition = `clip-path ${this.config.outDuration}ms ${this.config.easing}`
        layer.style.transitionDelay = `${this.getSliceDelay(index, this.config.staggerOut)}ms`
        layer.style.clipPath = `polygon(50% ${startClipY}%, 50% ${startClipY}%, 50% ${endClipY}%, 50% ${endClipY}%)`
      })

      this.schedule(() => {
        this.activeImages = this.activeImages.filter(el => el !== wrap)
        wrap.remove()
      }, this.config.outDuration + this.getMaxSliceDelay(this.config.staggerOut))
    }, this.config.imageLifespan)
  }

  render() {
    if (this.pointerActive) {
      this.interpolatedPointerPos = {
        x: this.interpolatedPointerPos.x + (this.pointerPos.x - this.interpolatedPointerPos.x) * this.smoothing,
        y: this.interpolatedPointerPos.y + (this.pointerPos.y - this.interpolatedPointerPos.y) * this.smoothing,
      }
      if (this.distanceFromLastSpawn() > this.spawnThreshold) {
        this.lastSpawnPos = { ...this.interpolatedPointerPos }
        this.createTrailImage()
      }
    }
    this.animationFrameId = requestAnimationFrame(this.render)
  }

  destroy() {
    this.container.removeEventListener('pointerenter', this.updatePointer)
    this.container.removeEventListener('pointermove', this.updatePointer)
    this.container.removeEventListener('pointerleave', this.handlePointerLeave)
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId)
    this.timeouts.forEach(t => clearTimeout(t))
    this.container.innerHTML = ''
    this.activeImages = []
    this.timeouts = []
  }
}

/**
 * PixelSliceTrail
 * Remplit son conteneur parent (position absolute, inset 0) et fait
 * apparaître `images` en tranches qui suivent le curseur. Ne fait rien
 * au toucher par défaut (touch-action non forcé) pour ne jamais bloquer
 * le scroll mobile — c'est un plaisir desktop, pas une fonctionnalité.
 */
export default function PixelSliceTrail({
  images = [],
  slices = 6,
  imageSize = 140,
  smoothing = 0.28,
  spawnThreshold = 55,
  className = '',
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !images.length) return
    const engine = new PixelSliceTrailEngine(el, { images, slices, imageSize, smoothing, spawnThreshold })
    return () => engine.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join('|'), slices, imageSize, smoothing, spawnThreshold])

  return <div ref={containerRef} className={`pix-slice-trail ${className}`} />
}

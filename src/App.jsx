import { useState, useEffect, useRef, useCallback } from 'react'
import ScrambleText from './components/ScrambleText.jsx'
import Shuffle from './components/Shuffle.jsx'
import AnimatedCounter from './components/AnimatedCounter.jsx'
import RotatingText from './components/RotatingText.jsx'
import ScrollReveal from './components/ScrollReveal.jsx'
import TargetCursor from './components/TargetCursor.jsx'
import TextPressure from './components/TextPressure.jsx'
import Iridescence from './components/Iridescence.jsx'
import InfiniteMenu from './components/InfiniteMenu.jsx'
import './components/InfiniteMenu.css'
import { useSoundSystem } from './components/useClickSound.js'
import SoundToggle from './components/SoundToggle.jsx'
import { useGooeyTransition, runGridTransition } from './components/GooeyTransition.jsx'
import Stack from './components/Stack.jsx'
import ImageTrail from './components/ImageTrail.jsx'
import Lanyard from './components/Lanyard.jsx'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
gsap.registerPlugin(ScrollTrigger)

/* ════════════════════════════════════════════
   ANIMATED SVG ICONS  (replaces emojis)
   ════════════════════════════════════════════ */
const AnimIcon = ({ type, size = 15, color = '#FF5500', className = '' }) => {
  const icons = {
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    monitor: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    tool: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
    grad: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>,
    rocket: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    warn: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" className={`anim-icon ${className}`}><polyline points="20 6 9 17 4 12" /></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  }
  return icons[type] || null
}

/* ════════════════════════════════════════════
   HORIZONTAL PARALLAX SCROLL — prochain.html style
   Scroll vertical → translation horizontale des slides
   + titres qui glissent en contre-sens (parallax heading)
   ════════════════════════════════════════════ */
const HPSLIDES = [
  { word: 'REACT',      color: '#61DAFB', icon: '/assets/icons/devicon/react/react-original.svg',           label: 'Frontend Library' },
  { word: 'JAVASCRIPT', color: '#F7DF1E', icon: '/assets/icons/devicon/javascript/javascript-original.svg', label: 'Langage Universel' },
  { word: 'NEXT.JS',    color: '#F2EDE8', lightColor: '#1A1A1A', icon: '/assets/icons/devicon/nextjs/nextjs-original.svg', label: 'React Framework' },
  { word: 'PYTHON',     color: '#4B8BBE', icon: '/assets/icons/devicon/python/python-original.svg',         label: 'Backend & Data' },
  { word: 'DJANGO',     color: '#44B78B', icon: '/assets/icons/devicon/django/django-plain.svg',            label: 'Web Framework' },
  { word: 'MYSQL',      color: '#F29111', icon: '/assets/icons/devicon/mysql/mysql-original.svg',           label: 'Base de Données' },
]

function HorizontalParallax() {
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const headings  = track.querySelectorAll('.hpx-word')
    const totalSlides = headings.length

    const update = () => {
      const rect        = section.getBoundingClientRect()
      const sectionH    = section.offsetHeight
      const viewH       = window.innerHeight
      let   progress    = -rect.top / (sectionH - viewH)
      progress          = Math.max(0, Math.min(1, progress))

      /* ── 1. Translation horizontale du carrousel ── */
      const maxVW = (totalSlides - 1) * 100
      track.style.transform = `translateX(-${progress * maxVW}vw)`

      /* ── 2. Parallax heading — chaque titre glisse en contre-sens ── */
      const seg = 1 / totalSlides
      headings.forEach((h, i) => {
        const start = i * seg
        const end   = (i + 1) * seg
        let xOffset
        if (progress >= start && progress <= end) {
          const local = (progress - start) / seg   // 0 → 1 dans la slide
          xOffset = 600 - local * 1200             // +600px → -600px
        } else if (progress < start) {
          xOffset = 600
        } else {
          xOffset = -600
        }
        h.style.transform = `translateX(${xOffset}px)`
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section ref={sectionRef} id="hpx-section" className="hpx-section">
      {/* Étiquette section */}
      <div className="hpx-label">
        <span className="hpx-label-inner">// Meilleures armes</span>
      </div>

      {/* Zone sticky : l'écran reste figé, le carrousel glisse */}
      <div className="hpx-sticky">
        <ul ref={trackRef} id="hpx-track" className="hpx-track">
          {HPSLIDES.map((s, i) => (
            <li key={i} className="hpx-slide" style={{ '--hpx-color': s.color, '--hpx-color-light': s.lightColor || s.color }}>
              {/* Grille de fond */}
              <div className="hpx-slide-grid" />

              {/* Titre géant — parallax heading contre-sens */}
              <h2 className="hpx-word" style={{ color: s.color }}>{s.word}</h2>

              {/* Logo tech centré — remplace les images Unsplash */}
              <div className="hpx-logo-wrap" style={{ '--glow': s.color }}>
                <img
                  src={s.icon}
                  alt={s.word}
                  className="hpx-logo-img"
                  onError={e => { e.target.style.opacity = '0' }}
                />
              </div>

              {/* Label sous-titre */}
              <span className="hpx-sublabel" style={{ color: s.color }}>{s.label}</span>

              {/* Numéro de slide */}
              <span className="hpx-num">0{i + 1}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════
   SPLITTEXT REVEAL — h1 · h2 · hv4 · p
   Découpe les textes en chars/mots et les anime
   depuis le bas (style prochain.html)
   ════════════════════════════════════════════ */
function useSplitTextReveal() {
  useEffect(() => {
    let killed = false

    /* ── Utilitaires ── */
    const splitToChars = el => {
      const raw = el.textContent
      // Grouper par mot pour que les retours à la ligne n'interviennent
      // qu'entre les mots, jamais au milieu d'un mot (bug "p rojets")
      el.innerHTML = raw.split(/(\s+)/).map(part => {
        if (!part.trim()) {
          // espace : élément invisible de la bonne largeur
          return `<span style="display:inline-block;width:.28em;"> </span>`
        }
        // mot : wrapper + chars animables (pas de white-space:nowrap → évite
        // le débordement hors écran sur les grands titres centrés)
        const chars = part.split('').map(c =>
          `<span class="st-ch" style="display:inline-block;will-change:transform,opacity;transform:translateY(115%) rotateX(-18deg);opacity:0">${c}</span>`
        ).join('')
        return `<span class="st-word-wrap" style="display:inline-block;">${chars}</span>`
      }).join('')
      return el.querySelectorAll('.st-ch')
    }

    const splitToWords = el => {
      const raw = el.innerHTML
      const words = raw.split(/(\s+)/)
      el.innerHTML = words.map(w =>
        w.trim() === ''
          ? w
          : `<span class="st-wr" style="overflow:hidden;display:inline-block;vertical-align:bottom"><span class="st-wi" style="display:inline-block;will-change:transform,opacity;transform:translateY(110%);opacity:0">${w}</span></span>`
      ).join('')
      return el.querySelectorAll('.st-wi')
    }

    const reveal = (chars, delay = 0, staggerMs = 22) => {
      chars.forEach((ch, i) => {
        setTimeout(() => {
          if (killed) return
          ch.style.transition = `transform .85s cubic-bezier(.22,1,.36,1) ${i * staggerMs}ms,
                                  opacity   .7s  ease          ${i * staggerMs}ms`
          ch.style.transform  = 'translateY(0) rotateX(0)'
          ch.style.opacity    = '1'
        }, delay)
      })
    }

    const revealWords = (words, delay = 0, staggerMs = 45) => {
      words.forEach((w, i) => {
        setTimeout(() => {
          if (killed) return
          w.style.transition = `transform .9s cubic-bezier(.22,1,.36,1) ${i * staggerMs}ms,
                                 opacity   .75s ease          ${i * staggerMs}ms`
          w.style.transform  = 'translateY(0)'
          w.style.opacity    = '1'
        }, delay)
      })
    }

    const onEnter = (el, cb) => {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { cb(); io.disconnect() }
      }, { threshold: 0.15 })
      io.observe(el)
    }

    const init = () => {
      if (killed) return

      /* ══ H1 .hv4-name-line — chaque lettre du nom surgit ══ */
      document.querySelectorAll('.hv4-name-line').forEach((el, li) => {
        if (el._stDone) return
        el._stDone = true
        const chars = splitToChars(el)
        setTimeout(() => { if (!killed) reveal(chars, li * 130, 20) }, 2800)
      })

      /* ══ H2 globaux — titres de section ══ */
      document.querySelectorAll(
        '.sec-title, .gl-title, .skew-heading, .contact-title, ' +
        '.tl-title-big, .gallery-title, .test-title, .footer-tagline'
      ).forEach(el => {
        if (el._stDone) return
        el._stDone = true
        const chars = splitToChars(el)
        onEnter(el, () => reveal(chars, 60, 18))
      })

      /* ══ H2 About ══ */
      document.querySelectorAll('.about-block h2').forEach(el => {
        if (el._stDone) return
        el._stDone = true
        const chars = splitToChars(el)
        onEnter(el, () => reveal(chars, 80, 22))
      })

      /* ══ .about-role ══ */
      document.querySelectorAll('.about-role').forEach(el => {
        if (el._stDone) return
        el._stDone = true
        const words = splitToWords(el)
        onEnter(el, () => revealWords(words, 50, 40))
      })

      /* ══ P — textes corps ══ */
      document.querySelectorAll(
        '.ss-body, .sc-panel p, .about-text, .hv4-desc'
      ).forEach(el => {
        if (el._stDone) return
        // Skip paragraphs that contain any element children (a, strong, span with style…)
        // splitToWords splits on innerHTML spaces which breaks HTML attribute values like
        // href="..." or style="color: var(--accent);" → visible raw text bug
        if (el.children.length > 0) return
        el._stDone = true
        const words = splitToWords(el)
        onEnter(el, () => revealWords(words, 120, 30))
      })

      /* ══ .hv4-typed ══ */
      document.querySelectorAll('.hv4-typed').forEach(el => {
        if (el._stDone) return
        el._stDone = true
        setTimeout(() => {
          if (!killed) {
            el.style.opacity   = '1'
            el.style.transform = 'translateY(0)'
            el.style.transition = 'opacity .8s ease, transform .9s cubic-bezier(.22,1,.36,1)'
          }
        }, 3100)
      })
    }

    /* Double rAF + délai — même pattern que useScrollAnimations */
    let rafId
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        setTimeout(init, 150)
      })
    })

    return () => {
      killed = true
      cancelAnimationFrame(rafId)
    }
  }, [])
}

/* ════════════════════════════════════════════
   GSAP MAGNETIC BUTTON HOOK
   ════════════════════════════════════════════ */
function useMagneticButtons() {
  useEffect(() => {
    // Délai court pour laisser tous les enfants React se monter en prod
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.btn-fill, .btn-ghost, .mag-btn')
      const cleanups = []
      els.forEach(el => {
        const onMove = e => {
          const rect = el.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          gsap.to(el, { x: x * 0.28, y: y * 0.28, duration: 0.35, ease: 'power3.out' })
        }
        const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' })
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)
        cleanups.push(() => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) })
      })
      // Stocker les cleanups dans le ref pour le retour
      timerRef._cleanups = cleanups
    }, 300)
    const timerRef = { _cleanups: [] }
    return () => {
      clearTimeout(timer)
      timerRef._cleanups.forEach(fn => fn())
    }
  }, [])
}

/* ════════════════════════════════════════════
   GSAP SCROLL ANIMATIONS HOOK
   ════════════════════════════════════════════ */
function useScrollAnimations() {
  useEffect(() => {
    // ─── FIX PROD ────────────────────────────────────────────────────────────
    // En prod (bundle Vite), React monte App et déclenche useEffect AVANT que
    // Hero/About/Timeline etc. aient peuplé le DOM → gsap.utils.toArray retourne [].
    // Fix : double rAF + délai 100ms + retry automatique si aucun élément trouvé.
    // ─────────────────────────────────────────────────────────────────────────
    let killed = false

    const initAnimations = () => {
      if (killed) return
      const hasElements = document.querySelector(
        '.gs-reveal, .gs-stagger, .gs-skill, .gs-title, .gs-card, .gs-timeline-item, .gs-counter, .gs-line'
      )
      if (!hasElements) {
        setTimeout(() => { if (!killed) initAnimations() }, 500)
        return
      }
      /* Fade + slide up for generic reveal elements */
      gsap.utils.toArray('.gs-reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 48, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        }
      )
    })
    /* Stagger children groups */
    gsap.utils.toArray('.gs-stagger').forEach(parent => {
      gsap.fromTo(parent.children,
        { opacity: 0, y: 32, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.72, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: parent, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
      )
    })
    /* Skill icons — bounce in */
    gsap.utils.toArray('.gs-skill').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 20, scale: 0.8, rotation: -8 },
        {
          opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.55,
          ease: 'back.out(1.8)', delay: i * 0.04,
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' }
        }
      )
    })
    /* Section titles — clip-path wipe */
    gsap.utils.toArray('.gs-title').forEach(el => {
      gsap.fromTo(el,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
      )
    })
    /* Pricing cards — cascade */
    gsap.utils.toArray('.gs-card').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60, rotateX: 12 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 0.78, ease: 'power3.out', delay: i * 0.12,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        }
      )
    })
    /* Timeline items — slide from left/right alternately */
    gsap.utils.toArray('.gs-timeline-item').forEach((el, i) => {
      const fromLeft = i % 2 === 0
      gsap.fromTo(el,
        { opacity: 0, x: fromLeft ? -60 : 60, scale: 0.95 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        }
      )
    })
    /* Stats counter animation */
    document.querySelectorAll('.gs-counter').forEach(el => {
      const target = parseFloat(el.dataset.target)
      const suffix = el.dataset.suffix || ''
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target, duration: 1.8, ease: 'power2.out',
        onUpdate: () => { el.textContent = (Number.isInteger(target) ? Math.round(obj.val) : obj.val.toFixed(1)) + suffix },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      })
    })
    /* Horizontal line drawing */
    gsap.utils.toArray('.gs-line').forEach(el => {
      gsap.fromTo(el,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
      )
    })
      ScrollTrigger.refresh()
    }

    let rafId
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        setTimeout(initAnimations, 100)
      })
    })

    return () => {
      killed = true
      cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])
}

/* ════════════════════════════════════════════
   DONNÉES
   ════════════════════════════════════════════ */
const PROJECTS = [
  { id: 1, title: 'ShopCI', sub: 'Marketplace E-commerce', cat: 'en-ligne', img: '/assets/images/projects/monmarket-preview.jpg', images: ['/assets/images/projects/monmarket-preview.jpg','/assets/images/projects/monmarket-preview2.jpg','/assets/images/projects/monmarket-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600', tech: ['React', 'Django', 'Bootstrap 5', 'Vercel + PythonAnywhere'], url: 'https://shop-ci.vercel.app/', desc: "Marketplace multi-vendeurs conçue pour répondre aux problèmes de fiabilité, de visibilité et de gestion des ventes dans le e-commerce local ivoirien.", year: '2024' },
  { id: 2, title: 'TechFlow', sub: 'Site Vitrine Professionnel', cat: 'en-ligne', img: '/assets/images/projects/techflow-preview.jpg', images: ['/assets/images/projects/techflow-preview.jpg','/assets/images/projects/techflow-preview2.jpg','/assets/images/projects/techflow-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600', tech: ['HTML / Tailwind CSS', 'JavaScript', 'Vercel'], url: 'https://techflow-ten.vercel.app/', desc: 'Site vitrine moderne destiné à présenter une activité technologique de manière claire et professionnelle.', year: '2024' },
  { id: 3, title: 'TerraSafe', sub: 'Marketplace Foncière', cat: 'en-ligne', img: '/assets/images/projects/terrasafe-preview.jpg', images: ['/assets/images/projects/terrasafe-preview.jpg','/assets/images/projects/terrasafe-preview2.jpg','/assets/images/projects/terrasafe-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600', tech: ['Python/Flask', 'MySQL', 'JavaScript', 'Bootstrap 5'], url: 'https://wthomassss06.pythonanywhere.com', desc: "Plateforme foncière visant à réduire les risques d'arnaques liées à la vente de terrains. Backend sécurisé avec recherche avancée.", year: '2024' },
  { id: 4, title: 'Chap-chapMAP', sub: 'Navigation Intelligente', cat: 'demo', img: '/assets/images/projects/chapchapmap-preview.jpg', imgFb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600', tech: ['JavaScript', 'Leaflet.js', 'OSRM API', 'Geolocation API'], url: '/demos/chap-chapMAP.html', desc: "Application de cartographie intelligente permettant de localiser un utilisateur en temps réel et de calculer des itinéraires optimisés.", year: '2023' },
  { id: 5, title: 'ElvisMarket', sub: 'Interface E-commerce', cat: 'demo', img: '/assets/images/projects/elvismarket-preview.jpg', imgFb: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600', tech: ['HTML + JS vanilla', 'Tailwind CSS', 'LocalStorage'], url: '/demos/projet2.html', desc: "Interface e-commerce développée pour expérimenter la gestion d'état, le panier dynamique et l'optimisation de l'UX.", year: '2023' },
  { id: 6, title: 'MonCashJour', sub: 'Gestion de Ventes', cat: 'demo', img: '/assets/images/projects/moncashjour-preview.jpg', imgFb: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600', tech: ['HTML + JS vanilla', 'Tailwind CSS', 'Chart.js'], url: '/demos/projet1.html', desc: 'Application de gestion de ventes quotidiennes destinée aux petits commerçants.', year: '2023' },
  { id: 7, title: 'LivreurTrack Pro', sub: 'Suivi Logistique', cat: 'demo', img: '/assets/images/projects/livreurtrack-preview.jpg', imgFb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', tech: ['JavaScript', 'Bootstrap 5', 'LocalStorage', 'Camera API'], url: '/demos/projet3.html', desc: "Système de suivi logistique simulant un workflow réel de livraison, avec validation par photo et suivi d'étapes.", year: '2023' },
  { id: 8, title: 'LinkedIn Banner Pro', sub: 'Générateur SaaS', cat: 'en-cours', img: '/assets/images/projects/linkedin-banner-preview.jpg', imgFb: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600', tech: ['JavaScript', 'Canvas API', 'Tailwind CSS'], url: '/demos/projet7.html', desc: 'Outil SaaS en cours de développement permettant de générer des bannières LinkedIn professionnelles.', year: '2025' },
  { id: 9, title: 'Tati', sub: 'Portfolio & Vitrine Moderne', cat: 'en-ligne', img: '/assets/images/projects/tati-preview.jpg', images: ['/assets/images/projects/tati-preview.jpg','/assets/images/projects/tati-preview2.jpg','/assets/images/projects/tati-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'], url: 'https://tatii.vercel.app/', desc: 'Portfolio personnel double fonction avec animations fluides, thème sombre/clair, design 100% responsive.', year: '2024' },
  { id: 10, title: 'MK', sub: 'Portfolio Graphiste Client', cat: 'en-ligne', img: '/assets/images/projects/mk-preview.jpg', images: ['/assets/images/projects/mk-preview.jpg','/assets/images/projects/mk-preview2.jpg','/assets/images/projects/mk-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600', tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'], url: 'https://mory01ff.vercel.app/', desc: 'Portfolio professionnel sur-mesure pour un client graphiste. Galerie immersive, animations soignées.', year: '2024' },
  { id: 11, title: 'ManoBeat 777', sub: 'Portfolio Beatmaker', cat: 'en-ligne', img: '/assets/images/projects/beatstore-preview.jpg', images: ['/assets/images/projects/beatstore-preview.jpg','/assets/images/projects/beatstore-preview2.jpg','/assets/images/projects/beatstore-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', tech: ['React', 'Tailwind CSS', 'Howler.js', 'Vercel'], url: 'https://xxx-x.vercel.app/', desc: "Portfolio d'un beatmaker ivoirien : découvrez et écoutez ses créations directement en ligne.", year: '2025' },
  { id: 12, title: 'New Horizon Service', sub: 'Location de Résidences', cat: 'en-ligne', img: '/assets/images/projects/newhorizon-preview.jpg', images: ['/assets/images/projects/newhorizon-preview.jpg','/assets/images/projects/newhorizon-preview2.jpg','/assets/images/projects/newhorizon-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600', tech: ['Next.js', 'Flask', 'Python', 'MySQL', 'Vercel'], url: 'https://new-horizonservice.vercel.app/', desc: 'Plateforme de location de résidences meublées haut de gamme avec backend Flask sécurisé.', year: '2025' },
  { id: 13, title: 'AKATech', sub: 'Agence Digitale Abidjan', cat: 'en-ligne', img: '/assets/images/projects/akatech-preview.jpg', images: ['/assets/images/projects/akatech-preview.jpg','/assets/images/projects/akatech-preview2.jpg','/assets/images/projects/akatech-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600', tech: ['Next.js 15', 'Framer Motion', 'WebGL Aurora', 'Vercel'], url: 'https://akatech.vercel.app/', desc: "Site officiel de mon agence — AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire.", year: '2025' },
  { id: 14, title: 'Université les Anges', sub: 'Site Institutionnel', cat: 'en-ligne', img: '/assets/images/projects/universitelesanges-preview.jpg', images: ['/assets/images/projects/universitelesanges-preview.jpg','/assets/images/projects/universitelesanges-preview2.jpg','/assets/images/projects/universitelesanges-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600', tech: ['HTML', 'CSS', 'Bulma', 'Bootstrap', 'Vercel'], url: 'https://universitelesanges.vercel.app/', desc: "Site institutionnel moderne pour l'Université les Anges.", year: '2025' },
  { id: 15, title: 'NEXURA', sub: 'Marketplace Nouvelle Génération', cat: 'en-ligne', img: '/assets/images/projects/nexura-preview.jpg', images: ['/assets/images/projects/nexura-preview.jpg','/assets/images/projects/nexura-responsive.jpg','/assets/images/projects/nexura-responsive2.jpg'], imgFb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600', tech: ['Next.js 14', 'Django REST', 'PostgreSQL', 'WebSockets', 'Redis & Celery'], url: 'https://nexura-one.vercel.app/', desc: "Marketplace nouvelle génération — évolution de TerraSafe. Location de résidences meublées, motos & véhicules, bureaux & salles de conférence, terrains & immobilier. Auth sécurisée, KYC intégré, temps réel.", year: '2025' },
  { id: 16, title: 'KokoEat', sub: 'Livraison Alimentaire', cat: 'en-cours', img: '/assets/images/projects/kokoeat-preview.jpg', imgFb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', tech: ['React', 'Django REST', 'PostgreSQL', 'Vercel'], url: '#', desc: "Application de livraison de repas pensée pour le marché ivoirien. Commande en ligne, suivi en temps réel et paiement Mobile Money.", year: '2025' },
  { id: 17, title: 'Jean Edy · Portfolio', sub: 'Portfolio React UI Avancé', cat: 'en-ligne', img: '/assets/images/projects/jean-edy-preview.jpg', images: ['/assets/images/projects/jean-edy-preview.jpg','/assets/images/projects/jean-edy-preview2.jpg','/assets/images/projects/jean-edy-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600', tech: ['React 18', 'Vite', 'GSAP', 'Framer Motion', 'TailwindCSS'], url: 'https://jean-edy-dev.vercel.app/', desc: "Portfolio personnel de Jean Edy — Software Developer basé à Abidjan. et skeuomorphisme complet.", year: '2026' },
  { id: 18, title: 'MD Laverie Pressing', sub: 'Site Vitrine Pressing', cat: 'en-ligne', img: '/assets/images/projects/laverie-preview.jpg', images: ['/assets/images/projects/laverie-preview.jpg','/assets/images/projects/laverie-preview2.jpg','/assets/images/projects/laverie-preview3.jpg'], imgFb: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', tech: ['React 18', 'Vite', 'GSAP', 'React Router v6', 'EmailJS'], url: 'https://laverie-plus.vercel.app/', desc: "Site vitrine complet pour MD Laverie Pressing, Abidjan. Hero slider GSAP, grille packs pricing, formulaire contact EmailJS.", year: '2025' },
]

const SERVICES = [
  { n: '01', title: 'Applications Web', desc: 'Apps CRUD complètes, dashboards de gestion, solutions sur-mesure.' },
  { n: '02', title: 'API RESTful', desc: 'APIs Python/Flask documentées, sécurisées, prêtes pour la production.' },
  { n: '03', title: 'Interfaces Responsives', desc: "Design et intégration d'interfaces modernes et adaptatives." },
  { n: '04', title: 'Bases de Données', desc: 'Conception et optimisation de bases de données MySQL.' },
  { n: '05', title: 'Sécurité Applicative', desc: 'Bonnes pratiques de sécurité intégrées dès la conception.' },
  { n: '06', title: 'Support Technique', desc: 'Maintenance informatique et assistance technique utilisateur.' },
]

const PRICING_TABS = [
  {
    key: 'portfolio', label: 'Portfolio', icon: 'Star',
    plans: [
      {
        badge: 'STARTER', price: '70 000 FCFA', title: 'Starter', delivery: '3 à 5 jours',
        features: [
          '3 pages', 'Design responsive', 'Section projets', 'Formulaire contact',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="h"><AnimIcon type="monitor" size={13} /> Hébergement inclus (1 an)</span>,
        ]
      },
      {
        badge: 'STANDARD', price: '120 000 FCFA', title: 'Standard', delivery: '5 à 7 jours', isPopular: true,
        features: [
          '5 pages', 'Animations modernes', 'Projets détaillés', 'SEO de base',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="h"><AnimIcon type="monitor" size={13} /> Hébergement inclus (1 an)</span>,
        ]
      },
      {
        badge: 'PREMIUM', price: '180 000 FCFA', title: 'Premium', delivery: '7 à 10 jours',
        features: [
          'Design personnalisé', 'Animations avancées', 'Blog intégré', 'Optimisation performance',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="h"><AnimIcon type="monitor" size={13} /> Hébergement inclus (1 an)</span>,
          <span key="s"><AnimIcon type="tool" size={13} /> 1 mois support</span>,
        ]
      },
    ],
  },
  {
    key: 'vitrine', label: 'Site Vitrine', icon: 'Globe',
    plans: [
      {
        badge: 'STARTER', price: '150 000 FCFA', title: 'Starter', delivery: '5 jours',
        features: [
          '5 pages', 'Design responsive', 'Formulaire contact', 'SEO de base',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="h" style={{ color: 'rgba(255,85,0,.5)' }}><AnimIcon type="x" size={13} color="#FF5500" /> Hébergement non inclus</span>,
          <span key="s"><AnimIcon type="tool" size={13} /> 1 mois support</span>,
        ]
      },
      {
        badge: 'PRO', price: '270 000 FCFA', title: 'Pro', delivery: '7 à 10 jours', isPopular: true,
        features: [
          '10 pages', 'Design premium', 'Blog intégré', 'SEO avancé',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="h"><AnimIcon type="monitor" size={13} /> Hébergement inclus (1 an)</span>,
          <span key="s"><AnimIcon type="tool" size={13} /> 3 mois support</span>,
          <span key="g"><AnimIcon type="grad" size={13} /> Formation 2h</span>,
        ]
      },
      {
        badge: 'ELITE', price: '450 000 FCFA', title: 'Elite', delivery: '10 à 14 jours',
        features: [
          '15 à 20 pages', 'Design sur mesure', 'CMS complet', 'SEO + Analytics',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="h"><AnimIcon type="monitor" size={13} /> Hébergement inclus (1 an)</span>,
          <span key="s"><AnimIcon type="tool" size={13} /> 6 mois support</span>,
          <span key="g"><AnimIcon type="grad" size={13} /> Formation complète</span>,
          <span key="p"><AnimIcon type="plus" size={13} /> Page supp. : 20 000 FCFA</span>,
        ]
      },
    ],
  },
  {
    key: 'ecommerce', label: 'E-commerce', icon: 'ShoppingCart',
    plans: [
      {
        badge: 'STARTER', price: '400 000 FCFA', title: 'Starter', delivery: '14 jours',
        features: [
          "Jusqu'à 50 produits", 'Paiement Mobile Money', 'Gestion commandes', 'Tableau de bord',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="h"><AnimIcon type="monitor" size={13} /> Hébergement inclus (1 an)</span>,
          <span key="s"><AnimIcon type="tool" size={13} /> 1 mois support</span>,
        ]
      },
      {
        badge: 'PRO', price: '650 000 FCFA', title: 'Pro', delivery: '21 jours', isPopular: true,
        features: [
          '200 à 500 produits', 'Multi-paiement', 'Gestion stock temps réel', 'Analytics',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="h"><AnimIcon type="monitor" size={13} /> Hébergement inclus (1 an)</span>,
          <span key="s"><AnimIcon type="tool" size={13} /> 3 mois support</span>,
          <span key="g"><AnimIcon type="grad" size={13} /> Formation admin</span>,
        ]
      },
      {
        badge: 'ELITE', price: '1 000 000 FCFA', title: 'Elite', delivery: '30 jours',
        features: [
          'Produits illimités', 'API paiement personnalisée', 'Automatisations (emails, factures)', 'Rapports avancés',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="h"><AnimIcon type="monitor" size={13} /> Hébergement inclus (1 an)</span>,
          <span key="s"><AnimIcon type="tool" size={13} /> 6 mois support</span>,
          <span key="g"><AnimIcon type="grad" size={13} /> Formation équipe</span>,
        ]
      },
    ],
  },
  {
    key: 'saas', label: 'App SaaS', icon: 'Cpu',
    plans: [
      {
        badge: 'MVP', price: '700 000 FCFA', title: 'MVP', delivery: '3 à 4 semaines',
        features: [
          'Authentification + rôles', 'Dashboard basique', 'API REST', 'Déploiement cloud',
          <span key="d"><AnimIcon type="globe" size={13} /> Nom de domaine offert (1 an)</span>,
          <span key="s"><AnimIcon type="tool" size={13} /> 1 mois support</span>,
          <span key="w"><AnimIcon type="warn" size={13} color="#ffaa44" /> Hébergement inclus 1–3 mois</span>,
        ]
      },
      {
        badge: 'SCALE', price: 'Sur devis', title: 'Scale', delivery: '4 à 6 semaines', isPopular: true,
        features: [
          'Multi-tenant', 'Analytics temps réel', 'Intégrations (paiement, email…)', 'Support prioritaire',
          <span key="p">1 200 000 – 2 000 000 FCFA</span>,
        ]
      },
      {
        badge: 'ENTERPRISE', price: 'À partir de 2 500 000 FCFA', title: 'Enterprise', delivery: '6 à 10 semaines',
        features: [
          'Architecture microservices', 'Sécurité renforcée', 'SLA 99.9%', 'Formation équipe',
        ]
      },
    ],
  },
]

const SKILLS = {
  frontend: [
    { name: 'React',      icon: '/assets/icons/devicon/react/react-original.svg',           color: '#61DAFB' },
    { name: 'JavaScript', icon: '/assets/icons/devicon/javascript/javascript-original.svg', color: '#F7DF1E' },
    { name: 'Next.js',    icon: '/assets/icons/devicon/nextjs/nextjs-original.svg',         color: '#ffffff' },
    { name: 'Tailwind',   icon: '/assets/icons/devicon/tailwindcss/tailwindcss-original.svg', color: '#38BDF8' },
    { name: 'HTML5',      icon: '/assets/icons/devicon/html5/html5-original.svg',           color: '#E34F26' },
    { name: 'CSS3',       icon: '/assets/icons/devicon/css3/css3-original.svg',             color: '#1572B6' },
    { name: 'Bootstrap',  icon: '/assets/icons/devicon/bootstrap/bootstrap-original.svg',   color: '#7952B3' },
  ],
  backend: [
    { name: 'Python',  icon: '/assets/icons/devicon/python/python-original.svg', color: '#4B8BBE' },
    { name: 'Flask',   icon: '/assets/icons/devicon/flask/flask-original.svg',   color: '#AAAAAA' },
    { name: 'Django',  icon: '/assets/icons/devicon/django/django-plain.svg',    color: '#44B78B' },
    { name: 'Node.js', icon: '/assets/icons/devicon/nodejs/nodejs-original.svg', color: '#539E43' },
    { name: 'MySQL',   icon: '/assets/icons/devicon/mysql/mysql-original.svg',   color: '#F29111' },
  ],
  tools: [
    { name: 'Git',    icon: '/assets/icons/devicon/git/git-original.svg',    color: '#F05032' },
    { name: 'VS Code',icon: '/assets/icons/devicon/vscode/vscode-original.svg', color: '#007ACC' },
    { name: 'GitHub', icon: '/assets/icons/devicon/github/github-original.svg', color: '#ffffff' },
    { name: 'Vercel', icon: '/assets/icons/devicon/vercel/vercel-original.svg',  color: '#ffffff' },
    { name: 'Prisma', icon: '/assets/icons/devicon/prisma/prisma-original.svg',  color: '#2D3748' },
  ],
}

const TIMELINE = [
  { date: '2025–2026', title: 'Développeur Freelance Fullstack', company: 'AKATech', items: ["Conception et déploiement de +10 Projets web (SaaS, e-commerce, plateformes)", "Développement d'API REST avec Django et Flask", "Mise en place de dashboards et systèmes de gestion de données"], tags: ['Freelance', 'Full-Stack', 'Django', 'React', 'SaaS'] },
  { date: 'Mai–Nov. 2025', title: 'Informaticien Stagiaire', company: "Mairie d'Agboville", items: ['Maintenance du parc informatique et du réseau', 'Support technique aux utilisateurs', 'Contribution à la gestion et numérisation des données'], tags: ['Maintenance', 'Réseau', 'Support'] },
  { date: '2023–2024', title: 'Projet Académique – ARTICI', company: 'UVCI', items: ["Plateforme web de promotion de l'artisanat local", "Travail collaboratif en équipe pluridisciplinaire", "Intégration de bonnes pratiques de sécurité"], tags: ['Frontend', 'Backend', 'Sécurité'] },
  { date: '2023–2024', title: 'Licence Réseau et Sécurité Informatique', company: 'UVCI', items: ['Formation complète en développement web, bases de données et sécurité', 'Certification E-Banking — Réf: CC/24-002485'], tags: ['Diplôme', 'Certification'] },
  { date: '2020–2021', title: 'Baccalauréat Série D', company: "Lycée Moderne d'Arrah", items: ['Mention : Assez Bien'], tags: ['Diplôme'] },
]

const ABOUT_IMAGES = [
  '/assets/images/IMG_20250124_124101KK.jpg',
  '/assets/images/moi/93027469_127097918918167_9124333187680436224_n.jpg',
  '/assets/images/moi/CamScanner 24-02-2026 14.43.jpg',
  '/assets/images/moi/CamScanner 24-02-2026 17.16 (1) (1).jpg',
  '/assets/images/moi/ChatGPT Image 26 avr. 2026, 00_44_06.jpg',
  '/assets/images/moi/ChatGPT Image 26 avr. 2026, 00_47_11.png',
  '/assets/images/moi/ChatGPT Image 26 avr. 2026, 00_49_13.png',
  '/assets/images/moi/ChatGPT Image 26 avr. 2026, 00_52_59.png',
  '/assets/images/moi/FB_IMG_17092288705757644.jpg',
  '/assets/images/moi/IMG-20260203-WA0012.jpg',
  '/assets/images/moi/IMG-20260203-WA0014.jpg',
  '/assets/images/moi/IMG-20260222-WA0020.jpg',
  '/assets/images/moi/IMG-20260222-WA0091.jpg',
  '/assets/images/moi/IMG-20260222-WA0096.jpg',
  '/assets/images/moi/IMG-20260222-WA0109.jpg',
  '/assets/images/moi/IMG_20200414_130507_968.jpg',
  '/assets/images/moi/IMG_20200426_182719033.png',
  '/assets/images/moi/IMG_20211205_173445935 (2).jpg',
  '/assets/images/moi/IMG_20240331_135514.jpg',
  '/assets/images/moi/IMG_20240404_145052.jpg',
  '/assets/images/moi/IMG_20250604_220919.png',
  '/assets/images/moi/IMG_20250608_174833.jpg',
  '/assets/images/moi/Snapchat-1841890434.jpg',
  '/assets/images/moi/Snapchat-304169344-COLLAGE.jpg',
]

const ABOUT_ITEMS = ABOUT_IMAGES.map(img => ({ image: img, link: '#', title: '', description: '' }))

const TESTIMONIALS = [
  { name: 'Koné Ibrahima', role: 'Fondateur · TechFlow', avatar: 'K', proj: 'Site Vitrine', text: "Elvis a livré notre site vitrine en un temps record. Design moderne, responsive, exactement ce qu'on voulait. Très professionnel." },
  { name: 'Calvin Dexter', role: 'Gérant · New Horizon Service', avatar: 'C', proj: 'Location Résidences', text: 'La plateforme de location est impeccable. Les clients peuvent réserver facilement, le backend est solide. Je recommande à 100%.' },
  { name: 'Mory Koné', role: 'Graphiste · MK Portfolio', avatar: 'M', proj: 'Portfolio Créatif', text: "Mon portfolio reflète parfaitement mon univers créatif. Elvis a su traduire ma vision en une expérience visuelle mémorable." },
  { name: 'Tatiana D.', role: 'Influenceuse · Tatii', avatar: 'T', proj: 'Portfolio', text: "Super boulot ! Mon site de présentation est élégant, rapide et je reçois beaucoup de compliments. Merci Elvis !" },
  { name: 'Manobeat 777', role: 'Beatmaker · ManoBeat', avatar: 'B', proj: 'Beat Store', text: "La boutique de beats marche très bien. Les clients achètent facilement via WhatsApp. Interface propre et professionnelle." },
]

function Loader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const loaderRef = useRef(null)

  /* ── Loader entrance animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* percent counter drops in */
      gsap.fromTo('.ld-percent', { y: -32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 })
      /* name + role stagger up */
      gsap.fromTo(
        ['.ld-name', '.ld-role'],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12, delay: 0.28 }
      )
      /* progress bar container */
      gsap.fromTo('.ld-progress-wrap', { scaleX: 0, opacity: 0, transformOrigin: 'left center' }, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.5 })
      /* corner tag drifts up from bottom */
      gsap.fromTo('.ld-corner', { y: 14, opacity: 0 }, { y: 0, opacity: 0.35, duration: 0.7, ease: 'power2.out', delay: 0.55 })
      /* scanline flicker */
      gsap.fromTo('.ld-scanline', { opacity: 0 }, { opacity: 0.08, duration: 1.2, ease: 'steps(4)', delay: 0.2 })
    }, loaderRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 12

        if (next >= 100) {
          clearInterval(interval)

          /* Transition staircase (GooeyTransition) : couvre l'écran,
             au midpoint on masque le loader, puis les colonnes remontent */
          setTimeout(() => {
            const loaderEl = loaderRef.current
            if (loaderEl) {
              const main = document.querySelector('main')

              runGridTransition(() => {
                /* midpoint — loader et main swappent sous les colonnes */
                if (loaderEl) {
                  loaderEl.style.visibility  = 'hidden'
                  loaderEl.style.pointerEvents = 'none'
                }
                if (main) {
                  gsap.set(main, { y: '6vh', opacity: 0 })
                  gsap.to(main, { y: '0%', opacity: 1, duration: 0.7, ease: 'power3.out' })
                }
                onDone()
              })
            } else {
              onDone()
            }
          }, 300)

          return 100
        }

        return next
      })
    }, 120)

    return () => clearInterval(interval)
  }, [onDone])

  /* =========================
     DECRYPT EFFECT
  ========================= */

  useEffect(() => {

    const letters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

    let iteration = 0

    const el = document.querySelector(".decrypt-text")

    if (!el) return

    const original = "MBOLLO AKA ELVIS"

    const interval = setInterval(() => {

      el.innerText = original
        .split("")
        .map((letter, index) => {

          if (index < iteration) {
            return original[index]
          }

          return letters[
            Math.floor(Math.random() * letters.length)
          ]
        })
        .join("")

      if (iteration >= original.length) {
        clearInterval(interval)
      }

      iteration += 1 / 2

    }, 40)

    return () => clearInterval(interval)

  }, [])

  return (
    <div id="loader" ref={loaderRef}>

      {/* BACKGROUND FX */}
      <div className="ld-noise" />
      <div className="ld-grid" />
      <div className="ld-vignette" />
      <div className="ld-scanline" />

      {/* CENTER */}
      <div className="ld-center">

        {/* COUNTER */}
        <div className="ld-percent">
          {Math.floor(progress)}
          <span>%</span>
        </div>

        {/* NAME */}
        <div className="ld-name">
          <div className="decrypt-text">
            MBOLLO AKA ELVIS
          </div>
        </div>

        {/* ROLE */}
        <div className="ld-role">
          FULL-STACK DEVELOPER · UI/UX · PRODUCT BUILDER
        </div>

        {/* PROGRESS BAR */}
        <div className="ld-progress-wrap">
          <div
            className="ld-progress"
            style={{
              width: `${progress}%`
            }}
          />
        </div>

      </div>

      {/* CORNER */}
      <div className="ld-corner">
        AKATech Experience System v2.6
      </div>

    </div>
  )
}

/* ════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════ */
function Navbar({ theme, onToggleTheme }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [clock, setClock] = useState({ date: '', time: '' })

  const navLinks = [
    { id: 'hero', label: 'Accueil' },
    { id: 'about-section', label: 'À propos' },
    { id: 'timeline-section', label: 'Parcours' },
    { id: 'skills-section', label: 'Skills' },
    { id: 'showcase-section', label: 'Services' },
    { id: 'gallery-section', label: 'Projets' },
    { id: 'ou-me-joindre', label: 'Contact' },
  ]

  /* Horloge */
  useEffect(() => {
    const pad = n => String(n).padStart(2, '0')
    const MONTHS = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DEC']
    const tick = () => {
      const d = new Date()
      setClock({ date: `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` })
    }
    tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv)
  }, [])

  /* Section active */
  useEffect(() => {
    const onScroll = () => {
      let id = 'hero'
      document.querySelectorAll('section[id]').forEach(s => {
        if (window.scrollY >= s.getBoundingClientRect().top + window.scrollY - 160) id = s.id
      })
      setActiveSection(id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Navbar transparent → solid au scroll */
  useEffect(() => {
    const topbar = document.querySelector('.nb-topbar')
    const onScroll = () => {
      if (!topbar) return
      topbar.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // état initial
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* scrollTo simple pour usage interne (logo click, etc.) */
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  /* goTo : même scroll mais avec transition gooey barba-style */
  const goTo = useGooeyTransition()

  /* ── Animated theme toggler (mirrors animate-ui ThemeTogglerButton) ── */
  const AnimatedThemeToggler = ({ theme: t, onClick }) => (
    <button
      className="nb-theme-btn att-btn"
      onClick={onClick}
      title="Basculer thème"
      aria-label={t === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
    >
      <span className="att-track" data-theme={t}>
        {/* Sun */}
        <span className="att-icon att-sun">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
          </svg>
        </span>
        {/* Moon */}
        <span className="att-icon att-moon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
            <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z"/>
          </svg>
        </span>
      </span>
    </button>
  )

  return (
    <>
      <TargetCursor targetSelector=".btn-fill, .btn-ghost, .mag-btn, a, button, .cursor-target, .nb-nav-link" />
      {/* TOPBAR */}
      <header className="nb-topbar">
        <div className="nb-topbar-left" onClick={() => scrollTo('hero')}>
          <img src="/assets/images/logo-akatech.png" alt="AKATech" className="nb-logo-img"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline' }}
          />
          <span className="nb-logo-text" style={{ display: 'none' }}>AKA<span className="nb-logo-acc">TECH</span></span>
        </div>
        <div className="nb-topbar-center">
          <span>{clock.date}</span><span className="nb-sep">·</span><span>{clock.time}</span>
        </div>
        <div className="nb-topbar-right">
          <span className="nb-avail"><span className="nb-avail-dot" />disponible · Abidjan, CI</span>
          <AnimatedThemeToggler theme={theme} onClick={onToggleTheme} />
          <button className={`nb-hamburger${drawerOpen ? ' open' : ''}`} aria-label="Menu" aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(v => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* BOTTOM NAV */}
      <nav className="nb-bottombar">
        <div className="nb-bottombar-inner">
          {navLinks.map(l => (
            <button key={l.id} type="button"
              className={`nb-nav-link${activeSection === l.id ? ' active' : ''}`}
              onClick={() => goTo(l.id)}>{l.label}
            </button>
          ))}
        </div>
      </nav>

      {/* OVERLAY */}
      <div className={`nb-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />

      {/* DRAWER */}
      <div className={`nb-drawer${drawerOpen ? ' open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="nb-drawer-header">
          <span className="nb-drawer-logo">
            <img src="/assets/images/logo-akatech.png" alt="AKATech" className="nb-drawer-logo-img"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline' }}
            />
            <span style={{ display: 'none' }}>AKA<span style={{ color: '#FF5500' }}>TECH</span></span>
          </span>
          <button className="nb-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Fermer">✕</button>
        </div>
        <nav className="nb-drawer-nav">
          {navLinks.map((l, i) => (
            <button key={l.id} className={`nb-drawer-link${drawerOpen ? ' in' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => { setDrawerOpen(false); setTimeout(() => goTo(l.id), 180) }}>
              <span className="nb-drawer-num">0{i + 1}</span><span>{l.label}</span>
            </button>
          ))}
        </nav>
        <div className="nb-drawer-theme">
          <span className="nb-drawer-theme-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" /></svg>
            Thème
          </span>
          <AnimatedThemeToggler theme={theme} onClick={onToggleTheme} />
        </div>
        <div className="nb-drawer-footer">
          {[
            { href: 'https://github.com/wthomasss06-stack', title: 'GitHub', d: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg> },
            { href: 'https://www.linkedin.com/in/m-bollo-aka-60a1b1340/', title: 'LinkedIn', d: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7H10V9h4v2a6 6 0 0 1 6-3z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
            { href: 'mailto:wthomasss06@gmail.com', title: 'Email', d: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="15" rx="3" /><path d="M2 8l10 7 10-7" /></svg> },
            { href: 'https://akatech.vercel.app/', title: 'AKATech', d: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9.5" /><ellipse cx="12" cy="12" rx="4.5" ry="9.5" /><line x1="2.5" y1="12" x2="21.5" y2="12" opacity=".5" /></svg> },
          ].map(({ href, title, d }) => (
            <a key={title} href={href} target="_blank" rel="noreferrer" title={title}>{d}</a>
          ))}
        </div>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════
   HERO — Plasma WebGL + ScrambleText
   ════════════════════════════════════════════ */
function Hero() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero">
      <div className="hv4-grain" aria-hidden="true" />
      <div className="hv4-god-rays" id="hv4-rays" aria-hidden="true" />
      <div className="hv4-bg-layer" id="hv4-bg-layer" aria-hidden="true">
        <Iridescence color={[1.0, 0.333, 0.0]} speed={1.0} amplitude={0.12} />
      </div>
      <div className="hv4-scan" aria-hidden="true" />
      <div className="hero-vignette" />

      <div className="hv4-scene-wrap" id="hv4-scene">
        <div className="hv4-grid">

          {/* LEFT */}
          <div className="hv4-left hv4-rv" style={{ '--d': '0s' }} id="hv4-left">
            {/* Nom ScrambleText */}
            <h1 className="hv4-name" aria-label="M'Bollo Aka Elvis">
              <ScrambleText
                text="M'BOLLO"
                tag="span"
                className="hv4-name-line"
                style={{ '--d': '.1s' }}
                speed={28}
                step={0.35}
                threshold={0.2}
                once={false}
              />
              <ScrambleText
                text="AKA ELVIS"
                tag="span"
                className="hv4-name-line hv4-name-line--u"
                style={{ '--d': '.2s' }}
                speed={28}
                step={0.35}
                threshold={0.2}
                once={false}
              />
            </h1>

            {/* Photo mobile */}
            <div className="hv4-photo-mob hv4-rv" style={{ '--d': '.3s' }}>
              <div className="hv4-photo-mob-inner">
                <img src="/assets/images/IMG_20250124_124101KK.jpg" alt="M'Bollo Aka Elvis" className="hv4-photo"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' }} />
                <div className="hv4-photo-mob-badge"><span className="hero-dot" /><span>disponible</span></div>
              </div>
            </div>

            {/* Rotating Text */}
            <p className="hv4-typed hv4-rv" style={{ '--d': '.42s' }}>
              Développeur&nbsp;<RotatingText texts={['Full-Stack', 'React & Python', 'Django & Flask', 'orienté produit', 'Data & Carto']} rotationInterval={2500} className="hero-word" style={{ color: '#ffffff' }} />
            </p>

            <p className="hv4-desc hv4-rv" style={{ '--d': '.56s' }}>
              Développeur web orienté produit — Django &amp; React. Je construis des applications pensées pour des usages réels. Basé à <strong style={{ color: 'var(--accent)' }}>Abidjan</strong>.
            </p>

            {/* CTAs */}
            <div className="hv4-ctas hv4-rv" style={{ '--d': '.7s' }}>
              <button className="btn-fill" onClick={() => scrollTo('gallery-section')}>
                Voir mes projets ↗
              </button>
              <a href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" download className="btn-fill" style={{ gap: '.5rem', display: 'inline-flex', alignItems: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                TÉLÉCHARGER CV
              </a>
            </div>

          </div>

          {/* RIGHT — Lanyard 3D desktop */}
          <div className="hv4-right hv4-rv" style={{ '--d': '.32s' }} id="hv4-right">
            <Lanyard
              position={[0, 0, 30]}
              gravity={[0, -40, 0]}
              fov={7}
              transparent={true}
              lanyardWidth={1}
              frontImage="/assets/images/IMG_20250124_124101KK.jpg"
            />
          </div>

        </div>
      </div>
      <div className="hero-scroll"><span>scroll</span><div className="hsl" /></div>
    </section>
  )
}

/* ════════════════════════════════════════════
   STICKY STACK
   ════════════════════════════════════════════ */
function StickyStack() {
  const STATS = [
    { target: 18,  suffix: '',  label: 'Projets',    delay: 0   },
    { target: 3,   suffix: '+', label: 'Années',     delay: 120 },
    { target: 12,  suffix: '',  label: 'En prod.',   delay: 240 },
    { target: 33,  suffix: '',  label: 'Outils',     delay: 360 },
  ]

  const slides = [
    {
      num: '00 — Chiffres',
      title: 'STATS',
      body: null, // rendu spécial — stats avec compteurs
      cls: 'ss-dark ss-00',
      isStats: true,
    },

    {
      num: '01 — UI / UX',
      title: 'INTERFACES\n& ÉMOTIONS',
      body:
        "J’aime créer des interfaces qui bougent, respirent et donnent une vraie sensation d’expérience. Beaucoup de mes inspirations viennent du motion design, des sites immersifs et des expériences web modernes.",
      cls: 'ss-light ss-01',
    },

    {
      num: '02 — Produit & Solutions',
      title: 'PRODUITS\nUTILes',
      body:
        "Je développe des solutions web pensées pour résoudre de vrais problèmes : plateformes, dashboards, outils métier, systèmes de gestion ou expériences SaaS orientées usages réels.",
      cls: 'ss-light ss-02',
    },

    {
      num: '03 — Sécurité d’abord',
      title: 'SÉCURITÉ\nD’ABORD',
      body:
        "Ancien étudiant en réseau et sécurité informatique, j’ai gardé une vraie logique de protection et de structure dans ma manière de développer : authentification, permissions, validation et architecture propre.",
      cls: 'ss-dark2',
    },

    {
      num: '04 — Autodidacte',
      title: 'CURIEUX\n& AUTODIDACTE ',
      body:
        "Je suis en grande partie autodidacte. J’apprends vite, j’expérimente beaucoup et je progresse projet après projet. AKATech est devenu mon terrain d’expression pour transformer mes idées en expériences web concrètes.",
      cls: 'ss-dark3',
    },
  ]

  return (
    <div className="stack-wrap">
      {slides.map((s, i) => (
        <section key={i} className={`stack-sec ${s.cls}`}>
          <div className={s.cls.includes('ss-light') ? 'bg-dots-acc' : 'bg-dots'} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="ss-num">{s.num}</div>

            <h2 className="ss-title">
              {s.title.split('\n').map((line, j) => (
                <div key={j}>
                  <TextPressure
                    text={line}
                    flex
                    alpha={false}
                    stroke={false}
                    width
                    weight
                    italic
                    textColor="currentColor"
                  />
                </div>
              ))}
            </h2>

            {s.isStats ? (
              /* ── Slide 00 : stats avec compteurs animés ── */
              <div className="ss-stats-grid">
                {STATS.map((st, k) => (
                  <div className="ss-stat-card" key={k}>
                    <div className="ss-stat-n">
                      <AnimatedCounter
                        target={st.target}
                        suffix={st.suffix}
                        duration={2200}
                        delay={st.delay}
                      />
                    </div>
                    <div className="ss-stat-l">{st.label}</div>
                    <div className="ss-stat-bar">
                      <div
                        className="ss-stat-bar-fill"
                        style={{ '--pct': `${Math.min(st.target * 3, 100)}%`, '--delay': `${st.delay}ms` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="ss-body">{s.body}</p>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

function Marquee() {
  const words = ["React", "Django", "Flask", "Python", "Tailwind", "MySQL", "Vercel", "Node.js", "Git", "REST API", "Bootstrap", "JavaScript"];
  const d = [...words, ...words];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {d.map((w, i) => (
          <span key={i} className="mw">
            {w}
            <span className="mdot">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   FEATURED CREATION — desktop
   ════════════════════════════════════════════ */
const FC_MOBILE_SLIDES = [
  '/assets/images/projects/nexura-responsive.jpg',
  '/assets/images/projects/nexura-responsive2.jpg',
]

function FeaturedCreationDesktop() {
  const proj = PROJECTS.find(p => p.id === 15)
  const sectionRef = useRef(null)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const entries = el.querySelectorAll('.fc-entry')
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        entries.forEach(en => en.classList.add('vis'))
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    obs.observe(el)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % FC_MOBILE_SLIDES.length), 4000)
    return () => clearInterval(t)
  }, [])

  if (!proj) return null

  return (
    <section className="featured-creation" ref={sectionRef}>
      <p className="fc-eyebrow">En production.</p>
      <h2 className="fc-title">Dernière création</h2>
      <div className="fc-grid">
        {/* ── Mockups ── */}
        <div className="fc-mockups fc-entry">
          <div className="fc-desktop-wrap">
            <div className="fc-desktop-shell">
              <div className="fc-desktop-bar">
                <span className="fc-dot fc-dot--r"/>
                <span className="fc-dot fc-dot--y"/>
                <span className="fc-dot fc-dot--g"/>
                <span className="fc-bar-url">nexura-one.vercel.app</span>
              </div>
              <div className="fc-desktop-screen">
                <img
                  src={proj.img}
                  alt="Nexura desktop"
                  className="fc-screen-img"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                />
                <div className="fc-screen-ph" style={{ display: 'none' }}>
                  <AnimIcon type="monitor" size={40} color="rgba(255,255,255,.2)" />
                </div>
              </div>
            </div>
          </div>
          <div className="fc-mobile-wrap">
            <div className="fc-mobile-shell">
              <div className="fc-mobile-notch"/>
              <div className="fc-mobile-screen">
                <div className="fc-slide-track" style={{ transform: `translateY(-${slide * 50}%)`, transition: 'transform .6s cubic-bezier(.4,0,.2,1)', willChange: 'transform' }}>
                  {FC_MOBILE_SLIDES.map((src, i) => (
                    <img key={i} src={src} alt={`Nexura mobile ${i + 1}`} className="fc-screen-img fc-slide-img" />
                  ))}
                </div>
              </div>
              <div className="fc-mobile-home"/>
            </div>
            <div className="fc-resp-badge">
              <AnimIcon type="check" size={12} color="#FF5500"/> 100% Responsive
            </div>
          </div>
          <div className="fc-glow"/>
        </div>
        {/* ── Info panel ── */}
        <div className="fc-info fc-entry">
          <div>
            <h3 className="fc-name">{proj.title}</h3>
            <p className="fc-sub">{proj.sub}</p>
          </div>
          <div className="fc-meta">
            <div className="fc-meta-row"><span className="fc-ml">Type</span><span className="fc-mv">Application Web Full-Stack</span></div>
            <div className="fc-meta-row"><span className="fc-ml">Marché</span><span className="fc-mv">Côte d'Ivoire</span></div>
            <div className="fc-meta-row"><span className="fc-ml">Mon rôle</span><span className="fc-mv">Conception & Développement</span></div>
            <div className="fc-meta-row"><span className="fc-ml">Année</span><span className="fc-mv">{proj.year}</span></div>
          </div>
          <div className="fc-tags">
            {proj.tech.map(t => <span key={t} className="fc-tag">{t}</span>)}
          </div>
          <p className="fc-desc">{proj.desc}</p>
          <a href={proj.url} target="_blank" rel="noreferrer" className="fc-cta">
            <AnimIcon type="globe" size={15} color="currentColor"/> Voir le projet
          </a>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════
   ABOUT
   ════════════════════════════════════════════ */
function About() {
  useEffect(() => {
    document.querySelectorAll('.about-block').forEach((el, i) => {
      el.style.transitionDelay = `${i * .12}s`
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } }, { threshold: .2 })
      obs.observe(el)
    })
  }, [])
  return (
    <section id="about-section" className="sec" style={{ padding: 0, borderTop: '1px solid rgba(255,85,0,.08)' }}>
      <div className="about-grid">
        <div className="about-left">
  <div
    className="about-photo-wrap"
    style={{
      width: '620px',
      height: '760px',
      maxWidth: '100%',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '32px'
    }}
  >
    <div className="about-photo-deco" />

    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <InfiniteMenu
        items={ABOUT_ITEMS}
        scale={1}
        showOverlay={false}
      />
    </div>

    <div className="about-photo-tag">
      TOUCHE TON CURSEUR ICI ,Decouvre moi
    </div>

    <div className="about-avail">
      <span className="about-avail-dot" />
      FULL-STACK DEV
    </div>
  </div>
</div>
        <div className="about-right">
          <div className="about-block">
            <div className="sec-eyebrow">// Qui suis-je ?</div>
            <h2 style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: 'clamp(3.5rem,7.5vw,7rem)', fontWeight: 800, lineHeight: .88, letterSpacing: '-.032em', marginBottom: '1.5rem' }}>
              <ScrollReveal>Alors, c'est moi.</ScrollReveal>
            </h2>
            <p className="about-text">
  À la base, je venais du monde du <strong>réseau</strong> et de la 
  <strong> sécurité informatique</strong>. 
  Mais au fil du temps, j’ai commencé à aimer autre chose : créer, imaginer, 
  construire des interfaces et voir des idées prendre vie à l’écran.
</p>

<p className="about-text" style={{ marginTop: '1rem' }}>
  Petit à petit, je me suis donc orienté vers le développement web, 
  où j’ai trouvé un équilibre entre <strong>logique</strong>, 
  <strong> créativité</strong> et <strong>expérience utilisateur</strong>. 
  Aujourd’hui, j’aime autant développer une architecture solide 
  que concevoir une interface qui procure une vraie sensation.
</p>

<p className="about-text" style={{ marginTop: '1rem' }}>
  Je développe principalement avec <strong>React</strong>, 
  <strong> Django</strong> et <strong>Next.js</strong>, 
  tout en explorant les animations web, la data visualisation, 
  la cartographie interactive et les expériences immersives inspirées 
  du motion design moderne.
</p>

<p className="about-text" style={{ marginTop: '1rem' }}>
  Je suis aussi en grande partie <strong>autodidacte</strong>. 
  J’apprends vite, j’expérimente beaucoup et chaque projet est pour moi 
  une nouvelle manière de progresser, tester des idées et repousser mon niveau.
</p>

<p className="about-text" style={{ marginTop: '1rem' }}>
  Et pour transformer cette évolution en quelque chose de concret, j'ai créé{' '}
  <a href="https://akatech.vercel.app/" target="_blank" rel="noreferrer"
     style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid var(--accent)' }}>
    AKATech
  </a>{' '}: un espace où je conçois des produits web modernes, des portfolios immersifs
  et des solutions digitales pensées pour de vrais usages.
</p>
          </div>
          <div className="about-block">
            <div className="sec-eyebrow">// Stack principale</div>
            <div className="stack-pills">
              {['React', 'JavaScript', 'Next.js'].map(s => <span key={s} className="stack-pill">{s}</span>)}
              {['Python', 'Flask', 'Django', 'MySQL'].map(s => <span key={s} className="stack-pill acc">{s}</span>)}
            </div>
          </div>
          <div className="about-block">
            <div className="sec-eyebrow">// Réalisations de cœur</div>
            <div className="skew-gallery" style={{ marginTop: '1.5rem' }}>
              {[
                { src: '/assets/images/projects/newhorizon-preview.jpg', fb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', label: 'New Horizon Service', url: 'https://new-horizonservice.vercel.app/' },
                { src: '/assets/images/projects/monmarket-preview.jpg', fb: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500', label: 'ShopCI Marketplace', url: 'https://shop-ci.vercel.app/' },
                { src: '/assets/images/projects/nexura-preview.jpg', fb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', label: 'NEXURA Marketplace', url: 'https://nexura-one.vercel.app/' },
              ].map(item => (
                <div key={item.label} className="skew-item skew-item--linked">
                  <div className="skew-item-inner">
                    <img src={item.src} alt={item.label} onError={e => { e.target.src = item.fb }} />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="skew-item-overlay"
                      aria-label={`Voir ${item.label}`}
                    >
                      <span className="skew-item-link-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Voir le projet
                      </span>
                    </a>
                  </div>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', color: 'var(--accent)', marginTop: '.5rem', display: 'block' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about-block">
            <a href="#contact" className="btn-fill" style={{ display: 'inline-flex' }}
              onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Disponible pour opportunités &nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════
   TIMELINE
   ════════════════════════════════════════════ */
function Timeline() {
  useEffect(() => {
    document.querySelectorAll('.tl-item').forEach((el, i) => {
      el.style.transitionDelay = `${i * .12}s`
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.disconnect() } }, { threshold: .15 })
      obs.observe(el)
    })
  }, [])
  return (
    <section id="timeline-section" className="sec">
      <div className="sec-eyebrow">// Parcours</div>
      <h2 className="sec-title" style={{ marginBottom: '3rem' }}>
        <ScrollReveal>Expérience &</ScrollReveal>
        <br />
        <ScrollReveal>Formation.</ScrollReveal>
      </h2>
      <div className="tl-wrap">
        {TIMELINE.map((t, i) => (
          <div key={i} className="tl-item gs-timeline-item">
            <div className="tl-date">{t.date}</div>
            <div className="tl-dot" />
            <div className="tl-body">
              <div className="tl-title">{t.title}</div>
              <div className="tl-company">{t.company}</div>
              <ul className="tl-items">{t.items.map((li, j) => <li key={j}>{li}</li>)}</ul>
              <div className="tl-tags">{t.tags.map(tag => <span key={tag} className="tl-tag">{tag}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════
   SKEW SECTION — Flowing Menu (chic_aussi)
   ════════════════════════════════════════════ */
function SkewSection() {
  const items = [
    { img: '/assets/images/projects/CB.png', title: '01 — Code propre & sécurisé', body: "Chaque ligne de code applique les bonnes pratiques : auth, permissions, validation côté serveur. La sécurité n'est pas une option, c'est une fondation." },
    { img: '/assets/images/projects/jean-edy-preview.jpg', title: '02 — Interface pensée usages réels', body: "Des interfaces React/Next.js pensées pour l'utilisateur final. Responsive, rapides, accessibles — pas juste belles." },
    { img: '/assets/images/projects/C.png', title: '03 — Livraison dans les délais', body: "Communication transparente à chaque étape. Vous suivez l'avancement en temps réel, aucune surprise à la livraison." },
    { img: '/assets/images/projects/A.png', title: '04 — Data & Carto intégrés', body: 'Dashboards interactifs, visualisations Chart.js, cartes Leaflet/OpenStreetMap ou MAPBOX Je transforme vos données en décisions.' },
  ]

  const menuRef = useRef(null)

  useEffect(() => {
    /* Inject CSS once */
    const styleId = 'flowing-menu-style'
    if (!document.getElementById(styleId)) {
      const s = document.createElement('style')
      s.id = styleId
      s.textContent = `
        .fm-wrap { width: 100%; }
        .fm-item {
          position: relative;
          border-top: 1px solid rgba(255,85,0,.15);
          overflow: hidden;
        }
        .fm-item:last-child { border-bottom: 1px solid rgba(255,85,0,.15); }
        .fm-link {
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          padding: clamp(1.2rem,3vw,2rem) clamp(1rem,4vw,3rem);
          font-family: var(--fd);
          font-size: clamp(1.4rem,3.5vw,3rem);
          font-weight: 800;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--text,#F2EDE8);
          position: relative;
          z-index: 2;
          gap: .5rem;
        }
        .fm-link-title { display: block; letter-spacing: -.02em; line-height: 1; }
        .fm-link-body {
          display: block;
          font-size: clamp(.85rem,1.4vw,1.05rem);
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          color: var(--muted,rgba(242,237,232,.45));
          max-width: 540px;
          line-height: 1.6;
          font-family: var(--fd);
        }
        .fm-marquee {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 101%;
          background-color: #FF5500;
          z-index: 1;
          display: flex;
          align-items: center;
          transform: translateY(101%);
          pointer-events: none;
          will-change: transform;
        }
        .fm-marquee__inner-wrap {
          height: 100%; width: 100%;
          display: flex; align-items: center;
          overflow: hidden;
        }
        .fm-marquee__inner {
          display: flex;
          width: max-content;
          height: 100%;
          align-items: center;
          will-change: transform;
          transform: translateY(-101%);
        }
        .fm-marquee__part {
          display: flex;
          align-items: center;
          padding: 0 2vw;
          color: #fff;
          font-size: clamp(1.4rem,3.5vw,3rem);
          font-weight: 800;
          text-transform: uppercase;
          font-family: var(--fd);
          letter-spacing: -.02em;
          white-space: nowrap;
        }
        .fm-marquee__img {
          width: clamp(80px,10vw,130px);
          height: clamp(55px,7vw,88px);
          margin: 0 2vw;
          background-size: cover;
          background-position: center;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .fm-link:hover .fm-link-title { opacity: .0; }
      `
      document.head.appendChild(s)
    }

    const items = menuRef.current?.querySelectorAll('.fm-item')
    if (!items) return
    const cleanups = []

    items.forEach(item => {
      const link = item.querySelector('.fm-link')
      const marquee = item.querySelector('.fm-marquee')
      const inner = item.querySelector('.fm-marquee__inner')
      const titleText = link.querySelector('.fm-link-title').textContent
      const imgUrl = link.dataset.img

      /* Build repeating marquee content */
      const part = `
        <div class="fm-marquee__part">
          <span>${titleText}</span>
          <div class="fm-marquee__img" style="background-image:url(${imgUrl})"></div>
        </div>`
      inner.innerHTML = part.repeat(8)

      /* Horizontal scroll animation */
      const partEl = inner.querySelector('.fm-marquee__part')
      const partW = partEl.offsetWidth + (parseFloat(getComputedStyle(partEl).marginLeft) || 0) * 2
      const tw = gsap.to(inner, { x: -partW, duration: 12, ease: 'none', repeat: -1 })

      /* Edge detection */
      const edge = (ev, rect) => ev.clientY - rect.top < rect.height / 2 ? 'top' : 'bottom'

      const onEnter = ev => {
        const e = edge(ev, item.getBoundingClientRect())
        gsap.set(marquee, { y: e === 'top' ? '-101%' : '101%' })
        gsap.set(inner,   { y: e === 'top' ? '101%'  : '-101%' })
        gsap.to([marquee, inner], { y: '0%', duration: 0.6, ease: 'expo.out' })
        tw.play()
      }
      const onLeave = ev => {
        const e = edge(ev, item.getBoundingClientRect())
        gsap.to(marquee, { y: e === 'top' ? '-101%' : '101%', duration: 0.6, ease: 'expo.out' })
        gsap.to(inner,   { y: e === 'top' ? '101%'  : '-101%', duration: 0.6, ease: 'expo.out' })
      }

      link.addEventListener('mouseenter', onEnter)
      link.addEventListener('mouseleave', onLeave)
      cleanups.push(() => { link.removeEventListener('mouseenter', onEnter); link.removeEventListener('mouseleave', onLeave); tw.kill() })
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <section id="skew-section">
      {/* En-tête sticky à gauche */}
      <div className="skew-grid">
        <div className="skew-sticky">
          <div>
            <div style={{ fontSize: '.6rem', letterSpacing: '.45em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.5rem', fontFamily: "'Space Mono',monospace" }}>// Mon Approche</div>
            <h2 className="sec-title skew-heading" style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: '-.025em', hyphens: 'none', wordBreak: 'normal', overflowWrap: 'normal' }}>
              <span style={{ display: 'block' }}>Pourquoi les</span>
              <span style={{ display: 'block' }}>projets réussissent</span>
              <span style={{ display: 'block' }}>avec mon approche.</span>
            </h2>
          </div>
        </div>

        {/* Flowing menu */}
        <div className="skew-imgs" style={{ padding: '7rem 0', gap: 0 }}>
          <nav className="fm-wrap" ref={menuRef}>
            {items.map((item, i) => (
              <div key={i} className="fm-item">
                <a href="#contact" className="fm-link" data-img={item.img}
                  onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
                  <span className="fm-link-title">{item.title}</span>
                  <span className="fm-link-body">{item.body}</span>
                </a>
                <div className="fm-marquee">
                  <div className="fm-marquee__inner-wrap">
                    <div className="fm-marquee__inner" />
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════
   SKILLS
   ════════════════════════════════════════════ */
function SkillCard({ sk }) {
  const [hovered, setHovered] = useState(false)
  const col = sk.color || '#888888'
  return (
    <div
      key={sk.name}
      className="skill-card gs-skill"
      style={hovered ? { borderColor: col + '80', background: col + '12', boxShadow: `0 0 18px ${col}22` } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={sk.icon}
        alt={sk.name}
        style={{ filter: hovered ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.55)', transition: 'filter .25s' }}
        onError={e => { e.target.style.opacity = '.4' }}
      />
      <span>{sk.name}</span>
    </div>
  )
}

function SkillBandItem({ sk }) {
  const [hovered, setHovered] = useState(false)
  const col = sk.color || '#888888'
  return (
    <div
      className="skill-item"
      style={hovered ? { borderColor: col, color: 'var(--text)' } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={sk.icon}
        alt={sk.name}
        style={{ filter: hovered ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.55)', transition: 'filter .25s' }}
        onError={e => { e.target.style.opacity = '.4' }}
      />
      <span>{sk.name}</span>
    </div>
  )
}

function SkillsSection() {
  const allSkills = [
    ...SKILLS.frontend,
    ...SKILLS.backend,
    ...SKILLS.tools,
  ]

  return (
    <section id="skills-section" className="sec">
      <div className="sec-eyebrow">// Compétences</div>
      <h2 className="sec-title">
        <ScrollReveal>Mes outils</ScrollReveal>
        {' '}
        <br />
        <ScrollReveal>de travail.</ScrollReveal>
      </h2>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.62rem', color: 'rgba(255,85,0,.55)', letterSpacing: '.2em', margin: '2.5rem 0 1rem' }}>
        // technologies & langages
      </p>
      <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '16px', border: '1px solid rgba(255,85,0,.1)', overflow: 'hidden', background: 'rgba(255,85,0,.02)' }}>
        <ImageTrail items={allSkills} />
      </div>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.15em', textAlign: 'center', marginTop: '1rem' }}>
        React · JavaScript · Next.js · Python · Django · Flask · MySQL · Git · VS Code · GitHub · Vercel · Tailwind
      </p>
    </section>
  )
}

/* ════════════════════════════════════════════
   3D SHOWCASE — Services
   Logo img dans le cube + tilt 3D au hover
   ════════════════════════════════════════════ */
function ShowcaseSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const cubeRef = useRef(null)
  const sectionRef = useRef(null)
  const logoRef = useRef(null)

  /* Tilt 3D logo au hover */
  const handleLogoMove = e => {
    const el = logoRef.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const nx = ((e.clientX || (e.touches && e.touches[0].clientX) || 0) - rect.left) / rect.width - 0.5
    const ny = ((e.clientY || (e.touches && e.touches[0].clientY) || 0) - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-ny * 12}deg) rotateY(${nx * 12}deg) scale(1.18)`
    el.style.filter = 'blur(1.6px)'
    el.classList.add('is-active')
  }
  const handleLogoLeave = () => {
    const el = logoRef.current; if (!el) return
    el.style.transform = ''; el.style.filter = ''; el.classList.remove('is-active')
  }

  useEffect(() => {
    let mouseX = 0, mouseY = 0, floatT = 0, rafId
    const onMouse = e => { mouseX = (e.clientX / window.innerWidth) - .5; mouseY = (e.clientY / window.innerHeight) - .5 }
    document.addEventListener('mousemove', onMouse)
    const onScroll = () => {
      const section = sectionRef.current; if (!section) return
      const prog = Math.max(0, Math.min(1, (window.scrollY - section.offsetTop) / (section.offsetHeight - window.innerHeight)))
      setActiveIdx(Math.min(SERVICES.length - 1, Math.floor(prog * SERVICES.length)))
      if (cubeRef.current) cubeRef.current._scrollRot = prog * 360 * 1.5
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const animCube = () => {
      floatT += .016
      const cube = cubeRef.current; if (!cube) { rafId = requestAnimationFrame(animCube); return }
      cube.style.transform = `rotateY(${(cube._scrollRot || 0) + mouseX * 40}deg) rotateX(${mouseY * -30}deg) translateY(${Math.sin(floatT * 1.2) * 12}px)`
      rafId = requestAnimationFrame(animCube)
    }
    if (cubeRef.current) cubeRef.current._scrollRot = 0
    animCube()
    return () => { document.removeEventListener('mousemove', onMouse); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [])

  return (
    <section id="showcase-section" ref={sectionRef}>
      <div className="sc-sticky">
        <div className="sc-text">
          <div className="sc-eyebrow">// Services</div>
          <div className="sc-panels">
            {SERVICES.map((s, i) => (
              <div key={i} className={`sc-panel${i === activeIdx ? ' active' : ''}`}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '.58rem', letterSpacing: '.35em', color: 'var(--accent)', marginBottom: '1.5rem' }}>
                  {s.n} / 0{SERVICES.length}
                </div>
                <h3>{s.title.toUpperCase()}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="sc-progress">
            {SERVICES.map((_, i) => (
              <button key={i} className={`sc-dot${i === activeIdx ? ' on' : ''}`} onClick={() => setActiveIdx(i)} />
            ))}
          </div>
        </div>
        <div className="sc-3d-wrap">
          <div className="sc-cube" ref={cubeRef}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="sc-face">
                <span className="sc-face-inner">
                  {i === 0 && (
                    <div className="sc-logo-a">
                      {/* Logo image avec tilt 3D — v7 */}
                      <img
                        ref={logoRef}
                        src="/assets/images/logo-akatech.png"
                        alt="AKATech"
                        className="sc-logo-img"
                        onError={e => { e.target.style.opacity = '0.9' }}
                        onMouseMove={handleLogoMove}
                        onMouseLeave={handleLogoLeave}
                        onTouchStart={handleLogoMove}
                        onTouchEnd={handleLogoLeave}
                        style={{ transition: 'transform .18s ease,filter .18s ease', cursor: 'pointer' }}
                      />
                    </div>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════
   PRICING — isPopular + 4 onglets
   ════════════════════════════════════════════ */
function PricingSection() {
  const [currentTab, setCurrentTab] = useState(0)
  const [activeDot, setActiveDot] = useState(0)
  const scrollRef = useRef(null)
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const tab = PRICING_TABS[currentTab]

  /* Sync scroll-snap dot indicator */
  useEffect(() => {
    const el = scrollRef.current; if (!el) return
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth)
      setActiveDot(idx)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [currentTab])

  /* Reset scroll position on tab change */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
    setActiveDot(0)
  }, [currentTab])

  const scrollToCard = i => {
    if (scrollRef.current) scrollRef.current.scrollTo({ left: i * scrollRef.current.offsetWidth, behavior: 'smooth' })
  }

  return (
    <section id="pricing-section">
      <div className="sec-eyebrow" style={{ textAlign: 'center' }}>// Tarifs</div>
      <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <ScrollReveal>Mes offres.</ScrollReveal>
      </h2>

      {/* Tabs */}
      <div className="ptabs">
        {PRICING_TABS.map((t, i) => (
          <button key={t.key} className={`ptab${i === currentTab ? ' on' : ''}`} onClick={() => setCurrentTab(i)}>{t.label}</button>
        ))}
      </div>

      {/* Cards — horizontal scroll on mobile */}
      <div className="pricing-scroll-outer">
        <div className="pricing-grid" key={currentTab} ref={scrollRef}>
          {tab.plans.map((p, i) => (
            <div key={i} className={`price-card gs-card${p.isPopular ? ' pop' : ''}`}>
              {p.isPopular && <div className="price-pop-badge">POPULAIRE</div>}
              <div className="price-badge">{p.badge}</div>
              <div className="price-amount">{p.price}</div>
              <div className="price-delivery"><AnimIcon type="clock" size={12} /> {p.delivery}</div>
              <div className="price-sep" />
              <ul className="price-feat">{p.features.map((f, j) => <li key={j}><AnimIcon type="check" size={11} color="#FF5500" /> {f}</li>)}</ul>
              <button className="price-cta" onClick={() => scrollTo('contact')}>Me contacter</button>
            </div>
          ))}
        </div>

        {/* Mobile dots navigator */}
        <div className="pricing-mobile-nav">
          {tab.plans.map((_, i) => (
            <button
              key={i}
              className={`pricing-dot${i === activeDot ? ' on' : ''}`}
              onClick={() => scrollToCard(i)}
              aria-label={`Carte ${i + 1}`}
            />
          ))}
        </div>

        {/* Swipe hint — shown only first time */}
        <div className="pricing-swipe-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          Glisser pour voir plus
        </div>
      </div>

      <p className="pricing-note">
        Chaque projet étant unique, les tarifs peuvent varier selon les fonctionnalités demandées.
      </p>
    </section>
  )
}

/* ════════════════════════════════════════════
   GALLERY WebGL OGL
   ════════════════════════════════════════════ */
function GallerySection() {
  const containerRef = useRef(null)
  useEffect(() => {
    const container = containerRef.current; if (!container) return
    let cleanup = false
    import('ogl').then(({ Camera, Mesh, Plane, Program, Renderer, Texture, Transform }) => {
      if (cleanup) return
      const lerp = (a, b, t) => a + (b - a) * t
      const items = [...PROJECTS, ...PROJECTS].map(p => ({ image: p.img, title: p.title, sub: p.sub, desc: p.desc, tech: p.tech, url: p.url }))
      const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(devicePixelRatio, 2) })
      const gl = renderer.gl
      gl.canvas.style.cssText = 'width:100%;height:100%;display:block;'
      container.appendChild(gl.canvas)
      const camera = new Camera(gl); camera.fov = 45; camera.position.z = 20
      const scene = new Transform()
      const baseGeom = new Plane(gl, { heightSegments: 50, widthSegments: 100 })
      const BEND = 2.2
      let screen = { width: container.clientWidth, height: container.clientHeight }
      renderer.setSize(screen.width, screen.height)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
      const fov2 = camera.fov * Math.PI / 180
      const vpH = 2 * Math.tan(fov2 / 2) * camera.position.z
      let vp = { width: vpH * camera.aspect, height: vpH }
      const sc = screen.height / 1500
      const plH = vp.height * (720 * sc) / screen.height, plW = vp.width * (1040 * sc) / screen.width
      const mkFB = (glCtx, title) => {
        const c = document.createElement('canvas'); c.width = 800; c.height = 550
        const ctx = c.getContext('2d'); const g = ctx.createLinearGradient(0, 0, 0, 550)
        g.addColorStop(0, '#0d0800'); g.addColorStop(1, '#1a0800'); ctx.fillStyle = g; ctx.fillRect(0, 0, 800, 550)
        ctx.font = 'bold 52px Syne, sans-serif'; ctx.fillStyle = 'rgba(255,85,0,0.4)'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, 400, 275)
        const tex = new Texture(glCtx, { generateMipmaps: false }); tex.image = c; return tex
      }
      const vert = `precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform float uTime;uniform float uSpeed;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z=(sin(p.x*4.0+uTime)*1.5+cos(p.y*2.0+uTime)*1.5)*(0.1+uSpeed*0.3);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`
      const frag = `precision highp float;uniform vec2 uImageSizes;uniform vec2 uPlaneSizes;uniform sampler2D tMap;uniform float uBorderRadius;varying vec2 vUv;float rBox(vec2 p,vec2 b,float r){vec2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0)-r;}void main(){vec2 ratio=vec2(min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.0),min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.0));vec2 uv=vUv*ratio+(1.0-ratio)*0.5;vec4 c=texture2D(tMap,uv);float d=rBox(vUv-0.5,vec2(0.5-uBorderRadius),uBorderRadius);gl_FragColor=vec4(c.rgb,1.0-smoothstep(-0.002,0.002,d));}`
      const width = plW + 2, widthAll = width * items.length
      const medias = items.map((item, i) => {
        const fallTex = mkFB(gl, item.title)
        const p = new Program(gl, { vertex: vert, fragment: frag, uniforms: { tMap: { value: fallTex }, uPlaneSizes: { value: [plW, plH] }, uImageSizes: { value: [800, 550] }, uSpeed: { value: 0 }, uTime: { value: Math.random() * 100 }, uBorderRadius: { value: .07 } }, transparent: true })
        const img = new Image(); img.src = item.image
        img.onload = () => { const tex = new Texture(gl, { generateMipmaps: true }); tex.image = img; p.uniforms.tMap.value = tex; p.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight] }
        const plane = new Mesh(gl, { geometry: baseGeom, program: p })
        plane.scale.set(plW, plH, 1); plane.setParent(scene); plane._data = item
        return { plane, prog: p, x: width * i, extra: 0 }
      })
      const scroll = { ease: .05, current: 0, target: 0, last: 0 }
      const panel = document.getElementById('gl-detail-panel')
      const pTitle = document.getElementById('gl-p-title'), pSub = document.getElementById('gl-p-sub'), pDesc = document.getElementById('gl-p-desc'), pTechs = document.getElementById('gl-p-techs'), pLink = document.getElementById('gl-p-link')
      let currentProj = null

      /* ── Icônes tech depuis /assets/icons/devicon/ ── */
      const TECH_ICONS = {
        'React':                   { src: '/assets/icons/devicon/react/react-original.svg',                     color: '#61DAFB' },
        'JavaScript':              { src: '/assets/icons/devicon/javascript/javascript-original.svg',           color: '#F7DF1E' },
        'HTML + JS vanilla':       { src: '/assets/icons/devicon/html5/html5-original.svg',                     color: '#E34F26' },
        'HTML / Tailwind CSS':     { src: '/assets/icons/devicon/html5/html5-original.svg',                     color: '#E34F26' },
        'Next.js':                 { src: '/assets/icons/devicon/nextjs/nextjs-original.svg',                   color: '#ffffff' },
        'Next.js 14':              { src: '/assets/icons/devicon/nextjs/nextjs-original.svg',                   color: '#ffffff' },
        'Next.js 15':              { src: '/assets/icons/devicon/nextjs/nextjs-original.svg',                   color: '#ffffff' },
        'Python':                  { src: '/assets/icons/devicon/python/python-original.svg',                   color: '#4B8BBE' },
        'Python/Flask':            { src: '/assets/icons/devicon/flask/flask-original.svg',                     color: '#AAAAAA' },
        'Django':                  { src: '/assets/icons/devicon/django/django-plain.svg',                      color: '#44B78B' },
        'Django REST':             { src: '/assets/icons/devicon/django/django-plain.svg',                      color: '#44B78B' },
        'Flask':                   { src: '/assets/icons/devicon/flask/flask-original.svg',                     color: '#AAAAAA' },
        'MySQL':                   { src: '/assets/icons/devicon/mysql/mysql-original.svg',                     color: '#F29111' },
        'Node.js':                 { src: '/assets/icons/devicon/nodejs/nodejs-original.svg',                   color: '#539E43' },
        'Tailwind CSS':            { src: '/assets/icons/devicon/tailwindcss/tailwindcss-original.svg',         color: '#38BDF8' },
        'Bootstrap':               { src: '/assets/icons/devicon/bootstrap/bootstrap-original.svg',             color: '#7952B3' },
        'Bootstrap 5':             { src: '/assets/icons/devicon/bootstrap/bootstrap-original.svg',             color: '#7952B3' },
        'HTML':                    { src: '/assets/icons/devicon/html5/html5-original.svg',                     color: '#E34F26' },
        'CSS':                     { src: '/assets/icons/devicon/css3/css3-original.svg',                       color: '#1572B6' },
        'Git':                     { src: '/assets/icons/devicon/git/git-original.svg',                         color: '#F05032' },
        'GitHub':                  { src: '/assets/icons/devicon/github/github-original.svg',                   color: '#ffffff' },
        'Vercel':                  { src: '/assets/icons/devicon/vercel/vercel-original.svg',                   color: '#ffffff' },
        'Vercel + PythonAnywhere': { src: '/assets/icons/devicon/vercel/vercel-original.svg',                   color: '#ffffff' },
        'Prisma':                  { src: '/assets/icons/devicon/prisma/prisma-original.svg',                   color: '#2D3748' },
        'PostgreSQL':              { src: '/assets/icons/devicon/postgresql/postgresql-original.svg',           color: '#336791' },
        'Redis & Celery':          { src: '/assets/icons/devicon/rediscelery/rediscelery-original.svg',         color: '#DC382D' },
        'Redis':                   { src: '/assets/icons/devicon/redis/redis-original.svg',                     color: '#DC382D' },
        'Framer Motion':           { src: '/assets/icons/devicon/framermotion/framermotion-original.svg',       color: '#BB4BFF' },
        'Bulma':                   { src: '/assets/icons/devicon/bulma/bulma-plain.svg',                        color: '#00D1B2' },
        'Canvas API':              { src: '/assets/icons/devicon/canvasapi/canvasapi-original.svg',             color: '#FF8C00' },
        'Howler.js':               { src: '/assets/icons/devicon/howlerjs/howlerjs-original.svg',               color: '#FF6B35' },
        'WebSockets':              { src: '/assets/icons/devicon/websockets/websockets-original.svg',           color: '#FF9500' },
        'WebGL Aurora':            { src: '/assets/icons/devicon/webgl/webgl-original.svg',                     color: '#7B2FF7' },
        'PythonAnywhere':          { src: '/assets/icons/devicon/pythonanywhere/pythonanywhere-original.svg',   color: '#4B8BBE' },
        'Chart.js':                { src: '/assets/icons/devicon/chartjs/chartjs-original.svg',                 color: '#FF6384' },
        'Leaflet.js':              { src: '/assets/icons/devicon/leafletjs/leafletjs-original.svg',             color: '#1A9641' },
        'Camera API':              { src: '/assets/icons/devicon/cameraapi/cameraapi-original.svg',             color: '#888888' },
        'Geolocation API':         { src: '/assets/icons/devicon/geolocationapi/geolocationapi-original.svg',   color: '#4285F4' },
        'LocalStorage':            { src: '/assets/icons/devicon/localstorage/localstorage-original.svg',       color: '#F7DF1E' },
        'OSRM API':                { src: '/assets/icons/devicon/osrmapi/osrmapi-original.svg',                 color: '#E84C3D' },
        'Vite':                    { src: '/assets/icons/devicon/vitejs/vitejs-original.svg',                   color: '#BD34FE' },
        'GSAP':                    { src: '/assets/icons/devicon/gsap/gsap-original.svg',                       color: '#88CE02' },
        'React Router v6':         { src: '/assets/icons/devicon/reactrouter/reactrouter-original.svg',         color: '#F44250' },
        'React Router':            { src: '/assets/icons/devicon/reactrouter/reactrouter-original.svg',         color: '#F44250' },
        'EmailJS':                 { src: '/assets/icons/devicon/emailjs/emailjs-original.svg',                 color: '#F4921B' },
        'React 18':                { src: '/assets/icons/devicon/react/react-original.svg',                     color: '#61DAFB' },
        'TailwindCSS':             { src: '/assets/icons/devicon/tailwindcss/tailwindcss-original.svg',         color: '#38BDF8' },
      }

      const makeTechIcon = techName => {
        const info = TECH_ICONS[techName] || null
        const col = info ? info.color : '#888888'
        const wrap = document.createElement('div')
        wrap.className = 'gl-tech-icon'
        wrap.title = techName
        wrap.style.setProperty('--tech-color', col)

        if (info && info.src) {
          const img = document.createElement('img')
          img.src = info.src
          img.alt = techName
          wrap.appendChild(img)
        } else {
          wrap.classList.add('gl-tech-icon--fallback')
          wrap.textContent = techName.slice(0, 2).toUpperCase()
        }
        return wrap
      }

      const showPanel = item => {
        if (currentProj === item.title) return
        currentProj = item.title
        if (pTitle) pTitle.textContent = item.title
        if (pSub) pSub.textContent = item.sub
        if (pDesc) pDesc.textContent = item.desc
        if (pTechs) {
          pTechs.innerHTML = ''
          item.tech.slice(0, 6).forEach(t => pTechs.appendChild(makeTechIcon(t)))
        }
        if (pLink) { pLink.href = item.url; pLink.target = item.url.startsWith('http') ? '_blank' : '_self' }
        if (panel) { panel.style.opacity = '1'; panel.style.transform = 'translateX(-50%) translateY(0)' }
      }
      const hidePanel = () => { currentProj = null; if (panel) { panel.style.opacity = '0'; panel.style.transform = 'translateX(-50%) translateY(16px)' } }
      const galSec = document.getElementById('gallery-section')
      if (galSec) {
        galSec.addEventListener('wheel', e => { e.preventDefault(); scroll.target += e.deltaY * .012 }, { passive: false })
        let isDown = false, startX = 0, startScroll = 0
        galSec.addEventListener('mousedown', e => { isDown = true; startX = e.clientX; startScroll = scroll.current; galSec.style.cursor = 'grabbing' })
        window.addEventListener('mouseup', () => { isDown = false; galSec.style.cursor = 'grab' })
        galSec.addEventListener('mousemove', e => { if (!isDown) return; scroll.target = startScroll + (startX - e.clientX) * .05 })
        galSec.addEventListener('touchstart', e => { startX = e.touches[0].clientX; startScroll = scroll.current })
        galSec.addEventListener('touchmove', e => { scroll.target = startScroll + (startX - e.touches[0].clientX) * .05 })
      }
      window.addEventListener('resize', () => { screen = { width: container.clientWidth, height: container.clientHeight }; renderer.setSize(screen.width, screen.height); camera.perspective({ aspect: gl.canvas.width / gl.canvas.height }) })
      const H2 = vp.width / 2, R = BEND ? (H2 * H2 + BEND * BEND) / (2 * Math.abs(BEND)) : Infinity
      const updateGallery = () => {
        if (cleanup) return
        scroll.current = lerp(scroll.current, scroll.target, scroll.ease)
        const dir = scroll.current > scroll.last ? 'right' : 'left'
        let closestDist = Infinity, closestItem = null
        medias.forEach(m => {
          m.plane.position.x = m.x - scroll.current - m.extra
          const x = m.plane.position.x, ex = Math.min(Math.abs(x), H2), arc = R - Math.sqrt(R * R - ex * ex)
          m.plane.position.y = (BEND > 0 ? -arc : arc) - 1.0
          m.plane.rotation.z = (BEND > 0 ? -1 : 1) * Math.sign(x) * Math.asin(ex / R)
          m.prog.uniforms.uTime.value += .03; m.prog.uniforms.uSpeed.value = scroll.current - scroll.last
          const vOff = vp.width / 2, pOff = m.plane.scale.x / 2
          if (dir === 'right' && m.plane.position.x + pOff < -vOff) m.extra -= widthAll
          if (dir === 'left' && m.plane.position.x - pOff > vOff) m.extra += widthAll
          const dist = Math.abs(m.plane.position.x); if (dist < closestDist) { closestDist = dist; closestItem = m }
        })
        if (closestItem && closestDist < plW * .6) showPanel(closestItem.plane._data); else hidePanel()
        renderer.render({ scene, camera }); scroll.last = scroll.current
        requestAnimationFrame(updateGallery)
      }
      updateGallery()
    }).catch(err => console.warn('OGL gallery failed:', err))
    return () => { cleanup = true }
  }, [])

  return (
    <section id="gallery-section" style={{ position: 'relative' }}>
      <div className="gl-header">
        <div>
          <div className="gl-eyebrow">// Portfolio</div>
          <h2 className="sec-title" style={{ marginBottom: 0 }}><ScrollReveal>Mes Réalisations</ScrollReveal></h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', fontSize: '.85rem', color: 'var(--muted)', marginTop: '.5rem' }}>Glisser ou défiler pour explorer →</div>
        </div>
      </div>
      <div id="gallery-container" ref={containerRef} />
      <div id="gl-detail-panel" style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(6,8,16,.88)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,85,0,.2)', borderRadius: '18px', padding: '1.4rem 2rem', width: 'min(92vw,540px)', opacity: 0, transition: 'opacity .35s ease,transform .35s ease', pointerEvents: 'none', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div id="gl-p-title" style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: '1.15rem', fontWeight: 800, color: '#F2EDE8', marginBottom: '3px' }} />
            <div id="gl-p-sub" style={{ fontSize: '.68rem', color: 'var(--accent)', fontFamily: "'Space Mono',monospace", letterSpacing: '.1em', marginBottom: '.7rem' }} />
            <div id="gl-p-desc" style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.65, maxWidth: '320px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
            <div id="gl-p-techs" style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', justifyContent: 'flex-end', maxWidth: '210px', pointerEvents: 'auto' }} />
            <a id="gl-p-link" href="#" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'linear-gradient(135deg,#FF5500,#CC3300)', color: '#fff', padding: '8px 16px', borderRadius: '999px', fontFamily: "'Clash Display','Syne',sans-serif", fontWeight: 700, fontSize: '.68rem', letterSpacing: '.06em', textTransform: 'uppercase', textDecoration: 'none', pointerEvents: 'auto' }}>
              Voir →
            </a>
          </div>
        </div>
      </div>
      <div className="gl-hint">← glisser ou défiler →</div>
    </section>
  )
}
/* ════════════════════════════════════════════
   TESTIMONIALS
   ════════════════════════════════════════════ */
function TestiCard({ t }) {
  const cardRef = useRef(null)
  const handleMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xc = rect.width / 2
    const yc = rect.height / 2
    const tiltX = (yc - y) / 12
    const tiltY = (x - xc) / 12
    gsap.to(el, {
      transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.04, 1.04, 1.04)`,
      borderColor: 'rgba(255,85,0,.6)',
      boxShadow: '0 30px 60px rgba(255,85,0,0.12), 0 20px 40px rgba(0,0,0,.5)',
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  }
  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    gsap.to(el, {
      transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'boxShadow,borderColor',
      overwrite: 'auto'
    })
  }
  return (
    <div
      ref={cardRef}
      className="testi-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <div className="testi-project-tag" style={{ transform: 'translateZ(20px)' }}>{t.proj}</div>
      <div style={{ transform: 'translateZ(15px)' }}>
        <div className="testi-stars">
          {Array(5).fill(null).map((_, j) => (
            <svg key={j} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#FF5500" />
            </svg>
          ))}
        </div>
        <div className="testi-quote">
          <div><span className="testi-quote-mark">"</span>{t.text}</div>
        </div>
      </div>
      <div className="testi-footer" style={{ transform: 'translateZ(25px)' }}>
        <div className="testi-avatar">{t.avatar}</div>
        <div>
          <div className="testi-name">{t.name}</div>
          <div className="testi-role">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const testimonialCards = TESTIMONIALS.map(t => (
    <div key={t.name} className="testi-card" style={{
      width: '100%', height: '100%', borderRadius: '16px',
      background: 'var(--bg)', border: 'var(--border)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '1.8rem', boxSizing: 'border-box', backdropFilter: 'blur(16px)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
    }}>
      {/* Tag */}
      <div style={{
        alignSelf: 'flex-start', fontFamily: "var(--fd)", fontSize: '.58rem',
        letterSpacing: '.2em', textTransform: 'uppercase',
        background: 'var(--accent)', border: '2px solid var(--text)',
        padding: '4px 12px', borderRadius: '999px', color: 'var(--bg)', fontWeight: 800,
        marginBottom: '1.2rem'
      }}>{t.proj}</div>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '.8rem' }}>
        {Array(5).fill(null).map((_, j) => (
          <svg key={j} viewBox="0 0 24 24" width="14" height="14">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#FF5500" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p style={{
        fontFamily: "'Lora',serif", fontStyle: 'italic',
        fontSize: 'clamp(.9rem,1.3vw,1.05rem)', lineHeight: 1.72,
        color: 'rgba(242,237,232,.85)', flex: 1
      }}>
        <span style={{ fontSize: '2.2rem', lineHeight: .5, color: 'rgba(255,85,0,.3)', fontWeight: 800, display: 'block', marginBottom: '.4rem' }}>"</span>
        {t.text}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,85,0,.15)', marginTop: '1rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg,#FF5500,#CC3300)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "var(--fd)", fontWeight: 800, fontSize: '.9rem', color: '#0A0A0A', flexShrink: 0
        }}>{t.avatar}</div>
        <div>
          <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: '.85rem', color: 'var(--text)' }}>{t.name}</div>
          <div style={{ fontSize: '.62rem', color: 'var(--muted)', marginTop: '2px' }}>{t.role}</div>
        </div>
      </div>
    </div>
  ))

  return (
    <section id="hscroll-section" style={{ padding: '10vh 0', overflow: 'hidden' }}>
      <div className="hs-label" style={{ position: 'static', margin: '0 0 3rem 6vw' }}>// Ce que disent mes clients</div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '4rem', flexWrap: 'wrap', padding: '0 4vw'
      }}>
        {/* Stack animée */}
        <div style={{ position: 'relative', width: 340, height: 420, flexShrink: 0 }}>
          <Stack
            cards={testimonialCards}
            randomRotation={true}
            sensitivity={180}
            sendToBackOnClick={true}
            autoplay={true}
            autoplayDelay={3500}
            pauseOnHover={true}
            mobileClickOnly={true}
            animationConfig={{ stiffness: 240, damping: 22 }}
          />
        </div>

        {/* Hint */}
        <div style={{ maxWidth: 340, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '.6rem', color: 'var(--accent)', letterSpacing: '.3em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>// {TESTIMONIALS.length} avis clients</div>
          <h3 style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
            Ils m'ont fait confiance.
          </h3>
          <p style={{ fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Glisse ou clique la carte du dessus pour en voir une nouvelle. Chaque projet, une vraie histoire.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {TESTIMONIALS.map(t => (
              <span key={t.name} style={{
                fontFamily: "'Space Mono',monospace", fontSize: '.58rem',
                color: 'var(--muted)', border: '1px solid rgba(255,85,0,.18)',
                borderRadius: '999px', padding: '3px 10px'
              }}>{t.name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════
   INTERACTIVE GITHUB CARD  — Temps réel via GitHub API
   ════════════════════════════════════════════ */
function GitHubInteractiveCard() {
  const GH_USER = 'wthomasss06-stack'

  const [activeTab, setActiveTab]   = useState('grid')
  const [tooltip, setTooltip]       = useState({ show: false, text: '', x: 0, y: 0 })
  const [terminalLines, setTerminalLines] = useState([])
  const [isPushing, setIsPushing]   = useState(false)
  const [logs, setLogs] = useState([
    { id: 1, time: 'Il y a 10 min',    repo: 'shop-ci',      msg: 'fix: validation du panier et mobile money API', commits: 2 },
    { id: 2, time: 'Il y a 2 heures',  repo: 'akatech',      msg: 'feat: ajout des animations GSAP de survol',     commits: 1 },
    { id: 3, time: 'Hier',             repo: 'terrasafe',    msg: 'security: validation CSRF sur le formulaire',    commits: 3 },
    { id: 4, time: 'Il y a 3 jours',   repo: 'chap-chapMAP', msg: 'refactor: optimisation des couches Leaflet',     commits: 1 },
  ])

  const [ghLoading,     setGhLoading]     = useState(true)
  const [ghError,       setGhError]       = useState(false)
  const [ghUser,        setGhUser]        = useState(null)
  const [ghRepos,       setGhRepos]       = useState([])
  const [contributions, setContributions] = useState([])
  const [ghStats, setGhStats] = useState({
    totalContribs: null, longestStreak: null, thisMonth: null, topLang: 'React / Python',
  })

  /* ── Fallback grid réaliste ── */
  const buildFallbackGrid = useCallback(() => {
    const data = []
    const today = new Date()
    const startDate = new Date(); startDate.setDate(today.getDate() - 364)
    const dow = startDate.getDay()
    startDate.setDate(startDate.getDate() - dow)
    for (let i = 0; i < 371; i++) {
      const currentDate = new Date(startDate); currentDate.setDate(startDate.getDate() + i)
      const isWeekend = [0,6].includes(currentDate.getDay())
      let count = 0; const rand = Math.random()
      if (isWeekend) { if (rand > 0.85) count = Math.floor(Math.random()*3)+1 }
      else {
        if (rand > 0.45) {
          if (rand > 0.92) count = Math.floor(Math.random()*8)+5
          else if (rand > 0.72) count = Math.floor(Math.random()*4)+2
          else count = 1
        }
      }
      let level = 0
      if (count > 0) { if (count<=2) level=1; else if (count<=4) level=2; else if (count<=7) level=3; else level=4 }
      data.push({ date: currentDate, count, level })
    }
    return data
  }, [])

  /* ── Fetch indépendant par requête (plus de Promise.all tout-ou-rien) ── */
  useEffect(() => {
    const headers = { Accept: 'application/vnd.github.v3+json' }
    let cancelled = false

    const buildGrid = (apiContribs) => {
      const today = new Date()
      const startDate = new Date(); startDate.setDate(today.getDate() - 364)
      const dow = startDate.getDay()
      const alignedStart = new Date(startDate); alignedStart.setDate(startDate.getDate() - dow)
      const cMap = {}
      apiContribs.forEach(d => { cMap[d.date] = d })
      const grid = []
      for (let i = 0; i < 371; i++) {
        const d = new Date(alignedStart); d.setDate(alignedStart.getDate() + i)
        if (d > today) { grid.push({ date: d, count: 0, level: 0 }); continue }
        const key = d.toISOString().split('T')[0]
        const c = cMap[key] || { count: 0, level: 0 }
        grid.push({ date: d, count: c.count, level: c.level })
      }
      return grid
    }

    /* Timeout helper : rejette après N ms */
    const fetchWithTimeout = (url, opts = {}, ms = 8000) => {
      const ctrl = new AbortController()
      const tid = setTimeout(() => ctrl.abort(), ms)
      return fetch(url, { ...opts, signal: ctrl.signal })
        .finally(() => clearTimeout(tid))
    }

    /* Lancer les 3 requêtes en parallèle mais INDÉPENDAMMENT */
    const run = async () => {
      /* 1. User info */
      fetchWithTimeout(`https://api.github.com/users/${GH_USER}`, { headers })
        .then(r => r.ok ? r.json() : null)
        .then(user => { if (!cancelled && user && !user.message) setGhUser(user) })
        .catch(() => {})

      /* 2. Repos */
      fetchWithTimeout(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=stars`, { headers })
        .then(r => r.ok ? r.json() : [])
        .then(repos => {
          if (cancelled || !Array.isArray(repos)) return
          const sorted = repos.filter(r => !r.fork)
            .sort((a,b) => (b.stargazers_count||0) - (a.stargazers_count||0))
            .slice(0, 4)
          setGhRepos(sorted)
        })
        .catch(() => {})

      /* 3. Contributions — tenter l'API tierce avec retry sur l'API officielle */
      let contribOk = false
      try {
        const r = await fetchWithTimeout(
          `https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`, {}, 10000
        )
        if (r.ok) {
          const data = await r.json()
          if (!cancelled && data?.contributions?.length) {
            const grid = buildGrid(data.contributions)
            setContributions(grid)
            const all   = data.contributions
            const total = all.reduce((s,d) => s+d.count, 0)
            let maxStreak=0, streak=0
            all.forEach(d => { if(d.count>0){streak++;maxStreak=Math.max(maxStreak,streak)}else streak=0 })
            const now = new Date()
            const thisMonth = all
              .filter(d => { const dt=new Date(d.date); return dt.getMonth()===now.getMonth()&&dt.getFullYear()===now.getFullYear() })
              .reduce((s,d)=>s+d.count,0)
            setGhStats({ totalContribs: total, longestStreak: maxStreak, thisMonth, topLang: 'React / Python' })
            contribOk = true
          }
        }
      } catch (_) {}

      /* Fallback si la contrib API a échoué */
      if (!contribOk && !cancelled) {
        setContributions(buildFallbackGrid())
        /* Les stats numériques restent null → affichage "—" élégant */
      }

      if (!cancelled) setGhLoading(false)
    }

    run()
    return () => { cancelled = true }
  }, [buildFallbackGrid])

  /* ── Tooltip ── */
  const handleSquareHover = (e, day) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const parentRect = e.currentTarget.offsetParent?.getBoundingClientRect() || rect
    const opts = { day:'numeric', month:'short', year:'numeric' }
    const dateStr = day.date?.toLocaleDateString('fr-FR', opts) || '—'
    const text = `${day.count} contribution${day.count>1?'s':''} · ${dateStr}`
    setTooltip({ show:true, text, x: rect.left-parentRect.left+rect.width/2, y: rect.top-parentRect.top-36 })
  }
  const handleSquareLeave = () => setTooltip(p => ({...p, show:false}))

  /* ── Simulation git push ── */
  const runPushSimulation = () => {
    if (isPushing) return
    setIsPushing(true); setTerminalLines([])
    const lines = [
      'wthomasss06-stack@desktop:~$ git add .',
      'wthomasss06-stack@desktop:~$ git commit -m "feat: design interactive stats grid"',
      'wthomasss06-stack@desktop:~$ git push origin main',
      'Enumerating objects: 7, done.',
      'Counting objects: 100% (7/7), done.',
      'Compressing objects: 100% (4/4), done.',
      'Writing objects: 100% (4/4), 485 bytes | 485.00 KiB/s, done.',
      `To github.com:${GH_USER}/elvis-portfolio.git`,
      '   7c28fb3..9a28cd1  main -> main',
      'wthomasss06-stack@desktop:~$ _',
    ]
    let cur = 0
    const next = () => {
      if (cur < lines.length) {
        setTerminalLines(p => [...p, lines[cur++]])
        setTimeout(next, cur<=3 ? 600 : 250)
      } else {
        setIsPushing(false)
        setLogs(p => [{ id:Date.now(), time:"À l'instant", repo:'elvis-portfolio', msg:'feat: design interactive stats grid', commits:1 }, ...p])
      }
    }
    setTimeout(next, 200)
  }

  const months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

  /* helper stat display */
  const statVal = (v, suffix = '') => {
    if (ghLoading) return <span className="gh-stat-skeleton" />
    if (v === null || v === undefined) return <span style={{color:'var(--muted)',fontSize:'.85em'}}>—</span>
    return typeof v === 'number' ? v.toLocaleString('fr') + suffix : v
  }

  return (
    <div className="github-card-large">
      {/* ── HEADER ── */}
      <div className="github-card-large-header">
        <div className="github-card-large-logo">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display:'block' }}>
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <div>
            <h3 className="github-card-large-title">Activité GitHub</h3>
            <p className="github-card-large-user">
              <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noreferrer">@{GH_USER}</a>
              {ghUser && <span style={{ color:'var(--muted)', marginLeft:'8px', fontSize:'.62rem' }}>· {ghUser.public_repos} repos · {ghUser.followers} followers</span>}
            </p>
          </div>
          <span className="github-live-badge">
            <span className={`github-pulse${ghLoading ? ' loading' : ''}`} />
            {ghLoading ? 'Chargement…' : ghStats.totalContribs !== null ? 'Live' : 'Fallback'}
          </span>
        </div>

        <div className="github-card-large-tabs">
          {[['grid','Contributions'],['repos','Projets & Dépôts'],['feed','Flux de Commit']].map(([key,lbl])=>(
            <button key={key} className={`github-tab-btn${activeTab===key?' active':''}`} onClick={()=>setActiveTab(key)}>{lbl}</button>
          ))}
        </div>
      </div>

      <div className="github-card-large-body">

        {/* ── ONGLET GRILLE ── */}
        {activeTab === 'grid' && (
          <div className="github-tab-content-grid">
            <div className="github-stats-row">
              <div className="github-stat-item">
                <span className="github-stat-num">{statVal(ghStats.totalContribs)}</span>
                <span className="github-stat-lbl">Contributions 365j</span>
              </div>
              <div className="github-stat-item">
                <span className="github-stat-num">{statVal(ghStats.longestStreak, ' j.')}</span>
                <span className="github-stat-lbl">Série max</span>
              </div>
              <div className="github-stat-item">
                <span className="github-stat-num" style={{color:'var(--accent)'}}>{ghStats.topLang}</span>
                <span className="github-stat-lbl">Technologies favorites</span>
              </div>
              <div className="github-stat-item">
                <span className="github-stat-num">{statVal(ghStats.thisMonth, ' commits')}</span>
                <span className="github-stat-lbl">Mois en cours</span>
              </div>
            </div>

            <div className="github-grid-scroll-wrapper">
              <div className="github-months-row">
                {months.map((m,idx)=>(
                  <span key={idx} className="github-month-lbl">{m}</span>
                ))}
              </div>
              <div className="github-grid-container">
                <div className="github-grid-days">
                  <span>Dim</span><span></span><span>Mar</span><span></span><span>Jeu</span><span></span><span>Sam</span>
                </div>
                {contributions.length > 0 ? (
                  <div className="github-grid">
                    {contributions.map((day,idx)=>(
                      <div
                        key={idx}
                        className={`github-square level-${day.level}`}
                        onMouseEnter={(e)=>handleSquareHover(e,day)}
                        onMouseLeave={handleSquareLeave}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="github-grid-skeleton">
                    {Array.from({length: 371}).map((_,i) => (
                      <div key={i} className="github-square-skeleton" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {ghStats.totalContribs === null && !ghLoading && (
              <div className="gh-api-notice">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                API GitHub temporairement indisponible · grille générée localement
              </div>
            )}

            <div className="github-grid-footer">
              <span>Survolez les carrés pour voir le détail · données GitHub en temps réel</span>
              <div className="github-legend">
                <span>Moins</span>
                {[0,1,2,3,4].map(l=><div key={l} className={`github-square level-${l}`}/>)}
                <span>Plus</span>
              </div>
            </div>
          </div>
        )}

        {/* ── ONGLET REPOS ── */}
        {activeTab === 'repos' && (
          <div className="github-tab-content-repos">
            {ghLoading ? (
              <div style={{ textAlign:'center', padding:'2rem', color:'var(--muted)', fontFamily:"'Space Mono',monospace", fontSize:'.7rem' }}>
                Chargement des dépôts GitHub…
              </div>
            ) : (ghRepos.length > 0 ? ghRepos : [
              { name:'ShopCI',       description:'Marketplace E-commerce locale avec intégration mobile money.',  stargazers_count:14, forks_count:4,  language:'JavaScript' },
              { name:'TerraSafe',    description:"Plateforme foncière de prévention des risques d'arnaque.",       stargazers_count:8,  forks_count:2,  language:'Python' },
              { name:'AKATech',      description:'Site officiel de mon agence digitale. Responsive + animations.', stargazers_count:21, forks_count:5,  language:'TypeScript' },
              { name:'chap-chapMAP', description:"Cartographie interactive pour l'itinéraire et la livraison.",    stargazers_count:5,  forks_count:1,  language:'JavaScript' },
            ]).map((repo,i)=>{
              const langColor = { JavaScript:'#f1e05a', Python:'#3572A5', TypeScript:'#2b7489', HTML:'#e34c26', CSS:'#563d7c' }
              const pct = { JavaScript:'100% JS', Python:'55% Py / 45% HTML', TypeScript:'90% TS / 10% CSS', HTML:'100% HTML' }
              const color = langColor[repo.language] || '#FF5500'
              return (
                <div key={i} className="github-repo-card">
                  <div className="github-repo-header">
                    <span className="github-repo-name">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ display:'inline', marginRight:'6px', verticalAlign:'text-top' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                      {repo.html_url
                        ? <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ color:'inherit', textDecoration:'none' }}>{repo.name}</a>
                        : repo.name}
                    </span>
                    <div className="github-repo-stats">
                      <span>★ {repo.stargazers_count||0}</span>
                      <span>⌥ {repo.forks_count||0}</span>
                    </div>
                  </div>
                  <p className="github-repo-desc">{repo.description}</p>
                  <div className="github-repo-lang-bar">
                    <div className="github-repo-lang-progress" style={{ width:'70%', background:color }} />
                  </div>
                  <div className="github-repo-footer">
                    <span>{repo.language || 'Web'}</span>
                    <span>{pct[repo.language] || '—'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── ONGLET FLUX COMMIT ── */}
        {activeTab === 'feed' && (
          <div className="github-tab-content-feed">
            <div className="github-feed-left">
              <div className="github-logs-list">
                {logs.map((log)=>(
                  <div key={log.id} className="github-log-item">
                    <div className="github-log-meta">
                      <span className="github-log-repo">{GH_USER}/{log.repo}</span>
                      <span className="github-log-time">{log.time}</span>
                    </div>
                    <p className="github-log-msg">{log.msg}</p>
                    <span className="github-log-commits-count">{log.commits} commit{log.commits>1?'s':''} pushed</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="github-feed-right">
              <div className="github-terminal">
                <div className="github-terminal-header">
                  <div className="github-terminal-dots">
                    <span className="dot-red"/><span className="dot-yellow"/><span className="dot-green"/>
                  </div>
                  <span className="github-terminal-title">bash - {GH_USER}@github:~</span>
                </div>
                <div className="github-terminal-body">
                  <div className="github-terminal-welcome">Prêt pour la simulation de commit en direct.</div>
                  {terminalLines.map((line,idx)=>(<div key={idx} className="github-terminal-line">{line}</div>))}
                  {isPushing && <div className="github-terminal-cursor"/>}
                </div>
              </div>
              <button className="github-push-btn" onClick={runPushSimulation} disabled={isPushing}>
                {isPushing ? 'Pushing to GitHub...' : 'Simuler un Git Push en direct'}
              </button>
            </div>
          </div>
        )}
      </div>

      {tooltip.show && (
        <div className="github-tooltip" style={{ left:tooltip.x, top:tooltip.y }}>
          {tooltip.text}
          <div className="github-tooltip-arrow"/>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════
   CONTACT
   ════════════════════════════════════════════ */
function ContactSection({ onToast }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [btnTxt, setBtnTxt] = useState('Envoyer le message')

  const handleSubmit = async e => {
    e.preventDefault(); setSending(true); setBtnTxt('Envoi en cours…')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          projectType: e.target.projectType.value,
          message: e.target.message.value,
          company: e.target.company.value, // honeypot anti-spam — doit rester vide
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const firstFieldError = data?.fieldErrors && Object.values(data.fieldErrors)[0]
        throw new Error(firstFieldError || data?.error || 'Erreur serveur')
      }
      setSent(true); onToast()
    } catch (err) {
      setBtnTxt(err?.message ? `${err.message}` : 'Erreur — WhatsApp : +225 01 42 50 77 50')
      setTimeout(() => { setBtnTxt('Envoyer le message'); setSending(false) }, 4000)
    }
  }

  /* Animated Beam */
  useEffect(() => {
    const container = document.getElementById('coj-container')
    const svg = document.getElementById('coj-svg')
    const centerEl = document.getElementById('cojn-center')
    if (!container || !svg || !centerEl) return
    const nodeIds = ['cojn-github', 'cojn-linkedin', 'cojn-facebook', 'cojn-whatsapp', 'cojn-akatech', 'cojn-gmail', 'cojn-uvci', 'cojn-cv']
    const colors = ['#FF5500', '#ff7733', '#FF5500', '#ffaa44', '#FF5500', '#ff7733', '#ffaa44', '#FF5500']
    const phases = [0, 0.37, 0.74, 1.11, 1.48, 1.85, 2.22, 2.59]
    let paths = [], animating = false, started = false, startTime = null
    const DURATION = 2400
    const getCenter = el => { const cr = container.getBoundingClientRect(), er = el.getBoundingClientRect(); return { x: er.left - cr.left + er.width / 2, y: er.top - cr.top + er.height / 2 } }
    const buildPaths = () => {
      svg.querySelectorAll('.coj-anim-path,.coj-base-path').forEach(p => p.remove()); paths = []
      const target = getCenter(centerEl.querySelector('.coj-node-circle'))
      nodeIds.forEach((id, i) => {
        const el = document.getElementById(id); if (!el) return
        const src = getCenter(el.querySelector('.coj-node-circle'))
        const mx = (src.x + target.x) / 2, my = (src.y + target.y) / 2, dx = target.x - src.x, dy = target.y - src.y, perp = i % 2 === 0 ? 1 : -1
        const d = `M ${src.x} ${src.y} Q ${mx - dy * 0.18 * perp} ${my + dx * 0.18 * perp} ${target.x} ${target.y}`
        const base = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        base.setAttribute('d', d); base.setAttribute('class', 'coj-base-path'); base.setAttribute('fill', 'none'); base.setAttribute('stroke', colors[i]); base.setAttribute('stroke-width', '1.2'); base.setAttribute('stroke-dasharray', '4 8'); base.setAttribute('opacity', '0.12')
        svg.appendChild(base)
        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        anim.setAttribute('d', d); anim.setAttribute('class', 'coj-anim-path'); anim.setAttribute('fill', 'none'); anim.setAttribute('stroke', colors[i]); anim.setAttribute('stroke-width', '2.5'); anim.setAttribute('stroke-linecap', 'round'); anim.setAttribute('opacity', '0')
        svg.appendChild(anim)
        const len = anim.getTotalLength(); anim.setAttribute('stroke-dasharray', `${len * 0.18} ${len}`)
        paths.push({ anim, len, phase: phases[i] })
      })
    }
    const loop = ts => {
      if (!animating) { requestAnimationFrame(loop); return }
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      paths.forEach(p => { const t = ((elapsed / DURATION) + p.phase) % 1; p.anim.style.strokeDashoffset = String(-p.len * t); p.anim.setAttribute('opacity', (Math.sin(t * Math.PI) * 0.9).toFixed(3)) })
      requestAnimationFrame(loop)
    }
    const obs = new IntersectionObserver(entries => { entries.forEach(e => { animating = e.isIntersecting; if (animating && !started) { started = true; buildPaths(); requestAnimationFrame(loop) } }) }, { threshold: 0.1 })
    obs.observe(container)
    let rt; const onResize = () => { clearTimeout(rt); rt = setTimeout(buildPaths, 120) }; window.addEventListener('resize', onResize)
    return () => { obs.disconnect(); window.removeEventListener('resize', onResize) }
  }, [])

  const nodeLinks = [
    { id: 'cojn-github', href: 'https://github.com/wthomasss06-stack', label: 'GitHub', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg> },
    { id: 'cojn-linkedin', href: 'https://www.linkedin.com/in/m-bollo-aka-60a1b1340/', label: 'LinkedIn', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7H10V9h4v2a6 6 0 0 1 6-3z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
    { id: 'cojn-facebook', href: 'https://web.facebook.com/profile.php?id=61577494705852', label: 'Facebook', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
    { id: 'cojn-whatsapp', href: 'https://wa.me/2250142507750', label: 'WhatsApp', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /></svg> },
    { id: 'cojn-akatech', href: 'https://akatech.vercel.app/', label: 'AKATech', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" /></svg> },
    { id: 'cojn-gmail', href: 'mailto:wthomasss06@gmail.com', label: 'Gmail', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg> },
    { id: 'cojn-uvci', href: 'https://uvci.edu.ci/', label: 'UVCI', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round"><path d="M2 10l10-7 10 7v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
    { id: 'cojn-cv', href: '/assets/CV_MBOLLO_AKA_ELVIS.pdf', label: 'Mon CV', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> },
  ]

  return (
    <section id="contact">
      <div className="sec-eyebrow" style={{ textAlign: 'center' }}>// Collaborons</div>
      <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: 0 }}>
        <ScrollReveal>Transformons</ScrollReveal>{' '}
        <ScrollReveal>votre&nbsp;idée.</ScrollReveal>
      </h2>

      {/* GitHub Large Interactive Card */}
      <div className="github-card-large-wrapper">
        <GitHubInteractiveCard />
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-status-badge"><span className="cdot" /><span>Disponible maintenant</span></div>
          <div className="code-block">
            <div className="code-hd"><span className="cd" /><span className="cy" /><span className="cg" /><span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.62rem', color: 'var(--muted)', marginLeft: '8px' }}>contact.js</span></div>
            <div className="code-body">
              <div><span className="ck">const</span> [<span className="cv">responseTime</span>] = <span className="cs">"&lt;24h"</span>;</div>
              <div><span className="ck">const</span> [<span className="cv">availability</span>] = <span className="cs">"100%"</span>;</div>
              <div><span className="ck">const</span> [<span className="cv">status</span>] = <span className="cs">"ready"</span>;</div>
              <div><span className="cc">// ↗ Prêt pour de nouveaux défis !</span></div>
            </div>
          </div>
          {[
            { href: 'tel:+2250142507750', text: '+225 01 42 50 77 50', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.86 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 8.66a16 16 0 006.29 6.29l1.02-1.02a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg> },
            { href: 'mailto:wthomasss06@gmail.com', text: 'wthomasss06@gmail.com', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg> },
          ].map((item, i) => (
            <div key={i} className="contact-item" style={{ marginTop: i === 0 ? '1.8rem' : 0 }}>
              <div className="c-icon">{item.svg}</div>
              <a href={item.href} style={{ color: 'var(--muted)' }}>{item.text}</a>
            </div>
          ))}
          <div className="contact-item">
            <div className="c-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
            <span style={{ color: 'var(--muted)' }}>Abidjan, Côte d'Ivoire</span>
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontSize: '1.2rem', fontWeight: 800, marginBottom: '.5rem' }}>Envoyez-moi un message</h3>
          <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>Remplissez le formulaire et je vous réponds rapidement.</p>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,85,0,.12)', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                <AnimIcon type="check" size={28} color="#FF5500" />
              </div>
              <p style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontWeight: 700, marginBottom: '.5rem' }}>Message envoyé !</p>
              <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>Je vous réponds sous 24h. <AnimIcon type="rocket" size={14} /></p>
            </div>
          ) : (
            <form id="contact-form" onSubmit={handleSubmit}>
              {/* Honeypot anti-spam : invisible pour un humain, souvent rempli par les bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none', left: '-9999px' }}
              />
              <div className="form-row">
                <div className="form-field"><label>Nom complet *</label><input type="text" name="name" placeholder="Jean Kouassi" required /></div>
                <div className="form-field"><label>Email *</label><input type="email" name="email" placeholder="jean@exemple.com" required /></div>
              </div>
              <div className="form-field">
                <label>Type de projet *</label>
                <select name="projectType" required>
                  <option value="">Sélectionnez votre besoin…</option>
                  <option value="site-vitrine">Site Vitrine</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="application-web">Application Web / SaaS</option>
                  <option value="api">API / Backend</option>
                  <option value="dashboard">Dashboard / Data</option>
                  <option value="maintenance">Maintenance / Support</option>
                  <option value="recrutement">Candidature spontanée</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="form-field">
                <label>Message *</label>
                <textarea name="message" rows="6" placeholder="Décrivez votre projet ou opportunité…" required />
              </div>
              <button type="submit" id="cf-submit" className="btn-fill" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '.82rem', gap: '.6rem' }} disabled={sending}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                <span>{btnTxt}</span>
              </button>
              <div className="form-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                Vos données sont sécurisées et ne seront jamais partagées.
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Animated Beam */}
      <div id="ou-me-joindre" className="coj-wrap">
        <div className="sec-eyebrow" style={{ textAlign: 'center', marginBottom: '1rem' }}>// Où me joindre</div>
        <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <ScrollReveal>Restons</ScrollReveal>{' '}
          <ScrollReveal>connectés.</ScrollReveal>
        </h2>
        <div className="coj-beam-outer" style={{ maxWidth: '1100px' }}>
          <div className="coj-beam-container" id="coj-container" style={{ height: '620px' }}>
            <svg className="coj-beam-svg" id="coj-svg" xmlns="http://www.w3.org/2000/svg" />
            <div className="coj-beam-grid">
              <div className="coj-beam-row">
                {nodeLinks.slice(0, 4).map(n => (
                  <a key={n.id} id={n.id} href={n.href} target="_blank" rel="noreferrer" className="coj-node-link">
                    <div className="coj-node-circle">{n.icon}</div>
                    <span className="coj-node-label">{n.label}</span>
                  </a>
                ))}
              </div>
              {/* Centre — logo image (v7) */}
              <div className="coj-beam-row" style={{ justifyContent: 'center' }}>
                <div id="cojn-center" className="coj-node-center-wrap coj-node-link" style={{ pointerEvents: 'none' }}>
                  <div className="coj-node-circle coj-node-main">
                    <img src="/assets/images/logo-akatech.png" alt="AKATech" className="coj-center-logo"
                      style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '50%' }}
                      onError={e => { e.target.style.display = 'none' }} />
                  </div>
                  <span className="coj-node-label">AKATech</span>
                </div>
              </div>
              <div className="coj-beam-row">
                {nodeLinks.slice(4).map(n => (
                  <a key={n.id} id={n.id} href={n.href} target={n.href.startsWith('mailto') || n.href.startsWith('/') ? '_self' : '_blank'} rel="noreferrer" className="coj-node-link">
                    <div className="coj-node-circle">{n.icon}</div>
                    <span className="coj-node-label">{n.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════
   FOOTER — simplifié v7 : QR centré + AKATECH MASSIF
   ════════════════════════════════════════════ */


function Footer() {

  /* AKATECH massif — observer pour fade-in du wrapper iridescent */
  useEffect(() => {
    const wrap = document.querySelector('.ft-aka-wrap')
    if (!wrap) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => wrap.classList.toggle('visible', e.isIntersecting))
    }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' })
    obs.observe(wrap)
    return () => obs.disconnect()
  }, [])

  return (
    <footer id="main-footer">
      <div className="ft-inner">

        {/* ── Section principale : QR + CV centré ── */}
        <div className="ft-main-block">

          {/* Carte QR + CV — centrée */}
          <div className="ft-cv-card-centered">
            <div className="ft-qr-col">
              <div className="ft-qr-wrap">
                <img
                  src="/assets/images/qrcodeCV.png"
                  alt="QR Code CV"
                  className="ft-qr-img"
                  onError={e => { e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=https://akatech.vercel.app/' }}
                />
                <div className="ft-qr-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                  </svg>
                  Scanner
                </div>
              </div>
            </div>
            <div className="ft-cv-info">
              <span className="ft-cv-eyebrow">// document</span>
              <h4 className="ft-cv-title">Télécharger<br />mon CV</h4>
              <p className="ft-cv-sub">Scannez le QR code ou cliquez ci-dessous</p>
              <a href="/assets/CV_MBOLLO_AKA_ELVIS.pdf" download className="btn-fill ft-dl-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Télécharger CV
              </a>
            </div>
          </div>

        </div>{/* /ft-main-block */}

        {/* Séparateur */}
        <div style={{ height: '1px', background: 'rgba(255,85,0,.1)', margin: '3rem 0 0' }} />
      </div>

      {/* AKATECH massif — Iridescence clippée dans les lettres via CSS mask */}
      <div className="ft-aka-wrap">
        {/* Canvas iridescent en fond — même config que le hero */}
        <div className="ft-aka-canvas">
          <Iridescence color={[1.0, 0.333, 0.0]} speed={0.8} amplitude={0.10} mouseReact={true} />
        </div>
        {/* Le masque est appliqué via CSS mask-image inline dans .ft-aka-wrap */}
      </div>

      {/* Barre de bas */}
      <div className="ft-bottom">
        <span>© 2026 — M'Bollo Aka Elvis · <a href="https://akatech.vercel.app/" target="_blank" rel="noreferrer">AKATech</a> · Abidjan</span>
        <span style={{ color: 'rgba(255,255,255,.15)' }}>·</span>
        <a href="https://akatech.vercel.app/" target="_blank" rel="noreferrer">akatech.vercel.app</a>
      </div>
    </footer>
  )
}



/* ════════════════════════════════════════════
   SCROLL TOP ROCKET — Web Audio Engine complet
   ════════════════════════════════════════════ */
function ScrollTopBtn() {
  const [visible, setVisible] = useState(false)
  const [launching, setLaunching] = useState(false)

  const audioCtxRef = useRef(null)
  const engineNodesRef = useRef(null)
  const masterGainRef = useRef(null)

  /* Visible quand le footer entre dans le viewport */
  useEffect(() => {
    const footer = document.getElementById('main-footer')
    if (!footer) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => setVisible(e.isIntersecting)),
      { root: null, threshold: 0.05 }
    )
    obs.observe(footer)
    return () => obs.disconnect()
  }, [])

  /* ── Helpers Audio ── */
  const getCtx = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed')
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume()
    return audioCtxRef.current
  }

  const makeNoise = ctx => {
    const sz = ctx.sampleRate * 2
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf; src.loop = true
    return src
  }

  /* Démarre le ronronnement moteur au hover */
  const startEngine = () => {
    if (engineNodesRef.current) return
    try {
      const ctx = getCtx(), now = ctx.currentTime
      /* Master gain — fade-in */
      const master = ctx.createGain()
      master.gain.setValueAtTime(0, now)
      master.gain.linearRampToValueAtTime(1, now + 0.25)
      master.connect(ctx.destination)
      masterGainRef.current = master

      /* Grondement bas — bruit filtré passe-bas */
      const ng = makeNoise(ctx)
      const fg = ctx.createBiquadFilter(); fg.type = 'lowpass'; fg.frequency.value = 140; fg.Q.value = 0.9
      const gg = ctx.createGain(); gg.gain.value = 0.55
      ng.connect(fg); fg.connect(gg); gg.connect(master); ng.start()

      /* Jet — bruit bande passante */
      const nj = makeNoise(ctx)
      const fj = ctx.createBiquadFilter(); fj.type = 'bandpass'; fj.frequency.value = 480; fj.Q.value = 0.7
      const gj = ctx.createGain(); gj.gain.value = 0.40
      nj.connect(fj); fj.connect(gj); gj.connect(master); nj.start()

      /* Oscillateur sawtooth — vrombissement */
      const osc = ctx.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = 48
      const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 3.5
      const lg = ctx.createGain(); lg.gain.value = 7
      lfo.connect(lg); lg.connect(osc.frequency); lfo.start()
      const ws = ctx.createWaveShaper()
      const cv2 = new Float32Array(512)
      for (let i = 0; i < 512; i++) {
        const x = (i * 2) / 512 - 1
        cv2[i] = (3 + 200) * x / (Math.PI + 200 * Math.abs(x))
      }
      ws.curve = cv2; ws.oversample = '4x'
      const og = ctx.createGain(); og.gain.value = 0.32
      osc.connect(ws); ws.connect(og); og.connect(master); osc.start()

      /* Sub-bass */
      const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = 28
      const sg = ctx.createGain(); sg.gain.value = 0.38
      sub.connect(sg); sg.connect(master); sub.start()

      engineNodesRef.current = [ng, nj, osc, lfo, sub]
    } catch (e) { /* AudioContext non supporté */ }
  }

  /* Stoppe le moteur au mouse-leave */
  const stopEngine = () => {
    if (!engineNodesRef.current) return
    try {
      const ctx = getCtx(), now = ctx.currentTime
      masterGainRef.current.gain.cancelScheduledValues(now)
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now)
      masterGainRef.current.gain.linearRampToValueAtTime(0, now + 0.3)
      const nodes = engineNodesRef.current
      engineNodesRef.current = null
      setTimeout(() => nodes.forEach(n => { try { n.stop() } catch (_) { } }), 350)
    } catch (e) { engineNodesRef.current = null }
  }

  /* Son de lancement : Boom cosmique + Laser warp sweep */
  const playLaunch = () => {
    stopEngine()
    try {
      const ctx = getCtx(), now = ctx.currentTime

      /* Boom grave initial */
      const boom = ctx.createOscillator(); boom.type = 'sine'
      boom.frequency.setValueAtTime(140, now)
      boom.frequency.exponentialRampToValueAtTime(30, now + 0.22)
      const bg = ctx.createGain()
      bg.gain.setValueAtTime(0.7, now)
      bg.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      boom.connect(bg); bg.connect(ctx.destination)
      boom.start(now); boom.stop(now + 0.3)

      /* UFO alien laser synthesizer sweep */
      const ufoOsc = ctx.createOscillator(); ufoOsc.type = 'triangle'
      ufoOsc.frequency.setValueAtTime(150, now)
      ufoOsc.frequency.exponentialRampToValueAtTime(1800, now + 1.2)
      
      const lfo = ctx.createOscillator(); lfo.frequency.value = 24 // Fast cosmic wobble
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 140
      
      lfo.connect(lfoGain); lfoGain.connect(ufoOsc.frequency)
      
      const ufoGain = ctx.createGain()
      ufoGain.gain.setValueAtTime(0, now)
      ufoGain.gain.linearRampToValueAtTime(0.5, now + 0.05)
      ufoGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3)
      
      ufoOsc.connect(ufoGain); ufoGain.connect(ctx.destination)
      lfo.start(now); ufoOsc.start(now)
      lfo.stop(now + 1.3); ufoOsc.stop(now + 1.3)

      /* Whoosh cosmique */
      const sz = Math.floor(ctx.sampleRate * 1.5)
      const nb = ctx.createBuffer(1, sz, ctx.sampleRate)
      const nd = nb.getChannelData(0)
      for (let i = 0; i < sz; i++) nd[i] = Math.random() * 2 - 1
      const ns = ctx.createBufferSource(); ns.buffer = nb
      const wf = ctx.createBiquadFilter(); wf.type = 'bandpass'
      wf.frequency.setValueAtTime(150, now)
      wf.frequency.exponentialRampToValueAtTime(3200, now + 1.2)
      wf.Q.value = 2.0
      const wg = ctx.createGain()
      wg.gain.setValueAtTime(0, now)
      wg.gain.linearRampToValueAtTime(0.4, now + 0.05)
      wg.gain.exponentialRampToValueAtTime(0.001, now + 1.4)
      ns.connect(wf); wf.connect(wg); wg.connect(ctx.destination)
      ns.start(now); ns.stop(now + 1.4)
    } catch (e) { /* AudioContext non supporté */ }
  }

  /* Particules de feux d'artifice cosmiques autour du bouton */
  const spawnParticles = btn => {
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div')
      p.className = 'st-particle'
      p.style.setProperty('--xo', `${(Math.random() - 0.5) * 35}px`)
      p.style.animationDelay = `${i * 0.08}s`
      btn.appendChild(p)
      setTimeout(() => p.remove(), 1000)
    }
  }

  /* Click : son + particules + scroll */
  const go = e => {
    playLaunch()
    spawnParticles(e.currentTarget)
    setLaunching(true)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setLaunching(false), 800)
    }, 300)
  }

  return (
    <button
      id="scroll-top-btn"
      className={`${visible ? 'st-vis' : ''}${launching ? ' st-launch' : ''}`}
      title="Téléportation vers le haut ! 🛸"
      aria-label="Retour en haut"
      onClick={go}
      onMouseEnter={startEngine}
      onMouseLeave={stopEngine}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--text)"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Rayon tracteur dynamique */}
        <polygon className="st-ufo-beam" points="12,14 2,24 22,24" fill="url(#beamGrad)" stroke="none" />

        <g className="st-ufo-g">
          {/* Dôme de pilotage */}
          <path d="M8 10c0-2.5 1.8-4 4-4s4 1.5 4 4" fill="var(--text)" fillOpacity=".25" />
          {/* Corps principal en soucoupe métallique */}
          <path d="M2 12c0-1.5 3-2.5 10-2.5s10 1 10 2.5-3 2.5-10 2.5-10-1-10-2.5z" fill="var(--accent)" />
          {/* Partie inférieure */}
          <path d="M5 12.5c0 1.2 2.8 2.2 7 2.2s7-1 7-2.2" />
          {/* Nœuds d'énergie lumineuse brutalistes */}
          <circle cx="7" cy="12.2" r="0.9" fill="var(--text)" stroke="none" />
          <circle cx="12" cy="12.7" r="0.9" fill="var(--text)" stroke="none" />
          <circle cx="17" cy="12.2" r="0.9" fill="var(--text)" stroke="none" />
        </g>
      </svg>

      {/* Rayon d'abduction hyper-lumineux au décollage */}
      <svg id="st-big-flames" className="st-ufo-launch-rays" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 100">
        <polygon points="20,0 0,100 40,100" fill="url(#beamGrad)" opacity="0.9" />
        <line x1="20" y1="0" x2="20" y2="100" stroke="var(--text)" strokeWidth="2.5" strokeDasharray="5,5" opacity="0.8" />
      </svg>
    </button>
  );
}

/* ════════════════════════════════════════════
   TOAST
   ════════════════════════════════════════════ */
function Toast({ show }) {
  return <div id="toast" className={show ? 'show' : ''}>Message envoyé ✓</div>
}

/* ════════════════════════════════════════════
   CURSOR + SCROLL BAR
   ════════════════════════════════════════════ */
function CursorAndScrollBar() {
  useEffect(() => {
    const dot = document.getElementById('cursor-dot'), fill = document.getElementById('scroll-fill')
    const onMouse = e => { if (dot) { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px' } }
    const onScroll = () => { const max = document.body.scrollHeight - window.innerHeight; if (fill) fill.style.height = ((window.scrollY / max) * 100) + '%' }
    const expand = () => { if (dot) { dot.style.width = '16px'; dot.style.height = '16px' } }
    const shrink = () => { if (dot) { dot.style.width = '8px'; dot.style.height = '8px' } }
    document.querySelectorAll('a,button,[role=button]').forEach(el => { el.addEventListener('mouseenter', expand); el.addEventListener('mouseleave', shrink) })
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('mousemove', onMouse); window.removeEventListener('scroll', onScroll) }
  }, [])
  return null
}

/* ════════════════════════════════════════════
   APP PRINCIPALE
   ════════════════════════════════════════════ */
export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('aka-html-theme')
    if (saved) return saved
    return new Date().getHours() >= 6 && new Date().getHours() < 18 ? 'light' : 'dark'
  })
  const [toastVisible, setToastVisible] = useState(false)

  /* nav-loading masque la navbar pendant le loader */
  useEffect(() => {
    document.body.classList.add('nav-loading')
    return () => { document.body.classList.remove('nav-loading') }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light')
  }, [theme])

  const handleLoaderDone = useCallback(() => {
    /* Appelé par GSAP onComplete après l'animation scale-slide.
       On ajoute juste la classe CSS — React ne démonte pas le Loader,
       le CSS le cache (opacity:0, visibility:hidden). Pas de removeChild. */
    document.body.classList.remove('nav-loading')
    const loaderEl = document.getElementById('loader')
    if (loaderEl) {
      loaderEl.classList.add('loaded')
    }

    /* ── Nav pills entrance ── */
    const pills = document.querySelectorAll('.nb-nav-link')
    if (pills.length) {
      gsap.fromTo(
        pills,
        { y: 28, opacity: 0, scale: 0.82 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.55,
          ease: 'back.out(1.8)',
          stagger: 0.07,
          delay: 0.18,
          clearProps: 'transform',
        }
      )
    }

    /* ── Bottombar container slide-up ── */
    const bar = document.querySelector('.nb-bottombar')
    if (bar) {
      gsap.fromTo(
        bar,
        { y: 56, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.08 }
      )
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next); localStorage.setItem('aka-html-theme', next)
  }

  const showToast = () => { setToastVisible(true); setTimeout(() => setToastVisible(false), 3000) }

  /* GSAP global hooks */
  useScrollAnimations()
  useMagneticButtons()
  useSplitTextReveal()

  /* Son de touche — système oscar */
  const { muted, toggleMute } = useSoundSystem()

  return (
    <>
      <Loader onDone={handleLoaderDone} />
      <div id="cursor-dot" />
      <div id="scroll-bar"><div id="scroll-fill" /></div>
      <CursorAndScrollBar />
      <Toast show={toastVisible} />
      <SoundToggle muted={muted} onToggle={toggleMute} />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <StickyStack />
        <HorizontalParallax />
        <Marquee />
        <FeaturedCreationDesktop />
        <About />
        <Timeline />
        <SkewSection />
        <SkillsSection />
        <ShowcaseSection />
        <PricingSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection onToast={showToast} />
        <Footer />
      </main>
      <ScrollTopBtn />
    </>
  )
}
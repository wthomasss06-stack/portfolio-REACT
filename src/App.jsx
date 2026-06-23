import { useState, useEffect, useRef, useCallback } from 'react'
import './style.css'
import Shuffle from './components/Shuffle.jsx'
import AnimatedCounter from './components/AnimatedCounter.jsx'
import ScrollReveal from './components/ScrollReveal.jsx'
import TargetCursor from './components/TargetCursor.jsx'
import TextPressure from './components/TextPressure.jsx'
import Beams from './components/Beams.jsx'
import InfiniteMenu from './components/InfiniteMenu.jsx'
import './components/InfiniteMenu.css'
import { useSoundSystem } from './components/useClickSound.js'
import SoundToggle from './components/SoundToggle.jsx'
import { runGridTransition, useGooeyTransition } from './components/GooeyTransition.jsx'
import ImageTrail from './components/ImageTrail.jsx'
import Lanyard from './components/Lanyard.jsx'
import CardSwap, { Card } from './components/CardSwap.jsx'
import Stack from './components/Stack.jsx'
import FlowingMenu from './components/FlowingMenu.jsx'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StaggeredMenu from './components/StaggeredMenu.jsx'
gsap.registerPlugin(ScrollTrigger)

/* ════════════════════════════════════════════
 NAV_LINKS — source unique des liens de navigation.
 Utilisé par le drawer hamburger (Navbar) ET par le
 footer (Footer), pour qu'ils ciblent TOUJOURS les
 mêmes id de section, avec le même libellé. Ne plus
 dupliquer cette liste ailleurs dans le fichier.
 ════════════════════════════════════════════ */
const NAV_LINKS = [
 { id: 'hero', label: 'Accueil', num: '00', sub: 'M\'Bollo Aka Elvis' },
 { id: 'projets-section', label: 'Projets', num: '01', sub: '18 réalisations' },
 { id: 'about-section', label: 'À propos', num: '02', sub: 'Parcours & stack' },
 { id: 'process-section', label: 'Process', num: '03', sub: 'De l\'acompte à la livraison' },
 { id: 'faq-section', label: 'FAQ', num: '04', sub: 'Questions fréquentes' },
 { id: 'contact', label: 'Contact', num: '05', sub: 'Discutons de ton projet' },
]

/* ════════════════════════════════════════════
 SH CYCLE-TEXT — même mécanique que le Menu/Close
 du StaggeredMenu (textCycleAnim) : pile de lignes
 dans un viewport overflow:hidden, on glisse en
 yPercent pour atterrir sur le texte final. Ici on
 "scramble" les caractères avant l'atterrissage.
 ════════════════════════════════════════════ */
const SH_GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#+*/=<>'

function shScrambleLine(text) {
 return text.split('').map(ch => (
 /[a-zA-Z0-9]/.test(ch) ? SH_GLITCH_CHARS[Math.floor(Math.random() * SH_GLITCH_CHARS.length)] : ch
 )).join('')
}

function shBuildCycleSequence(opening, finalText, cycles = 3) {
 // opening (entrée section)  → atterrit sur le texte réel
 // closing (sortie section)  → atterrit sur une ligne glitch (texte qui se "dissout")
 const landing = opening ? finalText : shScrambleLine(finalText)
 const start   = opening ? shScrambleLine(finalText) : finalText
 const seq     = [start]
 for (let i = 0; i < cycles; i++) seq.push(shScrambleLine(finalText))
 seq.push(landing)
 seq.push(landing)
 return seq
}

/* Variante sans scramble — même texte répété, pure mécanique de défilement yPercent */
function shBuildPlainSequence(finalText, cycles = 3) {
 const seq = []
 for (let i = 0; i < cycles + 2; i++) seq.push(finalText)
 return seq
}

/* Hook : une ligne de texte qui "roule" (yPercent)
   scramble=true  → glitch chars (pour sh-sub)
   scramble=false → même texte en boucle (pour sh-title) */
function useSHCycleText(text, scramble = true) {
 const innerRef = useRef(null)
 const tweenRef = useRef(null)
 const [lines, setLines] = useState([text])

 const play = useCallback((opening = true) => {
 if (!text) return
 tweenRef.current?.kill()
 const seq = scramble
   ? shBuildCycleSequence(opening, text, 3)
   : shBuildPlainSequence(text, 3)
 setLines(seq)
 requestAnimationFrame(() => {
 const inner = innerRef.current
 if (!inner) return
 gsap.set(inner, { yPercent: 0 })
 const finalShift = ((seq.length - 1) / seq.length) * 100
 tweenRef.current = gsap.to(inner, {
 yPercent: -finalShift,
 duration: 0.5 + seq.length * 0.07,
 ease: 'power4.out',
 overwrite: 'auto',
 })
 })
 }, [text, scramble])

 return { innerRef, lines, play }
}

/* ════════════════════════════════════════════
 SH GHOST SCROLL — texte fantôme en contour (stroke)
 superposé au titre de section. Même mécanique que
 useSHCycleText (scramble → cycle → texte final,
 sens inverse à la sortie), piloté par le MÊME
 IntersectionObserver que titleCyc/subCyc — se
 déclenche à l'entrée/sortie du viewport, pas au hover.
 ════════════════════════════════════════════ */
function useSHGhostScroll(text, cycles = 3) {
 const innerRef = useRef(null)
 const tweenRef = useRef(null)
 const [lines, setLines] = useState([text])

 const play = useCallback((opening = true) => {
 if (!text) return
 tweenRef.current?.kill()
 const seq = shBuildCycleSequence(opening, text, cycles)
 setLines(seq)
 requestAnimationFrame(() => {
 const inner = innerRef.current
 if (!inner) return
 gsap.set(inner, { yPercent: 0 })
 const finalShift = ((seq.length - 1) / seq.length) * 100
 tweenRef.current = gsap.to(inner, {
 yPercent: -finalShift,
 duration: 0.42 + seq.length * 0.055,
 ease: 'power4.out',
 overwrite: 'auto',
 })
 })
 }, [text, cycles])

 return { innerRef, lines, play }
}

/* ════════════════════════════════════════════
 HERO NAME CYCLE — même texte qui défile (plain)
 déclenché par IntersectionObserver sur le hero
 ════════════════════════════════════════════ */
function useSHNameCycle(text) {
 const innerRef    = useRef(null)
 const tweenRef    = useRef(null)
 const [lines, setLines] = useState([text])
 const hasEnteredRef     = useRef(false)

 const play = useCallback((opening = true) => {
   if (!text) return
   tweenRef.current?.kill()
   const seq = shBuildPlainSequence(text, 3)
   setLines(seq)
   requestAnimationFrame(() => {
     const inner = innerRef.current
     if (!inner) return
     gsap.set(inner, { yPercent: 0 })
     const finalShift = ((seq.length - 1) / seq.length) * 100
     tweenRef.current = gsap.to(inner, {
       yPercent: -finalShift,
       duration: 0.55 + seq.length * 0.08,
       ease: 'power4.out',
       overwrite: 'auto',
     })
   })
 }, [text])

 useEffect(() => {
   const el = innerRef.current?.closest('#hero')
   if (!el) return
   const io = new IntersectionObserver(entries => entries.forEach(entry => {
     if (entry.isIntersecting) { hasEnteredRef.current = true; play(true) }
     else if (hasEnteredRef.current) { play(false) }
   }), { threshold: 0.3 })
   io.observe(el)
   return () => io.disconnect()
 }, [play])

 return { innerRef, lines }
}

/* ════════════════════════════════════════════
 HERO ROTATING CYCLE — tourne en boucle auto
 entre plusieurs mots (scramble glitch chars)
 ════════════════════════════════════════════ */
function useSHRotatingCycle(texts, interval = 2500) {
 const innerRef    = useRef(null)
 const tweenRef    = useRef(null)
 const idxRef      = useRef(0)
 const [lines, setLines] = useState([texts[0]])

 const runCycle = useCallback(() => {
   const text = texts[idxRef.current]
   tweenRef.current?.kill()
   const seq = shBuildCycleSequence(true, text, 2)
   setLines(seq)
   requestAnimationFrame(() => {
     const inner = innerRef.current
     if (!inner) return
     gsap.set(inner, { yPercent: 0 })
     const finalShift = ((seq.length - 1) / seq.length) * 100
     tweenRef.current = gsap.to(inner, {
       yPercent: -finalShift,
       duration: 0.45 + seq.length * 0.06,
       ease: 'power4.out',
       overwrite: 'auto',
     })
   })
 }, [texts])

 useEffect(() => {
   runCycle()
   const timer = setInterval(() => {
     idxRef.current = (idxRef.current + 1) % texts.length
     runCycle()
   }, interval)
   return () => clearInterval(timer)
 }, [runCycle, texts, interval])

 return { innerRef, lines }
}

/* ════════════════════════════════════════════
 SECTION HEADING — num + titre + sous-titre
 Miroir visuel du drawer hamburger dans la page
 Titre/sous-titre se "décodent" (cycle-text) à
 chaque entrée de la section dans le viewport
 ════════════════════════════════════════════ */
function SectionHeading({ num, title, sub, subAs = 'p', className = '', style = {} }) {
 const Sub = subAs === 'h2' ? 'h2' : 'p'
 const wrapRef   = useRef(null)
 const titleCyc  = useSHCycleText(title, false)   // défile avec le même texte, sans glitch chars
 const subCyc    = useSHCycleText(sub,   true)    // garde le scramble de caractères
 const ghost     = useSHGhostScroll(title)        // ghost text en contour, même cycle entrée/sortie

 useEffect(() => {
 const el = wrapRef.current
 if (!el) return
 let hasEntered = false
 const io = new IntersectionObserver(
 entries => entries.forEach(entry => {
 if (entry.isIntersecting) {
 hasEntered = true
 titleCyc.play(true); subCyc.play(true); ghost.play(true)
 } else if (hasEntered) {
 // sortie de section (scroll monte ou descend) → cycle en sens inverse
 titleCyc.play(false); subCyc.play(false); ghost.play(false)
 }
 }),
 { threshold: 0.4, rootMargin: '0px 0px -10% 0px' }
 )
 io.observe(el)
 return () => io.disconnect()
 }, [titleCyc.play, subCyc.play, ghost.play])

 return (
 <div className={`sh-wrap ${className}`} style={style} ref={wrapRef}>
 <span className="sh-num">{num}</span>
 <div className="sh-body">
 <h2 className="sh-title">
 <span className="sh-cycle-wrap">
 <span className="sh-cycle-inner" ref={titleCyc.innerRef}>
 {titleCyc.lines.map((l, i) => <span className="sh-cycle-line" key={i}>{l}</span>)}
 </span>
 </span>
 {/* Ghost cycle — contour seul, couleur = fond du thème, suit le même cycle entrée/sortie viewport */}
 <span className="sh-title-ghost" aria-hidden="true">
 <span className="sh-cycle-wrap">
 <span className="sh-cycle-inner" ref={ghost.innerRef}>
 {ghost.lines.map((l, i) => <span className="sh-cycle-line" key={i}>{l}</span>)}
 </span>
 </span>
 </span>
 </h2>
 {sub && (
 <Sub className="sh-sub">
 <span className="sh-cycle-wrap">
 <span className="sh-cycle-inner" ref={subCyc.innerRef}>
 {subCyc.lines.map((l, i) => <span className="sh-cycle-line" key={i}>{l}</span>)}
 </span>
 </span>
 </Sub>
 )}
 </div>
 </div>
 )
}

/* ════════════════════════════════════════════
 ANIMATED SVG ICONS (replaces emojis)
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
 { word: 'REACT', color: '#61DAFB', icon: '/assets/icons/devicon/react/react-original.svg', label: 'Frontend Library' },
 { word: 'JAVASCRIPT', color: '#F7DF1E', icon: '/assets/icons/devicon/javascript/javascript-original.svg', label: 'Langage Universel' },
 { word: 'NEXT.JS', color: '#F2EDE8', lightColor: '#1A1A1A', icon: '/assets/icons/devicon/nextjs/nextjs-original.svg', label: 'React Framework' },
 { word: 'PYTHON', color: '#4B8BBE', icon: '/assets/icons/devicon/python/python-original.svg', label: 'Backend & Data' },
 { word: 'DJANGO', color: '#44B78B', icon: '/assets/icons/devicon/django/django-plain.svg', label: 'Web Framework' },
 { word: 'MYSQL', color: '#F29111', icon: '/assets/icons/devicon/mysql/mysql-original.svg', label: 'Base de Données' },
]

function HorizontalParallax() {
 const sectionRef = useRef(null)
 const trackRef = useRef(null)

 useEffect(() => {
 const section = sectionRef.current
 const track = trackRef.current
 if (!section || !track) return

 const headings = track.querySelectorAll('.hpx-word')
 const totalSlides = headings.length

 const update = () => {
 const rect = section.getBoundingClientRect()
 const sectionH = section.offsetHeight
 const viewH = window.innerHeight
 let progress = -rect.top / (sectionH - viewH)
 progress = Math.max(0, Math.min(1, progress))

 /* ── 1. Translation horizontale du carrousel ── */
 const maxVW = (totalSlides - 1) * 100
 track.style.transform = `translateX(-${progress * maxVW}vw)`

 /* ── 2. Parallax heading — chaque titre glisse en contre-sens ── */
 const seg = 1 / totalSlides
 headings.forEach((h, i) => {
 const start = i * seg
 const end = (i + 1) * seg
 let xOffset
 if (progress >= start && progress <= end) {
 const local = (progress - start) / seg // 0 → 1 dans la slide
 xOffset = 600 - local * 1200 // +600px → -600px
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
 {/* Zone sticky : l'écran reste figé, le carrousel glisse */}
 <div className="hpx-sticky">
 {/* Heading flottant en absolute DANS le sticky (hors flux) */}
 <div className="fcx-section-label">
 <SectionHeading num="02" title="Stack" sub="Meilleures armes" />
 </div>
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
 loading="lazy"
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
 '.gs-reveal, .gs-stagger, .gs-skill, .gs-title, .gs-card, .gs-timeline-item, .gs-counter, .gs-line, .about-text, .about-text-lg'
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
 /* ── About-text ScrollReveal — opacity + blur word-by-word ── */
 document.querySelectorAll('.about-text, .about-text-lg').forEach(el => {
 /* Évite le double-split si déjà traité */
 if (el.dataset.srSplit) return
 el.dataset.srSplit = '1'

 /* Découper en mots tout en préservant les balises strong/a/em */
 function wrapWordsInNode(node) {
 if (node.nodeType === Node.TEXT_NODE) {
 const text = node.textContent
 const fragment = document.createDocumentFragment()
 const parts = text.split(/(\s+)/)
 parts.forEach(part => {
 if (/^\s+$/.test(part)) {
 fragment.appendChild(document.createTextNode(part))
 } else if (part.length > 0) {
 const span = document.createElement('span')
 span.className = 'sr-word'
 span.textContent = part
 fragment.appendChild(span)
 }
 })
 node.parentNode.replaceChild(fragment, node)
 } else if (
 node.nodeType === Node.ELEMENT_NODE &&
 ['STRONG', 'A', 'EM', 'B', 'I'].includes(node.tagName)
 ) {
 const span = document.createElement('span')
 span.className = 'sr-word'
 node.parentNode.insertBefore(span, node)
 span.appendChild(node)
 } else if (node.nodeType === Node.ELEMENT_NODE) {
 Array.from(node.childNodes).forEach(wrapWordsInNode)
 }
 }
 Array.from(el.childNodes).forEach(wrapWordsInNode)

 const words = el.querySelectorAll('.sr-word')
 if (!words.length) return

 gsap.fromTo(
 words,
 { opacity: 0.08, filter: 'blur(5px)', y: 8 },
 {
 opacity: 1,
 filter: 'blur(0px)',
 y: 0,
 ease: 'none',
 stagger: 0.04,
 scrollTrigger: {
 trigger: el,
 start: 'top 90%',
 end: 'bottom 55%',
 scrub: 0.8,
 }
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

 /* Filet de sécurité : certains .about-text / .about-text-lg
 (ex. blocs plus bas dans la page) peuvent être montés après
 le premier passage ci-dessus. On retente le split + le
 ScrollTrigger.refresh() une fois la page bien stabilisée,
 sans toucher aux éléments déjà traités (dataset.srSplit). */
 const lateTimeoutId = setTimeout(() => {
 if (killed) return
 initAnimations()
 }, 1200)

 return () => {
 killed = true
 cancelAnimationFrame(rafId)
 clearTimeout(lateTimeoutId)
 ScrollTrigger.getAll().forEach(t => t.kill())
 }
 }, [])
}

/* ════════════════════════════════════════════
 DONNÉES
 ════════════════════════════════════════════ */
const PROJECTS = [
 { id: 1,  title: 'ShopCI',              sub: 'Marketplace E-commerce',          cat: 'en-ligne', img: '/assets/images/projects/monmarket-preview.webp',       responsive: '/assets/images/projects/shopci-responsive.webp',        imgFb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600',  tech: ['React', 'Django', 'Bootstrap 5', 'Vercel + PythonAnywhere'], url: 'https://shop-ci.vercel.app/',               desc: "Marketplace multi-vendeurs conçue pour répondre aux problèmes de fiabilité, de visibilité et de gestion des ventes dans le e-commerce local ivoirien.", year: '2024' },
 { id: 2,  title: 'TechFlow',            sub: 'Site Vitrine Professionnel',       cat: 'en-ligne', img: '/assets/images/projects/techflow-preview.webp',         responsive: '/assets/images/projects/techflow.webp',                  imgFb: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',  tech: ['HTML / Tailwind CSS', 'JavaScript', 'Vercel'],               url: 'https://techflow-ten.vercel.app/',          desc: 'Site vitrine moderne destiné à présenter une activité technologique de manière claire et professionnelle.', year: '2024' },
 { id: 3,  title: 'TerraSafe',           sub: 'Marketplace Foncière',             cat: 'en-ligne', img: '/assets/images/projects/terrasafe-preview.webp',        responsive: '/assets/images/projects/terrasafe.webp',                 imgFb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',  tech: ['Python/Flask', 'MySQL', 'JavaScript', 'Bootstrap 5'],        url: 'https://wthomassss06.pythonanywhere.com',   desc: "Plateforme foncière visant à réduire les risques d'arnaques liées à la vente de terrains. Backend sécurisé avec recherche avancée.", year: '2024' },
 { id: 4,  title: 'Chap-chapMAP',        sub: 'Navigation Intelligente',          cat: 'demo',     img: '/assets/images/projects/chapchapmap-preview.webp',      responsive: '/assets/images/projects/chapchapmap.webp',               imgFb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600',  tech: ['JavaScript', 'Leaflet.js', 'OSRM API', 'Geolocation API'],  url: '/demos/chap-chapMAP.html',                  desc: "Application de cartographie intelligente permettant de localiser un utilisateur en temps réel et de calculer des itinéraires optimisés.", year: '2023' },
 { id: 5,  title: 'ElvisMarket',         sub: 'Interface E-commerce',             cat: 'demo',     img: '/assets/images/projects/elvismarket-preview.webp',      responsive: '/assets/images/projects/elvismarket.webp',               imgFb: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600', tech: ['HTML + JS vanilla', 'Tailwind CSS', 'LocalStorage'],        url: '/demos/projet2.html',                       desc: "Interface e-commerce développée pour expérimenter la gestion d'état, le panier dynamique et l'optimisation de l'UX.", year: '2023' },
 { id: 6,  title: 'MonCashJour',         sub: 'Gestion de Ventes',                cat: 'demo',     img: '/assets/images/projects/moncashjour-preview.webp',      responsive: '/assets/images/projects/moncashjour.webp',               imgFb: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600', tech: ['HTML + JS vanilla', 'Tailwind CSS', 'Chart.js'],            url: '/demos/projet1.html',                       desc: 'Application de gestion de ventes quotidiennes destinée aux petits commerçants.', year: '2023' },
 { id: 7,  title: 'LivreurTrack Pro',    sub: 'Suivi Logistique',                 cat: 'demo',     img: '/assets/images/projects/livreurtrack-preview.webp',     responsive: '/assets/images/projects/livreurtrack.webp',              imgFb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', tech: ['JavaScript', 'Bootstrap 5', 'LocalStorage', 'Camera API'], url: '/demos/projet3.html',                       desc: "Système de suivi logistique simulant un workflow réel de livraison, avec validation par photo et suivi d'étapes.", year: '2023' },
 { id: 8,  title: 'LinkedIn Banner Pro', sub: 'Générateur SaaS',                  cat: 'en-cours', img: '/assets/images/projects/linkedin-banner-preview.webp',  responsive: '/assets/images/projects/linkedin-banner.webp',           imgFb: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600',  tech: ['JavaScript', 'Canvas API', 'Tailwind CSS'],                  url: '/demos/projet7.html',                       desc: 'Outil SaaS en cours de développement permettant de générer des bannières LinkedIn professionnelles.', year: '2025' },
 { id: 9,  title: 'Tati',               sub: 'Portfolio & Vitrine Moderne',       cat: 'en-ligne', img: '/assets/images/projects/tati-preview.webp',             responsive: '/assets/images/projects/tati.webp',                      imgFb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'],         url: 'https://tatii.vercel.app/',                 desc: 'Portfolio personnel double fonction avec animations fluides, thème sombre/clair, design 100% responsive.', year: '2024' },
 { id: 10, title: 'MK',                 sub: 'Portfolio Graphiste Client',        cat: 'en-ligne', img: '/assets/images/projects/mk-preview.webp',               responsive: '/assets/images/projects/mk.webp',                        imgFb: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600',  tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'],         url: 'https://mory01ff.vercel.app/',              desc: 'Portfolio professionnel sur-mesure pour un client graphiste. Galerie immersive, animations soignées.', year: '2024' },
 { id: 11, title: 'ManoBeat 777',       sub: 'Portfolio Beatmaker',               cat: 'en-ligne', img: '/assets/images/projects/beatstore-preview.webp',        responsive: '/assets/images/projects/beatstore.webp',                 imgFb: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', tech: ['React', 'Tailwind CSS', 'Howler.js', 'Vercel'],             url: 'https://xxx-x.vercel.app/',                 desc: "Portfolio d'un beatmaker ivoirien : découvrez et écoutez ses créations directement en ligne.", year: '2025' },
 { id: 12, title: 'New Horizon Service', sub: 'Location de Résidences',           cat: 'en-ligne', img: '/assets/images/projects/newhorizon-preview.webp',       responsive: '/assets/images/projects/newhorizon.webp',                imgFb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600',  tech: ['Next.js', 'Flask', 'Python', 'MySQL', 'Vercel'],            url: 'https://new-horizonservice.vercel.app/',    desc: 'Plateforme de location de résidences meublées haut de gamme avec backend Flask sécurisé.', year: '2025' },
 { id: 13, title: 'AKATech',            sub: 'Agence Digitale Abidjan',           cat: 'en-ligne', img: '/assets/images/projects/akatech-preview.webp',          responsive: '/assets/images/projects/akatech.webp',                   imgFb: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600', tech: ['Next.js 15', 'Framer Motion', 'WebGL Aurora', 'Vercel'],   url: 'https://akatech.vercel.app/',               desc: "Site officiel de mon agence — AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire.", year: '2025' },
 { id: 14, title: 'Université les Anges', sub: 'Site Institutionnel',             cat: 'en-ligne', img: '/assets/images/projects/universitelesanges-preview.webp', responsive: '/assets/images/projects/universitelesanges.webp',      imgFb: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600', tech: ['HTML', 'CSS', 'Bulma', 'Bootstrap', 'Vercel'],             url: 'https://universitelesanges.vercel.app/',    desc: "Site institutionnel moderne pour l'Université les Anges.", year: '2025' },
 { id: 15, title: 'NEXURA',             sub: 'Marketplace Nouvelle Génération',   cat: 'en-ligne', img: '/assets/images/projects/nexura-preview.webp',           responsive: '/assets/images/projects/nexura-responsive.webp',         imgFb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',  tech: ['Next.js 14', 'Django REST', 'PostgreSQL', 'WebSockets', 'Redis & Celery'], url: 'https://nexura-one.vercel.app/', desc: "Marketplace nouvelle génération — évolution de TerraSafe. Location de résidences meublées, motos & véhicules, bureaux & salles de conférence, terrains & immobilier. Auth sécurisée, KYC intégré, temps réel.", year: '2025' },
 { id: 16, title: 'KokoEat',            sub: 'Livraison Alimentaire',             cat: 'en-cours', img: '/assets/images/projects/kokoeat-preview.webp',          responsive: '/assets/images/projects/kokoeat-responsive.webp',        imgFb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', tech: ['React', 'Django REST', 'PostgreSQL', 'Vercel'],             url: '#',                                         desc: "Application de livraison de repas pensée pour le marché ivoirien. Commande en ligne, suivi en temps réel et paiement Mobile Money.", year: '2025' },
 { id: 17, title: 'Jean Edy · Portfolio', sub: 'Portfolio React UI Avancé',       cat: 'en-ligne', img: '/assets/images/projects/jean-edy-preview.webp',         responsive: '/assets/images/projects/jean-edy.webp',                  imgFb: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600', tech: ['React 18', 'Vite', 'GSAP', 'Framer Motion', 'TailwindCSS'], url: 'https://jean-edy-dev.vercel.app/',          desc: "Portfolio personnel de Jean Edy — Software Developer basé à Abidjan. et skeuomorphisme complet.", year: '2026' },
 { id: 18, title: 'MD Laverie Pressing', sub: 'Site Vitrine Pressing',            cat: 'en-ligne', img: '/assets/images/projects/laverie-preview.webp',          responsive: '/assets/images/projects/laverie.webp',                   imgFb: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', tech: ['React 18', 'Vite', 'GSAP', 'React Router v6', 'EmailJS'],  url: 'https://laverie-plus.vercel.app/',          desc: "Site vitrine complet pour MD Laverie Pressing, Abidjan. Hero slider GSAP, grille packs pricing, formulaire contact EmailJS.", year: '2025' },
]

const SERVICES = [
 { n: '01', title: 'Applications Web', desc: 'Apps CRUD complètes, dashboards de gestion, solutions sur-mesure.' },
 { n: '02', title: 'API RESTful', desc: 'APIs Python/Flask documentées, sécurisées, prêtes pour la production.' },
 { n: '03', title: 'Interfaces Responsives', desc: "Design et intégration d'interfaces modernes et adaptatives." },
 { n: '04', title: 'Bases de Données', desc: 'Conception et optimisation de bases de données MySQL.' },
 { n: '05', title: 'Sécurité Applicative', desc: 'Bonnes pratiques de sécurité intégrées dès la conception.' },
 { n: '06', title: 'Support Technique', desc: 'Maintenance informatique et assistance technique utilisateur.' },
]

/* ─── Processus A à Z — de l'acompte à la livraison ─── */
const PROCESS_STEPS = [
 { n: '01', title: 'Prise de contact & Brief', tag: '1 à 2 jours', desc: "On discute de votre projet : besoins, objectifs, exemples qui vous plaisent. Je vous propose ensuite le pack le plus adapté.", img: '/assets/images/process/prise de contact.webp', imgAlt: 'Prise de contact et brief' },
 { n: '02', title: 'Devis & Conditions', tag: '1 jour', desc: "Je vous envoie un devis clair : prix total, acompte de 50%, délai de livraison et liste des prestations incluses.", img: '/assets/images/process/devis et condition.webp', imgAlt: 'Devis et conditions' },
 { n: '03', title: 'Acompte reçu', tag: 'Feu vert', desc: "Une fois l'acompte versé, je récupère vos contenus — logo, textes, photos — et je lance le développement.", img: '/assets/images/process/acompte.webp', imgAlt: 'Acompte reçu' },
 { n: '04', title: 'Création du site', tag: 'Délai annoncé', desc: "Je construis votre site de A à Z : pages, design responsive, animations, formulaire de contact, SEO de base. J'active aussi l'hébergement et le nom de domaine.", img: '/assets/images/process/creation du site.webp', imgAlt: 'Création du site' },
 { n: '05', title: 'Livraison & Validation', tag: '1 à 2 jours', desc: "Vous testez le site sur un lien de prévisualisation et me partagez vos retours avant la mise en ligne.", img: '/assets/images/process/livraison.webp', imgAlt: 'Livraison et validation' },
 { n: '06', title: 'Solde payé', tag: 'Fichiers transmis', desc: "Une fois le solde réglé, je vous transmets les fichiers sources, les accès à l'hébergement et au nom de domaine, plus le mot de passe d'administration.", img: '/assets/images/process/solde.webp', imgAlt: 'Solde payé' },
 { n: '07', title: 'Mise en ligne & Support', tag: 'Projet livré', desc: "Votre site est en ligne. Un mois de support est inclus selon le pack, et je reste disponible pour le renouvellement après la première année.", img: '/assets/images/process/mise en ligne.webp', imgAlt: 'Mise en ligne et support' },
]

/* ─── Données pricing — format matrice ───────────────────────────
   Chaque tab a : plans[] (entête + prix) et rows[] (lignes de features).
   Chaque cellule peut être : true (check vert) | false (tiret) | 'Limité' | 'Texte'
   ─────────────────────────────────────────────────────────────────── */
const PRICING_TABS = [
  {
    key: 'portfolio', label: 'Portfolio',
    plans: [
      { title: 'Starter', price: '100 000 FCFA', delivery: '3 à 5 jours' },
      { title: 'Standard', price: '175 000 FCFA', delivery: '5 à 7 jours', isPopular: true },
      { title: 'Premium', price: '275 000 FCFA', delivery: '7 à 10 jours' },
    ],
    rows: [
      { label: 'Nombre de pages',        cells: ['3 pages',    '5 pages',    'Illimité'] },
      { label: 'Design responsive',      cells: [true,         true,         true] },
      { label: 'Animations modernes',    cells: [false,        true,         true] },
      { label: 'Section projets',        cells: [true,         true,         true] },
      { label: 'Formulaire contact',     cells: [true,         true,         true] },
      { label: 'SEO',                    cells: [false,        'SEO de base', 'SEO + AEO/GEO'] },
      { label: 'CRO (CTA + preuve sociale)', cells: [false,    false,        true] },
      { label: 'Projets détaillés',      cells: [false,        true,         true] },
      { label: 'Design personnalisé',    cells: [false,        false,        true] },
      { label: 'Blog intégré',           cells: [false,        false,        true] },
      { label: 'Optimisation perf. (SXO)', cells: [false,      false,        true] },
      { label: 'Nom de domaine (1 an)',  cells: [true,         true,         true] },
      { label: 'Hébergement (1 an)',     cells: [true,         true,         true] },
      { label: 'Support',                cells: [false,        false,        '1 mois'] },
      { label: 'Maintenance mensuelle',  cells: ['20 000 à 40 000/mois', '20 000 à 40 000/mois', '20 000 à 40 000/mois'] },
    ],
  },
  {
    key: 'vitrine', label: 'Site Vitrine',
    plans: [
      { title: 'Starter', price: '220 000 FCFA', delivery: '5 à 7 jours' },
      { title: 'Pro',     price: '350 000 FCFA', delivery: '7 à 10 jours', isPopular: true },
      { title: 'Elite',   price: '550 000 FCFA', delivery: '10 à 14 jours' },
    ],
    rows: [
      { label: 'Nombre de pages',        cells: ['5 pages',    '10 pages',   '15–20 pages'] },
      { label: 'Design responsive',      cells: [true,         true,         true] },
      { label: 'Design premium',         cells: [false,        true,         true] },
      { label: 'Design sur mesure',      cells: [false,        false,        true] },
      { label: 'Formulaire contact',     cells: [true,         true,         true] },
      { label: 'SEO',                    cells: ['Base',       'Avancé (SEO + AEO)', 'SEO + AEO + GEO + Analytics'] },
      { label: 'CRO (CTA + preuve sociale)', cells: [false,    true,         true] },
      { label: 'Optimisation SXO',       cells: [false,        true,         true] },
      { label: 'Blog intégré',           cells: [false,        true,         true] },
      { label: 'CMS complet',            cells: [false,        false,        true] },
      { label: 'Nom de domaine (1 an)',  cells: [true,         true,         true] },
      { label: 'Hébergement (1 an)',     cells: [false,        true,         true] },
      { label: 'Support',                cells: ['1 mois',     '3 mois',     '6 mois'] },
      { label: 'Formation',              cells: [false,        '2h',         'Complète'] },
      { label: 'Maintenance mensuelle',  cells: ['20 000 à 40 000/mois', '20 000 à 40 000/mois', '20 000 à 40 000/mois'] },
      { label: 'Page supp.',             cells: ['15 000 à 25 000 FCFA', '15 000 à 25 000 FCFA', '15 000 à 25 000 FCFA'] },
    ],
  },
  {
    key: 'ecommerce', label: 'E-commerce',
    plans: [
      { title: 'Starter', price: '450 000 FCFA',   delivery: '14 jours' },
      { title: 'Pro',     price: '750 000 FCFA',   delivery: '21 jours', isPopular: true },
      { title: 'Elite',   price: '1 200 000 FCFA', delivery: '30 jours' },
    ],
    rows: [
      { label: 'Produits',               cells: ["Jusqu'à 50",  '200–500',     'Illimités'] },
      { label: 'Paiement Mobile Money',  cells: [true,          true,          true] },
      { label: 'Multi-paiement',         cells: [false,         true,          true] },
      { label: 'API paiement custom',    cells: [false,         false,         true] },
      { label: 'Gestion commandes',      cells: [true,          true,          true] },
      { label: 'Gestion stock temps réel', cells: [false,       true,          true] },
      { label: 'Tableau de bord',        cells: [true,          true,          true] },
      { label: 'SEO produits (SEO/AEO)', cells: [false,         true,          true] },
      { label: 'Optimisation IA (GEO)',  cells: [false,         false,         true] },
      { label: "CRO (tunnel d'achat optimisé)", cells: [false,  true,          true] },
      { label: 'Analytics',              cells: [false,         true,          true] },
      { label: 'Rapports avancés',       cells: [false,         false,         true] },
      { label: 'Automatisations',        cells: [false,         false,         true] },
      { label: 'Nom de domaine (1 an)',  cells: [true,          true,          true] },
      { label: 'Hébergement (1 an)',     cells: [true,          true,          true] },
      { label: 'Support',                cells: ['1 mois',      '3 mois',      '6 mois'] },
      { label: 'Formation',              cells: [false,         'Admin',       'Équipe'] },
      { label: 'Maintenance mensuelle',  cells: ['20 000 à 40 000/mois', '20 000 à 40 000/mois', '20 000 à 40 000/mois'] },
    ],
  },
  {
    key: 'saas', label: 'App Web / SaaS',
    plans: [
      { title: 'Sur devis', price: 'Étude personnalisée', delivery: 'Après diagnostic gratuit',
        desc: "Chaque projet SaaS est unique. J'étudie la complexité réelle (architecture, intégrations, sécurité, volume) avant de donner un prix juste et engageant." },
    ],
    rows: [
      { label: 'Diagnostic gratuit de votre besoin', cells: [true] },
      { label: 'Authentification + rôles',       cells: [true] },
      { label: 'API REST',                       cells: [true] },
      { label: 'Dashboard sur mesure',           cells: [true] },
      { label: 'Intégrations tierces (paiement, email…)', cells: [true] },
      { label: 'Multi-tenant (si besoin)',       cells: [true] },
      { label: 'Onboarding optimisé (CRO)',      cells: [true] },
      { label: 'Déploiement cloud',              cells: [true] },
      { label: 'Devis détaillé sous 48h',        cells: [true] },
      { label: 'Accompagnement post-lancement',  cells: [true] },
    ],
  },
  {
    key: 'gbp', label: 'Fiche Google',
    plans: [
      { title: 'Création',     price: '20 000 FCFA',     delivery: '1 à 2 jours', isPopular: true, desc: "Vous n'avez pas encore de fiche Google ? Création complète de zéro." },
      { title: 'Optimisation', price: '12 000 FCFA',     delivery: '1 jour', desc: 'Fiche déjà existante ? On corrige et améliore ce qui est en place.' },
      { title: 'Suivi mensuel', price: '10 000 FCFA/mois', delivery: 'Continu', desc: 'Gestion continue : avis, publications et statistiques chaque mois.' },
    ],
    rows: [
      { label: 'Création de la fiche (de zéro)', cells: [true,  false, false] },
      { label: 'Vérification infos (NAP)',     cells: [true,  true,  false] },
      { label: 'Horaires + zone de service',   cells: [true,  true,  false] },
      { label: 'Catégorie + attributs',        cells: [true,  true,  false] },
      { label: 'Lien vers le site web',        cells: [true,  true,  false] },
      { label: 'Ajout photos (logo, local, produits)', cells: [true, true, false] },
      { label: 'Description optimisée SEO local', cells: [true, true, false] },
      { label: "Mots-clés locaux ciblés",      cells: [true,  true,  false] },
      { label: 'Intégration carte sur le site', cells: [true,  false, false] },
      { label: 'Réponse aux avis clients',     cells: [false, false, true] },
      { label: 'Posts Google réguliers',       cells: [false, false, true] },
      { label: 'Suivi statistiques de fiche',  cells: [false, false, true] },
    ],
  },
]

const SKILLS = {
 frontend: [
 { name: 'React', icon: '/assets/icons/devicon/react/react-original.svg', color: '#61DAFB' },
 { name: 'JavaScript', icon: '/assets/icons/devicon/javascript/javascript-original.svg', color: '#F7DF1E' },
 { name: 'Next.js', icon: '/assets/icons/devicon/nextjs/nextjs-original.svg', color: '#ffffff' },
 { name: 'Tailwind', icon: '/assets/icons/devicon/tailwindcss/tailwindcss-original.svg', color: '#38BDF8' },
 { name: 'HTML5', icon: '/assets/icons/devicon/html5/html5-original.svg', color: '#E34F26' },
 { name: 'CSS3', icon: '/assets/icons/devicon/css3/css3-original.svg', color: '#1572B6' },
 { name: 'Bootstrap', icon: '/assets/icons/devicon/bootstrap/bootstrap-original.svg', color: '#7952B3' },
 ],
 backend: [
 { name: 'Python', icon: '/assets/icons/devicon/python/python-original.svg', color: '#4B8BBE' },
 { name: 'Flask', icon: '/assets/icons/devicon/flask/flask-original.svg', color: '#AAAAAA' },
 { name: 'Django', icon: '/assets/icons/devicon/django/django-plain.svg', color: '#44B78B' },
 { name: 'Node.js', icon: '/assets/icons/devicon/nodejs/nodejs-original.svg', color: '#539E43' },
 { name: 'MySQL', icon: '/assets/icons/devicon/mysql/mysql-original.svg', color: '#F29111' },
 ],
 tools: [
 { name: 'Git', icon: '/assets/icons/devicon/git/git-original.svg', color: '#F05032' },
 { name: 'VS Code',icon: '/assets/icons/devicon/vscode/vscode-original.svg', color: '#007ACC' },
 { name: 'GitHub', icon: '/assets/icons/devicon/github/github-original.svg', color: '#ffffff' },
 { name: 'Vercel', icon: '/assets/icons/devicon/vercel/vercel-original.svg', color: '#ffffff' },
 { name: 'Prisma', icon: '/assets/icons/devicon/prisma/prisma-original.svg', color: '#2D3748' },
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
 '/assets/images/IMG_20250124_124101KK.webp',
 '/assets/images/moi/93027469_127097918918167_9124333187680436224_n.webp',
 '/assets/images/moi/CamScanner 24-02-2026 14.43.webp',
 '/assets/images/moi/CamScanner 24-02-2026 17.16 (1) (1).webp',
 '/assets/images/moi/ChatGPT Image 26 avr. 2026, 00_44_06.webp',
 '/assets/images/moi/ChatGPT Image 26 avr. 2026, 00_47_11.webp',
 '/assets/images/moi/ChatGPT Image 26 avr. 2026, 00_49_13.webp',
 '/assets/images/moi/ChatGPT Image 26 avr. 2026, 00_52_59.webp',
 '/assets/images/moi/FB_IMG_17092288705757644.webp',
 '/assets/images/moi/IMG-20260203-WA0012.webp',
 '/assets/images/moi/IMG-20260203-WA0014.webp',
 '/assets/images/moi/IMG-20260222-WA0020.webp',
 '/assets/images/moi/IMG-20260222-WA0091.webp',
 '/assets/images/moi/IMG-20260222-WA0096.webp',
 '/assets/images/moi/IMG-20260222-WA0109.webp',
 '/assets/images/moi/IMG_20200414_130507_968.webp',
 '/assets/images/moi/IMG_20200426_182719033.webp',
 '/assets/images/moi/IMG_20211205_173445935 (2).webp',
 '/assets/images/moi/IMG_20240331_135514.webp',
 '/assets/images/moi/IMG_20240404_145052.webp',
 '/assets/images/moi/IMG_20250604_220919.webp',
 '/assets/images/moi/IMG_20250608_174833.webp',
 '/assets/images/moi/Snapchat-1841890434.webp',
 '/assets/images/moi/Snapchat-304169344-COLLAGE.webp',
]

const ABOUT_ITEMS = ABOUT_IMAGES.map(img => ({ image: img, link: '#', title: '', description: '' }))

const TESTIMONIALS = [
 { name: 'Koné Ibrahima', role: 'Fondateur · TechFlow', avatar: 'K', proj: 'Site Vitrine', text: "Elvis a livré notre site vitrine en un temps record. Design moderne, responsive, exactement ce qu'on voulait. Très professionnel." },
 { name: 'Calvin Dexter', role: 'Gérant · New Horizon Service', avatar: 'C', proj: 'Location Résidences', text: 'La plateforme de location est impeccable. Les clients peuvent réserver facilement, le backend est solide. Je recommande à 100%.' },
 { name: 'Mory Koné', role: 'Graphiste · MK Portfolio', avatar: 'M', proj: 'Portfolio Créatif', text: "Mon portfolio reflète parfaitement mon univers créatif. Elvis a su traduire ma vision en une expérience visuelle mémorable." },
 { name: 'Tatiana D.', role: 'Influenceuse · Tatii', avatar: 'T', proj: 'Portfolio', text: "Super boulot ! Mon site de présentation est élégant, rapide et je reçois beaucoup de compliments. Merci Elvis !" },
 { name: 'Manobeat 777', role: 'Beatmaker · ManoBeat', avatar: 'B', proj: 'Beat Store', text: "La boutique de beats marche très bien. Les clients achètent facilement via WhatsApp. Interface propre et professionnelle." },
]

/* ─── FAQ — 15 questions les plus posées avant/pendant une commande ─── */
const FAQ_ITEMS = [
 { q: 'Comment se déroule le paiement de mon site ?', a: "Le paiement se fait en deux fois : 50% à la commande pour démarrer le projet, et les 50% restants à la livraison, juste avant de recevoir les fichiers finaux et les accès." },
 { q: 'Pourquoi un acompte est-il demandé avant de commencer ?', a: "L'acompte confirme votre commande et me permet de démarrer le développement immédiatement, de récupérer vos contenus (logo, textes, photos) et de vous garantir le délai annoncé. Sans acompte, le projet n'est pas priorisé dans mon planning." },
 { q: 'Quels moyens de paiement acceptez-vous ?', a: "Orange Money, MTN Mobile Money, Wave ou virement bancaire. Vous précisez votre moyen préféré au moment de la commande et je vous envoie les coordonnées correspondantes." },
 { q: 'Quel est le délai pour recevoir mon site ?', a: "Cela dépend du pack choisi : 3 à 5 jours pour un portfolio simple, davantage pour une vitrine, une boutique e-commerce ou une application plus complexe. Le délai exact est précisé dans le devis et démarre dès réception de l'acompte et de vos contenus." },
 { q: 'Quand mon site est-il mis en ligne ?', a: "Une fois le solde réglé. Avant cela, je vous partage un lien de prévisualisation pour valider le design et le contenu." },
 { q: "Puis-je voir mon site avant qu'il soit en ligne ?", a: "Oui, toujours. Vous recevez un lien de prévisualisation pour tester le site, faire vos retours et demander des ajustements avant la mise en ligne officielle." },
 { q: 'Combien de modifications sont incluses ?', a: "Les petites corrections — textes, couleurs, ajustements visuels — sont incluses pendant la phase de validation. Les modifications majeures, comme un changement de structure ou l'ajout de pages, font l'objet d'un devis complémentaire." },
 { q: 'Quel pack choisir pour mon projet ?', a: "Tout dépend de vos besoins : portfolio, vitrine, boutique e-commerce ou application plus complexe type SaaS. Je vous conseille gratuitement lors du brief initial pour identifier le pack le plus adapté." },
 { q: "Le nom de domaine et l'hébergement sont-ils vraiment gratuits ?", a: "Oui, la première année est offerte sur tous les packs. Après cette période, vous payez simplement le renouvellement — environ 15 000 à 30 000 FCFA par an selon le domaine — et je vous envoie un rappel avant l'expiration." },
 { q: 'Quels contenus dois-je fournir ?', a: "Votre logo, vos photos, vos textes de présentation et vos informations de contact. Plus ces éléments arrivent vite, plus le développement avance rapidement." },
 { q: "Je n'ai pas de logo ni de textes, pouvez-vous m'aider ?", a: "Oui. Je peux proposer un logo simple, utiliser des visuels libres de droits adaptés à votre activité, ou rédiger une trame de textes professionnels que vous ajustez ensuite. Ces services s'ajoutent au devis initial." },
 { q: 'Qui gère mon site après la livraison ?', a: "Vous. Je vous transmets tous les accès — administration, hébergement, nom de domaine — ainsi qu'un tutoriel simple pour modifier vos textes et images sans dépendre de moi." },
 { q: "Que se passe-t-il si le délai annoncé n'est pas respecté ?", a: "C'est rare, mais si cela arrive de mon fait, une pénalité s'applique sur le montant total et vous pouvez demander l'annulation du projet avec un remboursement partiel. Ces conditions figurent dans le devis signé." },
 { q: 'Mon site a un bug après la livraison, que faites-vous ?', a: "Je corrige gratuitement tout bug lié à mon développement pendant le mois suivant la livraison — inclus dans le pack Premium, possible en option sur les autres packs." },
 { q: 'Comment commander mon site ?', a: "Trois étapes : on échange sur votre projet et le pack adapté, je vous envoie un devis avec l'acompte de 50%, puis dès réception du paiement je démarre le développement." },
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
 loaderEl.style.visibility = 'hidden'
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
 const [activeSection, setActiveSection] = useState('hero')
 const [clock, setClock]                 = useState({ date: '', time: '' })
 const [scrolled, setScrolled]           = useState(false)

 const navLinks = NAV_LINKS

 /* Regroupe les ids de sous-sections sous l'id de leur lien de nav parent */
 const SECTION_NAV_GROUPS = {
   'hero': 'hero',
   'projets-section': 'projets-section',
   'hscroll-section': 'projets-section',
   'about-section': 'about-section',
   'timeline-section': 'about-section',
   'hpx-section': 'about-section',
   'skew-section': 'about-section',
   'skills-section': 'about-section',
   'process-section': 'process-section',
   'services-section': 'process-section',
   'pricing-section': 'process-section',
   'testimonials-section': 'process-section',
   'faq-section': 'faq-section',
   'contact': 'contact',
 }

 /* Horloge */
 useEffect(() => {
   const pad = n => String(n).padStart(2, '0')
   const MONTHS = ['JAN','FEV','MAR','AVR','MAI','JUN','JUL','AOÛ','SEP','OCT','NOV','DEC']
   const tick = () => {
     const d = new Date()
     setClock({ date: `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` })
   }
   tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv)
 }, [])

 const navTo = useGooeyTransition('desktop')

 /* Section active */
 useEffect(() => {
   const onScroll = () => {
     let id = 'hero'
     document.querySelectorAll('section[id]').forEach(s => {
       if (window.scrollY >= s.getBoundingClientRect().top + window.scrollY - 160) id = s.id
     })
     const atBottom = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2
     if (atBottom) {
       const sections = document.querySelectorAll('section[id]')
       if (sections.length) id = sections[sections.length - 1].id
     }
     setActiveSection(SECTION_NAV_GROUPS[id] || id)
   }
   window.addEventListener('scroll', onScroll, { passive: true })
   return () => window.removeEventListener('scroll', onScroll)
 }, [])

 /* ── refs pour la micro-interaction phase 1 ↔ 2 ── */
 const prevScrolledRef = useRef(false)
 const leftRef         = useRef(null)
 const centerRef       = useRef(null)

 /* Navbar transparent → solid au scroll + micro-animation GSAP */
 useEffect(() => {
   const heroEl   = document.getElementById('hero')
   if (!heroEl) { setScrolled(window.scrollY > 60); return }
   const headerEl = document.querySelector('.nb-topbar')
   const headerH  = headerEl ? Math.ceil(headerEl.getBoundingClientRect().height) || 60 : 60
   const io = new IntersectionObserver(
     ([entry]) => setScrolled(!entry.isIntersecting),
     { root: null, threshold: 0, rootMargin: `-${headerH}px 0px 0px 0px` }
   )
   io.observe(heroEl)
   return () => io.disconnect()
 }, [])

 /* ── GSAP micro-animation au changement de phase ── */
 useEffect(() => {
   const wasScrolled = prevScrolledRef.current
   prevScrolledRef.current = scrolled

   const leftEl   = leftRef.current
   const centerEl = centerRef.current

   if (scrolled && !wasScrolled) {
     /* phase 1 → 2 : logo gauche slide in depuis gauche / center slide out haut */
     if (centerEl) {
       gsap.fromTo(centerEl,
         { opacity: 1, y: 0, scale: 1 },
         { opacity: 0, y: -10, scale: 0.92, duration: 0.2, ease: 'power2.in',
           onComplete: () => { gsap.set(centerEl, { clearProps: 'all' }) }
         }
       )
     }
     if (leftEl) {
       gsap.fromTo(leftEl,
         { opacity: 0, x: -14, scale: 0.9 },
         { opacity: 1, x: 0, scale: 1, duration: 0.36,
           ease: 'expo.out', delay: 0.06, clearProps: 'all' }
       )
     }
   } else if (!scrolled && wasScrolled) {
     /* phase 2 → 1 : logo gauche slide out vers gauche / center fade in */
     if (leftEl) {
       gsap.fromTo(leftEl,
         { opacity: 1, x: 0, scale: 1 },
         { opacity: 0, x: -10, scale: 0.94, duration: 0.18, ease: 'power2.in',
           onComplete: () => { gsap.set(leftEl, { clearProps: 'all' }) }
         }
       )
     }
     if (centerEl) {
       gsap.fromTo(centerEl,
         { opacity: 0, y: 8, scale: 0.94 },
         { opacity: 1, y: 0, scale: 1, duration: 0.3,
           ease: 'expo.out', delay: 0.08, clearProps: 'all' }
       )
     }
   }
 }, [scrolled])

 const scrollTo = id => {
   const el = document.getElementById(id)
   if (!el) return
   window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'auto' })
 }

 /* Socials pour StaggeredMenu */
 const SM_SOCIALS = [
   { label: 'WhatsApp', link: 'https://wa.me/2250142507750' },
   { label: 'LinkedIn',  link: 'https://www.linkedin.com/in/m-bollo-aka-60a1b1340/' },
   { label: 'GitHub',    link: 'https://github.com/wthomasss06-stack' },
   { label: 'Facebook',  link: 'https://web.facebook.com/profile.php?id=61577494705852' },
   { label: 'AKATech',   link: 'https://akatech.vercel.app/' },
   { label: 'Mon CV',    link: '/assets/CV_MBOLLO_AKA_ELVIS.pdf' },
 ]

 /* SM_ITEMS : transforme NAV_LINKS en format attendu par StaggeredMenu */
 const SM_ITEMS = navLinks.map(l => ({ label: l.label, id: l.id }))

 /* ── Animated theme toggler ── */
 const AnimatedThemeToggler = ({ theme: t, onClick }) => (
   <button
     className="nb-theme-btn att-btn"
     onClick={onClick}
     title="Basculer thème"
     aria-label={t === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
   >
     <span className="att-track" data-theme={t}>
       <span className="att-icon att-sun">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
           <circle cx="12" cy="12" r="4"/>
           <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
           <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
           <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
           <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
         </svg>
       </span>
       <span className="att-icon att-moon">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
           <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z"/>
         </svg>
       </span>
     </span>
   </button>
 )

 const logoBlock = (
   <>
     <img src="/assets/images/logo-akatech.webp" alt="AKATech" className="nb-logo-img"
       onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline' }}
     />
     <span className="nb-logo-text" style={{ display: 'none' }}>AKA<span className="nb-logo-acc">TECH</span></span>
   </>
 )

 return (
   <>
     <TargetCursor targetSelector=".btn-fill, .btn-ghost, .mag-btn, a, button, .cursor-target, .sm-panel-item" />

     {/* ── TOPBAR ── */}
     <header className={`nb-topbar${scrolled ? ' scrolled' : ''}`}>

       {/* Gauche */}
       <div className="nb-topbar-left" ref={leftRef}>
         {scrolled ? (
           <div className="nb-topbar-logoblock" onClick={() => scrollTo('hero')}>{logoBlock}</div>
         ) : (
           <div className="nb-topbar-clock">
             <span>{clock.date}</span><span className="nb-sep">·</span><span>{clock.time}</span>
           </div>
         )}
       </div>

       {/* Centre */}
       <div className="nb-topbar-center" ref={centerRef}>
         {!scrolled && (
           <div className="nb-topbar-logoblock nb-topbar-logoblock--hero" onClick={() => scrollTo('hero')}>
             {logoBlock}
           </div>
         )}
       </div>

       {/* Droite */}
       <div className="nb-topbar-right">
         <AnimatedThemeToggler theme={theme} onClick={onToggleTheme} />
         <StaggeredMenu
           items={SM_ITEMS}
           socialItems={SM_SOCIALS}
           activeSection={activeSection}
           onItemClick={id => navTo(id)}
         />
       </div>

     </header>
   </>
 )
}

/* ════════════════════════════════════════════
 HERO — Plasma WebGL + ScrambleText
 ════════════════════════════════════════════ */
const HERO_ROTATING_WORDS = ['Full-Stack', 'React & Python', 'Django & Flask', 'orienté produit', 'Data & Carto']

function Hero() {
 const scrollTo = id => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'auto' })
  }

 /* Nom — cycle plain sur le même texte */
 const nameLine1 = useSHNameCycle("M'BOLLO")
 const nameLine2 = useSHNameCycle("AKA ELVIS")

 /* Mots rotatifs — glitch scramble en boucle auto */
 const rotating  = useSHRotatingCycle(HERO_ROTATING_WORDS, 2500)

 return (
 <section id="hero">
 <div className="hv4-grain" aria-hidden="true" />
 <div className="hv4-god-rays" id="hv4-rays" aria-hidden="true" />
 <div className="hv4-bg-layer" id="hv4-bg-layer" aria-hidden="true">
 <Beams
 beamWidth={2}
 beamHeight={15}
 beamNumber={12}
 lightColor="#FF5500"
 speed={2}
 noiseIntensity={1.75}
 scale={0.2}
 rotation={0}
 />
 </div>
 <div className="hv4-scan" aria-hidden="true" />
 <div className="hero-vignette" />

 <div className="hv4-scene-wrap" id="hv4-scene">
 <div className="hv4-grid">

 {/* LEFT */}
 <div className="hv4-left hv4-rv" style={{ '--d': '0s' }} id="hv4-left">
 {/* Nom — cycle-text plain */}
 <h1 className="hv4-name" aria-label="M'Bollo Aka Elvis">
 <span className="hv4-name-line" style={{ '--d': '.1s' }}>
   <span className="sh-cycle-wrap" style={{ height: '0.88em', verticalAlign: 'bottom' }}>
     <span className="sh-cycle-inner" ref={nameLine1.innerRef}>
       {nameLine1.lines.map((l, i) => <span className="sh-cycle-line" style={{ height: '0.88em', lineHeight: '0.88em' }} key={i}>{l}</span>)}
     </span>
   </span>
 </span>
 <span className="hv4-name-line hv4-name-line--u" style={{ '--d': '.2s' }}>
   <span className="sh-cycle-wrap" style={{ height: '0.88em', verticalAlign: 'bottom' }}>
     <span className="sh-cycle-inner" ref={nameLine2.innerRef}>
       {nameLine2.lines.map((l, i) => <span className="sh-cycle-line" style={{ height: '0.88em', lineHeight: '0.88em' }} key={i}>{l}</span>)}
     </span>
   </span>
 </span>
 </h1>

 {/* Photo mobile */}
 <div className="hv4-photo-mob hv4-rv" style={{ '--d': '.3s' }}>
 <div className="hv4-photo-mob-inner">
 <img src="/assets/images/IMG_20250124_124101KK.webp" alt="M'Bollo Aka Elvis" className="hv4-photo"
 onError={e => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' }} />
 <div className="hv4-photo-mob-badge"><span className="hero-dot" /><span>disponible</span></div>
 </div>
 </div>

 {/* Rotating words — cycle-text scramble */}
 <h3 className="hv4-typed hv4-rv" style={{ '--d': '.42s' }}>
 Développeur&nbsp;<span className="hero-word" style={{ color: '#ffffff', display: 'inline-block' }}>
   <span className="sh-cycle-wrap">
     <span className="sh-cycle-inner" ref={rotating.innerRef}>
       {rotating.lines.map((l, i) => <span className="sh-cycle-line" key={i}>{l}</span>)}
     </span>
   </span>
 </span>
 </h3>

 

 {/* CTA */}
 <div className="hv4-ctas hv4-rv" style={{ '--d': '.7s' }}>
 <a
   href="#contact"
   className="btn-fill"
   onClick={e => { e.preventDefault(); scrollTo('contact') }}
 >
 Contactez-moi
 <span className="btn-arr" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>
 </a>
 </div>

 {/* Réassurance CRO : disponibilité + délai de réponse, visible sans scroll */}
 <div className="hero-availability hv4-rv" style={{ '--d': '.82s' }}>
 <span className="hero-dot" aria-hidden="true" />
 <span>Disponible maintenant · réponse sous 24h</span>
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
 frontImage="/assets/images/IMG_20250124_124101KK.webp"
 />
 </div>

 </div>
 </div>
 <div className="hero-scroll"><span>scroll</span><div className="hsl" /></div>
 </section>
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
 Auto-slide entre KokoEat (16) et Nexura (15)
 Pas de tabs — slide auto toutes les 6 s
 ════════════════════════════════════════════ */

/* Ids des projets à présenter dans la section hero-projet,
 dans l'ordre souhaité. On s'appuie sur PROJECTS.responsive
 pour le mockup mobile, et PROJECTS.img pour le desktop. */
const FC_PROJECT_IDS = [16, 15]

/* Résout l'URL de la barre du navigateur mockup */
function fcBarUrl(proj) {
 if (!proj.url || proj.url === '#') return proj.title.toLowerCase().replace(/\s+/g, '') + '.vercel.app'
 const m = /^https?:\/\/([^/]+)/.exec(proj.url)
 return m ? m[1] : proj.url
}

function FeaturedCreationDesktop() {
 const sectionRef = useRef(null)
 /* Index du projet affiché */
 const [projIdx, setProjIdx] = useState(0)
 /* Slide mobile auto (alterne entre preview et responsive) */
 const [mobileSlide, setMobileSlide] = useState(0)
 /* Fade entre projets */
 const [fading, setFading] = useState(false)

 /* Intersection observer → .vis */
 useEffect(() => {
 const el = sectionRef.current
 if (!el) return
 const entries = el.querySelectorAll('.fc-entry')
 const obs = new IntersectionObserver(([e]) => {
 if (e.isIntersecting) { entries.forEach(en => en.classList.add('vis')); obs.disconnect() }
 }, { threshold: 0.1 })
 obs.observe(el)
 }, [])

 /* Auto-slide mobile : alterne preview ↔ responsive toutes les 3,5 s */
 useEffect(() => {
 setMobileSlide(0)
 const t = setInterval(() => setMobileSlide(s => (s + 1) % 2), 3500)
 return () => clearInterval(t)
 }, [projIdx])

 /* Auto-switch projet toutes les 7 s */
 useEffect(() => {
 const t = setInterval(() => {
 setFading(true)
 setTimeout(() => {
 setProjIdx(i => (i + 1) % FC_PROJECT_IDS.length)
 setMobileSlide(0)
 setFading(false)
 }, 380)
 }, 7000)
 return () => clearInterval(t)
 }, [])

 const proj = PROJECTS.find(p => p.id === FC_PROJECT_IDS[projIdx])
 if (!proj) return null

 /* Les deux images mobiles : responsive (slide 0) puis preview (slide 1) */
 const mobileImgs = [
 proj.responsive || proj.img,
 proj.img,
 ]
 const barUrl = fcBarUrl(proj)

 return (
 <section id="projets-section" className="featured-creation" ref={sectionRef}>
 <SectionHeading num="01" title="Projets" sub="En production · Dernières créations" />
 <h3 className="about-text" style={{ maxWidth: '640px', marginBottom: '4rem' }}>
 Voici mes <strong>dernières réalisations en production</strong>, pensées du desktop
 au mobile avec une vraie attention portée aux détails.
 </h3>

 <div className={`fc-grid fc-proj-body${fading ? ' fc-proj-fade' : ''}`}>
 {/* ── Mockups ── */}
 <div className="fc-mockups fc-entry">
 <div className="fc-desktop-wrap">
 <div className="fc-desktop-shell">
 <div className="fc-desktop-bar">
 <span className="fc-dot fc-dot--r"/>
 <span className="fc-dot fc-dot--y"/>
 <span className="fc-dot fc-dot--g"/>
 <span className="fc-bar-url">{barUrl}</span>
 </div>
 <div className="fc-desktop-screen">
 <img
 key={proj.img}
 src={proj.img}
 alt={`${proj.title} desktop`}
 className="fc-screen-img"
 loading="lazy"
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
 <div
 className="fc-slide-track"
 style={{
 transform: `translateY(-${mobileSlide * 50}%)`,
 transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
 willChange: 'transform',
 }}
 >
 {mobileImgs.map((src, i) => (
 <img
 key={src + i}
 src={src}
 alt={`${proj.title} mobile ${i + 1}`}
 className="fc-screen-img fc-slide-img"
 loading="lazy"
 />
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
 <h3 className="fc-sub">{proj.sub}</h3>
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
 <h3 className="fc-desc">{proj.desc}</h3>
 {proj.url && proj.url !== '#' ? (
 <a href={proj.url} target="_blank" rel="noreferrer" className="fc-cta">
 <AnimIcon type="globe" size={15} color="currentColor"/> Voir le projet
 <span className="btn-arr" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>
 </a>
 ) : (
 <span className="fc-cta fc-cta--disabled">
 <AnimIcon type="clock" size={15} color="currentColor"/> En cours de développement
 </span>
 )}
 </div>
 </div>
 </section>
 )
}

/* ════════════════════════════════════════════
 PROJECTS HORIZONTAL SCROLL — "Mes projets"
 Scroll vertical → translation horizontale.
 Les 18 projets de PROJECTS, chacun présenté
 avec la même présentation que FeaturedCreationDesktop
 (mockup desktop + mockup mobile + panneau info).
 ════════════════════════════════════════════ */
const PROJECT_CAT_LABEL = {
 'en-ligne': 'Application Web — En ligne',
 'en-cours': 'Application Web — En cours',
 'demo': 'Démo Technique',
}

function getDisplayUrl(url) {
 const m = /^https?:\/\/([^/]+)/.exec(url || '')
 return m ? m[1] : url
}

function ProjectScrollSlide({ proj, index, total }) {
 /* Mockup mobile : utilise l'image responsive dédiée si dispo,
 sinon retombe sur l'image principale */
 const mobileImg = proj.responsive || proj.img
 const desktopImg = proj.img
 const displayUrl = getDisplayUrl(proj.url)
 const typeLabel = PROJECT_CAT_LABEL[proj.cat] || 'Application Web'

 return (
 <li className="fcx-slide">
 <div className="fc-grid">
 {/* ── Mockups ── */}
 <div className="fc-mockups">
 <div className="fc-desktop-wrap">
 <div className="fc-desktop-shell">
 <div className="fc-desktop-bar">
 <span className="fc-dot fc-dot--r"/>
 <span className="fc-dot fc-dot--y"/>
 <span className="fc-dot fc-dot--g"/>
 <span className="fc-bar-url">{displayUrl}</span>
 </div>
 <div className="fc-desktop-screen">
 <img
 src={desktopImg}
 alt={`${proj.title} desktop`}
 className="fc-screen-img"
 loading="lazy"
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
 <img
 src={mobileImg}
 alt={`${proj.title} mobile`}
 className="fc-screen-img"
 loading="lazy"
 onError={e => { e.target.style.opacity = '0' }}
 />
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
 <div className="fc-info">
 <div>
 <h3 className="fc-name">{proj.title}</h3>
 <h3 className="fc-sub">{proj.sub}</h3>
 </div>
 <div className="fc-meta">
 <div className="fc-meta-row"><span className="fc-ml">Type</span><span className="fc-mv">{typeLabel}</span></div>
 <div className="fc-meta-row"><span className="fc-ml">Marché</span><span className="fc-mv">Côte d'Ivoire</span></div>
 <div className="fc-meta-row"><span className="fc-ml">Mon rôle</span><span className="fc-mv">Conception & Développement</span></div>
 <div className="fc-meta-row"><span className="fc-ml">Année</span><span className="fc-mv">{proj.year}</span></div>
 </div>
 <div className="fc-tags">
 {proj.tech.map(t => <span key={t} className="fc-tag">{t}</span>)}
 </div>
 <h3 className="fc-desc">{proj.desc}</h3>
 <a href={proj.url} target="_blank" rel="noreferrer" className="fc-cta">
 <AnimIcon type="globe" size={15} color="currentColor"/> Voir le projet
 <span className="btn-arr" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>
 </a>
 </div>
 </div>

 <div className="fcx-counter"><strong>{String(index + 1).padStart(2, '0')}</strong> / {String(total).padStart(2, '0')}</div>
 </li>
 )
}

function ProjectsHorizontalScroll() {
 const sectionRef = useRef(null)
 const trackRef = useRef(null)
 const fillRef = useRef(null)
 const total = PROJECTS.length

 useEffect(() => {
 const section = sectionRef.current
 const track = trackRef.current
 const fill = fillRef.current
 if (!section || !track) return

 const update = () => {
 const rect = section.getBoundingClientRect()
 const sectionH = section.offsetHeight
 const viewH = window.innerHeight
 let progress = -rect.top / (sectionH - viewH)
 progress = Math.max(0, Math.min(1, progress))

 const maxVW = (total - 1) * 100
 track.style.transform = `translateX(-${progress * maxVW}vw)`
 if (fill) fill.style.width = `${progress * 100}%`
 }

 window.addEventListener('scroll', update, { passive: true })
 window.addEventListener('resize', update)
 update()
 const scrollToSection = id => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
  }
 return () => {
 window.removeEventListener('scroll', update)
 window.removeEventListener('resize', update)
 }
 }, [total])

 return (
 <section ref={sectionRef} id="hscroll-section" className="fcx-section" style={{ height: `${total * 100}vh` }}>
 <div className="fcx-sticky">
 {/* Heading flottant en absolute DANS le sticky (hors flux) */}
 <div className="fcx-section-label">
 <SectionHeading sub={`${total} réalisations`} />
 </div>

 <ul ref={trackRef} className="fcx-track">
 {PROJECTS.map((proj, i) => (
 <ProjectScrollSlide key={proj.id} proj={proj} index={i} total={total} />
 ))}
 </ul>

 <div className="fcx-progress-track">
 <div ref={fillRef} className="fcx-progress-fill" style={{ width: 0 }} />
 </div>
 </div>
 </section>
 )
}
/* ════════════════════════════════════════════
 ABOUT STATS — colonne gauche, slide auto 4s
 chiffre en count-up + label, façon "30+ awards"
 ════════════════════════════════════════════ */
const ABOUT_STATS = [
 { target: 18, suffix: '', label: 'Projets', sub: 'Livrés sur mesure, du concept au déploiement' },
 { target: 3, suffix: '+', label: 'Années', sub: 'D’expérience en développement web' },
 { target: 12, suffix: '', label: 'En prod.', sub: 'Applications actuellement en ligne' },
 { target: 15, suffix: '', label: 'Outils', sub: 'Technologies maîtrisées au quotidien' },
 { target: 10, suffix: '+', label: 'Clients', sub: 'Particuliers, startups et PME accompagnés' },
]

function AboutStatNumber({ target, suffix }) {
 const ref = useRef(null)
 const [val, setVal] = useState(0)

 useEffect(() => {
 setVal(0)
 const dur = 900
 const start = performance.now()
 let raf
 const step = (now) => {
 const p = Math.min(1, (now - start) / dur)
 const eased = 1 - Math.pow(1 - p, 3)
 setVal(Math.round(eased * target))
 if (p < 1) raf = requestAnimationFrame(step)
 }
 raf = requestAnimationFrame(step)
 return () => cancelAnimationFrame(raf)
 }, [target])

 return <span ref={ref}>{val}{suffix}</span>
}

function AboutStats() {
 const [i, setI] = useState(0)
 const SLIDE_MS = 4000

 useEffect(() => {
 const id = setInterval(() => {
 setI(v => (v + 1) % ABOUT_STATS.length)
 }, SLIDE_MS)
 return () => clearInterval(id)
 }, [])

 const cur = ABOUT_STATS[i]

 return (
 <div className="about-stats-col">
 <div className="about-stats-nav">
 <span className="about-stats-count">{String(i + 1).padStart(2, '0')}/{String(ABOUT_STATS.length).padStart(2, '0')}</span>
 </div>
 <div key={i} className="about-stat-fig">
 <span className="about-stat-num">
 <AboutStatNumber target={cur.target} suffix={cur.suffix} />
 </span>
 <p className="about-stat-label">{cur.label}</p>
 <p className="about-stat-sub">{cur.sub}</p>
 </div>
 <div className="about-stats-progress">
 <span key={i} className="about-stats-progress-fill" style={{ animationDuration: `${SLIDE_MS}ms` }} />
 </div>
 </div>
 )
}

function About() {
 const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const root = document.documentElement
    const prev = root.style.scrollBehavior
    root.style.scrollBehavior = 'smooth'
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => { root.style.scrollBehavior = prev }, 1000)
 }

 useEffect(() => {
 document.querySelectorAll('.about-block').forEach((el, i) => {
 el.style.transitionDelay = `${i * 0.12}s`
 const obs = new IntersectionObserver(([e]) => {
 if (e.isIntersecting) {
 el.classList.add('vis')
 obs.disconnect()
 }
 }, { threshold: 0.2 })
 obs.observe(el)
 })
 }, [])

 return (
 <section
 id="about-section"
 className="sec"
 style={{
 padding: 'clamp(6rem, 14vh, 9rem) 0 10vh',
 borderTop: '1px solid rgba(255,85,0,.08)' }}
 >
 <div
 style={{
 width: '100%',
 maxWidth: '1280px',
 margin: '0 auto',
 padding: '0 1.5rem' }}
 >
 <div className="about-block">
 <SectionHeading num="02" title="À propos" sub="Parcours & stack" style={{ marginBottom: '2rem' }} />
 </div>

 <div className="about-block about-split">
 <AboutStats />

 <div className="about-text-col">
 <h3 className="about-text-lg">
 Je suis développeur web basé à <strong>Abidjan</strong>, avec une vraie envie de
 créer des produits utiles, beaux et agréables à utiliser.
 </h3>

 <h3 className="about-text-lg">
 Mon parcours a commencé dans le <strong>réseau</strong> et la
 <strong> sécurité informatique</strong>, et cette base m’a appris à construire
 avec méthode, à penser la fiabilité et à garder une vision propre de
 l’architecture.
 </h3>

 <h3 className="about-text-lg">
 Avec le temps, j’ai trouvé ma place dans le développement web. Aujourd’hui,
 j’aime concevoir des interfaces qui respirent, qui bougent, et qui donnent une
 vraie sensation de produit fini.
 </h3>

 <h3 className="about-text-lg">
 Je travaille surtout avec <strong>React</strong> et <strong>Django</strong>,
 tout en explorant <strong>Next.js</strong>, <strong>GSAP</strong>,
 <strong>Framer Motion</strong> et parfois <strong>Three.js</strong> pour donner
 plus de vie et de profondeur aux expériences.
 </h3>

 <h3 className="about-text-lg">
 J’aime créer des applications pensées pour de vrais usages : dashboards, outils
 métier, plateformes web, SaaS et sites immersifs. Mon approche reste simple :
 faire quelque chose de clair, solide et agréable à utiliser.
 </h3>

 <h3 className="about-text-lg">
 En grande partie <strong>autodidacte</strong>, j’apprends en construisant, en
 testant et en améliorant chaque projet. C’est aussi dans cet esprit que j’ai
 créé{' '}
 <a
 href="https://akatech.vercel.app/"
 target="_blank"
 rel="noreferrer"
 style={{
 color: 'var(--accent)',
 fontWeight: 700,
 textDecoration: 'none',
 borderBottom: '1.5px solid var(--accent)' }}
 >
 AKATech
 </a>
 , un espace où je donne forme à des idées web modernes et concrètes.
 </h3>

 {/* Bloc identitaire */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', marginTop: '2.5rem' }}>
   <div style={{
     width: '56px', height: '56px', borderRadius: '50%',
     overflow: 'hidden', flexShrink: 0,
     border: '2px solid var(--accent)',
   }}>
     <img
       src="/assets/images/IMG_20250124_124101KK.webp"
       alt="M'Bollo Aka Elvis"
       style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }}
       loading="lazy"
       onError={e => { e.target.style.display = 'none' }}
     />
   </div>
   <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
     <span style={{
       fontFamily: 'var(--fd)', fontWeight: 800,
       fontSize: '1rem', color: 'var(--text)',
       letterSpacing: '-.01em', lineHeight: 1.2,
     }}>Mbollo Aka Elvis</span>
     <span style={{
       fontFamily: "'Space Mono', monospace",
       fontSize: '.62rem', letterSpacing: '.06em',
       color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.3,
     }}>Développeur Web Full Stack · Fondateur, AKATech</span>
   </div>
 </div>
 </div>
 </div>

 <div className="about-block" style={{ marginTop: '2rem', textAlign: 'center' }}>
 <a
 href="#contact"
 className="btn-fill"
 style={{ display: 'inline-flex' }}
 onClick={e => {
 e.preventDefault()
 scrollToSection('contact')
 }}
 >
 Parlons d’un projet
 <span className="btn-arr" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>
 </a>
 </div>
 </div>
 </section>
 )
}
/* ════════════════════════════════════════════
 TIMELINE — Stack cards (Stack.jsx)
 Drag-to-send-back + autoplay cycling
 ════════════════════════════════════════════ */


function Timeline() {
 const [activeIdx, setActiveIdx] = useState(0)
 const t = TIMELINE[activeIdx]

 return (
 <section id="timeline-section" className="sec">
 <SectionHeading num="02" title="Parcours" sub="Expérience & Formation" style={{ marginBottom: '1.5rem' }} />
 <h3 className="about-text" style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
 De la <strong>sécurité informatique</strong> au développement web : chaque étape
 a renforcé ma méthode et ma rigueur technique.
 </h3>

 {/* ── Stack cards — drag to shuffle, click cycles detail ── */}
 <div className="tl-stack-wrap">
  <Stack
   cards={TIMELINE.map((t, i) => (
    <div
     key={i}
     className="tl-stack-card tl-stack-card--info"
     onClick={() => setActiveIdx(i)}
    >
     <div className="tl-sc-header">
      <span className="tl-sc-idx">0{i + 1} / 0{TIMELINE.length}</span>
      <span className="tl-sc-date">{t.date}</span>
     </div>
     <div className="tl-sc-title">{t.title}</div>
     <div className="tl-sc-company">
      <span className="tl-sc-company-icon">◈</span>
      {t.company}
     </div>
     <ul className="tl-sc-items">
      {t.items.map((li, j) => <li key={j}>→ {li}</li>)}
     </ul>
     <div className="tl-sc-tags">
      {t.tags.map(tag => <span key={tag} className="tl-sc-tag">{tag}</span>)}
     </div>
    </div>
   ))}
   autoplay
   autoplayDelay={3200}
   pauseOnHover
   sendToBackOnClick
   sensitivity={120}
   randomRotation
   animationConfig={{ stiffness: 220, damping: 22 }}
  />
 </div>

 

 </section>
 )
}

/* ════════════════════════════════════════════
 SKEW SECTION — Mon Approche + FlowingMenu
 ════════════════════════════════════════════ */
function SkewSection() {
 const flowItems = [
 {
  text: '01 — Code propre & sécurisé',
  image: '/assets/images/projects/CB.webp',
  body: "Chaque ligne de code applique les bonnes pratiques : auth, permissions, validation côté serveur. La sécurité n'est pas une option, c'est une fondation.",
  link: '#contact',
 },
 {
  text: '02 — Interface pensée usages réels',
  image: '/assets/images/projects/jean-edy-preview.webp',
  body: "Des interfaces React/Next.js pensées pour l'utilisateur final. Responsive, rapides, accessibles — pas juste belles.",
  link: '#contact',
 },
 {
  text: '03 — Livraison dans les délais',
  image: '/assets/images/projects/C.webp',
  body: "Communication transparente à chaque étape. Vous suivez l'avancement en temps réel, aucune surprise à la livraison.",
  link: '#contact',
 },
 {
  text: '04 — Data & Carto intégrés',
  image: '/assets/images/projects/A.webp',
  body: 'Dashboards interactifs, visualisations Chart.js, cartes Leaflet/OpenStreetMap ou MAPBOX. Je transforme vos données en décisions.',
  link: '#contact',
 },
 ]

 return (
 <section id="skew-section">
  <div className="skew-grid">
  {/* Colonne gauche sticky */}
  <div className="skew-sticky">
   <div>
   <h2 className="sec-eyebrow" style={{ textAlign:'left' }}>Mon Approche</h2>
   <h2 className="sec-eyebrow skew-heading" style={{ textAlign:'left', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-.025em', hyphens: 'none', wordBreak: 'normal', overflowWrap: 'normal' }}>
    <span style={{ display: 'block' }}>Pourquoi les</span>
    <span style={{ display: 'block' }}>projets réussissent</span>
    <span style={{ display: 'block' }}>avec mon approche.</span>
   </h2>
   </div>
  </div>

  {/* Colonne droite — FlowingMenu */}
  <div className="skew-imgs" style={{ padding: '0', gap: 0, minHeight: '60vh' }}>
   <FlowingMenu
   items={flowItems}
   speed={14}
   textColor="var(--text)"
   bgColor="transparent"
   marqueeBgColor="#FF5500"
   marqueeTextColor="#fff"
   borderColor="rgba(255,85,0,.18)"
   />
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
 loading="lazy"
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
 loading="lazy"
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
 <SectionHeading sub="Mes outils de travail" style={{ marginBottom: '1.2rem' }} />
 <h3 className="about-text" style={{ maxWidth: '640px', marginBottom: '2rem' }}>
 Un ensemble d'<strong>outils maîtrisés</strong> au fil des projets, du frontend
 au backend, pour livrer du code fiable.
 </h3>
 
 <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '16px', border: '1px solid rgba(255,85,0,.1)', overflow: 'hidden', background: 'rgba(255,85,0,.02)' }}>
 <ImageTrail items={allSkills} />
 </div>
 <h3 style={{ fontFamily: "'Space Mono',monospace", fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.15em', textAlign: 'center', marginTop: '1rem' }}>
 React · JavaScript · Next.js · Python · Django · Flask · MySQL · Git · VS Code · GitHub · Vercel · Tailwind
 </h3>
 </section>
 )
}

/* ════════════════════════════════════════════
 PRICING — isPopular + 4 onglets
 ════════════════════════════════════════════ */
/* Icône check */
const CheckIcon = () => (
  <span className="ptbl-check">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  </span>
)
/* Icône X */
const CrossIcon = () => (
  <span className="ptbl-cross">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </span>
)

/* ════════════════════════════════════════════
 PROCESS — Accroche avant l'offre : processus A à Z
 Même expérience UI/UX que SERVICES (stacked cards
 GSAP/ScrollTrigger), miroir des colonnes :
 Gauche : images du process empilées (stack crossfade)
 Droite : textes étape (sticky switch scrub)
 ════════════════════════════════════════════ */
function ProcessSection() {
 const sectionRef = useRef(null)
 const panelsRef = useRef([])
 const imgsRef = useRef([])
 const total = PROCESS_STEPS.length

 useEffect(() => {
 const section = sectionRef.current
 if (!section) return

 const panels = panelsRef.current
 const images = imgsRef.current

 // Init : toutes les images cachées sauf la première
 gsap.set(images, { y: '110%', scale: 0.9, opacity: 0 })
 gsap.set(images[0], { y: '0%', scale: 1, opacity: 1 })

 // Timeline scrubée sur le scroll
 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: section,
 start: 'top top',
 end: 'bottom bottom',
 scrub: 1,
 },
 })

 for (let i = 1; i < total; i++) {
 tl.to(images[i - 1], { scale: 0.93, opacity: 0.55, y: '-4%', ease: 'none' }, `s${i}`)
 tl.to(images[i], { y: '0%', scale: 1, opacity: 1, ease: 'none' }, `s${i}`)
 }

 // Textes : switch selon progress
 const textTrigger = ScrollTrigger.create({
 trigger: section,
 start: 'top top',
 end: 'bottom bottom',
 onUpdate: self => {
 const idx = Math.min(total - 1, Math.floor(self.progress * total))
 panels.forEach((p, i) => {
 if (!p) return
 const active = i === idx
 p.style.opacity = active ? '1' : '0'
 p.style.transform = active ? 'translateY(0)' : 'translateY(28px)'
 p.style.pointerEvents = active ? 'all' : 'none'
 })
 },
 })

 return () => {
 tl.scrollTrigger?.kill()
 textTrigger.kill()
 }
 }, [total])

 return (
 <section id="process-section" className="proc-section">

 {/* ── En-tête : titre + accroche — scroll LIBRE, hors du sticky ── */}
 <div className="proc-header">
 <SectionHeading num="03" title="Process" sub="De l'acompte à la livraison" subAs="h2" style={{ marginBottom: '.8rem' }} />
 <h3 className="about-text proc-header-text">
 Un processus clair et transparent, du premier brief à la mise en ligne —
 vous savez toujours où en est votre projet.
 </h3>
 </div>

 {/* ── Zone pin : seule cette zone porte le sticky + le scrub GSAP ── */}
 <div ref={sectionRef} className="proc-pin" style={{ height: `${total * 100}vh` }}>
 <div className="proc-sticky">
 <div className="proc-grid">

 {/* ── Gauche : images empilées ── */}
 <div className="proc-img-col">
 <div className="bg-dots-acc" aria-hidden="true" />
 <div className="proc-stack">
 {PROCESS_STEPS.map((s, i) => (
 <img
 key={i}
 ref={el => imgsRef.current[i] = el}
 src={s.img}
 alt={s.imgAlt}
 className="proc-img"
 onError={e => { e.target.style.background = '#141414'; e.target.style.opacity = '.4' }}
 />
 ))}
 </div>
 </div>

 {/* ── Droite : textes étape ── */}
 <div className="proc-text-col">
 {PROCESS_STEPS.map((s, i) => (
 <div
 key={i}
 ref={el => panelsRef.current[i] = el}
 className="proc-panel"
 style={{
 opacity: i === 0 ? 1 : 0,
 transform: i === 0 ? 'translateY(0)' : 'translateY(28px)',
 pointerEvents: i === 0 ? 'all' : 'none',
 }}
 >
 <span className="proc-eyebrow">{s.n} — Process</span>
 <h2 className="proc-title">{s.title}</h2>
 <span className="proc-tag">{s.tag}</span>
 <p className="proc-desc">{s.desc}</p>
 </div>
 ))}
 </div>

 </div>
 </div>
 </div>
 </section>
 )
}

/* ════════════════════════════════════════════
 SERVICES SECTION — Stacked Cards GSAP/ScrollTrigger
 Gauche : textes service (sticky switch scrub)
 Droite : images empilées (stacked cards animées)
 ════════════════════════════════════════════ */
const SERVICES_DATA = [
 {
 num: '01',
 title: 'Conception\nde Site Web',
 sub: 'Votre présence en ligne professionnelle',
 desc: "Création de sites web modernes, responsive et optimisés pour convertir vos visiteurs en clients. Du portfolio à la plateforme e-commerce, je conçois chaque page avec soin.",
 img: '/assets/images/service/creation de site web.webp',
 imgAlt: 'Conception de site web',
 },
 {
 num: '02',
 title: 'Cartes Interactives\n& Dashboards',
 sub: 'Cartes Mapbox et visualisation de données',
 desc: "Intégration de cartes interactives Mapbox / Leaflet et de dashboards de visualisation de données. Je transforme vos données brutes en interfaces lisibles et actionnables.",
 img: '/assets/images/service/dasbord.webp',
 imgAlt: 'Dashboard interactif',
 },
 {
 num: '03',
 title: 'API & Backend\nRobustes',
 sub: 'Connectez et automatisez vos systèmes',
 desc: "Conception d'API RESTful sécurisées avec Django ou Flask. Authentification JWT, gestion des rôles, intégration Mobile Money et déploiement sur Vercel ou PythonAnywhere.",
 img: '/assets/images/service/api.webp',
 imgAlt: 'API et backend',
 },
 {
 num: '04',
 title: 'Maintenance\n& Support',
 sub: 'Votre projet performant, sécurisé et à jour',
 desc: "Suivi technique, corrections de bugs, mises à jour de sécurité et améliorations continues. Vous vous concentrez sur votre métier, je m'occupe du reste.",
 img: '/assets/images/service/maintenence.webp',
 imgAlt: 'Maintenance et support',
 },
 {
 num: '05',
 title: 'Fiche Google\nMy Business',
 sub: 'Soyez visible sur Google Maps et la recherche locale',
 desc: "Création ou optimisation de votre fiche Google (NAP, catégories, photos, description SEO local) et suivi mensuel : réponse aux avis, publications et statistiques. Plus de clients vous trouvent près de chez eux.",
 img: '/assets/images/service/fiche-google.webp',
 imgAlt: 'Fiche Google My Business',
 },
]

function ServicesSection() {
 const sectionRef = useRef(null)
 const panelsRef = useRef([])
 const imgsRef = useRef([])
 const total = SERVICES_DATA.length

 useEffect(() => {
 const section = sectionRef.current
 if (!section) return

 const panels = panelsRef.current
 const images = imgsRef.current

 // Init : toutes les images cachées sauf la première
 gsap.set(images, { y: '110%', scale: 0.9, opacity: 0 })
 gsap.set(images[0], { y: '0%', scale: 1, opacity: 1 })

 // Timeline scrubée sur le scroll
 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: section,
 start: 'top top',
 end: 'bottom bottom',
 scrub: 1,
 },
 })

 for (let i = 1; i < total; i++) {
 tl.to(images[i - 1], { scale: 0.93, opacity: 0.55, y: '-4%', ease: 'none' }, `s${i}`)
 tl.to(images[i], { y: '0%', scale: 1, opacity: 1, ease: 'none' }, `s${i}`)
 }

 // Textes : switch selon progress
 const textTrigger = ScrollTrigger.create({
 trigger: section,
 start: 'top top',
 end: 'bottom bottom',
 onUpdate: self => {
 const idx = Math.min(total - 1, Math.floor(self.progress * total))
 panels.forEach((p, i) => {
 if (!p) return
 const active = i === idx
 p.style.opacity = active ? '1' : '0'
 p.style.transform = active ? 'translateY(0)' : 'translateY(28px)'
 p.style.pointerEvents = active ? 'all' : 'none'
 })
 },
 })

 return () => {
 tl.scrollTrigger?.kill()
 textTrigger.kill()
 }
 }, [total])

 return (
 <section id="services-section" className="svc-section">

 {/* ── En-tête : titre + accroche — scroll LIBRE, hors du sticky ── */}
 <div className="svc-header">
 <SectionHeading num="03" title="Services" sub="Ce que je peux faire pour vous" subAs="h2" style={{ marginBottom: '.8rem' }} />
 <h3 className="about-text svc-header-text">
 Cinq offres complémentaires, de la conception au support continu —
 pour un projet qui reste performant dans la durée.
 </h3>
 </div>

 {/* ── Zone pin : seule cette zone porte le sticky + le scrub GSAP ── */}
 <div ref={sectionRef} className="svc-pin" style={{ height: `${total * 100}vh` }}>
 <div className="svc-sticky">
 <div className="svc-grid">

 {/* ── Gauche : textes service ── */}
 <div className="svc-text-col">
 {SERVICES_DATA.map((s, i) => (
 <div
 key={i}
 ref={el => panelsRef.current[i] = el}
 className="svc-panel"
 style={{
 opacity: i === 0 ? 1 : 0,
 transform: i === 0 ? 'translateY(0)' : 'translateY(28px)',
 pointerEvents: i === 0 ? 'all' : 'none',
 }}
 >
 <span className="svc-eyebrow">{s.num} — Services</span>
 <h2 className="svc-title">{s.title}</h2>
 <p className="svc-sub">{s.sub}</p>
 <p className="svc-desc">{s.desc}</p>
 </div>
 ))}
 </div>

 {/* ── Droite : images empilées ── */}
 <div className="svc-img-col">
 <div className="bg-dots-acc" aria-hidden="true" />
 <div className="svc-stack">
 {SERVICES_DATA.map((s, i) => (
 <img
 key={i}
 ref={el => imgsRef.current[i] = el}
 src={s.img}
 alt={s.imgAlt}
 className="svc-img"
 onError={e => { e.target.style.background = '#141414'; e.target.style.opacity = '.4' }}
 />
 ))}
 </div>
 </div>

 </div>
 </div>
 </div>
 </section>
 )
}

function PricingSection() {
  const [currentTab, setCurrentTab] = useState(0)
  const tab = PRICING_TABS[currentTab]

  /* Transforme les rows en features par plan :
     pour chaque plan (colonne), on collecte uniquement
     les lignes qui ont une valeur non-false */
  const featuresPerPlan = tab.plans.map((_, ci) =>
    tab.rows
      .filter(row => row.cells[ci] !== false)
      .map(row => ({
        label: row.label,
        val: row.cells[ci],
      }))
  )

  const renderFeatureVal = (val) => {
    if (val === true) return null          // juste le label suffit
    if (typeof val === 'string') return <span className="prc-feat-val">{val}</span>
    return null
  }

  return (
    <section id="pricing-section">
      <SectionHeading num="03" title="Clientèle" sub="Tarifs & offres" style={{ marginBottom: '1.5rem' }} />
      <h3 className="about-text" style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
        Des <strong>offres claires</strong>, adaptées à la taille de votre projet — du
        site vitrine à la plateforme web complexe.
      </h3>

      {/* ── Tabs catégorie ── */}
      <div className="ptabs">
        {PRICING_TABS.map((t, i) => (
          <button key={t.key} className={`ptab${i === currentTab ? ' on' : ''}`} onClick={() => setCurrentTab(i)}>{t.label}</button>
        ))}
      </div>

      {/* ── Cartes ── */}
      <div className={`prc-grid${tab.plans.length === 1 ? ' prc-grid--single' : ''}`} key={currentTab}>
        {tab.plans.map((plan, ci) => (
          <div key={ci} className={`prc-card${plan.isPopular ? ' prc-card--pop' : ''}`}>

            {/* Badge Popular */}
            {plan.isPopular && (
              <span className="prc-pop-badge">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Populaire
              </span>
            )}

            {/* Header */}
            <div className="prc-header">
              <p className="prc-plan-name">{plan.title}</p>
              <p className="prc-price">{plan.price}</p>
              <div className="prc-delivery">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                Délai : {plan.delivery}
              </div>
              {plan.desc && <p className="prc-plan-desc">{plan.desc}</p>}
            </div>

            {/* Séparateur */}
            <div className="prc-sep" />

            {/* Features list */}
            <ul className="prc-features">
              {featuresPerPlan[ci].map((feat, fi) => (
                <li key={fi} className="prc-feat">
                  <span className="prc-feat-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  <span className="prc-feat-label">
                    {feat.label}
                    {renderFeatureVal(feat.val)}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="#contact"
              className={`prc-cta${plan.isPopular ? ' prc-cta--pop' : ''}`}
              onClick={e => {
                e.preventDefault()
                const el = document.getElementById('contact')
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' })
              }}
            >
              {tab.key === 'saas' ? 'Demander un devis gratuit' : 'Démarrer le projet'}
              <span className="btn-arr" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>
            </a>

          </div>
        ))}
      </div>

      <p className="pricing-note">
        Chaque projet étant unique, les tarifs peuvent varier selon les fonctionnalités demandées.
      </p>
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
 return (
 <section
 id="testimonials-section"
 style={{
 padding: '10vh 0',
 overflow: 'hidden' }}
 >
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'flex-start',
 gap: '2.5rem',
 flexWrap: 'wrap',
 padding: '0 4vw' }}
 >
 <div style={{ maxWidth: 340, flexShrink: 0 }}>
 <SectionHeading num="03" title="Avis" sub={`${TESTIMONIALS.length} avis clients`} style={{ marginBottom: '1.2rem' }} />

 <h3 style={{ fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.7 }}>
 Chaque carte défile automatiquement pour révéler une nouvelle histoire client.
 </h3>

 <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
 {TESTIMONIALS.map((t) => (
 <span
 key={t.name}
 style={{
 fontFamily: "'Space Mono',monospace",
 fontSize: '.58rem',
 color: 'var(--muted)',
 border: '1px solid rgba(255,85,0,.18)',
 borderRadius: '999px',
 padding: '3px 10px' }}
 >
 {t.name}
 </span>
 ))}
 </div>
 </div>

 <div
 style={{
 position: 'relative',
 width: 460,
 height: 520,
 flexShrink: 0,
 marginLeft: 'clamp(0rem, 1vw, .5rem)' }}
 >
 <CardSwap
 width={460}
 height={520}
 cardDistance={52}
 verticalDistance={58}
 delay={3500}
 pauseOnHover={true}
 skewAmount={4}
 easing="elastic.out(1, 0.8)"
 >
 {TESTIMONIALS.map((t) => (
 <Card key={t.name} customClass="testi-card">
 <div
 style={{
 display: 'flex',
 flexDirection: 'column',
 justifyContent: 'space-between',
 height: '100%',
 padding: '1.4rem',
 boxSizing: 'border-box' }}
 >
 <div>
 <div
 style={{
 alignSelf: 'flex-start',
 fontFamily: 'var(--fd)',
 fontSize: '.58rem',
 letterSpacing: '.2em',
 textTransform: 'uppercase',
 background: 'var(--accent)',
 border: '2px solid var(--text)',
 padding: '4px 12px',
 borderRadius: '999px',
 color: 'var(--bg)',
 fontWeight: 800,
 marginBottom: '1rem',
 display: 'inline-block' }}
 >
 {t.proj}
 </div>

 <div style={{ display: 'flex', gap: '3px', marginBottom: '.8rem' }}>
 {Array.from({ length: 5 }).map((_, j) => (
 <svg key={j} viewBox="0 0 24 24" width="14" height="14">
 <polygon
 points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
 fill="var(--accent)"
 />
 </svg>
 ))}
 </div>

 <h3 style={{ fontFamily: 'var(--fd)', fontSize: '.92rem', lineHeight: 1.7, color: 'var(--text)' }}>
 <span
 style={{
 fontSize: '2.2rem',
 lineHeight: '.5',
 color: 'rgba(255,85,0,.3)',
 fontWeight: 800,
 display: 'block',
 marginBottom: '.4rem' }}
 >
 “
 </span>
 {t.text}
 </h3>
 </div>

 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: '.9rem',
 paddingTop: '1rem',
 borderTop: '1px solid rgba(255,85,0,.15)',
 marginTop: '1rem' }}
 >
 <div
 style={{
 width: 40,
 height: 40,
 borderRadius: '50%',
 background: 'linear-gradient(135deg,var(--accent),#cc3300)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontFamily: 'var(--fd)',
 fontWeight: 800,
 fontSize: '.9rem',
 color: '#0A0A0A',
 flexShrink: 0 }}
 >
 {t.avatar}
 </div>

 <div>
 <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: '.85rem', color: 'var(--text)' }}>
 {t.name}
 </div>
 <div style={{ fontSize: '.62rem', color: 'var(--muted)', marginTop: '2px' }}>
 {t.role}
 </div>
 </div>
 </div>
 </div>
 </Card>
 ))}
 </CardSwap>
 </div>
 </div>
 </section>
 )
}

/* ════════════════════════════════════════════
 FAQ — Accordéon questions fréquentes
 ════════════════════════════════════════════ */
function FAQItem({ item, index, isOpen, onToggle }) {
 return (
 <div className={`faq-item${isOpen ? ' open' : ''}`}>
 <button className="faq-q" onClick={onToggle} aria-expanded={isOpen}>
 <span className="faq-q-text">
 <span className="faq-q-num">{String(index + 1).padStart(2, '0')}</span>
 {item.q}
 </span>
 <span className="faq-icon">
 <AnimIcon type="plus" size={13} color="currentColor" />
 </span>
 </button>
 <div className="faq-a-wrap">
 <div className="faq-a-inner">
 <p className="faq-a">{item.a}</p>
 </div>
 </div>
 </div>
 )
}

function FAQSection() {
 const [openIndex, setOpenIndex] = useState(null)

 return (
 <section id="faq-section">
 <SectionHeading num="04" title="FAQ" sub="Questions fréquentes" style={{ marginBottom: '3rem' }} />

 <div className="faq-list">
 {FAQ_ITEMS.map((item, i) => (
 <FAQItem
 key={i}
 item={item}
 index={i}
 isOpen={openIndex === i}
 onToggle={() => setOpenIndex(openIndex === i ? null : i)}
 />
 ))}
 </div>
 </section>
 )
}

/* ════════════════════════════════════════════
 INTERACTIVE GITHUB CARD — Temps réel via GitHub API
 ════════════════════════════════════════════ */
function GitHubInteractiveCard() {
 const GH_USER = 'wthomasss06-stack'

 const [activeTab, setActiveTab] = useState('grid')
 const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 })
 const [terminalLines, setTerminalLines] = useState([])
 const [isPushing, setIsPushing] = useState(false)
 const [logs, setLogs] = useState([
 { id: 1, time: 'Il y a 10 min', repo: 'shop-ci', msg: 'fix: validation du panier et mobile money API', commits: 2 },
 { id: 2, time: 'Il y a 2 heures', repo: 'akatech', msg: 'feat: ajout des animations GSAP de survol', commits: 1 },
 { id: 3, time: 'Hier', repo: 'terrasafe', msg: 'security: validation CSRF sur le formulaire', commits: 3 },
 { id: 4, time: 'Il y a 3 jours', repo: 'chap-chapMAP', msg: 'refactor: optimisation des couches Leaflet', commits: 1 },
 ])

 const [ghLoading, setGhLoading] = useState(true)
 const [ghError, setGhError] = useState(false)
 const [ghUser, setGhUser] = useState(null)
 const [ghRepos, setGhRepos] = useState([])
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
 const all = data.contributions
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
 ' 7c28fb3..9a28cd1 main -> main',
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
 <h3 className="github-card-large-user">
 <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noreferrer">@{GH_USER}</a>
 {ghUser && <span style={{ color:'var(--muted)', marginLeft:'8px', fontSize:'.62rem' }}>· {ghUser.public_repos} repos · {ghUser.followers} followers</span>}
 </h3>
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
 { name:'ShopCI', description:'Marketplace E-commerce locale avec intégration mobile money.', stargazers_count:14, forks_count:4, language:'JavaScript' },
 { name:'TerraSafe', description:"Plateforme foncière de prévention des risques d'arnaque.", stargazers_count:8, forks_count:2, language:'Python' },
 { name:'AKATech', description:'Site officiel de mon agence digitale. Responsive + animations.', stargazers_count:21, forks_count:5, language:'TypeScript' },
 { name:'chap-chapMAP', description:"Cartographie interactive pour l'itinéraire et la livraison.", stargazers_count:5, forks_count:1, language:'JavaScript' },
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
 <h3 className="github-repo-desc">{repo.description}</h3>
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
 <h3 className="github-log-msg">{log.msg}</h3>
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
 <SectionHeading num="05" title="Contact" sub="Travaillons ensemble" style={{ marginBottom: '1.5rem' }} />
 <h3 className="about-text" style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
 Une idée, un projet, une question ? Je suis <strong>disponible</strong> pour en
 discuter et la transformer en quelque chose de concret.
 </h3>

 {/* GitHub Large Interactive Card */}
 <div className="github-card-large-wrapper">
 <GitHubInteractiveCard />
 </div>

 <div className="contact-grid">
 {/* ── Colonne gauche : liste compacte "Où me joindre" ── */}
 <div className="contact-info contact-links-col">
 <div className="contact-status-badge" style={{ marginBottom: '1.6rem' }}><span className="cdot" /><span>Disponible maintenant</span></div>
 <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.58rem', color: 'rgba(255,85,0,.55)', letterSpacing: '.2em', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>// Où me joindre</span>
 <ul className="clk-list">
 {nodeLinks.map(n => (
 <li key={n.id} className="clk-item">
 <a
 href={n.href}
 target={n.href.startsWith('mailto') || n.href.startsWith('/') || n.href.startsWith('tel') ? '_self' : '_blank'}
 rel="noreferrer"
 className="clk-link"
 >
 <span className="clk-icon">{n.icon}</span>
 <span className="clk-label">{n.label}</span>
 <span className="clk-arrow">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="7" y1="17" x2="17" y2="7" />
 <polyline points="7 7 17 7 17 17" />
 </svg>
 </span>
 </a>
 </li>
 ))}
 </ul>
 </div>
 <div>
 <h3 className="about-text" style={{ marginBottom: '.5rem' }}>Envoyez-moi un message</h3>
 <h3 style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>Remplissez le formulaire et je vous réponds rapidement.</h3>
 {sent ? (
 <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
 <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,85,0,.12)', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
 <AnimIcon type="check" size={28} color="#FF5500" />
 </div>
 <h3 style={{ fontFamily: "'Clash Display','Syne',sans-serif", fontWeight: 700, marginBottom: '.5rem' }}>Message envoyé !</h3>
 <h3 style={{ fontSize: '.85rem', color: 'var(--muted)' }}>Je vous réponds sous 24h. <AnimIcon type="rocket" size={14} /></h3>
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
 <span>{btnTxt}</span>
 <span className="btn-arr" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>
 </button>
 <div className="form-note">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
 Vos données sont sécurisées et ne seront jamais partagées.
 </div>
 </form>
 )}
 </div>
 </div>

 
 
 </section>
 )
}

/* ════════════════════════════════════════════
 FOOTER — simplifié v7 : QR centré + AKATECH MASSIF
 ════════════════════════════════════════════ */

/* BeamsInteractive — fond statique orange, sans réactivité curseur */
function BeamsInteractive() {
 return (
 <Beams
 beamWidth={2}
 beamHeight={15}
 beamNumber={14}
 lightColor="#FF5500"
 speed={1.8}
 noiseIntensity={1.5}
 scale={0.18}
 rotation={0}
 />
 )
}


function Footer() {

 /* Même transition "staircase" que la Navbar pour toute navigation
 déclenchée depuis le footer (cf. GooeyTransition.jsx). */
 const scrollToSection = useGooeyTransition('desktop')

 return (
 <footer id="main-footer">

 {/* Barre de bas — style "verteal" : nav gauche / logo centré / CTA+email droite, filigrane AKATECH en fond.
     Fond transparent : laisse apparaître le Beams animé de full-beams-zone derrière. */}
 <div className="ft-bottom-band">
 <span className="ft-aka-watermark" aria-hidden="true">AKATECH</span>

 <div className="ft-bb-inner">
 <div className="ft-bb-top">
 <nav className="ft-bb-nav">
 {NAV_LINKS.map((l, i) => (
 <a key={i} href={`#${l.id}`} onClick={e => { e.preventDefault(); scrollToSection(l.id) }}>
 {l.label}
 </a>
 ))}
 </nav>

 <div className="ft-bb-logo">
 <img src="/assets/images/logo-akatech.webp" alt="AKATech" loading="lazy" onError={e => { e.target.style.display = 'none' }} />
 </div>

 <div className="ft-bb-right">
 <span className="ft-bb-copyright">© 2026 AKATech</span>
 <a href="#contact" className="ft-bb-cta" onClick={e => { e.preventDefault(); const el = document.getElementById('contact'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' }) }}>
 Réserver un appel
 <span className="ft-bb-cta-arrow" aria-hidden="true">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
 </span>
 </a>
 <a href="mailto:wthomasss06@gmail.com" className="ft-bb-email">wthomasss06@gmail.com</a>
 </div>
 </div>
 </div>
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

 /* ── Entrée du header (logo / horloge / toggle / hamburger) ── */
 const headerZones = document.querySelectorAll('.nb-topbar > div')
 if (headerZones.length) {
 gsap.fromTo(
 headerZones,
 { y: -20, opacity: 0 },
 {
 y: 0, opacity: 1,
 duration: 0.5,
 ease: 'power3.out',
 stagger: 0.06,
 delay: 0.12,
 clearProps: 'transform',
 }
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

 /* Son de touche — système oscar */
 const { muted, toggleMute } = useSoundSystem()

 return (
 <>
 {/* Grain cinématographique — overlay global, au-dessus de tout le contenu */}
 <div className="cine-grain" aria-hidden="true" />
 <Loader onDone={handleLoaderDone} />
 <div id="cursor-dot" />
 <div id="scroll-bar"><div id="scroll-fill" /></div>
 <CursorAndScrollBar />
 <Toast show={toastVisible} />
 <SoundToggle muted={muted} onToggle={toggleMute} />
 <Navbar theme={theme} onToggleTheme={toggleTheme} />
 <main>
 <Hero />
 <FeaturedCreationDesktop />
 <ProjectsHorizontalScroll />
 <Marquee />
 <About />
 <Timeline />
 <HorizontalParallax />
 <SkillsSection />
 <ProcessSection />
 <ServicesSection />
 <PricingSection />
 <TestimonialsSection />
 <FAQSection />
 <div className="full-beams-zone force-dark">
 <div className="full-beams-zone__bg" aria-hidden="true">
 <BeamsInteractive />
 </div>
 <ContactSection onToast={showToast} />
 <Footer />
 </div>
 </main>
 <ScrollTopBtn />
 </>
 )
}
'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Monitor, Code, Check, Award, Heart, Globe, Zap, Star, Target, Rocket, MessageCircle, ExternalLink } from 'lucide-react'

/* ─── BlurReveal ─────────────────────────────────────────── */
function BlurReveal({ children, delay = 0, direction = 'up', style = {}, once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  const dirMap = { up: { y: 40, x: 0 }, right: { y: 0, x: 40 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 } }
  const off = dirMap[direction] || { y: 40, x: 0 }
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, filter: 'blur(12px)', ...off }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}>
      {children}
    </motion.div>
  )
}

/* ─── LetterReveal ───────────────────────────────────────── */
function LetterReveal({ text, style = {}, stagger = 0.028 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <span ref={ref} style={{ display: 'inline', ...style }}>
      {[...text].map((char, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{ duration: 0.42, ease: 'easeOut', delay: i * stagger }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {char}
        </motion.span>
      ))}
    </span>
  )
}

/* ─── TiltCard ───────────────────────────────────────────── */
function TiltCard({ children, style = {}, intensity = 12, perspective = 900 }) {
  const ref = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(null)
  const apply = (mx, my) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const rx = ((my - r.top - r.height / 2) / (r.height / 2)) * -intensity
    const ry = ((mx - r.left - r.width / 2) / (r.width / 2)) * intensity
    const px = ((mx - r.left) / r.width) * 100
    const py = ((my - r.top) / r.height) * 100
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`
      el.style.transition = 'transform .07s linear'
      if (glowRef.current) { glowRef.current.style.background = `radial-gradient(240px circle at ${px}% ${py}%,rgba(34,200,100,.12),transparent 65%)`; glowRef.current.style.opacity = '1' }
    })
  }
  const reset = () => {
    const el = ref.current; if (!el) return
    cancelAnimationFrame(rafRef.current)
    el.style.transition = 'transform .45s cubic-bezier(.25,.46,.45,.94)'
    el.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale3d(1,1,1)`
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }
  return (
    <div ref={ref} style={{ ...style, willChange: 'transform', transformStyle: 'preserve-3d', position: 'relative' }}
      onMouseMove={e => apply(e.clientX, e.clientY)} onMouseLeave={reset}>
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0, transition: 'opacity .12s', borderRadius: 18 }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </div>
  )
}

/* ─── StickyCTABlock ─────────────────────────────────────── */
function StickyCTABlock({ message, cta, href = 'https://wa.me/2250142507750', variant = 'default', zIndex = 2, rounded = false }) {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-20%' })
  const isStrong = variant === 'strong'
  const bg = isStrong ? (T.light ? '#f0fdf4' : '#061a0a') : (T.light ? '#ffffff' : '#051208')
  return (
    <div ref={ref} style={{ position: 'sticky', top: 0, zIndex, background: bg, borderRadius: rounded ? '28px 28px 0 0' : 0, boxShadow: rounded ? '0 -24px 60px rgba(0,0,0,.28)' : 'none', overflow: 'hidden', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 5%' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: T.light ? .3 : .15 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: isStrong ? 'radial-gradient(ellipse,rgba(34,200,100,.12),transparent 65%)' : 'radial-gradient(ellipse,rgba(34,200,100,.06),transparent 65%)', pointerEvents: 'none' }} />
      <motion.div initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }} animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: .8, ease: [.22,1,.36,1] }}
        style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700 }}>
        {isStrong && (
          <motion.div initial={{ opacity: 0, scale: .9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: .1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(34,200,100,.1)', border: '1px solid rgba(34,200,100,.25)', marginBottom: '1.5rem', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c864', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 700, color: '#22c864', letterSpacing: '.1em', textTransform: 'uppercase' }}>Prêt à collaborer ?</span>
          </motion.div>
        )}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}
          style={{ fontSize: isStrong ? 'clamp(1.5rem,3.2vw,2.4rem)' : 'clamp(1.2rem,2.5vw,1.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.3, marginBottom: '2rem' }}>
          {message}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .28 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a href={href} target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
            {cta} <ArrowRight size={16} />
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}
import { useTheme } from '@/lib/theme'
import { SectionEye, AnimatedCounter, LazyImg, MarqueeStrip, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { STATS, TESTIMONIALS } from '@/lib/data'



const SKILLS = ['React','Next.js','Django','Python','Node.js','PostgreSQL','MySQL','Tailwind CSS','Framer Motion','Vercel','AWS','Docker','REST API','GraphQL','Mobile Money API']

const VALUES = [
  { icon: Target, title: 'Résultats concrets', desc: "Chaque solution est conçue pour générer des résultats mesurables : plus de clients, plus de revenus, moins de tâches manuelles." },
  { icon: Heart, title: 'Adapté au marché africain', desc: "Je comprends les réalités locales — Mobile Money, coupures internet, faible débit. Vos solutions fonctionnent dans votre contexte." },
  { icon: Zap, title: 'Livraison rapide', desc: "Pas d'attente de 3 mois. Les projets sont livrés en 5 à 21 jours selon la complexité, avec des jalons clairs à chaque étape." },
  { icon: Star, title: 'Qualité premium', desc: "Code propre, design sur-mesure, animations soignées. Chaque détail compte pour que votre solution se démarque." },
]

const TIMELINE = [
  { year: '2022', title: 'Les débuts', desc: "Premier projet freelance livré : un site vitrine pour un commerçant abidjanais. Le début d'une aventure." },
  { year: '2023', title: 'Première app SaaS', desc: "Développement de TechFlow, une application de gestion de projets pour PME. 100+ utilisateurs dès le lancement." },
  { year: '2024', title: 'AKATech Agence', desc: "Transformation en agence officielle. Lancement de services structurés et premiers clients récurrents." },
  { year: '2025', title: "Aujourd'hui", desc: "+10 projets livrés, 100% de clients satisfaits. L'agence continue de grandir et d'innover." },
]

function HeroAbout() {
  const T = useTheme()
  const layerBgRef   = useRef(null)
  const layerMidRef  = useRef(null)
  const layerForeRef = useRef(null)

  useEffect(() => {
    const onMouse = (e) => {
      const x = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2)
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      const rX = y * -5, rY = x * 5
      const apply = (el, sp) => { if (el) el.style.transform = `translate3d(${x*50*sp}px,${y*50*sp}px,0) rotateX(${rX}deg) rotateY(${rY}deg)` }
      apply(layerBgRef.current, 0.2); apply(layerMidRef.current, 0.5); apply(layerForeRef.current, 0.8)
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const s = window.pageYOffset
      if (layerBgRef.current) { layerBgRef.current.style.transform = `scale(${1 + s * 0.0005}) translateY(${s * 0.2}px)`; layerBgRef.current.style.filter = `blur(${Math.min(s / 60, 12)}px)` }
      if (layerMidRef.current) { layerMidRef.current.style.opacity = Math.max(0, 1 - s / 700); layerMidRef.current.style.transform = `translateY(${s * 0.4}px)`; layerMidRef.current.style.filter = `blur(${s / 100}px)` }
      if (layerForeRef.current) { layerForeRef.current.style.transform = `translateY(${-s * 0.96}px)`; layerForeRef.current.style.opacity = Math.max(0, 1 - s / 400) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', background: '#060e09' }}>
      <style>{`
        .hero-about-grid {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 4rem;
          align-items: start;
        }
        .hero-title-block  { grid-column: 1; grid-row: 1; }
        .hero-text-block   { grid-column: 1; grid-row: 2; }
        .hero-photos-block { grid-column: 2; grid-row: 1 / 3; align-self: center; }

        @media (max-width: 768px) {
          .hero-about-grid {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .hero-title-block  { order: 1; }
          .hero-photos-block { order: 2; }
          .hero-text-block   { order: 3; }
          .hero-photo-grid   {
            grid-template-rows: 220px 160px !important;
          }
        }
      `}</style>

      {/* Layer BG */}
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,14,9,.95) 100%)' }} />
      </div>

      {/* Layer MID — grille 2 colonnes */}
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, width: '100%', padding: '9rem 5% 6rem', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <div className="hero-about-grid">

          {/* ① Titre */}
          <motion.div className="hero-title-block"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
            <SectionEye label="// Qui sommes-nous" />
            <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,3.5rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
              Votre croissance digitale,<br />
              <GreenUnderline><span className="text-gradient">c'est notre mission.</span></GreenUnderline>
            </h1>
          </motion.div>

          {/* ② Photos */}
          <motion.div className="hero-photos-block"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .2 }}>
            <div className="hero-photo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '280px 200px', gap: '1rem' }}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ gridRow: '1 / 3', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(34,200,100,.2)', boxShadow: '8px 8px 32px rgba(0,0,0,.3)' }}>
                <LazyImg src="/images/about-1.jpg" alt="AKATech Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={32} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(34,200,100,.15)', boxShadow: '6px 6px 24px rgba(0,0,0,.2)' }}>
                <LazyImg src="/images/about-2.jpg" alt="Bureau" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Monitor size={28} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(34,200,100,.15)', boxShadow: '6px 6px 24px rgba(0,0,0,.2)', position: 'relative' }}>
                <LazyImg src="/images/about-3.jpg" alt="Développement" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={28} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
              </motion.div>
            </div>
          </motion.div>

          {/* ③ Texte + boutons */}
          <motion.div className="hero-text-block"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .15, ease: [.22,1,.36,1] }}>
            <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.85, marginBottom: '.9rem', marginTop: '1.5rem' }}>
              <strong style={{ color: T.textMain }}>AKATech</strong> accompagne les entrepreneurs et PME en Côte d'Ivoire qui veulent une présence digitale sérieuse — pour gagner en crédibilité, attirer des clients et automatiser leur activité.
            </p>
            <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.85, marginBottom: '2rem' }}>
              Je suis <strong style={{ color: T.textMain }}>M'Bollo Aka Elvis</strong>, développeur full-stack basé à Abidjan. Avec 3 ans d'expérience et +10 projets livrés, je conçois des solutions web qui répondent aux réalités du marché africain.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised">
                Me contacter <MessageCircle size={16} />
              </a>
              <a href="https://akafolio160502.vercel.app/" target="_blank" rel="noreferrer" className="btn-ghost">
                Mon portfolio <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Layer FORE — particules */}
      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#22c864', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>
    </section>
  )
}

function StatsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(34,200,100,.05),transparent 65%)', pointerEvents: 'none' }} />
      <style>{`@media(max-width:640px){.stats-grid{grid-template-columns:1fr 1fr !important;gap:.75rem !important}.stats-grid>div{padding:1.4rem 1rem !important}}`}</style>
      <BlurReveal style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
          {STATS.map(({ val, suffix, label }, i) => (
            <TiltCard key={label} intensity={8} style={{ borderRadius: 16 }}>
              <motion.div className="sku-card"
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
                style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'radial-gradient(circle at 100% 0%,rgba(34,200,100,.08),transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green, lineHeight: 1 }}>
                  <AnimatedCounter target={val} suffix={suffix} />
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.6rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.5rem' }}>{label}</div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </BlurReveal>
    </section>
  )
}

function SkillsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <BlurReveal direction="left">
          <SectionEye label="// Stack Technique" />
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1.2rem' }}>
            Les technologies qui font{' '}
            <GreenUnderline><span className="text-gradient"><LetterReveal text="la différence" stagger={0.035} /></span></GreenUnderline>
          </h2>
          <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.8, marginBottom: '2rem' }}>
            J'utilise les meilleures technologies modernes — sélectionnées pour leur performance, leur fiabilité et leur adéquation avec vos besoins réels.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {SKILLS.map((s, i) => (
              <motion.span key={s} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3 + i * .04 }}
                whileHover={{ y: -2, background: 'rgba(34,200,100,.15)' }}
                style={{ padding: '.35rem .85rem', background: 'rgba(34,200,100,.07)', border: `1px solid ${T.border}`, borderRadius: 100, fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em', cursor: 'default', transition: 'all .2s' }}>
                {s}
              </motion.span>
            ))}
          </div>
        </BlurReveal>

        <BlurReveal direction="right" delay={0.2}>
          <TiltCard intensity={10} style={{ borderRadius: 16 }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '8px 8px 32px rgba(0,0,0,.3)', height: 400 }}>
              <LazyImg src="/images/about-4.jpg" alt="Développeur" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={48} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
            </div>
          </TiltCard>
        </BlurReveal>
      </div>
    </section>
  )
}

function ValuesSection() {
  const T = useTheme()
  const dirs = ['right', 'up', 'left', 'up']
  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      {/* Big decorative bg text */}
      <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', fontFamily: "'Syne',sans-serif", fontSize: 'clamp(10rem,18vw,18rem)', fontWeight: 900, color: T.light ? 'rgba(34,200,100,.04)' : 'rgba(34,200,100,.03)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
        VALUES
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <BlurReveal>
            <SectionEye label="// Nos Valeurs" center />
          </BlurReveal>
          <BlurReveal delay={0.12}>
            <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              Ce qui nous{' '}
              <GreenUnderline><span className="text-gradient"><LetterReveal text="distingue" stagger={0.04} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.2rem' }}>
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <BlurReveal key={title} delay={i * 0.1} direction={dirs[i % dirs.length]}>
              <motion.div className="sku-card"
                whileHover={{ y: -5 }}
                style={{ padding: '2rem', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle at 100% 0%,rgba(34,200,100,.1),transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(34,200,100,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  <Icon size={24} style={{ color: T.green }} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.5rem' }}>
                  <LetterReveal text={title} stagger={0.025} />
                </h3>
                <p style={{ fontSize: '.82rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineSection() {
  const T = useTheme()
  return (
    <section style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <BlurReveal>
            <SectionEye label="// Notre Histoire" center />
          </BlurReveal>
          <BlurReveal delay={0.12}>
            <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              L'évolution d'<GreenUnderline><span className="text-gradient"><LetterReveal text="AKATech" stagger={0.05} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${T.green}, transparent)`, transform: 'translateX(-50%)' }} />
          {TIMELINE.map(({ year, title, desc }, i) => (
            <BlurReveal key={year} delay={i * 0.15} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end', marginBottom: '3rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', top: '1.2rem', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#22c864', border: '3px solid rgba(34,200,100,.3)', boxShadow: '0 0 16px rgba(34,200,100,.4)', zIndex: 1 }} />
                <motion.div className="sku-card" whileHover={{ y: -4, scale: 1.01 }} style={{ width: '44%', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'radial-gradient(circle at 100% 0%,rgba(34,200,100,.1),transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green, letterSpacing: '.08em', marginBottom: '.5rem' }}>{year}</div>
                  <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.4rem' }}>
                    <LetterReveal text={title} stagger={0.03} />
                  </h3>
                  <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.6 }}>{desc}</p>
                </motion.div>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <div>
      <HeroAbout />
      <StatsSection />
      <MarqueeStrip />
      <SkillsSection />

      {/* Sticky CTA intermédiaire */}
      <div style={{ position: 'relative' }}>
        <StickyCTABlock
          message="Vous cherchez un développeur qui comprend votre marché ? Discutons-en gratuitement."
          cta="Parler à Elvis"
          variant="default"
          zIndex={2}
        />
        <div style={{ position: 'relative', zIndex: 3 }}>
          <ValuesSection />
        </div>
      </div>

      <TimelineSection />

      <StickyCTABlock
        message="Prêt à collaborer avec AKATech ? Discutons de votre projet dès maintenant."
        cta="Démarrer un projet"
        variant="strong"
        zIndex={2}
        rounded={true}
      />
    </div>
  )
}
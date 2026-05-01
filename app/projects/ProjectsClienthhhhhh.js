'use client'
import { useRef, useEffect, useState } from 'react'
import {
  motion,
  AnimatePresence,
} from 'framer-motion'
import { ArrowRight, Code, ExternalLink } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, LazyImg, SectionCTA, LaserBeam, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { PROJECTS } from '@/lib/data'



/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroRealisations() {
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
    <section style={{ height: '70vh', minHeight: 520, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060e09' }}>
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,14,9,.95) 100%)' }} />
      </div>
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, maxWidth: 900, padding: '0 5%', textAlign: 'center', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <SectionEye label="// Nos Réalisations" center />
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            +10 réalisations livrées,<br /><GreenUnderline><span className="text-gradient">100% satisfaits.</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Sites vitrines, e-commerces, SaaS, portfolios… Chaque réalisation est une histoire de transformation digitale réussie.
          </p>
        </motion.div>
      </div>
      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#22c864', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────
   IMAGE CARD — colonne droite, skew alterné
   Inspiré de vrai_cta.html (figures skew-x)
──────────────────────────────────────────────── */
function ProjectImageCard({ project, index }) {
  const isEven = index % 2 === 0

  return (
    <figure style={{
      display: 'grid',
      placeContent: 'center',
      transform: isEven ? 'skewX(-4deg)' : 'skewX(4deg)',
      padding: '0.25rem',
    }}>
      <div
        style={{
          position: 'relative',
          width: 'clamp(240px, 36vw, 420px)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,.55)',
          border: '1px solid rgba(34,200,100,.18)',
          transition: 'transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.04) skewX(0deg)'
          e.currentTarget.style.boxShadow = '0 40px 100px rgba(0,0,0,.65), 0 0 50px rgba(34,200,100,.15)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,.55)'
        }}
      >
        <LazyImg
          src={project.img}
          alt={project.title}
          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
          placeholder={
            <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code size={40} style={{ color: 'rgba(34,200,100,.2)' }} />
            </div>
          }
        />

        {/* Overlay bas */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,8,6,.9) 0%, transparent 55%)', pointerEvents: 'none' }} />

        {/* Index pill */}
        <div style={{
          position: 'absolute', top: '.85rem', left: '.85rem',
          fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: '.58rem',
          color: 'rgba(34,200,100,.7)', letterSpacing: '.12em',
          background: 'rgba(3,8,6,.65)', backdropFilter: 'blur(6px)',
          padding: '.18rem .65rem', borderRadius: 100,
          border: '1px solid rgba(34,200,100,.2)',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Badges + résultat */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.3rem' }}>
          <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '.22rem .7rem', borderRadius: 100, background: 'rgba(34,200,100,.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,200,100,.35)', fontFamily: "'Syne',sans-serif", fontSize: '.6rem', fontWeight: 700, color: '#22c864' }}>
              {project.type}
            </span>
            {project.live && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '.22rem .7rem', borderRadius: 100, background: 'rgba(34,200,100,.88)', fontFamily: "'Syne',sans-serif", fontSize: '.58rem', color: '#fff', fontWeight: 700 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                LIVE
              </span>
            )}
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '.9rem', color: '#22c864' }}>
            {project.result}
          </span>
        </div>
      </div>
    </figure>
  )
}

/* ────────────────────────────────────────────────
   DETAIL PANEL — sticky à gauche
   Se met à jour en fonction de l'image visible
──────────────────────────────────────────────── */
function ProjectDetailPanel({ projects, activeIndex, T }) {
  const project = projects[activeIndex]
  if (!project) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
        transition={{ duration: .5, ease: [.22, 1, .36, 1] }}
        style={{ width: '100%' }}
      >
        {/* Compteur */}
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '.68rem', fontWeight: 900, color: 'rgba(34,200,100,.45)', letterSpacing: '.18em', marginBottom: '1.6rem' }}>
          {String(activeIndex + 1).padStart(2, '0')} — {String(projects.length).padStart(2, '0')}
        </div>

        {/* Type + LIVE */}
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          <span style={{ padding: '.25rem .75rem', borderRadius: 100, background: 'rgba(34,200,100,.12)', border: '1px solid rgba(34,200,100,.3)', fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 700, color: '#22c864' }}>
            {project.type}
          </span>
          {project.live && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '.25rem .75rem', borderRadius: 100, background: 'rgba(34,200,100,.88)', fontFamily: "'Syne',sans-serif", fontSize: '.6rem', color: '#fff', fontWeight: 700 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
              EN LIGNE
            </span>
          )}
        </div>

        {/* Titre */}
        <h3 style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.15, marginBottom: '.8rem' }}>
          {project.title}
        </h3>

        {/* Résultat */}
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: '1.35rem', color: '#22c864', marginBottom: '1.2rem', textShadow: '0 0 30px rgba(34,200,100,.35)', display: 'inline-block' }}>
          {project.result}
        </div>

        {/* Description */}
        <p style={{ fontSize: '.88rem', color: T.textSub, lineHeight: 1.8, marginBottom: '1.6rem' }}>
          {project.desc}
        </p>

        {/* Tech pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '2rem' }}>
          {project.tech.map(t => (
            <span key={t} style={{ padding: '.22rem .7rem', borderRadius: 100, background: 'rgba(34,200,100,.07)', border: `1px solid ${T.border}`, fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: '#22c864' }}>
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        {project.url ? (
          <a href={project.url} target="_blank" rel="noreferrer"
            className="btn-raised"
            style={{ fontSize: '.88rem', padding: '.85rem 1.8rem', display: 'inline-flex', alignItems: 'center', gap: '.45rem' }}>
            <ExternalLink size={14} /> Voir le projet
          </a>
        ) : (
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.75rem', color: T.textMuted, padding: '.5rem 1.1rem', borderRadius: 100, border: `1px solid ${T.border}` }}>
            Démo locale
          </span>
        )}

        {/* Barre de progression */}
        <div style={{ display: 'flex', gap: '.35rem', marginTop: '2.5rem' }}>
          {projects.map((_, i) => (
            <div key={i} style={{
              height: 3, borderRadius: 2,
              flex: i === activeIndex ? 4 : 1,
              background: i === activeIndex ? '#22c864' : 'rgba(34,200,100,.18)',
              transition: 'flex .45s cubic-bezier(.22,1,.36,1), background .3s',
            }} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ────────────────────────────────────────────────
   SECTION PRINCIPALE
   Gauche : infos projet sticky (reste en place)
   Droite : images qui scrollent — skew alterné
   Inspiré directement de vrai_cta.html
──────────────────────────────────────────────── */
function StackedRealisations() {
  const T = useTheme()
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const cards = section.querySelectorAll('[data-project-card]')
      if (!cards.length) return

      const viewportCenter = window.innerHeight * 0.5
      let closest = 0
      let closestDist = Infinity

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter)
        if (dist < closestDist) { closestDist = dist; closest = i }
      })

      setActiveIndex(closest)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section style={{ background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .14 }} />

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 5% 3rem', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: '#22c864', marginBottom: '.4rem', letterSpacing: '.1em' }}>
              // SCROLL POUR PARCOURIR
            </p>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: T.textMain, letterSpacing: '-.03em', margin: 0 }}>
              {PROJECTS.length} réalisations,{' '}
              <GreenUnderline><span className="text-gradient">une par une.</span></GreenUnderline>
            </h2>
          </div>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.5rem 1rem', borderRadius: 100, background: 'rgba(34,200,100,.07)', border: '1px solid rgba(34,200,100,.2)' }}
          >
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: '#22c864' }}>
              ↓ Scrollez pour découvrir
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* ── GRID 2 COLONNES ── */}
      <div
        ref={sectionRef}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 5% 10rem',
          position: 'relative',
          zIndex: 1,
          gap: '3rem',
          alignItems: 'start',
        }}
        className="projects-sticky-grid"
      >

        {/* ── COLONNE GAUCHE : STICKY ── */}
        <div style={{ position: 'sticky', top: '12vh', alignSelf: 'start' }}>
          <div style={{
            padding: '2.5rem',
            borderRadius: 24,
            background: T.light ? 'rgba(255,255,255,.92)' : 'rgba(6,14,9,.78)',
            border: '1px solid rgba(34,200,100,.14)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,.35), 0 0 0 1px rgba(34,200,100,.05)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Glow déco */}
            <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,200,100,.07), transparent 70%)', pointerEvents: 'none' }} />
            <ProjectDetailPanel projects={PROJECTS} activeIndex={activeIndex} T={T} />
          </div>
        </div>

        {/* ── COLONNE DROITE : IMAGES QUI SCROLLENT ── */}
        <div style={{ display: 'grid', gap: '6rem', paddingTop: '15vh', paddingBottom: '15vh' }}>
          {PROJECTS.map((project, i) => (
            <div key={project.title} data-project-card={i}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-10%' }}
                transition={{ duration: .7, ease: [.22, 1, .36, 1] }}
              >
                <ProjectImageCard project={project} index={i} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive mobile : cacher le panel gauche */}
      <style>{`
        @media (max-width: 768px) {
          .projects-sticky-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .projects-sticky-grid > :first-child {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}

/* ────────────────────────────────────────────────
   CTA FINAL
──────────────────────────────────────────────── */
function StartRealisation() {
  const T = useTheme()
  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionEye label="// Votre Projet" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1rem' }}>
            Votre réalisation peut être<br />
            <GreenUnderline><span className="text-gradient">la prochaine ici.</span></GreenUnderline>
          </h2>
          <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.75, maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Partagez votre idée. On l'écoute, on la chiffre gratuitement et on la réalise dans les délais. Aucun engagement pour commencer.
          </p>
          <a
            href="https://wa.me/2250142507750?text=Bonjour AKATech, j'ai un projet web à vous soumettre."
            target="_blank" rel="noreferrer"
            className="btn-raised"
            style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
            Démarrer ma réalisation <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────
   PAGE EXPORT
──────────────────────────────────────────────── */
export default function RealisationsPage() {
  return (
    <div>
      <HeroRealisations />
      <StackedRealisations />
      <StartRealisation />
    </div>
  )
}
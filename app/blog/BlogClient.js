'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  Clock, ArrowRight, Tag, Search, BookOpen,
  TrendingUp, Globe, ShoppingCart, Code, Zap,
  Target, Rocket, PenTool,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { BLOG_POSTS } from '@/lib/data'

const CATEGORIES = ['Tous', 'Stratégie Digitale', 'E-Commerce', 'Développement Web', 'SEO']
const CAT_ICONS = { 'Stratégie Digitale': TrendingUp, 'E-Commerce': ShoppingCart, 'Développement Web': Code, 'SEO': Globe }

// ═══════════════════════════════════════════════════════════════
// ── ANIMATION COMPONENTS ─────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

function BlurReveal({ children, delay = 0, direction = 'up', style = {}, className = '', once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  const off = { up: { y: 40, x: 0 }, right: { y: 0, x: 40 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 } }[direction] || { y: 40, x: 0 }
  return (
    <motion.div ref={ref} style={style} className={className}
      initial={{ opacity: 0, filter: 'blur(12px)', ...off }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}>
      {children}
    </motion.div>
  )
}

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

function TiltCard({ children, style = {}, className = '', intensity = 12, perspective = 900 }) {
  const ref = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(null)
  const applyTilt = useCallback((mx, my) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = ((my - rect.top - rect.height / 2) / (rect.height / 2)) * -intensity
    const ry = ((mx - rect.left - rect.width / 2) / (rect.width / 2)) * intensity
    const px = ((mx - rect.left) / rect.width) * 100
    const py = ((my - rect.top) / rect.height) * 100
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`
      el.style.transition = 'transform .07s linear'
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(260px circle at ${px}% ${py}%, rgba(34,200,100,.13) 0%, transparent 65%)`
        glowRef.current.style.opacity = '1'
      }
    })
  }, [intensity, perspective])
  const resetTilt = useCallback(() => {
    const el = ref.current; if (!el) return
    cancelAnimationFrame(rafRef.current)
    el.style.transition = 'transform .45s cubic-bezier(.25,.46,.45,.94)'
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }, [perspective])
  useEffect(() => {
    const el = ref.current; if (!el) return
    const onTouchMove = e => { if (e.touches?.[0]) applyTilt(e.touches[0].clientX, e.touches[0].clientY) }
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', resetTilt, { passive: true })
    return () => { el.removeEventListener('touchmove', onTouchMove); el.removeEventListener('touchend', resetTilt) }
  }, [applyTilt, resetTilt])
  return (
    <div ref={ref} className={className}
      style={{ ...style, willChange: 'transform', transformStyle: 'preserve-3d', position: 'relative' }}
      onMouseMove={e => applyTilt(e.clientX, e.clientY)} onMouseLeave={resetTilt}>
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0, transition: 'opacity .12s', borderRadius: 18 }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </div>
  )
}

function AnimatedBeamGrid({ containerRef, nodeIds, connections, animKey = 'beam' }) {
  const svgRef = useRef(null)
  const [paths, setPaths] = useState([])
  const draw = useCallback(() => {
    if (!svgRef.current || !containerRef?.current) return
    const cRect = containerRef.current.getBoundingClientRect()
    const mainEl = document.getElementById(nodeIds.center)
    if (!mainEl) return
    const mRect = mainEl.getBoundingClientRect()
    const tx = mRect.left - cRect.left + mRect.width / 2
    const ty = mRect.top - cRect.top + mRect.height / 2
    const built = connections.map((conn, idx) => {
      const fromEl = document.getElementById(conn.id)
      if (!fromEl) return null
      const r = fromEl.getBoundingClientRect()
      const sx = r.left - cRect.left + r.width / 2
      const sy = r.top - cRect.top + r.height / 2
      const cx = (sx + tx) / 2 + (conn.cx || 0)
      const cy = (sy + ty) / 2 + (conn.cy || 0)
      return { d: `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`, color: conn.color, delay: `${idx * 0.4}s` }
    }).filter(Boolean)
    setPaths(built)
  }, [containerRef, connections, nodeIds])
  useEffect(() => {
    const t = setTimeout(draw, 80)
    window.addEventListener('resize', draw)
    return () => { clearTimeout(t); window.removeEventListener('resize', draw) }
  }, [draw])
  const kf = `${animKey}Flow`
  return (
    <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}>
      <defs>
        {paths.map((p, i) => {
          const pts = p.d.split(' ')
          return (
            <linearGradient key={i} id={`${animKey}-g-${i}`} gradientUnits="userSpaceOnUse"
              x1={pts[1]} y1={pts[2]} x2={pts[pts.length - 2]} y2={pts[pts.length - 1]}>
              <stop offset="0%" stopColor={p.color} stopOpacity="0" />
              <stop offset="40%" stopColor={p.color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0" />
            </linearGradient>
          )
        })}
      </defs>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke="rgba(34,200,100,0.08)" strokeWidth="1.5" />
          <path d={p.d} fill="none" stroke={`url(#${animKey}-g-${i})`} strokeWidth="2.5"
            strokeLinecap="round" strokeDasharray="50 300"
            style={{ animation: `${kf} 2.8s linear infinite`, animationDelay: p.delay }} />
        </g>
      ))}
      <style>{`@keyframes ${kf} { from { stroke-dashoffset: 350; } to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  )
}

function StickyCTABlock({ message, cta, href = 'https://wa.me/2250142507750', variant = 'default', zIndex = 2, rounded = false }) {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-20%' })
  const isStrong = variant === 'strong'
  const bg = isStrong ? (T.light ? '#f0fdf4' : '#061a0a') : (T.light ? '#ffffff' : '#051208')
  return (
    <div ref={ref} style={{
      position: 'sticky', top: 0, zIndex,
      background: bg,
      borderRadius: rounded ? '28px 28px 0 0' : 0,
      boxShadow: rounded ? '0 -24px 60px rgba(0,0,0,.28)' : 'none',
      overflow: 'hidden', minHeight: '60vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '5rem 5%',
    }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: T.light ? .3 : .15 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: isStrong ? 'radial-gradient(ellipse,rgba(34,200,100,.12),transparent 65%)' : 'radial-gradient(ellipse,rgba(34,200,100,.06),transparent 65%)', pointerEvents: 'none' }} />
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: .8, ease: [.22,1,.36,1] }}
        style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700 }}>
        {isStrong && (
          <motion.div
            initial={{ opacity: 0, scale: .9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: .1, duration: .5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(34,200,100,.1)', border: '1px solid rgba(34,200,100,.25)', marginBottom: '1.5rem', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c864', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 700, color: '#22c864', letterSpacing: '.1em', textTransform: 'uppercase' }}>Prêt à démarrer ?</span>
          </motion.div>
        )}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15, duration: .65, ease: [.22,1,.36,1] }}
          style={{ fontSize: isStrong ? 'clamp(1.5rem,3.2vw,2.4rem)' : 'clamp(1.2rem,2.5vw,1.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.3, marginBottom: '2rem' }}>
          {message}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .28, duration: .55 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a href={href} target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
            {cta} <ArrowRight size={16} />
          </a>
          <Link href="/blog" className="btn-ghost" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
            Tous les articles
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── HERO ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
function HeroBlog() {
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
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, maxWidth: 800, padding: '0 5%', textAlign: 'center', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
          <SectionEye label="// Blog & Ressources" center />
          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Insights & conseils<br />
            <GreenUnderline><span className="text-gradient">pour votre business digital</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Stratégie digitale, développement web, SEO et e-commerce — des contenus concrets pour les entrepreneurs ivoiriens.
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

// ═══════════════════════════════════════════════════════════════
// ── FEATURED POST — BlurReveal + TiltCard + LetterReveal ─────
// ═══════════════════════════════════════════════════════════════
function FeaturedPost() {
  const T = useTheme()
  const post = BLOG_POSTS[0]

  return (
    <section style={{ padding: '3rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <BlurReveal delay={0} style={{ marginBottom: '1.5rem' }}>
          <SectionEye label="// Article vedette" />
        </BlurReveal>
        <BlurReveal delay={0.1}>
          <TiltCard intensity={8} perspective={1100} className="sku-card"
            style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 340 }}>
            {/* Image */}
            <div style={{ position: 'relative', minHeight: 280 }}>
              <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(3,8,6,.3),transparent)' }} />
              <div className="no-pill-mobile" style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(34,200,100,.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,200,100,.35)', fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: '#22c864' }}>
                ⭐ Article vedette
              </div>
            </div>
            {/* Content */}
            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem' }}>
                <span style={{ padding: '.25rem .8rem', borderRadius: 100, background: T.light ? 'rgba(22,163,74,.08)' : 'rgba(34,200,100,.08)', border: `1px solid ${T.border}`, fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em' }}>
                  {post.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.72rem', color: T.textMuted }}>
                  <Clock size={11} />{post.readTime}
                </span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.3, marginBottom: '.9rem' }}>
                <LetterReveal text={post.title} stagger={0.018} />
              </h2>
              <p style={{ fontSize: '.85rem', color: T.textSub, lineHeight: 1.7, marginBottom: '1.8rem' }}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="btn-raised" style={{ display: 'inline-flex', padding: '.7rem 1.5rem', fontSize: '.84rem', width: 'fit-content' }}>
                Lire l'article <ArrowRight size={14} />
              </Link>
            </div>
          </TiltCard>
        </BlurReveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── BLOG GRID — AnimatedBeamGrid + TiltCard + BlurReveal ─────
// ═══════════════════════════════════════════════════════════════
const BLOG_NODES = [
  { id: 'blog-n-0', Icon: TrendingUp,  label: 'Stratégie',  color: '#22c864' },
  { id: 'blog-n-1', Icon: ShoppingCart,label: 'E-Commerce', color: '#4ade80' },
  { id: 'blog-n-2', Icon: Code,        label: 'Dev Web',    color: '#22c864' },
  { id: 'blog-n-3', Icon: Globe,       label: 'SEO',        color: '#86efac' },
  { id: 'blog-n-4', Icon: Zap,         label: 'Growth',     color: '#4ade80' },
  { id: 'blog-n-5', Icon: BookOpen,    label: 'Ressources', color: '#22c864' },
]

function BlogGrid() {
  const T = useTheme()
  const ref = useRef(null)
  const beamContainerRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [searchQuery, setSearchQuery] = useState('')

  const beamConnections = BLOG_NODES.map((n, i) => ({
    id: n.id, color: n.color,
    cx: i < 3 ? 30 : -30,
    cy: i < 3 ? 20 : -20,
  }))

  const filtered = BLOG_POSTS.filter(p => {
    const matchCat = activeCategory === 'Tous' || p.category === activeCategory
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <section ref={ref} style={{ padding: '4rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <BlurReveal>
            <SectionEye label="// Tous les articles" center />
          </BlurReveal>
          <BlurReveal delay={0.12}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.2 }}>
              Explorez nos <GreenUnderline>
                <span className="text-gradient"><LetterReveal text="ressources digitales" stagger={0.025} /></span>
              </GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        {/* ── Beam constellation ── */}
        <BlurReveal delay={0.18} style={{ marginBottom: '3rem' }}>
          <div ref={beamContainerRef} style={{ position: 'relative', padding: '2rem 1rem', borderRadius: 20, background: T.light ? 'rgba(34,200,100,.03)' : 'rgba(34,200,100,.025)', border: `1px solid ${T.border}`, overflow: 'visible' }}>
            <AnimatedBeamGrid
              containerRef={beamContainerRef}
              nodeIds={{ center: 'blog-center' }}
              connections={beamConnections}
              animKey="blog"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr) auto repeat(3,1fr)', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 2 }}>
              {/* Left 3 */}
              {BLOG_NODES.slice(0, 3).map(({ id, Icon, label }) => (
                <div key={id} id={id}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.45rem', padding: '.75rem', borderRadius: 14, background: T.light ? 'rgba(255,255,255,.9)' : 'rgba(11,26,16,.8)', border: `1px solid ${T.border}`, backdropFilter: 'blur(8px)', justifySelf: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(34,200,100,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: T.green }} />
                  </div>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.58rem', fontWeight: 600, color: T.textMuted, whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              ))}
              {/* Center */}
              <div id="blog-center"
                style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(34,200,100,.25), rgba(34,200,100,.08))', border: '2px solid rgba(34,200,100,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', justifySelf: 'center', boxShadow: '0 0 40px rgba(34,200,100,.2)', flexShrink: 0 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.68rem', fontWeight: 900, color: '#22c864', textAlign: 'center', letterSpacing: '-.02em' }}>AKA<br/>BLOG</span>
              </div>
              {/* Right 3 */}
              {BLOG_NODES.slice(3).map(({ id, Icon, label }) => (
                <div key={id} id={id}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.45rem', padding: '.75rem', borderRadius: 14, background: T.light ? 'rgba(255,255,255,.9)' : 'rgba(11,26,16,.8)', border: `1px solid ${T.border}`, backdropFilter: 'blur(8px)', justifySelf: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(34,200,100,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: T.green }} />
                  </div>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.58rem', fontWeight: 600, color: T.textMuted, whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </BlurReveal>

        {/* ── Filters ── */}
        <BlurReveal delay={0.08}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{ padding: '.45rem 1.1rem', borderRadius: 100, border: '1px solid', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontSize: '.8rem', fontWeight: 600, transition: 'all .2s', borderColor: activeCategory === cat ? T.green : T.border, background: activeCategory === cat ? 'linear-gradient(145deg,#27d570,#1aa355)' : 'transparent', color: activeCategory === cat ? '#fff' : T.textSub }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '.9rem', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, pointerEvents: 'none' }} />
              <input
                style={{ padding: '.6rem 1rem .6rem 2.4rem', borderRadius: 100, border: `1px solid ${T.border}`, background: T.light ? '#f5f5f5' : 'rgba(34,200,100,.04)', color: T.textMain, fontFamily: "'Syne',sans-serif", fontSize: '.82rem', outline: 'none', width: 220 }}
                placeholder="Rechercher..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#22c864'}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
          </div>
        </BlurReveal>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: T.textMuted }}>
            <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: .3 }} />
            <p>Aucun article trouvé pour cette recherche.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
            {filtered.map((post, i) => {
              const CatIcon = CAT_ICONS[post.category] || Tag
              return (
                <BlurReveal key={post.slug} delay={i * 0.07} direction={['up','right','up','left','up','right'][i % 6]}>
                  <TiltCard className="sku-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Image */}
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                      <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease', display: 'block' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,14,9,.6),transparent)' }} />
                    </div>
                    {/* Content */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.22rem .75rem', borderRadius: 100, background: T.light ? 'rgba(22,163,74,.07)' : 'rgba(34,200,100,.07)', border: `1px solid ${T.border}`, fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em' }}>
                          <CatIcon size={10} />{post.category}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.7rem', color: T.textMuted }}>
                          <Clock size={10} />{post.readTime}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.98rem', color: T.textMain, letterSpacing: '-.02em', lineHeight: 1.4, marginBottom: '.7rem' }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.65, flex: 1, marginBottom: '1.4rem' }}>
                        {post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + '…' : post.excerpt}
                      </p>
                      <Link href={`/blog/${post.slug}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, textDecoration: 'none', transition: 'gap .2s' }}
                        onMouseEnter={e => e.currentTarget.style.gap = '.7rem'}
                        onMouseLeave={e => e.currentTarget.style.gap = '.4rem'}>
                        Lire l'article <ArrowRight size={13} />
                      </Link>
                    </div>
                  </TiltCard>
                </BlurReveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── NEWSLETTER — BlurReveal + LetterReveal ───────────────────
// ═══════════════════════════════════════════════════════════════
function Newsletter() {
  const T = useTheme()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <BlurReveal>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,200,100,.12)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Zap size={24} style={{ color: T.green }} />
          </div>
          <SectionEye label="// Newsletter" center />
          <h2 style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.7rem' }}>
            <LetterReveal text="Restez informé des dernières tendances" stagger={0.02} />
          </h2>
          <p style={{ fontSize: '.88rem', color: T.textSub, lineHeight: 1.7, marginBottom: '2rem' }}>
            Conseils digitaux, nouvelles technologies et ressources pour entrepreneurs ivoiriens — directement dans votre boîte mail.
          </p>
          {done ? (
            <motion.div initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ padding: '1.2rem 2rem', borderRadius: 14, background: 'rgba(34,200,100,.08)', border: `1px solid ${T.border}`, color: T.green, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
              ✅ Merci ! Vous êtes abonné.
            </motion.div>
          ) : (
            <div style={{ display: 'flex', gap: '.8rem' }}>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, padding: '.85rem 1rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.light ? '#f5f5f5' : 'rgba(34,200,100,.04)', color: T.textMain, fontFamily: "'Syne',sans-serif", fontSize: '.88rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#22c864'}
                onBlur={e => e.target.style.borderColor = T.border}
              />
              <button className="btn-raised" onClick={() => email && setDone(true)} style={{ flexShrink: 0, padding: '.85rem 1.4rem', fontSize: '.84rem' }}>
                S'abonner
              </button>
            </div>
          )}
        </BlurReveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── PROCESS — Sticky stacking "Votre roadmap digitale" ───────
// ═══════════════════════════════════════════════════════════════
function ProcessBlog() {
  const T = useTheme()

  const steps = [
    {
      n: '01', icon: BookOpen,
      title: 'Vous lisez',
      desc: "Explorez nos articles concrets sur la stratégie digitale, le SEO et l'e-commerce — pensés pour le marché ivoirien.",
      bg: T.light ? '#f4faf5' : '#030c06',
      shadow: false,
    },
    {
      n: '02', icon: Zap,
      title: 'Vous apprenez',
      desc: "Chaque ressource est taillée pour les entrepreneurs qui veulent passer à l'action — pas de jargon, du concret.",
      bg: T.light ? '#ffffff' : '#051208',
      shadow: true,
    },
    {
      n: '03', icon: Target,
      title: 'Vous testez',
      desc: "Appliquez les conseils à votre business dès aujourd'hui. Pas besoin d'être un expert — juste de la méthode.",
      bg: T.light ? '#f4faf5' : '#030c06',
      shadow: true,
    },
    {
      n: '04', icon: Rocket,
      title: 'On construit ensemble',
      desc: "Vous avez un projet ? On le transforme en réalité digitale. Devis gratuit, réponse en moins de 24h.",
      bg: T.light ? '#e8f8ec' : '#061a0a',
      shadow: true,
    },
  ]

  return (
    <section style={{ position: 'relative' }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, textAlign: 'center', padding: '2.5rem 5% 1.5rem', background: steps[0].bg, borderBottom: `1px solid ${T.border}` }}>
        <BlurReveal>
          <SectionEye label="// Votre roadmap digitale" center />
        </BlurReveal>
        <BlurReveal delay={0.1}>
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', margin: 0 }}>
            Du blog au{' '}
            <GreenUnderline>
              <span className="text-gradient">
                <LetterReveal text="projet concret" stagger={0.04} />
              </span>
            </GreenUnderline>
          </h2>
        </BlurReveal>
      </div>

      {/* Stacking steps */}
      {steps.map(({ n, icon: Icon, title, desc, bg, shadow }, i) => (
        <div key={n} style={{
          position: 'sticky',
          top: 96,
          zIndex: i + 1,
          minHeight: '70vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: bg,
          borderRadius: i > 0 ? '28px 28px 0 0' : 0,
          boxShadow: shadow ? '0 -24px 60px rgba(0,0,0,0.22)' : 'none',
          padding: '4rem 5%',
        }}>
          <BlurReveal delay={0.05}>
            <div style={{ maxWidth: 720, width: '100%', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(34,200,100,.12)', border: '1px solid rgba(34,200,100,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={32} style={{ color: '#22c864' }} />
                </div>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '3.5rem', fontWeight: 900, color: 'rgba(34,200,100,.12)', lineHeight: 1, letterSpacing: '-.04em' }}>{n}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1rem' }}>
                  <LetterReveal text={title} stagger={0.035} />
                </h3>
                <p style={{ fontSize: '1.05rem', color: T.textSub, lineHeight: 1.8, maxWidth: 480 }}>{desc}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.4rem' }}>
                  {steps.map((_, si) => (
                    <div key={si} style={{ height: 3, borderRadius: 2, flex: si <= i ? 2 : 1, background: si <= i ? '#22c864' : T.border, transition: 'all .4s' }} />
                  ))}
                </div>
              </div>
            </div>
          </BlurReveal>
        </div>
      ))}

      <div style={{ height: '5vh', background: steps[steps.length - 1].bg }} />
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── PAGE ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
export default function BlogPage() {
  return (
    <div>
      <HeroBlog />
      <FeaturedPost />
      <BlogGrid />
      <Newsletter />

      {/* Sticky stacking — Process + CTA */}
      <div style={{ position: 'relative' }}>
        <ProcessBlog />
        <StickyCTABlock
          variant="strong"
          zIndex={10}
          rounded
          message="Vous avez un projet web ? Discutons-en — consultation gratuite et sans engagement."
          cta="Démarrer un projet →"
        />
      </div>
    </div>
  )
}
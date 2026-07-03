import { useEffect, useRef } from 'react'

function GhostParticleText({ text = '', className = '' }) {
  const rootRef = useRef(null)
  const safeText = text || ''
  const stateRef = useRef({
    origTxt: safeText,
    origChars: safeText.split(''),
    isAnim: false,
    isHover: false,
    waves: [],
    animId: null,
    cursorPos: 0,
    origW: null,
    dur: 900,
    chars: '*+;·:. ',
    preserveSpaces: true,
    spread: 1.0,
  })

  useEffect(() => {
    const el = rootRef.current
    if (!el || !safeText) return

    const state = stateRef.current
    state.origTxt = safeText
    state.origChars = safeText.split('')
    el.textContent = safeText

    const updateCursorPos = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const len = state.origChars.length
      const pos = Math.round((x / rect.width) * len)
      state.cursorPos = Math.max(0, Math.min(pos, len - 1))
    }

    const stop = () => {
      el.textContent = state.origTxt
      state.isAnim = false
      if (state.animId) {
        cancelAnimationFrame(state.animId)
        state.animId = null
      }
      if (state.origW !== null) {
        el.style.width = ''
        state.origW = null
      }
    }

    const calcWaveEffect = (charIdx, t) => {
      let resultChar = state.origChars[charIdx]
      let shouldAnim = false
      for (const wave of state.waves) {
        const age = t - wave.startTime
        const prog = Math.min(age / state.dur, 1)
        const dist = Math.abs(charIdx - wave.startPos)
        const maxDist = Math.max(wave.startPos, state.origChars.length - wave.startPos - 1)
        const rad = (prog * (maxDist + 5)) / state.spread
        if (dist <= rad) {
          shouldAnim = true
          const intens = Math.max(0, rad - dist)
          if (intens <= 3 && intens > 0) {
            const index = (dist * 3 + Math.floor(age / 40)) % state.chars.length
            resultChar = state.chars[index]
          }
        }
      }
      return { shouldAnim, char: resultChar }
    }

    const genScrambledTxt = (t) => state.origChars
      .map((ch, i) => {
        if (state.preserveSpaces && ch === ' ') return ' '
        const { shouldAnim, char } = calcWaveEffect(i, t)
        return shouldAnim ? char : ch
      })
      .join('')

    const animate = () => {
      const now = Date.now()
      state.waves = state.waves.filter(w => now - w.startTime < state.dur)
      if (state.waves.length === 0) {
        stop()
        return
      }
      el.textContent = genScrambledTxt(now)
      state.animId = requestAnimationFrame(animate)
    }

    const start = () => {
      if (state.isAnim) return
      if (state.origW === null) {
        state.origW = el.getBoundingClientRect().width
        el.style.width = `${state.origW}px`
      }
      state.isAnim = true
      state.animId = requestAnimationFrame(animate)
    }

    const startWave = () => {
      state.waves.push({ startPos: state.cursorPos, startTime: Date.now() })
      if (!state.isAnim) start()
    }

    const onMouseEnter = (e) => {
      state.isHover = true
      updateCursorPos(e)
      startWave()
    }

    const onMouseMove = (e) => {
      if (!state.isHover) return
      const previous = state.cursorPos
      updateCursorPos(e)
      if (state.cursorPos !== previous) startWave()
    }

    const onMouseLeave = () => {
      state.isHover = false
    }

    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      if (state.animId) cancelAnimationFrame(state.animId)
    }
  }, [text])

  return (
    <span
      ref={rootRef}
      className={`ascii-ripple ${className}`}
      data-variant="ghost"
      data-dur="900"
      data-spread="1.0"
      data-chars="*+;·:. "
      aria-hidden="true"
    >
      {text}
    </span>
  )
}

export default GhostParticleText

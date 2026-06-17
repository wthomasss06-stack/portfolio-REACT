import { useEffect, useRef, useState } from 'react';
import './Shuffle.css';

// Characters for scramble during shuffle
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*?!';

/**
 * Shuffle
 * Port of react-bits Shuffle-JS-CSS without GSAP Club deps.
 * Same props API. Uses rAF + IntersectionObserver.
 *
 * Props:
 *   text            {string}
 *   tag             {string}   wrapper tag (default 'div')
 *   className       {string}
 *   style           {object}
 *   shuffleDirection {'up'|'down'|'left'|'right'} default 'down'
 *   duration        {number}   ms per char animation (default 350)
 *   stagger         {number}   ms between chars (default 30)
 *   delay           {number}   ms before start (default 0)
 *   triggerOnce     {boolean}  default true
 *   triggerOnHover  {boolean}  default true
 *   loop            {boolean}  default false
 *   loopDelay       {number}   ms between loops (default 1200)
 *   shuffleTimes    {number}   scramble passes per char (default 1)
 *   scrambleCharset {string}   override charset
 *   threshold       {number}   IO threshold (default 0.1)
 *   onShuffleComplete {fn}
 */
export default function Shuffle({
  text = '',
  tag: Tag = 'div',
  className = '',
  style = {},
  shuffleDirection = 'down',
  duration = 350,
  stagger = 30,
  delay = 0,
  triggerOnce = true,
  triggerOnHover = true,
  loop = false,
  loopDelay = 1200,
  shuffleTimes = 1,
  scrambleCharset = CHARSET,
  threshold = 0.1,
  onShuffleComplete,
}) {
  const ref       = useRef(null);
  const doneRef   = useRef(false);
  const timersRef = useRef([]);
  const obsRef    = useRef(null);
  const [ready, setReady] = useState(false);

  const rand = () => scrambleCharset[Math.floor(Math.random() * scrambleCharset.length)];

  const clearAll = () => {
    timersRef.current.forEach(t => {
      if (t.type === 'timeout') clearTimeout(t.id);
      else clearInterval(t.id);
    });
    timersRef.current = [];
  };

  const animateChar = (display, finalChar, dir, charDelay) => {
    return new Promise(resolve => {
      const tid = setTimeout(() => {
        const passes = Math.max(1, shuffleTimes);
        let pass = 0;
        const scrambleMs = 40;
        const totalScramble = passes * scrambleMs * 3;

        // Scramble phase
        const scrambleId = setInterval(() => {
          display.textContent = rand();
          pass++;
          if (pass >= passes * 3) {
            clearInterval(scrambleId);
            // Settle
            const settleId = setTimeout(() => {
              display.textContent = finalChar;
              resolve();
            }, scrambleMs);
            timersRef.current.push({ type: 'timeout', id: settleId });
          }
        }, scrambleMs);
        timersRef.current.push({ type: 'interval', id: scrambleId });

        // Slide phase via CSS transform
        const isVertical = dir === 'up' || dir === 'down';
        const wrapper = display.parentElement?.parentElement;
        if (wrapper) {
          const inner = display.parentElement;
          const size = isVertical ? wrapper.offsetHeight : wrapper.offsetWidth;
          const fromVal = dir === 'down' ? -size : dir === 'right' ? -size : 0;
          const toVal = 0;

          inner.style.transition = 'none';
          if (isVertical) inner.style.transform = `translateY(${fromVal}px)`;
          else inner.style.transform = `translateX(${fromVal}px)`;

          requestAnimationFrame(() => {
            inner.style.transition = `transform ${duration}ms cubic-bezier(0.22,1,0.36,1)`;
            if (isVertical) inner.style.transform = `translateY(${toVal}px)`;
            else inner.style.transform = `translateX(${toVal}px)`;
          });
        }
      }, charDelay);
      timersRef.current.push({ type: 'timeout', id: tid });
    });
  };

  const runShuffle = (el) => {
    clearAll();
    setReady(true);

    const isVertical = shuffleDirection === 'up' || shuffleDirection === 'down';

    // Split text into char spans
    el.innerHTML = '';
    const chars = text.replace(/\s/g, '\u00A0').split('');
    const charData = [];

    chars.forEach((char) => {
      if (char === '\u00A0' || char === ' ') {
        const sp = document.createElement('span');
        sp.textContent = '\u00A0';
        sp.style.display = 'inline-block';
        el.appendChild(sp);
        charData.push(null);
        return;
      }

      // Outer clip wrapper
      const wrapper = document.createElement('span');
      wrapper.className = 'shuffle-char-wrapper';
      wrapper.style.display = 'inline-block';
      wrapper.style.overflow = 'hidden';
      wrapper.style.verticalAlign = 'bottom';

      // Inner slide strip
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.style.willChange = 'transform';

      // Display char
      const display = document.createElement('span');
      display.className = 'shuffle-char';
      display.textContent = rand();

      inner.appendChild(display);
      wrapper.appendChild(inner);
      el.appendChild(wrapper);
      charData.push({ display, final: char });
    });

    // Animate each real char with staggered delay
    let realIdx = 0;
    const promises = charData.map((ch) => {
      if (!ch) return Promise.resolve();
      const charDelay = delay + realIdx * stagger;
      realIdx++;
      return animateChar(ch.display, ch.final, shuffleDirection, charDelay);
    });

    Promise.all(promises).then(() => {
      onShuffleComplete?.();
      doneRef.current = true;
      if (loop) {
        const loopId = setTimeout(() => {
          doneRef.current = false;
          runShuffle(el);
        }, loopDelay);
        timersRef.current.push({ type: 'timeout', id: loopId });
      } else if (triggerOnHover) {
        // Re-arm hover
        el.addEventListener('mouseenter', handleHover, { once: true });
      }
    });
  };

  const handleHover = () => {
    const el = ref.current;
    if (!el) return;
    doneRef.current = false;
    runShuffle(el);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;

    const trigger = () => {
      if (doneRef.current && triggerOnce) return;
      runShuffle(el);
    };

    // Check if already visible
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      requestAnimationFrame(() => requestAnimationFrame(trigger));
    } else {
      obsRef.current = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (triggerOnce) obsRef.current?.disconnect();
          trigger();
        },
        { threshold }
      );
      obsRef.current.observe(el);
    }

    return () => {
      clearAll();
      obsRef.current?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Tag
      ref={ref}
      className={`shuffle-parent${ready ? ' is-ready' : ''}${className ? ' ' + className : ''}`}
      style={style}
      aria-label={text}
    >
      {text}
    </Tag>
  );
}

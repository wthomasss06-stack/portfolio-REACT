import { useEffect, useRef } from 'react';
import './ShuffleText.css';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!%&*?';

// Characters passed through without animation wrapper
const PASSTHROUGH = new Set([' ', "'", '\u2018', '\u2019', '-', '.', ',']);

export default function ShuffleText({
  text = '',
  className = '',
  style = {},
  speed = 45,
  step = 0.6,
  delay = 0,
  once = true,
  chars = DEFAULT_CHARS,
  tag: Tag = 'div',
}) {
  const parentRef = useRef(null);
  const animRef   = useRef(null);
  const timerRef  = useRef(null);
  const doneRef   = useRef(false);

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent || !text) return;

    // Build DOM
    parent.innerHTML = '';
    const activeChars = [];

    text.split('').forEach((char) => {
      if (PASSTHROUGH.has(char)) {
        const sp = document.createElement('span');
        sp.textContent = char === ' ' ? '\u00A0' : char;
        sp.style.display = 'inline-block';
        parent.appendChild(sp);
        return;
      }
      const wrapper = document.createElement('span');
      wrapper.className = 'shuffle-char-wrapper';
      const inner   = document.createElement('span');
      const display = document.createElement('span');
      display.className  = 'shuffle-char';
      display.textContent = chars[Math.floor(Math.random() * chars.length)];
      inner.appendChild(display);
      wrapper.appendChild(inner);
      parent.appendChild(wrapper);
      activeChars.push({ display, final: char });
    });

    // Animate
    const animate = () => {
      if (once && doneRef.current) return;
      clearInterval(animRef.current);
      parent.classList.add('is-ready');

      let iter = 0;
      const total = activeChars.length;

      animRef.current = setInterval(() => {
        const resolved = Math.floor(iter);
        activeChars.forEach((ch, i) => {
          ch.display.textContent = i < resolved
            ? ch.final
            : chars[Math.floor(Math.random() * chars.length)];
        });
        iter += step;
        if (iter > total) {
          clearInterval(animRef.current);
          activeChars.forEach(ch => { ch.display.textContent = ch.final; });
          if (once) doneRef.current = true;
        }
      }, speed);
    };

    // Trigger: if already in viewport fire immediately via double rAF
    const start = () => {
      parent.classList.add('is-ready');
      timerRef.current = setTimeout(animate, delay);
    };

    const rect = parent.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      requestAnimationFrame(() => requestAnimationFrame(start));
      return () => {
        clearInterval(animRef.current);
        clearTimeout(timerRef.current);
      };
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        start();
      },
      { threshold: 0 }
    );
    obs.observe(parent);

    return () => {
      obs.disconnect();
      clearInterval(animRef.current);
      clearTimeout(timerRef.current);
    };
  }, [text, speed, step, delay, once, chars]);

  return (
    <Tag
      ref={parentRef}
      className={`shuffle-parent ${className}`}
      style={style}
      aria-label={text}
    >
      {text}
    </Tag>
  );
}

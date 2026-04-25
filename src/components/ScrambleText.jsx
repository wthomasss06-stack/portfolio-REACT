import { useEffect, useRef } from 'react';

// ─── Constantes ────────────────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!%';

/**
 * ScrambleText
 * ─────────────────────────────────────────────────────
 * Inspiré de GRG.html (Nexura) — texte qui se décode
 * lettre par lettre dès qu'il entre dans le viewport.
 *
 * Props :
 *   text        {string}   — texte final à afficher
 *   tag         {string}   — balise HTML (défaut : 'span')
 *   className   {string}
 *   style       {object}
 *   speed       {number}   — délai ms entre frames (défaut : 30)
 *   step        {number}   — progression par frame (défaut : 0.4)
 *   threshold   {number}   — % de visibilité pour déclencher (défaut : 0.3)
 *   once        {boolean}  — jouer une seule fois (défaut : true)
 *   startBinary {boolean}  — afficher du binaire avant decode (défaut : false)
 *
 * Usage :
 *   <ScrambleText text="BEYOND THE SURFACE" tag="h2" className="hero-sub" />
 *   <ScrambleText text="Marketplace multi-vendeurs" startBinary />
 */
export default function ScrambleText({
  text = '',
  tag: Tag = 'span',
  className,
  style,
  speed = 30,
  step = 0.4,
  threshold = 0.3,
  once = true,
  startBinary = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;

    // Contenu initial : binaire ou scramble aléatoire
    el.textContent = startBinary
      ? text.split('').map(c => c === ' ' ? ' ' : '01'[Math.round(Math.random())]).join('')
      : text.split('').map(c => c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

    let intervalId = null;

    const scramble = () => {
      let iteration = 0;
      clearInterval(intervalId);

      intervalId = setInterval(() => {
        el.textContent = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');

        if (iteration >= text.length) clearInterval(intervalId);
        iteration += step;
      }, speed);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (once) observer.disconnect();
        scramble();
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [text, speed, step, threshold, once, startBinary]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
    >
      {text}
    </Tag>
  );
}

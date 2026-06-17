import { useEffect, useRef, useState } from 'react';

/**
 * AnimatedCounter
 * ──────────────────────────────────────────────────────
 * Compteur animé GSAP-style, pur React.
 * S'active quand l'élément entre dans le viewport.
 *
 * Props :
 *   target   {number}  — valeur finale
 *   suffix   {string}  — suffixe (ex: "+", "%")
 *   duration {number}  — durée ms (défaut: 2000)
 *   delay    {number}  — délai ms avant démarrage (défaut: 0)
 *   ease     {string}  — 'power2' | 'linear' (défaut: 'power2')
 */
export default function AnimatedCounter({
  target = 0,
  suffix = '',
  duration = 2000,
  delay = 0,
  ease = 'power2',
}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const easeOut = (t) => {
      if (ease === 'linear') return t;
      // power2.out approximation
      return 1 - Math.pow(1 - t, 2.5);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        obs.disconnect();

        setTimeout(() => {
          const start = performance.now();
          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOut(progress);
            const current = Number.isInteger(target)
              ? Math.round(eased * target)
              : parseFloat((eased * target).toFixed(1));
            setValue(current);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.3 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, delay, ease]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value}{suffix}
    </span>
  );
}

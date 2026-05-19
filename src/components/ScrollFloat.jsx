import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function ScrollFloat({
  children,
  className = '',
  stagger = 0.02,
  animationDuration = 0.8,
  ease = 'power3.out',
  scrollStart = 'top 88%',
  scrollEnd = 'top 45%',
  ...props
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Split text into characters
    const textContent = el.innerText || '';
    el.innerHTML = ''; // Clear original content

    // Create wrapper spans for each character
    textContent.split('').forEach((char) => {
      const span = document.createElement('span');
      span.innerText = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.transformOrigin = 'bottom center';
      span.style.whiteSpace = 'pre';
      span.className = 'scroll-float-char';
      el.appendChild(span);
    });

    const chars = el.querySelectorAll('.scroll-float-char');

    // Animate using GSAP ScrollTrigger
    const anim = gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 40,
        scaleY: 1.25,
        filter: 'blur(3px)',
      },
      {
        opacity: 1,
        y: 0,
        scaleY: 1,
        filter: 'blur(0px)',
        duration: animationDuration,
        stagger: stagger,
        ease: ease,
        scrollTrigger: {
          trigger: el,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      }
    );

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [children, stagger, animationDuration, ease, scrollStart, scrollEnd]);

  return (
    <span
      ref={containerRef}
      className={`scroll-float-container ${className}`}
      style={{ display: 'inline-block' }}
      {...props}
    >
      {children}
    </span>
  );
}

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  className = '',
  baseOpacity = 0.2,
  enableBlur = true,
  baseBlur = 8,
  ...props
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // We only process if children is a string
    if (typeof children !== 'string') {
        return;
    }

    const textContent = children;
    el.innerHTML = ''; // Clear original content

    // Split text into words
    const words = textContent.split(' ');
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.innerText = word + (i < words.length - 1 ? ' ' : '');
      span.style.display = 'inline-block';
      span.style.opacity = baseOpacity;
      if (enableBlur) span.style.filter = `blur(${baseBlur}px)`;
      span.className = 'scroll-reveal-word';
      el.appendChild(span);
    });

    const wordEls = el.querySelectorAll('.scroll-reveal-word');

    const anim = gsap.to(wordEls, {
      opacity: 1,
      filter: 'blur(0px)',
      stagger: 0.05,
      ease: 'power2.out',
      duration: 1.5,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 45%',
        scrub: true,
      },
    });

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [children, baseOpacity, enableBlur, baseBlur]);

  // If children is not a string, just render it normally
  if (typeof children !== 'string') {
      return <span className={className} {...props}>{children}</span>;
  }

  return (
    <span
      ref={containerRef}
      className={`scroll-reveal-container ${className}`}
      style={{ display: 'inline-block' }}
      {...props}
    >
      {children}
    </span>
  );
}

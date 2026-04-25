import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── 1. Hero : blast exit ─────────────────────────────────────────────────────
function useHeroGSAP(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const hero = container.querySelector('.sdz-section');
    if (!hero) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(hero,
        { scale: 1, opacity: 1, filter: 'blur(0px)' },
        {
          scale: 1.12,
          opacity: 0,
          filter: 'blur(22px)',
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: '55% top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [containerRef]);
}

// ─── 2. Sections non-hero : entrée profondeur ─────────────────────────────────
function useDepthEntranceGSAP(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = [...container.querySelectorAll('.sdz-section')].slice(1);

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        gsap.set(section, {
          scale: 0.62,
          opacity: 0,
          filter: 'blur(5px)',
          transformOrigin: 'center center',
        });

        gsap.to(section, {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 58%',
            end: 'top 5%',
            scrub: 0.8,
          },
        });
      });
    });

    // ── Fix navbar : clic ancre → section visible immédiatement ──────────────
    // IMPORTANT : on NE fait PAS ScrollTrigger.refresh() ici — c'est lui qui
    // causait le saut aléatoire de section (recalcul des positions pendant le scroll).
    const onNavClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      // Trouver le wrapper .sdz-section qui contient la cible
      const allSections = [...container.querySelectorAll('.sdz-section')];
      const wrapper = allSections.find((s) => s.contains(target));
      if (wrapper) {
        // Snap immédiat vers scale(1) / opacity(1) AVANT que le browser scrolle
        // → la section est visible dès que l'ancre atterrit
        gsap.set(wrapper, { clearProps: 'all' });
      }
      // On laisse le scroll natif du browser se faire — pas de refresh() ici.
    };

    document.addEventListener('click', onNavClick);

    return () => {
      ctx.revert();
      document.removeEventListener('click', onNavClick);
    };
  }, [containerRef]);
}

// ─── 3. WebGL Terrain : zoom caméra agressif au scroll ───────────────────────
function useWebGLTerrain(canvasRef, dark) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(dark ? 0x0A0A0A : 0xFFFFFF);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Position initiale : assez loin pour voir le terrain "de haut"
    camera.position.set(0, 8, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geo = new THREE.PlaneGeometry(60, 60, 80, 80);
    const mat = new THREE.MeshBasicMaterial({
      color: dark ? 0xFF5500 : 0x111111,
      wireframe: true,
      transparent: true,
      opacity: dark ? 0.12 : 0.10,
    });
    const terrain = new THREE.Mesh(geo, mat);
    terrain.rotation.x = -Math.PI / 2.8;
    terrain.position.y = -4;
    scene.add(terrain);

    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(120 * 3);
    for (let i = 0; i < 120 * 3; i++) partPos[i] = (Math.random() - 0.5) * 60;
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: dark ? 0xFF5500 : 0x111111,
      size: 0.12,
      transparent: true,
      opacity: dark ? 0.35 : 0.22,
    });
    scene.add(new THREE.Points(partGeo, partMat));

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      const pos = geo.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 2] = Math.sin(pos[i] * 0.3 + t * 0.6) * Math.cos(pos[i + 1] * 0.3 + t * 0.4) * 1.8;
      }
      geo.attributes.position.needsUpdate = true;
      // Légère oscillation latérale — conservée de l'original
      camera.position.x = Math.sin(t * 0.1) * 2;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    // ── ZOOM CONTINU : la caméra plonge sur TOUT le scroll sans jamais s'arrêter
    // p va de 0 à 1 sur 100% du scroll → mouvement permanent jusqu'en bas
    // Phase 1 (0→50%) : plongeon frontal violent vers le terrain
    // Phase 2 (50→100%) : traversée et immersion continue sous le sol
    const onScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);

      // p = progression linéaire sur 100% du scroll — ne sature jamais
      const p = scrolled / maxScroll;

      // Phase 1 : rapprochement rapide (0 → 50% scroll)
      const p1 = Math.min(1, p / 0.5);
      const e1 = 1 - Math.pow(1 - p1, 3); // ease-out cubic

      // Phase 2 : continuation lente et continue (50% → 100% scroll)
      const p2 = Math.max(0, (p - 0.5) / 0.5);
      const e2 = p2; // linéaire — sentiment de descente constante

      // z : 20 → 1 (phase 1) → -10 (phase 2, continue à traverser)
      camera.position.z = 20 - e1 * 19 - e2 * 11;

      // y : 8 → 2 (phase 1) → -1 (phase 2, passe sous le sol)
      camera.position.y = 8 - e1 * 6 - e2 * 3;

      // FOV s'élargit progressivement tout au long du scroll
      camera.fov = 60 + e1 * 20 + e2 * 15;  // 60° → 80° → 95°
      camera.updateProjectionMatrix();

      // Opacité monte en phase 1, reste haute en phase 2
      mat.opacity = dark
        ? 0.12 + e1 * 0.22 + e2 * 0.08  // 0.12 → 0.34 → 0.42
        : 0.08 + e1 * 0.16 + e2 * 0.06; // 0.08 → 0.24 → 0.30
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      partGeo.dispose();
      partMat.dispose();
    };
  }, [dark]);
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function ScrollDepthScene({ children, dark = true }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);

  useWebGLTerrain(canvasRef, dark);
  useHeroGSAP(containerRef);
  useDepthEntranceGSAP(containerRef);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100vh',
          zIndex: 0, pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: dark
            ? 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.75) 100%)'
            : 'radial-gradient(ellipse at center, transparent 30%, rgba(255,255,255,0.75) 100%)',
        }}
      />
      <div ref={containerRef} style={{ position: 'relative', zIndex: 2 }}>
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="sdz-section"
            style={{
              willChange: 'transform, opacity, filter',
              transformOrigin: 'center center',
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
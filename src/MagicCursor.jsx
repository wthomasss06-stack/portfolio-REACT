// ============================================================
// FICHIER 3: src/MagicCursor.jsx - VERSION SIMPLIFIÉE
// ============================================================

// src/MagicCursor.jsx
import React, { useState, useEffect } from 'react';

export function MagicCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHover = (e) => {
      const hoverable = e.target.closest('a, button, .project-card, .service-card');
      setIsHovering(!!hoverable);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHover);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHover);
    };
  }, []);

  // Ne pas afficher sur mobile
  if (window.innerWidth < 768) return null;

  return (
    <>
      <div
        className="magic-cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 2 : 1})`,
        }}
      />
      <div
        className="magic-cursor-ring"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
        }}
      />
    </>
  );
}
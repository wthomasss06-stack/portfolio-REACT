import { useRef, useState, useCallback } from 'react';
import './ImageTrail.css';

/**
 * Normalise un item de la liste `items` vers la forme { name, icon, color }.
 * Accepte soit une URL brute (string) pour compat rétro, soit un objet
 * { name, icon, color } enrichi venant de la table SKILLS.
 */
function normalizeItem(item, i) {
  if (typeof item === 'string') {
    return { key: `${item}-${i}`, name: '', icon: item, color: '#FF5500' };
  }
  return {
    key: `${item.name || item.icon}-${i}`,
    name: item.name || '',
    icon: item.icon,
    color: item.color || '#FF5500',
  };
}

/**
 * Une rangée de marquee défilant en continu (CSS-driven, GPU-friendly).
 * Le contenu est dupliqué une fois en interne pour créer la boucle infinie
 * (translateX 0 -> -50%), donc on lui passe la liste déjà "simple".
 */
function MarqueeRow({ items, direction = 'left', speed = 38, rowIndex = 0 }) {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const handleEnter = useCallback(() => setPaused(true), []);
  const handleLeave = useCallback(() => setPaused(false), []);

  const doubled = [...items, ...items];

  return (
    <div
      className={`mq-row mq-row--${direction}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        ref={trackRef}
        className="mq-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {doubled.map((it, i) => (
          <MarqueeChip key={`${it.key}-${rowIndex}-${i}`} item={it} />
        ))}
      </div>
    </div>
  );
}

function MarqueeChip({ item }) {
  const [hovered, setHovered] = useState(false);
  const col = item.color || '#FF5500';

  return (
    <div
      className="mq-chip"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={
        hovered
          ? {
              borderColor: col,
              boxShadow: `6px 6px 0 ${col}`,
              transform: 'translate(-3px,-3px) scale(1.04)',
              background: `${col}14`,
            }
          : undefined
      }
    >
      <span className="mq-chip-icon" aria-hidden="true">
        <img
          src={item.icon}
          alt=""
          draggable={false}
          style={{
            filter: hovered ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.6)',
          }}
          onError={e => {
            e.currentTarget.style.opacity = '0';
          }}
        />
        {hovered && (
          <span className="mq-chip-glow" style={{ background: col }} aria-hidden="true" />
        )}
      </span>
      {item.name && (
        <span className="mq-chip-label" style={hovered ? { color: 'var(--text)' } : undefined}>
          {item.name}
        </span>
      )}
    </div>
  );
}

/**
 * ImageTrail — désormais un marquee à deux rangées défilant en sens opposé.
 * Conserve le même nom/export et la même API ({ items, variant }) pour ne
 * pas casser les appels existants ; `variant` est gardé pour compat mais
 * n'a plus d'effet (un seul rendu, premium par défaut).
 *
 * `items` peut être :
 *  - un tableau de strings (URLs d'icônes) — comportement historique
 *  - un tableau d'objets { name, icon, color } — rendu enrichi avec label + glow
 */
export default function ImageTrail({ items = [] }) {
  const normalized = items.map(normalizeItem);

  if (normalized.length === 0) return null;

  // Découpe la liste en deux moitiés pour deux rangées visuellement distinctes
  // (si la liste est petite ou impaire, les deux rangées partagent le set complet)
  const mid = Math.ceil(normalized.length / 2);
  const rowA = normalized.length >= 6 ? normalized.slice(0, mid) : normalized;
  const rowB = normalized.length >= 6 ? normalized.slice(mid) : normalized;

  return (
    <div className="mq-wrap">
      <MarqueeRow items={rowA} direction="left" speed={34} rowIndex={0} />
      <MarqueeRow items={rowB.length ? rowB : rowA} direction="right" speed={40} rowIndex={1} />
      <div className="mq-fade mq-fade--l" aria-hidden="true" />
      <div className="mq-fade mq-fade--r" aria-hidden="true" />
    </div>
  );
}

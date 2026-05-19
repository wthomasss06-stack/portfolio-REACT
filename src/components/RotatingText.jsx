import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function RotatingText({
  texts = [],
  rotationInterval = 2500,
  className = '',
  ...props
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [texts, rotationInterval]);

  const currentText = texts[index] || '';

  return (
    <span className={`rotating-text-container ${className}`} style={{ display: 'inline-block', position: 'relative', overflow: 'hidden', verticalAlign: 'middle' }} {...props}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          style={{ display: 'inline-flex', flexWrap: 'wrap' }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.03 } },
            exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } }
          }}
        >
          {currentText.split('').map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { y: '120%', opacity: 0, filter: 'blur(2px)' },
                visible: { y: '0%', opacity: 1, filter: 'blur(0px)' },
                exit: { y: '-120%', opacity: 0, filter: 'blur(2px)' }
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

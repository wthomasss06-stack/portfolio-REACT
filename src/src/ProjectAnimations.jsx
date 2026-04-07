// src/ProjectAnimations.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';

// ============================================================
// 1. CARTE PROJET AVEC FLIP 3D AU HOVER
// ============================================================
export function FlipCard({ project, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const { transform, opacity } = useSpring({
    opacity: isFlipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${isFlipped ? 180 : 0}deg)`,
    config: config.slow,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative h-[500px]"
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      {/* FACE AVANT */}
      <animated.div
        style={{
          opacity: opacity.to(o => 1 - o),
          transform,
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
        }}
        className="project-card"
      >
        <div className="relative h-64 overflow-hidden rounded-t-xl group">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-6">
          <motion.h3 
            className="text-2xl font-bold mb-3"
            whileHover={{ x: 5 }}
          >
            {project.title}
          </motion.h3>
          
          <p className="text-gray-400 mb-4 line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 3).map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </animated.div>

      {/* FACE ARRIÈRE */}
      <animated.div
        style={{
          opacity,
          transform: transform.to(t => `${t} rotateY(180deg)`),
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
        }}
        className="project-card bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex flex-col justify-between"
      >
        <div>
          <h3 className="text-2xl font-bold mb-4">Détails Techniques</h3>
          <ul className="space-y-3">
            {project.features?.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="text-primary mt-1">▸</span>
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        
        <motion.a
          href={project.link}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary text-center"
        >
          Voir le projet →
        </motion.a>
      </animated.div>
    </motion.div>
  );
}

// ============================================================
// 2. EFFET REVEAL AU SCROLL AVEC MASK
// ============================================================
export function RevealCard({ project, index }) {
  return (
    <motion.div
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
      whileInView={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: 'easeOut' }}
      className="project-card overflow-hidden"
    >
      <motion.div
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        className="h-64 overflow-hidden"
      >
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.2 }}
        className="p-6"
      >
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-400 mb-4">{project.description}</p>
        
        <div className="flex gap-2">
          {project.tech.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="tech-tag"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// 3. CARTE AVEC PARTICULES INTERACTIVES
// ============================================================
export function ParticleCard({ project, index }) {
  const [particles, setParticles] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const generateParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15 }}
      onHoverStart={() => {
        setIsHovered(true);
        generateParticles();
      }}
      onHoverEnd={() => setIsHovered(false)}
      className="project-card relative overflow-hidden"
    >
      {/* Particules animées */}
      <AnimatePresence>
        {isHovered && particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ 
              x: `${p.x}%`, 
              y: `${p.y}%`, 
              scale: 0,
              opacity: 1 
            }}
            animate={{ 
              x: `${p.x + (Math.random() - 0.5) * 100}%`,
              y: `${p.y - 100}%`,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2,
              delay: p.delay,
              ease: 'easeOut'
            }}
            className="absolute w-2 h-2 bg-primary rounded-full pointer-events-none"
            style={{ filter: 'blur(1px)' }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="h-56 overflow-hidden"
      >
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </motion.div>

      <div className="p-6">
        <motion.h3
          animate={{ 
            color: isHovered ? '#8b5cf6' : '#f1f5f9',
          }}
          className="text-xl font-bold mb-2"
        >
          {project.title}
        </motion.h3>
        <p className="text-gray-400">{project.description}</p>
      </div>
    </motion.div>
  );
}

// ============================================================
// 4. EFFET GLASSMORPHISM AVEC BLUR DYNAMIQUE
// ============================================================
export function GlassCard({ project, index }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      onMouseMove={handleMouseMove}
      className="relative project-card backdrop-blur-xl bg-white/5 border border-white/10"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.2), transparent)`,
      }}
    >
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)'
        }}
        className="h-full"
      >
        <div className="h-48 overflow-hidden rounded-t-xl">
          <motion.img
            whileHover={{ scale: 1.15, rotate: 2 }}
            transition={{ duration: 0.6 }}
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-3">{project.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{project.description}</p>
          
          <motion.div 
            className="flex gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {project.tech.map((tech, i) => (
              <motion.span
                key={tech}
                whileHover={{ 
                  scale: 1.2, 
                  backgroundColor: 'rgba(139, 92, 246, 0.3)' 
                }}
                className="px-3 py-1 text-xs bg-white/10 rounded-full"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// 5. CARTE AVEC EXPANSION AU CLIC
// ============================================================
export function ExpandableCard({ project, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`project-card cursor-pointer ${isExpanded ? 'col-span-2 row-span-2' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div layout className="h-full flex flex-col">
        <motion.div
          layout
          className={`overflow-hidden ${isExpanded ? 'h-96' : 'h-48'}`}
        >
          <motion.img
            layout
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div layout className="p-6 flex-1">
          <motion.h3 layout className="text-xl font-bold mb-2">
            {project.title}
          </motion.h3>
          
          <AnimatePresence>
            {!isExpanded ? (
              <motion.p
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-400 text-sm line-clamp-2"
              >
                {project.description}
              </motion.p>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-400">{project.description}</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Fonctionnalités:</h4>
                  <ul className="space-y-2">
                    {project.features?.map((f, i) => (
                      <motion.li
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-sm text-gray-400 flex items-start gap-2"
                      >
                        <span className="text-primary">✓</span>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.a
                  href={project.link}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-block"
                >
                  Visiter le projet
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// 6. GRILLE AVEC ANIMATION STAGGER
// ============================================================
export function AnimatedProjectsGrid({ projects, CardComponent = FlipCard }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {projects.map((project, index) => (
        <CardComponent key={project.id} project={project} index={index} />
      ))}
    </motion.div>
  );
}
export function TypewriterText({ text, delay = 0 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </motion.span>
  );
}
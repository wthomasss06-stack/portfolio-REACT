// src/useAnimations.js
import { useEffect } from 'react';

export default function useAnimations() {
  useEffect(() => {
    // ============================================================
    // 1. SYSTÈME DE PARTICULES ANIMÉES
    // ============================================================
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 150 };
    
    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();
    
    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }
        
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 2;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 2;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 2;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 2;
          }
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
      }
    }
    
    function initParticles() {
      particlesArray = [];
      const isMobile = window.innerWidth < 768;
      let numberOfParticles = isMobile ? 30 : 80;
      
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        
        const isDarkMode = !document.body.classList.contains('glass-mode');
        let color = isDarkMode ? 'rgba(124, 58, 237, 0.6)' : 'rgba(15, 23, 42, 0.3)';
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }
    
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            opacityValue = 1 - (distance / 120);
            const isDarkMode = !document.body.classList.contains('glass-mode');
            ctx.strokeStyle = isDarkMode 
              ? `rgba(124, 58, 237, ${opacityValue * 0.3})` 
              : `rgba(15, 23, 42, ${opacityValue * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }
    
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }
    
    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    const bodyObserver = new MutationObserver(() => {
      initParticles();
    });
    
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    initParticles();
    animate();

    // ============================================================
    // 2. INTERSECTION OBSERVER - ANIMATIONS AU SCROLL
    // ============================================================
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.service-card, .project-card, .timeline-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      intersectionObserver.observe(el);
    });

    // ============================================================
    // 3. ANIMATIONS POUR LA PAGE PROJECTS
    // ============================================================
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });

    const projectImages = document.querySelectorAll('.project-image-screenshot');
    projectImages.forEach(img => {
      const handleMouseEnter = function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
      };
      const handleMouseLeaveImg = function() {
        this.style.transform = 'scale(1)';
      };
      img.addEventListener('mouseenter', handleMouseEnter);
      img.addEventListener('mouseleave', handleMouseLeaveImg);
    });

    const progressBars = document.querySelectorAll('.progress-bar');
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = width;
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
          }, 100);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => progressObserver.observe(bar));

    const premiumBadges = document.querySelectorAll('.premium-badge');
    premiumBadges.forEach(badge => {
      badge.style.animation = 'float 3s ease-in-out infinite';
    });

    // ============================================================
    // 4. GESTION DES THÈMES
    // ============================================================
    const themeBtn = document.querySelector('.theme-btn-vertical');;
    let currentTheme = localStorage.getItem('theme') || 'dark';
    
    function applyTheme(theme) {
      document.body.classList.remove('glass-mode', 'glass-marron');
      const icon = themeBtn?.querySelector('.material-symbols-outlined');
      
      if (theme === 'light') {
        document.body.classList.add('glass-mode');
        if (icon) icon.textContent = 'dark_mode';
      } else if (theme === 'marron') {
        document.body.classList.add('glass-marron');
        if (icon) icon.textContent = 'palette';
      } else {
        if (icon) icon.textContent = 'light_mode';
      }
      
      initParticles();
      localStorage.setItem('theme', theme);
    }
    
    applyTheme(currentTheme);
    
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        if (currentTheme === 'dark') {
          currentTheme = 'light';
        } else if (currentTheme === 'light') {
          currentTheme = 'marron';
        } else {
          currentTheme = 'dark';
        }
        applyTheme(currentTheme);
      });
    }

    // ============================================================
    // 5. NETTOYAGE
    // ============================================================
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      bodyObserver.disconnect();
      intersectionObserver.disconnect();
      progressObserver.disconnect();
      canvas.remove();
    };
  }, []);
}
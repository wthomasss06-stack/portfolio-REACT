// src/useAnimations.js — AKAFOLIO v4 "CODE × DESIGN"
// Animations soignées : particles légères, scroll reveal, curseur, compteurs
import { useEffect } from 'react';

export default function useAnimations() {
  useEffect(() => {

    // ============================================================
    // 1. CUSTOM CURSOR (desktop seulement)
    // ============================================================
    const isPointer = window.matchMedia('(pointer: fine)').matches;
    let cursorDot, cursorRing;

    if (isPointer) {
      document.body.style.cursor = 'none';

      cursorDot = document.createElement('div');
      cursorDot.style.cssText = `
        position:fixed;pointer-events:none;z-index:99999;
        width:6px;height:6px;border-radius:50%;
        background:#7EE787;transform:translate(-50%,-50%);
        transition:width .15s,height .15s;mix-blend-mode:screen;
      `;

      cursorRing = document.createElement('div');
      cursorRing.style.cssText = `
        position:fixed;pointer-events:none;z-index:99998;
        width:28px;height:28px;border-radius:50%;
        border:1.5px solid rgba(126,231,135,0.4);
        transform:translate(-50%,-50%);
      `;

      document.body.appendChild(cursorDot);
      document.body.appendChild(cursorRing);

      let mx=0,my=0,rx=0,ry=0;

      const moveCursor = e => {
        mx=e.clientX; my=e.clientY;
        cursorDot.style.left=mx+'px'; cursorDot.style.top=my+'px';
      };

      const animRing = () => {
        rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
        cursorRing.style.left=rx+'px'; cursorRing.style.top=ry+'px';
        requestAnimationFrame(animRing);
      };

      const onEnter = () => {
        cursorDot.style.width='3px'; cursorDot.style.height='3px';
        cursorRing.style.width='44px'; cursorRing.style.height='44px';
        cursorRing.style.borderColor='rgba(126,231,135,0.7)';
      };

      const onLeave = () => {
        cursorDot.style.width='6px'; cursorDot.style.height='6px';
        cursorRing.style.width='28px'; cursorRing.style.height='28px';
        cursorRing.style.borderColor='rgba(126,231,135,0.4)';
      };

      window.addEventListener('mousemove', moveCursor);

      document.querySelectorAll('a,button,.project-card,.service-card,.skill-logo-item,.filter-btn,.pricing-card').forEach(el=>{
        el.style.cursor='none';
        el.addEventListener('mouseenter',onEnter);
        el.addEventListener('mouseleave',onLeave);
      });

      animRing();
    }

    // ============================================================
    // 2. PARTICLES — minimalistes, style "network graph"
    // ============================================================
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let pts = [];
    let mouse = { x:null, y:null };
    let animId;

    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize();

    const getAccent = () => {
      const b = document.body;
      if (b.classList.contains('glass-mode'))   return { r:26,  g:127, b:55  };
      if (b.classList.contains('glass-marron')) return { r:240, g:160, b:75  };
      return { r:126, g:231, b:135 };
    };

    class Pt {
      constructor() {
        this.x  = Math.random()*canvas.width;
        this.y  = Math.random()*canvas.height;
        this.vx = (Math.random()-.5)*.22;
        this.vy = (Math.random()-.5)*.22;
        this.r  = Math.random()*3+1.5;
        this.op = Math.random()*.55+.25;
      }

      update() {
        if (this.x>canvas.width||this.x<0)  this.vx*=-1;
        if (this.y>canvas.height||this.y<0) this.vy*=-1;

        // Repulsion souris douce
        if (mouse.x!==null) {
          const dx=mouse.x-this.x, dy=mouse.y-this.y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if (d<90) {
            const f=(90-d)/90;
            this.vx-=Math.cos(Math.atan2(dy,dx))*f*.35;
            this.vy-=Math.sin(Math.atan2(dy,dx))*f*.35;
          }
        }

        // Friction + drift
        const spd=Math.sqrt(this.vx*this.vx+this.vy*this.vy);
        if (spd>1) { this.vx=(this.vx/spd); this.vy=(this.vy/spd); }
        this.vx*=.996; this.vy*=.996;
        if (Math.abs(this.vx)<.03) this.vx+=(Math.random()-.5)*.06;
        if (Math.abs(this.vy)<.03) this.vy+=(Math.random()-.5)*.06;

        this.x+=this.vx; this.y+=this.vy;

        // Draw
        const c=getAccent();
        ctx.save();
        ctx.globalAlpha=this.op;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle=`rgb(${c.r},${c.g},${c.b})`;
        ctx.fill();
        ctx.restore();
      }
    }

    const connect = () => {
      const c=getAccent();
      for (let a=0;a<pts.length;a++) {
        for (let b=a+1;b<pts.length;b++) {
          const dx=pts[a].x-pts[b].x, dy=pts[a].y-pts[b].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if (d<130) {
            const op=(1-d/130)*.14;
            ctx.save();
            ctx.globalAlpha=op;
            ctx.strokeStyle=`rgb(${c.r},${c.g},${c.b})`;
            ctx.lineWidth=.8;
            ctx.beginPath();
            ctx.moveTo(pts[a].x,pts[a].y);
            ctx.lineTo(pts[b].x,pts[b].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const initPts = () => {
      const n=window.innerWidth<768?30:60;
      pts=Array.from({length:n},()=>new Pt());
    };

    const animate = () => {
      animId=requestAnimationFrame(animate);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pts.forEach(p=>p.update());
      connect();
    };

    const onMouseMove  = e=>{ mouse.x=e.clientX; mouse.y=e.clientY; };
    const onMouseLeave = ()=>{ mouse.x=null; mouse.y=null; };
    const onResize     = ()=>{ resize(); initPts(); };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    // Re-init particles on theme change
    const themeObs = new MutationObserver(()=>initPts());
    themeObs.observe(document.body,{attributes:true,attributeFilter:['class']});

    initPts(); animate();

    // ============================================================
    // 3. SCROLL REVEAL — stagger propre
    // ============================================================
    const revealObs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if (e.isIntersecting) {
          e.target.style.opacity='1';
          e.target.style.transform='translateY(0)';
        }
      });
    }, { threshold:0.08, rootMargin:'0px 0px -40px 0px' });

    document.querySelectorAll('.service-card,.project-card,.timeline-item,.pricing-card').forEach((el,i)=>{
      el.style.opacity='0';
      el.style.transform='translateY(18px)';
      el.style.transition=`opacity .45s ease ${i*.06}s, transform .5s cubic-bezier(0.25,0.46,0.45,0.94) ${i*.06}s`;
      revealObs.observe(el);
    });

    // ============================================================
    // 4. PROJET CARDS — reveal immédiat au chargement
    // ============================================================
    document.querySelectorAll('.project-card').forEach((c,i)=>{
      setTimeout(()=>{ c.style.opacity='1'; c.style.transform='translateY(0)'; }, i*70);
    });

    // ============================================================
    // 5. PROGRESS BARS
    // ============================================================
    const progressObs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if (!e.isIntersecting) return;
        const bar=e.target, target=bar.style.width;
        bar.style.transition='none'; bar.style.width='0%';
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          bar.style.transition='width 1.3s cubic-bezier(0.25,0.46,0.45,0.94)';
          bar.style.width=target;
        }));
      });
    }, { threshold:.4 });

    document.querySelectorAll('.progress-bar').forEach(b=>progressObs.observe(b));

    // ============================================================
    // 6. COMPTEURS animés
    // ============================================================
    const countObs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if (!e.isIntersecting) return;
        const el=e.target, text=el.textContent, m=text.match(/^(\d+)/);
        if (!m) return;
        const target=parseInt(m[1]), suffix=text.slice(m[1].length);
        let cur=0; const step=Math.max(1,Math.ceil(target/25));
        const timer=setInterval(()=>{
          cur=Math.min(cur+step,target);
          el.textContent=cur+suffix;
          if (cur>=target) clearInterval(timer);
        }, 45);
        countObs.unobserve(el);
      });
    }, { threshold:.6 });

    document.querySelectorAll('.stat-number,.stat-value').forEach(el=>countObs.observe(el));

    // ============================================================
    // 7. SKILLS CAROUSEL
    // ============================================================
    const skillObs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateX(0)'; } });
    }, { threshold:.12 });

    document.querySelectorAll('.skill-category-wrapper').forEach((wrapper,wi)=>{
      const logos=wrapper.querySelector('.skill-logos');
      if (!logos) return;

      // Clone pour infinite scroll
      Array.from(logos.children).forEach(c=>logos.appendChild(c.cloneNode(true)));

      const dir=wi%2===0?'scroll-left':'scroll-right';
      const speed=24+wi*5;
      logos.style.animation=`${dir} ${speed}s linear infinite`;

      wrapper.addEventListener('mouseenter',()=>logos.style.animationPlayState='paused');
      wrapper.addEventListener('mouseleave',()=>logos.style.animationPlayState='running');

      const cat=wrapper.querySelector('.skill-category');
      if (cat) skillObs.observe(cat);
    });

    // ============================================================
    // 8. HERO ENTRANCE
    // ============================================================
    const heroH1=document.querySelector('.hero-content h1');
    if (heroH1) {
      heroH1.style.opacity='0'; heroH1.style.transform='translateY(24px)';
      heroH1.style.transition='opacity .65s ease, transform .65s cubic-bezier(0.34,1.56,0.64,1)';
      setTimeout(()=>{ heroH1.style.opacity='1'; heroH1.style.transform='translateY(0)'; }, 80);
    }

    ['hero-description','hero-stats'].forEach((cls,i)=>{
      const el=document.querySelector('.'+cls);
      if (!el) return;
      el.style.opacity='0'; el.style.transform='translateY(12px)';
      el.style.transition=`opacity .55s ease ${0.25+i*0.15}s, transform .55s ease ${0.25+i*0.15}s`;
      setTimeout(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; }, 250+i*150);
    });

    // ============================================================
    // 9. SECTION HEADER REVEAL
    // ============================================================
    const headerObs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if (e.isIntersecting) {
          e.target.style.opacity='1'; e.target.style.transform='translateY(0)';
        }
      });
    }, { threshold:.15 });

    document.querySelectorAll('.section-header').forEach(el=>{
      el.style.opacity='0'; el.style.transform='translateY(16px)';
      el.style.transition='opacity .5s ease, transform .5s ease';
      headerObs.observe(el);
    });

    // ============================================================
    // 10. THEME MANAGER
    // ============================================================
    const themeBtn=document.querySelector('.theme-btn-vertical');
    let theme=localStorage.getItem('theme')||'dark';

    const applyTheme=t=>{
      document.body.classList.remove('glass-mode','glass-marron');
      const icon=themeBtn?.querySelector('.material-symbols-outlined');
      if (t==='light')  { document.body.classList.add('glass-mode');   if(icon) icon.textContent='dark_mode'; }
      else if(t==='marron') { document.body.classList.add('glass-marron'); if(icon) icon.textContent='palette'; }
      else { if(icon) icon.textContent='light_mode'; }
      initPts(); localStorage.setItem('theme',t);
    };

    applyTheme(theme);

    if (themeBtn) {
      themeBtn.addEventListener('click',()=>{
        const themes=['dark','light','marron'];
        theme=themes[(themes.indexOf(theme)+1)%themes.length];
        applyTheme(theme);
      });
    }

    // ============================================================
    // CLEANUP
    // ============================================================
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      themeObs.disconnect();
      revealObs.disconnect(); progressObs.disconnect();
      skillObs.disconnect(); countObs.disconnect(); headerObs.disconnect();
      cancelAnimationFrame(animId);
      canvas.remove();
      document.body.style.cursor='';
      if (cursorDot)  cursorDot.remove();
      if (cursorRing) cursorRing.remove();
    };
  }, []);
}
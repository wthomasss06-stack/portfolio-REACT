/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║       akaFOLIO v3 — Win95 OS Interactive Portfolio  (v3.1)      ║
 * ║  XP Wallpaper · Fix cursor/switch · Gallery · Services/Tarifs   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import React, {
  useState, useEffect, useRef, useCallback, useMemo, memo
} from 'react';

import {
  CONTACT as ME, PROJECTS, TIMELINE, PRICING_TABS, FAQ_ITEMS as FAQ,
} from './data/portfolioData.js';

// ═══════════════════════════════════════════════════════════════
// 0. DONNÉES
// ═══════════════════════════════════════════════════════════════



const SKILLS = {
  frontend: [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", pct: 90 },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", pct: 88 },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", pct: 70 },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", pct: 85 },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", pct: 92 },
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", pct: 95 },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", pct: 90 },
    { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg", pct: 85 },
  ],
  backend: [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", pct: 85 },
    { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg", pct: 82 },
    { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg", pct: 75 },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", pct: 70 },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", pct: 80 },
  ],
  tools: [
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", pct: 90 },
    { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", pct: 95 },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", pct: 90 },
    { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", pct: 88 },
    { name: "Claude AI", icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg", pct: 85 },
    { name: "ChatGPT", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", pct: 80 },
    { name: "PythonAnywhere", icon: "https://www.pythonanywhere.com/static/anywhere/images/PA-logo.svg", pct: 75 },
    { name: "Netlify", icon: "https://logo.svgcdn.com/logos/netlify.svg", pct: 78 },
  ],
  autres: [
    { name: "Windows", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg", pct: 95 },
    { name: "Android", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", pct: 80 },
    { name: "Word", icon: "https://img.icons8.com/fluency/48/microsoft-word-2019.png", pct: 90 },
    { name: "Excel", icon: "https://img.icons8.com/fluency/48/microsoft-excel-2019.png", pct: 85 },
    { name: "PowerPoint", icon: "https://img.icons8.com/fluency/48/microsoft-powerpoint-2019.png", pct: 85 },
    { name: "MS Project", icon: "https://img.icons8.com/fluency/48/microsoft-project-2019.png", pct: 75 },
    { name: "Maintenance", icon: "https://img.icons8.com/fluency/48/maintenance.png", pct: 88 },
    { name: "Support", icon: "https://img.icons8.com/fluency/48/technical-support.png", pct: 90 },
  ],
};


const SERVICES_DATA = [
  {
    n: "01", icon: "fa-laptop-code", title: "Applications Web", desc: "Apps CRUD complètes, dashboards de gestion, solutions sur-mesure.",
    features: ["Applications CRUD complètes", "Dashboards de gestion", "Solutions sur-mesure"]
  },
  {
    n: "02", icon: "fa-plug", title: "API RESTful", desc: "APIs Python/Flask documentées, sécurisées, prêtes pour la production.",
    features: ["API RESTful avec Python", "Documentation complète", "Sécurité intégrée"]
  },
  {
    n: "03", icon: "fa-mobile-alt", title: "Interfaces Responsives", desc: "Design et intégration d'interfaces modernes et adaptatives.",
    features: ["Design responsive", "UX optimale", "Performance maximale"]
  },
  {
    n: "04", icon: "fa-database", title: "Bases de Données", desc: "Conception et optimisation de bases de données MySQL.",
    features: ["Modélisation de données", "Requêtes SQL optimisées", "Intégrité des données"]
  },
  {
    n: "05", icon: "fa-lock", title: "Sécurité Applicative", desc: "Bonnes pratiques de sécurité intégrées dès la conception.",
    features: ["Protection des données", "Gestion des accès", "Sécurisation Python"]
  },
  {
    n: "06", icon: "fa-tools", title: "Support Technique", desc: "Maintenance informatique et assistance technique utilisateur.",
    features: ["Maintenance matérielle", "Support utilisateur", "Résolution de problèmes"]
  },
];



// ═══════════════════════════════════════════════════════════════
// 1. CSS GLOBAL
// ═══════════════════════════════════════════════════════════════

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --teal:        #008080;
  --silver:      #c0c0c0;
  --silver-dk:   #808080;
  --silver-xdk:  #404040;
  --white:       #ffffff;
  --black:       #000000;
  --navy:        #000080;
  --navy-lt:     #1084d0;
  --acc:         #ff5500;
  --acc2:        #00aa44;
  --glass:       rgba(255,255,255,0.06);
  --glass-border:rgba(255,255,255,0.18);
  --raised: 2px 2px 0 var(--white), -1px -1px 0 var(--silver-dk);
  --sunken: inset 2px 2px 0 var(--silver-dk), inset -1px -1px 0 var(--white);
  --win-shadow: 4px 4px 12px rgba(0,0,0,.6), 2px 2px 0 rgba(0,0,0,.4);
  --font-retro: 'VT323', monospace;
  --font-mono:  'Share Tech Mono', monospace;
  --font-ui:    'Inter', sans-serif;
  --desk-bg:   #008080;
  --tb-bg:     #c0c0c0;
  --win-bg:    #c0c0c0;
  --text-main: #000;
  --text-muted:#555;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
a{color:inherit;text-decoration:none;}

/* ── Custom cursor — toujours au-dessus de tout (boot inclus) ── */
.w95-cursor {
  position:fixed;top:0;left:0;z-index:2147483647;pointer-events:none;
  width:20px;height:20px;
}
.w95-cursor-inner {
  width:0;height:0;
  border-left:10px solid transparent;
  border-right:4px solid transparent;
  border-top:14px solid var(--text-main);
  filter:drop-shadow(1px 1px 0 var(--win-bg));
}
.w95-cursor-dot {
  position:absolute;bottom:-2px;left:8px;
  width:4px;height:4px;
  background:var(--silver-dk);border-radius:50%;
}

/* ── Desktop — Windows XP wallpaper ── */
.w95-desktop {
  width:100vw;height:100vh;position:relative;overflow:hidden;
  font-family:var(--font-ui);
  user-select:none;
  background-image: url('/assets/images/Windows_XP_Background__2001_.webp');
  background-size:cover;
  background-position:center;
  background-repeat:no-repeat;
  background-color:#3a6ea5;
}


/* ── Scanlines (subtiles) ── */
.w95-scanlines {
  position:absolute;inset:0;z-index:1;pointer-events:none;
  background:repeating-linear-gradient(
    0deg,transparent,transparent 3px,
    rgba(0,0,0,.008) 3px,rgba(0,0,0,.008) 4px
  );
}

/* ── Icons grid ── */
.w95-icons {
  position:absolute;top:20px;left:20px;
  display:flex;flex-direction:column;gap:4px;
  z-index:10;
}
.w95-icon {
  display:flex;flex-direction:column;align-items:center;gap:5px;
  width:76px;padding:8px 4px 6px;border-radius:2px;
  cursor:pointer;text-align:center;position:relative;
  transition:background .1s;
}
.w95-icon:hover,.w95-icon.selected {
  background:rgba(0,0,128,.5);
  outline:1px dotted rgba(255,255,255,.8);
}
.w95-icon-wrap {
  width:44px;height:44px;display:flex;align-items:center;justify-content:center;
  position:relative;flex-shrink:0;
}
.w95-icon svg { width:40px;height:40px;filter:drop-shadow(2px 2px 2px rgba(0,0,0,.5)); }
.w95-icon-label {
  font-family:var(--font-ui);font-size:10px;font-weight:700;
  color:#fff;line-height:1.25;max-width:72px;word-break:break-word;
  text-shadow:1px 1px 0 #000,-1px 1px 0 #000,1px -1px 0 #000,-1px -1px 0 #000;
}

/* ── Window ── */
.w95-win {
  position:absolute;min-width:280px;min-height:160px;
  display:flex;flex-direction:column;
  /* outset-border fidèle au HTML référence */
  border:1px solid var(--black);
  box-shadow:
    inset 1px 1px var(--white),
    inset -1px -1px var(--silver-dk),
    4px 4px 12px rgba(0,0,0,.55),
    2px 2px 0 rgba(0,0,0,.35);
  animation:winOpen .2s cubic-bezier(.2,.9,.3,1) both;
}
.w95-win.closing { animation:winClose .15s ease-in both; }
.w95-win-inner {
  background:var(--win-bg);
  display:flex;flex-direction:column;flex:1;overflow:hidden;
  padding:2px;
}
@keyframes winOpen  { from{opacity:0;transform:scale(.88) translateY(8px)} to{opacity:1;transform:scale(1)} }
@keyframes winClose { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(.88) translateY(8px)} }

/* ── Titlebar ── */
.w95-titlebar {
  padding:2px 2px 2px 4px;
  display:flex;align-items:center;gap:4px;
  cursor:move;min-height:22px;flex-shrink:0;
  background:linear-gradient(90deg,var(--navy) 0%,var(--navy-lt) 100%);
  position:relative;overflow:hidden;
}
.w95-titlebar::after {
  content:'';position:absolute;inset:0;
  background:repeating-linear-gradient(90deg,transparent 0px,transparent 3px,rgba(255,255,255,.06) 3px,rgba(255,255,255,.06) 4px);
  pointer-events:none;
}
.w95-titlebar.inactive { background:linear-gradient(90deg,#6a6a8a 0%,#9a9ab0 100%); }
/* Petite icône Win95 (white square avec inset-border) */
.w95-titlebar-icon {
  width:14px;height:14px;flex-shrink:0;z-index:1;
  background:var(--white);
  border:1px solid var(--black);
  box-shadow:inset 1px 1px var(--silver),inset -1px -1px var(--silver-dk);
  display:flex;align-items:center;justify-content:center;font-size:9px;
}
.w95-titlebar-title { font-family:var(--font-ui);font-size:11px;font-weight:800;color:#fff;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;z-index:1;letter-spacing:.02em; }
.w95-titlebar-btns  { display:flex;gap:2px;z-index:1; }

/* ── Window control buttons (style HTML référence) ── */
.w95-wbtn {
  width:16px;height:14px;
  background:var(--win-bg);
  border:1px solid var(--black);
  box-shadow:inset 1px 1px var(--white),inset -1px -1px var(--silver-dk);
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  font-size:9px;font-family:sans-serif;font-weight:bold;color:var(--black);
  flex-shrink:0;padding:0;transition:box-shadow .05s,padding .05s;
}
.w95-wbtn svg { width:10px;height:10px;pointer-events:none; }
.w95-wbtn:hover { background:#e8e8e8; }
.w95-wbtn:active {
  box-shadow:inset 1px 1px var(--silver-dk),inset -1px -1px var(--white);
  padding:1px 0 0 1px;
}
.w95-wbtn.close { font-size:11px; }
.w95-wbtn.close:hover { background:#cc2200;color:#fff; }
.w95-wbtn.help { font-size:10px;font-style:italic;font-weight:900; }

/* ── Menubar ── */
.w95-menubar { background:var(--win-bg);border-bottom:1px solid var(--silver-dk);padding:2px 0;display:flex;gap:2px;flex-shrink:0; }
.w95-menuitem { font-family:var(--font-ui);font-size:11px;padding:2px 6px;cursor:default;color:var(--text-main); }
.w95-menuitem:hover { background:var(--navy);color:#fff; }
.w95-menuitem u { text-decoration:underline; }

/* ── Toolbar (barre d'icônes) ── */
.w95-toolbar {
  background:var(--win-bg);
  padding:3px 4px;display:flex;align-items:center;gap:2px;
  border-bottom:1px solid var(--silver-dk);flex-shrink:0;
}
.w95-toolbtn {
  width:24px;height:22px;
  border:1px solid transparent;background:transparent;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-size:12px;color:var(--text-main);padding:0;
}
.w95-toolbtn:hover {
  border:1px solid var(--black);
  box-shadow:inset 1px 1px var(--white),inset -1px -1px var(--silver-dk);
}
.w95-toolbtn:active {
  box-shadow:inset 1px 1px var(--silver-dk),inset -1px -1px var(--white);
}
.w95-toolsep { width:1px;height:20px;background:var(--silver-dk);margin:0 3px;flex-shrink:0; }
/* Logo Windows à droite de la toolbar */
.w95-winlogo {
  margin-left:auto;
  width:38px;height:24px;
  background:#000;
  display:flex;align-items:center;justify-content:center;
  border:1px solid var(--black);
  box-shadow:inset 1px 1px var(--silver),inset -1px -1px var(--silver-dk);
  flex-shrink:0;
}
.w95-winlogo-grid {
  width:18px;height:18px;
  display:grid;grid-template-columns:1fr 1fr;gap:1px;
}
.w95-winlogo-grid span { display:block; }

/* ── Address bar ── */
.w95-addrbar {
  background:var(--win-bg);
  padding:3px 4px;display:flex;align-items:center;gap:5px;
  border-bottom:2px solid var(--silver-dk);flex-shrink:0;
}
.w95-addr-label { font-family:var(--font-ui);font-size:11px;white-space:nowrap;flex-shrink:0; }
.w95-addr-label u { text-decoration:underline; }
.w95-addr-input {
  flex:1;
  font-family:var(--font-mono);font-size:11px;color:var(--black);
  padding:1px 4px;height:20px;
  border:1px solid var(--silver-dk);
  box-shadow:inset 1px 1px var(--black),1px 1px var(--white);
  background:var(--white);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  display:flex;align-items:center;
}

/* ── Content / Statusbar ── */
.w95-content { flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 12px;background:var(--win-bg);color:var(--text-main); }
.w95-content::-webkit-scrollbar { width:16px; }
.w95-content::-webkit-scrollbar-track { background:var(--silver);box-shadow:var(--sunken); }
.w95-content::-webkit-scrollbar-thumb { background:var(--silver);box-shadow:var(--raised);border:1px solid var(--black); }

/* Status bar — 3 cellules inset comme le HTML */
.w95-statusbar {
  background:var(--win-bg);
  margin-top:2px;
  display:flex;gap:2px;flex-shrink:0;padding:0 2px 2px;
}
.w95-statuscell {
  height:18px;padding:2px 4px;
  display:flex;align-items:center;
  font-family:var(--font-ui);font-size:10px;color:var(--text-muted);
  border:1px solid var(--silver-dk);
  box-shadow:inset 1px 1px var(--black),1px 1px var(--white);
}
.w95-statuscell.main { flex:1; }
.w95-statuscell.sm   { width:70px;justify-content:center; }
.w95-statuscell.resize { width:18px;padding:0;justify-content:center; }
/* Poignée de redimensionnement dans la 3e cellule */
.w95-resize-grip {
  width:12px;height:12px;
  background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M10 10h2v2h-2zM6 10h2v2h-2zM10 6h2v2h-2z" fill="%23808080"/></svg>');
  background-size:contain;
}

/* ── Panels ── */
.w95-inset  { box-shadow:var(--sunken);background:var(--win-bg);padding:8px; }
.w95-raised { box-shadow:var(--raised);background:var(--silver);padding:4px 8px; }
.w95-panel  { border:1px solid var(--silver-dk);box-shadow:inset 1px 1px var(--black),1px 1px var(--white);background:var(--win-bg);padding:10px;margin-bottom:10px; }

/* ── Skill bars — blocs discrets style Win95 ── */
.w95-skill-label { font-size:11px;font-weight:700;text-transform:uppercase;display:flex;justify-content:space-between;margin-bottom:2px;color:var(--text-main); }
.w95-skill-track {
  height:14px;
  background:#b5b5b5;
  border:1px solid var(--silver-dk);
  box-shadow:inset 1px 1px var(--black),1px 1px var(--white);
  display:flex;padding:1px;gap:2px;
  margin-bottom:8px;overflow:hidden;
}
.w95-skill-chunk {
  width:8px;height:100%;
  background:var(--navy);
  flex-shrink:0;
  animation:chunkIn .4s ease both;
}
@keyframes chunkIn { from{opacity:0;transform:scaleX(0)} to{opacity:1;transform:scaleX(1)} }

/* ── Project cards ── */
.w95-proj-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px; }
.w95-proj-card { box-shadow:var(--raised);background:var(--win-bg);border:1px solid var(--silver-dk);overflow:hidden;cursor:pointer;transition:box-shadow .1s,transform .1s; }
.w95-proj-card:hover { box-shadow:4px 4px 0 rgba(0,0,0,.6);transform:translate(-1px,-1px); }
.w95-proj-card:active { transform:translate(1px,1px); }
.w95-proj-bar   { height:4px; }
.w95-proj-img   { width:100%;height:80px;object-fit:cover;display:block; }
.w95-proj-img-ph{ width:100%;height:60px;display:flex;align-items:center;justify-content:center;font-size:22px;opacity:.5; }
.w95-proj-body  { padding:8px; }
.w95-proj-title { font-size:12px;font-weight:800;color:var(--navy);margin-bottom:1px; }
.w95-proj-sub   { font-size:10px;color:var(--text-muted);margin-bottom:6px; }
.w95-proj-desc  { font-size:10px;line-height:1.4;color:var(--text-main);margin-bottom:6px; }
.w95-proj-tags  { display:flex;flex-wrap:wrap;gap:3px; }
.w95-proj-tag   { font-family:var(--font-mono);font-size:9px;background:var(--silver);box-shadow:var(--raised);padding:1px 5px; }
.w95-proj-badge { font-size:9px;font-weight:800;padding:1px 5px;background:var(--acc);color:#fff;margin-left:4px; }


/* ── About photo — 160px ── */
.w95-about-photo {
  width:160px;height:160px;flex-shrink:0;
  box-shadow:var(--raised);overflow:hidden;
  background:linear-gradient(135deg,#0066aa,#004488);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:box-shadow .1s,transform .1s;
}
.w95-about-photo:hover { box-shadow:4px 4px 0 rgba(0,0,0,.6);transform:translate(-1px,-1px); }
.w95-about-photo img { width:100%;height:100%;object-fit:cover;object-position:top center;display:block; }

/* ── Services ── */
.w95-svc-grid { display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px; }
.w95-svc-card { box-shadow:var(--raised);background:var(--win-bg);padding:8px;cursor:default; }
.w95-svc-n    { font-family:var(--font-mono);font-size:9px;color:var(--text-muted); }
.w95-svc-ttl  { font-size:11px;font-weight:800;color:var(--navy);margin:3px 0 2px; }
.w95-svc-desc { font-size:10px;line-height:1.4;color:var(--text-main);margin-bottom:6px; }
.w95-svc-feat li { font-size:9px;list-style:none;padding:1px 0;color:var(--text-muted); }
.w95-svc-feat li::before { content:'→ ';color:var(--acc); }


/* ── Services/Tarifs section tabs ── */
.w95-section-tabs { display:flex;margin-bottom:12px;border-bottom:2px solid var(--silver-dk); }
.w95-section-tab  {
  padding:6px 18px;font-family:var(--font-ui);font-size:11px;font-weight:700;
  border:none;cursor:pointer;background:var(--silver);
  color:var(--text-main);border-right:1px solid var(--silver-dk);
  transition:background .1s;display:flex;align-items:center;gap:5px;
}
.w95-section-tab:hover { background:#d4d4d4; }
.w95-section-tab.active {
  background:var(--win-bg);
  box-shadow:inset 0 -2px 0 var(--navy);
  color:var(--navy);
}


/* ── Pricing tabs ── */
.w95-price-tabs  { display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px; }
.w95-plan-grid   { display:grid;grid-template-columns:repeat(3,1fr);gap:8px; }
.w95-plan-card   { box-shadow:var(--raised);background:var(--win-bg);padding:8px; }
.w95-plan-card.popular { border-top:3px solid var(--acc); }
.w95-plan-badge  { font-family:var(--font-mono);font-size:9px;font-weight:800;color:var(--text-muted); }
.w95-plan-price  { font-size:12px;font-weight:800;color:var(--navy);margin:3px 0;line-height:1.2; }
.w95-plan-del    { font-size:9px;color:var(--text-muted);margin-bottom:6px; }
.w95-plan-feat li{ font-size:9px;list-style:none;padding:1px 0; }
.w95-plan-feat li::before { content:'✓ ';color:#006622; }


/* ── Contact form ── */
.w95-input {
  width:100%;background:var(--win-bg);border:none;
  box-shadow:var(--sunken);padding:5px 7px;
  font-family:var(--font-ui);font-size:12px;color:var(--text-main);outline:none;
}
.w95-input:focus { outline:1px dotted var(--navy); }
.w95-label  { font-size:11px;font-weight:700;display:block;margin-bottom:3px;color:var(--text-main); }
.w95-field  { margin-bottom:10px; }
.w95-btn {
  padding:4px 18px;background:var(--silver);
  box-shadow:var(--raised);border:none;cursor:pointer;
  font-family:var(--font-ui);font-size:11px;font-weight:700;
  min-width:80px;color:var(--text-main);
  transition:box-shadow .05s,transform .05s,background .1s;
}
.w95-btn:hover { background:#d4d4d4; }
.w95-btn:active { box-shadow:var(--sunken);transform:translate(1px,1px); }
.w95-btn.primary { background:var(--navy);color:#fff; }
.w95-btn.primary:hover { background:#0000aa; }
.w95-btn.green { background:#006622;color:#fff; }
.w95-btn.green:hover { background:#008833; }

/* ── Taskbar ── */
.w95-taskbar {
  position:fixed;bottom:0;left:0;right:0;height:36px;
  background:var(--tb-bg);border-top:2px solid var(--white);
  box-shadow:0 -2px 0 var(--silver-dk);
  display:flex;align-items:center;gap:3px;padding:2px 4px;z-index:9000;
  overflow:hidden;
}
.w95-start {
  display:flex;align-items:center;gap:5px;padding:2px 10px 2px 6px;
  background:var(--silver);box-shadow:var(--raised);border:none;cursor:pointer;
  height:28px;flex-shrink:0;font-family:var(--font-ui);font-size:12px;font-weight:900;
  transition:box-shadow .05s;color:var(--text-main);
}
.w95-start:active,.w95-start.active { box-shadow:var(--sunken); }
.w95-start-logo { width:18px;height:18px;display:grid;grid-template-columns:1fr 1fr;gap:1px; }
.w95-start-logo span { display:block; }
.w95-tbsep { width:2px;height:24px;flex-shrink:0;background:var(--silver-dk);box-shadow:1px 0 0 var(--white); }
.w95-tbbtn {
  display:flex;align-items:center;gap:5px;padding:2px 8px;
  background:var(--silver);box-shadow:var(--raised);border:none;cursor:pointer;
  font-family:var(--font-ui);font-size:10px;font-weight:700;
  height:28px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  transition:box-shadow .05s,background .1s;color:var(--text-main);flex-shrink:0;
}
.w95-tbbtn:hover { background:#d4d4d4; }
.w95-tbbtn.active { box-shadow:var(--sunken);background:#b8b8b8; }
.w95-clock {
  margin-left:auto;display:flex;align-items:center;gap:6px;padding:2px 10px;
  box-shadow:var(--sunken);font-family:var(--font-ui);font-size:11px;font-weight:700;
  height:26px;white-space:nowrap;flex-shrink:0;color:var(--text-main);
}

/* ── Start Menu ── */
.w95-startmenu {
  position:fixed;bottom:36px;left:0;width:240px;background:var(--silver);
  border:2px solid var(--black);border-top-color:var(--white);border-left-color:var(--white);
  box-shadow:4px 4px 0 rgba(0,0,0,.5);z-index:9100;display:flex;
  animation:smOpen .12s ease-out both;
}
@keyframes smOpen { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
.w95-sm-sidebar { width:26px;background:linear-gradient(0deg,#000080 0%,#0060a0 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px; }
.w95-sm-sidetext { writing-mode:vertical-rl;transform:rotate(180deg);font-family:var(--font-ui);font-size:12px;font-weight:900;color:rgba(255,255,255,.55);letter-spacing:.1em; }
.w95-sm-items  { flex:1;padding:4px 0; }
.w95-sm-item   { display:flex;align-items:center;gap:10px;padding:6px 12px;font-family:var(--font-ui);font-size:12px;font-weight:700;cursor:pointer;color:var(--text-main); }
.w95-sm-item:hover { background:var(--navy);color:#fff; }
.w95-sm-icon   { width:22px;text-align:center;font-size:13px;flex-shrink:0; }
.w95-sm-sep    { height:1px;background:var(--silver-dk);margin:4px 8px; }

/* ── Alert ── */
.w95-alert-overlay { position:fixed;inset:0;z-index:20000;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center; }
.w95-alert-box { background:var(--silver);min-width:280px;max-width:360px;border:2px solid var(--black);border-top-color:var(--white);border-left-color:var(--white);box-shadow:4px 4px 0 rgba(0,0,0,.6);animation:winOpen .15s ease both; }
.w95-alert-title { background:linear-gradient(90deg,var(--navy),var(--navy-lt));padding:3px 8px;display:flex;align-items:center;justify-content:space-between; }
.w95-alert-body { padding:20px 16px 12px;display:flex;flex-direction:column;gap:14px; }
.w95-alert-msg  { display:flex;gap:12px;align-items:flex-start; }
.w95-alert-icon { font-size:26px;line-height:1; }
.w95-alert-text { font-size:12px;line-height:1.5;color:var(--text-main); }
.w95-alert-btns { display:flex;justify-content:center;gap:8px; }

/* ── Boot screen ── */
.w95-boot { position:fixed;inset:0;z-index:99999;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:var(--font-mono); }
.w95-boot-canvas { position:absolute;inset:0;pointer-events:none; }
.w95-boot-content { position:relative;z-index:1;width:min(600px,90vw); }
.w95-boot-title { font-family:var(--font-retro);font-size:clamp(28px,5vw,48px);color:#00ff88;margin-bottom:20px;text-shadow:0 0 20px rgba(0,255,136,.5);letter-spacing:.05em; }
.w95-boot-line { font-size:13px;margin-bottom:4px;animation:bootFade .3s ease both; }
.w95-boot-line.ok    { color:#00ff88; }
.w95-boot-line.warn  { color:#ffaa00; }
.w95-boot-line.err   { color:#ff4444; }
.w95-boot-line.info  { color:#aaaaff; }
.w95-boot-line.white { color:#ffffff; }
@keyframes bootFade { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
.w95-boot-progress { margin-top:20px;height:6px;background:#111;border:1px solid #333;overflow:hidden; }
.w95-boot-bar { height:100%;background:linear-gradient(90deg,#006644,#00ff88);transition:width .3s ease;box-shadow:0 0 8px rgba(0,255,136,.6); }
.w95-boot-continue { margin-top:24px;font-size:13px;color:#888;animation:blink 1s step-end infinite; }
@keyframes blink { 50%{opacity:0} }
.w95-boot-enter { margin-top:16px;padding:8px 24px;background:transparent;border:1px solid #00ff88;color:#00ff88;font-family:var(--font-mono);font-size:13px;cursor:pointer;letter-spacing:.05em;transition:all .2s; }
.w95-boot-enter:hover { background:#00ff88;color:#000; }

/* ── Skill icons ── */
.w95-skill-icon { width:36px;height:36px;object-fit:contain;filter:drop-shadow(1px 1px 2px rgba(0,0,0,.3)); }
.w95-skill-card { display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;box-shadow:var(--raised);background:var(--win-bg);cursor:default;transition:box-shadow .1s,transform .1s; }
.w95-skill-card:hover { box-shadow:3px 3px 0 rgba(0,0,0,.5);transform:translate(-1px,-1px); }
.w95-skill-name { font-size:9px;font-weight:700;text-align:center;color:var(--text-main); }

/* ── Timeline ── */
.w95-tl-item { display:flex;gap:10px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px dotted var(--silver-dk); }
.w95-tl-dot  { width:30px;height:30px;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;box-shadow:var(--raised); }
.w95-tl-date { font-family:var(--font-mono);font-size:10px;color:var(--text-muted); }
.w95-tl-title{ font-size:12px;font-weight:800;color:var(--navy);margin-bottom:1px; }
.w95-tl-co   { font-size:11px;font-weight:700;color:var(--text-muted); }
.w95-tl-desc { font-size:10px;line-height:1.45;color:var(--text-main);margin-top:3px; }


/* ── FAQ ── */
.w95-faq-item { margin-bottom:8px; }
.w95-faq-q { display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--silver);box-shadow:var(--raised);cursor:pointer;font-size:12px;font-weight:700;color:var(--text-main);transition:background .1s; }
.w95-faq-q:hover { background:#d4d4d4; }
.w95-faq-q.open  { box-shadow:var(--sunken);background:#b8b8b8; }
.w95-faq-a { box-shadow:var(--sunken);background:var(--win-bg);padding:8px 10px;font-size:11px;line-height:1.5;color:var(--text-muted);border-top:1px solid var(--silver-dk); }

/* ── Lightbox — fenêtre Win95 flottante ── */
.w95-lb-overlay {
  position:fixed;inset:0;z-index:20000;
  background:rgba(0,0,0,.82);
  display:flex;align-items:center;justify-content:center;
  padding:8px;
}
.w95-lb-win {
  width:min(820px,98vw);
  max-height:calc(100vh - 16px);
  border:1px solid var(--black);
  box-shadow:inset 1px 1px var(--white),inset -1px -1px var(--silver-dk),
             6px 6px 0 rgba(0,0,0,.6);
  background:var(--win-bg);
  display:flex;flex-direction:column;
  animation:winOpen .18s ease both;
  overflow:hidden;
}
/* Titlebar du modal */
.w95-lb-titlebar {
  background:linear-gradient(90deg,var(--navy) 0%,var(--navy-lt) 100%);
  padding:2px 2px 2px 4px;display:flex;align-items:center;gap:4px;
  cursor:move;flex-shrink:0;min-height:22px;
}
.w95-lb-titlebar-icon {
  width:14px;height:14px;flex-shrink:0;
  background:var(--white);border:1px solid var(--black);
  box-shadow:inset 1px 1px var(--silver),inset -1px -1px var(--silver-dk);
  display:flex;align-items:center;justify-content:center;font-size:9px;color:#000;
}
.w95-lb-title { flex:1;font-family:var(--font-ui);font-size:11px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.w95-lb-btns  { display:flex;gap:2px; }
/* Toolbar navigation du modal */
.w95-lb-toolbar {
  background:var(--win-bg);padding:3px 4px;display:flex;align-items:center;gap:2px;
  border-bottom:1px solid var(--silver-dk);flex-shrink:0;
}
/* Address bar du modal */
.w95-lb-addrbar {
  background:var(--win-bg);padding:3px 4px;display:flex;align-items:center;gap:5px;
  border-bottom:2px solid var(--silver-dk);flex-shrink:0;
}
.w95-lb-addr {
  flex:1;font-family:var(--font-mono);font-size:11px;padding:1px 4px;height:20px;
  border:1px solid var(--silver-dk);
  box-shadow:inset 1px 1px var(--black),1px 1px var(--white);
  background:var(--white);display:flex;align-items:center;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#000;
}
/* Zone image */
.w95-lb-imgzone {
  background:#111;flex:1;
  border:1px solid var(--silver-dk);
  box-shadow:inset 1px 1px var(--black),1px 1px var(--white);
  margin:8px;
  display:flex;align-items:center;justify-content:center;
  min-height:280px;max-height:65vh;position:relative;overflow:hidden;
}
.w95-lb-imgzone img {
  max-width:100%;max-height:65vh;
  object-fit:contain;display:block;
}
/* Flèches nav sur l'image */
.w95-lb-nav {
  position:absolute;top:50%;transform:translateY(-50%);
  background:rgba(0,0,0,.55);color:#fff;border:none;cursor:pointer;
  font-size:18px;padding:4px 8px;line-height:1;
  transition:background .1s;z-index:2;
}
.w95-lb-nav:hover { background:rgba(0,0,128,.75); }
.w95-lb-nav.prev  { left:6px; }
.w95-lb-nav.next  { right:6px; }
.w95-lb-nav:disabled { opacity:.25;cursor:default; }
/* Compteur d'image centré en haut de zone */
.w95-lb-counter {
  position:absolute;top:6px;left:50%;transform:translateX(-50%);
  background:rgba(0,0,0,.65);color:#fff;font-family:var(--font-mono);font-size:10px;
  padding:2px 8px;border-radius:0;border:1px solid rgba(255,255,255,.2);
  white-space:nowrap;z-index:2;
}
/* Footer caption + bouton */
.w95-lb-footer {
  padding:6px 12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;
  border-top:1px solid var(--silver-dk);flex-shrink:0;
}
.w95-lb-caption { flex:1;min-width:0; }
.w95-lb-caption-title { font-size:12px;font-weight:800;color:var(--navy); }
.w95-lb-caption-sub   { font-size:10px;color:var(--text-muted);margin-top:1px; }
/* Status bar du modal */
.w95-lb-status {
  background:var(--win-bg);display:flex;gap:2px;padding:0 2px 2px;flex-shrink:0;
}
.w95-lb-scell {
  height:18px;padding:2px 6px;font-family:var(--font-ui);font-size:10px;color:var(--text-muted);
  border:1px solid var(--silver-dk);box-shadow:inset 1px 1px var(--black),1px 1px var(--white);
  display:flex;align-items:center;
}
.w95-lb-scell.main { flex:1; }
.w95-lb-scell.sm   { width:80px;justify-content:center; }

/* Responsive media */

/* ── Utility ── */
.flex-row { display:flex;flex-direction:row; }
.flex-col { display:flex;flex-direction:column; }
.gap-8  { gap:8px; }
.gap-12 { gap:12px; }
.mb-8  { margin-bottom:8px; }
.mb-12 { margin-bottom:12px; }
.grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:8px; }
.grid-3 { display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px; }
.grid-4 { display:grid;grid-template-columns:repeat(4,1fr);gap:6px; }
.text-sm { font-size:11px; }
.text-xs { font-size:10px; }
@keyframes glint { 0%{background-position:200% center} 100%{background-position:-200% center} }
.w95-glint { background:linear-gradient(90deg,transparent 30%,rgba(255,255,255,.2) 50%,transparent 70%);background-size:200% auto;animation:glint 3s linear infinite; }
.w95-ripple-host { position:relative;overflow:hidden; }
@keyframes ripple { to{transform:scale(4);opacity:0} }
.w95-ripple-wave { position:absolute;border-radius:50%;background:rgba(255,255,255,.35);transform:scale(0);animation:ripple .5s ease-out;pointer-events:none; }

/* ── RESPONSIVE MOBILE ── */
@media (max-width:640px) {
  .w95-win { max-width:calc(100vw - 8px) !important;max-height:calc(100vh - 80px) !important;left:4px !important; }
  .w95-proj-grid { grid-template-columns:1fr; }
  .w95-svc-grid  { grid-template-columns:1fr 1fr; }
  .w95-plan-grid { grid-template-columns:1fr; }
  .grid-3 { grid-template-columns:1fr 1fr; }
  .grid-4 { grid-template-columns:1fr 1fr 1fr; }
  .w95-lb-win { width:100vw !important;max-height:100vh !important;border-radius:0; }
  .w95-lb-overlay { padding:0; }
  .w95-lb-imgzone { min-height:200px;max-height:55vh; }
  .w95-lb-imgzone img { max-height:55vh; }
  .w95-lb-footer { flex-wrap:wrap;gap:6px;padding:4px 8px; }
  .w95-about-photo { width:100px;height:100px; }
  .w95-about-row { flex-direction:column !important; }
  .w95-tbbtn { max-width:80px;font-size:9px; }
  .w95-icons { top:10px;left:8px; }
  .w95-icon { width:60px; }
  .w95-section-tabs { overflow-x:auto; }
  .w95-price-tabs { flex-wrap:nowrap;overflow-x:auto; }
  .w95-toolbar { display:none; }
  .w95-addrbar { display:none; }
  .w95-menubar { display:none; }
  .w95-content { padding:8px 8px; }
  .w95-titlebar-btns .w95-wbtn { width:20px;height:18px;font-size:11px; }
}
@media (max-width:400px) {
  .w95-svc-grid { grid-template-columns:1fr; }
  .w95-lb-imgzone { min-height:160px;max-height:45vh; }
}

/* ── Draggable desktop icons (absolute positioned) ── */
.w95-icon-abs {
  position:absolute;
  display:flex;flex-direction:column;align-items:center;gap:5px;
  width:76px;padding:8px 4px 6px;border-radius:2px;
  cursor:pointer;text-align:center;
  transition:background .1s;
  touch-action:none;
  z-index:10;
}
.w95-icon-abs:hover,.w95-icon-abs.selected {
  background:rgba(0,0,128,.5);
  outline:1px dotted rgba(255,255,255,.8);
}
.w95-icon-abs.dragging {
  opacity:.75;
  outline:1px dashed rgba(255,255,255,.6);
  background:rgba(0,0,128,.35);
  cursor:grabbing;
  z-index:50;
}
`;

// ═══════════════════════════════════════════════════════════════
// 1b. CSS INJECTION SYNCHRONE (avant le premier rendu, pas en useEffect)
// ═══════════════════════════════════════════════════════════════

function injectCSS() {
  if (typeof document === 'undefined') return;
  const id = 'w95-v3-css';
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = CSS;
  document.head.appendChild(el);
}

function removeCSS() {
  document.getElementById('w95-v3-css')?.remove();
}

function useCSS() {
  // Injection synchrone : appelée PENDANT le rendu (pas après)
  injectCSS();

  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
      removeCSS();
    };
  }, []);
}

// ═══════════════════════════════════════════════════════════════
// 2. CUSTOM CURSOR — position globale mémorisée entre les modes
// ═══════════════════════════════════════════════════════════════

// Module-level: mémorise la position même après unmount
let _mx = typeof window !== 'undefined' ? window.innerWidth / 2 : 400;
let _my = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;

function CustomCursor() {
  const ref = useRef(null);

  useEffect(() => {
    // Positionne immédiatement au dernier endroit connu
    if (ref.current) {
      ref.current.style.transform = `translate(${_mx - 2}px,${_my - 2}px)`;
    }

    const move = e => {
      _mx = e.clientX;
      _my = e.clientY;
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX - 2}px,${e.clientY - 2}px)`;
      }
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="w95-cursor" ref={ref}>
      <div className="w95-cursor-inner" />
      <div className="w95-cursor-dot" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. FA ICON HELPER (Font Awesome déjà chargé dans index.html)
// ═══════════════════════════════════════════════════════════════

const Fa = ({ icon, style = {} }) => (
  <i className={`fas fa-${icon}`} style={style} aria-hidden="true" />
);

// Icône pour la titlebar (blanche)
const TitleIcon = ({ type }) => {
  const map = {
    welcome: 'desktop',
    about: 'user',
    projects: 'folder-open',
    skills: 'code',
    services: 'briefcase',
    contact: 'envelope',
    faq: 'question-circle',
    detail: 'file-alt',
    gallery: 'images',
  };
  return <Fa icon={map[type] || 'window-maximize'} style={{ fontSize: 12, color: '#fff' }} />;
};

// ═══════════════════════════════════════════════════════════════
// 4. CLOCK
// ═══════════════════════════════════════════════════════════════

function Clock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    tick(); const id = setInterval(tick, 30000); return () => clearInterval(id);
  }, []);
  return (
    <div className="w95-clock">
      <Fa icon="volume-up" style={{ fontSize: 11 }} />
      <span>{t}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. SVG ICONS (pour les icônes du bureau)
// ═══════════════════════════════════════════════════════════════

const ICON_SVGS = {
  about: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#1a5fa8" />
      <circle cx="20" cy="14" r="6" fill="#fff" opacity=".9" />
      <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="14" r="3" fill="#60aaff" /></svg>
  ),
  projects: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#daa520" />
      <rect x="4" y="4" width="14" height="14" rx="2" fill="#fff" opacity=".9" />
      <rect x="22" y="4" width="14" height="14" rx="2" fill="#fff" opacity=".7" />
      <rect x="4" y="22" width="14" height="14" rx="2" fill="#fff" opacity=".7" />
      <rect x="22" y="22" width="14" height="14" rx="2" fill="#fff" opacity=".9" />
      <rect x="6" y="6" width="10" height="10" rx="1" fill="#c8890a" />
      <rect x="24" y="24" width="10" height="10" rx="1" fill="#c8890a" /></svg>
  ),
  skills: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#006644" />
      <path d="M8 20h6l4-10 6 20 4-14 4 4h6" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" /></svg>
  ),
  services: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#6b21a8" />
      <circle cx="20" cy="20" r="10" stroke="#fff" strokeWidth="2" />
      <path d="M20 10v4M20 26v4M10 20h4M26 20h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="20" r="4" fill="#fff" /></svg>
  ),
  contact: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#b91c1c" />
      <rect x="6" y="10" width="28" height="20" rx="3" fill="#fff" opacity=".9" />
      <path d="M6 13l14 9 14-9" stroke="#b91c1c" strokeWidth="2" /></svg>
  ),
  faq: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#0e7490" />
      <path d="M14 16c0-3.314 2.686-6 6-6s6 2.686 6 6c0 3-3 5-3 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="30" r="2" fill="#fff" /></svg>
  ),
  github: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#1a1a2e" />
      <path d="M20 6C12.268 6 6 12.268 6 20c0 6.19 4.008 11.433 9.568 13.29.7.128.957-.303.957-.674 0-.333-.012-1.213-.019-2.38-3.893.846-4.715-1.876-4.715-1.876-.636-1.617-1.553-2.047-1.553-2.047-1.27-.867.096-.85.096-.85 1.404.099 2.143 1.442 2.143 1.442 1.25 2.14 3.278 1.522 4.077 1.163.127-.904.49-1.522.89-1.872-3.108-.354-6.375-1.554-6.375-6.917 0-1.527.546-2.776 1.44-3.754-.144-.355-.624-1.777.137-3.706 0 0 1.174-.376 3.847 1.434A13.389 13.389 0 0120 12.51c1.19.005 2.388.16 3.507.472 2.67-1.81 3.843-1.434 3.843-1.434.763 1.93.283 3.35.139 3.706.896.978 1.44 2.227 1.44 3.754 0 5.376-3.272 6.56-6.389 6.906.502.432.949 1.285.949 2.59 0 1.87-.017 3.377-.017 3.836 0 .374.252.81.963.673C29.995 31.43 34 26.19 34 20c0-7.732-6.268-14-14-14z" fill="#fff" opacity=".9" /></svg>
  ),
  akatech: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#002211" />
      <text x="4" y="26" fontFamily="monospace" fontSize="20" fontWeight="900" fill="#00ff88">AK</text>
      <rect x="4" y="28" width="32" height="2" fill="#00ff88" opacity=".5" /></svg>
  ),
  welcome: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#003366" />
      <rect x="4" y="6" width="32" height="22" rx="3" fill="#fff" opacity=".15" />
      <rect x="6" y="8" width="28" height="18" rx="2" fill="#1a4a8a" />
      <path d="M6 8l14 11 14-11" stroke="#60aaff" strokeWidth="1.5" />
      <rect x="14" y="30" width="12" height="3" rx="1" fill="#fff" opacity=".5" /></svg>
  ),
  gallery: (
    <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#7c3aed" />
      <rect x="4" y="8" width="14" height="11" rx="2" fill="#fff" opacity=".85" />
      <rect x="22" y="8" width="14" height="11" rx="2" fill="#fff" opacity=".65" />
      <rect x="4" y="22" width="14" height="11" rx="2" fill="#fff" opacity=".65" />
      <rect x="22" y="22" width="14" height="11" rx="2" fill="#fff" opacity=".85" />
      <circle cx="11" cy="13" r="3" fill="#7c3aed" opacity=".6" />
      <path d="M4 17l4-4 4 4 3-3 3 3" stroke="#7c3aed" strokeWidth="1.2" opacity=".6" /></svg>
  ),
};

// ═══════════════════════════════════════════════════════════════
// 6. BOOT SCREEN
// ═══════════════════════════════════════════════════════════════

const BOOT_LINES = [
  { t: 300, cls: 'white', txt: 'akaFOLIO BIOS v3.0 — Copyright akaTech 2025' },
  { t: 600, cls: 'white', txt: 'CPU: Elvis K. Fullstack Dev @ 3.6GHz' },
  { t: 900, cls: 'ok', txt: '[OK] RAM Check ............. 14 Projets détectés' },
  { t: 1100, cls: 'ok', txt: '[OK] Frontend drivers ....... React 18 ✓' },
  { t: 1300, cls: 'ok', txt: '[OK] Backend services ........ Flask/Django ✓' },
  { t: 1500, cls: 'ok', txt: '[OK] Deployment module ....... Vercel ✓' },
  { t: 1700, cls: 'ok', txt: '[OK] akaTech Agency .......... En ligne ✓' },
  { t: 1900, cls: 'warn', txt: '[WARN] Café restant ........... Critique' },
  { t: 2100, cls: 'ok', txt: '[OK] Windows XP Wallpaper .... Chargé ✓' },
  { t: 2300, cls: 'info', txt: '[INFO] Localisation ........... Abidjan, CI' },
  { t: 2600, cls: 'ok', txt: '[OK] Système prêt ............ akaFOLIO OS' },
];

function useBootWebGL(canvasRef, active) {
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const cols = Math.floor(canvas.width / 14);
    const drops = Array(cols).fill(1);
    const chars = 'akaTECH01010FULLSTACK REACT DJANGO FLASK NEXT PYTHON WEBGL'.split('');
    let raf;
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = '13px Share Tech Mono, monospace';
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 14, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [active, canvasRef]);
}

function BootScreen({ onDone }) {
  const canvasRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  useBootWebGL(canvasRef, true);

  useEffect(() => {
    let timers = [];
    BOOT_LINES.forEach((l, i) => {
      timers.push(setTimeout(() => {
        setLines(prev => [...prev, l]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        if (i === BOOT_LINES.length - 1) setTimeout(() => setDone(true), 400);
      }, l.t));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w95-boot">
      <canvas ref={canvasRef} className="w95-boot-canvas" style={{ pointerEvents: 'none' }} />
      <div className="w95-boot-content">
        <div className="w95-boot-title">akafolio OS v3</div>
        {lines.map((l, i) => (
          <div key={i} className={`w95-boot-line ${l.cls}`}>{l.txt}</div>
        ))}
        <div className="w95-boot-progress">
          <div className="w95-boot-bar" style={{ width: `${progress}%` }} />
        </div>
        {done ? (
          <button className="w95-boot-enter" onClick={onDone}>
            [ Démarrer le portfolio → ]
          </button>
        ) : (
          <div className="w95-boot-continue">Chargement en cours…</div>
        )}
      </div>
    </div>
  );
}


/* Chemins d'adresse par type de fenêtre */
const WIN_ADDRESS = {
  welcome: 'C:\\akafolio\\Accueil',
  about: 'C:\\akafolio\\À_propos',
  skills: 'C:\\akafolio\\Compétences',
  projects: 'C:\\akafolio\\Projets',
  services: 'C:\\akafolio\\Services_&_Tarifs',
  contact: 'C:\\akafolio\\Contact',
  gallery: 'C:\\akafolio\\Galerie',
  faq: 'C:\\akafolio\\FAQ',
  detail: 'C:\\akafolio\\Projets\\Détail',
};

/* Logo Windows 4 carrés */
function WinLogo() {
  return (
    <div className="w95-winlogo">
      <div className="w95-winlogo-grid">
        <span style={{ background: '#f24' }} />
        <span style={{ background: '#fa0' }} />
        <span style={{ background: '#0af' }} />
        <span style={{ background: '#cc0' }} />
      </div>
    </div>
  );
}

/* Barre d'outils générique */
function WinToolbar({ winType, onClose, onMinimize }) {
  return (
    <div className="w95-toolbar">
      {/* Icône dossier */}
      <button className="w95-toolbtn" title="Dossier">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M1 3v10h14v-8h-7l-2-2z" fill="goldenrod" stroke="#000" strokeWidth=".5" />
        </svg>
      </button>
      {/* Icône home */}
      <button className="w95-toolbtn" title="Accueil">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 1l-7 7h2v7h4v-4h2v4h4v-7h2z" fill="goldenrod" />
        </svg>
      </button>
      <div className="w95-toolsep" />
      {/* Précédent / Suivant */}
      <button className="w95-toolbtn" title="Précédent" style={{ color: 'green', fontWeight: 900 }}>◀</button>
      <button className="w95-toolbtn" title="Suivant" style={{ color: '#888', fontWeight: 900 }}>▶</button>
      <div className="w95-toolsep" />
      {/* Annuler / Actualiser */}
      <button className="w95-toolbtn" title="Annuler" onClick={e => { e.stopPropagation(); onClose?.(); }} style={{ color: 'red', fontWeight: 900 }}>×</button>
      <button className="w95-toolbtn" title="Actualiser" style={{ color: 'green', fontWeight: 900, display: 'inline-block', transform: 'rotate(90deg)' }}>↻</button>
      {/* Logo Windows à droite */}
      <WinLogo />
    </div>
  );
}

function Window({ id, winType, title, defaultPos, defaultSize, isMinimized, isFocused, zIndex,
  menuItems = [], statusText = '', onClose, onMinimize, onFocus, children }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
  const mobilePos = { x: 4, y: 10 };
  const mobileSize = { w: window.innerWidth - 8, h: window.innerHeight - 80 };
  const [pos, setPos] = useState(isMobile ? mobilePos : (defaultPos || { x: 120, y: 50 }));
  const [size, setSize] = useState(isMobile ? mobileSize : (defaultSize || { w: 520, h: 400 }));
  const [maxed, setMaxed] = useState(false);
  const [closing, setClosing] = useState(false);
  const drag = useRef(null);
  const resize = useRef(null);
  const prevRect = useRef(null);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose?.(), 140);
  };
  const handleMax = () => {
    if (!maxed) {
      prevRect.current = { pos: { ...pos }, size: { ...size } };
      setPos({ x: 0, y: 0 });
      setSize({ w: window.innerWidth, h: window.innerHeight - 36 });
      setMaxed(true);
    } else {
      if (prevRect.current) { setPos(prevRect.current.pos); setSize(prevRect.current.size); }
      setMaxed(false);
    }
  };

  const onDragStart = e => {
    if (maxed) return;
    e.preventDefault();
    const sx = e.clientX - pos.x, sy = e.clientY - pos.y;
    drag.current = { sx, sy };
    const move = e2 => { if (drag.current) setPos({ x: e2.clientX - drag.current.sx, y: e2.clientY - drag.current.sy }); };
    const up = () => { drag.current = null; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    onFocus?.();
  };

  const onTouchDragStart = e => {
    if (maxed) return;
    const t = e.touches[0];
    const sx = t.clientX - pos.x, sy = t.clientY - pos.y;
    drag.current = { sx, sy };
    const move = e2 => {
      if (!drag.current) return;
      const t2 = e2.touches[0];
      const nx = t2.clientX - drag.current.sx;
      const ny = t2.clientY - drag.current.sy;
      setPos({ x: Math.max(0, nx), y: Math.max(0, ny) });
    };
    const up = () => {
      drag.current = null;
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    onFocus?.();
  };

  const onResizeStart = e => {
    e.stopPropagation(); e.preventDefault();
    const sx = e.clientX - size.w, sy = e.clientY - size.h;
    resize.current = { sx, sy };
    const move = e2 => { if (resize.current) setSize({ w: Math.max(280, e2.clientX - resize.current.sx), h: Math.max(160, e2.clientY - resize.current.sy) }); };
    const up = () => { resize.current = null; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (isMinimized) return null;

  const addr = WIN_ADDRESS[winType] || `C:\\akafolio\\${title}`;

  return (
    <div
      className={`w95-win${closing ? ' closing' : ''}`}
      style={{ left: maxed ? 0 : pos.x, top: maxed ? 0 : pos.y, width: size.w, height: size.h, zIndex, position: 'absolute' }}
      onMouseDown={() => onFocus?.()}
    >
      <div className="w95-win-inner">

        {/* ── Titlebar ── */}
        <div className={`w95-titlebar${isFocused ? '' : ' inactive'}`} onMouseDown={onDragStart} onTouchStart={onTouchDragStart}>
          <span className="w95-titlebar-icon">
            <TitleIcon type={winType} />
          </span>
          <span className="w95-titlebar-title">{title}</span>
          <div className="w95-titlebar-btns">
            <button className="w95-wbtn help" onClick={e => e.stopPropagation()} title="Aide">?</button>
            <button className="w95-wbtn" onClick={e => { e.stopPropagation(); onMinimize?.(); }} title="Réduire">–</button>
            <button className="w95-wbtn" onClick={e => { e.stopPropagation(); handleMax(); }} title="Agrandir">
              {maxed ? '❐' : '◻'}
            </button>
            <button className="w95-wbtn close" onClick={e => { e.stopPropagation(); handleClose(); }} title="Fermer">×</button>
          </div>
        </div>

        {/* ── Menu bar ── */}
        {menuItems.length > 0 && (
          <div className="w95-menubar">
            {menuItems.map(m => <div key={m} className="w95-menuitem"><u>{m[0]}</u>{m.slice(1)}</div>)}
          </div>
        )}

        {/* ── Toolbar ── */}
        <WinToolbar winType={winType} onClose={handleClose} onMinimize={onMinimize} />

        {/* ── Address bar ── */}
        <div className="w95-addrbar">
          <span className="w95-addr-label"><u>A</u>ddress</span>
          <div className="w95-addr-input">{addr}</div>
        </div>

        {/* ── Content ── */}
        <div className="w95-content">{children}</div>

        {/* ── Status bar — 3 cellules inset ── */}
        <div className="w95-statusbar">
          <div className="w95-statuscell main">{statusText}</div>
          <div className="w95-statuscell sm"></div>
          <div className="w95-statuscell resize" onMouseDown={onResizeStart} style={{ cursor: 'se-resize' }}>
            <div className="w95-resize-grip" />
          </div>
        </div>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 8. WINDOW CONTENTS
// ═══════════════════════════════════════════════════════════════

// ─── Lightbox Win95 — modal image viewer (v2 — zoom + swipe) ───
function Lightbox({ items, index = 0, onClose }) {
  const [cur, setCur] = useState(index);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef(null);

  const item = items ? items[cur] : null;
  const src = item?.src || items;
  const title = item?.title || 'Photo';
  const subtitle = item?.subtitle || '';
  const url = item?.url || null;
  const color = item?.color || 'var(--navy)';
  const total = items?.length || 1;
  const hasPrev = cur > 0;
  const hasNext = cur < total - 1;

  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onClose(); };
    const arr = e => {
      if (e.key === 'ArrowLeft' && hasPrev) { setCur(i => i - 1); setZoomed(false); }
      if (e.key === 'ArrowRight' && hasNext) { setCur(i => i + 1); setZoomed(false); }
    };
    window.addEventListener('keydown', esc);
    window.addEventListener('keydown', arr);
    return () => { window.removeEventListener('keydown', esc); window.removeEventListener('keydown', arr); };
  }, [onClose, hasPrev, hasNext]);

  const addrPath = `C:\\akafolio\\Images\\${title.replace(/\s+/g, '_')}`;

  const goNext = () => { if (hasNext) { setCur(i => i + 1); setZoomed(false); } };
  const goPrev = () => { if (hasPrev) { setCur(i => i - 1); setZoomed(false); } };

  // Swipe touch support
  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) goNext();
    if (dx > 50) goPrev();
    touchStartX.current = null;
  };

  return (
    <div className="w95-lb-overlay" onClick={onClose}>
      <div className="w95-lb-win" onClick={e => e.stopPropagation()}>

        {/* ── Titlebar ── */}
        <div className="w95-lb-titlebar">
          <div className="w95-lb-titlebar-icon">
            <Fa icon="image" style={{ fontSize: 8, color: 'var(--navy)' }} />
          </div>
          <span className="w95-lb-title">
            <Fa icon="images" style={{ marginRight: 5, color: '#adf', fontSize: 10 }} />
            {title} — Visionneuse d'images
          </span>
          <div className="w95-lb-btns">
            <button className="w95-wbtn" title={zoomed ? 'Réduire' : 'Agrandir'} onClick={() => setZoomed(z => !z)} style={{ fontSize: 9 }}>{zoomed ? '⊖' : '⊕'}</button>
            <button className="w95-wbtn help" onClick={e => e.stopPropagation()}>?</button>
            <button className="w95-wbtn" onClick={onClose} title="Fermer">×</button>
          </div>
        </div>

        {/* ── Toolbar navigation ── */}
        <div className="w95-lb-toolbar">
          <button className="w95-toolbtn" title="Précédent"
            disabled={!hasPrev}
            onClick={goPrev}
            style={{ color: hasPrev ? 'green' : '#aaa', fontWeight: 900, opacity: hasPrev ? 1 : .4 }}>◀</button>
          <button className="w95-toolbtn" title="Suivant"
            disabled={!hasNext}
            onClick={goNext}
            style={{ color: hasNext ? 'var(--navy)' : '#aaa', fontWeight: 900, opacity: hasNext ? 1 : .4 }}>▶</button>
          <div className="w95-toolsep" />
          <button className="w95-toolbtn" title={zoomed ? 'Zoom off' : 'Zoom in'} onClick={() => setZoomed(z => !z)}
            style={{ color: zoomed ? 'var(--acc)' : 'var(--navy)', fontWeight: 900, fontSize: 14 }}>
            {zoomed ? '🔍' : '🔎'}
          </button>
          <div className="w95-toolsep" />
          <button className="w95-toolbtn" title="Fermer" onClick={onClose}
            style={{ color: 'red', fontWeight: 900 }}>×</button>
          {total > 1 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginLeft: 8, color: 'var(--text-muted)' }}>
              {cur + 1} / {total}
            </span>
          )}
          <WinLogo />
        </div>

        {/* ── Address bar ── */}
        <div className="w95-lb-addrbar">
          <span className="w95-addr-label"><u>A</u>ddress</span>
          <div className="w95-lb-addr">{addrPath}</div>
        </div>

        {/* ── Zone image ── */}
        <div
          className="w95-lb-imgzone"
          style={{ minHeight: zoomed ? '60vh' : undefined, cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
          onClick={() => setZoomed(z => !z)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Bande couleur projet en haut */}
          {color && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, zIndex: 3 }} />}

          {/* Nav prev */}
          {total > 1 && (
            <button className="w95-lb-nav prev" disabled={!hasPrev} onClick={e => { e.stopPropagation(); goPrev(); }}>❮</button>
          )}

          <img
            key={cur}
            src={item?.src || (typeof items === 'string' ? items : '')}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: zoomed ? '80vh' : '420px',
              objectFit: 'contain',
              display: 'block',
              transition: 'max-height .25s ease, transform .2s ease',
              transform: zoomed ? 'scale(1.05)' : 'scale(1)',
              animation: 'winOpen .2s ease both',
            }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
            }}
          />
          {/* Placeholder si image manquante */}
          <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#666' }}>
            <Fa icon="image" style={{ fontSize: 48, opacity: .3 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>Image non disponible</span>
          </div>

          {/* Compteur */}
          {total > 1 && (
            <div className="w95-lb-counter">{cur + 1} / {total} — {title}</div>
          )}

          {/* Hint zoom */}
          <div style={{
            position: 'absolute', bottom: 8, right: 8, fontSize: 9,
            background: 'rgba(0,0,0,.55)', color: '#ccc',
            padding: '2px 6px', fontFamily: 'var(--font-mono)',
            opacity: .7, pointerEvents: 'none',
          }}>
            {zoomed ? 'Clic pour réduire' : 'Clic pour zoomer'}
          </div>

          {/* Nav next */}
          {total > 1 && (
            <button className="w95-lb-nav next" disabled={!hasNext} onClick={e => { e.stopPropagation(); goNext(); }}>❯</button>
          )}
        </div>

        {/* ── Footer caption + CTA ── */}
        <div className="w95-lb-footer">
          <div className="w95-lb-caption">
            <div className="w95-lb-caption-title"
              style={{ borderLeft: `3px solid ${color}`, paddingLeft: 6 }}>{title}</div>
            {subtitle && <div className="w95-lb-caption-sub">{subtitle}</div>}
          </div>
          {url && (
            <a href={url} target="_blank" rel="noreferrer">
              <button className="w95-btn primary" style={{ fontSize: 10 }}>
                <Fa icon="external-link-alt" style={{ marginRight: 5 }} />Voir le projet
              </button>
            </a>
          )}
          <button className="w95-btn" style={{ fontSize: 10 }} onClick={onClose}>Fermer</button>
        </div>

        {/* ── Status bar ── */}
        <div className="w95-lb-status">
          <div className="w95-lb-scell main">
            {zoomed ? '🔍 Zoom activé — clic pour réduire' : (subtitle || 'Clic image pour zoomer · Swipe ou ◀▶ pour naviguer · Échap pour fermer')}
          </div>
          <div className="w95-lb-scell sm" style={{ fontFamily: 'var(--font-mono)' }}>
            {total > 1 ? `${cur + 1}/${total}` : 'JPG'}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── About ── */
function AboutContent() {
  const [photoLightbox, setPhotoLightbox] = useState(false);
  const SOFT_SKILLS = ["Esprit d'équipe", "Créativité", "Rigueur", "Adaptabilité", "Innovation"];

  return (
    <div>

      {/* ── En-tête : photo + identité + boutons ── */}
      <div className="flex-row gap-12 mb-12 w95-about-row" style={{ alignItems: 'flex-start' }}>
        <div className="w95-about-photo" onClick={() => setPhotoLightbox(true)} title="Cliquer pour agrandir">
          <img src={ME.photo} alt={ME.name}
            onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:48px">👨‍💻</span>'; }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="w95-inset mb-8">
            <div style={{ fontWeight: 900, fontSize: 15, color: 'var(--navy)' }}>{ME.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{ME.title} · {ME.agency}</div>
          </div>
          {/* Boutons ligne 1 */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <a href={ME.site} target="_blank" rel="noreferrer"><button className="w95-btn primary" style={{ fontSize: 10 }}><Fa icon="globe" style={{ marginRight: 4 }} />akaTech</button></a>
            <a href={ME.github} target="_blank" rel="noreferrer"><button className="w95-btn" style={{ fontSize: 10 }}><Fa icon="code-branch" style={{ marginRight: 4 }} />GitHub</button></a>
            <a href={ME.linkedin} target="_blank" rel="noreferrer"><button className="w95-btn" style={{ fontSize: 10 }}><Fa icon="user-tie" style={{ marginRight: 4 }} />LinkedIn</button></a>
          </div>
          {/* Boutons ligne 2 */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href={`https://wa.me/${ME.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
              <button className="w95-btn green" style={{ fontSize: 10 }}><Fa icon="comment" style={{ marginRight: 4 }} />WhatsApp</button></a>
            <a href={ME.cv} download><button className="w95-btn" style={{ fontSize: 10 }}><Fa icon="file-pdf" style={{ marginRight: 4 }} />CV PDF</button></a>
          </div>
        </div>
      </div>

      {/* ── Séparateur ── */}
      <div style={{ height: 1, background: 'var(--silver-dk)', margin: '0 0 12px' }} />

      {/* ── Profil détaillé ── */}
      <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 8 }}>
        <Fa icon="user" style={{ marginRight: 5, color: 'var(--navy)' }} />Profil
      </div>
      <div className="w95-panel" style={{ marginBottom: 10 }}>
        {/* Citation */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontStyle: 'italic',
          color: 'var(--navy)', borderLeft: '3px solid var(--navy)',
          paddingLeft: 8, marginBottom: 8, lineHeight: 1.6
        }}>
          "Ce n'est pas important de réussir du premier coup.<br />L'essentiel est de réussir au final."
          <span style={{ display: 'block', fontStyle: 'normal', color: 'var(--text-muted)', marginTop: 2 }}>— Kevin Ressegaire</span>
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.7, color: 'var(--text-main)', marginBottom: 6 }}>
          Formé en <strong>Réseau et Sécurité Informatique</strong>, je conçois et mets en œuvre des applications web complètes — de l'interface React jusqu'au back-end Python — en appliquant les bonnes pratiques de développement et de sécurité dès la conception.
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.7, color: 'var(--text-main)', marginBottom: 6 }}>
          À l'aise avec <strong>Django, Flask, React, Next.js</strong> et <strong>MySQL</strong>, je développe aussi des solutions orientées <strong>Data &amp; Cartographie</strong> : dashboards, visualisations interactives et intégration de cartes (Leaflet, OpenStreetMap).
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.7, color: 'var(--text-main)', marginBottom: 8 }}>
          Via mon agence <strong>akaTech</strong>, j'ai livré plus de <strong>10 applications web</strong> — SaaS, e-commerce, plateformes — avec une approche orientée produit, sécurité et usages réels.
        </div>
        {/* Soft skills */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {SOFT_SKILLS.map(s => (
            <span key={s} className="w95-raised" style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--navy)' }}>
              <Fa icon="check" style={{ marginRight: 3, color: 'var(--acc2)', fontSize: 9 }} />{s}
            </span>
          ))}
        </div>
      </div>

      {/* ── Séparateur ── */}
      <div style={{ height: 1, background: 'var(--silver-dk)', margin: '0 0 12px' }} />

      {/* ── Parcours professionnel ── */}
      <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 8 }}>
        <Fa icon="history" style={{ marginRight: 5, color: 'var(--navy)' }} />Parcours professionnel
      </div>
      {TIMELINE.map((t, i) => (
        <div className="w95-tl-item" key={i}>
          <div className="w95-tl-dot"><Fa icon={t.icon} style={{ fontSize: 11 }} /></div>
          <div style={{ flex: 1 }}>
            <div className="w95-tl-date">{t.date}</div>
            <div className="w95-tl-title">{t.title}</div>
            <div className="w95-tl-co"><Fa icon="map-marker-alt" style={{ marginRight: 4 }} />{t.company}</div>
            <div className="w95-tl-desc">{t.desc}</div>
            {/* Bullet items enrichis */}
            {t.items && (
              <ul style={{ margin: '5px 0 4px 4px', padding: 0 }}>
                {t.items.map((item, j) => (
                  <li key={j} style={{ listStyle: 'none', fontSize: 10, color: 'var(--text-muted)', padding: '1px 0', display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <Fa icon="angle-right" style={{ color: 'var(--acc)', fontSize: 9, marginTop: 2, flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {t.tags && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                {t.tags.map(tag => <span key={tag} className="w95-proj-tag">{tag}</span>)}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* ── Séparateur ── */}
      <div style={{ height: 1, background: 'var(--silver-dk)', margin: '12px 0' }} />

      {/* ── Contact rapide ── */}
      <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 8 }}>
        <Fa icon="at" style={{ marginRight: 5, color: 'var(--navy)' }} />Contact rapide
      </div>
      <div className="w95-panel">
        <div style={{ fontSize: 11, lineHeight: 2.2 }}>
          <div><Fa icon="envelope" style={{ marginRight: 6, color: 'var(--navy)', width: 14 }} /><a href={`mailto:${ME.email}`} style={{ color: 'var(--navy)' }}>{ME.email}</a></div>
          <div><Fa icon="phone" style={{ marginRight: 6, color: 'var(--navy)', width: 14 }} /><a href={`tel:${ME.phone}`}>{ME.phone}</a></div>
          <div><Fa icon="map-marker-alt" style={{ marginRight: 6, color: 'var(--navy)', width: 14 }} />{ME.location}</div>
          <div><Fa icon="globe" style={{ marginRight: 6, color: 'var(--navy)', width: 14 }} /><a href={ME.site} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}>{ME.site}</a></div>
          <div><Fa icon="code" style={{ marginRight: 6, color: 'var(--navy)', width: 14 }} /><a href={ME.github} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}>{ME.github}</a></div>
          <div><Fa icon="thumbs-up" style={{ marginRight: 6, color: 'var(--navy)', width: 14 }} /><a href={ME.facebook} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}>Facebook akaTech</a></div>
        </div>
      </div>

      {/* Lightbox photo portrait */}
      {photoLightbox && (
        <Lightbox
          items={[{
            src: ME.photo,
            title: ME.name,
            subtitle: ME.title + ' · ' + ME.agency,
            url: ME.site,
            color: 'var(--navy)',
          }]}
          index={0}
          onClose={() => setPhotoLightbox(false)}
        />
      )}
    </div>
  );
}

/* ── Projects ── */
function ProjectsContent({ onDetail }) {
  const [filter, setFilter] = useState('all');
  const [lbIndex, setLbIndex] = useState(null);
  const cats = ['all', 'en-ligne', 'demo', 'en-cours'];
  const labels = { all: `Tous (${PROJECTS.length})`, 'en-ligne': 'En ligne', demo: 'Démos', 'en-cours': 'En cours' };
  const list = useMemo(() =>
    filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === filter), [filter]);

  // Items pour le lightbox — seulement ceux avec une image
  const lbItems = useMemo(() =>
    list.filter(p => p.image).map(p => ({
      src: p.image,
      title: p.title,
      subtitle: p.subtitle + ' · ' + p.year,
      url: p.url,
      color: p.color,
    })), [list]);

  const openLightbox = (p, e) => {
    e.stopPropagation();
    const idx = lbItems.findIndex(it => it.title === p.title);
    if (idx >= 0) setLbIndex(idx);
  };

  return (
    <div>
      <div className="flex-row gap-8 mb-12" style={{ flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} className={`w95-btn${filter === c ? ' primary' : ''}`} onClick={() => { setFilter(c); setLbIndex(null); }}>
            {labels[c]}
          </button>
        ))}
      </div>
      <div className="w95-proj-grid">
        {list.map(p => (
          <div key={p.id} className="w95-proj-card" onClick={() => onDetail?.(p)}>
            <div className="w95-proj-bar" style={{ background: p.color }} />
            {p.image
              ? <img src={p.image} alt={p.title} className="w95-proj-img"
                style={{ cursor: 'zoom-in' }}
                onClick={e => openLightbox(p, e)}
                onError={e => { e.target.style.display = 'none'; }} />
              : <div className="w95-proj-img-ph" style={{ background: p.color }}>
                <Fa icon="folder" style={{ fontSize: 28, color: '#fff', opacity: .6 }} />
              </div>
            }
            <div className="w95-proj-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="w95-proj-title">{p.title}</div>
                {p.isPremium && <span className="w95-proj-badge"><Fa icon="star" /></span>}
              </div>
              <div className="w95-proj-sub">{p.subtitle} — {p.year}</div>
              <div className="w95-proj-desc">{p.desc}</div>
              <div className="w95-proj-tags">
                {p.tech.map(t => <span key={t} className="w95-proj-tag">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox avec navigation prev/next sur les images filtrées */}
      {lbIndex !== null && lbItems.length > 0 && (
        <Lightbox items={lbItems} index={lbIndex} onClose={() => setLbIndex(null)} />
      )}
    </div>
  );
}

/* ── Project Detail ── */
function ProjectDetailContent({ project, onBack }) {
  return (
    <div>
      <button className="w95-btn mb-12" onClick={onBack}>
        <Fa icon="arrow-left" style={{ marginRight: 5 }} />Retour
      </button>
      <div className="w95-inset" style={{ borderLeft: `4px solid ${project.color}`, marginBottom: 12 }}>
        {project.image && (
          <img src={project.image} alt={project.title}
            style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block', marginBottom: 10 }}
            onError={e => { e.target.style.display = 'none'; }} />
        )}
        <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--navy)', marginBottom: 4 }}>{project.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{project.subtitle} — {project.year}</div>
        <div style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{project.desc}</div>
        <div className="mb-8">
          <div className="w95-skill-label"><span>Avancement</span><span>{project.progress}%</span></div>
          <SkillChunks pct={project.progress} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>
            <Fa icon="layer-group" style={{ marginRight: 5 }} />Stack technique :
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {project.tech.map(t => <span key={t} className="w95-proj-tag" style={{ fontSize: 11, padding: '2px 8px' }}>{t}</span>)}
          </div>
        </div>
        <a href={project.url} target="_blank" rel="noreferrer">
          <button className="w95-btn primary">
            <Fa icon="external-link-alt" style={{ marginRight: 5 }} />Voir en ligne
          </button>
        </a>
      </div>
    </div>
  );
}

/* ── Skills ── */
function SkillChunks({ pct }) {
  // Barre de 210px, blocs de 8px + 2px gap → max ~19 blocs visibles
  const total = 19;
  const filled = Math.round((pct / 100) * total);
  return (
    <div className="w95-skill-track">
      {Array.from({ length: filled }).map((_, i) => (
        <div key={i} className="w95-skill-chunk" style={{ animationDelay: `${i * 0.03}s` }} />
      ))}
    </div>
  );
}

function SkillsContent() {
  const Section = ({ title, skills, faIcon }) => (
    <div className="mb-12">
      <div className="w95-raised mb-8" style={{ fontWeight: 900, fontSize: 12 }}>
        <Fa icon={faIcon} style={{ marginRight: 6 }} />{title}
      </div>
      <div className="w95-inset" style={{ padding: '10px 10px 4px', marginBottom: 8 }}>
        {skills.map(s => (
          <div key={s.name}>
            <div className="w95-skill-label">
              <span>{s.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{s.pct}%</span>
            </div>
            <SkillChunks pct={s.pct} />
          </div>
        ))}
      </div>
      <div className="grid-4">
        {skills.map(s => (
          <div key={s.name} className="w95-skill-card">
            <img src={s.icon} alt={s.name} className="w95-skill-icon"
              onError={e => { e.target.style.display = 'none'; }} />
            <span className="w95-skill-name">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div>
      <Section title="Frontend" faIcon="desktop" skills={SKILLS.frontend} />
      <Section title="Backend" faIcon="server" skills={SKILLS.backend} />
      <Section title="Outils Dev" faIcon="tools" skills={SKILLS.tools} />
      <Section title="Autres" faIcon="briefcase" skills={SKILLS.autres} />
    </div>
  );
}

/* ── Services — deux sections distinctes ── */
function ServicesContent() {
  const [section, setSection] = useState('services'); // 'services' | 'tarifs'
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Navigation deux sections */}
      <div className="w95-section-tabs">
        <button
          className={`w95-section-tab${section === 'services' ? ' active' : ''}`}
          onClick={() => setSection('services')}>
          <Fa icon="tools" />&nbsp;Services
        </button>
        <button
          className={`w95-section-tab${section === 'tarifs' ? ' active' : ''}`}
          onClick={() => setSection('tarifs')}>
          <Fa icon="tags" />&nbsp;Tarifs
        </button>
      </div>

      {/* ─── SECTION SERVICES ─── */}
      {section === 'services' && (
        <div>
          <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Fa icon="concierge-bell" style={{ color: 'var(--navy)' }} />
            Services proposés
          </div>
          <div className="w95-svc-grid">
            {SERVICES_DATA.map(s => (
              <div key={s.n} className="w95-svc-card">
                <div className="w95-svc-n" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Fa icon={s.icon} style={{ fontSize: 14, color: 'var(--navy)', marginBottom: 2 }} />
                  <span>{s.n}</span>
                </div>
                <div className="w95-svc-ttl">{s.title}</div>
                <div className="w95-svc-desc">{s.desc}</div>
                <ul className="w95-svc-feat">
                  {s.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'var(--silver-dk)', margin: '4px 0 12px' }} />
          <div className="w95-panel">
            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
              <Fa icon="lightbulb" style={{ marginRight: 5, color: 'var(--acc)' }} />
              Chaque projet est unique — devis gratuit sous 24h.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <a href={`mailto:${ME.email}`}><button className="w95-btn primary" style={{ fontSize: 10 }}><Fa icon="envelope" style={{ marginRight: 4 }} />Email</button></a>
              <a href={`https://wa.me/${ME.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                <button className="w95-btn green" style={{ fontSize: 10 }}><Fa icon="comment" style={{ marginRight: 4 }} />WhatsApp</button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION TARIFS ─── */}
      {section === 'tarifs' && (
        <div>
          <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Fa icon="money-bill-wave" style={{ color: 'var(--navy)' }} />
            Grille tarifaire
          </div>

          {/* Onglets par type de projet */}
          <div className="w95-price-tabs">
            {PRICING_TABS.map((t, i) => (
              <button key={t.key}
                className={`w95-btn${activeTab === i ? ' primary' : ''}`}
                style={{ fontSize: 10, minWidth: 0, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => setActiveTab(i)}>
                <Fa icon={t.icon} /> {t.label}
              </button>
            ))}
          </div>

          <div className="w95-plan-grid">
            {PRICING_TABS[activeTab].plans.map((p, i) => (
              <div key={i} className={`w95-plan-card${p.isPopular ? ' popular' : ''}`}>
                {p.isPopular && (
                  <div style={{ fontSize: 9, color: 'var(--acc)', fontWeight: 800, marginBottom: 2 }}>
                    <Fa icon="fire" /> POPULAIRE
                  </div>
                )}
                <div className="w95-plan-badge">{p.badge}</div>
                <div className="w95-plan-price">{p.price}</div>
                <div className="w95-plan-del">
                  <Fa icon="clock" style={{ marginRight: 3 }} />{p.delivery}
                </div>
                <ul className="w95-plan-feat">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'var(--silver-dk)', margin: '12px 0' }} />
          <div className="w95-panel">
            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
              <Fa icon="info-circle" style={{ marginRight: 5, color: 'var(--navy)' }} />
              Tarifs indicatifs — devis personnalisé <strong>gratuit sous 24h</strong>.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <a href={`mailto:${ME.email}`}><button className="w95-btn primary" style={{ fontSize: 10 }}><Fa icon="envelope" style={{ marginRight: 4 }} />Email</button></a>
              <a href={`https://wa.me/${ME.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                <button className="w95-btn green" style={{ fontSize: 10 }}><Fa icon="comment" style={{ marginRight: 4 }} />WhatsApp</button></a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Contact ── */
function ContactContent({ onAlert }) {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const send = () => {
    if (!form.name || !form.email || !form.msg) { onAlert('Remplissez tous les champs.', 'Erreur'); return; }
    onAlert(`Message envoyé ! Je vous réponds rapidement, ${form.name}.`, 'Succès');
    setForm({ name: '', email: '', msg: '' });
  };
  return (
    <div>
      <div className="w95-panel mb-12">
        <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 8 }}>
          <Fa icon="satellite-dish" style={{ marginRight: 5, color: 'var(--navy)' }} />Coordonnées
        </div>
        <div style={{ fontSize: 11, lineHeight: 2.2 }}>
          <div><Fa icon="envelope" style={{ width: 16, marginRight: 6, color: 'var(--navy)' }} /><a href={`mailto:${ME.email}`} style={{ color: 'var(--navy)' }}>{ME.email}</a></div>
          <div><Fa icon="phone" style={{ width: 16, marginRight: 6, color: 'var(--navy)' }} /><a href={`tel:${ME.phone}`}>{ME.phone}</a></div>
          <div><Fa icon="comment-dots" style={{ width: 16, marginRight: 6, color: '#128C7E' }} /><a href={`https://wa.me/${ME.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}>WhatsApp</a></div>
          <div><Fa icon="map-marker-alt" style={{ width: 16, marginRight: 6, color: 'var(--navy)' }} />{ME.location}</div>
          <div><Fa icon="globe" style={{ width: 16, marginRight: 6, color: 'var(--navy)' }} /><a href={ME.site} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}>{ME.site}</a></div>
          <div><Fa icon="code" style={{ width: 16, marginRight: 6, color: 'var(--navy)' }} /><a href={ME.github} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}>{ME.github}</a></div>
          <div><Fa icon="user-tie" style={{ width: 16, marginRight: 6, color: 'var(--navy)' }} /><a href={ME.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}>LinkedIn</a></div>
          <div><Fa icon="thumbs-up" style={{ width: 16, marginRight: 6, color: '#1877F2' }} /><a href={ME.facebook} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)' }}>Facebook akaTech</a></div>
          <div><Fa icon="file-pdf" style={{ width: 16, marginRight: 6, color: '#c00' }} /><a href={ME.cv} download style={{ color: 'var(--navy)' }}>Télécharger CV PDF</a></div>
        </div>
      </div>
      <div className="w95-field"><label className="w95-label"><Fa icon="user" style={{ marginRight: 5 }} />Nom complet :</label>
        <input className="w95-input" value={form.name} onChange={set('name')} placeholder="Votre nom" /></div>
      <div className="w95-field"><label className="w95-label"><Fa icon="envelope" style={{ marginRight: 5 }} />Email :</label>
        <input className="w95-input" type="email" value={form.email} onChange={set('email')} placeholder="votre@email.com" /></div>
      <div className="w95-field"><label className="w95-label"><Fa icon="comment-alt" style={{ marginRight: 5 }} />Message :</label>
        <textarea className="w95-input" rows={4} value={form.msg} onChange={set('msg')}
          placeholder="Décrivez votre projet..." style={{ resize: 'vertical', fontFamily: 'var(--font-ui)' }} /></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="w95-btn primary" onClick={send}><Fa icon="paper-plane" style={{ marginRight: 5 }} />Envoyer</button>
        <button className="w95-btn" onClick={() => setForm({ name: '', email: '', msg: '' })}><Fa icon="eraser" style={{ marginRight: 5 }} />Effacer</button>
        <a href={`https://wa.me/${ME.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
          <button className="w95-btn green"><Fa icon="comment" style={{ marginRight: 5 }} />WhatsApp</button></a>
      </div>
    </div>
  );
}

/* ── FAQ ── */
function FAQContent() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 10 }}>
        <Fa icon="question-circle" style={{ marginRight: 5, color: 'var(--navy)' }} />Questions fréquentes
      </div>
      {FAQ.map((f, i) => (
        <div key={i} className="w95-faq-item">
          <div className={`w95-faq-q${open === i ? ' open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
            <Fa icon={open === i ? 'chevron-down' : 'chevron-right'} style={{ fontSize: 9 }} />
            <span>{f.q}</span>
          </div>
          {open === i && <div className="w95-faq-a">{f.a}</div>}
        </div>
      ))}
      <div style={{ height: 1, background: 'var(--silver-dk)', margin: '16px 0 12px' }} />
      <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 8 }}>
        <Fa icon="rocket" style={{ marginRight: 5, color: 'var(--navy)' }} />Démarrer un projet
      </div>
      <div className="w95-panel">
        <div style={{ fontSize: 11, lineHeight: 1.6 }}>
          Vous avez un projet en tête ? Contactez-moi pour un <strong>devis gratuit</strong> sous 24h.
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <a href={`mailto:${ME.email}`}><button className="w95-btn primary" style={{ fontSize: 10 }}><Fa icon="envelope" style={{ marginRight: 4 }} />Email</button></a>
          <a href={`https://wa.me/${ME.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
            <button className="w95-btn green" style={{ fontSize: 10 }}><Fa icon="comment" style={{ marginRight: 4 }} />WhatsApp</button></a>
        </div>
      </div>
    </div>
  );
}

/* ── Welcome ── */
function WelcomeContent({ onOpen }) {
  const art =
    `╔═════════════════════════════════╗
║   akaFOLIO v3 — Win95/WinXP OS  ║
║   by M'BOLLO aka           ║
║   akaTech · Abidjan, CI          ║
╚═════════════════════════════════╝`;
  return (
    <div>
      <pre style={{
        fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--navy)', background: 'var(--white)',
        boxShadow: 'var(--sunken)', padding: 12, marginBottom: 12, overflowX: 'auto', lineHeight: 1.4
      }}>{art}</pre>
      <div style={{ fontSize: 12, lineHeight: 1.7, marginBottom: 14 }}>
        Bienvenue dans mon portfolio interactif !<br />
        Double-cliquez sur les icônes ou utilisez le menu <strong>Démarrer</strong>.
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { id: 'about', label: 'À propos', icon: 'user' },
          { id: 'projects', label: 'Projets', icon: 'folder-open' },
          { id: 'skills', label: 'Skills', icon: 'code' },
          { id: 'services', label: 'Services', icon: 'briefcase' },
          { id: 'contact', label: 'Contact', icon: 'envelope' },
          { id: 'faq', label: 'FAQ', icon: 'question-circle' },
        ].map(({ id, label, icon }) => (
          <button key={id} className="w95-btn" onClick={() => onOpen(id)} style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Fa icon={icon} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 10. ALERT DIALOG
// ═══════════════════════════════════════════════════════════════

function AlertDialog({ msg, title, onClose }) {
  return (
    <div className="w95-alert-overlay" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="w95-alert-box">
        <div className="w95-alert-title">
          <span style={{ fontWeight: 800, fontSize: 11, color: '#fff' }}>
            <Fa icon="exclamation-triangle" style={{ marginRight: 5 }} />{title}
          </span>
          <button className="w95-wbtn close" onClick={onClose}>
            <svg viewBox="0 0 10 10"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="w95-alert-body">
          <div className="w95-alert-msg">
            <span className="w95-alert-icon"><Fa icon="comment-dots" style={{ fontSize: 24 }} /></span>
            <p className="w95-alert-text">{msg}</p>
          </div>
          <div className="w95-alert-btns"><button className="w95-btn primary" onClick={onClose}>OK</button></div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 11. START MENU
// ═══════════════════════════════════════════════════════════════

function StartMenu({ onOpen, onClose }) {
  const items = [
    { id: 'welcome', icon: 'desktop', label: 'Bureau' },
    { id: 'about', icon: 'user', label: 'À propos' },
    { id: 'projects', icon: 'folder-open', label: 'Projets' },
    { id: 'skills', icon: 'code', label: 'Compétences' },
    { id: 'services', icon: 'briefcase', label: 'Services & Tarifs' },
    { id: 'contact', icon: 'envelope', label: 'Contact' },
    { id: 'faq', icon: 'question-circle', label: 'FAQ' },
    null,
    { id: '_github', icon: 'code-branch', label: 'GitHub' },
    { id: '_linkedin', icon: 'user-tie', label: 'LinkedIn' },
    { id: '_site', icon: 'globe', label: 'akaTech.vercel.app' },
  ];
  const handle = id => {
    onClose();
    if (id === '_github') { window.open(ME.github, '_blank'); return; }
    if (id === '_linkedin') { window.open(ME.linkedin, '_blank'); return; }
    if (id === '_site') { window.open(ME.site, '_blank'); return; }
    onOpen(id);
  };
  return (
    <div className="w95-startmenu" onClick={e => e.stopPropagation()}>
      <div className="w95-sm-sidebar"><div className="w95-sm-sidetext">akaTech OS</div></div>
      <div className="w95-sm-items">
        {items.map((item, i) =>
          item === null
            ? <div key={i} className="w95-sm-sep" />
            : <div key={item.id} className="w95-sm-item" onClick={() => handle(item.id)}>
              <span className="w95-sm-icon"><Fa icon={item.icon} /></span>
              <span>{item.label}</span>
            </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 12. TASKBAR
// ═══════════════════════════════════════════════════════════════

const WIN_META = {
  welcome: { icon: 'desktop', title: 'Bureau' },
  about: { icon: 'user', title: 'À propos' },
  projects: { icon: 'folder-open', title: 'Projets' },
  skills: { icon: 'code', title: 'Compétences' },
  services: { icon: 'briefcase', title: 'Services & Tarifs' },
  contact: { icon: 'envelope', title: 'Contact' },
  faq: { icon: 'question-circle', title: 'FAQ' },
  detail: { icon: 'file-alt', title: 'Projet' },
  gallery: { icon: 'images', title: 'Galerie' },
};

function Taskbar({ windows, focusedId, onToggle, showStart, onStart }) {
  return (
    <div className="w95-taskbar">
      <button className={`w95-start${showStart ? ' active' : ''}`} onClick={onStart}>
        <div className="w95-start-logo">
          <span style={{ background: '#f00', height: 8, width: 8 }} />
          <span style={{ background: '#0a0', height: 8, width: 8 }} />
          <span style={{ background: '#00f', height: 8, width: 8 }} />
          <span style={{ background: '#fa0', height: 8, width: 8 }} />
        </div>
        <strong>Démarrer</strong>
      </button>
      <div className="w95-tbsep" />
      {windows.map(w => {
        const meta = WIN_META[w.type] || WIN_META.welcome;
        return (
          <button key={w.id}
            className={`w95-tbbtn${focusedId === w.id && !w.isMinimized ? ' active' : ''}`}
            onClick={() => onToggle(w.id)}>
            <Fa icon={meta.icon} style={{ fontSize: 11, flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.title || meta.title}</span>
          </button>
        );
      })}
      <Clock />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 13. DESKTOP ICONS
// ═══════════════════════════════════════════════════════════════

const DESKTOP_ICONS_DEF = [
  { id: 'welcome', icon: 'welcome', label: 'Mon Portfolio' },
  { id: 'about', icon: 'about', label: 'À propos' },
  { id: 'projects', icon: 'projects', label: 'Projets' },
  { id: 'skills', icon: 'skills', label: 'Compétences' },
  { id: 'services', icon: 'services', label: 'Services & Tarifs' },
  { id: 'contact', icon: 'contact', label: 'Contact' },
  { id: 'faq', icon: 'faq', label: 'FAQ' },
  { id: '_github', icon: 'github', label: 'GitHub' },
  { id: '_site', icon: 'akatech', label: 'akaTech' },
];

function DesktopIcon({ def, selected, onClick, pos, onDragEnd }) {
  const clickRef = useRef(0);
  const dragRef = useRef(null);
  const nodeRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [curPos, setCurPos] = useState(pos);

  // Sync external pos changes
  useEffect(() => { setCurPos(pos); }, [pos]);

  // Attache touchmove en non-passive pour pouvoir appeler e.preventDefault()
  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const onTM = (e) => {
      if (!dragRef.current) return;
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - dragRef.current.startX;
      const dy = t.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true;
      const nx = Math.max(0, dragRef.current.origX + dx);
      const ny = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.origY + dy));
      setCurPos({ x: nx, y: ny });
    };
    el.addEventListener('touchmove', onTM, { passive: false });
    return () => el.removeEventListener('touchmove', onTM);
  }, []);

  const handle = (e) => {
    // Only trigger click if no drag happened
    if (dragRef.current?.moved) return;
    const now = Date.now();
    if (now - clickRef.current < 450) {
      onClick(def.id, true);
      clickRef.current = 0;
    } else {
      onClick(def.id, false);
      clickRef.current = now;
    }
  };

  const onMouseDown = (e) => {
    e.stopPropagation();
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: curPos.x, origY: curPos.y, moved: false };
    setDragging(true);

    const onMove = (ev) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true;
      const nx = Math.max(0, dragRef.current.origX + dx);
      const ny = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.origY + dy));
      setCurPos({ x: nx, y: ny });
    };
    const onUp = (ev) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      const nx = Math.max(0, dragRef.current.origX + dx);
      const ny = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.origY + dy));
      if (dragRef.current.moved) onDragEnd(def.id, { x: nx, y: ny });
      dragRef.current = null;
      setDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // ── Touch drag (mobile) — drag immédiat dès touchstart ──
  const onTouchStart = (e) => {
    e.stopPropagation();
    const t = e.touches[0];
    dragRef.current = {
      startX: t.clientX, startY: t.clientY,
      origX: curPos.x, origY: curPos.y,
      moved: false,
    };
    setDragging(true);
  };

  const onTouchEnd = (e) => {
    if (!dragRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - dragRef.current.startX;
    const dy = t.clientY - dragRef.current.startY;
    const nx = Math.max(0, dragRef.current.origX + dx);
    const ny = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.origY + dy));
    if (dragRef.current.moved) {
      onDragEnd(def.id, { x: nx, y: ny });
    } else {
      handle(e);
    }
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div
      ref={nodeRef}
      className={`w95-icon-abs${selected ? ' selected' : ''}${dragging ? ' dragging' : ''}`}
      style={{ left: curPos.x, top: curPos.y }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={handle}
    >
      <div className="w95-icon-wrap">{ICON_SVGS[def.icon] || ICON_SVGS.about}</div>
      <div className="w95-icon-label">{def.label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 14. WINDOW MANAGER
// ═══════════════════════════════════════════════════════════════

let _z = 100;
const nz = () => ++_z;

function mkWin(type, opts = {}) {
  const defaults = {
    welcome: { pos: { x: 120, y: 50 }, size: { w: 480, h: 340 } },
    about: { pos: { x: 100, y: 40 }, size: { w: 560, h: 520 } },
    projects: { pos: { x: 80, y: 30 }, size: { w: 660, h: 540 } },
    skills: { pos: { x: 200, y: 60 }, size: { w: 480, h: 520 } },
    services: { pos: { x: 130, y: 45 }, size: { w: 620, h: 580 } },
    contact: { pos: { x: 140, y: 50 }, size: { w: 460, h: 520 } },
    faq: { pos: { x: 160, y: 70 }, size: { w: 500, h: 460 } },
    detail: { pos: { x: 180, y: 100 }, size: { w: 440, h: 400 } },
    gallery: { pos: { x: 90, y: 40 }, size: { w: 720, h: 560 } },
  };
  const d = defaults[type] || { pos: { x: 100, y: 80 }, size: { w: 480, h: 380 } };
  return {
    id: `${type}-${Date.now()}`,
    type,
    title: opts.title || WIN_META[type]?.title || type,
    pos: opts.pos || d.pos,
    size: opts.size || d.size,
    isMinimized: false,
    closed: false,
    zIndex: nz(),
    data: opts.data || null,
  };
}

// ═══════════════════════════════════════════════════════════════
// 15. MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function Win95Portfolio() {
  useCSS();

  // Persister le boot dans sessionStorage — évite de rejouer le boot au switch de mode
  const [booted, setBooted] = useState(() => {
    try { return sessionStorage.getItem('w95-booted') === '1' } catch { return false }
  });
  const [windows, setWindows] = useState(() => [mkWin('welcome')]);
  const [focusedId, setFocusedId] = useState(() => null);
  const [showStart, setShowStart] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selIcon, setSelIcon] = useState(null);

  // ── Positions des icônes (localStorage) ──
  const defaultIconPositions = useCallback(() => {
    const pos = {};
    DESKTOP_ICONS_DEF.forEach((d, i) => {
      pos[d.id] = { x: 20, y: 20 + i * 90 };
    });
    return pos;
  }, []);

  const [iconPositions, setIconPositions] = useState(() => {
    try {
      const saved = localStorage.getItem('w95-icon-positions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all icons have positions
        const defaults = {};
        DESKTOP_ICONS_DEF.forEach((d, i) => { defaults[d.id] = { x: 20, y: 20 + i * 90 }; });
        return { ...defaults, ...parsed };
      }
    } catch { }
    const pos = {};
    DESKTOP_ICONS_DEF.forEach((d, i) => { pos[d.id] = { x: 20, y: 20 + i * 90 }; });
    return pos;
  });

  const handleIconDragEnd = useCallback((id, newPos) => {
    setIconPositions(prev => {
      const next = { ...prev, [id]: newPos };
      try { localStorage.setItem('w95-icon-positions', JSON.stringify(next)); } catch { }
      return next;
    });
  }, []);

  // Sauvegarde du boot dans sessionStorage
  useEffect(() => {
    if (booted) { try { sessionStorage.setItem('w95-booted', '1') } catch { } }
  }, [booted]);

  // Init focusedId after mount
  useEffect(() => {
    setFocusedId(w => w || windows[0]?.id || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openWindow = useCallback((type, opts = {}) => {
    setShowStart(false);
    setWindows(prev => {
      if (type !== 'detail') {
        const ex = prev.find(w => w.type === type && !w.closed);
        if (ex) {
          const z = nz(); setFocusedId(ex.id);
          return prev.map(w => w.id === ex.id ? { ...w, isMinimized: false, zIndex: z } : w);
        }
      }
      const win = mkWin(type, opts);
      setFocusedId(win.id);
      return [...prev, win];
    });
  }, []);

  const closeWindow = useCallback(id => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, closed: true } : w));
    setFocusedId(null);
  }, []);

  const minimizeWindow = useCallback(id => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setFocusedId(null);
  }, []);

  const toggleWindow = useCallback(id => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (!win) return prev;
      if (focusedId === id && !win.isMinimized) {
        setFocusedId(null);
        return prev.map(w => w.id === id ? { ...w, isMinimized: true } : w);
      }
      const z = nz(); setFocusedId(id);
      return prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: z } : w);
    });
  }, [focusedId]);

  const focusWindow = useCallback(id => {
    const z = nz(); setFocusedId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: z } : w));
  }, []);

  const handleIcon = useCallback((id, isDbl) => {
    setSelIcon(id);
    if (isDbl) {
      setSelIcon(null);
      if (id === '_github') { window.open(ME.github, '_blank'); return; }
      if (id === '_linkedin') { window.open(ME.linkedin, '_blank'); return; }
      if (id === '_site') { window.open(ME.site, '_blank'); return; }
      openWindow(id);
    }
  }, [openWindow]);

  // Close start on outside click
  useEffect(() => {
    if (!showStart) return;
    const close = () => setShowStart(false);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [showStart]);

  const openWindows = useMemo(() => windows.filter(w => !w.closed), [windows]);

  return (
    <>
      {/* CustomCursor rendu TOUJOURS — même pendant le boot */}
      <CustomCursor />

      {!booted ? (
        <BootScreen onDone={() => setBooted(true)} />
      ) : (
        <div
          className="w95-desktop"
          style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}
          onClick={() => setSelIcon(null)}
        >
          <div className="w95-scanlines" />

          {/* Desktop icons — draggables, positions dans localStorage */}
          {DESKTOP_ICONS_DEF.map((d, i) => (
            <DesktopIcon
              key={d.id}
              def={d}
              selected={selIcon === d.id}
              onClick={handleIcon}
              pos={iconPositions[d.id] || { x: 20, y: 20 + i * 90 }}
              onDragEnd={handleIconDragEnd}
            />
          ))}

          {/* Windows */}
          {openWindows.map(win => (
            <Window
              key={win.id}
              id={win.id}
              winType={win.type}
              title={win.title || WIN_META[win.type]?.title || win.type}
              defaultPos={win.pos}
              defaultSize={win.size}
              isMinimized={win.isMinimized}
              isFocused={focusedId === win.id}
              zIndex={win.zIndex}
              menuItems={
                win.type === 'projects' ? ['Fichier', 'Affichage', 'Filtre', 'Aide'] :
                  win.type === 'services' ? ['Fichier', 'Services', 'Tarifs', 'Aide'] :
                    win.type === 'about' ? ['Créatif', 'Rigoureux', 'Autonome', 'Dynamique', 'Collectif'] :
                      win.type === 'contact' ? ['Fichier', 'Édition', 'Aide'] : []
              }
              statusText={
                win.type === 'projects' ? `${PROJECTS.length} projets · akaTech Portfolio` :
                  win.type === 'skills' ? 'Frontend · Backend · Outils · Autres' :
                    win.type === 'services' ? 'Services + Tarifs · 4 offres' :
                      win.type === 'contact' ? 'Prêt.' : ''
              }
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
            >
              {win.type === 'welcome' && <WelcomeContent onOpen={openWindow} />}
              {win.type === 'about' && <AboutContent />}
              {win.type === 'skills' && <SkillsContent />}
              {win.type === 'projects' && <ProjectsContent onDetail={p => openWindow('detail', { title: p.title, data: p, pos: { x: 180 + Math.random() * 60, y: 80 + Math.random() * 40 } })} />}
              {win.type === 'services' && <ServicesContent />}
              {win.type === 'contact' && <ContactContent onAlert={(m, t) => setAlert({ msg: m, title: t })} />}
              {win.type === 'faq' && <FAQContent />}
              {win.type === 'detail' && win.data && <ProjectDetailContent project={win.data} onBack={() => closeWindow(win.id)} />}
            </Window>
          ))}

          {/* Start Menu */}
          {showStart && (
            <StartMenu onOpen={openWindow} onClose={() => setShowStart(false)} />
          )}

          {/* Taskbar */}
          <Taskbar
            windows={openWindows}
            focusedId={focusedId}
            onToggle={toggleWindow}
            showStart={showStart}
            onStart={e => { e.stopPropagation(); setShowStart(s => !s); }}
          />

          {/* Alert */}
          {alert && <AlertDialog msg={alert.msg} title={alert.title} onClose={() => setAlert(null)} />}
        </div>
      )}
    </>
  );
}
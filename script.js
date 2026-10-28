/* ============================================================
   1. MATRIX RAIN (Pluie de code en arrière-plan)
   ============================================================ */
(() => {
  const c = document.getElementById('matrixCanvas');
  if (!c) return;
  const x = c.getContext('2d');
  const chars = '0123456789ABCDEFアイウエオカキクケコサシスセソタチツテト'.split('');
  const fs = 16; 
  let cols, drops;
  
  const init = () => {
    c.width = innerWidth; 
    c.height = innerHeight;
    cols = Math.ceil(c.width / fs);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  };
  
  init(); 
  addEventListener('resize', init);
  
  setInterval(() => {
    x.fillStyle = 'rgba(3,6,13,.08)'; 
    x.fillRect(0, 0, c.width, c.height);
    x.font = fs + 'px JetBrains Mono, monospace';
    
    for (let i = 0; i < cols; i++) {
      const ch = chars[(Math.random() * chars.length) | 0];
      const y = drops[i] * fs;
      
      // Tête de la traîne plus brillante, corps en cyan
      x.fillStyle = Math.random() > .96 ? '#ffffff' : '#00ff9d';
      x.fillText(ch, i * fs, y);
      
      if (y > c.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    }
    // On force l'opacité globale via le CSS, mais on garde un léger foncé ici
  }, 50);
})();

/* ============================================================
   2. CERVEAU 3D HOLOGRAPHIQUE (Grand, dense et visible)
   ============================================================ */
(() => {
  const c = document.getElementById('brainCanvas');
  if (!c) return;
  const x = c.getContext('2d');
  
  let W, H, S;
  const resize = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; 
    H = innerHeight;
    c.width = W * d; 
    c.height = H * d; 
    x.setTransform(d, 0, 0, d, 0, 0);
    
    // AUGMENTATION DE L'ÉCHELLE : Le cerveau est maintenant beaucoup plus grand
    S = Math.min(W * (W < 800 ? .65 : .45), H * .55);
  };
  
  resize(); 
  addEventListener('resize', resize);

  const R = Math.random;
  const N = [];
  const add = (px, py, pz, cb) => N.push({ x: px, y: py, z: pz, ph: R() * 6.28, cb });
  
  // Cortex (plus dense pour un effet "massif")
  for (let i = 0; i < 550; i++) {
    const u = R() * 2 - 1, t = R() * 6.283, s = Math.sqrt(1 - u * u);
    const dx = s * Math.cos(t), dy = u, dz = s * Math.sin(t);
    const r = 1 + .09 * Math.sin(6 * dx + 3 * dy) * Math.cos(5 * dz + 2 * dy);
    let py = dy * .95 * r;
    if (py < -.25) py = -.25 + (py + .25) * .5;
    let pz = dz * .9 * r;
    if (Math.abs(pz) < .1 && py > .2) py -= .09; // sillon inter-hémisphérique
    add(dx * 1.35 * r, py, pz);
  }
  
  // Cervelet (plus de détails)
  for (let i = 0; i < 120; i++) {
    const u = R() * 2 - 1, t = R() * 6.283, s = Math.sqrt(1 - u * u);
    add(-.75 + s * Math.cos(t) * .42, -.72 + u * .26, s * Math.sin(t) * .42, true);
    add(-.75 + s * Math.cos(t) * .42, -.72 + u * .26, s * Math.sin(t) * .42, true); // Double densité
  }
  
  // Tronc cérébral
  for (let i = 0; i < 30; i++) {
    add(-.2 - i * .02 + (R() - .5) * .08, -.5 - i * .06, (R() - .5) * .1);
  }

  // Synapses : connexion des voisins proches (distance légèrement augmentée pour plus de liens)
  const E = [];
  N.forEach((a, i) => {
    const near = [];
    N.forEach((b, j) => { 
      if (i < j) { 
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z); 
        if (d < .35) near.push([d, j]); 
      } 
    });
    near.sort((p, q) => p[0] - q[0]).slice(0, 5).forEach(p => E.push({ a: i, b: p[1] }));
  });
  
  const pulses = [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0 = performance.now();
  
  const frame = now => {
    const t = (now - t0) / 1000;
    x.clearRect(0, 0, W, H);
    x.globalCompositeOperation = 'lighter'; // Mode de fusion pour un effet lumineux "glow"
    
    const cx = W * .5, cy = H * .47;
    const ang = t * .18; // Rotation un peu plus lente pour mieux admirer
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const tilt = .18, ct = Math.cos(tilt), st = Math.sin(tilt);

    // Anneaux holographiques de soutien (plus grands)
    for (let k = 0; k < 4; k++) {
      x.save(); 
      x.translate(cx, cy + (k - 1.5) * S * .42);
      x.scale(1, .16); 
      x.rotate(t * (k % 2 ? -.25 : .25) + k);
      x.beginPath(); 
      x.arc(0, 0, S * (1.55 + k * .12), 0, 6.283);
      x.setLineDash(k % 2 ? [3, 14] : [40, 18, 4, 18]); 
      x.lineWidth = 1.4;
      x.strokeStyle = `rgba(0,212,255,${.35 - k * .05})`; 
      x.stroke(); 
      x.restore();
    }
    
    // Plateforme de projection
    const by = cy + S * 1.55;
    for (let k = 0; k < 4; k++) {
      x.beginPath(); 
      x.ellipse(cx, by, S * (.5 + k * .3), S * (.09 + k * .03), 0, 0, 6.283);
      x.setLineDash(k % 2 ? [] : [10, 8]); 
      x.lineDashOffset = -t * 18 * (k % 2 ? 1 : -1);
      x.strokeStyle = `rgba(0,212,255,${.6 - k * .1})`; 
      x.lineWidth = 1.2; 
      x.stroke();
    }
    x.setLineDash([]);
    
    const g = x.createRadialGradient(cx, by, 0, cx, by, S * .8);
    g.addColorStop(0, 'rgba(0,212,255,.5)'); 
    g.addColorStop(1, 'rgba(0,212,255,0)');
    x.fillStyle = g; 
    x.fillRect(cx - S, by - S * .4, S * 2, S * .8);
    
    // Faisceaux de données montants
    x.lineWidth = 1;
    for (let k = 0; k < 14; k++) {
      const px = cx + (k - 6.5) * S * .17;
      const ph = (t * .5 + k * .37) % 1;
      const gr = x.createLinearGradient(0, cy, 0, by);
      gr.addColorStop(0, 'rgba(0,212,255,0)'); 
      gr.addColorStop(ph, 'rgba(120,230,255,.8)'); 
      gr.addColorStop(Math.min(ph + .08, 1), 'rgba(0,212,255,0)');
      x.strokeStyle = gr; 
      x.beginPath(); 
      x.moveTo(px, cy + S * .7); 
      x.lineTo(px, by); 
      x.stroke();
    }

    // Projection 3D des nœuds
    const P = N.map(n => {
      const rx = n.x * ca - n.z * sa;
      const rz = n.x * sa + n.z * ca;
      const ry = n.y * ct - rz * st;
      const rz2 = n.y * st + rz * ct;
      const f = 3.2 / (3.2 + rz2); // Facteur de perspective
      return { X: cx + rx * S * f, Y: cy - ry * S * f, f, d: (rz2 + 1.6) / 3.2 };
    });
    
    // Dessin des connexions (plus visibles)
    x.lineWidth = .9;
    E.forEach(e => {
      const p = P[e.a], q = P[e.b];
      const al = Math.max(.08, .55 * (1 - (p.d + q.d) / 2));
      x.strokeStyle = `rgba(0,212,255,${al})`;
      x.beginPath(); 
      x.moveTo(p.X, p.Y); 
      x.lineTo(q.X, q.Y); 
      x.stroke();
    });
    
    // Impulsions électriques (plus fréquentes et plus brillantes)
    if (!reduce && R() < .45 && pulses.length < 50) {
      pulses.push({ e: E[(R() * E.length) | 0], p: 0 });
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const s = pulses[i];
      const p = P[s.e.a], q = P[s.e.b]; 
      s.p += .04;
      if (s.p >= 1) { pulses.splice(i, 1); continue; }
      
      const px = p.X + (q.X - p.X) * s.p;
      const py = p.Y + (q.Y - p.Y) * s.p;
      
      // Halo de l'impulsion
      x.fillStyle = 'rgba(0,255,157,.4)'; 
      x.beginPath(); 
      x.arc(px, py, 9, 0, 6.283); 
      x.fill();
      
      // Cœur de l'impulsion
      x.fillStyle = 'rgba(255,255,255,.95)'; 
      x.beginPath(); 
      x.arc(px, py, 2.5, 0, 6.283); 
      x.fill();
    }
    
    // Dessin des neurones (plus gros et plus lumineux)
    N.forEach((n, i) => {
      const p = P[i];
      const pu = .6 + .4 * Math.sin(t * 2.2 + n.ph);
      // Taille de base augmentée
      const r = (1.5 + 2.0 * p.f * pu) * (S / 300);
      const al = Math.max(.3, 1 - p.d * .7);
      
      // Halo du neurone
      x.fillStyle = `rgba(0,212,255,${.25 * al})`; 
      x.beginPath(); 
      x.arc(p.X, p.Y, r * 5, 0, 6.283); 
      x.fill();
      
      // Cœur du neurone
      x.fillStyle = n.cb ? `rgba(150,140,255,${al})` : `rgba(220,245,255,${al})`;
      x.beginPath(); 
      x.arc(p.X, p.Y, r, 0, 6.283); 
      x.fill();
    });
    
    x.globalCompositeOperation = 'source-over';
    requestAnimationFrame(frame);
  };
  
  requestAnimationFrame(frame);
})();

/* ============================================================
   3. NAVIGATION & MENU MOBILE
   ============================================================ */
const nav = document.getElementById('navbar');
const burger = document.getElementById('hamburger');
const mobile = document.getElementById('mobileMenu');

addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 40);
});

burger.addEventListener('click', () => { 
  burger.classList.toggle('open'); 
  mobile.classList.toggle('open'); 
});

function closeMenu() { 
  burger.classList.remove('open'); 
  mobile.classList.remove('open'); 
}

/* ============================================================
   4. EFFET DE FRAPPE (TYPING)
   ============================================================ */
(() => {
  const el = document.getElementById('typingText');
  if (!el) return;
  const lines = [
    'Building full-stack products from Lomé', 
    'Shipping AI-powered applications', 
    'Leading architecture as CTO', 
    'Open to remote missions worldwide'
  ];
  let l = 0, i = 0, del = false;
  
  (function tick() {
    const s = lines[l];
    el.textContent = s.slice(0, i);
    if (!del && i === s.length) { del = true; return setTimeout(tick, 1800); }
    if (del && i === 0) { del = false; l = (l + 1) % lines.length; }
    i += del ? -1 : 1;
    setTimeout(tick, del ? 30 : 60);
  })();
})();

/* ============================================================
   5. ANIMATIONS AU SCROLL (REVEAL) & COMPTEURS
   ============================================================ */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('visible'); 
  io.unobserve(e.target);
}), { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target;
  const to = +el.dataset.target; 
  let n = 0;
  const step = setInterval(() => { 
    n++; 
    el.textContent = n + '+'; 
    if (n >= to) clearInterval(step); 
  }, 900 / to);
  cio.unobserve(el);
}), { threshold: .6 });

document.querySelectorAll('.stat-number').forEach(el => cio.observe(el));

/* ============================================================
   6. LIGHTBOX (Zoom sur les images des projets)
   ============================================================ */
function openLightbox(src, cap) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = cap;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden'; // Empêche le scroll derrière
}

function closeLightbox() { 
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('lightbox-img').src = ''; }, 300);
}

addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// Fermer en cliquant en dehors de l'image
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});

/* ============================================================
   7. FORMULAIRE DE CONTACT (Formspree)
   ============================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const st = document.getElementById('formStatus');
    
    btn.disabled = true; 
    st.style.display = 'block'; 
    st.style.color = '#8aa0bd'; 
    st.textContent = 'Sending...';
    
    try {
      const r = await fetch(contactForm.action, { 
        method: 'POST', 
        body: new FormData(contactForm), 
        headers: { Accept: 'application/json' } 
      });
      
      if (!r.ok) throw new Error('Failed');
      
      st.style.color = '#00ff9d'; 
      st.textContent = '✓ Message sent successfully. I will reply shortly.'; 
      contactForm.reset();
    } catch (err) {
      st.style.color = '#ff4d6d'; 
      st.textContent = '✗ Sending failed. Please email me directly at service.proconnect.tg@gmail.com';
    }
    
    btn.disabled = false;
    setTimeout(() => { st.style.display = 'none'; }, 6000);
  });
}
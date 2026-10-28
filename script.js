/* ===== MATRIX : pluie de chiffres (conservée) ===== */
(() => {
  const c = document.getElementById('matrixCanvas'), x = c.getContext('2d');
  const chars = '0123456789ABCDEFアイウエオカキクケコサシスセソ'.split('');
  const fs = 16; let cols, drops;
  const init = () => {
    c.width = innerWidth; c.height = innerHeight;
    cols = Math.ceil(c.width / fs);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  };
  init(); addEventListener('resize', init);
  setInterval(() => {
    x.fillStyle = 'rgba(3,6,13,.09)'; x.fillRect(0, 0, c.width, c.height);
    x.font = fs + 'px JetBrains Mono, monospace';
    for (let i = 0; i < cols; i++) {
      const ch = chars[(Math.random() * chars.length) | 0], y = drops[i] * fs;
      x.fillStyle = Math.random() > .975 ? '#c8fbff' : '#00b8d9';
      x.fillText(ch, i * fs, y);
      if (y > c.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    }
  }, 50);
})();

/* ===== CERVEAU 3D holographique en arrière-plan ===== */
(() => {
  const c = document.getElementById('brainCanvas'), x = c.getContext('2d');
  let W, H, S;
  const resize = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
    S = Math.min(W * (W < 800 ? .5 : .3), H * .36);
  };
  resize(); addEventListener('resize', resize);

  const R = Math.random, N = [];
  const add = (px, py, pz, cb) => N.push({ x: px, y: py, z: pz, ph: R() * 6.28, cb });
  // Cortex (front = +x)
  for (let i = 0; i < 360; i++) {
    const u = R() * 2 - 1, t = R() * 6.283, s = Math.sqrt(1 - u * u);
    const dx = s * Math.cos(t), dy = u, dz = s * Math.sin(t);
    const r = 1 + .09 * Math.sin(6 * dx + 3 * dy) * Math.cos(5 * dz + 2 * dy);
    let py = dy * .95 * r;
    if (py < -.25) py = -.25 + (py + .25) * .5;
    let pz = dz * .9 * r;
    if (Math.abs(pz) < .1 && py > .2) py -= .09; // sillon inter-hémisphérique
    add(dx * 1.35 * r, py, pz);
  }
  // Cervelet
  for (let i = 0; i < 70; i++) {
    const u = R() * 2 - 1, t = R() * 6.283, s = Math.sqrt(1 - u * u);
    add(-.75 + s * Math.cos(t) * .42, -.72 + u * .26, s * Math.sin(t) * .42, true);
  }
  // Tronc cérébral
  for (let i = 0; i < 16; i++) add(-.2 - i * .02 + (R() - .5) * .08, -.5 - i * .06, (R() - .5) * .1);

  // Synapses : voisins proches
  const E = [];
  N.forEach((a, i) => {
    const near = [];
    N.forEach((b, j) => { if (i < j) { const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z); if (d < .3) near.push([d, j]); } });
    near.sort((p, q) => p[0] - q[0]).slice(0, 4).forEach(p => E.push({ a: i, b: p[1] }));
  });
  const pulses = [];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0 = performance.now();
  const frame = now => {
    const t = (now - t0) / 1000;
    x.clearRect(0, 0, W, H);
    x.globalCompositeOperation = 'lighter';
    const cx = W * .5, cy = H * .47, ang = t * .22, ca = Math.cos(ang), sa = Math.sin(ang), tilt = .18, ct = Math.cos(tilt), st = Math.sin(tilt);

    // Anneaux holographiques
    for (let k = 0; k < 4; k++) {
      x.save(); x.translate(cx, cy + (k - 1.5) * S * .42);
      x.scale(1, .16); x.rotate(t * (k % 2 ? -.25 : .25) + k);
      x.beginPath(); x.arc(0, 0, S * (1.55 + k * .12), 0, 6.283);
      x.setLineDash(k % 2 ? [3, 14] : [40, 18, 4, 18]); x.lineWidth = 1.4;
      x.strokeStyle = `rgba(0,190,255,${.28 - k * .03})`; x.stroke(); x.restore();
    }
    // Plateforme
    const by = cy + S * 1.55;
    for (let k = 0; k < 4; k++) {
      x.beginPath(); x.ellipse(cx, by, S * (.5 + k * .3), S * (.09 + k * .03), 0, 0, 6.283);
      x.setLineDash(k % 2 ? [] : [10, 8]); x.lineDashOffset = -t * 18 * (k % 2 ? 1 : -1);
      x.strokeStyle = `rgba(0,212,255,${.5 - k * .1})`; x.lineWidth = 1.2; x.stroke();
    }
    x.setLineDash([]);
    const g = x.createRadialGradient(cx, by, 0, cx, by, S * .6);
    g.addColorStop(0, 'rgba(0,212,255,.45)'); g.addColorStop(1, 'rgba(0,212,255,0)');
    x.fillStyle = g; x.fillRect(cx - S, by - S * .4, S * 2, S * .8);
    // Faisceaux de données
    x.lineWidth = 1;
    for (let k = 0; k < 14; k++) {
      const px = cx + (k - 6.5) * S * .17, ph = (t * .5 + k * .37) % 1;
      const gr = x.createLinearGradient(0, cy, 0, by);
      gr.addColorStop(0, 'rgba(0,212,255,0)'); gr.addColorStop(ph, 'rgba(120,230,255,.7)'); gr.addColorStop(Math.min(ph + .08, 1), 'rgba(0,212,255,0)');
      x.strokeStyle = gr; x.beginPath(); x.moveTo(px, cy + S * .7); x.lineTo(px, by); x.stroke();
    }

    // Projection 3D
    const P = N.map(n => {
      const rx = n.x * ca - n.z * sa, rz = n.x * sa + n.z * ca;
      const ry = n.y * ct - rz * st, rz2 = n.y * st + rz * ct;
      const f = 3.2 / (3.2 + rz2);
      return { X: cx + rx * S * f, Y: cy - ry * S * f, f, d: (rz2 + 1.6) / 3.2 };
    });
    // Connexions
    x.lineWidth = .8;
    E.forEach(e => {
      const p = P[e.a], q = P[e.b], al = Math.max(.04, .42 * (1 - (p.d + q.d) / 2));
      x.strokeStyle = `rgba(40,170,255,${al})`;
      x.beginPath(); x.moveTo(p.X, p.Y); x.lineTo(q.X, q.Y); x.stroke();
    });
    // Impulsions électriques
    if (!reduce && R() < .35 && pulses.length < 40) pulses.push({ e: E[(R() * E.length) | 0], p: 0 });
    for (let i = pulses.length - 1; i >= 0; i--) {
      const s = pulses[i], p = P[s.e.a], q = P[s.e.b]; s.p += .05;
      if (s.p >= 1) { pulses.splice(i, 1); continue; }
      const px = p.X + (q.X - p.X) * s.p, py = p.Y + (q.Y - p.Y) * s.p;
      x.fillStyle = 'rgba(190,245,255,.95)'; x.beginPath(); x.arc(px, py, 2.2, 0, 6.283); x.fill();
      x.fillStyle = 'rgba(0,212,255,.25)'; x.beginPath(); x.arc(px, py, 7, 0, 6.283); x.fill();
    }
    // Neurones
    N.forEach((n, i) => {
      const p = P[i], pu = .6 + .4 * Math.sin(t * 2.2 + n.ph), r = (1.2 + 1.6 * p.f * pu) * (S / 300), al = Math.max(.25, 1 - p.d * .8);
      x.fillStyle = `rgba(0,180,255,${.18 * al})`; x.beginPath(); x.arc(p.X, p.Y, r * 4.5, 0, 6.283); x.fill();
      x.fillStyle = n.cb ? `rgba(150,140,255,${al})` : `rgba(210,245,255,${al})`;
      x.beginPath(); x.arc(p.X, p.Y, r, 0, 6.283); x.fill();
    });
    x.globalCompositeOperation = 'source-over';
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();

/* ===== NAV & MENU ===== */
const nav = document.getElementById('navbar'), burger = document.getElementById('hamburger'), mobile = document.getElementById('mobileMenu');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
burger.addEventListener('click', () => { burger.classList.toggle('open'); mobile.classList.toggle('open'); });
function closeMenu() { burger.classList.remove('open'); mobile.classList.remove('open'); }

/* ===== TYPING ===== */
(() => {
  const el = document.getElementById('typingText');
  const lines = ['Building full-stack products from Lomé', 'Shipping AI-powered applications', 'Leading architecture as CTO', 'Open to remote missions worldwide'];
  let l = 0, i = 0, del = false;
  (function tick() {
    const s = lines[l];
    el.textContent = s.slice(0, i);
    if (!del && i === s.length) { del = true; return setTimeout(tick, 1600); }
    if (del && i === 0) { del = false; l = (l + 1) % lines.length; }
    i += del ? -1 : 1;
    setTimeout(tick, del ? 28 : 55);
  })();
})();

/* ===== COMPTEURS & REVEAL ===== */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('visible'); io.unobserve(e.target);
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, to = +el.dataset.target; let n = 0;
  const step = setInterval(() => { n++; el.textContent = n + '+'; if (n >= to) clearInterval(step); }, 900 / to);
  cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('.stat-number').forEach(el => cio.observe(el));

/* ===== LIGHTBOX ===== */
function openLightbox(src, cap) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = cap;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }
addEventListener('keydown', e => e.key === 'Escape' && closeLightbox());

/* ===== FORMULAIRE (Formspree) ===== */
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, btn = document.getElementById('submitBtn'), st = document.getElementById('formStatus');
  btn.disabled = true; st.style.display = 'block'; st.style.color = '#8aa0bd'; st.textContent = 'Sending...';
  try {
    const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
    if (!r.ok) throw 0;
    st.style.color = '#00ff9d'; st.textContent = 'Message sent. I will reply shortly.'; f.reset();
  } catch {
    st.style.color = '#ff4d6d'; st.textContent = 'Sending failed. Please email me directly.';
  }
  btn.disabled = false;
});
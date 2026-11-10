/* =========================================================================
   Kennedy Kyalo — portfolio interactions
   ========================================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();

  /* ---------- load sequence ---------- */
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('is-loaded'), 120));

  /* ---------- year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- theme ---------- */
  const themeBtn = $('#theme-toggle');
  const themeListeners = [];
  themeBtn?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    themeListeners.forEach((fn) => fn());
  });

  /* ---------- mobile nav ---------- */
  const navToggle = $('#nav-toggle');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  navToggle?.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $$('.nav__link').forEach((l) => l.addEventListener('click', () => setNav(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

  /* ---------- header, progress, back-to-top ---------- */
  const header = $('#header');
  const bar = $('#progress-bar');
  const toTop = $('#to-top');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('is-scrolled', y > 20);
    header.classList.toggle('is-hidden', y > 400 && y > lastY && !document.body.classList.contains('nav-open'));
    toTop.classList.toggle('is-visible', y > 600);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- active nav link ---------- */
  const links = new Map($$('.nav__link').map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.remove('is-active'));
      links.get(en.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach((s) => spy.observe(s));

  /* ---------- rotating role word ---------- */
  const words = $$('.rotator__word');
  if (words.length > 1 && !reduceMotion) {
    let i = 0;
    setInterval(() => {
      const cur = words[i];
      i = (i + 1) % words.length;
      cur.classList.remove('is-active');
      cur.classList.add('is-leaving');
      words[i].classList.add('is-active');
      setTimeout(() => cur.classList.remove('is-leaving'), 700);
    }, 2600);
  }

  /* ---------- split headings into words ---------- */
  $$('.reveal-text').forEach((el) => {
    const text = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', text.join(' '));
    el.innerHTML = text.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
  });

  /* ---------- scroll reveals ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // stagger siblings that reveal together
  $$('.projects__grid, .certs__list, .services__list, .about__copy').forEach((group) => {
    $$('.reveal', group).forEach((el, i) => el.style.setProperty('--d', `${(i % 4) * 0.08}s`));
  });
  $$('.reveal, .reveal-text, .service').forEach((el) => io.observe(el));

  /* ---------- custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    const cursor = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    let mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    addEventListener('mousedown', () => cursor.classList.add('is-down'));
    addEventListener('mouseup', () => cursor.classList.remove('is-down'));
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('mouseover', (e) => {
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, input, textarea, label'));
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$('.magnetic').forEach((btn) => {
      const inner = btn.querySelector('span');
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        if (inner) inner.style.transform = `translate(${x * 0.12}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), color .4s';
        btn.style.transform = '';
        if (inner) { inner.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'; inner.style.transform = ''; }
        setTimeout(() => { btn.style.transition = ''; if (inner) inner.style.transition = ''; }, 600);
      });
    });
  }

  /* ---------- project cards: tilt + spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $$('.project').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-4px)`;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- project filters ---------- */
  const filterWrap = $('.filters');
  if (filterWrap) {
    const pill = document.createElement('span');
    pill.className = 'filter__pill';
    filterWrap.prepend(pill);
    const movePill = (btn, instant) => {
      if (instant) pill.style.transition = 'none';
      pill.style.width = `${btn.offsetWidth}px`;
      pill.style.height = `${btn.offsetHeight}px`;
      pill.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
      if (instant) requestAnimationFrame(() => (pill.style.transition = ''));
    };
    const active = () => $('.filter.is-active', filterWrap);
    movePill(active(), true);
    addEventListener('resize', () => movePill(active(), true));
    document.fonts?.ready.then(() => movePill(active(), true));

    $$('.filter', filterWrap).forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.filter', filterWrap).forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        movePill(btn);
        const f = btn.dataset.filter;
        let n = 0;
        $$('.project').forEach((card) => {
          const show = f === 'all' || card.dataset.cat === f;
          card.classList.remove('is-entering');
          card.classList.toggle('is-hidden', !show);
          if (show) {
            card.classList.add('is-in');
            void card.offsetWidth; // restart animation
            card.style.setProperty('--d', `${n++ * 0.07}s`);
            card.classList.add('is-entering');
          }
        });
      });
    });
  }

  /* ---------- certificate hover peek + viewer ---------- */
  $$('.cert').forEach((c) => {
    const peek = $('.cert__peek', c);
    c.addEventListener('mousemove', (e) => {
      const r = c.getBoundingClientRect();
      peek.style.setProperty('--px', `${(e.clientX - r.left - r.width * 0.6) * 0.25}px`);
      peek.style.setProperty('--py', `${(e.clientY - r.top - r.height / 2) * 0.6}px`);
    });
  });

  const viewer = $('#viewer');
  const vImg = $('#viewer-img');
  const vCap = $('#viewer-caption');
  const closeViewer = () => {
    viewer.classList.remove('is-open');
    setTimeout(() => viewer.close(), reduceMotion ? 0 : 300);
  };
  $$('.cert').forEach((c) => c.addEventListener('click', () => {
    vImg.src = c.dataset.src;
    vImg.alt = `Certificate: ${c.dataset.title}`;
    vCap.textContent = c.dataset.title;
    viewer.showModal();
    requestAnimationFrame(() => viewer.classList.add('is-open'));
  }));
  $('#viewer-close')?.addEventListener('click', closeViewer);
  viewer?.addEventListener('click', (e) => { if (e.target === viewer) closeViewer(); });
  viewer?.addEventListener('cancel', (e) => { e.preventDefault(); closeViewer(); });

  /* ---------- contact form (EmailJS) ---------- */
  const form = $('#contact-form');
  const msg = $('#contact-message');
  const submit = $('#contact-submit');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('input, textarea', form).forEach((f) => {
      const bad = !f.checkValidity();
      f.closest('.field').classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { msg.textContent = 'Add your name, a valid email and a message, then send again.'; return; }
    if (typeof emailjs === 'undefined') { msg.textContent = 'Messaging is unavailable right now. Reach me on LinkedIn instead.'; return; }

    submit.disabled = true;
    submit.querySelector('span').textContent = 'Sending…';
    emailjs.sendForm('service_9ombexc', 'template_bwbd8t8', form, 'xti1CuiQTBsveHzvIctGs')
      .then(() => {
        msg.textContent = 'Message sent. I\'ll get back to you soon.';
        form.reset();
        setTimeout(() => (msg.textContent = ''), 6000);
      }, () => {
        msg.textContent = 'Message not sent: the mail service didn\'t respond. Try again, or reach me on LinkedIn.';
      })
      .finally(() => {
        submit.disabled = false;
        submit.querySelector('span').textContent = 'Send message';
      });
  });
  $$('input, textarea', form || document.createElement('form')).forEach((f) =>
    f.addEventListener('input', () => f.closest('.field').classList.remove('is-invalid')));

  /* =========================================================================
     HERO: a living scatter plot with a real cubic least-squares fit.
     Points drift and resample every few seconds; the fit and its 95% band
     recompute live. Hovering shows a crosshair and the fitted value.
     ========================================================================= */
  const canvas = $('#hero-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const readout = $('#hero-readout');
  const dpr = Math.min(devicePixelRatio || 1, 2);

  let W = 0, H = 0, plot = { x: 0, y: 0, w: 0, h: 0 };
  let colors = {};
  const readColors = () => {
    colors = {
      ink: cssVar('--ink'), muted: cssVar('--muted'), line: cssVar('--line'),
      accent: cssVar('--accent'), signal: cssVar('--signal'), bg: cssVar('--bg'),
    };
  };
  readColors();
  themeListeners.push(readColors);

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (W > 860) {
      plot = { x: W * 0.56, y: H * 0.2, w: W * 0.38, h: H * 0.58 };
    } else {
      plot = { x: 52, y: 20, w: W - 52 - 24, h: H - 56 };
    }
  };
  resize();
  addEventListener('resize', resize);

  // smooth underlying "truth" that slowly changes shape
  let phase = Math.random() * 10;
  const truth = (x, p) => 0.12 + 0.62 * x + 0.12 * Math.sin(x * 5.2 + p) + 0.08 * Math.sin(p * 0.7) * x;
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  const N = W > 860 ? 70 : 40;
  const pts = Array.from({ length: N }, (_, i) => {
    const x = (i + Math.random()) / N;
    const y = truth(x, phase) + gauss() * 0.07;
    return { x, y, ty: y, ox: 0, oy: 0, born: 300 + Math.random() * 900 + x * 600, seed: Math.random() * 6.28 };
  });

  const resample = () => {
    phase += 0.9 + Math.random() * 0.8;
    pts.forEach((p) => { p.ty = Math.min(0.98, Math.max(0.02, truth(p.x, phase) + gauss() * 0.07)); });
  };
  let resampleTimer = reduceMotion ? null : setInterval(resample, 5200);

  // cubic least squares via normal equations (4x4, Gaussian elimination)
  const fit = () => {
    const A = Array.from({ length: 4 }, () => Array(5).fill(0));
    pts.forEach((p) => {
      const xs = [1, p.x, p.x * p.x, p.x * p.x * p.x];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) A[r][c] += xs[r] * xs[c];
        A[r][4] += xs[r] * p.y;
      }
    });
    for (let i = 0; i < 4; i++) {
      let m = i;
      for (let k = i + 1; k < 4; k++) if (Math.abs(A[k][i]) > Math.abs(A[m][i])) m = k;
      [A[i], A[m]] = [A[m], A[i]];
      for (let k = i + 1; k < 4; k++) {
        const f = A[k][i] / A[i][i];
        for (let c = i; c < 5; c++) A[k][c] -= f * A[i][c];
      }
    }
    const b = [0, 0, 0, 0];
    for (let i = 3; i >= 0; i--) {
      let s = A[i][4];
      for (let c = i + 1; c < 4; c++) s -= A[i][c] * b[c];
      b[i] = s / A[i][i];
    }
    const f = (x) => b[0] + b[1] * x + b[2] * x * x + b[3] * x * x * x;
    let ss = 0;
    pts.forEach((p) => { ss += (p.y - f(p.x)) ** 2; });
    const sd = Math.sqrt(ss / (pts.length - 4));
    let ybar = 0; pts.forEach((p) => (ybar += p.y)); ybar /= pts.length;
    let tss = 0; pts.forEach((p) => (tss += (p.y - ybar) ** 2));
    return { f, sd, r2: 1 - ss / tss };
  };

  const toX = (x) => plot.x + x * plot.w;
  const toY = (y) => plot.y + (1 - y) * plot.h;

  let mouse = null;
  const hero = $('.hero');
  hero.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  hero.addEventListener('mouseleave', () => { mouse = null; });

  const start = performance.now();
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);

  const alpha = (hex, a) => {
    if (!hex.startsWith('#')) return hex;
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };
  const ease = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 4);

  const frame = (now) => {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = reduceMotion ? 1e5 : now - start;
    ctx.clearRect(0, 0, W, H);

    // axes + grid
    const gridIn = ease((t - 100) / 900);
    ctx.lineWidth = 1;
    ctx.strokeStyle = alpha(colors.line, 0.9 * gridIn);
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillStyle = alpha(colors.muted, 0.8 * gridIn);
    for (let i = 0; i <= 4; i++) {
      const gy = plot.y + (plot.h * i) / 4;
      ctx.setLineDash([2, 6]);
      ctx.beginPath(); ctx.moveTo(plot.x, gy); ctx.lineTo(plot.x + plot.w * gridIn, gy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = 'right';
      ctx.fillText((1 - i / 4).toFixed(2), plot.x - 10, gy + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) ctx.fillText((i / 4).toFixed(2), plot.x + (plot.w * i) / 4, plot.y + plot.h + 22);
    ctx.strokeStyle = alpha(colors.muted, 0.6 * gridIn);
    ctx.beginPath();
    ctx.moveTo(plot.x, plot.y + plot.h * (1 - gridIn)); ctx.lineTo(plot.x, plot.y + plot.h);
    ctx.lineTo(plot.x + plot.w * gridIn, plot.y + plot.h); ctx.stroke();

    // update points
    pts.forEach((p) => {
      p.y += (p.ty - p.y) * 0.035;
      if (mouse) {
        const dx = toX(p.x) - mouse.x, dy = toY(p.y) - mouse.y;
        const d = Math.hypot(dx, dy);
        const push = d < 90 ? (1 - d / 90) * 16 : 0;
        p.ox += ((d ? dx / d : 0) * push - p.ox) * 0.15;
        p.oy += ((d ? dy / d : 0) * push - p.oy) * 0.15;
      } else { p.ox *= 0.9; p.oy *= 0.9; }
    });

    const model = fit();
    const lineProg = ease((t - 1500) / 1800);

    // confidence band
    ctx.save();
    ctx.beginPath(); ctx.rect(plot.x, plot.y - 6, plot.w + 6, plot.h + 6); ctx.clip();
    if (lineProg > 0) {
      const band = 1.96 * model.sd;
      ctx.beginPath();
      const steps = 80, end = Math.floor(steps * lineProg);
      for (let i = 0; i <= end; i++) { const x = i / steps; ctx.lineTo(toX(x), toY(model.f(x) + band)); }
      for (let i = end; i >= 0; i--) { const x = i / steps; ctx.lineTo(toX(x), toY(model.f(x) - band)); }
      ctx.closePath();
      ctx.fillStyle = alpha(colors.accent, 0.1);
      ctx.fill();
    }
    ctx.restore();

    // points
    pts.forEach((p) => {
      const life = ease((t - p.born) / 700);
      if (life <= 0) return;
      const bob = reduceMotion ? 0 : Math.sin(now / 1400 + p.seed) * 1.6;
      const px = toX(p.x) + p.ox, py = toY(p.y) + p.oy + bob;
      const near = mouse && Math.hypot(px - mouse.x, py - mouse.y) < 90;
      const outlier = Math.abs(p.y - model.f(p.x)) > 1.96 * model.sd;
      ctx.beginPath();
      ctx.arc(px, py, (near ? 5 : 3.6) * life, 0, Math.PI * 2);
      ctx.fillStyle = near || outlier ? colors.signal : alpha(colors.accent, 0.75);
      ctx.fill();
    });

    // fitted curve
    if (lineProg > 0) {
      ctx.beginPath();
      const steps = 120;
      for (let i = 0; i <= steps * lineProg; i++) { const x = i / steps; i ? ctx.lineTo(toX(x), toY(model.f(x))) : ctx.moveTo(toX(x), toY(model.f(x))); }
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // crosshair
    if (mouse && lineProg >= 1 && mouse.x >= plot.x && mouse.x <= plot.x + plot.w && mouse.y > plot.y - 40 && mouse.y < plot.y + plot.h + 40) {
      const x = (mouse.x - plot.x) / plot.w;
      const yv = model.f(x);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = alpha(colors.muted, 0.7);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(mouse.x, plot.y); ctx.lineTo(mouse.x, plot.y + plot.h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(plot.x, toY(yv)); ctx.lineTo(mouse.x, toY(yv)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(mouse.x, toY(yv), 6, 0, Math.PI * 2);
      ctx.fillStyle = colors.bg; ctx.fill();
      ctx.lineWidth = 2.5; ctx.strokeStyle = colors.signal; ctx.stroke();

      const label = `x = ${x.toFixed(2)}   ŷ = ${yv.toFixed(2)}`;
      ctx.font = '500 12px "IBM Plex Mono", monospace';
      const tw = ctx.measureText(label).width + 20;
      const lx = Math.min(mouse.x + 14, plot.x + plot.w - tw), ly = toY(yv) - 38;
      ctx.fillStyle = colors.ink;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(lx, ly, tw, 26, 13) : ctx.rect(lx, ly, tw, 26); ctx.fill();
      ctx.fillStyle = colors.bg; ctx.textAlign = 'left';
      ctx.fillText(label, lx + 10, ly + 17);
    }

    if (readout && lineProg >= 1) {
      readout.textContent = `cubic fit · n = ${pts.length} · R² = ${model.r2.toFixed(2)} · 95% band shaded`;
    }
  };
  requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (reduceMotion) return;
    if (document.hidden) { clearInterval(resampleTimer); resampleTimer = null; }
    else if (!resampleTimer) resampleTimer = setInterval(resample, 5200);
  });
})();

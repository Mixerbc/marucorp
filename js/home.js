(function () {
  'use strict';

  if (!document.body.classList.contains('page-home')) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  requestAnimationFrame(() => {
    document.body.classList.add('home-ready');
    const heroVisual = document.querySelector('.page-home .hero-visual');
    const dashboard = document.querySelector('.page-home .exec-dashboard');
    if (heroVisual) {
      heroVisual.style.opacity = '1';
      heroVisual.style.visibility = 'visible';
    }
    if (dashboard) {
      dashboard.style.opacity = '1';
      dashboard.style.visibility = 'visible';
    }
  });

  /* Título — una frase en loop con efecto máquina de escribir */
  const heroPhraseEl = document.getElementById('heroTypePhrase');
  const heroRotateEl = document.getElementById('heroTypeRotate');
  const heroPhrases = [
    'fiscal y laboral',
    'administrativa y operativa',
    'legal y de cumplimiento',
    'financiera y tecnológica',
  ];

  function runPhraseTypewriter() {
    if (!heroPhraseEl) return;

    if (prefersReduced) {
      heroPhraseEl.textContent = heroPhrases[0];
      return;
    }

    if (heroRotateEl) {
      const longest = heroPhrases.reduce((a, b) => (a.length > b.length ? a : b), '');
      heroRotateEl.style.minWidth = longest.length + 2 + 'ch';
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function schedule(fn, ms) {
      setTimeout(fn, ms);
    }

    function tick() {
      const current = heroPhrases[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        heroPhraseEl.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          schedule(() => {
            deleting = true;
            tick();
          }, 2200);
          return;
        }
        const ch = current.charAt(charIndex - 1);
        schedule(tick, ch === ' ' ? 75 : 105);
      } else {
        charIndex -= 1;
        heroPhraseEl.textContent = current.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % heroPhrases.length;
          schedule(tick, 450);
          return;
        }
        schedule(tick, 40);
      }
    }

    schedule(tick, 700);
  }

  runPhraseTypewriter();

  /* Hub de servicios — pestañas lateral + panel */
  const servicesHub = document.querySelector('.page-home .services-hub');
  if (servicesHub) {
    const hubTabs = servicesHub.querySelectorAll('.services-hub__tab');
    const hubPanels = servicesHub.querySelectorAll('.services-hub__panel');

    function activateHubTab(tab) {
      const panelId = tab.getAttribute('data-panel');
      if (!panelId || tab.classList.contains('is-active')) return;

      hubTabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      hubPanels.forEach((p) => {
        p.classList.remove('is-active');
        p.hidden = true;
      });

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const panel = servicesHub.querySelector('#hub-panel-' + panelId);
      if (panel) {
        panel.classList.add('is-active');
        panel.hidden = false;
      }
    }

    hubTabs.forEach((tab) => {
      tab.addEventListener('click', () => activateHubTab(tab));
    });
  }

  /* Contadores */
  function animateCounter(el, target, suffix, duration) {
    if (prefersReduced) {
      el.textContent = target + (suffix || '');
      return;
    }
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(from + (target - from) * eased);
      el.textContent = value + (suffix || '');
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.add('is-counted');
      }
    };
    requestAnimationFrame(tick);
  }

  function observeCounters(selector) {
    const items = document.querySelectorAll(selector);
    if (!items.length) return;

    if (prefersReduced) {
      items.forEach((strong) => {
        const target = strong.getAttribute('data-count');
        const suffix = strong.getAttribute('data-suffix') || '';
        strong.textContent = target + suffix;
        strong.classList.add('is-counted');
      });
      return;
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const strong = entry.target;
          if (strong.classList.contains('is-counted') || strong.dataset.counting) return;
          strong.dataset.counting = '1';
          const target = parseInt(strong.getAttribute('data-count'), 10);
          const suffix = strong.getAttribute('data-suffix') || '';
          animateCounter(strong, target, suffix, 1400);
          counterObserver.unobserve(strong);
        });
      },
      { threshold: 0.45 }
    );
    items.forEach((el) => counterObserver.observe(el));
  }

  observeCounters('.page-home .hero-metrics strong[data-count]');
  observeCounters('.page-home .exec-kpi strong[data-count]');

  if (prefersReduced) return;

  const ambient = document.querySelector('.page-home .home-ambient');

  /* Parallax al scroll — capa ambiental */
  let scrollY = 0;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let rafId = null;

  function applyMotion() {
    rafId = null;
    if (!ambient) return;

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? scrollY / docH : 0;
    const driftY = scrollY * 0.045;
    const mx = (mouseX - 0.5) * 36;
    const my = (mouseY - 0.5) * 24;
    const sway = Math.sin(progress * Math.PI * 2) * 12;

    ambient.style.transform = `translate(${mx + sway}px, ${driftY + my}px)`;
  }

  function scheduleMotion() {
    if (!rafId) rafId = requestAnimationFrame(applyMotion);
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    scheduleMotion();
  }, { passive: true });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
    scheduleMotion();
  }, { passive: true });

  scrollY = window.scrollY;
  scheduleMotion();

  /* Scroll suave desde indicador del hero */
  const scrollCue = document.querySelector('.page-home .hero-scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', (e) => {
      const href = scrollCue.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const header = document.getElementById('siteHeader');
      const offset = (header ? header.offsetHeight : 72) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  /* Hero dashboard — seguimiento 3D con el mouse */
  const stage = document.querySelector('.page-home [data-hero-3d]');
  const dash3d = document.querySelector('.page-home .exec-dashboard--3d');
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (finePointer && stage && dash3d && window.innerWidth >= 576) {
    let targetRX = 8;
    let targetRY = -14;
    let currentRX = 8;
    let currentRY = -14;
    let tracking = false;
    let dashRaf = null;

    function renderDash3d() {
      currentRX += (targetRX - currentRX) * 0.12;
      currentRY += (targetRY - currentRY) * 0.12;
      dash3d.style.transform =
        `rotateY(${currentRY.toFixed(2)}deg) rotateX(${currentRX.toFixed(2)}deg) translateZ(12px)`;
      if (
        Math.abs(targetRX - currentRX) > 0.05 ||
        Math.abs(targetRY - currentRY) > 0.05 ||
        tracking
      ) {
        dashRaf = requestAnimationFrame(renderDash3d);
      } else {
        dashRaf = null;
      }
    }

    function scheduleDash3d() {
      if (!dashRaf) dashRaf = requestAnimationFrame(renderDash3d);
    }

    stage.addEventListener('pointerenter', () => {
      tracking = true;
      dash3d.classList.add('is-tracking');
      scheduleDash3d();
    });

    stage.addEventListener('pointermove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetRY = -14 + (x - 0.5) * 22;
      targetRX = 8 + (0.5 - y) * 16;
      scheduleDash3d();
    });

    stage.addEventListener('pointerleave', () => {
      tracking = false;
      targetRX = 8;
      targetRY = -14;
      scheduleDash3d();
      setTimeout(() => {
        if (!tracking) {
          dash3d.classList.remove('is-tracking');
          dash3d.style.transform = '';
        }
      }, 400);
    });
  }

  /* Tilt 3D suave en tarjetas */
  const tiltCards = document.querySelectorAll('.page-home .home-tilt');

  if (finePointer && tiltCards.length) {
    tiltCards.forEach((card) => {
      const isModel = card.classList.contains('model-card');
      const isRisk = card.classList.contains('risk-item');
      const maxY = isRisk ? 5 : isModel ? 7 : 10;
      const maxX = isRisk ? 4 : isModel ? 5 : 8;
      const lift = isRisk ? -3 : isModel ? -4 : -6;
      const scale = isRisk ? 1.005 : isModel ? 1.01 : 1.02;
      const perspective = isRisk ? 1200 : isModel ? 1100 : 700;

      card.addEventListener('pointerenter', () => {
        card.classList.add('is-tilting');
      });

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * maxY;
        const rotX = (0.5 - y) * maxX;
        card.style.transform =
          `perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${lift}px) scale(${scale})`;
        card.style.setProperty('--shine-x', `${x * 100}%`);
        card.style.setProperty('--shine-y', `${y * 100}%`);
      });

      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
        card.style.removeProperty('--shine-x');
        card.style.removeProperty('--shine-y');
      });
    });
  }

  /* Re-animar barras del dashboard al entrar en viewport (replay suave) */
  const chartBars = document.querySelectorAll('.page-home .exec-chart__bar');
  if (chartBars.length) {
    const chart = document.querySelector('.page-home .exec-chart');
    if (chart) {
      const barObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            chartBars.forEach((bar) => {
              bar.style.animation = 'none';
              // force reflow
              void bar.offsetWidth;
              bar.style.animation = '';
            });
            barObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      barObserver.observe(chart);
    }
  }
})();

(function () {
  'use strict';

  if (!document.body.classList.contains('page-home')) return;

  const MIN_SHOW_MS = 1400;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startTime = Date.now();

  document.documentElement.classList.add('preloader-active');

  const root = document.createElement('div');
  root.className = 'site-preloader';
  root.setAttribute('role', 'status');
  root.setAttribute('aria-live', 'polite');
  root.setAttribute('aria-label', 'Cargando sitio web');
  root.innerHTML =
    '<div class="site-preloader__particles" aria-hidden="true">' +
      '<span class="site-preloader__dot"></span>' +
      '<span class="site-preloader__dot"></span>' +
      '<span class="site-preloader__dot"></span>' +
      '<span class="site-preloader__dot"></span>' +
      '<span class="site-preloader__dot"></span>' +
      '<span class="site-preloader__dot"></span>' +
    '</div>' +
    '<div class="site-preloader__inner">' +
      '<div class="site-preloader__rings">' +
        '<span class="site-preloader__ring site-preloader__ring--1" aria-hidden="true"></span>' +
        '<span class="site-preloader__ring site-preloader__ring--2" aria-hidden="true"></span>' +
        '<span class="site-preloader__ring site-preloader__ring--3" aria-hidden="true"></span>' +
        '<div class="site-preloader__logo-wrap">' +
          '<img src="img/favicon.png" alt="" width="52" height="52">' +
        '</div>' +
      '</div>' +
      '<p class="site-preloader__brand">MARU <span>CORP</span></p>' +
      '<p class="site-preloader__tagline">Operación, supervisión y control estratégico</p>' +
      '<div class="site-preloader__progress">' +
        '<div class="site-preloader__progress-track">' +
          '<div class="site-preloader__progress-fill"></div>' +
        '</div>' +
        '<div class="site-preloader__progress-meta">' +
          '<span>Cargando</span>' +
          '<span class="site-preloader__percent">0%</span>' +
        '</div>' +
      '</div>' +
    '</div>';

  function mount() {
    document.body.insertBefore(root, document.body.firstChild);
    run();
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  function run() {
    const fill = root.querySelector('.site-preloader__progress-fill');
    const percentEl = root.querySelector('.site-preloader__percent');
    let progress = 0;
    let loaded = false;
    let hideScheduled = false;

    function setProgress(value) {
      progress = Math.min(100, Math.max(0, value));
      if (fill) fill.style.width = progress + '%';
      if (percentEl) percentEl.textContent = Math.round(progress) + '%';
    }

    function finish() {
      if (hideScheduled) return;
      hideScheduled = true;
      setProgress(100);
      const elapsed = Date.now() - startTime;
      const wait = prefersReduced ? 0 : Math.max(350, MIN_SHOW_MS - elapsed);
      setTimeout(hide, wait);
    }

    function hide() {
      root.classList.add('is-done');
      document.documentElement.classList.remove('preloader-active');
      root.setAttribute('aria-hidden', 'true');
      setTimeout(function () {
        root.remove();
      }, prefersReduced ? 0 : 700);
    }

    if (prefersReduced) {
      setProgress(100);
      if (document.readyState === 'complete') finish();
      else window.addEventListener('load', finish, { once: true });
      return;
    }

    setProgress(8);

    const progressTimer = setInterval(function () {
      if (loaded && progress < 100) {
        setProgress(progress + 12);
        return;
      }
      if (progress < 88) {
        setProgress(progress + Math.random() * 6 + 2);
      }
    }, 120);

    window.addEventListener('load', function () {
      loaded = true;
      clearInterval(progressTimer);
      setProgress(Math.max(progress, 94));
      finish();
    }, { once: true });

    if (document.readyState === 'complete') {
      loaded = true;
      clearInterval(progressTimer);
      finish();
    }

    setTimeout(function () {
      if (!loaded) setProgress(Math.min(progress + 15, 90));
    }, 800);
  }
})();

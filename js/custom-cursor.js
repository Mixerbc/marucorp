(function () {
  'use strict';

  var mq = window.matchMedia('(pointer: fine) and (min-width: 992px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !mq.matches) return;

  var dot = document.createElement('div');
  var ring = document.createElement('div');
  var glow = document.createElement('div');
  dot.className = 'maru-cursor maru-cursor--dot';
  ring.className = 'maru-cursor maru-cursor--ring';
  glow.className = 'maru-cursor maru-cursor--glow';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  glow.setAttribute('aria-hidden', 'true');

  var mx = -100;
  var my = -100;
  var dx = -100;
  var dy = -100;
  var rx = -100;
  var ry = -100;
  var gx = -100;
  var gy = -100;
  var ringRotation = 0;
  var visible = false;

  var INTERACTIVE = 'a, button, .btn, input, textarea, select, label, [role="button"], .nav-link, .service-tile-link';

  function mount() {
    document.body.appendChild(glow);
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.documentElement.classList.add('has-custom-cursor');
    bindEvents();
    tick();
  }

  function bindEvents() {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        document.documentElement.classList.remove('cursor-hidden');
      }
    }, { passive: true });

    document.addEventListener('mousedown', function () {
      document.documentElement.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', function () {
      document.documentElement.classList.remove('cursor-click');
    });

    document.body.addEventListener('mouseover', function (e) {
      var interactive = e.target.closest(INTERACTIVE);
      document.documentElement.classList.toggle('cursor-hover', !!interactive);
    });

    document.addEventListener('mouseleave', function () {
      document.documentElement.classList.add('cursor-hidden');
      visible = false;
    });

    document.addEventListener('mouseenter', function () {
      if (mx >= 0) {
        document.documentElement.classList.remove('cursor-hidden');
        visible = true;
      }
    });

    mq.addEventListener('change', function (e) {
      if (!e.matches) teardown();
    });
  }

  function tick() {
    dx += (mx - dx) * 0.38;
    dy += (my - dy) * 0.38;
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    gx += (mx - gx) * 0.09;
    gy += (my - gy) * 0.09;
    ringRotation += 0.6;

    dot.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) rotate(' + ringRotation + 'deg)';
    glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';

    requestAnimationFrame(tick);
  }

  function teardown() {
    document.documentElement.classList.remove('has-custom-cursor', 'cursor-hover', 'cursor-click', 'cursor-hidden');
    [dot, ring, glow].forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();

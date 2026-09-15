(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  /* Sticky header */
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu */
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('active');
      mobileNav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* Dropdown keyboard (legacy) */
  dropdowns.forEach((dd) => {
    const btn = dd.querySelector('.nav-dropdown-toggle');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      if (window.innerWidth < 1024) {
        e.preventDefault();
        dd.classList.toggle('open');
      }
    });
  });

  /* Scroll reveal */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
    const revealSelectors = '.reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale';
    const reveals = document.querySelectorAll(revealSelectors);
    if (reveals.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach((el) => observer.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('visible'));
    }
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => el.classList.add('visible'));
  }

  /* Testimonials slider */
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.slider-dot');
  if (track && dots.length) {
    let index = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const getPerView = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };
    const update = () => {
      const perView = getPerView();
      const maxIndex = Math.max(0, cards.length - perView);
      if (index > maxIndex) index = maxIndex;
      const cardWidth = cards[0].offsetWidth;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    };
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        index = i;
        update();
      });
    });
    let autoplay = setInterval(() => {
      const perView = getPerView();
      const maxIndex = Math.max(0, cards.length - perView);
      index = index >= maxIndex ? 0 : index + 1;
      update();
    }, 6000);
    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    window.addEventListener('resize', update);
    update();
  }

  /* Accordion (altura dinámica para paneles con mucho contenido) */
  function setAccordionPanel(item, open) {
    const panel = item.querySelector('.accordion-panel');
    const trigger = item.querySelector('.accordion-trigger');
    if (!panel) return;
    if (open) {
      item.classList.add('open');
      const inner = panel.querySelector('.accordion-panel-inner');
      const height = inner ? inner.scrollHeight : panel.scrollHeight;
      panel.style.maxHeight = height + 'px';
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    } else {
      item.classList.remove('open');
      panel.style.maxHeight = '0';
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  }

  document.querySelectorAll('[data-accordion-single]').forEach((group) => {
    const items = group.querySelectorAll('.accordion-item');
    items.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        items.forEach((other) => {
          if (other !== item) setAccordionPanel(other, false);
        });
        setAccordionPanel(item, !wasOpen);
      });
    });
    const initial = group.querySelector('.accordion-item.open');
    if (initial) {
      requestAnimationFrame(() => setAccordionPanel(initial, true));
    }
  });

  document.querySelectorAll('.accordion:not([data-accordion-single])').forEach((group) => {
    group.querySelectorAll('.accordion-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const wasOpen = item.classList.contains('open');
        group.querySelectorAll('.accordion-item').forEach((i) => setAccordionPanel(i, false));
        if (!wasOpen) setAccordionPanel(item, true);
      });
    });
  });

  /* Active nav link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    const linkPath = href.split('#')[0];
    if (linkPath === path || (path === '' && linkPath === 'index.html') || (path === 'contacto.html' && linkPath === 'agendar-diagnostico.html')) {
      link.classList.add('active');
    }
  });

  /* Page jump scroll spy */
  const pageJump = document.querySelector('.page-jump-nav, .service-tabs-inner');
  if (pageJump) {
    const jumpLinks = [...pageJump.querySelectorAll('a[href^="#"]')];
    const sections = jumpLinks
      .map((link) => {
        const id = link.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        return el ? { link, el } : null;
      })
      .filter(Boolean);

    if (sections.length) {
      const setActive = (id) => {
        jumpLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      };

      const onJumpScroll = () => {
        const offset = (header ? header.offsetHeight : 72) + 32;
        let current = sections[0].el.id;
        sections.forEach(({ el }) => {
          if (el.getBoundingClientRect().top <= offset) current = el.id;
        });
        setActive(current);
      };

      window.addEventListener('scroll', onJumpScroll, { passive: true });
      onJumpScroll();

      jumpLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          const id = link.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          if (!target) return;
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - ((header ? header.offsetHeight : 72) + 28);
          window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
          setActive(id);
        });
      });
    }
  }

  /* Tilt suave en packs de páginas pilar */
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const pillarTiltItems = document.querySelectorAll(
    '.page-supervision .pillar-card, .page-prevencion .pillar-card, .page-operacion .pillar-card, ' +
    '.page-supervision .signal-item, .page-prevencion .signal-item, .page-prevencion .risk-item, .page-operacion .signal-item, ' +
    '.page-supervision .pillar-step, .page-prevencion .pillar-step, .page-operacion .pillar-step, ' +
    '.page-diagnostico .benefit-card, .page-diagnostico .diag-check-list li, .page-diagnostico .diag-pill'
  );

  if (!prefersReduced && finePointer && pillarTiltItems.length) {
    pillarTiltItems.forEach((card) => {
      const isSignal = card.classList.contains('signal-item') || card.classList.contains('risk-item') || card.matches('.diag-check-list li');
      const maxY = isSignal ? 5 : 7;
      const maxX = isSignal ? 4 : 5;
      const lift = isSignal ? -3 : -4;
      const scale = isSignal ? 1.005 : 1.01;

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
          `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${lift}px) scale(${scale})`;
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
})();

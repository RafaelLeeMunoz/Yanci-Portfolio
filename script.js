/* ====================================================================
   YANCI TONG · PORTFOLIO — script.js
   Handles: Navbar scroll, mobile menu, scroll reveal, active links,
            smooth scroll, hero entrance, parallax orbs, footer year
   ==================================================================== */

(function () {
  'use strict';

  /* ---- Helpers ---- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


  /* ====================================================================
     1. FOOTER YEAR
  ==================================================================== */
  const yearEl = $('#footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ====================================================================
     2. NAVBAR — scrolled state
  ==================================================================== */
  const navbar = $('#navbar');

  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  /* ====================================================================
     3. MOBILE NAVIGATION TOGGLE
  ==================================================================== */
  const navToggle = $('#navToggle');
  const navLinks  = $('#navLinks');

  if (navToggle && navLinks) {

    function closeMenu() {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close when a nav link is tapped
    $$('.nav-link', navLinks).forEach(link =>
      link.addEventListener('click', closeMenu)
    );

    // Close on outside click
    document.addEventListener('click', e => {
      if (navbar && !navbar.contains(e.target)) closeMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }


  /* ====================================================================
     4. ACTIVE NAV LINK — highlight section in viewport
  ==================================================================== */
  const sections   = $$('section[id]');
  const navAnchors = $$('.nav-link[href^="#"]');

  function setActiveLink() {
    const offset    = (navbar ? navbar.offsetHeight : 80) + 20;
    const scrollMid = window.scrollY + offset;
    let currentId   = '';

    sections.forEach(sec => {
      if (scrollMid >= sec.offsetTop) currentId = sec.id;
    });

    navAnchors.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ====================================================================
     5. SMOOTH SCROLL — offset for fixed nav
  ==================================================================== */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 80;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ====================================================================
     6. HERO ENTRANCE ANIMATIONS
  ==================================================================== */
  requestAnimationFrame(() => {
    const heroText   = $('[data-animate="hero-in"]');
    const heroVisual = $('[data-animate="hero-visual"]');

    if (heroText)   setTimeout(() => heroText.classList.add('is-visible'),   150);
    if (heroVisual) setTimeout(() => heroVisual.classList.add('is-visible'), 350);
  });


  /* ====================================================================
     7. SCROLL REVEAL — Intersection Observer
  ==================================================================== */
  const revealEls = $$(
    '[data-animate]:not([data-animate="hero-in"]):not([data-animate="hero-visual"])'
  );

  if ('IntersectionObserver' in window) {

    // Apply data-delay as CSS custom property for finer staggering control
    revealEls.forEach(el => {
      const delay = el.dataset.delay;
      if (delay) el.style.transitionDelay = `${parseInt(delay, 10) / 1000}s`;
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // trigger once
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));

  } else {
    // Fallback: show all immediately for non-supporting browsers
    revealEls.forEach(el => el.classList.add('is-visible'));
  }


  /* ====================================================================
     8. PARALLAX ORBS — subtle scroll effect on hero orbs
        Skipped when user prefers reduced motion.
  ==================================================================== */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const orbs        = $$('.hero-orb');
    const heroSection = $('#hero');

    if (orbs.length && heroSection) {
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (ticking) return;

        requestAnimationFrame(() => {
          const sy = window.scrollY;
          // Only apply within hero height to stay lightweight
          if (sy < heroSection.offsetHeight * 1.2) {
            orbs.forEach((orb, i) => {
              const speed = 0.08 + i * 0.04;
              orb.style.transform = `translateY(${sy * speed}px)`;
            });
          }
          ticking = false;
        });

        ticking = true;
      }, { passive: true });
    }
  }


  /* ====================================================================
     9. CRAFT IMAGE UPGRADE
        If real <img> elements are present inside .craft-img-wrap,
        hide the placeholder swatch automatically.
  ==================================================================== */
  $$('.craft-img-wrap').forEach(wrap => {
    const img    = wrap.querySelector('img');
    const swatch = wrap.querySelector('.craft-swatch');
    if (img && swatch) swatch.style.display = 'none';
  });


})(); // end IIFE

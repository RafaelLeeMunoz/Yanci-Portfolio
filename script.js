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
     2. NAVBAR: scroll state + scrolled class
  ==================================================================== */
  const navbar = $('#navbar');

  function updateNavbar() {
    if (!navbar) return;
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('is-scrolled', scrolled);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // run once on load


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

    // Close when a link is tapped
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
    const offset = (navbar ? navbar.offsetHeight : 80) + 20;
    const scrollMid = window.scrollY + offset;

    let currentId = '';
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
      const navH   = navbar ? navbar.offsetHeight : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ====================================================================
     6. HERO ENTRANCE ANIMATIONS
  ==================================================================== */
  // Use requestAnimationFrame so layout has settled before animating
  requestAnimationFrame(() => {
    const heroText   = $('[data-animate="hero-in"]');
    const heroVisual = $('[data-animate="hero-visual"]');

    if (heroText) {
      setTimeout(() => heroText.classList.add('is-visible'), 150);
    }
    if (heroVisual) {
      setTimeout(() => heroVisual.classList.add('is-visible'), 350);
    }
  });


  /* ====================================================================
     7. SCROLL REVEAL — Intersection Observer
  ==================================================================== */
  // Exclude hero-specific elements (handled above)
  const revealEls = $$('[data-animate]:not([data-animate="hero-in"]):not([data-animate="hero-visual"])');

  if ('IntersectionObserver' in window) {
    // Apply data-delay as CSS custom property for finer control
    revealEls.forEach(el => {
      const delay = el.dataset.delay;
      if (delay) {
        el.style.transitionDelay = `${parseInt(delay, 10) / 1000}s`;
      }
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));

  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('is-visible'));
  }


  /* ====================================================================
     8. SUBTLE PARALLAX — hero orbs on scroll
     Only runs if user hasn't set prefers-reduced-motion
  ==================================================================== */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const orbs = $$('.hero-orb');
    const heroSection = $('#hero');

    if (orbs.length && heroSection) {
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const sy = window.scrollY;
            // Only apply within the hero section height to keep it lightweight
            if (sy < heroSection.offsetHeight * 1.2) {
              orbs.forEach((orb, i) => {
                const speed = 0.08 + i * 0.04;
                orb.style.transform = `translateY(${sy * speed}px)`;
              });
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }


  /* ====================================================================
     9. CRAFT IMAGE UPGRADE
     If real images are loaded inside .craft-img-wrap,
     hide the placeholder swatch automatically.
  ==================================================================== */
  $$('.craft-img-wrap').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (img) {
      const swatch = wrap.querySelector('.craft-swatch');
      if (swatch) swatch.style.display = 'none';
    }
  });


  /* ====================================================================
     10. NAV LINK KEYBOARD ACCESSIBILITY
     Allow Enter/Space on nav-link buttons (mobile accordion feel)
  ==================================================================== */
  navAnchors.forEach(a => {
    a.setAttribute('tabindex', '0');
  });


})(); // IIFE end

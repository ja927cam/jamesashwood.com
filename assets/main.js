/* jamesashwood.com — theme, mobile nav, header state. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  function setTheme(theme, persist) {
    root.dataset.theme = theme;
    try {
      if (persist) localStorage.setItem('theme', theme);
    } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = theme === 'dark' ? '#101210' : '#fbfaf7';
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      toggle.setAttribute('title', theme === 'dark' ? 'Light theme' : 'Dark theme');
    }
  }

  if (toggle) {
    setTheme(root.dataset.theme || 'light', false);
    toggle.addEventListener('click', function () {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  }

  var menuToggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.dataset.open = 'false';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = nav.dataset.open !== 'true';
      nav.dataset.open = open ? 'true' : 'false';
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('click', function (event) {
      if (nav.dataset.open !== 'true') return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    matchMedia('(min-width: 821px)').addEventListener('change', function (event) {
      if (event.matches) closeMenu();
    });
  }

  var header = document.querySelector('.masthead');
  var ticking = false;

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

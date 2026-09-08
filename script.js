// Gene's Towing — interactions

(function () {
  'use strict';

  // --- Mobile nav toggle ---
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close menu when a link is tapped
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Hero slider (rotating headline + background) ---
  var lines = Array.prototype.slice.call(document.querySelectorAll('.hero__line'));
  var bgs = Array.prototype.slice.call(document.querySelectorAll('.hero__bg'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero__dot'));

  if (lines.length > 1) {
    var current = 0;
    var timer = null;
    var INTERVAL = 5200;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var swapTimer = null;
    var setSlide = function (i) {
      var next = (i + lines.length) % lines.length;
      if (next === current && lines[current].classList.contains('is-active')) { return; }
      current = next;
      // background + dots switch immediately (their crossfade is fine)
      bgs.forEach(function (el, idx) { el.classList.toggle('is-active', idx === current); });
      dots.forEach(function (el, idx) { el.classList.toggle('is-active', idx === current); });
      // headline: fade the current line out first, then fade the next one in —
      // they share a grid cell, so they must never be visible at the same time.
      lines.forEach(function (el) { el.classList.remove('is-active'); });
      if (swapTimer) { clearTimeout(swapTimer); }
      swapTimer = setTimeout(function () { lines[current].classList.add('is-active'); }, 200);
    };

    var start = function () {
      if (reduceMotion) { return; }
      stop();
      timer = setInterval(function () { setSlide(current + 1); }, INTERVAL);
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setSlide(parseInt(dot.getAttribute('data-i'), 10) || 0);
        start();
      });
    });

    start();
  }

  // --- Header shadow on scroll ---
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Scroll reveal ---
  var revealTargets = document.querySelectorAll(
    '.section-head, .service, .stat, .fleet__card, .gallery__item, .area__text, .area__map, .contact__lead, .form'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  // --- Quote form (demo handler) ---
  var form = document.getElementById('quoteForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (note) { note.hidden = false; }
      form.reset();
    });
  }

  // --- Current year ---
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();

/* ON ACADEMY — interactions du site */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  /* --- En-tête collant + ombre --- */
  function onScroll() {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Menu mobile --- */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav-link')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* --- Lien actif selon la section visible --- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* --- Apparition au défilement --- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* --- Compteurs animés --- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('.counter'));
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var cObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-target'); });
  }

  /* --- FAQ (accordéon) --- */
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.acc-trigger'));
  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var panel = item.querySelector('.acc-panel');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.acc-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.acc-panel').style.maxHeight = null;
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* --- Formulaire de contact --- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      ['name', 'phone', 'message'].forEach(function (id) {
        var f = document.getElementById(id);
        var empty = !f.value.trim();
        f.classList.toggle('invalid', empty);
        if (empty) valid = false;
      });

      if (!valid) {
        note.textContent = 'Merci de remplir tous les champs obligatoires.';
        note.className = 'form-note err';
        return;
      }

      note.textContent = 'Merci ! Votre demande a bien été enregistrée — nous vous recontactons sous 24 h.';
      note.className = 'form-note ok';
      form.reset();
    });

    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('invalid') && e.target.value.trim()) {
        e.target.classList.remove('invalid');
      }
    });
  }

  /* --- Année courante --- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

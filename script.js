/* ==========================================================================
   RICK SANCHEZ — site behaviour
   Vanilla JS. No frameworks, no build step.

   SCOPE (deliberately narrow):
   This file handles the full-screen menu overlay ONLY — open/close,
   aria-expanded, Escape, click-outside, focus handling.

   It contains NO scroll listeners, NO requestAnimationFrame loops and NO
   animation code of any kind. All page animation is owned by Motion.page
   (GSAP / ScrollTrigger), which animates CSS properties on the documented
   target ids/classes. Do not add scroll-driven visuals here.
   ========================================================================== */

(function () {
  'use strict';

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function init() {
    var toggle = document.getElementById('menuToggle');
    var overlay = document.getElementById('menuOverlay');
    var closeBtn = document.getElementById('menuClose');

    if (!toggle || !overlay) { return; }

    var isOpen = false;
    var lastFocused = null;

    function focusableItems() {
      return Array.prototype.filter.call(
        overlay.querySelectorAll(FOCUSABLE),
        function (el) {
          return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
        }
      );
    }

    function openMenu() {
      if (isOpen) { return; }
      isOpen = true;
      lastFocused = document.activeElement;

      overlay.hidden = false;
      // Force a style flush so the transition runs from the closed state.
      void overlay.offsetWidth;
      overlay.classList.add('is-open');

      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');

      var items = focusableItems();
      if (items.length) { items[0].focus(); }
    }

    function closeMenu(returnFocus) {
      if (!isOpen) { return; }
      isOpen = false;

      overlay.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');

      // Hide from the a11y tree and tab order once the transition finishes.
      window.setTimeout(function () {
        if (!isOpen) { overlay.hidden = true; }
      }, 340);

      if (returnFocus !== false) {
        var usable = lastFocused &&
                     lastFocused !== document.body &&
                     typeof lastFocused.focus === 'function' &&
                     document.contains(lastFocused);
        (usable ? lastFocused : toggle).focus();
      }
    }

    function trapFocus(event) {
      var items = focusableItems();
      if (!items.length) { return; }

      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () { closeMenu(); });
    }

    // Click outside the menu panel closes it.
    overlay.addEventListener('mousedown', function (event) {
      if (event.target === overlay) { closeMenu(); }
    });

    // Following a nav link closes the overlay (links are in-page anchors).
    overlay.addEventListener('click', function (event) {
      var link = event.target.closest ? event.target.closest('a[href]') : null;
      if (link && overlay.contains(link)) { closeMenu(false); }
    });

    document.addEventListener('keydown', function (event) {
      if (!isOpen) { return; }

      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === 'Tab') { trapFocus(event); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ==========================================================================
   Theme music: play once on load. Browsers block autoplay with sound until
   the visitor interacts, so if play() is rejected we retry on the first
   click, key press, wheel or touch. The header button mutes / unmutes.
   ========================================================================== */
(function () {
  var audio = document.getElementById('theme');
  var btn = document.getElementById('soundToggle');
  if (!audio) { return; }
  var started = false;
  var armEvents = ['pointerdown', 'keydown', 'touchend', 'click'];

  function disarm() { armEvents.forEach(function (e) { window.removeEventListener(e, start); }); }
  function arm() { armEvents.forEach(function (e) { window.addEventListener(e, start, { passive: true }); }); }
  function start(ev) {
    // the header button has its own handler; ignore the global unlock for it
    if (ev && btn && ev.target && btn.contains(ev.target)) { return; }
    if (started) { return; }
    var p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(function () { started = true; disarm(); if (btn) { btn.setAttribute('aria-pressed', 'true'); btn.setAttribute('aria-label', 'Mute music'); } })
       .catch(function () { arm(); });
    } else { started = true; disarm(); }
  }

  audio.volume = 0.6;
  start();

  if (btn) {
    btn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (audio.paused) {
        started = false; start();
      } else {
        audio.pause();
        btn.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', 'Play music');
      }
    });
    audio.addEventListener('ended', function () { btn.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', 'Play music'); });
  }
})();

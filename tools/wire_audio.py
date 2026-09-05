import re
h=open('index.html',encoding='utf8').read()
if 'id="theme"' not in h:
    h=h.replace('<script src="script.js" defer></script>', '<audio id="theme" src="assets/theme.m4a" preload="auto"></audio>\n<script src="script.js" defer></script>')
    h=h.replace('    <button id="menuToggle" class="burger"', '    <button id="soundToggle" class="sound" type="button" aria-pressed="true" aria-label="Mute music"><span class="sound-bar"></span><span class="sound-bar"></span><span class="sound-bar"></span></button>\n    <button id="menuToggle" class="burger"')
    open('index.html','w',encoding='utf8').write(h)
c=open('styles.css',encoding='utf8').read()
if '.sound {' not in c:
    c=c.replace(".burger {", """/* music toggle */
.sound { width: 46px; height: 46px; border-radius: 50%; background: var(--light); display: flex; align-items: flex-end; justify-content: center; gap: 3px; padding-bottom: 15px; }
.sound-bar { width: 3px; height: 14px; background: var(--navy); border-radius: 2px; transform-origin: bottom; animation: eq .9s ease-in-out infinite alternate; }
.sound-bar:nth-child(2) { animation-delay: .25s; } .sound-bar:nth-child(3) { animation-delay: .5s; }
.sound[aria-pressed="false"] .sound-bar { animation: none; transform: scaleY(.3); opacity: .5; }
@keyframes eq { from { transform: scaleY(.3); } to { transform: scaleY(1); } }

.burger {""")
    open('styles.css','w',encoding='utf8').write(c)
s=open('script.js',encoding='utf8').read()
if "getElementById('theme')" not in s:
    s += """

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
  var armEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

  function disarm() { armEvents.forEach(function (e) { window.removeEventListener(e, start); }); }
  function arm() { armEvents.forEach(function (e) { window.addEventListener(e, start, { passive: true }); }); }
  function start() {
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
"""
    open('script.js','w',encoding='utf8').write(s)
print('audio wired')

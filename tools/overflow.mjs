import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await m.waitForTimeout(3000);
const r = await m.evaluate(() => {
  const out = [];
  document.querySelectorAll('body *').forEach(e => {
    const b = e.getBoundingClientRect();
    if (b.right > 392 || b.left < -2) out.push({ t: e.tagName + (e.id ? '#' + e.id : '') + '.' + (e.className && e.className.baseVal === undefined ? String(e.className).split(' ')[0] : ''), l: Math.round(b.left), r: Math.round(b.right), w: Math.round(b.width) });
  });
  return { sw: document.documentElement.scrollWidth, iw: window.innerWidth, out: out.slice(0, 40) };
});
console.log(JSON.stringify(r, null, 0));
await browser.close();

import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
const r = await page.evaluate(() => {
  const q = s => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { s, x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), tf: cs.transform, left: cs.left, top: cs.top, width: cs.width }; };
  return [q('#headScene'), q('#portalGlow'), q('#headFace'), q('#footerHead'), q('.footer-face'), q('.menu-head'), q('.menu-face')];
});
console.log(JSON.stringify(r, null, 1));
await browser.close();

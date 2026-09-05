import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(80); }
await page.waitForTimeout(1200);
const r = await page.evaluate(() => {
  const g = s => { const e = document.querySelector(s); const st = getComputedStyle(e); return { op: st.opacity, tf: st.transform.slice(0, 60) }; };
  return { scrollY: window.scrollY, name: g('#heroName'), ship: g('#propShip'), face: g('#headFace'), wordmark: g('#wordmark'), cap: g('#headCap') };
});
console.log(JSON.stringify(r, null, 1));
await page.screenshot({ path: 'assets/raw/_v12_hero_scrolled.png' });
// mobile
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await m.waitForTimeout(3500);
await m.screenshot({ path: 'assets/raw/_m0.png' });
await m.screenshot({ path: 'assets/raw/_m_full.png', fullPage: true });
await browser.close();

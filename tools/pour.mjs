// Scroll through the Watch section and capture the flask pour at several scroll offsets.
import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
const top = await page.evaluate(() => document.querySelector('#screenWrap').getBoundingClientRect().top + window.scrollY);
let cur = 0;
async function to(y) {
  while (Math.abs(cur - y) > 100) { await page.mouse.wheel(0, y > cur ? 100 : -100); await page.waitForTimeout(12); cur = await page.evaluate(() => window.scrollY); }
  await page.waitForTimeout(1400);
}
const offs = [-300, 0, 150, 300, 450];
let i = 0;
for (const o of offs) {
  await to(top + o);
  const box = await page.evaluate(() => { const b = document.querySelector('#screenWrap').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
  const clip = { x: Math.max(0, box.x + box.w * 0.55), y: Math.max(0, box.y + box.h * 0.35), width: box.w * 0.6, height: Math.min(900 - Math.max(0, box.y + box.h * 0.35), box.h * 0.9) };
  await page.screenshot({ path: `assets/raw/_pour_${i++}.png`, clip });
}
await browser.close();

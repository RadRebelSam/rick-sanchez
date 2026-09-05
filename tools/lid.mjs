import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
const t0 = Date.now();
const times = [1400, 1900, 2400, 3400, 4500];
for (const t of times) {
  const wait = t - (Date.now() - t0); if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `assets/raw/_lid_${t}.png`, clip: { x: 300, y: 0, width: 840, height: 620 } });
}
await page.mouse.wheel(0, 350); await page.waitForTimeout(1200);
await page.screenshot({ path: 'assets/raw/_lid_scroll.png', clip: { x: 300, y: 0, width: 840, height: 620 } });
await browser.close();

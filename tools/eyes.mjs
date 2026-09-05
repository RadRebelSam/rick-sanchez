// Eye-tracking check: move the mouse to three positions and crop the face.
import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3800);
const box = await (await page.$('#headFace')).boundingBox();
const clip = { x: box.x - 40, y: box.y - 40, width: box.width + 80, height: box.height * 0.6 };
const spots = [['left', 60, 450], ['right', 1380, 450], ['up', 720, 40], ['down', 720, 880]];
for (const [name, x, y] of spots) {
  await page.mouse.move(x, y, { steps: 12 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `assets/raw/_eye_${name}.png`, clip });
}
const p = await page.evaluate(() => [...document.querySelectorAll('.pupil')].map(e => getComputedStyle(e).transform));
console.log('pupil transforms', p, 'errors', errors);
await browser.close();

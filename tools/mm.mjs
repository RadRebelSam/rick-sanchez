import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3800);
const read = () => page.evaluate(() => ({ pupil: getComputedStyle(document.querySelector('.pupil')).transform, ship: getComputedStyle(document.querySelector('#propShip')).transform, face: getComputedStyle(document.querySelector('#headFace')).transform }));
console.log('center', await read());
await page.mouse.move(100, 450, { steps: 20 }); await page.waitForTimeout(800); console.log('left ', await read());
await page.mouse.move(1340, 450, { steps: 20 }); await page.waitForTimeout(800); console.log('right', await read());
// synthetic events from inside the page
await page.evaluate(() => { for (let i = 0; i < 10; i++) { document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 850, bubbles: true })); window.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 850, bubbles: true })); } });
await page.waitForTimeout(800); console.log('synthetic bottom-left', await read());
const info = await page.evaluate(() => ({ hasMotion: typeof Motion, tm: !!(window.Motion && Motion.triggerManager), keys: Object.keys(window).filter(k => /motion/i.test(k)) }));
console.log(info);
await browser.close();

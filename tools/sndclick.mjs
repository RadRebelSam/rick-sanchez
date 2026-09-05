import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });   // default autoplay policy = blocked, like real Chrome
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const s0 = await page.evaluate(() => document.getElementById('theme').paused);
await page.click('#soundToggle'); await page.waitForTimeout(1500);
const s1 = await page.evaluate(() => ({ paused: document.getElementById('theme').paused, t: document.getElementById('theme').currentTime, pressed: document.getElementById('soundToggle').getAttribute('aria-pressed') }));
await page.waitForTimeout(1500);
const s2 = await page.evaluate(() => ({ paused: document.getElementById('theme').paused, t: document.getElementById('theme').currentTime }));
console.log('before click paused', s0, '| after click', JSON.stringify(s1), '| 1.5s later', JSON.stringify(s2));
await browser.close();

import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
const y = await page.evaluate(() => document.querySelector('#about').getBoundingClientRect().top + window.scrollY);
let cur = 0;
while (Math.abs(cur - y) > 120) { await page.mouse.wheel(0, 120); await page.waitForTimeout(12); cur = await page.evaluate(() => window.scrollY); }
await page.waitForTimeout(1800);
await page.screenshot({ path: 'assets/raw/_about.png' });
await browser.close();

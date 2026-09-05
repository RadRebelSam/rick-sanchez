// Full-page screenshot helper: node tools/shot.mjs [url] [out] [width] [height]
import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:5177/';
const out = process.argv[3] || 'assets/raw/_page.png';
const width = Number(process.argv[4] || 1440);
const height = Number(process.argv[5] || 900);
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: true });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
console.log('saved', out, 'page height', h);
await browser.close();

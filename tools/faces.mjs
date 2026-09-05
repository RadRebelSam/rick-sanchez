import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
await page.click('#menuToggle'); await page.waitForTimeout(1400);
await page.screenshot({ path: 'assets/raw/_f_menu.png' });
await page.keyboard.press('Escape'); await page.waitForTimeout(500);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1600));
let cur = await page.evaluate(() => window.scrollY);
for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(30); }
await page.waitForTimeout(1600);
await page.screenshot({ path: 'assets/raw/_f_footer.png' });
await browser.close();

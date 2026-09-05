// Animation verification: node tools/verify.mjs
// Loads the site, captures the intro, then scrolls section by section with real wheel
// events so ScrollTrigger runs, screenshotting each stop. Logs console errors.
import { chromium } from 'playwright';
const exe = 'C:/Users/Dexin/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1600);
await page.screenshot({ path: 'assets/raw/_v0_intro_1.6s.png' });
await page.waitForTimeout(600);
await page.screenshot({ path: 'assets/raw/_v1_intro_2.2s.png' });
await page.waitForTimeout(1600);
await page.mouse.move(1200, 200);
await page.waitForTimeout(600);
await page.screenshot({ path: 'assets/raw/_v2_intro_done_mouse.png' });

async function wheelTo(sel, offsetFrac = 0.35) {
  const y = await page.evaluate(({ s, f }) => {
    const el = document.querySelector(s);
    return el.getBoundingClientRect().top + window.scrollY - window.innerHeight * f;
  }, { s: sel, f: offsetFrac });
  let cur = await page.evaluate(() => window.scrollY);
  const step = 120;
  while (Math.abs(cur - y) > step) {
    await page.mouse.wheel(0, y > cur ? step : -step);
    await page.waitForTimeout(16);
    cur = await page.evaluate(() => window.scrollY);
  }
  await page.waitForTimeout(1600);
}

const stops = [
  ['#statement', 0.15, '_v3_statement'],
  ['#media', 0.05, '_v4_media'],
  ['#about', 0.05, '_v5_about'],
  ['#news', 0.05, '_v6_news'],
  ['#quote', 0.05, '_v7_quote'],
  ['#books', 0.05, '_v8_books'],
  ['#siteFooter', 0.1, '_v9_footer'],
  ['#wubba', 0.3, '_v13_wubba'],
  ['#play', 0.05, '_v14_play'],
];
for (const [sel, f, name] of stops) {
  await wheelTo(sel, f);
  await page.screenshot({ path: `assets/raw/${name}.png` });
}
// hover a media card
await wheelTo('#media', 0.05);
const card = await page.$('#mediaCard2');
const b = await card.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
await page.waitForTimeout(700);
await page.screenshot({ path: 'assets/raw/_v10_card_hover.png' });
// menu
await page.click('#menuToggle');
await page.waitForTimeout(1400);
await page.screenshot({ path: 'assets/raw/_v11_menu.png' });
// widget hover
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
const tag = await page.$('#latestCard .widget-tag');
const tb = await tag.boundingBox();
await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2);
await page.waitForTimeout(900);
await page.screenshot({ path: 'assets/raw/_v15_widget_hover.png' });
await page.mouse.move(700, 100);
// mid-hero scroll parallax
await page.keyboard.press('Escape');
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.mouse.wheel(0, 400);
await page.waitForTimeout(1200);
await page.screenshot({ path: 'assets/raw/_v12_hero_scrolled.png' });

console.log('errors:', errors.length ? errors.join('\n') : 'none');
await browser.close();

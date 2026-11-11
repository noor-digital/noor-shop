import { chromium } from 'playwright';
import path from 'node:path';

const BASE = 'http://127.0.0.1:5173';
const OUT = path.resolve('docs/visual-review/final');

const browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--no-sandbox'] });

async function shoot(name, viewport, url) {
  const ctx = await browser.newContext({ viewport, locale: 'fr-FR' });
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  // Scroll halfway down to prove sidebar stays fixed
  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
  await page.waitForTimeout(300);
  // Capture only the viewport (not fullPage) so we can see the sidebar pinned at the top
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  // Also detect sticky behavior
  const stickyWorks = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return 'no-aside';
    const r = aside.getBoundingClientRect();
    return { top: Math.round(r.top), height: Math.round(r.height), position: getComputedStyle(aside).position };
  });
  console.log(`${name.padEnd(42)} → aside`, stickyWorks);
  await ctx.close();
}

const DESKTOP = { width: 1440, height: 900 };
const MOBILE  = { width: 390,  height: 844 };

await shoot('fix-sticky-merchant-desktop.png',  DESKTOP, '/merchant');
await shoot('fix-sticky-merchant-mobile.png',   MOBILE,  '/merchant');
await shoot('fix-sticky-platform-desktop.png',  DESKTOP, '/platform');
await shoot('fix-sticky-platform-mobile.png',   MOBILE,  '/platform');

await browser.close();
console.log('done');
process.exit(0);

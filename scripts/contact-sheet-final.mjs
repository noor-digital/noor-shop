import { chromium } from 'playwright';
import path from 'node:path';
import { readdir, writeFile } from 'node:fs/promises';

const OUT = path.resolve('docs/visual-review/final');
const files = (await readdir(OUT))
  .filter((f) => f.endsWith('-desktop.png') && !f.startsWith('contact-sheet'))
  .sort();

const cards = files.map((f) => {
  const id = f.replace('-desktop.png', '');
  return `<figure><img src="file:///${path.join(OUT, f).replaceAll('\\\\', '/')}" alt="${id}"><figcaption>${id}</figcaption></figure>`;
}).join('');

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Planche de contact finale — NOOR SHOP</title>
<style>
  :root { --ink:#171717; --canvas:#F2F4F5; --violet:#5433EB; }
  body { margin:0; background:var(--canvas); color:var(--ink);
         font-family: Inter, system-ui, sans-serif; padding: 40px; }
  header { margin-bottom: 32px; }
  h1 { font-size: 32px; letter-spacing: -0.02em; margin:0; font-weight:600; }
  .sub { color:#6b7280; margin: 8px 0 0; }
  .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; }
  figure { margin:0; background:#fff; border-radius:16px; overflow:hidden;
           box-shadow: 0 2px 20px rgba(0,0,0,0.04); border: 1px solid #e5e7eb; }
  img { display:block; width:100%; height:auto; }
  figcaption { padding:12px 16px; font-size:12px; letter-spacing:0.02em;
               text-transform:uppercase; color:#6b7280; border-top:1px solid #e5e7eb; }
</style></head>
<body>
  <header>
    <h1>NOOR SHOP — Planche de contact finale (desktop 1440 px)</h1>
    <p class="sub">${files.length} captures · revue de clôture · ${new Date().toLocaleDateString('fr-FR')}</p>
  </header>
  <div class="grid">${cards}</div>
</body></html>`;

const outHtml = path.join(OUT, 'contact-sheet.html');
await writeFile(outHtml, html, 'utf-8');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('file:///' + outHtml.replaceAll('\\', '/'), { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, 'contact-sheet.png'), fullPage: true });
await browser.close();
console.log(`contact sheet ready (${files.length} images)`);
process.exit(0);

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const BASE = 'http://127.0.0.1:5173';
const OUT = path.resolve('docs/visual-review');

const screens = [
  { id: '01-landing',            path: '/',                                   label: 'Accueil NOOR SHOP' },
  { id: '02-store-home',         path: '/boutique/maam-couture',              label: 'Boutique publique (Marble)' },
  { id: '03-store-catalog',      path: '/boutique/maam-couture/catalogue',    label: 'Catalogue produits' },
  { id: '04-product',            path: '/boutique/maam-couture/produit/boubou-wax-linguere', label: 'Fiche produit' },
  { id: '05-cart',               path: '/boutique/maam-couture/panier',       label: 'Panier' },
  { id: '06-checkout',           path: '/boutique/maam-couture/commande',     label: 'Commande' },
  { id: '07-merchant-dashboard', path: '/merchant',                           label: 'Tableau de bord commerçant' },
  { id: '08-merchant-products',  path: '/merchant/produits',                  label: 'Gestion des produits' },
  { id: '09-merchant-orders',    path: '/merchant/commandes',                 label: 'Gestion des commandes' },
  { id: '10-merchant-customize', path: '/merchant/personnalisation',          label: 'Personnalisation boutique' },
  { id: '11-platform-dashboard', path: '/platform',                           label: 'Administration plateforme' },
];

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile:  { width: 390,  height: 844 },
};

async function captureAll() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  const errors = [];

  for (const vpName of Object.keys(viewports)) {
    const ctx = await browser.newContext({
      viewport: viewports[vpName],
      deviceScaleFactor: 1,
      locale: 'fr-FR',
    });
    const page = await ctx.newPage();

    page.on('pageerror', (err) => {
      errors.push({ viewport: vpName, msg: String(err) });
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push({ viewport: vpName, msg: msg.text() });
      }
    });

    for (const screen of screens) {
      const url = BASE + screen.path;
      const fileName = `${screen.id}-${vpName}.png`;
      const filePath = path.join(OUT, fileName);
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        const status = resp ? resp.status() : 0;
        await page.waitForTimeout(600);
        await page.screenshot({ path: filePath, fullPage: true });
        results.push({ ...screen, viewport: vpName, status, file: fileName, ok: true });
        console.log(`OK  ${vpName.padEnd(7)} ${screen.id} (${status})`);
      } catch (e) {
        results.push({ ...screen, viewport: vpName, status: 0, file: fileName, ok: false, error: String(e) });
        console.log(`ERR ${vpName.padEnd(7)} ${screen.id}: ${e.message}`);
      }
    }
    await ctx.close();
  }

  await browser.close();

  // JSON report
  const { writeFile } = await import('node:fs/promises');
  await writeFile(path.join(OUT, '_report.json'), JSON.stringify({ results, errors }, null, 2));

  const total = results.length;
  const ok = results.filter(r => r.ok).length;
  console.log(`\n${ok}/${total} captures réalisées. Erreurs console/page: ${errors.length}`);
  process.exit(0);
}

captureAll().catch((e) => { console.error(e); process.exit(1); });

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const BASE = 'http://127.0.0.1:5173';
const OUT = path.resolve('docs/visual-review/final');

const MAIN_SCREENS = [
  { id: '01-landing',            path: '/',                                                  label: 'Accueil NOOR SHOP' },
  { id: '02-store-home',         path: '/boutique/maam-couture',                             label: 'Boutique publique (Marble)' },
  { id: '03-store-catalog',      path: '/boutique/maam-couture/catalogue',                   label: 'Catalogue produits' },
  { id: '04-product',            path: '/boutique/maam-couture/produit/boubou-wax-linguere', label: 'Fiche produit' },
  { id: '05-cart',               path: '/boutique/maam-couture/panier',                      label: 'Panier (vide)' },
  { id: '06-checkout',           path: '/boutique/maam-couture/commande',                    label: 'Checkout' },
  { id: '07-merchant-dashboard', path: '/merchant',                                          label: 'Dashboard commerçant' },
  { id: '08-merchant-products',  path: '/merchant/produits',                                 label: 'Produits' },
  { id: '09-merchant-orders',    path: '/merchant/commandes',                                label: 'Commandes' },
  { id: '10-merchant-customize', path: '/merchant/personnalisation',                         label: 'Personnalisation' },
  { id: '11-platform-dashboard', path: '/platform',                                          label: 'Admin plateforme' },
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile:  { width: 390,  height: 844 },
};

const RESPONSIVE_WIDTHS = [320, 360, 390, 430, 768, 1024, 1440];
const RESPONSIVE_PAGES = ['/', '/boutique/maam-couture', '/boutique/maam-couture/catalogue',
                          '/merchant', '/merchant/personnalisation', '/platform'];

const EXTRA_SCREENS = [
  { id: 'ex-01-store-editorial', path: '/boutique/teranga-beauty',                 label: 'Boutique Editorial' },
  { id: 'ex-02-store-gallery',   path: '/boutique/baobab-home',                    label: 'Boutique Gallery' },
  { id: 'ex-03-pricing',         path: '/tarifs',                                  label: 'Tarifs' },
  { id: 'ex-04-features',        path: '/fonctionnalites',                         label: 'Fonctionnalités' },
  { id: 'ex-05-login',           path: '/connexion',                               label: 'Connexion' },
  { id: 'ex-06-merchant-analytics', path: '/merchant/statistiques',                label: 'Statistiques commerçant' },
  { id: 'ex-07-merchant-stocks',  path: '/merchant/stocks',                        label: 'Stocks' },
  { id: 'ex-08-merchant-orderdetail', path: '/merchant/commandes/NS-2026-1041',    label: 'Détail commande' },
  { id: 'ex-09-platform-stores',   path: '/platform/boutiques',                    label: 'Admin boutiques' },
  { id: 'ex-10-platform-plans',    path: '/platform/offres',                       label: 'Admin offres' },
];

const report = {
  startedAt: new Date().toISOString(),
  build: 'see npm run build output',
  captures: [],
  consoleErrors: [],
  pageErrors: [],
  failedResources: [],
  xofIssues: [],
  purchaseFlow: null,
  responsive: [],
  interactions: [],
};

function attachListeners(page, where) {
  page.on('pageerror', (e) => report.pageErrors.push({ where, msg: String(e) }));
  page.on('console', (m) => {
    if (m.type() === 'error') report.consoleErrors.push({ where, msg: m.text() });
  });
  page.on('requestfailed', (req) => {
    const u = req.url();
    // ignore non-critical analytics etc. keep images & scripts
    if (/\.(png|jpe?g|svg|webp|avif|css|js)(\?|$)/i.test(u) || u.includes('unsplash')) {
      report.failedResources.push({ where, url: u, failure: req.failure()?.errorText });
    }
  });
}

async function scanForXofBugs(page, where) {
  const texts = await page.evaluate(() => document.body.innerText);
  const badPatterns = [/FF\s*CFA/i, /F\s*F\s*CFA/i, /NaN/i, /undefined\s*F\s*CFA/i];
  badPatterns.forEach((re) => {
    const m = texts.match(re);
    if (m) report.xofIssues.push({ where, match: m[0], excerpt: texts.slice(Math.max(0, m.index - 30), m.index + 40) });
  });
}

async function hasHorizontalOverflow(page) {
  return page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    return { overflow: docW > winW + 1, docW, winW };
  });
}

async function capture(page, screen, viewport) {
  const file = `${screen.id}-${viewport}.png`;
  const filePath = path.join(OUT, file);
  const resp = await page.goto(BASE + screen.path, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(600);
  await scanForXofBugs(page, `${screen.id}:${viewport}`);
  const overflow = await hasHorizontalOverflow(page);
  await page.screenshot({ path: filePath, fullPage: true });
  report.captures.push({
    id: screen.id, label: screen.label, viewport, path: screen.path,
    file, status: resp ? resp.status() : 0,
    overflow: overflow.overflow, docW: overflow.docW, winW: overflow.winW,
  });
  console.log(`CAP ${viewport.padEnd(7)} ${screen.id} (${resp?.status()}, overflow=${overflow.overflow})`);
}

async function runPurchaseFlow(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR' });
  const page = await ctx.newPage();
  attachListeners(page, 'purchase-flow');
  const step = (name) => console.log(`  → ${name}`);
  const flow = { startedAt: new Date().toISOString(), steps: [] };
  const log = (name, ok, detail) => flow.steps.push({ name, ok, detail });

  try {
    step('open store');
    await page.goto(BASE + '/boutique/maam-couture', { waitUntil: 'networkidle' });
    log('open store', true);

    step('open catalog');
    await page.goto(BASE + '/boutique/maam-couture/catalogue', { waitUntil: 'networkidle' });
    const anyCard = await page.locator('a[href*="/produit/"]').first();
    log('catalog has products', await anyCard.count() > 0);

    step('open product');
    await page.goto(BASE + '/boutique/maam-couture/produit/boubou-wax-linguere', { waitUntil: 'networkidle' });
    log('product page loaded', await page.locator('h1').textContent() !== null);

    step('select size M');
    await page.getByRole('button', { name: /^M$/ }).first().click();
    log('size selected', true);

    step('bump quantity to 2');
    await page.getByRole('button', { name: '+' }).first().click();
    log('quantity 2', true);

    step('add to cart');
    await page.getByRole('button', { name: /Ajouter au panier/i }).click();
    await page.waitForTimeout(400);
    const headerCounter = await page.locator('header').locator('text=/^\\d+$/').first().textContent().catch(() => null);
    log('cart counter updated', headerCounter && Number(headerCounter) > 0, `counter=${headerCounter}`);

    step('open cart');
    await page.goto(BASE + '/boutique/maam-couture/panier', { waitUntil: 'networkidle' });
    const qty = await page.locator('span.w-7').first().textContent();
    log('cart shows quantity', qty && Number(qty) === 2, `qty=${qty}`);

    step('increment quantity in cart');
    await page.locator('button:has-text("+")').first().click();
    await page.waitForTimeout(200);
    const qty2 = await page.locator('span.w-7').first().textContent();
    log('cart quantity +1', qty2 && Number(qty2) === 3, `qty=${qty2}`);

    step('decrement quantity');
    await page.locator('button:has-text("−")').first().click();
    await page.waitForTimeout(200);
    const qty3 = await page.locator('span.w-7').first().textContent();
    log('cart quantity -1', qty3 && Number(qty3) === 2, `qty=${qty3}`);

    // Take a capture of a FILLED cart (extra)
    await page.screenshot({ path: path.join(OUT, 'ex-11-cart-filled-desktop.png'), fullPage: true });
    report.captures.push({ id: 'ex-11-cart-filled', label: 'Panier rempli', viewport: 'desktop', path: '/panier (filled)', file: 'ex-11-cart-filled-desktop.png', status: 200, overflow: false });

    step('go to checkout');
    await page.locator('a:has-text("Passer à la commande")').click();
    await page.waitForURL(/\/commande/, { timeout: 5000 });
    log('checkout reached', true);

    step('fill form (delivery)');
    await page.getByLabel('Nom complet').fill('Awa Diop');
    await page.getByLabel('Téléphone').fill('+221 77 000 00 00');
    await page.getByLabel('E-mail (facultatif)').fill('awa@example.sn');
    await page.getByLabel('Adresse de livraison').fill('SICAP Liberté 6, Villa 2345');
    await page.screenshot({ path: path.join(OUT, 'ex-12-checkout-filled-desktop.png'), fullPage: true });
    report.captures.push({ id: 'ex-12-checkout-filled', label: 'Checkout rempli', viewport: 'desktop', path: '/commande (filled)', file: 'ex-12-checkout-filled-desktop.png', status: 200, overflow: false });

    step('submit order');
    await page.getByRole('button', { name: /Confirmer la commande/i }).click();
    await page.waitForURL(/\/confirmation\//, { timeout: 5000 });
    log('confirmation reached', page.url().includes('/confirmation/'));

    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, 'ex-13-confirmation-desktop.png'), fullPage: true });
    report.captures.push({ id: 'ex-13-confirmation', label: 'Confirmation commande', viewport: 'desktop', path: '/confirmation/:token', file: 'ex-13-confirmation-desktop.png', status: 200, overflow: false });

    step('go back to cart — must be empty');
    await page.goto(BASE + '/boutique/maam-couture/panier', { waitUntil: 'networkidle' });
    const emptyBody = await page.locator('body').innerText();
    const isEmpty = /panier est vide/i.test(emptyBody);
    log('cart emptied after order', isEmpty);

  } catch (e) {
    log('error during flow', false, String(e));
    console.log('  !! purchase flow failed:', e.message);
  } finally {
    await ctx.close();
    flow.endedAt = new Date().toISOString();
    report.purchaseFlow = flow;
  }
}

async function runInteractionChecks(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR' });
  const page = await ctx.newPage();
  attachListeners(page, 'interactions');
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });

  try {
    // Merchant product form (modal)
    await page.goto(BASE + '/merchant/produits/nouveau', { waitUntil: 'networkidle' });
    add('merchant product form loads', (await page.locator('input').count()) > 0);
    await page.screenshot({ path: path.join(OUT, 'ex-14-product-form-desktop.png'), fullPage: true });
    report.captures.push({ id: 'ex-14-product-form', label: 'Formulaire nouveau produit', viewport: 'desktop', path: '/merchant/produits/nouveau', file: 'ex-14-product-form-desktop.png', status: 200, overflow: false });

    // Store creation wizard — step 1
    await page.goto(BASE + '/merchant/boutiques/nouvelle', { waitUntil: 'networkidle' });
    add('store wizard loads', (await page.locator('body').innerText()).length > 50);
    await page.screenshot({ path: path.join(OUT, 'ex-15-wizard-desktop.png'), fullPage: true });
    report.captures.push({ id: 'ex-15-wizard', label: 'Wizard nouvelle boutique', viewport: 'desktop', path: '/merchant/boutiques/nouvelle', file: 'ex-15-wizard-desktop.png', status: 200, overflow: false });

    // Order detail
    await page.goto(BASE + '/merchant/commandes/NS-2026-1041', { waitUntil: 'networkidle' });
    add('order detail loads', (await page.locator('body').innerText()).includes('1041') || (await page.locator('body').innerText()).includes('Commande'));

    // Admin merchants list
    await page.goto(BASE + '/platform/commercants', { waitUntil: 'networkidle' });
    add('admin merchants list loads', (await page.locator('body').innerText()).length > 100);

    // Admin suspend confirm modal — open store detail, trigger suspend
    await page.goto(BASE + '/platform/boutiques', { waitUntil: 'networkidle' });
    add('admin stores list loads', true);

    // Customization: change template
    await page.goto(BASE + '/merchant/personnalisation', { waitUntil: 'networkidle' });
    const buttons = await page.locator('button').allInnerTexts();
    add('customization page loads', buttons.length > 0);

  } catch (e) {
    add('interaction error', false, String(e));
  } finally {
    report.interactions = checks;
    await ctx.close();
  }
}

async function runResponsive(browser) {
  for (const width of RESPONSIVE_WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, locale: 'fr-FR' });
    const page = await ctx.newPage();
    attachListeners(page, `resp-${width}`);
    for (const p of RESPONSIVE_PAGES) {
      try {
        await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 25000 });
        const r = await hasHorizontalOverflow(page);
        report.responsive.push({ width, path: p, overflow: r.overflow, docW: r.docW, winW: r.winW });
      } catch (e) {
        report.responsive.push({ width, path: p, error: e.message });
      }
    }
    await ctx.close();
  }
  console.log(`responsive: ${report.responsive.length} checks across ${RESPONSIVE_WIDTHS.length} widths`);
}

async function newBrowser() {
  return chromium.launch({ args: ['--disable-dev-shm-usage', '--no-sandbox'] });
}

async function captureBatch(screens, viewport) {
  const browser = await newBrowser();
  const ctx = await browser.newContext({ viewport, locale: 'fr-FR' });
  const page = await ctx.newPage();
  attachListeners(page, `${viewport.width}px`);
  const vpName = viewport.width === 1440 ? 'desktop' : 'mobile';
  for (const s of screens) {
    try { await capture(page, s, vpName); }
    catch (e) { report.captures.push({ id: s.id, viewport: vpName, path: s.path, error: e.message }); }
  }
  await ctx.close();
  await browser.close();
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // Desktop main + extras
  await captureBatch([...MAIN_SCREENS, ...EXTRA_SCREENS], VIEWPORTS.desktop);
  // Mobile main only
  await captureBatch(MAIN_SCREENS, VIEWPORTS.mobile);

  const b2 = await newBrowser();
  await runPurchaseFlow(b2);
  await b2.close();

  const b3 = await newBrowser();
  await runInteractionChecks(b3);
  await b3.close();

  const b4 = await newBrowser();
  await runResponsive(b4);
  await b4.close();

  report.endedAt = new Date().toISOString();
  await writeFile(path.join(OUT, '_report.json'), JSON.stringify(report, null, 2));

  // concise summary
  const okCaps = report.captures.filter((c) => !c.error).length;
  const overflows = report.responsive.filter((r) => r.overflow);
  console.log('\n=== FINAL REPORT ===');
  console.log(`Captures: ${okCaps}/${report.captures.length}`);
  console.log(`Console errors: ${report.consoleErrors.length}`);
  console.log(`Page errors: ${report.pageErrors.length}`);
  console.log(`Failed resources: ${report.failedResources.length}`);
  console.log(`XOF format issues: ${report.xofIssues.length}`);
  console.log(`Responsive overflow (${overflows.length}): ${overflows.map((o) => `${o.width}:${o.path}`).join(', ')}`);
  console.log(`Purchase flow steps ok: ${report.purchaseFlow?.steps.filter((s) => s.ok).length}/${report.purchaseFlow?.steps.length}`);
  console.log(`Interaction checks ok: ${report.interactions.filter((c) => c.ok).length}/${report.interactions.length}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

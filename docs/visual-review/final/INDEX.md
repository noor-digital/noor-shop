# NOOR SHOP — Captures finales de clôture

Captures réelles prises avec Playwright (Chromium) sur le serveur de
développement (`npm run dev`, `http://localhost:5173`).

- **Date** : 2026-11-11
- **Viewport desktop** : 1440 × 900 px
- **Viewport mobile** : 390 × 844 px
- **Locale navigateur** : `fr-FR`
- **Mode de capture** : `fullPage`
- **Total** : **37 captures** (22 principales + 15 complémentaires) + planche de contact

Toutes les données sont **fictives** et signalées dans l'UI par un bandeau noir
en haut des espaces boutique, commerçant et plateforme.

## Captures principales (22) — desktop + mobile

| # | Écran | Route | Desktop | Mobile |
|---|-------|-------|---------|--------|
| 01 | Landing NOOR SHOP | `/` | [01-landing-desktop.png](01-landing-desktop.png) | [01-landing-mobile.png](01-landing-mobile.png) |
| 02 | Boutique (Marble) | `/boutique/maam-couture` | [02-store-home-desktop.png](02-store-home-desktop.png) | [02-store-home-mobile.png](02-store-home-mobile.png) |
| 03 | Catalogue | `/boutique/maam-couture/catalogue` | [03-store-catalog-desktop.png](03-store-catalog-desktop.png) | [03-store-catalog-mobile.png](03-store-catalog-mobile.png) |
| 04 | Fiche produit | `/boutique/maam-couture/produit/boubou-wax-linguere` | [04-product-desktop.png](04-product-desktop.png) | [04-product-mobile.png](04-product-mobile.png) |
| 05 | Panier (vide) | `/boutique/maam-couture/panier` | [05-cart-desktop.png](05-cart-desktop.png) | [05-cart-mobile.png](05-cart-mobile.png) |
| 06 | Checkout | `/boutique/maam-couture/commande` | [06-checkout-desktop.png](06-checkout-desktop.png) | [06-checkout-mobile.png](06-checkout-mobile.png) |
| 07 | Dashboard commerçant | `/merchant` | [07-merchant-dashboard-desktop.png](07-merchant-dashboard-desktop.png) | [07-merchant-dashboard-mobile.png](07-merchant-dashboard-mobile.png) |
| 08 | Produits | `/merchant/produits` | [08-merchant-products-desktop.png](08-merchant-products-desktop.png) | [08-merchant-products-mobile.png](08-merchant-products-mobile.png) |
| 09 | Commandes | `/merchant/commandes` | [09-merchant-orders-desktop.png](09-merchant-orders-desktop.png) | [09-merchant-orders-mobile.png](09-merchant-orders-mobile.png) |
| 10 | Personnalisation | `/merchant/personnalisation` | [10-merchant-customize-desktop.png](10-merchant-customize-desktop.png) | [10-merchant-customize-mobile.png](10-merchant-customize-mobile.png) |
| 11 | Admin plateforme | `/platform` | [11-platform-dashboard-desktop.png](11-platform-dashboard-desktop.png) | [11-platform-dashboard-mobile.png](11-platform-dashboard-mobile.png) |

## Captures complémentaires (15) — desktop

| Id | Écran | Route |
|----|-------|-------|
| ex-01 | [Boutique Editorial](ex-01-store-editorial-desktop.png) | `/boutique/teranga-beauty` |
| ex-02 | [Boutique Gallery](ex-02-store-gallery-desktop.png) | `/boutique/baobab-home` |
| ex-03 | [Tarifs marketing](ex-03-pricing-desktop.png) | `/tarifs` |
| ex-04 | [Fonctionnalités](ex-04-features-desktop.png) | `/fonctionnalites` |
| ex-05 | [Connexion](ex-05-login-desktop.png) | `/connexion` |
| ex-06 | [Statistiques commerçant](ex-06-merchant-analytics-desktop.png) | `/merchant/statistiques` |
| ex-07 | [Stocks](ex-07-merchant-stocks-desktop.png) | `/merchant/stocks` |
| ex-08 | [Détail commande](ex-08-merchant-orderdetail-desktop.png) | `/merchant/commandes/NS-2026-1041` |
| ex-09 | [Admin boutiques](ex-09-platform-stores-desktop.png) | `/platform/boutiques` |
| ex-10 | [Admin offres](ex-10-platform-plans-desktop.png) | `/platform/offres` |
| ex-11 | [Panier rempli](ex-11-cart-filled-desktop.png) | `/panier` (après ajout via parcours réel) |
| ex-12 | [Checkout rempli](ex-12-checkout-filled-desktop.png) | `/commande` (formulaire rempli) |
| ex-13 | [Confirmation commande](ex-13-confirmation-desktop.png) | `/confirmation/:token` (commande réelle) |
| ex-14 | [Formulaire nouveau produit](ex-14-product-form-desktop.png) | `/merchant/produits/nouveau` |
| ex-15 | [Wizard nouvelle boutique](ex-15-wizard-desktop.png) | `/merchant/boutiques/nouvelle` |

## Planche de contact

- [contact-sheet.png](contact-sheet.png) — 26 captures desktop en grille.
- [contact-sheet.html](contact-sheet.html) — version HTML navigable.

## Rapport détaillé

- [FINAL-REVIEW.md](FINAL-REVIEW.md) — bilan complet de la clôture.
- [_report.json](_report.json) — résultats bruts (captures, interactions,
  parcours d'achat, responsive, erreurs console/réseau).

## Reproduire les captures

```bash
npm install
npm install --no-save playwright
npx playwright install chromium
npm run dev                             # terminal 1
node scripts/final-review.mjs           # terminal 2 — 37 captures + tests
node scripts/contact-sheet-final.mjs    # regénère la planche de contact
```

## Revue initiale (conservée)

Les captures et rapports de la revue précédente restent dans
[`docs/visual-review/`](../) (fichiers à la racine, hors dossier `final/`).

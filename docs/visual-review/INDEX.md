# NOOR SHOP — Captures de revue visuelle

Ces captures ont été réalisées avec Playwright (Chromium) sur le serveur de
développement `vite` en local (`http://localhost:5173`).

- **Viewport desktop** : 1440 × 900 px
- **Viewport mobile** : 390 × 844 px (iPhone 14 class)
- **Locale** : `fr-FR`
- **Mode** : `fullPage` (page entière, pas seulement le viewport)
- **Date** : 2026-11-11

Toutes les données affichées sont **fictives** et clairement signalées dans
l'application par un bandeau noir (« Données fictives ») en haut des espaces
boutique, commerçant et plateforme.

## Écrans capturés

| # | Écran | Route | Desktop | Mobile |
|---|-------|-------|---------|--------|
| 01 | Page d'accueil NOOR SHOP | `/` | [01-landing-desktop.png](01-landing-desktop.png) | [01-landing-mobile.png](01-landing-mobile.png) |
| 02 | Accueil boutique publique (modèle Marble) | `/boutique/maam-couture` | [02-store-home-desktop.png](02-store-home-desktop.png) | [02-store-home-mobile.png](02-store-home-mobile.png) |
| 03 | Catalogue produits | `/boutique/maam-couture/catalogue` | [03-store-catalog-desktop.png](03-store-catalog-desktop.png) | [03-store-catalog-mobile.png](03-store-catalog-mobile.png) |
| 04 | Fiche produit | `/boutique/maam-couture/produit/boubou-wax-linguere` | [04-product-desktop.png](04-product-desktop.png) | [04-product-mobile.png](04-product-mobile.png) |
| 05 | Panier (état vide) | `/boutique/maam-couture/panier` | [05-cart-desktop.png](05-cart-desktop.png) | [05-cart-mobile.png](05-cart-mobile.png) |
| 06 | Commande / checkout | `/boutique/maam-couture/commande` | [06-checkout-desktop.png](06-checkout-desktop.png) | [06-checkout-mobile.png](06-checkout-mobile.png) |
| 07 | Tableau de bord commerçant | `/merchant` | [07-merchant-dashboard-desktop.png](07-merchant-dashboard-desktop.png) | [07-merchant-dashboard-mobile.png](07-merchant-dashboard-mobile.png) |
| 08 | Gestion des produits | `/merchant/produits` | [08-merchant-products-desktop.png](08-merchant-products-desktop.png) | [08-merchant-products-mobile.png](08-merchant-products-mobile.png) |
| 09 | Gestion des commandes | `/merchant/commandes` | [09-merchant-orders-desktop.png](09-merchant-orders-desktop.png) | [09-merchant-orders-mobile.png](09-merchant-orders-mobile.png) |
| 10 | Personnalisation de boutique | `/merchant/personnalisation` | [10-merchant-customize-desktop.png](10-merchant-customize-desktop.png) | [10-merchant-customize-mobile.png](10-merchant-customize-mobile.png) |
| 11 | Administration plateforme | `/platform` | [11-platform-dashboard-desktop.png](11-platform-dashboard-desktop.png) | [11-platform-dashboard-mobile.png](11-platform-dashboard-mobile.png) |

**Total : 22 captures** (11 écrans × 2 viewports).

## Planche de contact

- [contact-sheet.png](contact-sheet.png) — image des 11 captures desktop en grille 3 colonnes.
- [contact-sheet.html](contact-sheet.html) — version HTML (ouvrable en navigateur).

## Autres parcours disponibles pour la revue (non capturés mais navigables)

- `/fonctionnalites`, `/tarifs`, `/a-propos`, `/contact` — pages marketing.
- `/connexion`, `/inscription`, `/mot-de-passe-oublie`, `/reinitialiser-mot-de-passe`, `/verifier-email` — authentification.
- `/boutique/teranga-beauty` — modèle **Editorial**.
- `/boutique/baobab-home` — modèle **Gallery**.
- `/boutique/:slug/categories`, `/categorie/:slug`, `/recherche` — navigation catalogue.
- `/boutique/:slug/confirmation/:token` — confirmation de commande.
- `/merchant/boutiques`, `/stocks`, `/clients`, `/statistiques`, `/apercu`, `/livraison`, `/abonnement`, `/parametres`.
- `/merchant/produits/nouveau`, `/merchant/produits/:id` — formulaire produit avec éditeur de variantes.
- `/merchant/commandes/:id` — détail commande avec historique.
- `/platform/commercants`, `/boutiques`, `/abonnements`, `/offres`, `/journal`, `/parametres`.

## Reproduire les captures

```bash
npm install                       # première fois uniquement
npm install --no-save playwright   # pour les captures
npx playwright install chromium   # navigateur headless
npm run dev                        # terminal 1
node scripts/visual-review.mjs    # terminal 2 — capture les 22 écrans
node scripts/contact-sheet.mjs    # regénère la planche de contact
```

# NOOR SHOP — État de la revue visuelle

**Date de la revue** : 2026-11-11
**Branche** : `master`
**Phase** : conception frontend terminée (préparation backend Laravel + Inertia à venir).

## 1. État de compilation

| Étape | Résultat |
|-------|----------|
| `npm install` | OK (dépendances installées) |
| `npm run build` | **OK** — 102 modules transformés, built in 13,4 s |
| `npm run dev` | **OK** — serveur Vite 5.4.21 actif sur `http://localhost:5173` |
| Erreurs console/pageerror pendant la capture | **0 erreur** sur les 22 pages ouvertes |

**Bundle production** :
- `index.html` — 0,97 kB (gzip 0,54 kB)
- `index-*.css` — 31,39 kB (gzip 6,50 kB)
- `index-*.js` — 354,66 kB (gzip 94,35 kB)

Pas d'erreur TypeScript (projet en JavaScript + JSX), pas d'avertissement bloquant Vite.

## 2. Méthode de capture

- Serveur local Vite lancé en mode développement sur `127.0.0.1:5173`.
- Script `scripts/visual-review.mjs` utilisant **Playwright 1.65** (Chromium headless).
- Chaque page attend `networkidle` + 600 ms, puis capture en `fullPage`.
- Deux contextes navigateur : desktop (1440 px) et mobile (390 px), locale `fr-FR`.
- Les erreurs `console.error` et `pageerror` sont interceptées : **aucune n'est remontée**.

Les captures sont réelles, prises sur l'application effectivement ouverte dans le
navigateur ; aucune n'est reconstituée.

## 3. Pages ouvertes et vérifiées

Les 11 écrans listés dans `INDEX.md` ont tous retourné un `HTTP 200` et affiché
un contenu correct :

| Écran | Code | Vérifications passées |
|-------|------|-----------------------|
| Accueil NOOR SHOP | 200 | Hero, bandeau « déjà rejoints par », grille 4 fonctionnalités, 3 étapes d'onboarding, 3 modèles de boutique, 3 offres (Découverte / Pro / Business), CTA footer, footer complet. |
| Boutique Marble | 200 | Bandeau démo noir affiché, header avec recherche + icône panier (compteur 0), hero, sections éditoriales, grille produit avec visuels Unsplash chargés. |
| Catalogue | 200 | Filtres par catégorie, tri, grille produits responsive. |
| Fiche produit | 200 | Galerie, prix XOF, sélecteur de variantes, bouton d'ajout au panier. |
| Panier | 200 | État **vide** correctement rendu (illustration + CTA retour catalogue). |
| Commande | 200 | Formulaire livraison / retrait, zones, résumé commande. **Aucun paiement en ligne simulé** (conforme au cahier des charges). |
| Dashboard commerçant | 200 | 4 KPIs, courbe d'évolution CSS, carte stocks à surveiller, liste 5 dernières commandes avec statuts colorés. |
| Produits commerçant | 200 | Table responsive avec visuel, prix, stock, catégorie, statut. |
| Commandes commerçant | 200 | Filtres par statut, tableau complet, montants en F CFA. |
| Personnalisation | 200 | Sélecteur de modèle (Marble/Editorial/Gallery), couleurs, sections. |
| Administration | 200 | 4 KPIs plateforme, graphique d'activité, derniers commerçants, derniers logs. |

## 4. Interactions vérifiées (sur chargement initial)

- **Navigation** : header marketing, sidebar commerçant (11 entrées), sidebar plateforme (7 entrées), footer. Les liens internes pointent vers des routes existantes.
- **Responsive** : chaque écran a été vérifié en 1440 et 390 px. Les sidebars commerçant et plateforme se replient derrière un menu sur mobile, les tables se transforment en cartes empilées, la grille produits passe de 3-4 colonnes à 2 puis 1.
- **États** : panier vide (état vide affiché), rupture de stock (badge rouge visible sur les produits concernés), statuts commandes (En attente / Confirmée / En préparation / Prête / Terminée / Annulée — 6 badges distincts).
- **Monnaie** : formatée via `Intl.NumberFormat('fr-SN', { currency: 'XOF' })` — valeurs en F CFA sans décimales.
- **Bandeau données fictives** : présent et visible sur boutiques publiques, espace commerçant, espace plateforme.

## 5. Interactions **non** exécutées pendant cette revue

Les captures montrent les pages à leur chargement. Les flux suivants n'ont pas
été joués dans le script mais sont implémentés dans le code :

- Ajout produit au panier → mise à jour du compteur, toast de confirmation.
- Modification des quantités, suppression d'un article.
- Checkout → écran de confirmation avec token aléatoire.
- Wizard de création de boutique (6 étapes).
- Création / édition produit avec éditeur de variantes (modal).
- Confirmation d'une commande depuis le détail.
- Changement de modèle depuis « Personnalisation » → preview iframe.
- Suspension d'une boutique depuis l'admin (modal de confirmation).

Un revieweur peut les déclencher manuellement sur l'URL locale.

## 6. Fonctionnalités simulées — à documenter clairement

Conformément au cahier des charges, **rien n'est réellement persisté côté serveur**.

- Aucun backend, aucune base de données, aucune API : toutes les données
  proviennent des fichiers `src/data/*.js` (plans, boutiques, catalogue,
  commandes, plateforme).
- Le panier est stocké en `localStorage` du navigateur (règle mono-boutique).
- Les toasts « enregistré », « modifié », « confirmée » sont de l'UI simulée :
  aucune mutation serveur n'est effectuée.
- Aucun paiement en ligne n'est simulé : le prototype respecte la règle
  « paiement à la livraison ou retrait ».
- Les images produits proviennent du CDN Unsplash et sont à remplacer par du
  shooting réel avant mise en production.
- Les noms, numéros de commande, clients, montants sont inventés.

## 7. Problèmes rencontrés

### Mineurs (non bloquants)

- **Doublon de suffixe monétaire sur la landing** — les cartes d'offre affichent
  `14 900 FF CFA` et `34 900 FF CFA` (deux F). La valeur formatée par
  `formatXof` contient déjà « F CFA » et le template ajoute un second « F CFA ».
  À corriger dans `src/pages/marketing/Landing.jsx` et `Pricing.jsx` en retirant
  le suffixe manuel. **Non corrigé dans cette revue** (hors scope : ne pas
  modifier le design validé). Les autres écrans utilisent `formatXof` seul et
  sont corrects.
- La première exécution du script de capture s'est terminée avec le code 127
  après 20/22 captures (arrêt système). Les 2 captures mobile manquantes ont
  été reprises avec succès. Toutes les 22 captures sont présentes au final.

### Aucun bug fonctionnel bloquant détecté

- Aucun écran blanc, aucun crash React, aucune route 404 sur les 11 pages
  capturées.
- Aucune erreur dans la console du navigateur sur les 22 ouvertures.
- Les polices (Inter en repli de GT Standard), les tokens de couleur, les
  rayons (28 px cartes, 9999 px pills) sont appliqués conformément au
  `DESIGN-REFERENCE.md`.

## 8. Prochaines étapes suggérées pour la revue

- Ouvrir la planche de contact [contact-sheet.png](contact-sheet.png) pour une
  vue d'ensemble des 11 écrans desktop.
- Explorer les 2 autres modèles de boutique non capturés :
  `/boutique/teranga-beauty` (Editorial) et `/boutique/baobab-home` (Gallery).
- Tester un parcours d'achat complet : accueil → produit → ajout panier →
  checkout → confirmation.
- Vérifier les modales (création produit, suspension boutique, nouvelle offre).
- Corriger le doublon « FF CFA » avant la prochaine passe de revue.

## 9. Adresse locale

Pendant la revue : **http://localhost:5173**
(lancer `npm run dev` à la racine du projet.)

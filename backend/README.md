# NOOR SHOP — Backend (Laravel + Inertia.js + React + MySQL)

Phase 2 du projet NOOR SHOP : le backend Laravel qui remplacera
progressivement la logique localStorage du prototype frontend situé à la
racine du dépôt (`../src/`).

**État actuel — Phase 1A (socle d'authentification & multi-tenant)** :

- Laravel 12 + React Starter Kit (TypeScript + Inertia 2) scaffoldé.
- Migrations : `users` (avec rôle), `plans`, `stores`, `store_settings`,
  `subscriptions`.
- Modèles Eloquent + relations + `StorePolicy` (isolation par propriétaire).
- Middlewares `merchant` et `platform` (rôles).
- Routes `/merchant` et `/platform` protégées avec contrôleurs stub.
- Seeders : 3 offres (Découverte / Pro / Business), 1 admin plateforme,
  1 commerçant démo avec boutique Marble.
- Migrations + seeders validés en SQLite in-memory.

Le périmètre Phase 1B à venir : produits, catégories, variantes, stocks,
commandes, zones de livraison, journal d'audit — toutes les tables listées
au §17 du cahier des charges.

---

## Prérequis

| Outil | Version testée |
|-------|----------------|
| PHP | 8.2+ (ZTS ou NTS, extension `pdo_mysql` activée) |
| Composer | 2.9+ |
| Node.js | 24+ (ou 20 LTS) |
| MySQL ou MariaDB | 8.0 / 11+ (MariaDB 12.1 validée) |

## Installation locale

```bash
cd backend

# 1. Dépendances PHP + JS
composer install
npm install

# 2. Fichier .env
cp .env.example .env
php artisan key:generate

# 3. Base de données
# — soit : créer la base "noor_shop" dans MySQL/MariaDB
#     CREATE DATABASE noor_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# — puis éditer .env si l'utilisateur/mot de passe diffèrent du défaut
php artisan migrate --seed

# 4. Dev server (frontend + backend en parallèle)
composer run dev      # lance php artisan serve + vite + queue + logs
# ou séparément :
php artisan serve     # http://127.0.0.1:8000
npm run dev           # Vite HMR
```

### Comptes de démonstration créés par le seeder

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Platform admin | `admin@noor.shop` | `password` |
| Merchant (Maam Couture) | `merchant@noor.shop` | `password` |

> Les mots de passe sont volontairement triviaux pour l'environnement local
> et **ne doivent jamais être utilisés en production**.

## Variables d'environnement

Les clés sensibles **ne sont jamais** commitées (`.env`, `.env.backup`,
`.env.production` sont dans `.gitignore`). Seul `.env.example` suit l'évolution
de la configuration attendue.

| Clé | Rôle | Valeur par défaut |
|-----|------|-------------------|
| `APP_NAME` | Affiché dans les titres et e-mails | `NOOR SHOP` |
| `APP_LOCALE` | Locale par défaut (interfaces en français) | `fr` |
| `APP_URL` | URL publique pour les liens absolus | `http://localhost:8000` |
| `DB_CONNECTION` | Connecteur BDD | `mysql` |
| `DB_DATABASE` | Nom de la base | `noor_shop` |
| `MAIL_MAILER` | Transport e-mail | `log` en dev |

## Structure actuelle

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Merchant/
│   │   │   │   ├── MerchantDashboardController.php
│   │   │   │   └── StoreController.php
│   │   │   └── Platform/
│   │   │       └── PlatformDashboardController.php
│   │   └── Middleware/
│   │       ├── EnsureMerchant.php
│   │       └── EnsurePlatformAdmin.php
│   ├── Models/
│   │   ├── Plan.php
│   │   ├── Store.php
│   │   ├── StoreSetting.php
│   │   ├── Subscription.php
│   │   └── User.php         (+ role, phone)
│   └── Policies/
│       └── StorePolicy.php
├── bootstrap/app.php         (alias middlewares merchant / platform)
├── database/
│   ├── migrations/
│   │   ├── 2026_11_11_100000_create_plans_table.php
│   │   ├── 2026_11_11_100100_create_stores_table.php
│   │   ├── 2026_11_11_100200_create_store_settings_table.php
│   │   └── 2026_11_11_100300_create_subscriptions_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── DemoAccountsSeeder.php
│       └── PlanSeeder.php
├── resources/js/pages/
│   ├── merchant/
│   │   ├── dashboard.tsx
│   │   └── stores/index.tsx
│   └── platform/
│       └── dashboard.tsx
└── routes/web.php            (groupes merchant.* et platform.*)
```

## Routes publiques déjà en place

| Méthode | URL | Accès | Rôle contrôle |
|---------|-----|-------|---------------|
| GET | `/` | public | — |
| GET | `/login`, `/register`, … | public | — |
| GET | `/merchant` | auth + verified | `merchant` |
| GET | `/merchant/stores` | auth + verified | `merchant` + `StorePolicy::viewAny` |
| GET | `/platform` | auth + verified | `platform` |

Les routes de l'espace commerçant complet (produits, commandes, livraison,
personnalisation, …) seront ajoutées en Phase 1B, en respectant exactement les
chemins listés dans le cahier des charges §18.3.

## Sécurité métier

Déjà en place :

- Hachage bcrypt des mots de passe (rounds = 12, piloté par Laravel).
- CSRF sur toutes les routes web.
- Validation côté serveur systématique via `FormRequest` (à ajouter par
  ressource en Phase 1B).
- Isolation des boutiques par `owner_user_id` — toute action transite par
  `StorePolicy` qui vérifie l'appartenance avant l'accès.
- Suspension d'une boutique réservée à `platform_admin` (`StorePolicy::suspend`).
- `.env`, `*.pem`, `*.key`, backups exclus de Git.

À implémenter en Phase 1B :

- Rate-limiting sur `/login`, `/register`, `/forgot-password`.
- Journal d'audit (`audit_logs`) pour toute action sensible côté admin.
- Transactions + verrou optimiste sur les mouvements de stock.
- Réservation de stock 2 h à la création d'une commande, libération
  automatique à l'expiration.

## Tests

```bash
php artisan test
```

Les tests dédiés aux politiques d'autorisation (StorePolicy, isolation
inter-boutiques) seront ajoutés en Phase 1B en même temps que les ressources
produits/commandes qu'elles protègent.

## Intégration avec le prototype frontend

Le prototype React/Vite autonome reste pour l'instant dans `../src/`
(voir le README racine). La migration page par page vers
`backend/resources/js/pages/` s'effectuera en Phase 2 une fois les ressources
backend (produits, commandes) disponibles — pour éviter de basculer une page
avant que son contrôleur ne soit prêt.

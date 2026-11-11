# NOOR SHOP
## Cahier des charges fonctionnel, technique et UX/UI

**Version :** 1.0 — Document de référence  
**Statut :** Validé pour la conception frontend  
**Produit :** Plateforme SaaS de création et de gestion de boutiques en ligne  
**Marché initial :** Sénégal  
**Extension envisagée :** Afrique francophone  
**Langue initiale :** Français  
**Devise :** Franc CFA (XOF)  
**Orientation :** Mobile-first, responsive, professionnelle et évolutive

---

# 1. Présentation du projet

## 1.1. Vision

NOOR SHOP est une plateforme SaaS permettant à un commerçant de créer, personnaliser et gérer sa propre boutique en ligne sans avoir besoin de compétences en programmation.

Chaque commerçant dispose d'une boutique indépendante, avec :
- Son propre nom et son identité visuelle.
- Son propre catalogue de produits.
- Ses catégories et variantes.
- Son propre panier et processus de commande.
- Son espace d'administration.
- Sa gestion des stocks et des commandes.
- Une adresse publique dédiée.

NOOR SHOP n'est pas une marketplace. Les boutiques ne partagent pas un catalogue commun et ne sont pas regroupées dans un espace de vente commun.

## 1.2. Proposition de valeur

Permettre à un commerçant de passer rapidement d'une activité commerciale traditionnelle à une présence professionnelle sur Internet, avec un outil simple, accessible et centralisé.

## 1.3. Objectifs

1. Simplifier la création d'une boutique en ligne.
2. Donner aux commerçants un outil de gestion accessible depuis un téléphone ou un ordinateur.
3. Faciliter la présentation et la vente de produits.
4. Centraliser les commandes, les clients et les stocks.
5. Construire une plateforme SaaS capable d'accueillir plusieurs milliers de boutiques à terme.
6. Proposer une expérience professionnelle sans complexité inutile.

---

# 2. Périmètre du produit

NOOR SHOP comporte trois espaces distincts :

### A. Boutique publique
L'espace accessible aux visiteurs et aux clients pour découvrir les produits et passer commande.

### B. Espace commerçant
L'espace privé permettant au commerçant de gérer sa boutique, ses produits, ses stocks, ses commandes et ses paramètres.

### C. Administration de la plateforme
L'espace réservé à l'équipe NOOR SHOP pour superviser les boutiques, les comptes, les abonnements et l'activité globale.

Les trois espaces doivent être clairement séparés dans la navigation, les permissions et l'identité visuelle.

---

# 3. Utilisateurs et rôles

## 3.1. Visiteur

Un visiteur peut :
- Consulter une boutique publique.
- Parcourir les catégories.
- Rechercher des produits.
- Consulter les détails d'un produit.
- Sélectionner une taille, une couleur ou une variante.
- Ajouter des articles au panier.
- Modifier son panier.
- Passer une commande sans créer de compte.
- Consulter la confirmation de sa commande.

## 3.2. Commerçant

Le commerçant peut :
- Créer un compte.
- Créer et configurer une boutique.
- Gérer plusieurs boutiques depuis un même compte.
- Personnaliser l'apparence de ses boutiques.
- Ajouter et modifier des produits.
- Gérer les catégories, images et variantes.
- Suivre les stocks.
- Consulter et traiter les commandes.
- Consulter les informations de ses clients.
- Consulter les statistiques de son activité.
- Gérer son abonnement et les paramètres de sa boutique.

Le premier parcours d'inscription crée une première boutique. La possibilité d'ajouter d'autres boutiques est disponible depuis l'espace commerçant, selon les limites de l'offre.

## 3.3. Administrateur de la plateforme

L'administrateur NOOR SHOP peut :
- Consulter les statistiques globales.
- Consulter les comptes commerçants.
- Consulter les boutiques créées.
- Activer, suspendre ou réactiver une boutique.
- Consulter les abonnements.
- Attribuer ou modifier une offre.
- Gérer les offres et leurs limites.
- Consulter les informations nécessaires au support.
- Consulter les événements importants et les journaux d'activité.

L'administrateur de la plateforme ne doit pas accéder librement aux données privées des boutiques sans permission et justification opérationnelle.

---

# 4. Inscription et création d'une boutique

## 4.1. Inscription commerçant

Champs :
- Nom complet.
- Adresse e-mail.
- Mot de passe.
- Confirmation du mot de passe.
- Acceptation des conditions d'utilisation.

Règles :
- Adresse e-mail unique par compte.
- Vérification de l'adresse e-mail avant publication de la boutique.
- Mot de passe stocké sous forme sécurisée.
- Protection contre les tentatives répétées de connexion.
- Réinitialisation du mot de passe par e-mail.

Le numéro de téléphone du commerçant est demandé lors de la configuration de sa boutique.

## 4.2. Création de la boutique

Informations :
- Nom commercial.
- Identifiant URL (slug).
- Description.
- Logo.
- Image de couverture.
- Numéro de téléphone.
- Adresse ou zone d'activité.
- Couleur principale.
- Modèle graphique.

Exemple d'URL :

`noorshop.com/ma-boutique`

Règles du slug :
- Unique sur la plateforme.
- Sans espaces.
- Format lisible et compatible avec les URL.
- Mots réservés interdits.
- Modification possible avec vérification de disponibilité.
- Redirection de l'ancienne adresse si elle est modifiée et si la redirection peut être conservée sans ambiguïté.

## 4.3. Parcours de première configuration

Le commerçant est guidé à travers les étapes suivantes :

1. Création du compte.
2. Création de la boutique.
3. Ajout du logo et de l'identité visuelle.
4. Choix du modèle.
5. Création des premières catégories.
6. Ajout des premiers produits.
7. Configuration des modes de livraison.
8. Aperçu de la boutique.
9. Publication.

Une progression visuelle indique les étapes terminées et celles qui restent à effectuer.

---

# 5. Boutique publique

Chaque boutique possède son propre site marchand, accessible sans connexion.

## 5.1. Page d'accueil

Éléments :
- En-tête avec logo et nom de la boutique.
- Navigation.
- Barre de recherche.
- Accès au panier.
- Bannière principale.
- Texte de présentation.
- Catégories mises en avant.
- Produits récents ou populaires.
- Sections promotionnelles facultatives.
- Pied de page avec coordonnées et informations utiles.

Le commerçant doit pouvoir choisir les produits mis en avant et leur ordre d'affichage.

## 5.2. Page catégories

Fonctionnalités :
- Liste des catégories.
- Image ou icône facultative.
- Nombre de produits.
- Accès à une catégorie.
- Affichage des produits associés.

## 5.3. Page catalogue

Fonctionnalités :
- Affichage en grille.
- Image principale.
- Nom du produit.
- Prix en XOF.
- Prix promotionnel si applicable.
- Disponibilité.
- Accès à la fiche produit.

Filtres initiaux :
- Catégorie.
- Disponibilité.
- Fourchette de prix.

Tri :
- Plus récents.
- Prix croissant.
- Prix décroissant.

## 5.4. Fiche produit

Informations :
- Galerie d'images.
- Nom.
- Description.
- Prix.
- Prix promotionnel.
- Disponibilité.
- Variantes disponibles.
- Sélection de taille.
- Sélection de couleur.
- Quantité.
- Bouton Ajouter au panier.

Une variante indisponible ne peut pas être commandée.

## 5.5. Recherche

La recherche doit permettre de retrouver les produits à partir :
- Du nom.
- De mots présents dans la description.
- De la catégorie.

Les résultats doivent être limités à la boutique consultée.

## 5.6. Panier

Fonctionnalités :
- Ajouter un produit.
- Modifier une quantité.
- Supprimer un article.
- Consulter le sous-total.
- Consulter les frais estimés.
- Consulter le total.
- Continuer les achats.
- Passer à la commande.

**Règle fondamentale : un panier ne peut contenir que des produits appartenant à une seule boutique.**

Le panier doit conserver son contenu pendant la navigation et les actualisations normales de la page.

## 5.7. Commande sans compte client

La création d'un compte client n'est pas obligatoire.

Informations obligatoires :
- Nom du client.
- Numéro de téléphone.
- Adresse ou zone de livraison si livraison.
- Mode de réception.
- Instructions facultatives.

Le client peut choisir :
- Livraison.
- Retrait auprès du commerçant.

Le paiement initial est effectué à la livraison ou au retrait.

Aucun paiement en ligne automatisé n'est intégré au MVP.

## 5.8. Confirmation de commande

Après validation :
- Afficher un numéro de commande.
- Afficher un résumé.
- Afficher le nom de la boutique.
- Afficher le montant total.
- Afficher le mode de réception.
- Afficher les coordonnées utiles du commerçant.

Une page de suivi peut être accessible avec une référence de commande et un jeton privé non devinable. Les données personnelles ne doivent jamais être exposées par une simple référence séquentielle.

---

# 6. Gestion du catalogue

## 6.1. Produits

Chaque produit contient :
- Nom.
- Slug.
- Description.
- Catégorie.
- Images.
- Prix.
- Prix promotionnel facultatif.
- Statut.
- Variantes.
- Informations de création et de modification.

Statuts :
- Brouillon.
- Publié.
- Archivé.

Un produit archivé n'est plus visible dans la boutique publique, mais ses informations historiques restent disponibles dans les anciennes commandes.

## 6.2. Catégories

Fonctionnalités :
- Créer une catégorie.
- Modifier une catégorie.
- Supprimer une catégorie sans supprimer automatiquement les produits.
- Ajouter une image facultative.
- Définir l'ordre d'affichage.
- Activer ou désactiver une catégorie.

Une catégorie appartenant à une boutique ne peut jamais être utilisée par une autre boutique.

## 6.3. Variantes

Le système doit prendre en charge :
- Tailles.
- Couleurs.
- Autres options simples.
- Combinaisons de plusieurs options.

Exemple :

Produit : T-shirt

- Taille S, couleur noire.
- Taille M, couleur noire.
- Taille L, couleur noire.
- Taille S, couleur blanche.
- Taille M, couleur blanche.

Chaque combinaison possède sa propre disponibilité et son propre stock.

Le prix est hérité du produit par défaut. Une variante peut avoir un prix spécifique si nécessaire.

## 6.4. Gestion des images

- Plusieurs images par produit.
- Image principale.
- Réorganisation des images.
- Suppression.
- Formats acceptés contrôlés.
- Taille maximale configurable.
- Compression et optimisation des images.
- Protection contre les fichiers dangereux.

---

# 7. Gestion des stocks

Le stock est géré au niveau des variantes.

Même un produit sans options possède une variante par défaut. Cela permet d'utiliser une seule logique de stock pour tout le catalogue.

Fonctionnalités :
- Définir une quantité disponible.
- Modifier une quantité.
- Consulter l'historique des mouvements.
- Signaler les stocks faibles.
- Afficher les produits indisponibles.
- Empêcher les quantités négatives.

## 7.1. Règle de réservation

À la création d'une commande :
- Vérifier la disponibilité.
- Vérifier toutes les quantités.
- Créer la commande.
- Réserver les quantités de manière atomique.

La réservation est temporaire et expire après deux heures si le commerçant ne confirme pas la commande.

À la confirmation :
- La réservation devient une sortie de stock définitive.

En cas d'annulation ou d'expiration :
- La réservation est libérée une seule fois.
- Les quantités redeviennent disponibles.

Les opérations doivent être transactionnelles afin d'éviter les ventes simultanées dépassant le stock réel.

Les réservations expirées doivent être traitées automatiquement par une tâche planifiée côté serveur.

---

# 8. Gestion des commandes

## 8.1. Liste des commandes

Le commerçant peut consulter :
- Référence.
- Date.
- Nom du client.
- Téléphone.
- Nombre d'articles.
- Montant total.
- Mode de réception.
- Statut.
- Mode de paiement.

Filtres :
- Date.
- Statut.
- Référence.
- Nom du client.
- Numéro de téléphone.

## 8.2. Détail d'une commande

Afficher :
- Référence.
- Informations client.
- Articles commandés.
- Variantes.
- Quantités.
- Prix unitaires.
- Frais de livraison.
- Total.
- Mode de paiement.
- Mode de réception.
- Adresse de livraison.
- Instructions.
- Historique des changements de statut.

## 8.3. Statuts de commande

Cycle initial :

1. En attente.
2. Confirmée.
3. En préparation.
4. Prête.
5. Terminée.
6. Annulée.

Les transitions autorisées doivent être contrôlées côté serveur.

Une commande terminée ne peut pas être annulée par une simple modification de statut.

Toute modification importante est enregistrée dans l'historique.

## 8.4. Statut du paiement

Le statut du paiement est distinct du statut de la commande.

Valeurs :
- Non payé.
- Payé.
- Remboursé.

Le commerçant peut marquer une commande comme payée après réception effective de l'argent.

Aucune confirmation automatique de paiement ne doit être simulée.

## 8.5. Historique

Conserver :
- Ancien statut.
- Nouveau statut.
- Date.
- Auteur de l'action.
- Commentaire facultatif.

Les informations d'une commande passée doivent rester cohérentes même si le commerçant modifie ensuite son catalogue.

Les lignes de commande conservent donc une copie du nom du produit, de la variante, du prix, de la quantité et des montants appliqués au moment de l'achat.

---

# 9. Livraison et retrait

Chaque boutique peut configurer :
- Livraison disponible ou non.
- Retrait disponible ou non.
- Frais de livraison.
- Zones de livraison simples.
- Délais ou informations indicatives.
- Instructions de retrait.

Le commerçant peut définir plusieurs zones avec des tarifs fixes.

Le système calcule les frais en fonction de la zone choisie.

Les frais utilisés dans une commande sont enregistrés dans la commande et ne changent pas si le commerçant modifie ensuite ses tarifs.

Le calcul final est toujours effectué côté serveur.

---

# 10. Clients

L'espace commerçant dispose d'une rubrique Clients.

Informations :
- Nom.
- Téléphone.
- E-mail facultatif.
- Adresse facultative.
- Nombre de commandes.
- Montant cumulé.
- Date de dernière commande.

Les clients sont propres à chaque boutique.

Un même numéro de téléphone peut correspondre à plusieurs fiches si nécessaire. Le système peut suggérer une correspondance, mais ne doit pas fusionner automatiquement des personnes sur la seule base d'un numéro partagé.

Le commerçant ne peut consulter que les clients associés à ses boutiques.

---

# 11. Tableau de bord commerçant

Le tableau de bord doit donner une vision rapide de l'activité.

Indicateurs :
- Nombre total de commandes.
- Commandes en attente.
- Commandes confirmées.
- Commandes terminées.
- Chiffre d'affaires des commandes terminées et payées.
- Nombre de produits publiés.
- Produits en stock faible.
- Produits indisponibles.

Graphiques :
- Évolution des commandes.
- Évolution du chiffre d'affaires.
- Répartition des statuts.

Périodes :
- Aujourd'hui.
- 7 derniers jours.
- 30 derniers jours.
- Période personnalisée.

Les indicateurs doivent être calculés à partir des données réelles. Aucun chiffre fictif ne doit être affiché dans un environnement de production.

---

# 12. Personnalisation de la boutique

Le commerçant peut personnaliser :
- Nom.
- Logo.
- Couverture.
- Description.
- Couleur principale.
- Coordonnées.
- Réseaux sociaux facultatifs.
- Modèle graphique.
- Ordre de certaines sections.
- Produits mis en avant.

## 12.1. Modèles graphiques

Trois modèles professionnels sont disponibles au lancement.

Ils doivent partager la même base fonctionnelle, mais proposer des compositions et des présentations différentes.

Le changement de modèle ne doit jamais supprimer les produits, catégories ou commandes.

## 12.2. Limites de personnalisation

Pas de constructeur libre de pages au lancement.

Pas de code HTML/CSS personnalisé par le commerçant.

La personnalisation reste encadrée afin de garantir :
- Cohérence visuelle.
- Accessibilité.
- Compatibilité mobile.
- Performance.
- Maintenance.

---

# 13. Abonnements et offres

Le modèle économique repose sur des abonnements SaaS.

## 13.1. Offres

Prévoir trois niveaux configurables :

- Découverte.
- Pro.
- Business.

Les noms, prix, limites et fonctionnalités doivent être administrables depuis la plateforme.

Les tarifs définitifs ne sont pas figés dans le code.

## 13.2. Essai gratuit

Durée initiale : 14 jours.

L'essai commence à la création de la première boutique.

## 13.3. Gestion des abonnements

Statuts :
- Essai.
- Actif.
- En attente.
- Expiré.
- Suspendu.
- Résilié.

Le système doit enregistrer :
- Offre.
- Date de début.
- Date de fin.
- Historique.
- Statut.
- Activation manuelle.
- Renouvellement manuel.

Aucun paiement automatique d'abonnement n'est intégré au MVP.

## 13.4. Expiration

À la fin de l'essai :
- Notification au commerçant.
- Période de grâce de 7 jours.
- Après cette période, désactivation de la prise de nouvelles commandes.
- Conservation de l'accès aux données nécessaires à la gestion et à la récupération de l'activité.
- Suspension publique de la boutique si l'abonnement reste inactif.

Les données ne sont pas supprimées automatiquement à l'expiration.

---

# 14. Administration NOOR SHOP

L'administration de la plateforme doit disposer de son propre espace sécurisé.

## 14.1. Tableau de bord global

Indicateurs :
- Nombre de commerçants.
- Nombre de boutiques.
- Boutiques actives.
- Boutiques suspendues.
- Essais en cours.
- Abonnements actifs.
- Abonnements expirés.
- Nombre total de commandes.
- Volume global des commandes.

Les indicateurs doivent être calculés depuis la base de données.

## 14.2. Gestion des commerçants

- Liste.
- Recherche.
- Filtres.
- Détail.
- Statut.
- Date d'inscription.
- Boutiques associées.
- Historique utile.

## 14.3. Gestion des boutiques

- Liste des boutiques.
- Consultation.
- Activation.
- Suspension.
- Réactivation.
- Consultation de l'offre.
- Consultation de l'activité.

## 14.4. Gestion des offres

- Créer une offre.
- Modifier une offre.
- Activer ou désactiver une offre.
- Définir ses limites.
- Définir ses fonctionnalités.
- Consulter les abonnements associés.

## 14.5. Journal d'administration

Enregistrer les actions sensibles :
- Activation.
- Suspension.
- Changement d'offre.
- Modification des paramètres critiques.
- Actions de support nécessitant une intervention.

---

# 15. Architecture technique

## 15.1. Stack retenue

Architecture principale :

- **Backend :** Laravel.
- **Frontend :** React.
- **Intégration :** Inertia.js.
- **Style :** Tailwind CSS.
- **Build :** Vite.
- **Base de données :** MySQL.

## 15.2. Architecture générale

Un seul projet Laravel organisé en monolithe modulaire.

Laravel prend en charge :
- Routes.
- Authentification.
- Autorisations.
- Validation.
- Logique métier.
- Accès aux données.
- Sécurité.
- Gestion des fichiers.
- Tâches planifiées.

React prend en charge :
- Interfaces.
- Composants.
- Navigation côté interface.
- Interactions.
- Formulaires.
- États visuels.

Inertia.js assure la communication entre Laravel et React sans imposer une API séparée pour le MVP.

Vite assure le traitement et la compilation des ressources frontend.

## 15.3. Organisation indicative

```text
app/
  Models/
  Http/
    Controllers/
    Middleware/
    Requests/
  Policies/
  Services/
  Jobs/
  Notifications/

database/
  migrations/
  seeders/
  factories/

resources/
  js/
    Components/
    Layouts/
    Pages/
      Storefront/
      Merchant/
      Platform/
    Hooks/
  css/

routes/
  web.php
  console.php

tests/
  Feature/
  Unit/
```

La structure définitive doit rester cohérente avec les conventions Laravel et éviter les abstractions inutiles.

## 15.4. Principes

- Code modulaire.
- Responsabilités séparées.
- Logique métier côté serveur.
- Validation centralisée.
- Transactions pour les opérations sensibles.
- Réutilisation des composants.
- Tests automatisés.
- Pas de microservices au lancement.
- Pas de backend séparé uniquement pour le frontend.

Une API pourra être ajoutée ultérieurement si une application mobile ou des intégrations externes le nécessitent.

---

# 16. Architecture multi-boutiques et isolation des données

L'isolation des données est une exigence fondamentale.

Une boutique ne doit jamais pouvoir consulter, modifier ou supprimer les données d'une autre boutique.

## 16.1. Modèle retenu

Une base de données MySQL partagée.

Les données appartenant à une boutique portent un identifiant `store_id`.

Les utilisateurs peuvent posséder plusieurs boutiques.

Le MVP ne prévoit pas encore de gestion avancée d'équipes et de collaborateurs par boutique.

## 16.2. Contrôles obligatoires

- Middleware de contexte boutique.
- Policies Laravel.
- Scopes de requêtes.
- Validation des relations.
- Vérification des permissions côté serveur.
- Contrôle des identifiants reçus.
- Tests d'isolation entre boutiques.

Masquer un bouton dans React ne constitue jamais une mesure de sécurité.

Toutes les vérifications d'autorisation doivent être effectuées côté serveur.

---

# 17. Modèle de données prévisionnel

Les principales entités sont :

| Entité | Responsabilité |
|---|---|
| users | Comptes utilisateurs |
| stores | Boutiques |
| store_settings | Paramètres des boutiques |
| plans | Offres SaaS |
| subscriptions | Abonnements |
| categories | Catégories |
| products | Produits |
| product_images | Images |
| product_options | Types d'options |
| product_option_values | Valeurs des options |
| product_variants | Variantes et stocks |
| inventory_movements | Mouvements de stock |
| customers | Clients |
| orders | Commandes |
| order_items | Lignes de commande |
| order_status_histories | Historique des statuts |
| delivery_zones | Zones de livraison |
| media | Fichiers et médias |
| audit_logs | Journal des actions sensibles |

Les relations doivent être conçues avec des clés étrangères et des contraintes cohérentes.

Les tables appartenant à une boutique doivent être isolées par `store_id`.

Les relations entre produits, catégories, variantes et commandes doivent vérifier que tous les éléments appartiennent à la même boutique.

Les montants sont stockés en entiers XOF, sans calcul monétaire en nombres flottants.

Les suppressions doivent respecter l'historique commercial. Les produits utilisés dans des commandes passées ne doivent pas faire disparaître les informations historiques.

---

# 18. Navigation et routes

## 18.1. Boutique publique

```text
/{storeSlug}
/{storeSlug}/categories/{categorySlug}
/{storeSlug}/products/{productSlug}
/{storeSlug}/cart
/{storeSlug}/checkout
/{storeSlug}/order-confirmation/{token}
```

## 18.2. Authentification

```text
/register
/login
/forgot-password
/reset-password
/verify-email
```

## 18.3. Espace commerçant

```text
/merchant
/merchant/stores
/merchant/stores/create
/merchant/dashboard
/merchant/products
/merchant/products/create
/merchant/categories
/merchant/orders
/merchant/orders/{order}
/merchant/customers
/merchant/inventory
/merchant/analytics
/merchant/customization
/merchant/delivery
/merchant/subscription
/merchant/settings
```

La sélection de boutique doit être explicite lorsque le compte en possède plusieurs.

## 18.4. Administration

```text
/platform
/platform/dashboard
/platform/merchants
/platform/stores
/platform/subscriptions
/platform/plans
/platform/audit-logs
/platform/settings
```

Toutes les routes privées doivent être protégées par authentification et autorisations appropriées.

---

# 19. Sécurité

La sécurité doit être intégrée dès la conception.

Exigences :
- Hachage sécurisé des mots de passe.
- Protection CSRF.
- Validation serveur de toutes les entrées.
- Protection contre les injections SQL.
- Échappement des contenus affichés.
- Protection contre les accès non autorisés.
- Limitation des tentatives de connexion.
- Contrôle des fichiers téléversés.
- Vérification des permissions sur chaque ressource.
- Protection des références de commandes.
- Journalisation des actions sensibles.
- Gestion sécurisée des sessions.
- HTTPS obligatoire en production.
- Secrets et identifiants hors du dépôt Git.

Les prix, stocks, frais et totaux sont recalculés côté serveur.

Le navigateur ne constitue jamais une source de vérité pour les opérations commerciales.

Les opérations de commande et de stock doivent être transactionnelles.

---

# 20. Performance, responsive et accessibilité

La plateforme doit fonctionner correctement sur :
- Smartphones Android.
- iPhone.
- Tablettes.
- Ordinateurs portables.
- Écrans de bureau.

Priorité à l'expérience mobile, car une partie importante des commerçants et clients utilisera un téléphone.

Exigences :
- Images optimisées.
- Chargement différé lorsque pertinent.
- Pagination des listes.
- Requêtes optimisées.
- Composants réutilisables.
- États de chargement.
- États vides.
- Messages d'erreur clairs.
- Contrastes lisibles.
- Navigation clavier raisonnable.
- Libellés accessibles.
- Tailles de boutons adaptées au tactile.

L'interface doit rester rapide même lorsque le catalogue ou l'historique des commandes grandit.

---

# 21. Référencement et visibilité

Chaque boutique doit pouvoir être référencée individuellement.

Prévoir :
- Titres personnalisés.
- Meta descriptions.
- URLs lisibles.
- Balises canoniques.
- Sitemap adapté.
- Open Graph.
- Images de partage.
- Données structurées pertinentes lorsque possible.
- Pages publiques indexables.
- Pages privées exclues de l'indexation.

La stratégie de rendu des pages publiques doit être compatible avec le référencement. Le rendu serveur Inertia doit être évalué et intégré si l'environnement d'hébergement le permet. À défaut, une stratégie de pré-rendu adaptée devra être retenue.

Ne jamais exposer dans les moteurs de recherche les données privées des clients, commandes ou espaces commerçants.

---

# 22. Direction artistique et système UI

## 22.1. Référence visuelle

Direction inspirée de la référence Refero fournie : **« Shop — Floating shopping constellation on white marble »**.

L'objectif est de créer une interface lumineuse, élégante, moderne, aérée et haut de gamme, adaptée au commerce en ligne.

La référence sert de direction artistique, pas de copie pixel par pixel.

## 22.2. Palette principale de NOOR SHOP

| Usage | Couleur |
|---|---|
| Fond principal | `#F2F4F5` |
| Surface / cartes | `#FFFFFF` |
| Texte principal | `#171717` |
| Texte secondaire | `#787574` |
| Bordures discrètes | `#EBEBEB` |
| Accent plateforme | `#5433EB` |
| Accent doux | `#C0B5F3` |

L'accent violet est réservé aux éléments importants de la plateforme : identité NOOR SHOP, actions principales et repères de navigation.

Chaque commerçant peut choisir une couleur principale pour sa propre boutique, dans les limites du système UI.

La personnalisation d'une boutique ne doit pas modifier l'identité visuelle de l'espace d'administration NOOR SHOP.

## 22.3. Typographie

Police privilégiée : GT Standard si la licence et les conditions d'utilisation le permettent.

Solution de remplacement : Inter, puis polices système.

Hiérarchie indicative :
- 11–12 px : légendes et métadonnées.
- 14 px : textes secondaires.
- 16 px : texte courant.
- 20 px : titres secondaires.
- 28–40 px : titres principaux selon le contexte.

Utiliser une hiérarchie cohérente et éviter les tailles excessives.

## 22.4. Formes et composants

- Cartes avec rayon généreux, autour de 28 px.
- Boutons arrondis en forme de pilule.
- Champs de recherche et de saisie arrondis.
- Bordures discrètes.
- Ombres légères.
- Espacements généreux.
- Photos de produits mises en valeur.
- Grilles régulières.
- Icônes simples et cohérentes.

Éviter :
- Les dégradés décoratifs.
- Les effets 3D gratuits.
- Les illustrations génériques.
- Les ombres excessives.
- Les interfaces surchargées.
- Les couleurs concurrentes de l'accent principal.
- L'apparence générique d'un tableau de bord généré automatiquement.

## 22.5. Photos et visuels

La boutique publique doit mettre en avant les photographies réelles des produits.

Les images doivent être :
- Nettes.
- Cohérentes.
- Bien cadrées.
- Adaptées aux différents formats.
- Optimisées pour le web.

Les visuels de démonstration peuvent être utilisés dans les maquettes, mais doivent être identifiés comme données fictives.

## 22.6. Mise en page

- Largeur de contenu desktop indicative : 1200 px.
- Rail latéral d'administration compact.
- Navigation mobile adaptée.
- Grilles produits responsives.
- Espacements généreux entre les sections.
- Contrôles tactiles suffisamment grands.

---

# 23. Écrans obligatoires pour la conception frontend

La conception ne doit pas se limiter à la page d'accueil.

## A. Site public NOOR SHOP

1. Page de présentation de la plateforme.
2. Page de connexion.
3. Page d'inscription.
4. Page de réinitialisation du mot de passe.

## B. Boutique publique

5. Accueil de boutique.
6. Liste des catégories.
7. Catalogue.
8. Résultats de recherche.
9. Fiche produit.
10. Panier.
11. Formulaire de commande.
12. Confirmation de commande.
13. Page de boutique introuvable ou suspendue.

## C. Espace commerçant

14. Tableau de bord.
15. Sélection de boutique.
16. Liste des produits.
17. Création de produit.
18. Modification de produit.
19. Gestion des variantes.
20. Liste des catégories.
21. Création et modification de catégorie.
22. Liste des commandes.
23. Détail d'une commande.
24. Gestion des clients.
25. Gestion des stocks.
26. Historique des mouvements de stock.
27. Statistiques.
28. Personnalisation de boutique.
29. Aperçu de boutique.
30. Configuration de livraison.
31. Abonnement et offre.
32. Paramètres du compte.
33. Paramètres de boutique.

## D. Administration NOOR SHOP

34. Tableau de bord global.
35. Liste des commerçants.
36. Détail d'un commerçant.
37. Liste des boutiques.
38. Détail d'une boutique.
39. Gestion des abonnements.
40. Gestion des offres.
41. Journal d'activité.
42. Paramètres de plateforme.

## E. États et variantes d'interface

Pour chaque écran concerné, prévoir :
- État normal.
- État de chargement.
- État vide.
- État d'erreur.
- État de réussite.
- État désactivé.
- État sans permission.
- État responsive mobile.
- État responsive tablette.

Les modales de confirmation doivent être conçues pour les actions sensibles : suppression, archivage, annulation, suspension et changement de statut.

---

# 24. Règles UX essentielles

1. Le commerçant doit comprendre immédiatement où il se trouve.
2. Les actions importantes doivent être visibles et compréhensibles.
3. Les opérations fréquentes doivent demander le moins d'étapes possible.
4. Les formulaires doivent être organisés par sections logiques.
5. Les erreurs doivent expliquer comment les corriger.
6. Les opérations sensibles doivent demander confirmation.
7. Les tableaux doivent être utilisables sur mobile.
8. Les interfaces ne doivent jamais afficher de données inventées comme si elles étaient réelles.
9. Les changements de boutique doivent être visibles pour éviter toute confusion.
10. La navigation doit rester cohérente entre les pages.

---

# 25. Données de démonstration

Les maquettes peuvent utiliser une boutique fictive spécialisée dans les vêtements, chaussures et accessoires.

Exemples de données :
- Catégories : Vêtements, Chaussures, Accessoires.
- Produits avec tailles et couleurs.
- Commandes dans différents statuts.
- Quelques clients fictifs.
- Indicateurs de démonstration clairement identifiés.

Ces données ne doivent pas être confondues avec les données réelles de production.

Prévoir une boutique de démonstration permettant de comprendre rapidement le fonctionnement du produit.

---

# 26. Tests et critères de qualité

## 26.1. Tests fonctionnels

Vérifier :
- Inscription.
- Connexion.
- Vérification e-mail.
- Création de boutique.
- Création de produit.
- Gestion des catégories.
- Gestion des variantes.
- Gestion des stocks.
- Ajout au panier.
- Commande.
- Confirmation.
- Modification des statuts.
- Gestion des abonnements.
- Suspension d'une boutique.

## 26.2. Tests de sécurité

Vérifier notamment :
- Un commerçant ne peut pas consulter les données d'une autre boutique.
- Un utilisateur non autorisé ne peut pas accéder à l'administration.
- Un client ne peut pas consulter une commande privée sans jeton valide.
- Un prix modifié dans le navigateur ne modifie pas le prix serveur.
- Une quantité supérieure au stock ne peut pas être commandée.
- Une réservation expirée ne peut pas être libérée plusieurs fois.
- Une commande ne peut pas être traitée deux fois par des requêtes concurrentes.
- Les fichiers envoyés sont contrôlés.

## 26.3. Tests d'interface

Vérifier :
- Responsive.
- Navigation.
- Formulaires.
- États vides.
- États de chargement.
- Messages d'erreur.
- Modales.
- Accessibilité.
- Cohérence graphique.

---

# 27. Périmètre exclu du MVP

Pour préserver la simplicité et accélérer la première mise en production, les fonctionnalités suivantes ne sont pas incluses au lancement :

- Marketplace multi-vendeurs.
- Paiement en ligne automatisé.
- Application mobile native.
- Comptabilité complète.
- Gestion avancée des fournisseurs.
- Gestion multi-entrepôts.
- Constructeur libre de pages.
- Domaines personnalisés.
- Programme de fidélité avancé.
- Automatisations marketing complexes.
- Intégrations logistiques avancées.
- Gestion avancée des collaborateurs.
- Synchronisation avec des marketplaces externes.

Ces fonctionnalités pourront être étudiées dans des versions ultérieures.

---

# 28. Phases du projet

## Phase 1 — Conception frontend

Objectif : produire l'ensemble des interfaces et des parcours avant le développement métier.

Livrables :
- Direction artistique.
- Design system.
- Navigation complète.
- Tous les écrans définis dans ce cahier des charges.
- Responsive desktop, tablette et mobile.
- Composants réutilisables.
- États de chargement, vides, erreurs et succès.
- Prototype navigable.
- Données fictives cohérentes.

Aucun développement backend métier ne doit commencer pendant cette phase.

## Phase 2 — Fondations techniques

- Initialisation Laravel.
- Installation React, Inertia, Tailwind et Vite.
- Configuration MySQL.
- Authentification.
- Rôles et permissions.
- Modèle multi-boutiques.
- Isolation des données.
- Tests de base.

## Phase 3 — Gestion commerciale

- Boutiques.
- Catégories.
- Produits.
- Images.
- Variantes.
- Stocks.
- Mouvements de stock.

## Phase 4 — Vente en ligne

- Boutique publique.
- Catalogue.
- Recherche.
- Panier.
- Commandes.
- Réservations de stock.
- Livraison et retrait.
- Confirmation et suivi.

## Phase 5 — Administration SaaS

- Tableau de bord global.
- Gestion des commerçants.
- Gestion des boutiques.
- Offres et abonnements.
- Suspension et activation.
- Journal d'activité.

## Phase 6 — Stabilisation et lancement

- Tests complets.
- Sécurité.
- Performance.
- SEO.
- Sauvegardes.
- Déploiement.
- Documentation.
- Mise en production.

---

# 29. Critères d'acceptation de la conception frontend

La phase frontend est considérée comme terminée lorsque :

1. Tous les écrans prévus sont conçus.
2. Les trois espaces sont clairement différenciés.
3. Les parcours principaux sont navigables.
4. Les interfaces desktop et mobile sont cohérentes.
5. Le système de composants est réutilisable.
6. Les états vides, erreurs, chargements et réussites sont prévus.
7. Les formulaires correspondent aux règles métier.
8. Les tableaux et filtres sont représentés.
9. Les trois modèles de boutique sont présentés.
10. Les interactions principales du prototype fonctionnent.
11. La direction artistique est cohérente avec la référence retenue.
12. Aucun écran essentiel n'est laissé à l'improvisation pendant le développement.

La conception doit représenter un véritable produit SaaS, pas une simple collection de pages statiques.

---

# 30. Exigences de livraison et de qualité

Le projet doit être :
- Maintenable.
- Évolutif.
- Sécurisé.
- Responsive.
- Cohérent.
- Testable.
- Documenté.

Le code ne doit pas être construit autour de données fictives ou de composants provisoires difficiles à remplacer.

Les règles métier doivent être documentées avant leur implémentation.

Les fonctionnalités hors MVP ne doivent pas être ajoutées sans décision explicite.

Les prix, limites commerciales et paramètres d'abonnement doivent être configurables.

Les obligations légales applicables à la collecte, au traitement et à la conservation des données devront être vérifiées avant la mise en production. Ce cahier des charges ne constitue pas une certification juridique ou réglementaire.

---

# 31. Décisions finales de référence

Les décisions suivantes sont fixées pour le MVP :

| Sujet | Décision |
|---|---|
| Produit | NOOR SHOP |
| Positionnement | SaaS de boutiques indépendantes |
| Marché initial | Sénégal |
| Langue | Français |
| Devise | XOF |
| Comptes | Un compte peut gérer plusieurs boutiques |
| Premier parcours | Création d'une première boutique |
| Inscription | E-mail et mot de passe |
| Vérification e-mail | Obligatoire avant publication |
| Commandes | Sans compte client obligatoire |
| Téléphone client | Obligatoire |
| Paiement | À la livraison ou au retrait |
| Paiement automatisé | Exclu du MVP |
| Livraison | Zones simples et tarifs fixes |
| Modèles | Trois modèles |
| Variantes | Tailles, couleurs et combinaisons |
| Stock | Géré par variante |
| Réservation | À la création de commande, pendant deux heures |
| Confirmation | Transformation de la réservation en sortie définitive |
| Abonnements | Activation manuelle |
| Essai | 14 jours |
| Période de grâce | 7 jours |
| Architecture | Laravel + Inertia.js + React + Tailwind + Vite + MySQL |
| Organisation | Monolithe modulaire |
| Multi-tenant | Base partagée, isolation stricte par boutique |
| Interface | Mobile-first |
| Conception | Frontend complet avant backend métier |

---

# Conclusion

NOOR SHOP doit devenir une plateforme commerciale sérieuse, intuitive et évolutive, capable de permettre à un commerçant de créer sa boutique et de gérer son activité sans dépendre de compétences techniques.

La priorité est de construire une expérience utilisateur solide, avec une identité visuelle distinctive, une navigation claire et des parcours commerciaux complets.

**Ce document constitue la référence fonctionnelle, technique et UX/UI du MVP.**

La prochaine étape est exclusivement la conception frontend complète : direction artistique, design system, pages publiques, espace commerçant, administration, responsive et prototype navigable.

Le développement backend métier ne commence qu'après validation globale de cette conception.

**NOOR SHOP — Une boutique professionnelle, simplement.**
<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

/**
 * Seeds the three SaaS offers defined in the cahier des charges §13.1.
 * Prices are integer XOF; features stay faithful to the marketing copy.
 */
class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'slug' => 'decouverte',
                'name' => 'Découverte',
                'tagline' => 'Démarrer votre activité en ligne.',
                'price_xof' => 0,
                'max_stores' => 1,
                'max_products' => 30,
                'max_users' => 1,
                'features' => [
                    '1 boutique active',
                    "Jusqu'à 30 produits",
                    '1 utilisateur',
                    '3 catégories',
                    'Modèles standards',
                    'Support e-mail sous 48 h',
                ],
                'sort_order' => 10,
                'is_highlighted' => false,
            ],
            [
                'slug' => 'pro',
                'name' => 'Pro',
                'tagline' => 'Pour un commerce en croissance.',
                'price_xof' => 14900,
                'max_stores' => 3,
                'max_products' => null,
                'max_users' => 3,
                'features' => [
                    "Jusqu'à 3 boutiques",
                    'Produits illimités',
                    '3 utilisateurs',
                    'Catégories illimitées',
                    'Les 3 modèles premium',
                    'Statistiques détaillées',
                    'Support prioritaire sous 24 h',
                ],
                'sort_order' => 20,
                'is_highlighted' => true,
            ],
            [
                'slug' => 'business',
                'name' => 'Business',
                'tagline' => 'Pour les activités multi-points de vente.',
                'price_xof' => 34900,
                'max_stores' => null,
                'max_products' => null,
                'max_users' => null,
                'features' => [
                    'Boutiques illimitées',
                    'Produits illimités',
                    'Utilisateurs illimités',
                    'Zones de livraison avancées',
                    'Rapports exportables',
                    'Support dédié 7j/7',
                ],
                'sort_order' => 30,
                'is_highlighted' => false,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}

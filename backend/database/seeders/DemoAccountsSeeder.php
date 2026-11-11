<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Store;
use App\Models\StoreSetting;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds one platform admin and one demo merchant with a store.
 * Only used in local/dev; passwords are placeholders and MUST NOT be
 * promoted to production.
 */
class DemoAccountsSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Platform admin
        User::updateOrCreate(
            ['email' => 'admin@noor.shop'],
            [
                'name' => 'Platform admin',
                'password' => Hash::make('password'),
                'role' => User::ROLE_PLATFORM_ADMIN,
                'email_verified_at' => now(),
            ]
        );

        // 2) Demo merchant + a demo store with Marble theme
        $merchant = User::updateOrCreate(
            ['email' => 'merchant@noor.shop'],
            [
                'name' => 'Maam Couture',
                'phone' => '+221 77 123 45 67',
                'password' => Hash::make('password'),
                'role' => User::ROLE_MERCHANT,
                'email_verified_at' => now(),
            ]
        );

        $store = Store::updateOrCreate(
            ['slug' => 'maam-couture'],
            [
                'owner_user_id' => $merchant->id,
                'name' => 'Maam Couture',
                'description' => 'Prêt-à-porter féminin inspiré du wax contemporain, taillé à Dakar.',
                'theme' => Store::THEME_MARBLE,
                'accent_color' => '#5433EB',
                'logo_text' => 'MC',
                'phone' => '+221 77 123 45 67',
                'city' => 'Dakar',
                'address' => 'SICAP Liberté 6, Dakar',
                'status' => Store::STATUS_ACTIVE,
            ]
        );

        StoreSetting::updateOrCreate(
            ['store_id' => $store->id],
            [
                'home_sections' => ['hero', 'featured_categories', 'bestsellers', 'editorial'],
                'home_sections_enabled' => ['hero', 'featured_categories', 'bestsellers'],
                'instagram_handle' => '@maam.couture',
                'facebook_handle' => 'MaamCoutureDakar',
            ]
        );

        // Attach a Pro trial subscription to the demo merchant
        $pro = Plan::where('slug', 'pro')->first();
        if ($pro) {
            Subscription::updateOrCreate(
                ['user_id' => $merchant->id, 'plan_id' => $pro->id],
                [
                    'status' => Subscription::STATUS_TRIAL,
                    'trial_ends_at' => now()->addDays(14),
                    'started_at' => now(),
                ]
            );
        }
    }
}

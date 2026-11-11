<?php

namespace Tests\Feature\Merchant;

use App\Models\Order;
use App\Models\Plan;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreCrudTest extends TestCase
{
    use RefreshDatabase;

    private function merchant(array $overrides = []): User
    {
        return User::factory()->create(array_merge([
            'role' => User::ROLE_MERCHANT,
            'email_verified_at' => now(),
        ], $overrides));
    }

    public function test_merchant_can_create_their_first_store_without_subscription(): void
    {
        $user = $this->merchant();

        $this->actingAs($user)
            ->post('/merchant/stores', [
                'name' => 'Ma boutique',
                'theme' => Store::THEME_MARBLE,
                'accent_color' => '#5433EB',
            ])
            ->assertRedirect('/merchant/stores');

        $this->assertDatabaseHas('stores', [
            'owner_user_id' => $user->id,
            'name' => 'Ma boutique',
            'slug' => 'ma-boutique',
            'theme' => 'marble',
        ]);
    }

    public function test_second_store_is_blocked_without_subscription(): void
    {
        $user = $this->merchant();
        Store::factory()->for($user, 'owner')->create();

        $this->actingAs($user)
            ->post('/merchant/stores', [
                'name' => 'Deuxième',
                'theme' => Store::THEME_MARBLE,
                'accent_color' => '#5433EB',
            ])
            ->assertSessionHasErrors('subscription');

        $this->assertSame(1, $user->fresh()->stores()->count());
    }

    public function test_plan_max_stores_quota_enforced(): void
    {
        $user = $this->merchant();
        $plan = Plan::create([
            'slug' => 'pro', 'name' => 'Pro', 'price_xof' => 14900,
            'max_stores' => 3, 'features' => [], 'sort_order' => 10,
        ]);
        Subscription::create([
            'user_id' => $user->id, 'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'started_at' => now(), 'ends_at' => now()->addMonth(),
        ]);
        Store::factory()->count(3)->for($user, 'owner')->create();

        $this->actingAs($user)
            ->post('/merchant/stores', [
                'name' => 'Quatrième',
                'theme' => Store::THEME_MARBLE,
                'accent_color' => '#5433EB',
            ])
            ->assertSessionHasErrors('subscription');
    }

    public function test_merchant_can_update_their_own_store(): void
    {
        $user = $this->merchant();
        $store = Store::factory()->for($user, 'owner')->create(['name' => 'Ancien']);

        $this->actingAs($user)
            ->put("/merchant/stores/{$store->slug}", [
                'name' => 'Nouveau',
                'theme' => Store::THEME_EDITORIAL,
                'accent_color' => '#000000',
            ])
            ->assertRedirect();

        $store->refresh();
        $this->assertSame('Nouveau', $store->name);
        $this->assertSame('editorial', $store->theme);
    }

    public function test_merchant_cannot_update_another_merchants_store(): void
    {
        $m1 = $this->merchant();
        $m2 = $this->merchant();
        $foreign = Store::factory()->for($m2, 'owner')->create(['name' => 'Foreign']);

        $response = $this->actingAs($m1)
            ->put("/merchant/stores/{$foreign->slug}", [
                'name' => 'Pwned', 'theme' => 'marble', 'accent_color' => '#000000',
            ]);

        $this->assertTrue(in_array($response->status(), [403, 404], true));
        $this->assertSame('Foreign', $foreign->fresh()->name);
    }

    public function test_store_with_orders_cannot_be_deleted(): void
    {
        $user = $this->merchant();
        $store = Store::factory()->for($user, 'owner')->create();
        Order::create([
            'store_id' => $store->id, 'reference' => 'NS-T-0001',
            'token' => str_repeat('a', 40), 'status' => 'pending',
            'customer_name' => 'X', 'customer_phone' => '+22177',
            'delivery_mode' => 'pickup', 'subtotal_xof' => 1000, 'total_xof' => 1000,
        ]);

        $this->actingAs($user)
            ->delete("/merchant/stores/{$store->slug}")
            ->assertSessionHasErrors('store');

        $this->assertDatabaseHas('stores', ['id' => $store->id, 'deleted_at' => null]);
    }
}

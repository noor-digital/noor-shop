<?php

namespace Tests\Feature\Storefront;

use App\Models\Plan;
use App\Models\Product;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutBlockingTest extends TestCase
{
    use RefreshDatabase;

    private function storeWithSubscription(string $status): array
    {
        $user = User::factory()->create(['role' => User::ROLE_MERCHANT, 'email_verified_at' => now()]);
        $store = Store::factory()->for($user, 'owner')->create();
        $product = Product::factory()->for($store)->create(['status' => Product::STATUS_PUBLISHED, 'stock' => 10, 'price_xof' => 10000]);
        $plan = Plan::create(['slug' => 'pro', 'name' => 'Pro', 'price_xof' => 14900, 'features' => [], 'sort_order' => 10]);
        Subscription::create([
            'user_id' => $user->id, 'plan_id' => $plan->id,
            'status' => $status,
            'trial_ends_at' => now()->addDays(14),
        ]);
        return [$store, $product];
    }

    public function test_checkout_refused_when_subscription_expired(): void
    {
        [$store, $product] = $this->storeWithSubscription(Subscription::STATUS_EXPIRED);

        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'A', 'phone' => '+22177', 'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertStatus(403);
    }

    public function test_checkout_refused_when_subscription_cancelled(): void
    {
        [$store, $product] = $this->storeWithSubscription(Subscription::STATUS_CANCELLED);

        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'A', 'phone' => '+22177', 'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertStatus(403);
    }

    public function test_checkout_allowed_during_grace_period(): void
    {
        [$store, $product] = $this->storeWithSubscription(Subscription::STATUS_GRACE);

        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'A', 'phone' => '+22177', 'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertRedirect();
    }

    public function test_order_status_change_writes_audit_log(): void
    {
        $user = User::factory()->create(['role' => User::ROLE_MERCHANT, 'email_verified_at' => now()]);
        $store = Store::factory()->for($user, 'owner')->create();
        $product = Product::factory()->for($store)->create(['status' => Product::STATUS_PUBLISHED, 'stock' => 10, 'price_xof' => 10000]);

        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'A', 'phone' => '+22177', 'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertRedirect();
        $order = \App\Models\Order::firstOrFail();

        $this->actingAs($user)
            ->post("/merchant/orders/{$order->id}/transition", ['to' => 'confirmed', 'note' => 'Manuel'])
            ->assertRedirect();

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'order.status_changed',
            'target_type' => 'order',
            'target_id' => $order->id,
            'actor_user_id' => $user->id,
        ]);
    }
}

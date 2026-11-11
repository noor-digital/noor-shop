<?php

namespace Tests\Feature\Merchant;

use App\Models\DeliveryZone;
use App\Models\InventoryMovement;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Services\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private function store(int $stock = 10): array
    {
        $user = User::factory()->create([
            'role' => User::ROLE_MERCHANT,
            'email_verified_at' => now(),
        ]);
        $store = Store::factory()->for($user, 'owner')->create();
        $product = Product::factory()->for($store)->create([
            'stock' => $stock,
            'price_xof' => 10000,
            'status' => Product::STATUS_PUBLISHED,
        ]);
        $zone = DeliveryZone::factory()->for($store)->create(['fee_xof' => 2000]);
        return [$user, $store, $product, $zone];
    }

    public function test_public_checkout_creates_order_and_reserves_stock(): void
    {
        [, $store, $product, $zone] = $this->store(stock: 5);

        $response = $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'Awa Diop',
            'phone' => '+22177 123 45 67',
            'mode' => 'delivery',
            'delivery_zone_id' => $zone->id,
            'delivery_address' => 'Liberté 6',
            'lines' => [['product_id' => $product->id, 'quantity' => 2]],
        ]);
        $response->assertRedirect();

        $this->assertDatabaseCount('orders', 1);
        $order = Order::firstOrFail();
        $this->assertSame(Order::STATUS_PENDING, $order->status);
        $this->assertSame(22000, $order->total_xof); // 2×10000 + 2000
        $this->assertNotNull($order->stock_reserved_at);

        $this->assertDatabaseHas('inventory_movements', [
            'order_id' => $order->id,
            'type' => InventoryMovement::TYPE_RESERVATION,
            'quantity_delta' => -2,
        ]);
    }

    public function test_second_checkout_fails_when_stock_already_reserved(): void
    {
        [, $store, $product, $zone] = $this->store(stock: 3);

        // 1st order reserves 2.
        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'A', 'phone' => '+22177000',
            'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 2]],
        ])->assertRedirect();

        // 2nd order needs 2 but only 1 is available.
        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'B', 'phone' => '+22177111',
            'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 2]],
        ])->assertSessionHasErrors('cart');

        $this->assertDatabaseCount('orders', 1);
    }

    public function test_illegal_transition_is_rejected(): void
    {
        [$user, $store, $product] = $this->store();
        $order = Order::create([
            'store_id' => $store->id,
            'reference' => 'NS-T-0001',
            'token' => str_repeat('a', 40),
            'status' => Order::STATUS_PENDING,
            'customer_name' => 'X', 'customer_phone' => '+22177',
            'delivery_mode' => 'pickup',
            'subtotal_xof' => 10000, 'total_xof' => 10000,
        ]);

        // pending → completed is NOT allowed (must go through confirmed→preparing→ready first).
        $this->actingAs($user)
            ->post("/merchant/orders/{$order->id}/transition", ['to' => 'completed'])
            ->assertSessionHasErrors('transition');

        $this->assertSame(Order::STATUS_PENDING, $order->fresh()->status);
    }

    public function test_cancelling_an_order_releases_stock_exactly_once(): void
    {
        [$user, $store, $product, $zone] = $this->store(stock: 5);

        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'A', 'phone' => '+22177000', 'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 2]],
        ])->assertRedirect();
        $order = Order::firstOrFail();

        // Cancel via merchant transition.
        $this->actingAs($user)
            ->post("/merchant/orders/{$order->id}/transition", ['to' => 'cancelled', 'note' => 'Client change'])
            ->assertRedirect();

        $order->refresh();
        $this->assertSame(Order::STATUS_CANCELLED, $order->status);
        $this->assertNotNull($order->stock_released_at);
        $firstRelease = $order->stock_released_at;

        $releases = InventoryMovement::where('order_id', $order->id)
            ->where('type', InventoryMovement::TYPE_RELEASE)
            ->count();
        $this->assertSame(1, $releases);

        // Direct second release call via service is a no-op (idempotent).
        app(StockService::class)->releaseForOrder($order->fresh(), 'duplicate call');
        $this->assertSame(1, InventoryMovement::where('order_id', $order->id)
            ->where('type', InventoryMovement::TYPE_RELEASE)->count());
        $this->assertEquals($firstRelease->toIso8601String(), $order->fresh()->stock_released_at?->toIso8601String());

        // Stock column stays at 5 (release doesn't decrement the real stock).
        $this->assertSame(5, $product->fresh()->stock);
    }

    public function test_completed_order_consumes_stock_and_updates_customer_aggregates(): void
    {
        [$user, $store, $product, $zone] = $this->store(stock: 5);

        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'Awa', 'phone' => '+22177000', 'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 2]],
        ])->assertRedirect();
        $order = Order::firstOrFail();

        foreach (['confirmed', 'preparing', 'ready', 'completed'] as $to) {
            $this->actingAs($user)
                ->post("/merchant/orders/{$order->id}/transition", ['to' => $to])
                ->assertRedirect();
        }

        $order->refresh();
        $this->assertSame(Order::STATUS_COMPLETED, $order->status);
        $this->assertNotNull($order->stock_consumed_at);
        // Real stock decremented from 5 → 3.
        $this->assertSame(3, $product->fresh()->stock);

        $customer = $order->customer;
        $this->assertSame(1, $customer->orders_count);
        $this->assertSame($order->total_xof, $customer->total_spent_xof);
    }

    public function test_expired_reservations_are_released_and_orders_cancelled(): void
    {
        [, $store, $product] = $this->store(stock: 5);

        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'A', 'phone' => '+22177000', 'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 3]],
        ])->assertRedirect();
        $order = Order::firstOrFail();

        // Age the reservation past the 2h window.
        $order->forceFill(['stock_reserved_at' => now()->subHours(3)])->save();

        $released = app(StockService::class)->releaseExpiredReservations();
        $this->assertSame(1, $released);

        $order->refresh();
        $this->assertSame(Order::STATUS_CANCELLED, $order->status);
        $this->assertNotNull($order->stock_released_at);
        $this->assertSame('Reservation expired (2h window).', $order->cancellation_reason);

        // A subsequent customer can now claim those 3 units again.
        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'B', 'phone' => '+22177111', 'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 3]],
        ])->assertRedirect();
        $this->assertDatabaseCount('orders', 2);
    }

    public function test_cross_store_order_access_is_refused(): void
    {
        [$m1, $s1, $p1, $z1] = $this->store();
        [$m2, $s2, $p2, $z2] = $this->store();

        // Place an order on store 2.
        $this->post("/boutique/{$s2->slug}/commande", [
            'name' => 'X', 'phone' => '+22177000', 'mode' => 'pickup',
            'lines' => [['product_id' => $p2->id, 'quantity' => 1]],
        ])->assertRedirect();
        $theirs = Order::firstOrFail();

        // Merchant 1 tries to read / mutate order of store 2.
        $show = $this->actingAs($m1)->get("/merchant/orders/{$theirs->id}");
        $this->assertTrue(in_array($show->status(), [403, 404], true), 'Expected refused.');

        $update = $this->actingAs($m1)
            ->post("/merchant/orders/{$theirs->id}/transition", ['to' => 'confirmed']);
        $this->assertTrue(in_array($update->status(), [403, 404], true), 'Expected refused.');
    }

    public function test_storefront_checkout_rejected_when_store_is_suspended(): void
    {
        [, $store, $product] = $this->store();
        $store->forceFill(['status' => Store::STATUS_SUSPENDED])->save();

        $this->post("/boutique/{$store->slug}/commande", [
            'name' => 'A', 'phone' => '+22177000', 'mode' => 'pickup',
            'lines' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertNotFound();
    }
}

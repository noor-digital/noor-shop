<?php

namespace Tests\Feature\Platform;

use App\Models\AuditLog;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuspendStoreTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => User::ROLE_PLATFORM_ADMIN,
            'email_verified_at' => now(),
        ]);
    }

    private function merchantWithStore(): array
    {
        $user = User::factory()->create([
            'role' => User::ROLE_MERCHANT,
            'email_verified_at' => now(),
        ]);
        $store = Store::factory()->for($user, 'owner')->create();
        return [$user, $store];
    }

    public function test_only_platform_admin_can_suspend_a_store(): void
    {
        [$merchant, $store] = $this->merchantWithStore();

        $this->actingAs($merchant)
            ->post("/platform/stores/{$store->id}/suspend", ['reason' => 'bogus'])
            ->assertForbidden();

        $this->assertSame(Store::STATUS_ACTIVE, $store->fresh()->status);
    }

    public function test_admin_suspend_requires_a_reason_and_writes_an_audit_entry(): void
    {
        $admin = $this->admin();
        [, $store] = $this->merchantWithStore();

        // No reason → validation error.
        $this->actingAs($admin)
            ->post("/platform/stores/{$store->id}/suspend", [])
            ->assertSessionHasErrors('reason');

        $this->actingAs($admin)
            ->post("/platform/stores/{$store->id}/suspend", ['reason' => 'Violation CGU'])
            ->assertRedirect();

        $this->assertSame(Store::STATUS_SUSPENDED, $store->fresh()->status);

        $log = AuditLog::firstOrFail();
        $this->assertSame('store.suspended', $log->action);
        $this->assertSame($admin->id, $log->actor_user_id);
        $this->assertSame('store', $log->target_type);
        $this->assertSame($store->id, $log->target_id);
        $this->assertSame('Violation CGU', $log->reason);
    }

    public function test_admin_can_reactivate_a_suspended_store(): void
    {
        $admin = $this->admin();
        [, $store] = $this->merchantWithStore();
        $store->forceFill(['status' => Store::STATUS_SUSPENDED])->save();

        $this->actingAs($admin)
            ->post("/platform/stores/{$store->id}/reactivate", [])
            ->assertRedirect();

        $this->assertSame(Store::STATUS_ACTIVE, $store->fresh()->status);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'store.reactivated',
            'target_id' => $store->id,
        ]);
    }

    public function test_suspended_store_is_404_on_public_checkout_but_merchant_still_sees_data(): void
    {
        [$merchant, $store] = $this->merchantWithStore();
        $product = Product::factory()->for($store)->create();
        $store->forceFill(['status' => Store::STATUS_SUSPENDED])->save();

        // Public: 404
        $this->get("/boutique/{$store->slug}/commande")->assertNotFound();

        // Merchant: can still log in and see the store's product list.
        $this->actingAs($merchant)->get('/merchant/products')->assertOk();
    }
}

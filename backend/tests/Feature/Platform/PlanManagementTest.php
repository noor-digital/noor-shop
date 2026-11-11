<?php

namespace Tests\Feature\Platform;

use App\Models\AuditLog;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => User::ROLE_PLATFORM_ADMIN,
            'email_verified_at' => now(),
        ]);
    }

    public function test_only_admin_can_update_a_plan(): void
    {
        $plan = Plan::create(['slug' => 'pro', 'name' => 'Pro', 'price_xof' => 14900, 'features' => [], 'sort_order' => 10]);
        $merchant = User::factory()->create(['role' => User::ROLE_MERCHANT, 'email_verified_at' => now()]);

        $this->actingAs($merchant)
            ->put("/platform/plans/{$plan->id}", ['name' => 'Hack', 'price_xof' => 1])
            ->assertForbidden();
    }

    public function test_admin_updates_plan_writes_audit_log(): void
    {
        $plan = Plan::create(['slug' => 'pro', 'name' => 'Pro', 'price_xof' => 14900, 'features' => [], 'sort_order' => 10]);

        $this->actingAs($this->admin())
            ->put("/platform/plans/{$plan->id}", [
                'name' => 'Pro Plus',
                'price_xof' => 19900,
                'max_stores' => 5,
                'features' => ['Feature A', 'Feature B'],
            ])
            ->assertRedirect();

        $this->assertSame('Pro Plus', $plan->fresh()->name);
        $this->assertSame(19900, $plan->fresh()->price_xof);
        $this->assertDatabaseHas('audit_logs', ['action' => 'plan.updated', 'target_id' => $plan->id]);
    }

    public function test_admin_can_change_merchant_plan_and_log_it(): void
    {
        $admin = $this->admin();
        $merchant = User::factory()->create(['role' => User::ROLE_MERCHANT]);
        $oldPlan = Plan::create(['slug' => 'decouverte', 'name' => 'Découverte', 'price_xof' => 0, 'features' => [], 'sort_order' => 10]);
        $newPlan = Plan::create(['slug' => 'pro', 'name' => 'Pro', 'price_xof' => 14900, 'features' => [], 'sort_order' => 20]);
        $sub = Subscription::create([
            'user_id' => $merchant->id, 'plan_id' => $oldPlan->id,
            'status' => Subscription::STATUS_TRIAL, 'trial_ends_at' => now()->addDays(14),
        ]);

        $this->actingAs($admin)
            ->post("/platform/subscriptions/{$sub->id}/change-plan", [
                'plan_id' => $newPlan->id,
                'reason' => 'Demande commerçant',
            ])
            ->assertRedirect();

        $sub->refresh();
        $this->assertSame($newPlan->id, $sub->plan_id);
        $this->assertSame(Subscription::STATUS_ACTIVE, $sub->status);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'subscription.plan_changed',
            'target_id' => $sub->id,
        ]);
    }

    public function test_admin_can_cancel_subscription_with_reason(): void
    {
        $admin = $this->admin();
        $merchant = User::factory()->create(['role' => User::ROLE_MERCHANT]);
        $plan = Plan::create(['slug' => 'pro', 'name' => 'Pro', 'price_xof' => 14900, 'features' => [], 'sort_order' => 10]);
        $sub = Subscription::create([
            'user_id' => $merchant->id, 'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
        ]);

        // Missing reason → error.
        $this->actingAs($admin)
            ->post("/platform/subscriptions/{$sub->id}/cancel", [])
            ->assertSessionHasErrors('reason');

        $this->actingAs($admin)
            ->post("/platform/subscriptions/{$sub->id}/cancel", ['reason' => 'Fraude détectée'])
            ->assertRedirect();

        $this->assertSame(Subscription::STATUS_CANCELLED, $sub->fresh()->status);
    }

    public function test_platform_merchants_list_returns_only_merchants(): void
    {
        $admin = $this->admin();
        $m1 = User::factory()->create(['role' => User::ROLE_MERCHANT, 'name' => 'Alice', 'email_verified_at' => now()]);
        $m2 = User::factory()->create(['role' => User::ROLE_MERCHANT, 'name' => 'Bob', 'email_verified_at' => now()]);
        User::factory()->create(['role' => User::ROLE_PLATFORM_ADMIN, 'email_verified_at' => now()]);

        $this->actingAs($admin)
            ->get('/platform/merchants')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('platform/merchants/index')
                ->has('merchants.data', 2)
            );
    }
}

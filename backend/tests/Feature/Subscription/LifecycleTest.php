<?php

namespace Tests\Feature\Subscription;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Services\SubscriptionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LifecycleTest extends TestCase
{
    use RefreshDatabase;

    private function merchant(): User
    {
        return User::factory()->create(['role' => User::ROLE_MERCHANT]);
    }

    private function plan(): Plan
    {
        return Plan::create([
            'slug' => 'pro', 'name' => 'Pro', 'price_xof' => 14900,
            'features' => ['test'], 'sort_order' => 10,
        ]);
    }

    public function test_trial_past_due_moves_to_grace_with_7_day_window(): void
    {
        $user = $this->merchant();
        $plan = $this->plan();
        $sub = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_TRIAL,
            'trial_ends_at' => now()->subHour(),
        ]);

        $counts = app(SubscriptionService::class)->advanceExpired();
        $this->assertSame(1, $counts['trialToGrace']);

        $sub->refresh();
        $this->assertSame(Subscription::STATUS_GRACE, $sub->status);
        $this->assertNotNull($sub->grace_ends_at);
        $this->assertTrue($sub->grace_ends_at->greaterThan(now()->addDays(6)));
    }

    public function test_active_past_due_moves_to_grace(): void
    {
        $user = $this->merchant();
        $plan = $this->plan();
        $sub = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'started_at' => now()->subMonth(),
            'ends_at' => now()->subMinutes(5),
        ]);

        $counts = app(SubscriptionService::class)->advanceExpired();
        $this->assertSame(1, $counts['activeToGrace']);
        $this->assertSame(Subscription::STATUS_GRACE, $sub->fresh()->status);
    }

    public function test_grace_past_due_moves_to_expired(): void
    {
        $user = $this->merchant();
        $plan = $this->plan();
        $sub = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_GRACE,
            'grace_ends_at' => now()->subDay(),
        ]);

        $counts = app(SubscriptionService::class)->advanceExpired();
        $this->assertSame(1, $counts['graceToExpired']);
        $this->assertSame(Subscription::STATUS_EXPIRED, $sub->fresh()->status);
    }

    public function test_still_in_trial_is_not_advanced(): void
    {
        $user = $this->merchant();
        $plan = $this->plan();
        $sub = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_TRIAL,
            'trial_ends_at' => now()->addDays(5),
        ]);

        $counts = app(SubscriptionService::class)->advanceExpired();
        $this->assertSame(0, $counts['trialToGrace']);
        $this->assertSame(Subscription::STATUS_TRIAL, $sub->fresh()->status);
    }

    public function test_cli_command_runs_and_reports_counts(): void
    {
        $user = $this->merchant();
        $plan = $this->plan();
        Subscription::create([
            'user_id' => $user->id, 'plan_id' => $plan->id,
            'status' => Subscription::STATUS_TRIAL,
            'trial_ends_at' => now()->subHour(),
        ]);

        $this->artisan('subscriptions:advance-expired')
            ->expectsOutputToContain('trial→grace: 1')
            ->assertSuccessful();
    }
}

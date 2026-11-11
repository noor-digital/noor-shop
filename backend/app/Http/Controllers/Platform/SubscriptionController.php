<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Subscription;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function __construct(private readonly AuditService $audit) {}

    public function index(Request $request): Response
    {
        $subscriptions = Subscription::query()
            ->with(['user:id,name,email', 'plan:id,slug,name,price_xof'])
            ->orderByDesc('created_at')
            ->paginate(50)
            ->through(fn (Subscription $s) => [
                'id' => $s->id,
                'status' => $s->status,
                'user' => $s->user?->only(['id', 'name', 'email']),
                'plan' => $s->plan?->only(['id', 'slug', 'name', 'price_xof']),
                'trial_ends_at' => $s->trial_ends_at?->toIso8601String(),
                'started_at' => $s->started_at?->toIso8601String(),
                'ends_at' => $s->ends_at?->toIso8601String(),
                'grace_ends_at' => $s->grace_ends_at?->toIso8601String(),
            ]);

        return Inertia::render('platform/subscriptions/index', [
            'subscriptions' => $subscriptions,
        ]);
    }

    public function changePlan(Request $request, Subscription $subscription): RedirectResponse
    {
        $data = $request->validate([
            'plan_id' => ['required', 'integer', Rule::exists('plans', 'id')],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $newPlan = Plan::findOrFail($data['plan_id']);
        $before = $subscription->plan?->slug;

        $subscription->update([
            'plan_id' => $newPlan->id,
            // Reset to active with a fresh 30-day period on manual change.
            'status' => Subscription::STATUS_ACTIVE,
            'started_at' => now(),
            'ends_at' => now()->addDays(30),
            'grace_ends_at' => null,
            'last_amount_xof' => $newPlan->price_xof,
        ]);

        $this->audit->record(
            'subscription.plan_changed',
            $request->user(),
            'subscription',
            $subscription->id,
            $subscription->user?->name,
            $data['reason'] ?? null,
            ['from_plan' => $before, 'to_plan' => $newPlan->slug],
        );

        return back()->with('success', 'Offre mise à jour pour ce commerçant.');
    }

    public function cancel(Request $request, Subscription $subscription): RedirectResponse
    {
        $data = $request->validate([
            'reason' => ['required', 'string', 'min:3', 'max:500'],
        ]);

        $subscription->update([
            'status' => Subscription::STATUS_CANCELLED,
            'cancelled_at' => now(),
        ]);

        $this->audit->record(
            'subscription.cancelled',
            $request->user(),
            'subscription',
            $subscription->id,
            $subscription->user?->name,
            $data['reason'],
        );

        return back()->with('success', 'Abonnement annulé.');
    }
}

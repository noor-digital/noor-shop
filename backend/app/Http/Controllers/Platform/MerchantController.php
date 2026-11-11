<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MerchantController extends Controller
{
    public function index(Request $request): Response
    {
        $merchants = User::query()
            ->where('role', User::ROLE_MERCHANT)
            ->withCount('stores')
            ->with('subscriptions.plan')
            ->orderByDesc('created_at')
            ->paginate(25)
            ->through(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'stores_count' => $u->stores_count,
                'active_subscription' => $u->activeSubscription()?->only([
                    'status', 'plan_id', 'trial_ends_at', 'ends_at', 'grace_ends_at',
                ]),
                'created_at' => $u->created_at?->toIso8601String(),
            ]);

        return Inertia::render('platform/merchants/index', [
            'merchants' => $merchants,
        ]);
    }

    public function show(User $merchant): Response
    {
        abort_unless($merchant->isMerchant(), 404);

        $merchant->load([
            'stores:id,owner_user_id,slug,name,theme,status,created_at',
            'subscriptions.plan',
        ]);

        return Inertia::render('platform/merchants/show', [
            'merchant' => [
                'id' => $merchant->id,
                'name' => $merchant->name,
                'email' => $merchant->email,
                'phone' => $merchant->phone,
                'email_verified_at' => $merchant->email_verified_at?->toIso8601String(),
                'created_at' => $merchant->created_at?->toIso8601String(),
                'stores' => $merchant->stores,
                'subscriptions' => $merchant->subscriptions->map(fn ($s) => [
                    'id' => $s->id,
                    'status' => $s->status,
                    'plan' => $s->plan?->only(['id', 'slug', 'name', 'price_xof']),
                    'trial_ends_at' => $s->trial_ends_at?->toIso8601String(),
                    'started_at' => $s->started_at?->toIso8601String(),
                    'ends_at' => $s->ends_at?->toIso8601String(),
                    'grace_ends_at' => $s->grace_ends_at?->toIso8601String(),
                ]),
            ],
        ]);
    }
}

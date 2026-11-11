<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Entry point for the merchant workspace.
 * Returns a lightweight snapshot of the current user's stores and
 * subscription status. Products / orders KPIs are deferred to Phase 1B
 * once those tables land.
 */
class MerchantDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('merchant/dashboard', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'stores' => $user->stores()->active()->get(['id', 'slug', 'name', 'theme', 'status']),
            'subscription' => $user->activeSubscription()?->only(['status', 'plan_id', 'trial_ends_at', 'ends_at']),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlatformDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('platform/dashboard', [
            'stats' => [
                'merchants' => User::where('role', User::ROLE_MERCHANT)->count(),
                'stores' => Store::count(),
                'active_stores' => Store::where('status', Store::STATUS_ACTIVE)->count(),
                'active_subscriptions' => Subscription::whereIn('status', [
                    Subscription::STATUS_TRIAL,
                    Subscription::STATUS_ACTIVE,
                    Subscription::STATUS_GRACE,
                ])->count(),
            ],
        ]);
    }
}

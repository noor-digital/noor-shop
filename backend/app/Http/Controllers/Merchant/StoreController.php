<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Store::class);

        $stores = $request->user()
            ->stores()
            ->orderByDesc('created_at')
            ->get(['id', 'slug', 'name', 'theme', 'status', 'created_at']);

        return Inertia::render('merchant/stores/index', [
            'stores' => $stores,
        ]);
    }
}

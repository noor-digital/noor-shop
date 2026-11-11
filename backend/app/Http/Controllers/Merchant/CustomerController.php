<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Store;
use App\Services\CurrentStoreResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(private readonly CurrentStoreResolver $stores) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Customer::class);
        $store = $this->requireStore($request);

        $customers = $store->customers()
            ->orderByDesc('last_order_at')
            ->paginate(25);

        return Inertia::render('merchant/customers/index', [
            'currentStore' => $this->storePayload($store),
            'customers' => $customers,
        ]);
    }

    private function requireStore(Request $request): Store
    {
        $store = $this->stores->forUser($request->user());
        abort_unless($store, 404, 'Aucune boutique active.');
        return $store;
    }

    private function storePayload(Store $store): array
    {
        return ['id' => $store->id, 'slug' => $store->slug, 'name' => $store->name];
    }
}

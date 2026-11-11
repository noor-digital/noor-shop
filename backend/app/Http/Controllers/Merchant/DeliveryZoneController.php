<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\DeliveryZone;
use App\Models\Store;
use App\Services\CurrentStoreResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DeliveryZoneController extends Controller
{
    public function __construct(private readonly CurrentStoreResolver $stores) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', DeliveryZone::class);
        $store = $this->requireStore($request);

        $zones = $store->deliveryZones()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'fee_xof', 'eta', 'is_active', 'sort_order']);

        return Inertia::render('merchant/delivery/index', [
            'currentStore' => $this->storePayload($store),
            'zones' => $zones,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', DeliveryZone::class);
        $store = $this->requireStore($request);

        $data = $this->validatePayload($request);
        $store->deliveryZones()->create($data);

        return back()->with('success', 'Zone de livraison ajoutée.');
    }

    public function update(Request $request, DeliveryZone $deliveryZone): RedirectResponse
    {
        Gate::authorize('update', $deliveryZone);
        $store = $this->requireStore($request);
        $deliveryZone->assertBelongsTo($store);

        $deliveryZone->update($this->validatePayload($request));

        return back()->with('success', 'Zone mise à jour.');
    }

    public function destroy(Request $request, DeliveryZone $deliveryZone): RedirectResponse
    {
        Gate::authorize('delete', $deliveryZone);
        $store = $this->requireStore($request);
        $deliveryZone->assertBelongsTo($store);

        $deliveryZone->delete();

        return back()->with('success', 'Zone supprimée.');
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'fee_xof' => ['required', 'integer', 'min:0', 'max:999999999'],
            'eta' => ['nullable', 'string', 'max:60'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
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

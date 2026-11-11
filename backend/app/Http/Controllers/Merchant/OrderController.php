<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Store;
use App\Services\CurrentStoreResolver;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use InvalidArgumentException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly CurrentStoreResolver $stores,
        private readonly OrderService $orders,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Order::class);
        $store = $this->requireStore($request);

        $status = $request->string('status')->toString();

        $orders = $store->orders()
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(25)
            ->through(fn (Order $o) => [
                'id' => $o->id,
                'reference' => $o->reference,
                'status' => $o->status,
                'customer_name' => $o->customer_name,
                'customer_phone' => $o->customer_phone,
                'total_xof' => $o->total_xof,
                'delivery_mode' => $o->delivery_mode,
                'created_at' => $o->created_at?->toIso8601String(),
            ]);

        return Inertia::render('merchant/orders/index', [
            'currentStore' => $this->storePayload($store),
            'orders' => $orders,
            'filterStatus' => $status,
            'statuses' => [
                Order::STATUS_PENDING, Order::STATUS_CONFIRMED,
                Order::STATUS_PREPARING, Order::STATUS_READY,
                Order::STATUS_COMPLETED, Order::STATUS_CANCELLED,
            ],
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        Gate::authorize('view', $order);
        $store = $this->requireStore($request);
        $order->assertBelongsTo($store);

        $order->load(['items', 'statusHistory.actor:id,name', 'customer', 'deliveryZone']);

        return Inertia::render('merchant/orders/show', [
            'currentStore' => $this->storePayload($store),
            'order' => [
                'id' => $order->id,
                'reference' => $order->reference,
                'status' => $order->status,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'customer_email' => $order->customer_email,
                'delivery_mode' => $order->delivery_mode,
                'delivery_address' => $order->delivery_address,
                'delivery_fee_xof' => $order->delivery_fee_xof,
                'delivery_zone' => $order->deliveryZone?->only(['id', 'name', 'fee_xof']),
                'subtotal_xof' => $order->subtotal_xof,
                'total_xof' => $order->total_xof,
                'notes' => $order->notes,
                'created_at' => $order->created_at?->toIso8601String(),
                'items' => $order->items->map(fn ($it) => [
                    'id' => $it->id,
                    'product_name' => $it->product_name,
                    'variant_label' => $it->variant_label,
                    'unit_price_xof' => $it->unit_price_xof,
                    'quantity' => $it->quantity,
                    'line_total_xof' => $it->line_total_xof,
                ]),
                'history' => $order->statusHistory->map(fn ($h) => [
                    'id' => $h->id,
                    'from_status' => $h->from_status,
                    'to_status' => $h->to_status,
                    'actor_type' => $h->actor_type,
                    'actor_name' => $h->actor?->name,
                    'note' => $h->note,
                    'happened_at' => $h->happened_at?->toIso8601String(),
                ]),
                'allowed_transitions' => Order::TRANSITIONS[$order->status] ?? [],
            ],
        ]);
    }

    public function transition(Request $request, Order $order): RedirectResponse
    {
        Gate::authorize('update', $order);
        $store = $this->requireStore($request);
        $order->assertBelongsTo($store);

        $data = $request->validate([
            'to' => ['required', Rule::in([
                Order::STATUS_CONFIRMED, Order::STATUS_PREPARING,
                Order::STATUS_READY, Order::STATUS_COMPLETED, Order::STATUS_CANCELLED,
            ])],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $this->orders->transition($order, $data['to'], $request->user(), $data['note'] ?? null);
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['transition' => $e->getMessage()]);
        }

        return back()->with('success', 'Statut mis à jour.');
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

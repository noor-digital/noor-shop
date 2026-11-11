<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Store;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Public storefront checkout. Accepts a basket from the browser, creates
 * a pending order with reserved stock, and redirects to the confirmation
 * page carrying the opaque token (never the id).
 *
 * The MVP does not integrate an online payment — delivery / pickup is
 * the only fulfilment path.
 */
class CheckoutController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    public function show(Request $request, Store $store): Response
    {
        $this->assertStorefront($store);

        return Inertia::render('storefront/checkout', [
            'store' => $this->storePayload($store),
            'deliveryZones' => $store->deliveryZones()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'fee_xof', 'eta']),
        ]);
    }

    public function place(Request $request, Store $store): RedirectResponse|JsonResponse
    {
        $this->assertStorefront($store);
        $this->assertSubscriptionLive($store);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'max:32'],
            'email' => ['nullable', 'email', 'max:150'],
            'mode' => ['required', Rule::in([Order::MODE_DELIVERY, Order::MODE_PICKUP])],
            'delivery_zone_id' => ['nullable', 'integer'],
            'delivery_address' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.product_id' => ['required', 'integer'],
            'lines.*.variant_id' => ['nullable', 'integer'],
            'lines.*.quantity' => ['required', 'integer', 'min:1', 'max:1000'],
        ]);

        if ($data['mode'] === Order::MODE_DELIVERY) {
            if (empty($data['delivery_address'])) {
                throw ValidationException::withMessages([
                    'delivery_address' => 'Adresse de livraison requise.',
                ]);
            }
            if (empty($data['delivery_zone_id'])) {
                throw ValidationException::withMessages([
                    'delivery_zone_id' => 'Zone de livraison requise.',
                ]);
            }
        }

        try {
            $order = $this->orders->placeOrder($store, [
                'name' => $data['name'],
                'phone' => $data['phone'],
                'email' => $data['email'] ?? null,
                'mode' => $data['mode'],
                'delivery_zone_id' => $data['delivery_zone_id'] ?? null,
                'delivery_address' => $data['delivery_address'] ?? null,
                'notes' => $data['notes'] ?? null,
            ], $data['lines']);
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages(['cart' => $e->getMessage()]);
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages(['cart' => $e->getMessage()]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'ok' => true,
                'reference' => $order->reference,
                'token' => $order->token,
                'url' => route('storefront.confirmation', ['store' => $store->slug, 'token' => $order->token]),
            ]);
        }

        return redirect()->route('storefront.confirmation', [
            'store' => $store->slug,
            'token' => $order->token,
        ]);
    }

    public function confirmation(Request $request, Store $store, string $token): Response
    {
        $this->assertStorefront($store);

        $order = $store->orders()
            ->with(['items', 'deliveryZone'])
            ->where('token', $token)
            ->firstOrFail();

        return Inertia::render('storefront/confirmation', [
            'store' => $this->storePayload($store),
            'order' => [
                'reference' => $order->reference,
                'status' => $order->status,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'delivery_mode' => $order->delivery_mode,
                'delivery_address' => $order->delivery_address,
                'delivery_zone' => $order->deliveryZone?->only(['id', 'name', 'fee_xof']),
                'delivery_fee_xof' => $order->delivery_fee_xof,
                'subtotal_xof' => $order->subtotal_xof,
                'total_xof' => $order->total_xof,
                'items' => $order->items->map(fn ($it) => [
                    'product_name' => $it->product_name,
                    'variant_label' => $it->variant_label,
                    'unit_price_xof' => $it->unit_price_xof,
                    'quantity' => $it->quantity,
                    'line_total_xof' => $it->line_total_xof,
                ]),
            ],
        ]);
    }

    private function assertStorefront(Store $store): void
    {
        // Suspended stores are not navigable publicly.
        abort_unless($store->isActive(), 404);
    }

    /**
     * Refuse new orders if the owner's most recent subscription is cancelled
     * or expired (grace is still fine — cahier des charges §13.4). Does
     * nothing if no subscription exists yet (fresh signup).
     */
    private function assertSubscriptionLive(Store $store): void
    {
        $owner = $store->owner;
        if (! $owner) return;
        $sub = $owner->subscriptions()->latest()->first();
        if (! $sub) return;
        if (in_array($sub->status, [\App\Models\Subscription::STATUS_EXPIRED, \App\Models\Subscription::STATUS_CANCELLED], true)) {
            abort(403, 'Cette boutique n\'accepte plus de nouvelles commandes pour le moment.');
        }
    }

    private function storePayload(Store $store): array
    {
        return [
            'id' => $store->id,
            'slug' => $store->slug,
            'name' => $store->name,
            'accent_color' => $store->accent_color,
            'theme' => $store->theme,
        ];
    }
}

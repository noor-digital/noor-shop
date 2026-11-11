<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

/**
 * Orchestrates order lifecycle: creation (with stock reservation),
 * status transitions, cancellation (with stock release) and completion
 * (with stock consumption). Writes an order_status_histories row on
 * every transition.
 */
class OrderService
{
    public function __construct(private readonly StockService $stock) {}

    /**
     * Create a pending order for the given store, reserving stock in the
     * same transaction. On any failure the whole creation is rolled back.
     *
     * @param  array{
     *   name:string,
     *   phone:string,
     *   email:?string,
     *   mode:string,
     *   delivery_zone_id:?int,
     *   delivery_address:?string,
     *   notes:?string,
     * }  $customerData
     * @param  array<int,array{product_id:int,variant_id:?int,quantity:int}>  $lines
     */
    public function placeOrder(Store $store, array $customerData, array $lines): Order
    {
        if (empty($lines)) {
            throw new InvalidArgumentException('An order must contain at least one line.');
        }

        return DB::transaction(function () use ($store, $customerData, $lines) {
            // Hydrate lines with product / variant snapshots inside the lock.
            $hydratedLines = [];
            $subtotal = 0;
            foreach ($lines as $line) {
                /** @var \App\Models\Product|null $product */
                $product = $store->products()
                    ->whereKey($line['product_id'])
                    ->lockForUpdate()
                    ->first();
                if (! $product) {
                    throw new InvalidArgumentException('Product not in store.');
                }
                $variant = null;
                if (! empty($line['variant_id'])) {
                    $variant = $product->variants()
                        ->whereKey($line['variant_id'])
                        ->lockForUpdate()
                        ->first();
                    if (! $variant) {
                        throw new InvalidArgumentException('Variant not on product.');
                    }
                }
                $unitPrice = $variant?->effectivePriceXof() ?? $product->effectivePriceXof();
                $qty = (int) $line['quantity'];
                $subtotal += $unitPrice * $qty;
                $hydratedLines[] = [
                    'product_id' => $product->id,
                    'variant_id' => $variant?->id,
                    'product_name' => $product->name,
                    'variant_label' => $variant
                        ? $variant->optionValues()->pluck('value')->join(' · ')
                        : null,
                    'quantity' => $qty,
                    'unit_price_xof' => $unitPrice,
                ];
            }

            // Resolve delivery fee from zone (server-side, never from client).
            $deliveryFee = 0;
            $zoneId = null;
            if (($customerData['mode'] ?? null) === Order::MODE_DELIVERY && ! empty($customerData['delivery_zone_id'])) {
                $zone = $store->deliveryZones()
                    ->whereKey($customerData['delivery_zone_id'])
                    ->where('is_active', true)
                    ->first();
                if (! $zone) {
                    throw new InvalidArgumentException('Unknown delivery zone.');
                }
                $deliveryFee = $zone->fee_xof;
                $zoneId = $zone->id;
            }

            $total = $subtotal + $deliveryFee;

            // Upsert the customer for this store (phone is the key).
            $customer = Customer::updateOrCreate(
                ['store_id' => $store->id, 'phone' => $customerData['phone']],
                [
                    'name' => $customerData['name'],
                    'email' => $customerData['email'] ?? null,
                ]
            );

            $order = Order::create([
                'store_id' => $store->id,
                'customer_id' => $customer->id,
                'reference' => $this->generateReference(),
                'token' => Str::random(40),
                'status' => Order::STATUS_PENDING,
                'customer_name' => $customerData['name'],
                'customer_phone' => $customerData['phone'],
                'customer_email' => $customerData['email'] ?? null,
                'delivery_mode' => $customerData['mode'] ?? Order::MODE_DELIVERY,
                'delivery_zone_id' => $zoneId,
                'delivery_address' => $customerData['delivery_address'] ?? null,
                'delivery_fee_xof' => $deliveryFee,
                'subtotal_xof' => $subtotal,
                'total_xof' => $total,
                'notes' => $customerData['notes'] ?? null,
            ]);

            foreach ($hydratedLines as $line) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $line['product_id'],
                    'product_variant_id' => $line['variant_id'],
                    'product_name' => $line['product_name'],
                    'variant_label' => $line['variant_label'],
                    'unit_price_xof' => $line['unit_price_xof'],
                    'quantity' => $line['quantity'],
                    'line_total_xof' => $line['unit_price_xof'] * $line['quantity'],
                ]);
            }

            $this->stock->reserveForOrder($order, $hydratedLines);

            $this->recordHistory($order, null, Order::STATUS_PENDING, 'customer', null, 'Order placed');

            return $order;
        });
    }

    /**
     * Transition the order to a new status. Rejects illegal transitions and
     * performs the matching stock side-effect (release on cancel, consume on
     * completed).
     */
    public function transition(Order $order, string $to, ?User $actor = null, ?string $note = null): Order
    {
        $from = $order->status;
        if (! $order->canTransitionTo($to)) {
            throw new InvalidArgumentException(sprintf('Illegal transition %s → %s.', $from, $to));
        }

        return DB::transaction(function () use ($order, $from, $to, $actor, $note) {
            $order = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();
            // Re-check under lock in case it was changed concurrently.
            if ($order->status !== $from) {
                throw new InvalidArgumentException('Order status changed concurrently.');
            }

            $patch = ['status' => $to];
            $now = now();
            if ($to === Order::STATUS_CONFIRMED) {
                $patch['confirmed_at'] = $now;
            }
            if ($to === Order::STATUS_COMPLETED) {
                $patch['completed_at'] = $now;
            }
            if ($to === Order::STATUS_CANCELLED) {
                $patch['cancelled_at'] = $now;
                $patch['cancellation_reason'] = $note;
            }
            $order->forceFill($patch)->save();

            if ($to === Order::STATUS_CANCELLED) {
                $this->stock->releaseForOrder($order, $note ?? 'Order cancelled');
            } elseif ($to === Order::STATUS_COMPLETED) {
                $this->stock->consumeForOrder($order);
                // Update customer aggregates (completed only).
                if ($order->customer_id) {
                    $order->customer()->increment('orders_count');
                    $order->customer()->increment('total_spent_xof', $order->total_xof);
                    $order->customer()->update(['last_order_at' => now()]);
                }
            }

            $this->recordHistory(
                $order,
                $from,
                $to,
                $actor ? ($actor->isPlatformAdmin() ? 'platform_admin' : 'merchant') : 'system',
                $actor?->id,
                $note
            );

            return $order->fresh();
        });
    }

    private function recordHistory(
        Order $order,
        ?string $from,
        string $to,
        string $actorType,
        ?int $actorUserId,
        ?string $note
    ): void {
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'from_status' => $from,
            'to_status' => $to,
            'actor_user_id' => $actorUserId,
            'actor_type' => $actorType,
            'note' => $note,
            'happened_at' => now(),
        ]);
    }

    private function generateReference(): string
    {
        // Human-friendly reference — collision chance is negligible for the
        // MVP volume (reference is also DB-unique).
        do {
            $ref = sprintf('NS-%s-%04d', now()->format('Y'), random_int(1000, 9999));
        } while (Order::where('reference', $ref)->exists());
        return $ref;
    }
}

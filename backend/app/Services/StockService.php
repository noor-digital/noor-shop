<?php

namespace App\Services;

use App\Models\InventoryMovement;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Stock reservation lifecycle.
 *
 * Invariants:
 *   - Each order has at most one "reservation" per (product, variant) line.
 *   - `release` and `consumption` are idempotent at the Order level: they
 *     check `$order->stock_released_at` / `stock_consumed_at` before acting.
 *   - Stock availability = product|variant.stock − Σ active reservations.
 *     "Active" = reservation movement whose related order is still `pending`
 *     and whose reservation window has not yet expired (2 h).
 *
 * All mutating methods run inside DB::transaction with pessimistic row
 * locks on products / variants to prevent race-condition overselling.
 */
class StockService
{
    public const RESERVATION_WINDOW_MINUTES = 120;

    /**
     * Reserve stock for every line of `$order`, or throw on insufficient stock.
     *
     * @param  array<int,array{product_id:int,variant_id:?int,quantity:int,unit_price_xof:int,product_name:string,variant_label:?string}>  $lines
     * @return void
     */
    public function reserveForOrder(Order $order, array $lines): void
    {
        DB::transaction(function () use ($order, $lines) {
            if ($order->stock_reserved_at !== null) {
                // Already reserved — idempotent noop.
                return;
            }

            foreach ($lines as $line) {
                $this->reserveLine($order, $line);
            }

            $order->forceFill(['stock_reserved_at' => now()])->save();
        });
    }

    /** Release the stock held by this order. Idempotent at the order level. */
    public function releaseForOrder(Order $order, ?string $reason = null): void
    {
        DB::transaction(function () use ($order, $reason) {
            // Reload with a row lock so two concurrent releases can't both pass.
            $order = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();

            if ($order->stock_released_at !== null || $order->stock_consumed_at !== null) {
                return;
            }

            $reservations = InventoryMovement::query()
                ->where('order_id', $order->id)
                ->where('type', InventoryMovement::TYPE_RESERVATION)
                ->get();

            foreach ($reservations as $res) {
                InventoryMovement::create([
                    'store_id' => $res->store_id,
                    'product_id' => $res->product_id,
                    'product_variant_id' => $res->product_variant_id,
                    'order_id' => $order->id,
                    'type' => InventoryMovement::TYPE_RELEASE,
                    'quantity_delta' => -$res->quantity_delta, // positive mirror
                    'reason' => $reason,
                    'happened_at' => now(),
                ]);
            }

            $order->forceFill(['stock_released_at' => now()])->save();
        });
    }

    /**
     * Consume reserved stock (deducts from the actual product/variant stock).
     * Called on transition to `completed`. Idempotent at the order level.
     */
    public function consumeForOrder(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $order = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();

            if ($order->stock_consumed_at !== null || $order->stock_released_at !== null) {
                return;
            }

            $reservations = InventoryMovement::query()
                ->where('order_id', $order->id)
                ->where('type', InventoryMovement::TYPE_RESERVATION)
                ->get();

            foreach ($reservations as $res) {
                $quantity = abs($res->quantity_delta);
                if ($res->product_variant_id) {
                    $variant = ProductVariant::query()
                        ->whereKey($res->product_variant_id)
                        ->lockForUpdate()
                        ->firstOrFail();
                    $variant->decrement('stock', $quantity);
                } else {
                    $product = Product::query()
                        ->whereKey($res->product_id)
                        ->lockForUpdate()
                        ->firstOrFail();
                    $product->decrement('stock', $quantity);
                }

                InventoryMovement::create([
                    'store_id' => $res->store_id,
                    'product_id' => $res->product_id,
                    'product_variant_id' => $res->product_variant_id,
                    'order_id' => $order->id,
                    'type' => InventoryMovement::TYPE_CONSUMPTION,
                    'quantity_delta' => $res->quantity_delta, // negative
                    'reason' => 'Order completed',
                    'happened_at' => now(),
                ]);
            }

            $order->forceFill(['stock_consumed_at' => now()])->save();
        });
    }

    /**
     * Release reservations for every `pending` order whose reservation
     * window has elapsed. Called by `orders:release-expired` artisan
     * command (scheduled every 5 min).
     *
     * @return int number of orders released.
     */
    public function releaseExpiredReservations(): int
    {
        $cutoff = now()->subMinutes(self::RESERVATION_WINDOW_MINUTES);

        $expired = Order::query()
            ->where('status', Order::STATUS_PENDING)
            ->whereNotNull('stock_reserved_at')
            ->whereNull('stock_released_at')
            ->whereNull('stock_consumed_at')
            ->where('stock_reserved_at', '<', $cutoff)
            ->get();

        foreach ($expired as $order) {
            DB::transaction(function () use ($order) {
                $order = Order::query()->whereKey($order->id)->lockForUpdate()->first();
                if (! $order) return;

                $this->releaseForOrder($order, 'Reservation expired after 2h');

                $order->forceFill([
                    'status' => Order::STATUS_CANCELLED,
                    'cancelled_at' => now(),
                    'cancellation_reason' => 'Reservation expired (2h window).',
                ])->save();
            });
        }

        return $expired->count();
    }

    /**
     * Current effective stock of a product (or variant), accounting for
     * active reservations.
     */
    public function availableStock(Product $product, ?ProductVariant $variant = null): int
    {
        $baseStock = $variant?->stock ?? $product->stock;
        $reserved = $this->activeReservedQuantity($product, $variant);
        return max(0, $baseStock - $reserved);
    }

    public function activeReservedQuantity(Product $product, ?ProductVariant $variant = null): int
    {
        $cutoff = now()->subMinutes(self::RESERVATION_WINDOW_MINUTES);

        $query = InventoryMovement::query()
            ->where('type', InventoryMovement::TYPE_RESERVATION)
            ->where('product_id', $product->id)
            ->whereHas('order', function ($q) use ($cutoff) {
                $q->where('status', Order::STATUS_PENDING)
                  ->where('stock_reserved_at', '>=', $cutoff);
            });

        if ($variant) {
            $query->where('product_variant_id', $variant->id);
        } else {
            $query->whereNull('product_variant_id');
        }

        return (int) abs((int) $query->sum('quantity_delta'));
    }

    /* ------------------------------------------------------------------ */

    private function reserveLine(Order $order, array $line): void
    {
        $product = Product::query()
            ->whereKey($line['product_id'])
            ->lockForUpdate()
            ->first();

        if (! $product || $product->store_id !== $order->store_id) {
            throw new RuntimeException('Product not in this store.');
        }

        $variant = null;
        if (! empty($line['variant_id'])) {
            $variant = ProductVariant::query()
                ->whereKey($line['variant_id'])
                ->lockForUpdate()
                ->first();
            if (! $variant || $variant->product_id !== $product->id) {
                throw new RuntimeException('Variant does not belong to product.');
            }
        }

        $quantity = (int) $line['quantity'];
        if ($quantity < 1) {
            throw new RuntimeException('Quantity must be positive.');
        }

        $available = $this->availableStock($product, $variant);
        if ($available < $quantity) {
            throw new RuntimeException(sprintf(
                'Insufficient stock for "%s" (%d requested, %d available).',
                $product->name,
                $quantity,
                $available
            ));
        }

        InventoryMovement::create([
            'store_id' => $product->store_id,
            'product_id' => $product->id,
            'product_variant_id' => $variant?->id,
            'order_id' => $order->id,
            'type' => InventoryMovement::TYPE_RESERVATION,
            'quantity_delta' => -$quantity,
            'reason' => 'Reserved at checkout',
            'happened_at' => now(),
        ]);
    }
}

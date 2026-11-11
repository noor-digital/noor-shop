<?php

namespace App\Models;

use App\Models\Concerns\BelongsToStore;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryMovement extends Model
{
    use BelongsToStore;

    public const TYPE_RESERVATION = 'reservation';
    public const TYPE_RELEASE = 'release';
    public const TYPE_CONSUMPTION = 'consumption';
    public const TYPE_ADJUSTMENT = 'adjustment';
    public const TYPE_RESTOCK = 'restock';

    protected $fillable = [
        'store_id',
        'product_id',
        'product_variant_id',
        'order_id',
        'type',
        'quantity_delta',
        'reason',
        'happened_at',
    ];

    protected $casts = [
        'quantity_delta' => 'integer',
        'happened_at' => 'datetime',
    ];

    /** @return BelongsTo<Product, InventoryMovement> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<ProductVariant, InventoryMovement> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /** @return BelongsTo<Order, InventoryMovement> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}

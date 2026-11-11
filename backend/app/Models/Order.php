<?php

namespace App\Models;

use App\Models\Concerns\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use BelongsToStore;
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_PREPARING = 'preparing';
    public const STATUS_READY = 'ready';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public const MODE_DELIVERY = 'delivery';
    public const MODE_PICKUP = 'pickup';

    /**
     * Allowed status transitions from → [to...].
     * Terminal statuses (completed, cancelled) have no outgoing transition.
     */
    public const TRANSITIONS = [
        self::STATUS_PENDING   => [self::STATUS_CONFIRMED, self::STATUS_CANCELLED],
        self::STATUS_CONFIRMED => [self::STATUS_PREPARING, self::STATUS_CANCELLED],
        self::STATUS_PREPARING => [self::STATUS_READY, self::STATUS_CANCELLED],
        self::STATUS_READY     => [self::STATUS_COMPLETED, self::STATUS_CANCELLED],
    ];

    protected $fillable = [
        'store_id',
        'customer_id',
        'reference',
        'token',
        'status',
        'customer_name',
        'customer_phone',
        'customer_email',
        'delivery_mode',
        'delivery_zone_id',
        'delivery_address',
        'delivery_fee_xof',
        'subtotal_xof',
        'total_xof',
        'notes',
        'stock_reserved_at',
        'stock_released_at',
        'stock_consumed_at',
        'confirmed_at',
        'completed_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'stock_reserved_at' => 'datetime',
        'stock_released_at' => 'datetime',
        'stock_consumed_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'subtotal_xof' => 'integer',
        'total_xof' => 'integer',
        'delivery_fee_xof' => 'integer',
    ];

    public function isTerminal(): bool
    {
        return in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED], true);
    }

    public function canTransitionTo(string $target): bool
    {
        return in_array($target, self::TRANSITIONS[$this->status] ?? [], true);
    }

    /** @return BelongsTo<Customer, Order> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /** @return BelongsTo<DeliveryZone, Order> */
    public function deliveryZone(): BelongsTo
    {
        return $this->belongsTo(DeliveryZone::class);
    }

    /** @return HasMany<OrderItem> */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /** @return HasMany<OrderStatusHistory> */
    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('happened_at');
    }

    /** @return HasMany<InventoryMovement> */
    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }
}

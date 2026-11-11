<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderStatusHistory extends Model
{
    protected $fillable = [
        'order_id',
        'from_status',
        'to_status',
        'actor_user_id',
        'actor_type',
        'note',
        'happened_at',
    ];

    protected $casts = [
        'happened_at' => 'datetime',
    ];

    /** @return BelongsTo<Order, OrderStatusHistory> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<User, OrderStatusHistory> */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }
}

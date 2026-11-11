<?php

namespace App\Models;

use App\Models\Concerns\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use BelongsToStore;
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'phone',
        'email',
        'orders_count',
        'total_spent_xof',
        'last_order_at',
    ];

    protected $casts = [
        'last_order_at' => 'datetime',
        'orders_count' => 'integer',
        'total_spent_xof' => 'integer',
    ];

    /** @return HasMany<Order> */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}

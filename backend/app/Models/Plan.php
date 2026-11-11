<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'tagline',
        'price_xof',
        'max_stores',
        'max_products',
        'max_users',
        'features',
        'sort_order',
        'is_active',
        'is_highlighted',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'is_highlighted' => 'boolean',
    ];

    public function isFree(): bool
    {
        return $this->price_xof === 0;
    }

    /** @return HasMany<Subscription> */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}

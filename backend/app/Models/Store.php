<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Store — a merchant's shop. Every multi-tenant resource (products, orders,
 * categories, …) carries a `store_id` and MUST be scoped via `ScopedToStore`.
 */
class Store extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const STATUS_ACTIVE = 'active';
    public const STATUS_SUSPENDED = 'suspended';

    public const THEME_MARBLE = 'marble';
    public const THEME_EDITORIAL = 'editorial';
    public const THEME_GALLERY = 'gallery';

    protected $fillable = [
        'owner_user_id',
        'slug',
        'name',
        'description',
        'theme',
        'accent_color',
        'logo_text',
        'phone',
        'city',
        'address',
        'status',
    ];

    protected $casts = [
        'products_count' => 'integer',
        'orders_count' => 'integer',
        'revenue_total_xof' => 'integer',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /** @return BelongsTo<User, Store> */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    /** @return HasOne<StoreSetting> */
    public function settings(): HasOne
    {
        return $this->hasOne(StoreSetting::class);
    }

    /** @param Builder<Store> $query */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /** @param Builder<Store> $query */
    public function scopeOwnedBy(Builder $query, User $user): Builder
    {
        return $query->where('owner_user_id', $user->id);
    }
}

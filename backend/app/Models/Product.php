<?php

namespace App\Models;

use App\Models\Concerns\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use BelongsToStore;
    use HasFactory;
    use SoftDeletes;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'store_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price_xof',
        'promo_price_xof',
        'stock',
        'status',
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'price_xof' => 'integer',
        'promo_price_xof' => 'integer',
        'stock' => 'integer',
        'reviews_count' => 'integer',
        'rating' => 'decimal:1',
    ];

    /** @return BelongsTo<Category, Product> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** @return HasMany<ProductImage> */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /** @return HasMany<ProductOption> */
    public function options(): HasMany
    {
        return $this->hasMany(ProductOption::class)->orderBy('sort_order');
    }

    /** @return HasMany<ProductVariant> */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function effectivePriceXof(): int
    {
        return $this->promo_price_xof ?? $this->price_xof;
    }
}

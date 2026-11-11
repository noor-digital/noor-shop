<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductOption extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'sort_order',
    ];

    /** @return BelongsTo<Product, ProductOption> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return HasMany<ProductOptionValue> */
    public function values(): HasMany
    {
        return $this->hasMany(ProductOptionValue::class)->orderBy('sort_order');
    }
}

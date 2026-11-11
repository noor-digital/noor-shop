<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'sku',
        'price_xof',
        'stock',
        'is_default',
    ];

    protected $casts = [
        'price_xof' => 'integer',
        'stock' => 'integer',
        'is_default' => 'boolean',
    ];

    /** @return BelongsTo<Product, ProductVariant> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsToMany<ProductOptionValue> */
    public function optionValues(): BelongsToMany
    {
        return $this->belongsToMany(
            ProductOptionValue::class,
            'product_variant_option_value'
        );
    }

    public function effectivePriceXof(): int
    {
        return $this->price_xof ?? $this->product->price_xof;
    }
}

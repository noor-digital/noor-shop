<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductOptionValue extends Model
{
    protected $fillable = [
        'product_option_id',
        'value',
        'hex_color',
        'sort_order',
    ];

    /** @return BelongsTo<ProductOption, ProductOptionValue> */
    public function option(): BelongsTo
    {
        return $this->belongsTo(ProductOption::class, 'product_option_id');
    }

    /** @return BelongsToMany<ProductVariant> */
    public function variants(): BelongsToMany
    {
        return $this->belongsToMany(
            ProductVariant::class,
            'product_variant_option_value'
        );
    }
}

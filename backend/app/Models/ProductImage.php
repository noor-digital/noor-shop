<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'path',
        'original_name',
        'mime_type',
        'size_bytes',
        'alt_text',
        'sort_order',
    ];

    /** @return BelongsTo<Product, ProductImage> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

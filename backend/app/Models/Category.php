<?php

namespace App\Models;

use App\Models\Concerns\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use BelongsToStore;
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'store_id',
        'name',
        'slug',
        'description',
        'image_path',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    /** @return HasMany<Product> */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}

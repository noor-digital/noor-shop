<?php

namespace App\Models;

use App\Models\Concerns\BelongsToStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    use BelongsToStore;
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'fee_xof',
        'eta',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'fee_xof' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}

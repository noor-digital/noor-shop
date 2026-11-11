<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreSetting extends Model
{
    protected $fillable = [
        'store_id',
        'home_sections',
        'home_sections_enabled',
        'instagram_handle',
        'facebook_handle',
        'whatsapp_number',
        'seo_title',
        'seo_description',
    ];

    protected $casts = [
        'home_sections' => 'array',
        'home_sections_enabled' => 'array',
    ];

    /** @return BelongsTo<Store, StoreSetting> */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}

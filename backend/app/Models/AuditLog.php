<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = [
        'actor_user_id',
        'actor_label',
        'action',
        'target_type',
        'target_id',
        'target_label',
        'reason',
        'ip_address',
        'metadata',
        'happened_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'happened_at' => 'datetime',
    ];

    /** @return BelongsTo<User, AuditLog> */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasFactory;

    public const STATUS_TRIAL = 'trial';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_GRACE = 'grace';
    public const STATUS_EXPIRED = 'expired';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'user_id',
        'plan_id',
        'status',
        'trial_ends_at',
        'started_at',
        'ends_at',
        'grace_ends_at',
        'cancelled_at',
        'last_amount_xof',
    ];

    protected $casts = [
        'trial_ends_at' => 'datetime',
        'started_at' => 'datetime',
        'ends_at' => 'datetime',
        'grace_ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function isLive(): bool
    {
        return in_array($this->status, [self::STATUS_TRIAL, self::STATUS_ACTIVE, self::STATUS_GRACE], true);
    }

    /** @return BelongsTo<User, Subscription> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Plan, Subscription> */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}

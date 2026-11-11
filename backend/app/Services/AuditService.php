<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;

class AuditService
{
    public function __construct(private readonly ?Request $request = null) {}

    public function record(
        string $action,
        ?User $actor = null,
        ?string $targetType = null,
        ?int $targetId = null,
        ?string $targetLabel = null,
        ?string $reason = null,
        array $metadata = []
    ): AuditLog {
        return AuditLog::create([
            'actor_user_id' => $actor?->id,
            'actor_label' => $actor?->name,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'target_label' => $targetLabel,
            'reason' => $reason,
            'ip_address' => request()?->ip(),
            'metadata' => $metadata ?: null,
            'happened_at' => now(),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = AuditLog::query()
            ->with('actor:id,name,email')
            ->orderByDesc('happened_at')
            ->paginate(50)
            ->through(fn (AuditLog $l) => [
                'id' => $l->id,
                'action' => $l->action,
                'actor_name' => $l->actor?->name ?? $l->actor_label,
                'target_type' => $l->target_type,
                'target_id' => $l->target_id,
                'target_label' => $l->target_label,
                'reason' => $l->reason,
                'ip_address' => $l->ip_address,
                'happened_at' => $l->happened_at?->toIso8601String(),
            ]);

        return Inertia::render('platform/audit/index', [
            'logs' => $logs,
        ]);
    }
}

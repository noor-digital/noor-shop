<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Platform administration of stores — suspend / reactivate with audit logs.
 */
class PlatformStoreController extends Controller
{
    public function __construct(private readonly AuditService $audit) {}

    public function index(Request $request): Response
    {
        $stores = Store::query()
            ->withTrashed()
            ->with('owner:id,name,email')
            ->orderByDesc('created_at')
            ->paginate(25)
            ->through(fn (Store $s) => [
                'id' => $s->id,
                'slug' => $s->slug,
                'name' => $s->name,
                'status' => $s->status,
                'deleted_at' => $s->deleted_at?->toIso8601String(),
                'owner' => $s->owner ? ['id' => $s->owner->id, 'name' => $s->owner->name, 'email' => $s->owner->email] : null,
                'created_at' => $s->created_at?->toIso8601String(),
            ]);

        return Inertia::render('platform/stores/index', [
            'stores' => $stores,
        ]);
    }

    public function suspend(Request $request, Store $store): RedirectResponse
    {
        Gate::authorize('suspend', $store);

        $data = $request->validate([
            'reason' => ['required', 'string', 'min:3', 'max:500'],
        ]);

        $store->forceFill(['status' => Store::STATUS_SUSPENDED])->save();

        $this->audit->record(
            'store.suspended',
            $request->user(),
            'store',
            $store->id,
            $store->name,
            $data['reason'],
        );

        return back()->with('success', 'Boutique suspendue.');
    }

    public function reactivate(Request $request, Store $store): RedirectResponse
    {
        Gate::authorize('suspend', $store); // same policy gate (admin-only).

        $store->forceFill(['status' => Store::STATUS_ACTIVE])->save();

        $this->audit->record(
            'store.reactivated',
            $request->user(),
            'store',
            $store->id,
            $store->name,
            $request->string('reason')->toString() ?: null,
        );

        return back()->with('success', 'Boutique réactivée.');
    }
}

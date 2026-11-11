<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function __construct(private readonly AuditService $audit) {}

    public function index(): Response
    {
        $plans = Plan::query()
            ->orderBy('sort_order')
            ->get(['id', 'slug', 'name', 'tagline', 'price_xof', 'max_stores',
                   'max_products', 'max_users', 'features', 'is_active',
                   'is_highlighted', 'sort_order']);

        return Inertia::render('platform/plans/index', [
            'plans' => $plans,
        ]);
    }

    public function update(Request $request, Plan $plan): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'price_xof' => ['required', 'integer', 'min:0', 'max:999999999'],
            'max_stores' => ['nullable', 'integer', 'min:1', 'max:10000'],
            'max_products' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'max_users' => ['nullable', 'integer', 'min:1', 'max:10000'],
            'features' => ['nullable', 'array', 'max:30'],
            'features.*' => ['string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'is_highlighted' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
        ]);

        $before = $plan->only(['price_xof', 'max_stores', 'max_products', 'max_users', 'is_active']);
        $plan->update($data);

        $this->audit->record(
            'plan.updated',
            $request->user(),
            'plan',
            $plan->id,
            $plan->name,
            null,
            ['before' => $before, 'after' => $plan->only(array_keys($before))],
        );

        return back()->with('success', 'Offre mise à jour.');
    }
}

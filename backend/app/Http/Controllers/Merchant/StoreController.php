<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\StoreRequest;
use App\Models\Store;
use App\Services\CurrentStoreResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Merchant workspace: list, create, update and delete their OWN stores.
 * Plan quotas enforced on create (checks `max_stores` of the active
 * subscription's plan).
 */
class StoreController extends Controller
{
    public function __construct(private readonly CurrentStoreResolver $stores) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Store::class);

        $stores = $request->user()
            ->stores()
            ->orderByDesc('created_at')
            ->get(['id', 'slug', 'name', 'theme', 'status', 'accent_color', 'created_at']);

        return Inertia::render('merchant/stores/index', [
            'stores' => $stores,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Store::class);
        return Inertia::render('merchant/stores/form', [
            'store' => null,
            'themes' => [Store::THEME_MARBLE, Store::THEME_EDITORIAL, Store::THEME_GALLERY],
        ]);
    }

    public function store(StoreRequest $request): RedirectResponse
    {
        Gate::authorize('create', Store::class);

        $user = $request->user();
        $this->enforcePlanQuota($user);

        $store = $user->stores()->create($request->validatedWithSlug() + [
            'status' => Store::STATUS_ACTIVE,
        ]);

        // Switch the active session store to the one just created.
        $request->session()->put(CurrentStoreResolver::SESSION_KEY, $store->id);

        return redirect()
            ->route('merchant.stores.index')
            ->with('success', 'Boutique créée.');
    }

    public function edit(Store $store): Response
    {
        Gate::authorize('update', $store);

        return Inertia::render('merchant/stores/form', [
            'store' => $store->only([
                'id', 'slug', 'name', 'description', 'theme', 'accent_color',
                'logo_text', 'phone', 'city', 'address',
            ]),
            'themes' => [Store::THEME_MARBLE, Store::THEME_EDITORIAL, Store::THEME_GALLERY],
        ]);
    }

    public function update(StoreRequest $request, Store $store): RedirectResponse
    {
        Gate::authorize('update', $store);
        $store->update($request->validatedWithSlug());

        return redirect()
            ->route('merchant.stores.index')
            ->with('success', 'Boutique mise à jour.');
    }

    public function destroy(Request $request, Store $store): RedirectResponse
    {
        Gate::authorize('delete', $store);

        // Refuse if there are any orders — historical records must stay intact.
        if ($store->orders()->exists()) {
            return back()->withErrors(['store' => 'Cette boutique a des commandes — soft-deletion non autorisée dans le MVP.']);
        }

        $store->delete();

        return redirect()
            ->route('merchant.stores.index')
            ->with('success', 'Boutique supprimée.');
    }

    /**
     * Blocks store creation past the subscription's plan quota.
     */
    private function enforcePlanQuota($user): void
    {
        $sub = $user->activeSubscription();
        if (! $sub) {
            // Allow creating the first store even without a subscription, so a
            // trial-less user isn't stuck. Subsequent limits kick in once a
            // subscription is present.
            if ($user->stores()->count() === 0) return;
            throw ValidationException::withMessages([
                'subscription' => 'Un abonnement actif est requis pour créer plus d\'une boutique.',
            ]);
        }

        $plan = $sub->plan;
        if ($plan && $plan->max_stores !== null && $user->stores()->count() >= $plan->max_stores) {
            throw ValidationException::withMessages([
                'subscription' => sprintf(
                    'Votre offre « %s » autorise au maximum %d boutique(s). Mettez à niveau votre abonnement.',
                    $plan->name,
                    $plan->max_stores
                ),
            ]);
        }
    }
}

<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\StoreSetting;
use App\Services\CurrentStoreResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Store appearance / customisation settings (home sections, SEO, socials).
 * The template itself (`stores.theme`) is managed by `StoreController`.
 */
class StoreSettingController extends Controller
{
    public function __construct(private readonly CurrentStoreResolver $stores) {}

    public function edit(Request $request): Response
    {
        $store = $this->requireStore($request);
        Gate::authorize('update', $store);

        $settings = $store->settings()->firstOrCreate([], [
            'home_sections' => ['hero', 'featured_categories', 'bestsellers', 'editorial'],
            'home_sections_enabled' => ['hero', 'featured_categories', 'bestsellers'],
        ]);

        return Inertia::render('merchant/stores/settings', [
            'currentStore' => [
                'id' => $store->id,
                'slug' => $store->slug,
                'name' => $store->name,
                'theme' => $store->theme,
                'accent_color' => $store->accent_color,
            ],
            'settings' => [
                'home_sections' => $settings->home_sections ?? [],
                'home_sections_enabled' => $settings->home_sections_enabled ?? [],
                'instagram_handle' => $settings->instagram_handle,
                'facebook_handle' => $settings->facebook_handle,
                'whatsapp_number' => $settings->whatsapp_number,
                'seo_title' => $settings->seo_title,
                'seo_description' => $settings->seo_description,
            ],
            'availableSections' => ['hero', 'featured_categories', 'bestsellers', 'editorial', 'about'],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $store = $this->requireStore($request);
        Gate::authorize('update', $store);

        $data = $request->validate([
            'home_sections' => ['required', 'array', 'min:1'],
            'home_sections.*' => ['string', 'max:40'],
            'home_sections_enabled' => ['required', 'array'],
            'home_sections_enabled.*' => ['string', 'max:40'],
            'instagram_handle' => ['nullable', 'string', 'max:60'],
            'facebook_handle' => ['nullable', 'string', 'max:60'],
            'whatsapp_number' => ['nullable', 'string', 'max:32'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
        ]);

        $store->settings()->updateOrCreate([], $data);

        return back()->with('success', 'Paramètres de la boutique mis à jour.');
    }

    private function requireStore(Request $request): Store
    {
        $store = $this->stores->forUser($request->user());
        abort_unless($store, 404, 'Aucune boutique active.');
        return $store;
    }
}

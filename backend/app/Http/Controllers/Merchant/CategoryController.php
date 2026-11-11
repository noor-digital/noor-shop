<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\CategoryRequest;
use App\Models\Category;
use App\Models\Store;
use App\Services\CurrentStoreResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(private readonly CurrentStoreResolver $stores) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Category::class);

        $store = $this->requireStore($request);

        $categories = $store->categories()
            ->withCount('products')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description', 'sort_order', 'created_at']);

        return Inertia::render('merchant/categories/index', [
            'currentStore' => $this->storePayload($store),
            'categories' => $categories,
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        Gate::authorize('create', Category::class);

        $store = $this->requireStore($request);
        $store->categories()->create($request->validatedWithSlug());

        return redirect()
            ->route('merchant.categories.index')
            ->with('success', 'Catégorie créée.');
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        Gate::authorize('update', $category);

        $store = $this->requireStore($request);
        $category->assertBelongsTo($store);

        $category->update($request->validatedWithSlug());

        return redirect()
            ->route('merchant.categories.index')
            ->with('success', 'Catégorie mise à jour.');
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        Gate::authorize('delete', $category);

        $store = $this->requireStore($request);
        $category->assertBelongsTo($store);

        // Refuse deletion when products still reference the category.
        if ($category->products()->exists()) {
            throw ValidationException::withMessages([
                'category' => __('Cette catégorie contient encore des produits. Déplacez-les avant suppression.'),
            ]);
        }

        $category->delete();

        return redirect()
            ->route('merchant.categories.index')
            ->with('success', 'Catégorie supprimée.');
    }

    private function requireStore(Request $request): Store
    {
        $store = $this->stores->forUser($request->user());
        abort_unless($store, 404, 'Aucune boutique active.');
        return $store;
    }

    private function storePayload(Store $store): array
    {
        return [
            'id' => $store->id,
            'slug' => $store->slug,
            'name' => $store->name,
        ];
    }
}

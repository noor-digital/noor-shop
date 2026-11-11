<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\ProductRequest;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Store;
use App\Services\CurrentStoreResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(private readonly CurrentStoreResolver $stores) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Product::class);

        $store = $this->requireStore($request);

        $products = $store->products()
            ->with(['category:id,name', 'images' => fn ($q) => $q->orderBy('sort_order')->limit(1)])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->through(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price_xof' => $p->price_xof,
                'promo_price_xof' => $p->promo_price_xof,
                'stock' => $p->stock,
                'status' => $p->status,
                'category' => $p->category ? ['id' => $p->category->id, 'name' => $p->category->name] : null,
                'image' => $p->images->first()?->path,
            ]);

        return Inertia::render('merchant/products/index', [
            'currentStore' => $this->storePayload($store),
            'products' => $products,
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('create', Product::class);
        $store = $this->requireStore($request);

        return Inertia::render('merchant/products/form', [
            'currentStore' => $this->storePayload($store),
            'categories' => $store->categories()->orderBy('name')->get(['id', 'name']),
            'product' => null,
            'statuses' => [Product::STATUS_DRAFT, Product::STATUS_PUBLISHED, Product::STATUS_ARCHIVED],
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        Gate::authorize('create', Product::class);
        $store = $this->requireStore($request);

        $product = DB::transaction(function () use ($request, $store) {
            /** @var Product $product */
            $product = $store->products()->create($request->validatedWithSlug());
            $this->storeImages($request, $product);
            return $product;
        });

        return redirect()
            ->route('merchant.products.edit', $product)
            ->with('success', 'Produit créé.');
    }

    public function edit(Request $request, Product $product): Response
    {
        Gate::authorize('update', $product);
        $store = $this->requireStore($request);
        $product->assertBelongsTo($store);

        $product->load(['images', 'category:id,name']);

        return Inertia::render('merchant/products/form', [
            'currentStore' => $this->storePayload($store),
            'categories' => $store->categories()->orderBy('name')->get(['id', 'name']),
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price_xof' => $product->price_xof,
                'promo_price_xof' => $product->promo_price_xof,
                'stock' => $product->stock,
                'status' => $product->status,
                'category_id' => $product->category_id,
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => Storage::url($img->path),
                    'alt_text' => $img->alt_text,
                ]),
            ],
            'statuses' => [Product::STATUS_DRAFT, Product::STATUS_PUBLISHED, Product::STATUS_ARCHIVED],
        ]);
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        Gate::authorize('update', $product);
        $store = $this->requireStore($request);
        $product->assertBelongsTo($store);

        DB::transaction(function () use ($request, $product) {
            $product->update($request->validatedWithSlug());
            $this->storeImages($request, $product);
        });

        return redirect()
            ->route('merchant.products.edit', $product)
            ->with('success', 'Produit mis à jour.');
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        Gate::authorize('delete', $product);
        $store = $this->requireStore($request);
        $product->assertBelongsTo($store);

        $product->delete();

        return redirect()
            ->route('merchant.products.index')
            ->with('success', 'Produit supprimé.');
    }

    private function storeImages(ProductRequest $request, Product $product): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        $nextSortOrder = (int) $product->images()->max('sort_order') + 1;

        foreach ($request->file('images') as $file) {
            $path = $file->store("stores/{$product->store_id}/products/{$product->id}", 'public');
            $product->images()->create([
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size_bytes' => $file->getSize(),
                'sort_order' => $nextSortOrder++,
            ]);
        }
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

<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Services\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Public storefront pages (read-only). Each action verifies the store is
 * active — a suspended store is 404. Only products in `published` status
 * are listed; drafts and archives stay private.
 */
class StorefrontController extends Controller
{
    public function __construct(private readonly StockService $stock) {}

    public function home(Request $request, Store $store): Response
    {
        $this->assertStorefront($store);

        $categories = $store->categories()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'slug', 'name', 'image_path']);

        $products = $store->products()
            ->where('status', Product::STATUS_PUBLISHED)
            ->with(['images' => fn ($q) => $q->orderBy('sort_order')->limit(1)])
            ->orderByDesc('created_at')
            ->limit(8)
            ->get(['id', 'slug', 'name', 'price_xof', 'promo_price_xof', 'stock', 'rating', 'reviews_count']);

        return Inertia::render('storefront/home', [
            'store' => $this->storePayload($store),
            'categories' => $categories,
            'featured' => $products->map(fn (Product $p) => $this->productCardPayload($p)),
        ]);
    }

    public function catalog(Request $request, Store $store): Response
    {
        $this->assertStorefront($store);

        $products = $store->products()
            ->where('status', Product::STATUS_PUBLISHED)
            ->with(['images' => fn ($q) => $q->orderBy('sort_order')->limit(1), 'category:id,name,slug'])
            ->orderByDesc('created_at')
            ->paginate(24)
            ->through(fn (Product $p) => $this->productCardPayload($p));

        return Inertia::render('storefront/catalog', [
            'store' => $this->storePayload($store),
            'products' => $products,
        ]);
    }

    public function product(Request $request, Store $store, string $productSlug): Response
    {
        $this->assertStorefront($store);

        /** @var Product $product */
        $product = $store->products()
            ->where('slug', $productSlug)
            ->where('status', Product::STATUS_PUBLISHED)
            ->with(['images', 'category:id,name,slug', 'variants.optionValues.option'])
            ->firstOrFail();

        return Inertia::render('storefront/product', [
            'store' => $this->storePayload($store),
            'product' => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'description' => $product->description,
                'price_xof' => $product->price_xof,
                'promo_price_xof' => $product->promo_price_xof,
                'effective_price_xof' => $product->effectivePriceXof(),
                'available_stock' => $this->stock->availableStock($product),
                'category' => $product->category?->only(['id', 'name', 'slug']),
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => $img->path ? '/storage/'.ltrim($img->path, '/') : null,
                    'alt_text' => $img->alt_text,
                ]),
                'variants' => $product->variants->map(fn ($v) => [
                    'id' => $v->id,
                    'sku' => $v->sku,
                    'price_xof' => $v->effectivePriceXof(),
                    'stock' => $this->stock->availableStock($product, $v),
                    'options' => $v->optionValues->map(fn ($ov) => [
                        'option' => $ov->option->name,
                        'value' => $ov->value,
                        'hex_color' => $ov->hex_color,
                    ]),
                ]),
            ],
        ]);
    }

    private function assertStorefront(Store $store): void
    {
        abort_unless($store->isActive(), 404);
    }

    private function storePayload(Store $store): array
    {
        return [
            'id' => $store->id,
            'slug' => $store->slug,
            'name' => $store->name,
            'description' => $store->description,
            'accent_color' => $store->accent_color,
            'theme' => $store->theme,
            'logo_text' => $store->logo_text,
        ];
    }

    private function productCardPayload(Product $p): array
    {
        return [
            'id' => $p->id,
            'slug' => $p->slug,
            'name' => $p->name,
            'price_xof' => $p->price_xof,
            'promo_price_xof' => $p->promo_price_xof,
            'effective_price_xof' => $p->effectivePriceXof(),
            'in_stock' => $this->stock->availableStock($p) > 0,
            'rating' => $p->rating,
            'reviews_count' => $p->reviews_count,
            'image' => $p->images->first()?->path
                ? '/storage/'.ltrim($p->images->first()->path, '/')
                : null,
            'category' => $p->category ? ['name' => $p->category->name, 'slug' => $p->category->slug] : null,
        ];
    }
}

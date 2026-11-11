<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\VariantRequest;
use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Services\CurrentStoreResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Manage options + option values + variants for a single product.
 *
 * All writes replace the entire set atomically (classic variant editor UX).
 * Existing variants referenced by orders are preserved indirectly via the
 * order_items snapshot — order_items references nullOnDelete, so removing a
 * variant here does not corrupt historical lines.
 */
class VariantController extends Controller
{
    public function __construct(private readonly CurrentStoreResolver $stores) {}

    public function edit(Request $request, Product $product): Response
    {
        Gate::authorize('update', $product);
        $store = $this->requireStore($request);
        $product->assertBelongsTo($store);

        $product->load(['options.values', 'variants.optionValues.option']);

        return Inertia::render('merchant/products/variants', [
            'currentStore' => $this->storePayload($store),
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price_xof' => $product->price_xof,
            ],
            'options' => $product->options->map(fn (ProductOption $o) => [
                'id' => $o->id,
                'name' => $o->name,
                'values' => $o->values->map(fn (ProductOptionValue $v) => [
                    'id' => $v->id,
                    'value' => $v->value,
                    'hex_color' => $v->hex_color,
                ]),
            ]),
            'variants' => $product->variants->map(fn (ProductVariant $v) => [
                'id' => $v->id,
                'sku' => $v->sku,
                'price_xof' => $v->price_xof,
                'stock' => $v->stock,
                'is_default' => $v->is_default,
                'option_values' => $v->optionValues->map(fn ($ov) => $ov->value)->values(),
            ]),
        ]);
    }

    public function update(VariantRequest $request, Product $product): RedirectResponse
    {
        Gate::authorize('update', $product);
        $store = $this->requireStore($request);
        $product->assertBelongsTo($store);

        $payload = $request->validated();

        DB::transaction(function () use ($product, $payload) {
            // Replace the whole options + variants set.
            $product->options()->delete();           // cascade deletes option_values
            $product->variants()->delete();          // cascade deletes pivot rows

            // Recreate options with their values.
            $valuesByKey = [];  // "optName::value" => ProductOptionValue
            foreach ($payload['options'] as $optIdx => $optInput) {
                $option = $product->options()->create([
                    'name' => $optInput['name'],
                    'sort_order' => $optIdx,
                ]);
                foreach ($optInput['values'] as $valIdx => $valInput) {
                    $value = $option->values()->create([
                        'value' => $valInput['value'],
                        'hex_color' => $valInput['hex_color'] ?? null,
                        'sort_order' => $valIdx,
                    ]);
                    $valuesByKey[$optInput['name'].'::'.$valInput['value']] = $value;
                }
            }

            // Recreate variants, binding to the just-created option_values.
            foreach ($payload['variants'] as $vIdx => $vInput) {
                $variant = $product->variants()->create([
                    'sku' => $vInput['sku'] ?? null,
                    'price_xof' => $vInput['price_xof'] ?? null,
                    'stock' => $vInput['stock'],
                    'is_default' => ! empty($vInput['is_default']),
                ]);
                $optionValueIds = [];
                foreach ($vInput['option_values'] as $optIdx => $val) {
                    $optName = $payload['options'][$optIdx]['name'];
                    $optionValueIds[] = $valuesByKey[$optName.'::'.$val]->id;
                }
                $variant->optionValues()->sync($optionValueIds);
            }
        });

        return redirect()
            ->route('merchant.products.variants.edit', $product)
            ->with('success', 'Variantes enregistrées.');
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        Gate::authorize('update', $product);
        $store = $this->requireStore($request);
        $product->assertBelongsTo($store);

        DB::transaction(function () use ($product) {
            $product->options()->delete();
            $product->variants()->delete();
        });

        return back()->with('success', 'Options et variantes supprimées.');
    }

    private function requireStore(Request $request): Store
    {
        $store = $this->stores->forUser($request->user());
        abort_unless($store, 404, 'Aucune boutique active.');
        return $store;
    }

    private function storePayload(Store $store): array
    {
        return ['id' => $store->id, 'slug' => $store->slug, 'name' => $store->name];
    }
}

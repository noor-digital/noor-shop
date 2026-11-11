<?php

namespace App\Http\Requests\Merchant;

use App\Models\Product;
use App\Services\CurrentStoreResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    private ?int $currentStoreId = null;

    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isMerchant();
    }

    protected function prepareForValidation(): void
    {
        $store = app(CurrentStoreResolver::class)->forUser($this->user());
        abort_unless($store, 404, 'Aucune boutique active.');
        $this->currentStoreId = $store->id;
    }

    public function currentStoreId(): int
    {
        abort_unless($this->currentStoreId, 404);
        return $this->currentStoreId;
    }

    public function rules(): array
    {
        $storeId = $this->currentStoreId;
        /** @var Product|null $product */
        $product = $this->route('product');

        return [
            'name' => ['required', 'string', 'max:150'],
            'slug' => [
                'nullable',
                'string',
                'max:150',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('products', 'slug')
                    ->where(fn ($q) => $q->where('store_id', $storeId))
                    ->ignore($product?->id),
            ],
            'description' => ['nullable', 'string', 'max:5000'],
            'price_xof' => ['required', 'integer', 'min:0', 'max:999999999'],
            'promo_price_xof' => ['nullable', 'integer', 'min:0', 'lt:price_xof'],
            'stock' => ['required', 'integer', 'min:0', 'max:999999'],
            'status' => ['required', Rule::in([Product::STATUS_DRAFT, Product::STATUS_PUBLISHED, Product::STATUS_ARCHIVED])],
            // Category id must be validated against the current store to prevent
            // smuggling another merchant's category in.
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->where(fn ($q) => $q->where('store_id', $storeId)),
            ],
            // Image upload is optional in Phase 1B — stored via Storage.
            'images' => ['sometimes', 'array', 'max:8'],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    public function validatedWithSlug(): array
    {
        $data = $this->validated();
        $data['slug'] = ($data['slug'] ?? null) ?: Str::slug($data['name']);
        unset($data['images']);
        return $data;
    }
}

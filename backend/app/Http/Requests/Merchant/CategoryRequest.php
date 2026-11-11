<?php

namespace App\Http\Requests\Merchant;

use App\Models\Category;
use App\Services\CurrentStoreResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Validation for Category create/update.
 *
 * Note: `store_id` is NEVER read from the request. The current store is
 * resolved from the session via CurrentStoreResolver in prepareForValidation
 * and stashed under `_current_store_id` on the request so validation rules
 * can reference it. If a payload tries to assert a `store_id`, it is
 * silently ignored.
 */
class CategoryRequest extends FormRequest
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
        /** @var Category|null $category */
        $category = $this->route('category');

        return [
            'name' => ['required', 'string', 'max:120'],
            'slug' => [
                'nullable',
                'string',
                'max:120',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('categories', 'slug')
                    ->where(fn ($q) => $q->where('store_id', $storeId))
                    ->ignore($category?->id),
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
        ];
    }

    public function validatedWithSlug(): array
    {
        $data = $this->validated();
        $data['slug'] = ($data['slug'] ?? null) ?: Str::slug($data['name']);
        return $data;
    }
}

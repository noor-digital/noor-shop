<?php

namespace App\Http\Requests\Merchant;

use App\Models\Product;
use App\Services\CurrentStoreResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates a full set of options / values / variants submitted for a single
 * product. The merchant's current store is resolved server-side; the product
 * must belong to that store — enforced in the controller.
 *
 * Payload shape (JSON submitted by the variant editor):
 * {
 *   "options": [
 *     { "name": "Taille", "values": [{"value": "S"}, {"value": "M"}] },
 *     { "name": "Couleur", "values": [{"value": "Noir", "hex_color": "#000"}] }
 *   ],
 *   "variants": [
 *     { "sku": "SKU-001", "price_xof": 42000, "stock": 10, "is_default": true,
 *       "option_values": ["S", "Noir"] }
 *   ]
 * }
 *
 * The `option_values` array on each variant lists the VALUE strings in the
 * order of the matching options. The controller resolves them to ids after
 * persisting options + values.
 */
class VariantRequest extends FormRequest
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
        return [
            'options' => ['required', 'array', 'min:1', 'max:5'],
            'options.*.name' => ['required', 'string', 'max:60'],
            'options.*.values' => ['required', 'array', 'min:1', 'max:30'],
            'options.*.values.*.value' => ['required', 'string', 'max:60'],
            'options.*.values.*.hex_color' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],

            'variants' => ['required', 'array', 'min:1', 'max:200'],
            'variants.*.sku' => ['nullable', 'string', 'max:100'],
            'variants.*.price_xof' => ['nullable', 'integer', 'min:0', 'max:999999999'],
            'variants.*.stock' => ['required', 'integer', 'min:0', 'max:999999'],
            'variants.*.is_default' => ['sometimes', 'boolean'],
            'variants.*.option_values' => ['required', 'array', 'min:1'],
            'variants.*.option_values.*' => ['required', 'string', 'max:60'],
        ];
    }

    /**
     * After the base rules pass, enforce two cross-field invariants:
     *  - each variant's option_values array length matches the number of options
     *  - no two variants carry the same ordered tuple of option values
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $options = $this->input('options', []);
            $variants = $this->input('variants', []);
            $expected = count($options);

            $seen = [];
            foreach ($variants as $idx => $variant) {
                $values = $variant['option_values'] ?? [];
                if (count($values) !== $expected) {
                    $v->errors()->add(
                        "variants.$idx.option_values",
                        sprintf('Chaque variante doit avoir exactement %d valeur(s), une par option.', $expected)
                    );
                    continue;
                }
                $key = implode('|', $values);
                if (isset($seen[$key])) {
                    $v->errors()->add(
                        "variants.$idx.option_values",
                        'Deux variantes partagent la même combinaison de valeurs.'
                    );
                }
                $seen[$key] = true;

                // Each variant's values must exist in the corresponding option.
                foreach ($values as $optIdx => $val) {
                    $allowed = collect($options[$optIdx]['values'] ?? [])->pluck('value')->all();
                    if (! in_array($val, $allowed, true)) {
                        $v->errors()->add(
                            "variants.$idx.option_values.$optIdx",
                            sprintf('Valeur "%s" inconnue pour l\'option "%s".', $val, $options[$optIdx]['name'] ?? '?')
                        );
                    }
                }
            }

            // At most ONE default variant.
            $defaults = collect($variants)->filter(fn ($x) => ! empty($x['is_default']))->count();
            if ($defaults > 1) {
                $v->errors()->add('variants', 'Une seule variante peut être marquée par défaut.');
            }
        });
    }
}

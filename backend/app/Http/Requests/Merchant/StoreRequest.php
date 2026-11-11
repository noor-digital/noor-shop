<?php

namespace App\Http\Requests\Merchant;

use App\Models\Store;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isMerchant();
    }

    public function rules(): array
    {
        /** @var Store|null $store */
        $store = $this->route('store');

        return [
            'name' => ['required', 'string', 'max:120'],
            'slug' => [
                'nullable', 'string', 'max:64',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('stores', 'slug')->ignore($store?->id),
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'theme' => ['required', Rule::in([
                Store::THEME_MARBLE, Store::THEME_EDITORIAL, Store::THEME_GALLERY,
            ])],
            'accent_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'logo_text' => ['nullable', 'string', 'max:4'],
            'phone' => ['nullable', 'string', 'max:32'],
            'city' => ['nullable', 'string', 'max:80'],
            'address' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function validatedWithSlug(): array
    {
        $data = $this->validated();
        $data['slug'] = ($data['slug'] ?? null) ?: Str::slug($data['name']);
        return $data;
    }
}

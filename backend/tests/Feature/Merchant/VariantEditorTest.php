<?php

namespace Tests\Feature\Merchant;

use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VariantEditorTest extends TestCase
{
    use RefreshDatabase;

    private function merchant(): array
    {
        $user = User::factory()->create([
            'role' => User::ROLE_MERCHANT,
            'email_verified_at' => now(),
        ]);
        $store = Store::factory()->for($user, 'owner')->create();
        $product = Product::factory()->for($store)->create();
        return [$user, $store, $product];
    }

    public function test_merchant_can_create_variants_through_the_editor(): void
    {
        [$user, , $product] = $this->merchant();

        $this->actingAs($user)
            ->put("/merchant/products/{$product->id}/variants", [
                'options' => [
                    ['name' => 'Taille', 'values' => [['value' => 'S'], ['value' => 'M']]],
                    ['name' => 'Couleur', 'values' => [['value' => 'Noir', 'hex_color' => '#000000']]],
                ],
                'variants' => [
                    ['sku' => 'SKU-SM-BLK', 'price_xof' => 42000, 'stock' => 10, 'is_default' => true,  'option_values' => ['S', 'Noir']],
                    ['sku' => 'SKU-MD-BLK', 'price_xof' => 42000, 'stock' => 5,  'is_default' => false, 'option_values' => ['M', 'Noir']],
                ],
            ])
            ->assertRedirect();

        $this->assertSame(2, ProductOption::where('product_id', $product->id)->count());
        $this->assertSame(3, ProductOptionValue::count());
        $this->assertSame(2, ProductVariant::where('product_id', $product->id)->count());
        $this->assertSame(1, ProductVariant::where('product_id', $product->id)->where('is_default', true)->count());
    }

    public function test_duplicate_variant_combinations_are_rejected(): void
    {
        [$user, , $product] = $this->merchant();

        $this->actingAs($user)
            ->put("/merchant/products/{$product->id}/variants", [
                'options' => [['name' => 'Taille', 'values' => [['value' => 'M']]]],
                'variants' => [
                    ['stock' => 1, 'option_values' => ['M']],
                    ['stock' => 1, 'option_values' => ['M']],
                ],
            ])
            ->assertSessionHasErrors('variants.1.option_values');
    }

    public function test_variant_with_wrong_number_of_values_is_rejected(): void
    {
        [$user, , $product] = $this->merchant();

        $this->actingAs($user)
            ->put("/merchant/products/{$product->id}/variants", [
                'options' => [
                    ['name' => 'Taille', 'values' => [['value' => 'M']]],
                    ['name' => 'Couleur', 'values' => [['value' => 'Rouge']]],
                ],
                'variants' => [
                    ['stock' => 1, 'option_values' => ['M']], // missing colour
                ],
            ])
            ->assertSessionHasErrors('variants.0.option_values');
    }

    public function test_variant_value_must_exist_in_matching_option(): void
    {
        [$user, , $product] = $this->merchant();

        $this->actingAs($user)
            ->put("/merchant/products/{$product->id}/variants", [
                'options' => [['name' => 'Taille', 'values' => [['value' => 'M']]]],
                'variants' => [['stock' => 1, 'option_values' => ['XL']]], // XL not declared
            ])
            ->assertSessionHasErrors('variants.0.option_values.0');
    }

    public function test_more_than_one_default_variant_rejected(): void
    {
        [$user, , $product] = $this->merchant();

        $this->actingAs($user)
            ->put("/merchant/products/{$product->id}/variants", [
                'options' => [['name' => 'Taille', 'values' => [['value' => 'M'], ['value' => 'L']]]],
                'variants' => [
                    ['stock' => 1, 'is_default' => true, 'option_values' => ['M']],
                    ['stock' => 1, 'is_default' => true, 'option_values' => ['L']],
                ],
            ])
            ->assertSessionHasErrors('variants');
    }

    public function test_cross_store_variant_write_is_refused(): void
    {
        [$m1,] = $this->merchant();
        [, , $foreign] = $this->merchant();

        $response = $this->actingAs($m1)
            ->put("/merchant/products/{$foreign->id}/variants", [
                'options' => [['name' => 'Taille', 'values' => [['value' => 'M']]]],
                'variants' => [['stock' => 1, 'option_values' => ['M']]],
            ]);

        $this->assertTrue(in_array($response->status(), [403, 404], true), 'Expected refused.');
        $this->assertSame(0, ProductVariant::where('product_id', $foreign->id)->count());
    }
}

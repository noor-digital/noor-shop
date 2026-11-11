<?php

namespace Tests\Feature\Merchant;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductIsolationTest extends TestCase
{
    use RefreshDatabase;

    private function merchant(): array
    {
        $user = User::factory()->create([
            'role' => User::ROLE_MERCHANT,
            'email_verified_at' => now(),
        ]);
        $store = Store::factory()->for($user, 'owner')->create();
        return [$user, $store];
    }

    public function test_a_merchant_only_lists_their_own_products(): void
    {
        [$m1, $s1] = $this->merchant();
        [, $s2] = $this->merchant();
        [, $s3] = $this->merchant();

        Product::factory()->for($s1)->create(['name' => 'Mine']);
        Product::factory()->for($s2)->create(['name' => 'Theirs 1']);
        Product::factory()->for($s3)->create(['name' => 'Theirs 2']);

        $this->actingAs($m1)
            ->get('/merchant/products')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('merchant/products/index')
                ->has('products.data', 1)
                ->where('products.data.0.name', 'Mine')
            );
    }

    public function test_editing_another_merchant_product_is_refused(): void
    {
        [$m1, $s1] = $this->merchant();
        [, $s2] = $this->merchant();

        Product::factory()->for($s1)->create();
        $foreign = Product::factory()->for($s2)->create(['name' => 'Foreign']);

        $editResponse = $this->actingAs($m1)->get("/merchant/products/{$foreign->id}/edit");
        $this->assertTrue(in_array($editResponse->status(), [403, 404], true), 'Expected edit refused.');

        $updateResponse = $this->actingAs($m1)->put("/merchant/products/{$foreign->id}", [
            'name' => 'Pwned',
            'price_xof' => 1,
            'stock' => 1,
            'status' => 'published',
        ]);
        $this->assertTrue(in_array($updateResponse->status(), [403, 404], true), 'Expected update refused.');

        $this->assertSame('Foreign', $foreign->fresh()->name);
    }

    public function test_deleting_another_merchant_product_is_refused(): void
    {
        [$m1, $s1] = $this->merchant();
        [, $s2] = $this->merchant();

        Product::factory()->for($s1)->create();
        $foreign = Product::factory()->for($s2)->create();

        $response = $this->actingAs($m1)->delete("/merchant/products/{$foreign->id}");

        $this->assertTrue(in_array($response->status(), [403, 404], true), 'Expected delete refused.');
        $this->assertDatabaseHas('products', [
            'id' => $foreign->id,
            'deleted_at' => null,
        ]);
    }

    public function test_a_product_cannot_be_attached_to_another_store_category(): void
    {
        [$m1, $s1] = $this->merchant();
        [, $s2] = $this->merchant();

        $foreignCategory = Category::factory()->for($s2)->create();

        $this->actingAs($m1)
            ->post('/merchant/products', [
                'name' => 'Attack',
                'price_xof' => 1000,
                'stock' => 1,
                'status' => 'published',
                'category_id' => $foreignCategory->id,
            ])
            ->assertSessionHasErrors('category_id');

        $this->assertDatabaseMissing('products', ['name' => 'Attack']);
    }

    public function test_forged_store_id_in_product_payload_is_ignored(): void
    {
        [$m1, $s1] = $this->merchant();
        [, $s2] = $this->merchant();

        $this->actingAs($m1)
            ->post('/merchant/products', [
                'name' => 'Injected',
                'price_xof' => 1000,
                'stock' => 5,
                'status' => 'published',
                'store_id' => $s2->id,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('products', ['name' => 'Injected', 'store_id' => $s1->id]);
        $this->assertDatabaseMissing('products', ['name' => 'Injected', 'store_id' => $s2->id]);
    }
}

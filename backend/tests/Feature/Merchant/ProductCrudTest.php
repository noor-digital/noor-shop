<?php

namespace Tests\Feature\Merchant;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductCrudTest extends TestCase
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

    public function test_a_merchant_can_create_a_product_in_their_own_store(): void
    {
        [$user, $store] = $this->merchant();
        $category = Category::factory()->for($store)->create();

        $this->actingAs($user)
            ->post('/merchant/products', [
                'name' => 'Boubou wax',
                'price_xof' => 42000,
                'stock' => 10,
                'status' => 'published',
                'category_id' => $category->id,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('products', [
            'store_id' => $store->id,
            'name' => 'Boubou wax',
            'price_xof' => 42000,
            'stock' => 10,
            'status' => 'published',
            'category_id' => $category->id,
        ]);
    }

    public function test_product_promo_price_must_be_strictly_less_than_price(): void
    {
        [$user] = $this->merchant();

        $this->actingAs($user)
            ->post('/merchant/products', [
                'name' => 'Promo check',
                'price_xof' => 10000,
                'promo_price_xof' => 10000,
                'stock' => 1,
                'status' => 'published',
            ])
            ->assertSessionHasErrors('promo_price_xof');
    }

    public function test_product_required_fields_are_validated(): void
    {
        [$user] = $this->merchant();

        $this->actingAs($user)
            ->post('/merchant/products', [])
            ->assertSessionHasErrors(['name', 'price_xof', 'stock', 'status']);
    }

    public function test_product_status_must_be_one_of_the_allowed_values(): void
    {
        [$user] = $this->merchant();

        $this->actingAs($user)
            ->post('/merchant/products', [
                'name' => 'Bad status',
                'price_xof' => 1000,
                'stock' => 1,
                'status' => 'sold-out',
            ])
            ->assertSessionHasErrors('status');
    }

    public function test_a_merchant_can_update_their_own_product(): void
    {
        [$user, $store] = $this->merchant();
        $product = Product::factory()->for($store)->create(['name' => 'Old']);

        $this->actingAs($user)
            ->put("/merchant/products/{$product->id}", [
                'name' => 'New',
                'price_xof' => 50000,
                'stock' => 3,
                'status' => 'published',
            ])
            ->assertRedirect();

        $product->refresh();
        $this->assertSame('New', $product->name);
        $this->assertSame(50000, $product->price_xof);
        $this->assertSame(3, $product->stock);
    }

    public function test_a_merchant_can_delete_their_own_product(): void
    {
        [$user, $store] = $this->merchant();
        $product = Product::factory()->for($store)->create();

        $this->actingAs($user)
            ->delete("/merchant/products/{$product->id}")
            ->assertRedirect('/merchant/products');

        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }

    public function test_product_image_upload_stores_file_and_record(): void
    {
        Storage::fake('public');

        [$user, $store] = $this->merchant();
        // Use create() instead of image() so we don't depend on the GD PHP
        // extension — the `image` validator only inspects the MIME type.
        $image = UploadedFile::fake()->create('photo.jpg', 100, 'image/jpeg');

        $this->actingAs($user)
            ->post('/merchant/products', [
                'name' => 'With image',
                'price_xof' => 1000,
                'stock' => 1,
                'status' => 'published',
                'images' => [$image],
            ])
            ->assertRedirect();

        $product = Product::where('name', 'With image')->firstOrFail();
        $this->assertCount(1, $product->images);

        Storage::disk('public')->assertExists($product->images->first()->path);
    }

    public function test_image_upload_rejects_non_image_files(): void
    {
        Storage::fake('public');

        [$user] = $this->merchant();
        $pdf = UploadedFile::fake()->create('invoice.pdf', 100, 'application/pdf');

        $this->actingAs($user)
            ->post('/merchant/products', [
                'name' => 'Pdf attempt',
                'price_xof' => 1000,
                'stock' => 1,
                'status' => 'published',
                'images' => [$pdf],
            ])
            ->assertSessionHasErrors('images.0');
    }
}

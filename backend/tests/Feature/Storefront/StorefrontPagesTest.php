<?php

namespace Tests\Feature\Storefront;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorefrontPagesTest extends TestCase
{
    use RefreshDatabase;

    private function store(): Store
    {
        $user = User::factory()->create(['role' => User::ROLE_MERCHANT, 'email_verified_at' => now()]);
        return Store::factory()->for($user, 'owner')->create();
    }

    public function test_home_page_lists_only_published_products(): void
    {
        $store = $this->store();
        Product::factory()->for($store)->create(['name' => 'Published A', 'status' => Product::STATUS_PUBLISHED]);
        Product::factory()->for($store)->create(['name' => 'Draft',       'status' => Product::STATUS_DRAFT]);
        Product::factory()->for($store)->create(['name' => 'Archived',    'status' => Product::STATUS_ARCHIVED]);

        $this->get("/boutique/{$store->slug}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('storefront/home')
                ->has('featured', 1)
                ->where('featured.0.name', 'Published A')
            );
    }

    public function test_catalog_page_paginates_products_of_one_store_only(): void
    {
        $s1 = $this->store();
        $s2 = $this->store();
        Product::factory()->count(3)->for($s1)->create(['status' => Product::STATUS_PUBLISHED]);
        Product::factory()->count(2)->for($s2)->create(['status' => Product::STATUS_PUBLISHED]);

        $this->get("/boutique/{$s1->slug}/catalogue")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('storefront/catalog')
                ->has('products.data', 3)
            );
    }

    public function test_product_page_returns_404_for_unpublished_product(): void
    {
        $store = $this->store();
        $draft = Product::factory()->for($store)->create([
            'slug' => 'secret',
            'status' => Product::STATUS_DRAFT,
        ]);

        $this->get("/boutique/{$store->slug}/produit/{$draft->slug}")->assertNotFound();
    }

    public function test_product_page_returns_404_for_product_in_another_store(): void
    {
        $s1 = $this->store();
        $s2 = $this->store();
        $product = Product::factory()->for($s2)->create([
            'slug' => 'from-s2',
            'status' => Product::STATUS_PUBLISHED,
        ]);

        // Same slug tried on store 1 → must be 404 (isolation).
        $this->get("/boutique/{$s1->slug}/produit/from-s2")->assertNotFound();

        // Correct store serves it.
        $this->get("/boutique/{$s2->slug}/produit/from-s2")->assertOk();
    }

    public function test_suspended_store_is_404_on_every_public_route(): void
    {
        $store = $this->store();
        $product = Product::factory()->for($store)->create(['status' => Product::STATUS_PUBLISHED]);
        $store->forceFill(['status' => Store::STATUS_SUSPENDED])->save();

        $this->get("/boutique/{$store->slug}")->assertNotFound();
        $this->get("/boutique/{$store->slug}/catalogue")->assertNotFound();
        $this->get("/boutique/{$store->slug}/produit/{$product->slug}")->assertNotFound();
    }
}

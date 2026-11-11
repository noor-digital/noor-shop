<?php

namespace Tests\Feature\Merchant;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryCrudTest extends TestCase
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

    public function test_a_merchant_can_create_a_category(): void
    {
        [$user, $store] = $this->merchant();

        $this->actingAs($user)
            ->post('/merchant/categories', ['name' => 'Chaussures'])
            ->assertRedirect('/merchant/categories');

        $this->assertDatabaseHas('categories', [
            'store_id' => $store->id,
            'name' => 'Chaussures',
            'slug' => 'chaussures',
        ]);
    }

    public function test_category_name_is_required(): void
    {
        [$user] = $this->merchant();

        $this->actingAs($user)
            ->post('/merchant/categories', [])
            ->assertSessionHasErrors('name');
    }

    public function test_category_slug_must_be_a_valid_kebab_case_slug(): void
    {
        [$user] = $this->merchant();

        $this->actingAs($user)
            ->post('/merchant/categories', ['name' => 'Test', 'slug' => 'NOT valid!'])
            ->assertSessionHasErrors('slug');
    }

    public function test_category_slug_uniqueness_is_per_store(): void
    {
        [$u1, $s1] = $this->merchant();
        [$u2, $s2] = $this->merchant();

        Category::factory()->for($s1)->create(['slug' => 'chaussures']);

        $this->actingAs($u2)
            ->post('/merchant/categories', ['name' => 'Chaussures', 'slug' => 'chaussures'])
            ->assertRedirect('/merchant/categories');

        $this->assertDatabaseHas('categories', ['store_id' => $s2->id, 'slug' => 'chaussures']);

        $this->actingAs($u1)
            ->post('/merchant/categories', ['name' => 'Chaussures', 'slug' => 'chaussures'])
            ->assertSessionHasErrors('slug');
    }

    public function test_a_merchant_can_update_their_own_category(): void
    {
        [$user, $store] = $this->merchant();
        $category = Category::factory()->for($store)->create(['name' => 'Old']);

        $this->actingAs($user)
            ->put("/merchant/categories/{$category->id}", ['name' => 'New'])
            ->assertRedirect('/merchant/categories');

        $this->assertSame('New', $category->fresh()->name);
    }

    public function test_deleting_a_category_with_products_is_refused(): void
    {
        [$user, $store] = $this->merchant();
        $category = Category::factory()->for($store)->create();
        Product::factory()->for($store)->create(['category_id' => $category->id]);

        $this->actingAs($user)
            ->delete("/merchant/categories/{$category->id}")
            ->assertSessionHasErrors('category');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'deleted_at' => null,
        ]);
    }

    public function test_an_empty_category_can_be_deleted(): void
    {
        [$user, $store] = $this->merchant();
        $category = Category::factory()->for($store)->create();

        $this->actingAs($user)
            ->delete("/merchant/categories/{$category->id}")
            ->assertRedirect('/merchant/categories');

        $this->assertSoftDeleted('categories', ['id' => $category->id]);
    }
}

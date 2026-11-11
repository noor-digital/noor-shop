<?php

namespace Tests\Feature\Merchant;

use App\Models\Category;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Three merchants, three stores — each only sees their own category.
 * Direct access to another merchant's category is refused and a forged
 * store_id in the payload cannot override the server-side scope.
 */
class CategoryIsolationTest extends TestCase
{
    use RefreshDatabase;

    private function makeMerchantWithStore(): array
    {
        $user = User::factory()->create([
            'role' => User::ROLE_MERCHANT,
            'email_verified_at' => now(),
        ]);
        $store = Store::factory()->for($user, 'owner')->create();
        return [$user, $store];
    }

    public function test_a_merchant_only_sees_their_own_categories(): void
    {
        [$m1, $s1] = $this->makeMerchantWithStore();
        [, $s2] = $this->makeMerchantWithStore();
        [, $s3] = $this->makeMerchantWithStore();

        $mine = Category::factory()->for($s1)->create(['name' => 'Chaussures']);
        Category::factory()->for($s2)->create(['name' => 'Soins visage']);
        Category::factory()->for($s3)->create(['name' => 'Décoration']);

        $this->actingAs($m1)
            ->get('/merchant/categories')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('merchant/categories/index')
                ->has('categories', 1)
                ->where('categories.0.name', $mine->name)
            );
    }

    public function test_updating_another_merchant_category_is_refused(): void
    {
        [$m1, $s1] = $this->makeMerchantWithStore();
        [, $s2] = $this->makeMerchantWithStore();

        Category::factory()->for($s1)->create();
        $foreign = Category::factory()->for($s2)->create(['name' => 'Foreign']);

        // Either 403 (policy) or 404 (route binding) is acceptable — both
        // refuse access. The important invariant is that no mutation happens.
        $response = $this->actingAs($m1)
            ->put("/merchant/categories/{$foreign->id}", ['name' => 'Pwned']);

        $this->assertTrue(in_array($response->status(), [403, 404], true), 'Expected access refused.');
        $this->assertSame('Foreign', $foreign->fresh()->name);
    }

    public function test_deleting_another_merchant_category_is_refused(): void
    {
        [$m1, $s1] = $this->makeMerchantWithStore();
        [, $s2] = $this->makeMerchantWithStore();

        Category::factory()->for($s1)->create();
        $foreign = Category::factory()->for($s2)->create();

        $response = $this->actingAs($m1)->delete("/merchant/categories/{$foreign->id}");

        $this->assertTrue(in_array($response->status(), [403, 404], true), 'Expected access refused.');
        $this->assertDatabaseHas('categories', [
            'id' => $foreign->id,
            'deleted_at' => null,
        ]);
    }

    public function test_forged_store_id_in_payload_cannot_override_the_current_store(): void
    {
        [$m1, $s1] = $this->makeMerchantWithStore();
        [, $s2] = $this->makeMerchantWithStore();

        $this->actingAs($m1)
            ->post('/merchant/categories', [
                'name' => 'Injected',
                'store_id' => $s2->id, // should be ignored by the server
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('categories', ['name' => 'Injected', 'store_id' => $s1->id]);
        $this->assertDatabaseMissing('categories', ['name' => 'Injected', 'store_id' => $s2->id]);
    }
}

<?php

namespace Tests\Feature\Merchant;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_merchant_routes(): void
    {
        $this->get('/merchant')->assertRedirect('/login');
        $this->get('/merchant/categories')->assertRedirect('/login');
        $this->get('/merchant/products')->assertRedirect('/login');
    }

    public function test_platform_admins_cannot_access_merchant_routes(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_PLATFORM_ADMIN,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin)->get('/merchant')->assertForbidden();
        $this->actingAs($admin)->get('/merchant/categories')->assertForbidden();
        $this->actingAs($admin)->get('/merchant/products')->assertForbidden();
    }

    public function test_merchants_cannot_access_platform_routes(): void
    {
        $merchant = User::factory()->create([
            'role' => User::ROLE_MERCHANT,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($merchant)->get('/platform')->assertForbidden();
    }
}

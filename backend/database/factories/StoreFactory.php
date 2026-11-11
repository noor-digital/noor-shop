<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Store>
 */
class StoreFactory extends Factory
{
    protected $model = Store::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->company();
        return [
            'owner_user_id' => User::factory(),
            'slug' => Str::slug($name).'-'.Str::random(4),
            'name' => $name,
            'description' => $this->faker->sentence(),
            'theme' => Store::THEME_MARBLE,
            'accent_color' => '#5433EB',
            'logo_text' => strtoupper(Str::substr($name, 0, 2)),
            'status' => Store::STATUS_ACTIVE,
        ];
    }

    public function suspended(): static
    {
        return $this->state(fn () => ['status' => Store::STATUS_SUSPENDED]);
    }
}

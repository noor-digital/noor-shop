<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);
        return [
            'store_id' => Store::factory(),
            'category_id' => null,
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.Str::random(4),
            'description' => $this->faker->paragraph(),
            'price_xof' => $this->faker->numberBetween(1_000, 200_000),
            'promo_price_xof' => null,
            'stock' => $this->faker->numberBetween(0, 50),
            'status' => Product::STATUS_PUBLISHED,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['status' => Product::STATUS_DRAFT]);
    }
}

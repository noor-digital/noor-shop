<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(2, true);
        return [
            'store_id' => Store::factory(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.Str::random(4),
            'description' => $this->faker->sentence(),
            'sort_order' => 0,
        ];
    }
}

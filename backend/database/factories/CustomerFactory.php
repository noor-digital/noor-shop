<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'store_id' => Store::factory(),
            'name' => $this->faker->name(),
            'phone' => '+22177' . $this->faker->unique()->numerify('#######'),
            'email' => $this->faker->safeEmail(),
            'orders_count' => 0,
            'total_spent_xof' => 0,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\DeliveryZone;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DeliveryZone>
 */
class DeliveryZoneFactory extends Factory
{
    protected $model = DeliveryZone::class;

    public function definition(): array
    {
        return [
            'store_id' => Store::factory(),
            'name' => $this->faker->randomElement(['Dakar centre', 'Banlieue', 'Thiès', 'Saly']),
            'fee_xof' => $this->faker->randomElement([2000, 3000, 4500]),
            'eta' => '24–72h',
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}

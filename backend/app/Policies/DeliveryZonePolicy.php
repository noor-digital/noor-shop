<?php

namespace App\Policies;

use App\Models\DeliveryZone;
use App\Models\User;

class DeliveryZonePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isMerchant() || $user->isPlatformAdmin();
    }

    public function view(User $user, DeliveryZone $zone): bool
    {
        return $this->isAllowed($user, $zone);
    }

    public function create(User $user): bool
    {
        return $user->isMerchant();
    }

    public function update(User $user, DeliveryZone $zone): bool
    {
        return $this->isAllowed($user, $zone);
    }

    public function delete(User $user, DeliveryZone $zone): bool
    {
        return $this->isAllowed($user, $zone);
    }

    private function isAllowed(User $user, DeliveryZone $zone): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }
        return $user->stores()->whereKey($zone->store_id)->exists();
    }
}

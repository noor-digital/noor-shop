<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isMerchant() || $user->isPlatformAdmin();
    }

    public function view(User $user, Order $order): bool
    {
        return $this->isAllowed($user, $order);
    }

    public function update(User $user, Order $order): bool
    {
        return $this->isAllowed($user, $order);
    }

    private function isAllowed(User $user, Order $order): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }
        return $user->stores()->whereKey($order->store_id)->exists();
    }
}

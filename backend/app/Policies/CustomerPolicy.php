<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isMerchant() || $user->isPlatformAdmin();
    }

    public function view(User $user, Customer $customer): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }
        return $user->stores()->whereKey($customer->store_id)->exists();
    }
}

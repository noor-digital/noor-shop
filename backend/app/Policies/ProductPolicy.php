<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isMerchant() || $user->isPlatformAdmin();
    }

    public function view(User $user, Product $product): bool
    {
        return $this->isAllowed($user, $product);
    }

    public function create(User $user): bool
    {
        return $user->isMerchant();
    }

    public function update(User $user, Product $product): bool
    {
        return $this->isAllowed($user, $product);
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->isAllowed($user, $product);
    }

    private function isAllowed(User $user, Product $product): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $user->stores()
            ->whereKey($product->store_id)
            ->exists();
    }
}

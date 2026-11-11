<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

/**
 * Authorises actions on a Category.
 *
 * The invariant: a category belongs to a store, that store belongs to a user.
 * Only the owner of that store (or a platform admin) may read or mutate the
 * category, regardless of what `store_id` a client-side payload tries to
 * assert.
 */
class CategoryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isMerchant() || $user->isPlatformAdmin();
    }

    public function view(User $user, Category $category): bool
    {
        return $this->isAllowed($user, $category);
    }

    public function create(User $user): bool
    {
        return $user->isMerchant();
    }

    public function update(User $user, Category $category): bool
    {
        return $this->isAllowed($user, $category);
    }

    public function delete(User $user, Category $category): bool
    {
        return $this->isAllowed($user, $category);
    }

    private function isAllowed(User $user, Category $category): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $user->stores()
            ->whereKey($category->store_id)
            ->exists();
    }
}

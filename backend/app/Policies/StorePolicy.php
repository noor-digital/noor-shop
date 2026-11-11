<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;

/**
 * Authorisation around a Store resource.
 * A merchant may only act on stores they own. Platform admins see everything.
 */
class StorePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isMerchant() || $user->isPlatformAdmin();
    }

    public function view(User $user, Store $store): bool
    {
        return $this->isOwnerOrAdmin($user, $store);
    }

    public function create(User $user): bool
    {
        return $user->isMerchant();
    }

    public function update(User $user, Store $store): bool
    {
        return $this->isOwnerOrAdmin($user, $store);
    }

    public function delete(User $user, Store $store): bool
    {
        return $this->isOwnerOrAdmin($user, $store);
    }

    /** Only platform admins may suspend a store. */
    public function suspend(User $user, Store $store): bool
    {
        return $user->isPlatformAdmin();
    }

    private function isOwnerOrAdmin(User $user, Store $store): bool
    {
        return $user->isPlatformAdmin() || $store->owner_user_id === $user->id;
    }
}

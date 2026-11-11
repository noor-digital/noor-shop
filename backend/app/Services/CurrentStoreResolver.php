<?php

namespace App\Services;

use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Resolves the "current store" context for a merchant.
 *
 * NOOR SHOP routes in the merchant area do not carry the store slug in their
 * URL (per cahier des charges §18.3). Instead, the current store is tracked
 * in the session, and defaults to the user's first active store on login or
 * if the previously selected store no longer belongs to them.
 *
 * The resolver NEVER trusts a `store_id` coming from the request body or
 * query string — only session-held values that have been validated against
 * the authenticated user's own stores.
 */
class CurrentStoreResolver
{
    public const SESSION_KEY = 'current_store_id';

    public function forUser(User $user): ?Store
    {
        $sessionStoreId = request()->session()->get(self::SESSION_KEY);

        if ($sessionStoreId) {
            /** @var Store|null $store */
            $store = $user->stores()
                ->where('id', $sessionStoreId)
                ->first();

            // Honour the session pick even when the store is suspended —
            // a merchant must keep access to their data under suspension
            // (cahier des charges §13.4).
            if ($store) {
                return $store;
            }
        }

        // Prefer active stores, but fall back to any non-trashed store
        // (including suspended ones) so the merchant workspace keeps working.
        return $user->stores()->active()->orderBy('id')->first()
            ?? $user->stores()->orderBy('id')->first();
    }

    /**
     * Switch the current store to the one identified by `$storeId`, but only
     * if it belongs to the authenticated user. Returns true on success.
     */
    public function switchTo(User $user, int $storeId, Request $request): bool
    {
        $owned = $user->stores()
            ->where('id', $storeId)
            ->active()
            ->exists();

        if (! $owned) {
            return false;
        }

        $request->session()->put(self::SESSION_KEY, $storeId);
        return true;
    }
}

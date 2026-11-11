<?php

namespace App\Models\Concerns;

use App\Models\Store;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Shared behaviour for every resource that lives inside a Store.
 *
 * Any model using this trait MUST have a `store_id` column. All CRUD
 * queries should flow through `Store::$relation()` so the scope is implicit;
 * when a direct lookup by id is unavoidable, call `::forStore($store)` first
 * so a request carrying a foreign id cannot escape its own store context.
 */
trait BelongsToStore
{
    /** @return BelongsTo<Store, self> */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Restrict a query to the rows owned by the given store.
     *
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeForStore(Builder $query, Store $store): Builder
    {
        return $query->where($this->getTable().'.store_id', $store->id);
    }

    /**
     * Guard helper — raises when the model does not belong to the given store.
     * Use inside controllers right after resolving a model via route binding,
     * before mutating state.
     */
    public function assertBelongsTo(Store $store): void
    {
        abort_unless($this->store_id === $store->id, 404);
    }
}

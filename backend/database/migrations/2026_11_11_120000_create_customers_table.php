<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')
                ->constrained('stores')
                ->cascadeOnDelete();
            $table->string('name');
            // Phone is the key identifier for a customer within a store.
            $table->string('phone', 32);
            $table->string('email')->nullable();
            // Cached aggregates (updated by OrderService on completion).
            $table->unsignedInteger('orders_count')->default(0);
            $table->unsignedBigInteger('total_spent_xof')->default(0);
            $table->timestamp('last_order_at')->nullable();
            $table->timestamps();

            // Phone is unique per store (same person may be a customer of
            // several merchants with the same number).
            $table->unique(['store_id', 'phone']);
            $table->index(['store_id', 'last_order_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};

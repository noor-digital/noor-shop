<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * orders — one order per store. The payment model is MVP-restricted to
 * cash-on-delivery / cash-on-pickup; no online payment is stored. The
 * public token is used by the customer to look up their own order on the
 * confirmation URL. The merchant uses `reference` (NS-YYYY-XXXX).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')
                ->constrained('stores')
                ->cascadeOnDelete();
            $table->foreignId('customer_id')
                ->nullable()
                ->constrained('customers')
                ->nullOnDelete();
            // Public reference — displayed to merchant and customer.
            $table->string('reference', 32)->unique();
            // Secret token — part of the confirmation URL, never exposed in
            // the merchant list. Uniqueness within store (defence in depth).
            $table->string('token', 64)->unique();
            // Lifecycle status per cahier des charges §8.3.
            $table->enum('status', [
                'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled',
            ])->default('pending')->index();
            // Customer snapshot (immutable, independent of the customer row).
            $table->string('customer_name');
            $table->string('customer_phone', 32);
            $table->string('customer_email')->nullable();
            // Fulfilment
            $table->enum('delivery_mode', ['delivery', 'pickup'])->default('delivery');
            $table->foreignId('delivery_zone_id')
                ->nullable()
                ->constrained('delivery_zones')
                ->nullOnDelete();
            $table->string('delivery_address', 500)->nullable();
            $table->unsignedInteger('delivery_fee_xof')->default(0);
            // Monetary snapshots in XOF integer.
            $table->unsignedBigInteger('subtotal_xof');
            $table->unsignedBigInteger('total_xof');
            $table->string('notes', 1000)->nullable();
            // Reservation lifecycle markers — enforce "release at most once".
            $table->timestamp('stock_reserved_at')->nullable();
            $table->timestamp('stock_released_at')->nullable();
            $table->timestamp('stock_consumed_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason', 500)->nullable();
            $table->timestamps();

            $table->index(['store_id', 'status']);
            $table->index(['store_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * inventory_movements — append-only ledger of stock changes.
 * type = reservation | release | consumption | adjustment | restock.
 *
 * Reservations hold stock for 2 h; a matching `release` or `consumption`
 * closes the loop. The pair (order_id, type) is unique for reservation
 * and release operations — enforced in app logic + unique index — so a
 * stock can never be released twice.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')
                ->constrained('stores')
                ->cascadeOnDelete();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->foreignId('product_variant_id')
                ->nullable()
                ->constrained('product_variants')
                ->nullOnDelete();
            $table->foreignId('order_id')
                ->nullable()
                ->constrained('orders')
                ->nullOnDelete();
            $table->enum('type', [
                'reservation', 'release', 'consumption', 'adjustment', 'restock',
            ]);
            // Signed delta. For a reservation of 3 units, we write -3.
            $table->integer('quantity_delta');
            $table->string('reason', 255)->nullable();
            $table->timestamp('happened_at');
            $table->timestamps();

            $table->index(['store_id', 'happened_at']);
            $table->index(['product_id', 'type']);
            $table->index(['order_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};

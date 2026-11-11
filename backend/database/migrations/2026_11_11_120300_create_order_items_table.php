<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')
                ->constrained('orders')
                ->cascadeOnDelete();
            // Products / variants are referenced for traceability but their
            // deletion must not wipe a historical line (nullOnDelete).
            $table->foreignId('product_id')
                ->nullable()
                ->constrained('products')
                ->nullOnDelete();
            $table->foreignId('product_variant_id')
                ->nullable()
                ->constrained('product_variants')
                ->nullOnDelete();
            // Immutable snapshot of what the customer actually ordered.
            $table->string('product_name');
            $table->string('variant_label')->nullable();
            $table->unsignedInteger('unit_price_xof');
            $table->unsignedSmallInteger('quantity');
            $table->unsignedBigInteger('line_total_xof');
            $table->timestamps();

            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};

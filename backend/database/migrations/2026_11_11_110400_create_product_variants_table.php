<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            // Store SKU; unique within a product, reused across stores is OK.
            $table->string('sku', 100)->nullable();
            // Overrides product.price_xof when present.
            $table->unsignedInteger('price_xof')->nullable();
            // Each variant tracks its own stock.
            $table->unsignedInteger('stock')->default(0);
            // Which variant is picked by default on the storefront.
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->unique(['product_id', 'sku']);
            $table->index(['product_id', 'is_default']);
        });

        // Pivot — which option values a variant is bound to.
        // A variant combining "Taille=M" + "Couleur=Noir" has two rows here.
        Schema::create('product_variant_option_value', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')
                ->constrained('product_variants')
                ->cascadeOnDelete();
            $table->foreignId('product_option_value_id')
                ->constrained('product_option_values')
                ->cascadeOnDelete();

            $table->unique(
                ['product_variant_id', 'product_option_value_id'],
                'variant_option_value_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variant_option_value');
        Schema::dropIfExists('product_variants');
    }
};

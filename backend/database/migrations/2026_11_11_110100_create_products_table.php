<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')
                ->constrained('stores')
                ->cascadeOnDelete();
            // Nullable — a product may be uncategorised while being drafted.
            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();
            $table->string('name');
            $table->string('slug', 150);
            $table->text('description')->nullable();
            // Prices in XOF integer. promo_price may be null.
            $table->unsignedInteger('price_xof');
            $table->unsignedInteger('promo_price_xof')->nullable();
            // Stock on the product itself — overridden by product_variants when
            // variants exist (see product_variants.stock).
            $table->unsignedInteger('stock')->default(0);
            $table->enum('status', ['draft', 'published', 'archived'])
                ->default('draft');
            // Cached aggregates (rating is a fictional stat for now).
            $table->decimal('rating', 2, 1)->nullable();
            $table->unsignedInteger('reviews_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['store_id', 'slug']);
            $table->index(['store_id', 'status']);
            $table->index(['store_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Option types for a product, e.g. "Taille", "Couleur".
        Schema::create('product_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->string('name', 60);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['product_id', 'name']);
        });

        // Values for each option, e.g. for "Taille": S, M, L, XL.
        Schema::create('product_option_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_option_id')
                ->constrained('product_options')
                ->cascadeOnDelete();
            $table->string('value', 60);
            // Optional hex colour for colour swatches, e.g. "#171717".
            $table->string('hex_color', 7)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['product_option_id', 'value']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_option_values');
        Schema::dropIfExists('product_options');
    }
};

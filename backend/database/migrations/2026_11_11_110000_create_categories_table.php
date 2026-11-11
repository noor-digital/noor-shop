<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')
                ->constrained('stores')
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('slug', 120);
            $table->string('description', 500)->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Slug uniqueness is per store, not global: two merchants may both
            // have a "chaussures" category.
            $table->unique(['store_id', 'slug']);
            $table->index(['store_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

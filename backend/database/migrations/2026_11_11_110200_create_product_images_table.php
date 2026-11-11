<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            // Storage path, typically on the `public` disk (e.g.
            // "products/37/abc.jpg") — not an absolute URL.
            $table->string('path');
            // Original file name, kept for download / audit; max 255.
            $table->string('original_name')->nullable();
            // MIME + size snapshot (defensive — not the authoritative source).
            $table->string('mime_type', 100)->nullable();
            $table->unsignedInteger('size_bytes')->nullable();
            $table->string('alt_text', 255)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['product_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};

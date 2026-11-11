<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Stores — a merchant may own several stores depending on their plan.
 * Every multi-tenant resource is isolated by `store_id` elsewhere in the schema.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            // Owner — the user who created and administers the store.
            $table->foreignId('owner_user_id')
                ->constrained('users')
                ->restrictOnDelete();
            // Public slug — becomes part of the storefront URL /boutique/{slug}.
            $table->string('slug', 64)->unique();
            $table->string('name');
            $table->string('description', 500)->nullable();
            // One of the three graphic templates: marble | editorial | gallery.
            $table->enum('theme', ['marble', 'editorial', 'gallery'])->default('marble');
            // Hex color like #5433EB — used as the storefront accent.
            $table->string('accent_color', 7)->default('#5433EB');
            $table->string('logo_text', 4)->nullable();
            $table->string('phone', 32)->nullable();
            $table->string('city', 80)->nullable();
            $table->string('address', 255)->nullable();
            // Lifecycle status — platform admins may suspend a store.
            $table->enum('status', ['active', 'suspended'])->default('active')->index();
            // Store statistics cache (optional, computed by jobs).
            $table->unsignedInteger('products_count')->default(0);
            $table->unsignedInteger('orders_count')->default(0);
            $table->unsignedBigInteger('revenue_total_xof')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['owner_user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * store_settings — one row per store, holds free-form customisation
 * (section ordering, social links, SEO defaults). Split from `stores` so the
 * core table stays lean and is quick to query.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')
                ->constrained('stores')
                ->cascadeOnDelete()
                ->unique();
            // Ordered list of section identifiers displayed on the storefront
            // homepage, e.g. ["hero", "featured_categories", "bestsellers"].
            $table->json('home_sections')->nullable();
            // Which sections are enabled — same keys as home_sections.
            $table->json('home_sections_enabled')->nullable();
            // Social links displayed in the storefront footer.
            $table->string('instagram_handle', 60)->nullable();
            $table->string('facebook_handle', 60)->nullable();
            $table->string('whatsapp_number', 32)->nullable();
            // SEO defaults (overridable per product/category).
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 500)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_settings');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Plans — SaaS offerings sold to merchants (Découverte / Pro / Business).
 * Prices are stored as integer XOF (no floating-point money).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 64)->unique();
            $table->string('name');
            $table->string('tagline')->nullable();
            // Monthly price in XOF (integer). 0 = free tier.
            $table->unsignedInteger('price_xof')->default(0);
            // Quotas; null = unlimited.
            $table->unsignedSmallInteger('max_stores')->nullable();
            $table->unsignedInteger('max_products')->nullable();
            $table->unsignedSmallInteger('max_users')->nullable();
            // Marketing features displayed to the merchant.
            $table->json('features')->nullable();
            // Order in which plans are displayed on the public pricing page.
            $table->unsignedSmallInteger('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_highlighted')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};

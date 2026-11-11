<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * subscriptions — ties a merchant (user) to a plan with lifecycle dates:
 * trial, active, grace, expired. The MVP does not integrate a payment
 * gateway (per cahier des charges §13.3) — status is advanced manually by
 * platform admins or by scheduled jobs on expiration.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('plan_id')
                ->constrained('plans')
                ->restrictOnDelete();
            $table->enum('status', ['trial', 'active', 'grace', 'expired', 'cancelled'])
                ->default('trial')
                ->index();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ends_at')->nullable()->index();
            // After ends_at, the merchant has `grace_ends_at` to renew before
            // the subscription becomes expired and the store(s) are read-only.
            $table->timestamp('grace_ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            // Last known billing cycle amount in XOF (snapshot).
            $table->unsignedInteger('last_amount_xof')->nullable();
            $table->timestamps();

            // A single user has one active subscription at a time; historical
            // records are kept for audit, so no unique constraint here.
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};

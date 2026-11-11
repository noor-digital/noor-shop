<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * audit_logs — append-only trail of sensitive platform actions.
 * Records store suspensions, plan changes, order force-cancellations,
 * demo seed overrides, etc. Rows are never updated; a row describes one
 * action at a point in time.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            // Human-readable actor label (kept even if the user is deleted).
            $table->string('actor_label', 150)->nullable();
            // Short identifier of the action — e.g. "store.suspended",
            // "store.reactivated", "plan.updated".
            $table->string('action', 80);
            // target_type is a short machine name, e.g. "store" / "user" /
            // "subscription". target_id is the row id of the target.
            $table->string('target_type', 40)->nullable();
            $table->unsignedBigInteger('target_id')->nullable();
            $table->string('target_label', 150)->nullable();
            // Reason provided by the actor (required for destructive actions
            // like suspension, enforced in the controller).
            $table->string('reason', 500)->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('happened_at');
            $table->timestamps();

            $table->index(['action', 'happened_at']);
            $table->index(['target_type', 'target_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};

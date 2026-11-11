<?php

namespace App\Services;

use App\Models\Subscription;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

/**
 * Subscription lifecycle:
 *   trial    → active   when a payment lands (not in MVP) OR when
 *                       the merchant converts the trial manually by an
 *                       admin action.
 *   trial    → grace    when trial_ends_at passes without upgrade.
 *   active   → grace    when ends_at passes.
 *   grace    → expired  when grace_ends_at passes.
 *
 * `grace_ends_at` defaults to 7 days after the trigger per cahier des
 * charges §13.2. The MVP keeps the merchant's data under suspension — the
 * suspension is a store-level action, applied by the platform admin when
 * they choose, informed by this status.
 */
class SubscriptionService
{
    public const GRACE_PERIOD_DAYS = 7;

    /**
     * Advance every subscription whose trigger timestamp has passed.
     * Called by the `subscriptions:advance-expired` artisan command.
     *
     * @return array{trial_to_grace:int,active_to_grace:int,grace_to_expired:int}
     */
    public function advanceExpired(): array
    {
        $now = now();
        $trialToGrace = 0;
        $activeToGrace = 0;
        $graceToExpired = 0;

        DB::transaction(function () use ($now, &$trialToGrace, &$activeToGrace, &$graceToExpired) {
            // trial → grace
            $trials = Subscription::query()
                ->where('status', Subscription::STATUS_TRIAL)
                ->whereNotNull('trial_ends_at')
                ->where('trial_ends_at', '<', $now)
                ->lockForUpdate()
                ->get();
            foreach ($trials as $s) {
                $s->forceFill([
                    'status' => Subscription::STATUS_GRACE,
                    'grace_ends_at' => $s->trial_ends_at->copy()->addDays(self::GRACE_PERIOD_DAYS),
                ])->save();
                $trialToGrace++;
            }

            // active → grace
            $actives = Subscription::query()
                ->where('status', Subscription::STATUS_ACTIVE)
                ->whereNotNull('ends_at')
                ->where('ends_at', '<', $now)
                ->lockForUpdate()
                ->get();
            foreach ($actives as $s) {
                $s->forceFill([
                    'status' => Subscription::STATUS_GRACE,
                    'grace_ends_at' => $s->ends_at->copy()->addDays(self::GRACE_PERIOD_DAYS),
                ])->save();
                $activeToGrace++;
            }

            // grace → expired
            $graces = Subscription::query()
                ->where('status', Subscription::STATUS_GRACE)
                ->whereNotNull('grace_ends_at')
                ->where('grace_ends_at', '<', $now)
                ->lockForUpdate()
                ->get();
            foreach ($graces as $s) {
                $s->forceFill(['status' => Subscription::STATUS_EXPIRED])->save();
                $graceToExpired++;
            }
        });

        return compact('trialToGrace', 'activeToGrace', 'graceToExpired');
    }
}

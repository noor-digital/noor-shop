<?php

namespace App\Console\Commands;

use App\Services\SubscriptionService;
use Illuminate\Console\Command;

/**
 * Advances subscription lifecycle: trial→grace, active→grace, grace→expired.
 * Scheduled daily in routes/console.php.
 */
class AdvanceExpiredSubscriptionsCommand extends Command
{
    protected $signature = 'subscriptions:advance-expired';
    protected $description = 'Advance subscriptions past their trial / active / grace deadlines.';

    public function handle(SubscriptionService $svc): int
    {
        $r = $svc->advanceExpired();
        $this->info("trial→grace: {$r['trialToGrace']}  active→grace: {$r['activeToGrace']}  grace→expired: {$r['graceToExpired']}");
        return self::SUCCESS;
    }
}

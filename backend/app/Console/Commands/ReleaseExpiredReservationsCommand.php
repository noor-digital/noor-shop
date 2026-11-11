<?php

namespace App\Console\Commands;

use App\Services\StockService;
use Illuminate\Console\Command;

/**
 * Releases stock reservations for pending orders whose 2 h window has
 * elapsed. Scheduled every 5 minutes in routes/console.php.
 */
class ReleaseExpiredReservationsCommand extends Command
{
    protected $signature = 'orders:release-expired';
    protected $description = 'Cancel pending orders whose stock reservation has expired and release their stock.';

    public function handle(StockService $stock): int
    {
        $count = $stock->releaseExpiredReservations();
        $this->info("Released {$count} expired reservation(s).");
        return self::SUCCESS;
    }
}

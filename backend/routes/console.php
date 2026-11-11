<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Release expired stock reservations (2 h window). Every 5 minutes is a
// reasonable balance between accuracy and scheduler load.
Schedule::command('orders:release-expired')->everyFiveMinutes()->withoutOverlapping();

// Advance subscription lifecycle daily at 02:00 — trial/active/grace timers.
Schedule::command('subscriptions:advance-expired')->dailyAt('02:00')->withoutOverlapping();

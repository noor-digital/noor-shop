<?php

use App\Http\Controllers\Merchant\MerchantDashboardController;
use App\Http\Controllers\Merchant\StoreController as MerchantStoreController;
use App\Http\Controllers\Platform\PlatformDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public & marketing
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

/*
|--------------------------------------------------------------------------
| Authenticated — merchant workspace
|--------------------------------------------------------------------------
| Protected by `auth` (session), `verified` (email) and `merchant`
| (role === 'merchant'). Every controller must further verify that any
| referenced store belongs to the authenticated user via StorePolicy.
*/

Route::middleware(['auth', 'verified', 'merchant'])
    ->prefix('merchant')
    ->name('merchant.')
    ->group(function () {
        Route::get('/', [MerchantDashboardController::class, 'index'])->name('dashboard');
        Route::get('stores', [MerchantStoreController::class, 'index'])->name('stores.index');
    });

/*
|--------------------------------------------------------------------------
| Authenticated — platform administration
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'platform'])
    ->prefix('platform')
    ->name('platform.')
    ->group(function () {
        Route::get('/', [PlatformDashboardController::class, 'index'])->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| Starter kit defaults — kept so npm scripts still resolve.
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

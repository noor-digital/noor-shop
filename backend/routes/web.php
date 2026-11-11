<?php

use App\Http\Controllers\Merchant\CategoryController as MerchantCategoryController;
use App\Http\Controllers\Merchant\MerchantDashboardController;
use App\Http\Controllers\Merchant\ProductController as MerchantProductController;
use App\Http\Controllers\Merchant\StoreController as MerchantStoreController;
use App\Http\Controllers\Merchant\StoreSwitchController;
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
        Route::post('stores/switch', [StoreSwitchController::class, 'store'])->name('stores.switch');

        Route::get('categories', [MerchantCategoryController::class, 'index'])->name('categories.index');
        Route::post('categories', [MerchantCategoryController::class, 'store'])->name('categories.store');
        Route::put('categories/{category}', [MerchantCategoryController::class, 'update'])->name('categories.update');
        Route::delete('categories/{category}', [MerchantCategoryController::class, 'destroy'])->name('categories.destroy');

        Route::get('products', [MerchantProductController::class, 'index'])->name('products.index');
        Route::get('products/create', [MerchantProductController::class, 'create'])->name('products.create');
        Route::post('products', [MerchantProductController::class, 'store'])->name('products.store');
        Route::get('products/{product}/edit', [MerchantProductController::class, 'edit'])->name('products.edit');
        Route::put('products/{product}', [MerchantProductController::class, 'update'])->name('products.update');
        Route::delete('products/{product}', [MerchantProductController::class, 'destroy'])->name('products.destroy');
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

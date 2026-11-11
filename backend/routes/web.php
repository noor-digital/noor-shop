<?php

use App\Http\Controllers\Merchant\CategoryController as MerchantCategoryController;
use App\Http\Controllers\Merchant\CustomerController as MerchantCustomerController;
use App\Http\Controllers\Merchant\DeliveryZoneController as MerchantDeliveryZoneController;
use App\Http\Controllers\Merchant\MerchantDashboardController;
use App\Http\Controllers\Merchant\OrderController as MerchantOrderController;
use App\Http\Controllers\Merchant\ProductController as MerchantProductController;
use App\Http\Controllers\Merchant\StoreController as MerchantStoreController;
use App\Http\Controllers\Merchant\StoreSettingController as MerchantStoreSettingController;
use App\Http\Controllers\Merchant\StoreSwitchController;
use App\Http\Controllers\Merchant\VariantController as MerchantVariantController;
use App\Http\Controllers\Platform\AuditLogController;
use App\Http\Controllers\Platform\MerchantController as PlatformMerchantController;
use App\Http\Controllers\Platform\PlanController as PlatformPlanController;
use App\Http\Controllers\Platform\PlatformDashboardController;
use App\Http\Controllers\Platform\PlatformStoreController;
use App\Http\Controllers\Platform\SubscriptionController as PlatformSubscriptionController;
use App\Http\Controllers\Storefront\CheckoutController;
use App\Http\Controllers\Storefront\StorefrontController;
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
        Route::get('stores/create', [MerchantStoreController::class, 'create'])->name('stores.create');
        Route::post('stores', [MerchantStoreController::class, 'store'])->name('stores.store');
        Route::get('stores/{store}/edit', [MerchantStoreController::class, 'edit'])->name('stores.edit');
        Route::put('stores/{store}', [MerchantStoreController::class, 'update'])->name('stores.update');
        Route::delete('stores/{store}', [MerchantStoreController::class, 'destroy'])->name('stores.destroy');
        Route::post('stores/switch', [StoreSwitchController::class, 'store'])->name('stores.switch');

        Route::get('settings', [MerchantStoreSettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [MerchantStoreSettingController::class, 'update'])->name('settings.update');

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
        Route::get('products/{product}/variants', [MerchantVariantController::class, 'edit'])->name('products.variants.edit');
        Route::put('products/{product}/variants', [MerchantVariantController::class, 'update'])->name('products.variants.update');
        Route::delete('products/{product}/variants', [MerchantVariantController::class, 'destroy'])->name('products.variants.destroy');

        Route::get('orders', [MerchantOrderController::class, 'index'])->name('orders.index');
        Route::get('orders/{order}', [MerchantOrderController::class, 'show'])->name('orders.show');
        Route::post('orders/{order}/transition', [MerchantOrderController::class, 'transition'])->name('orders.transition');

        Route::get('customers', [MerchantCustomerController::class, 'index'])->name('customers.index');

        Route::get('delivery', [MerchantDeliveryZoneController::class, 'index'])->name('delivery.index');
        Route::post('delivery', [MerchantDeliveryZoneController::class, 'store'])->name('delivery.store');
        Route::put('delivery/{deliveryZone}', [MerchantDeliveryZoneController::class, 'update'])->name('delivery.update');
        Route::delete('delivery/{deliveryZone}', [MerchantDeliveryZoneController::class, 'destroy'])->name('delivery.destroy');
    });

/*
|--------------------------------------------------------------------------
| Public storefront (per cahier des charges §18.1)
|--------------------------------------------------------------------------
*/

Route::prefix('boutique/{store:slug}')->name('storefront.')->group(function () {
    Route::get('/', [StorefrontController::class, 'home'])->name('home');
    Route::get('catalogue', [StorefrontController::class, 'catalog'])->name('catalog');
    Route::get('produit/{productSlug}', [StorefrontController::class, 'product'])->name('product');

    Route::get('commande', [CheckoutController::class, 'show'])->name('checkout');
    Route::post('commande', [CheckoutController::class, 'place'])
        ->middleware('throttle:10,1')
        ->name('checkout.place');
    Route::get('confirmation/{token}', [CheckoutController::class, 'confirmation'])
        ->name('confirmation');
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

        Route::get('merchants', [PlatformMerchantController::class, 'index'])->name('merchants.index');
        Route::get('merchants/{merchant}', [PlatformMerchantController::class, 'show'])->name('merchants.show');

        Route::get('stores', [PlatformStoreController::class, 'index'])->name('stores.index');
        // Platform admins operate on numeric ids (from their table), not slugs.
        Route::post('stores/{store:id}/suspend', [PlatformStoreController::class, 'suspend'])->name('stores.suspend');
        Route::post('stores/{store:id}/reactivate', [PlatformStoreController::class, 'reactivate'])->name('stores.reactivate');

        Route::get('plans', [PlatformPlanController::class, 'index'])->name('plans.index');
        Route::put('plans/{plan}', [PlatformPlanController::class, 'update'])->name('plans.update');

        Route::get('subscriptions', [PlatformSubscriptionController::class, 'index'])->name('subscriptions.index');
        Route::post('subscriptions/{subscription}/change-plan', [PlatformSubscriptionController::class, 'changePlan'])->name('subscriptions.change-plan');
        Route::post('subscriptions/{subscription}/cancel', [PlatformSubscriptionController::class, 'cancel'])->name('subscriptions.cancel');

        Route::get('audit', [AuditLogController::class, 'index'])->name('audit.index');
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

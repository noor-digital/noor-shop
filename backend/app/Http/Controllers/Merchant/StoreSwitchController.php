<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Services\CurrentStoreResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreSwitchController extends Controller
{
    public function __construct(private readonly CurrentStoreResolver $stores) {}

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'store_id' => ['required', 'integer'],
        ]);

        $ok = $this->stores->switchTo($request->user(), (int) $data['store_id'], $request);
        abort_unless($ok, 403, 'Cette boutique ne vous appartient pas.');

        return back()->with('success', 'Boutique active modifiée.');
    }
}

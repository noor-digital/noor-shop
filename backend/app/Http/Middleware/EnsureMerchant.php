<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gate reserved for the merchant workspace.
 * Users authenticated as `merchant` may pass; platform admins are redirected
 * to their own area; unauthenticated requests go to login.
 */
class EnsureMerchant
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        abort_unless($user && $user->isMerchant(), 403);

        return $next($request);
    }
}

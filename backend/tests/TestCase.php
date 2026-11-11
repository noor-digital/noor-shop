<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Inertia renders through app.blade.php which calls @vite — without a
        // Vite manifest (we skip `npm run build` in tests) this throws. The
        // `withoutVite()` helper no-ops the Vite facade for the test's
        // lifetime, which is exactly what we want.
        $this->withoutVite();
    }
}

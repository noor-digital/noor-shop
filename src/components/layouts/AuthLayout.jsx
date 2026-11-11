import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../ui/Logo.jsx';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto grid min-h-screen max-w-page grid-cols-1 lg:grid-cols-2">
        {/* Left panel */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-10">
          <Link to="/" className="relative z-10">
            <Logo />
          </Link>
          <div className="relative z-10 space-y-6 max-w-md">
            <p className="text-caption uppercase tracking-tight text-muted">Plateforme SaaS</p>
            <h2 className="text-[40px] leading-[1.05] tracking-tightest text-ink">
              Lancez votre boutique en ligne en quelques minutes.
            </h2>
            <p className="text-body text-muted">
              NOOR SHOP est la nouvelle manière pour les commerçants d'Afrique francophone de vendre
              en ligne — sans code, sans friction, avec une identité visuelle propre.
            </p>
            <div className="flex items-center gap-3 text-body-sm text-muted">
              <span className="h-2 w-2 rounded-pill bg-violet" aria-hidden />
              Essai gratuit 14 jours, sans carte bancaire
            </div>
          </div>
          <div className="relative z-10 text-caption text-muted">
            © 2026 NOOR SHOP — Prototype
          </div>
          <div className="violet-aura absolute inset-0" aria-hidden />
        </div>

        {/* Right form panel */}
        <div className="flex flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:border-l lg:border-hairline">
          <div className="lg:hidden mb-8">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

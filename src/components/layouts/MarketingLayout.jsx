import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo.jsx';
import { Button } from '../ui/Button.jsx';
import { useState } from 'react';

const nav = [
  { to: '/', label: 'Accueil' },
  { to: '/fonctionnalites', label: 'Fonctionnalités' },
  { to: '/tarifs', label: 'Tarifs' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

export default function MarketingLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-5">
          <Link to="/" aria-label="NOOR SHOP" className="flex items-center">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-pill px-4 py-2 text-[13px] font-medium transition ${
                    isActive ? 'bg-white text-ink shadow-soft' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button to="/connexion" variant="ghost" size="sm">
              Connexion
            </Button>
            <Button to="/inscription" size="sm">
              Essai gratuit
            </Button>
          </div>
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-pill border border-hairline bg-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="text-lg">{open ? '×' : '≡'}</span>
          </button>
        </div>
        {open && (
          <div className="border-t border-hairline bg-white px-5 py-4 md:hidden">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`block rounded-pill px-4 py-3 text-body font-medium ${
                      pathname === item.to ? 'bg-canvas text-ink' : 'text-muted'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button to="/connexion" variant="outline" className="flex-1">
                Connexion
              </Button>
              <Button to="/inscription" className="flex-1">
                Essai gratuit
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-ink text-white">
        <div className="mx-auto grid max-w-page gap-10 px-5 py-14 md:grid-cols-4">
          <div>
            <Logo tone="dark" />
            <p className="mt-4 text-body-sm text-white/60 max-w-xs">
              Une boutique professionnelle, simplement. Créée à Dakar pour tous les commerçants d'Afrique francophone.
            </p>
          </div>
          <div>
            <p className="text-caption uppercase tracking-tight text-white/50">Produit</p>
            <ul className="mt-4 space-y-2 text-body-sm">
              <li><Link to="/fonctionnalites" className="hover:text-white text-white/80">Fonctionnalités</Link></li>
              <li><Link to="/tarifs" className="hover:text-white text-white/80">Tarifs</Link></li>
              <li><Link to="/boutique/maam-couture" className="hover:text-white text-white/80">Boutique de démo</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-caption uppercase tracking-tight text-white/50">Entreprise</p>
            <ul className="mt-4 space-y-2 text-body-sm">
              <li><Link to="/a-propos" className="hover:text-white text-white/80">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-white text-white/80">Contact</Link></li>
              <li><a href="mailto:hello@noor.shop" className="hover:text-white text-white/80">hello@noor.shop</a></li>
            </ul>
          </div>
          <div>
            <p className="text-caption uppercase tracking-tight text-white/50">Légal</p>
            <ul className="mt-4 space-y-2 text-body-sm">
              <li><span className="text-white/60">Conditions d'utilisation</span></li>
              <li><span className="text-white/60">Politique de confidentialité</span></li>
              <li><span className="text-white/60">Cookies</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-2 px-5 py-6 text-caption text-white/50 md:flex-row md:items-center">
            <p>© 2026 NOOR SHOP — Dakar, Sénégal.</p>
            <p>Prototype frontend. Données affichées fictives.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

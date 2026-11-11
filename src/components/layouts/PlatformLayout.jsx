import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Logo } from '../ui/Logo.jsx';
import { DemoBanner } from '../ui/DemoBanner.jsx';

const items = [
  { to: '/platform', icon: '◉', label: 'Tableau de bord', end: true },
  { to: '/platform/commercants', icon: '◎', label: 'Commerçants' },
  { to: '/platform/boutiques', icon: '◫', label: 'Boutiques' },
  { to: '/platform/abonnements', icon: '✦', label: 'Abonnements' },
  { to: '/platform/offres', icon: '✧', label: 'Offres' },
  { to: '/platform/journal', icon: '≡', label: "Journal d'activité" },
  { to: '/platform/parametres', icon: '◐', label: 'Paramètres' },
];

export default function PlatformLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-canvas">
      <DemoBanner>Administration plateforme — démonstration · Données fictives</DemoBanner>
      <div className="mx-auto flex max-w-[1400px]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-hairline bg-ink text-white transition-transform lg:sticky lg:top-0 lg:h-[100dvh] lg:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
            <Link to="/platform" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-violet text-white text-[13px] font-semibold">n</span>
              <span className="text-[15px] font-semibold tracking-tightest">NOOR SHOP · Admin</span>
            </Link>
            <button
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-pill border border-white/20"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-pill px-4 py-2.5 text-body-sm transition ${
                        isActive
                          ? 'bg-white text-ink font-medium'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <span className="flex h-6 w-6 items-center justify-center">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-card bg-white/5 px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-pill bg-violet text-white text-body-sm font-semibold">PS</div>
              <div className="min-w-0 flex-1">
                <p className="text-body-sm font-medium truncate">Papa Seck</p>
                <p className="text-caption text-white/60">Super admin</p>
              </div>
              <Link to="/" className="text-caption text-white/60 hover:text-white">
                Sortir
              </Link>
            </div>
          </div>
        </aside>

        {open && (
          <div className="fixed inset-0 z-30 bg-ink/50 lg:hidden" onClick={() => setOpen(false)} />
        )}

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-hairline bg-canvas/80 backdrop-blur px-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-pill border border-hairline bg-white"
              onClick={() => setOpen(true)}
              aria-label="Menu"
            >
              ≡
            </button>
            <div className="text-body-sm text-muted hidden sm:block">
              Administration <span className="mx-2">/</span>
              <span className="text-ink">{crumb(pathname)}</span>
            </div>
            <div className="ml-auto text-body-sm text-muted hidden sm:block">
              {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date())}
            </div>
          </header>
          <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-[1200px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function crumb(path) {
  const m = {
    '/platform': 'Tableau de bord',
    '/platform/commercants': 'Commerçants',
    '/platform/boutiques': 'Boutiques',
    '/platform/abonnements': 'Abonnements',
    '/platform/offres': 'Offres',
    '/platform/journal': "Journal d'activité",
    '/platform/parametres': 'Paramètres',
  };
  if (m[path]) return m[path];
  if (path.startsWith('/platform/commercants/')) return 'Détail commerçant';
  if (path.startsWith('/platform/boutiques/')) return 'Détail boutique';
  return 'Administration';
}

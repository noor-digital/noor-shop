import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Logo } from '../ui/Logo.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { demoStores } from '../../data/stores.js';
import { DemoBanner } from '../ui/DemoBanner.jsx';

const items = [
  { to: '/merchant', icon: '◉', label: 'Tableau de bord', end: true },
  { to: '/merchant/produits', icon: '◫', label: 'Produits' },
  { to: '/merchant/categories', icon: '≋', label: 'Catégories' },
  { to: '/merchant/stocks', icon: '⌘', label: 'Stocks' },
  { to: '/merchant/commandes', icon: '✎', label: 'Commandes' },
  { to: '/merchant/clients', icon: '◎', label: 'Clients' },
  { to: '/merchant/statistiques', icon: '⌁', label: 'Statistiques' },
  { to: '/merchant/personnalisation', icon: '✧', label: 'Personnalisation' },
  { to: '/merchant/livraison', icon: '⤷', label: 'Livraison' },
  { to: '/merchant/abonnement', icon: '✦', label: 'Abonnement' },
  { to: '/merchant/parametres', icon: '◐', label: 'Paramètres' },
];

export default function MerchantLayout() {
  const { activeMerchantStoreId, setActiveMerchantStoreId } = useStore();
  const activeStore = demoStores.find((s) => s.id === activeMerchantStoreId) || demoStores[0];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-canvas">
      <DemoBanner>Espace commerçant — démonstration · Données fictives</DemoBanner>

      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-hairline bg-white transition-transform lg:sticky lg:top-0 lg:h-[100dvh] lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between px-5 border-b border-hairline">
            <Link to="/merchant" className="flex items-center" onClick={() => setSidebarOpen(false)}>
              <Logo />
            </Link>
            <button
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-pill border border-hairline"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <div className="px-4 py-4 border-b border-hairline">
            <label className="block text-caption uppercase tracking-tight text-muted mb-2">
              Boutique active
            </label>
            <div className="relative">
              <select
                value={activeStore.id}
                onChange={(e) => setActiveMerchantStoreId(e.target.value)}
                className="w-full appearance-none rounded-pill bg-canvas border border-hairline px-4 py-2.5 pr-8 text-body-sm font-medium focus:outline-none"
              >
                {demoStores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — /{s.slug}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">▾</span>
            </div>
            <Link
              to="/merchant/boutiques"
              className="mt-3 inline-flex items-center gap-2 text-body-sm text-violet hover:underline"
            >
              Gérer mes boutiques →
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-pill px-4 py-2.5 text-body-sm transition ${
                        isActive
                          ? 'bg-canvas text-ink font-medium'
                          : 'text-muted hover:bg-canvas/70 hover:text-ink'
                      }`
                    }
                  >
                    <span className="flex h-6 w-6 items-center justify-center text-ink/80">
                      {item.icon}
                    </span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-hairline p-4">
            <Link
              to={`/boutique/${activeStore.slug}`}
              target="_blank"
              className="flex items-center gap-3 rounded-pill bg-canvas px-4 py-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-ink text-white text-caption font-medium">
                {activeStore.logo}
              </span>
              <div className="flex-1">
                <p className="text-body-sm font-medium leading-none">Voir la boutique</p>
                <p className="mt-1 text-caption text-muted">/{activeStore.slug}</p>
              </div>
              <span className="text-muted">↗</span>
            </Link>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-hairline bg-canvas/80 backdrop-blur px-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-pill border border-hairline bg-white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Menu"
            >
              ≡
            </button>
            <div className="hidden sm:block text-body-sm text-muted">
              <span>Commerçant</span>
              <span className="mx-2">/</span>
              <span className="text-ink">{currentCrumb(pathname)}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="hidden sm:inline-flex h-10 items-center gap-2 rounded-pill border border-hairline bg-white px-4 text-body-sm">
                <span className="h-2 w-2 rounded-pill bg-emerald-500" aria-hidden />
                Boutique en ligne
              </button>
              <Link
                to="/merchant/parametres"
                className="flex h-10 w-10 items-center justify-center rounded-pill bg-white border border-hairline text-body-sm font-semibold"
                title="Mon compte"
              >
                AD
              </Link>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8 w-full max-w-[1200px]">
            <Outlet context={{ activeStore }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function currentCrumb(path) {
  const mapping = {
    '/merchant': 'Tableau de bord',
    '/merchant/produits': 'Produits',
    '/merchant/produits/nouveau': 'Nouveau produit',
    '/merchant/categories': 'Catégories',
    '/merchant/stocks': 'Stocks',
    '/merchant/commandes': 'Commandes',
    '/merchant/clients': 'Clients',
    '/merchant/statistiques': 'Statistiques',
    '/merchant/personnalisation': 'Personnalisation',
    '/merchant/apercu': 'Aperçu de la boutique',
    '/merchant/livraison': 'Livraison',
    '/merchant/abonnement': 'Abonnement',
    '/merchant/parametres': 'Paramètres',
    '/merchant/boutiques': 'Mes boutiques',
    '/merchant/boutiques/nouvelle': 'Nouvelle boutique',
  };
  if (mapping[path]) return mapping[path];
  if (path.startsWith('/merchant/produits/')) return 'Modifier le produit';
  if (path.startsWith('/merchant/commandes/')) return 'Détail commande';
  if (path.startsWith('/merchant/categories/')) return 'Catégorie';
  return 'Espace commerçant';
}

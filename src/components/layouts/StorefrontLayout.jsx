import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { findStore } from '../../data/stores.js';
import { categoriesForStore } from '../../data/catalog.js';
import { useStore } from '../../context/StoreContext.jsx';
import { DemoBanner } from '../ui/DemoBanner.jsx';
import NotFoundStore from '../../pages/storefront/NotFoundStore.jsx';

export default function StorefrontLayout() {
  const { storeSlug } = useParams();
  const store = findStore(storeSlug);
  const cats = useMemo(() => (store ? categoriesForStore(store.slug) : []), [store]);
  const { cartTotals, cart } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!store) return <NotFoundStore slug={storeSlug} />;
  if (store.status === 'suspended') return <NotFoundStore slug={storeSlug} suspended />;

  const theme = store.theme || 'marble';
  const cartQty = cart.storeSlug === store.slug ? cartTotals.itemCount : 0;

  return (
    <div className={`theme-${theme} min-h-screen bg-canvas text-ink`}>
      <DemoBanner>
        Boutique de démonstration · {store.name} · Données fictives
      </DemoBanner>

      <header className="sticky top-0 z-30 border-b border-hairline bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-page items-center gap-4 px-5">
          <Link to={`/boutique/${store.slug}`} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-ink text-white text-[13px] font-semibold tracking-tightest">
              {store.logo}
            </span>
            <div className="hidden sm:block">
              <p className="text-[15px] font-semibold tracking-tightest leading-none">{store.name}</p>
              <p className="text-caption text-muted">{store.city} · Sénégal</p>
            </div>
          </Link>

          <form
            className="hidden md:flex flex-1 max-w-sm items-center rounded-input bg-white border border-hairline pl-4 pr-1 h-11"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get('q');
              window.location.href = `/boutique/${store.slug}/recherche?q=${encodeURIComponent(q || '')}`;
            }}
          >
            <input
              name="q"
              placeholder="Que cherchez-vous aujourd'hui ?"
              className="w-full bg-transparent text-[14px] focus:outline-none placeholder:text-muted"
            />
            <button
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-pill bg-violet text-white shadow-violet"
              aria-label="Rechercher"
            >
              →
            </button>
          </form>

          <nav className="ml-auto hidden lg:flex items-center gap-1 text-body-sm">
            <NavLink to={`/boutique/${store.slug}`} end className={({ isActive }) => `px-3 py-2 rounded-pill ${isActive ? 'bg-canvas text-ink font-medium' : 'text-muted hover:text-ink'}`}>Accueil</NavLink>
            <NavLink to={`/boutique/${store.slug}/categories`} className={({ isActive }) => `px-3 py-2 rounded-pill ${isActive ? 'bg-canvas text-ink font-medium' : 'text-muted hover:text-ink'}`}>Catégories</NavLink>
            <NavLink to={`/boutique/${store.slug}/catalogue`} className={({ isActive }) => `px-3 py-2 rounded-pill ${isActive ? 'bg-canvas text-ink font-medium' : 'text-muted hover:text-ink'}`}>Catalogue</NavLink>
          </nav>

          <Link
            to={`/boutique/${store.slug}/panier`}
            className="relative flex h-10 items-center gap-2 rounded-pill border border-hairline bg-white px-4 text-body-sm font-medium"
          >
            <span>Panier</span>
            {cartQty > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-pill bg-violet px-1.5 text-caption text-white">
                {cartQty}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-pill border border-hairline bg-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <span>{mobileOpen ? '×' : '≡'}</span>
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-hairline bg-white px-5 py-4 lg:hidden">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {cats.map((c) => (
                <Link
                  key={c.id}
                  to={`/boutique/${store.slug}/categorie/${c.slug}`}
                  className="shrink-0 rounded-pill border border-hairline bg-white px-4 py-2 text-body-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {c.icon} {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet context={{ store, categories: cats, theme }} />
      </main>

      <footer className="mt-20 bg-ink text-white">
        <div className="mx-auto grid max-w-page gap-8 px-5 py-14 md:grid-cols-3">
          <div>
            <p className="text-[18px] font-semibold tracking-tightest">{store.name}</p>
            <p className="mt-2 text-body-sm text-white/60 max-w-xs">{store.description}</p>
          </div>
          <div>
            <p className="text-caption uppercase tracking-tight text-white/50">Boutique</p>
            <ul className="mt-4 space-y-2 text-body-sm">
              <li><Link to={`/boutique/${store.slug}/categories`} className="text-white/80 hover:text-white">Catégories</Link></li>
              <li><Link to={`/boutique/${store.slug}/catalogue`} className="text-white/80 hover:text-white">Tout le catalogue</Link></li>
              <li><Link to={`/boutique/${store.slug}/panier`} className="text-white/80 hover:text-white">Votre panier</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-caption uppercase tracking-tight text-white/50">Nous contacter</p>
            <ul className="mt-4 space-y-2 text-body-sm text-white/80">
              <li>{store.address}</li>
              <li>{store.phone}</li>
              {store.socials?.instagram && <li>Instagram {store.socials.instagram}</li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-page flex-col items-start gap-2 px-5 py-6 text-caption text-white/50 md:flex-row md:items-center md:justify-between">
            <p>Propulsé par NOOR SHOP — <Link to="/" className="underline">noor.shop</Link></p>
            <p>Devise : F CFA · Paiement à la livraison ou au retrait</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

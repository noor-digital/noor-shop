import { Link, useOutletContext } from 'react-router-dom';
import { byStore } from '../../data/catalog.js';
import { ProductCard } from '../../components/commerce/ProductCard.jsx';
import Image from '../../components/ui/Image.jsx';

export default function StoreHome() {
  const { store, categories, theme } = useOutletContext();
  const products = byStore(store.slug);
  const popular = products.slice(0, 4);
  const newer = products.slice().reverse().slice(0, 4);

  if (theme === 'editorial') return <EditorialHome store={store} categories={categories} products={products} />;
  if (theme === 'gallery') return <GalleryHome store={store} categories={categories} products={products} />;
  return <MarbleHome store={store} categories={categories} popular={popular} newer={newer} />;
}

function Hero({ store, action }) {
  return (
    <section className="mx-auto max-w-page px-5 pt-14 pb-10">
      <div className="relative overflow-hidden rounded-card bg-white shadow-card">
        <div
          className="aspect-[16/7] bg-cover bg-center"
          style={{ backgroundImage: `url(${store.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-white">
          <p className="text-caption uppercase tracking-tight text-white/70">{store.city} · Sénégal</p>
          <h1 className="mt-2 max-w-xl text-[32px] sm:text-[44px] font-semibold tracking-tightest leading-tight">
            {store.name}
          </h1>
          <p className="mt-3 max-w-xl text-body-lg text-white/80">{store.description}</p>
          {action}
        </div>
      </div>
    </section>
  );
}

function CategoryPills({ store, categories }) {
  return (
    <section className="mx-auto max-w-page px-5">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/boutique/${store.slug}/categorie/${c.slug}`}
            className="shrink-0 inline-flex items-center gap-2 rounded-pill border border-hairline bg-white px-4 py-2 text-body-sm shadow-soft hover:border-ink transition"
          >
            <span className="flex h-5 w-5 items-center justify-center text-base">{c.icon}</span>
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductRow({ title, storeSlug, products }) {
  return (
    <section className="mx-auto max-w-page px-5 mt-14">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-[22px] font-semibold tracking-tightest">{title} <span className="text-muted">›</span></h2>
        <Link to={`/boutique/${storeSlug}/catalogue`} className="text-body-sm text-muted hover:text-ink">
          Voir tout
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} storeSlug={storeSlug} />
        ))}
      </div>
    </section>
  );
}

function MarbleHome({ store, categories, popular, newer }) {
  return (
    <>
      <Hero store={store} />
      <CategoryPills store={store} categories={categories} />
      <ProductRow title="Nouveautés" storeSlug={store.slug} products={newer} />
      <ProductRow title="Populaires" storeSlug={store.slug} products={popular} />
    </>
  );
}

function EditorialHome({ store, categories, products }) {
  return (
    <>
      <section className="mx-auto max-w-page px-5 pt-14">
        <div className="grid gap-5 md:grid-cols-5">
          <div className="md:col-span-3 relative overflow-hidden rounded-card bg-white shadow-card">
            <div
              className="aspect-[4/3] bg-cover bg-center"
              style={{ backgroundImage: `url(${store.cover})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white">
              <p className="text-caption uppercase tracking-tight text-white/70">Édito du mois</p>
              <h1 className="mt-2 text-[28px] sm:text-[40px] font-semibold tracking-tightest">
                {store.name} · nos essentiels
              </h1>
              <p className="mt-3 max-w-md text-body-lg text-white/80">{store.description}</p>
            </div>
          </div>
          <div className="md:col-span-2 grid gap-5">
            {categories.slice(0, 2).map((c) => (
              <Link
                key={c.id}
                to={`/boutique/${store.slug}/categorie/${c.slug}`}
                className="relative overflow-hidden rounded-card bg-white shadow-card"
              >
                <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${c.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent p-5 flex items-end text-white">
                  <div>
                    <p className="text-caption uppercase tracking-tight text-white/70">Catégorie</p>
                    <h3 className="text-[20px] font-semibold tracking-tightest">{c.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ProductRow title="Nos coups de cœur" storeSlug={store.slug} products={products.slice(0, 4)} />
      <ProductRow title="À (re)découvrir" storeSlug={store.slug} products={products.slice(2, 6)} />
    </>
  );
}

function GalleryHome({ store, categories, products }) {
  return (
    <>
      <section className="mx-auto max-w-page px-5 pt-14">
        <div className="text-center">
          <p className="text-caption uppercase tracking-tight text-muted">{store.city} · Artisanat</p>
          <h1 className="mt-2 text-[40px] sm:text-[56px] font-semibold tracking-tightest">
            {store.name}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-body-lg text-muted">{store.description}</p>
        </div>
      </section>
      <section className="mx-auto max-w-page px-5 mt-10">
        <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4 [column-fill:_balance]">
          {products.map((p, i) => (
            <Link
              to={`/boutique/${store.slug}/produit/${p.slug}`}
              key={p.id}
              className={`mb-3 sm:mb-4 block break-inside-avoid rounded-card bg-white p-2 shadow-card`}
            >
              <div
                className={`rounded-inner bg-canvas overflow-hidden ${i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}
              >
                <Image src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <p className="mt-2 px-1 text-body font-semibold">{p.name}</p>
              <p className="px-1 text-caption text-muted">★ {p.rating} · {p.reviews}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-page px-5 mt-14">
        <div className="grid gap-3 sm:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.id} to={`/boutique/${store.slug}/categorie/${c.slug}`} className="rounded-card bg-ink text-white p-6">
              <p className="text-caption uppercase tracking-tight text-white/60">Catégorie</p>
              <h3 className="mt-2 text-[22px] font-semibold tracking-tightest">{c.icon} {c.name}</h3>
              <p className="mt-1 text-body-sm text-white/70">{c.count} références</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

import { useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { byStore } from '../../data/catalog.js';
import { ProductCard } from '../../components/commerce/ProductCard.jsx';
import { Pill } from '../../components/ui/Card.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export default function StoreCatalog() {
  const { store, categories } = useOutletContext();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState('recent');
  const [stockOnly, setStockOnly] = useState(false);
  const [range, setRange] = useState([0, 300000]);
  const activeCat = params.get('categorie');

  const products = useMemo(() => {
    let list = byStore(store.slug);
    if (activeCat) list = list.filter((p) => categories.find((c) => c.id === p.categoryId)?.slug === activeCat);
    if (stockOnly) list = list.filter((p) => p.stock > 0);
    list = list.filter((p) => (p.promoPrice || p.price) >= range[0] && (p.promoPrice || p.price) <= range[1]);
    if (sort === 'price-asc') list = list.sort((a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price));
    if (sort === 'price-desc') list = list.sort((a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price));
    return list;
  }, [store.slug, activeCat, categories, stockOnly, range, sort]);

  return (
    <section className="mx-auto max-w-page px-5 py-12">
      <p className="text-caption uppercase tracking-tight text-muted">Catalogue</p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tightest">Tous les produits</h1>
      <p className="mt-1 text-body text-muted">{products.length} produits · {store.name}</p>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Pill
          active={!activeCat}
          onClick={() => {
            params.delete('categorie');
            setParams(params);
          }}
        >
          Toutes
        </Pill>
        {categories.map((c) => (
          <Pill
            key={c.id}
            active={activeCat === c.slug}
            onClick={() => {
              params.set('categorie', c.slug);
              setParams(params);
            }}
          >
            {c.icon} {c.name}
          </Pill>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-body-sm">
          <input
            type="checkbox"
            checked={stockOnly}
            onChange={(e) => setStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-hairline"
          />
          En stock uniquement
        </label>
        <div className="flex items-center gap-2 text-body-sm text-muted">
          <span>Prix max :</span>
          <input
            type="range"
            min={0}
            max={300000}
            step={5000}
            value={range[1]}
            onChange={(e) => setRange([0, Number(e.target.value)])}
            className="accent-violet"
          />
          <span className="text-ink font-medium">
            {new Intl.NumberFormat('fr-FR').format(range[1])} F CFA
          </span>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ml-auto rounded-pill border border-hairline bg-white px-4 py-2 text-body-sm"
        >
          <option value="recent">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {/* Grid */}
      <div className="mt-10">
        {products.length === 0 ? (
          <EmptyState
            title="Aucun produit ne correspond à vos critères"
            description="Essayez d'élargir votre fourchette de prix ou de retirer un filtre."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} storeSlug={store.slug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

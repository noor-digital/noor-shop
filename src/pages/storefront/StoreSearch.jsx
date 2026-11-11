import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { byStore } from '../../data/catalog.js';
import { ProductCard } from '../../components/commerce/ProductCard.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export default function StoreSearch() {
  const { store } = useOutletContext();
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') || '';
  const [query, setQuery] = useState(initial);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return byStore(store.slug).filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [query, store.slug]);

  return (
    <section className="mx-auto max-w-page px-5 py-12">
      <p className="text-caption uppercase tracking-tight text-muted">Recherche</p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tightest">Trouver un produit</h1>

      <form
        className="mt-6 flex items-center gap-2 rounded-input bg-white border border-hairline pl-5 pr-1 h-12 max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          params.set('q', query);
          setParams(params);
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Que cherchez-vous ?"
          className="w-full bg-transparent text-body-lg focus:outline-none placeholder:text-muted"
        />
        <button className="h-10 w-10 flex items-center justify-center rounded-pill bg-violet text-white shadow-violet">
          →
        </button>
      </form>

      <div className="mt-10">
        {!query ? (
          <EmptyState title="Commencez votre recherche" description="Tapez le nom d'un produit, un style, une matière…" />
        ) : results.length === 0 ? (
          <EmptyState
            title={`Aucun résultat pour "${query}"`}
            description="Vérifiez l'orthographe ou utilisez des mots-clés plus généraux."
          />
        ) : (
          <>
            <p className="text-body-sm text-muted mb-6">{results.length} résultat(s) dans {store.name}</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} storeSlug={store.slug} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

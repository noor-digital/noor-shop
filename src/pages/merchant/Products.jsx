import { Link, useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { byStore, categoriesForStore } from '../../data/catalog.js';
import { Card, Badge, Pill } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { formatXof } from '../../lib/format.js';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export default function Products() {
  const { activeStore } = useOutletContext();
  const cats = categoriesForStore(activeStore.slug);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [categoryId, setCategoryId] = useState('all');

  const products = useMemo(() => {
    let list = byStore(activeStore.slug);
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (status !== 'all') list = list.filter((p) => p.status === status);
    if (categoryId !== 'all') list = list.filter((p) => p.categoryId === categoryId);
    return list;
  }, [activeStore.slug, query, status, categoryId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">Catalogue</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Produits</h1>
          <p className="mt-1 text-body text-muted">{byStore(activeStore.slug).length} produits au catalogue.</p>
        </div>
        <Button to="/merchant/produits/nouveau">+ Nouveau produit</Button>
      </div>

      <Card padded={false} className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit…"
            className="h-10 flex-1 min-w-[200px] rounded-pill border border-hairline bg-canvas px-4 text-body-sm focus:outline-none focus:border-ink"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-pill border border-hairline bg-white px-4 text-body-sm">
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="h-10 rounded-pill border border-hairline bg-white px-4 text-body-sm">
            <option value="all">Toutes les catégories</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </Card>

      {products.length === 0 ? (
        <EmptyState
          title="Aucun produit"
          description="Créez votre premier produit pour commencer à vendre."
          action={<Button to="/merchant/produits/nouveau">+ Nouveau produit</Button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} padded={false} className="overflow-hidden">
              <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]})` }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{p.name}</p>
                    <p className="text-caption text-muted truncate">
                      {cats.find((c) => c.id === p.categoryId)?.name}
                    </p>
                  </div>
                  <Badge tone={p.stock === 0 ? 'danger' : p.stock < 5 ? 'warning' : 'success'}>
                    {p.stock === 0 ? 'Rupture' : `${p.stock}`}
                  </Badge>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  {p.promoPrice ? (
                    <>
                      <span className="font-semibold">{formatXof(p.promoPrice)}</span>
                      <span className="text-caption text-muted line-through">{formatXof(p.price)}</span>
                    </>
                  ) : (
                    <span className="font-semibold">{formatXof(p.price)}</span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button to={`/merchant/produits/${p.id}`} variant="outline" size="sm" className="flex-1">
                    Modifier
                  </Button>
                  <Button to={`/boutique/${activeStore.slug}/produit/${p.slug}`} variant="ghost" size="sm" className="flex-1">
                    Voir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { byStore } from '../../data/catalog.js';
import { stockMovements } from '../../data/orders.js';
import { Card, Badge, SectionHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { formatDateTime } from '../../lib/format.js';
import { useStore } from '../../context/StoreContext.jsx';

export default function Inventory() {
  const { activeStore } = useOutletContext();
  const products = byStore(activeStore.slug);
  const moves = stockMovements.filter((m) => m.storeSlug === activeStore.slug);
  const [tab, setTab] = useState('list');
  const { notify } = useStore();

  const stockColumns = [
    { key: 'name', header: 'Produit', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-inner bg-cover bg-center" style={{ backgroundImage: `url(${r.images[0]})` }} />
        <div>
          <p className="font-medium">{r.name}</p>
          <p className="text-caption text-muted">{r.sizes.length} variante(s)</p>
        </div>
      </div>
    ) },
    { key: 'stock', header: 'Stock', render: (r) => (
      <Badge tone={r.stock === 0 ? 'danger' : r.stock <= 5 ? 'warning' : 'success'}>
        {r.stock} {r.stock === 0 ? '· rupture' : r.stock <= 5 ? '· faible' : ''}
      </Badge>
    ) },
    { key: 'actions', header: 'Action', render: () => (
      <Button variant="outline" size="sm" onClick={() => notify('Mouvement enregistré', 'success')}>
        + Mouvement
      </Button>
    ) },
  ];

  const moveColumns = [
    { key: 'at', header: 'Date', render: (r) => <span className="text-muted">{formatDateTime(r.at)}</span> },
    { key: 'productId', header: 'Produit', render: (r) => <span className="font-medium">{products.find(p => p.id === r.productId)?.name || r.productId}</span> },
    { key: 'variant', header: 'Variante' },
    { key: 'delta', header: 'Variation', render: (r) => <Badge tone={r.delta >= 0 ? 'success' : 'danger'}>{r.delta > 0 ? `+${r.delta}` : r.delta}</Badge> },
    { key: 'reason', header: 'Motif' },
    { key: 'ref', header: 'Référence', render: (r) => <span className="text-muted">{r.ref}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Inventaire</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Stocks</h1>
        <p className="mt-1 text-body text-muted">Gérez vos stocks et consultez l'historique des mouvements.</p>
      </div>

      <div className="inline-flex items-center gap-1 rounded-pill border border-hairline bg-white p-1">
        <button
          className={`rounded-pill px-4 py-1.5 text-body-sm font-medium ${tab === 'list' ? 'bg-ink text-white' : 'text-muted'}`}
          onClick={() => setTab('list')}
        >
          Produits
        </button>
        <button
          className={`rounded-pill px-4 py-1.5 text-body-sm font-medium ${tab === 'moves' ? 'bg-ink text-white' : 'text-muted'}`}
          onClick={() => setTab('moves')}
        >
          Mouvements
        </button>
      </div>

      {tab === 'list' ? (
        <DataTable
          columns={stockColumns}
          rows={products}
          empty={<SectionHeader title="Aucun produit" />}
        />
      ) : (
        <DataTable columns={moveColumns} rows={moves} empty={<SectionHeader title="Aucun mouvement" />} />
      )}
    </div>
  );
}

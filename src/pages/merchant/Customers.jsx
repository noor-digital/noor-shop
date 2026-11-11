import { useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { customers } from '../../data/orders.js';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { formatDate, formatXof } from '../../lib/format.js';
import { Card } from '../../components/ui/Card.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export default function Customers() {
  const { activeStore } = useOutletContext();
  const [search, setSearch] = useState('');
  const rows = useMemo(() => customers.filter((c) => c.storeSlug === activeStore.slug).filter((c) =>
    [c.name, c.phone, c.email].filter(Boolean).some((v) => v.toLowerCase().includes(search.toLowerCase()))
  ), [activeStore.slug, search]);

  const columns = [
    { key: 'name', header: 'Nom', render: (r) => <div><p className="font-medium">{r.name}</p><p className="text-caption text-muted">{r.email || '—'}</p></div> },
    { key: 'phone', header: 'Téléphone' },
    { key: 'orders', header: 'Commandes', render: (r) => `${r.orders} achat(s)` },
    { key: 'spent', header: 'Montant', render: (r) => <span className="font-medium">{formatXof(r.spent)}</span> },
    { key: 'lastOrder', header: 'Dernière', render: (r) => <span className="text-muted">{formatDate(r.lastOrder)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Relation client</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Clients</h1>
        <p className="mt-1 text-body text-muted">Les clients ayant commandé dans {activeStore.name}.</p>
      </div>

      <Card className="p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client…"
          className="h-10 w-full rounded-pill border border-hairline bg-canvas px-4 text-body-sm focus:outline-none focus:border-ink"
        />
      </Card>

      <DataTable
        columns={columns}
        rows={rows}
        empty={<EmptyState title="Aucun client" description="Les clients apparaîtront ici dès vos premières commandes." />}
      />
    </div>
  );
}

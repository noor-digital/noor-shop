import { Link, useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { orders, orderStatuses, paymentStatuses } from '../../data/orders.js';
import { Card, Badge, Pill } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { formatDate, formatXof } from '../../lib/format.js';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export default function Orders() {
  const { activeStore } = useOutletContext();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    let list = orders.filter((o) => o.storeSlug === activeStore.slug);
    if (status !== 'all') list = list.filter((o) => o.status === status);
    if (search) list = list.filter((o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search),
    );
    return list;
  }, [activeStore.slug, status, search]);

  const columns = [
    { key: 'id', header: 'Référence', render: (r) => <Link to={`/merchant/commandes/${r.id}`} className="font-medium hover:underline">{r.id}</Link> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-muted">{formatDate(r.date)}</span> },
    { key: 'customer', header: 'Client', render: (r) => <div><p className="font-medium">{r.customer.name}</p><p className="text-caption text-muted">{r.customer.phone}</p></div> },
    { key: 'items', header: 'Articles', render: (r) => r.items.reduce((s, i) => s + i.quantity, 0) },
    { key: 'total', header: 'Total', render: (r) => <span className="font-medium">{formatXof(r.total)}</span> },
    { key: 'payment', header: 'Paiement', render: (r) => { const p = paymentStatuses.find(x=>x.key===r.payment); return <Badge tone={p.tone}>{p.label}</Badge>; } },
    { key: 'status', header: 'Statut', render: (r) => { const s = orderStatuses.find(x=>x.key===r.status); return <Badge tone={s.tone}>{s.label}</Badge>; } },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Ventes</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Commandes</h1>
        <p className="mt-1 text-body text-muted">Gérez toutes vos commandes depuis une interface unique.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par référence, client ou téléphone…"
            className="h-10 flex-1 min-w-[240px] rounded-pill border border-hairline bg-canvas px-4 text-body-sm focus:outline-none focus:border-ink"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Pill active={status === 'all'} onClick={() => setStatus('all')}>Toutes</Pill>
          {orderStatuses.map((s) => (
            <Pill key={s.key} active={status === s.key} onClick={() => setStatus(s.key)}>
              {s.label}
            </Pill>
          ))}
        </div>
      </Card>

      <DataTable
        columns={columns}
        rows={rows}
        empty={<EmptyState title="Aucune commande" description="Les commandes de votre boutique apparaîtront ici." />}
      />
    </div>
  );
}

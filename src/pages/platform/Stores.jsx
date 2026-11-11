import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { demoStores } from '../../data/stores.js';
import { plans } from '../../data/plans.js';
import { Card, Badge } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { formatXof } from '../../lib/format.js';

export default function Stores() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() =>
    demoStores
      .filter((s) => status === 'all' || s.status === status)
      .filter((s) => [s.name, s.slug].some((v) => v.toLowerCase().includes(search.toLowerCase()))),
    [status, search]);

  const columns = [
    { key: 'name', header: 'Boutique', render: (r) => (
      <Link to={`/platform/boutiques/${r.id}`} className="flex items-center gap-3">
        <span className="h-10 w-10 flex items-center justify-center rounded-pill bg-canvas text-caption font-semibold">{r.logo}</span>
        <div>
          <p className="font-medium hover:underline">{r.name}</p>
          <p className="text-caption text-muted">/{r.slug} · {r.city}</p>
        </div>
      </Link>
    ) },
    { key: 'plan', header: 'Offre', render: (r) => plans.find((p) => p.id === r.plan)?.name || '—' },
    { key: 'orders', header: 'Commandes', render: (r) => r.stats.orders },
    { key: 'revenue', header: 'CA cumulé', render: (r) => <span className="font-medium">{formatXof(r.stats.revenue)}</span> },
    { key: 'status', header: 'Statut', render: (r) => (
      <Badge tone={r.status === 'active' ? 'success' : 'danger'}>{r.status === 'active' ? 'Active' : 'Suspendue'}</Badge>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Boutiques</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Toutes les boutiques</h1>
        <p className="mt-1 text-body text-muted">Supervision des boutiques créées sur la plateforme.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou slug…"
            className="h-10 flex-1 min-w-[220px] rounded-pill border border-hairline bg-canvas px-4 text-body-sm focus:outline-none focus:border-ink"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-pill border border-hairline bg-white px-4 text-body-sm">
            <option value="all">Tous statuts</option>
            <option value="active">Actives</option>
            <option value="suspended">Suspendues</option>
          </select>
        </div>
      </Card>

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}

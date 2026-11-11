import { demoStores } from '../../data/stores.js';
import { plans } from '../../data/plans.js';
import { Card, Badge, Pill } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { formatDate } from '../../lib/format.js';
import { useState } from 'react';

export default function Subscriptions() {
  const [filter, setFilter] = useState('all');
  const rows = demoStores.filter((s) => filter === 'all' || s.subscription.status === filter).map((s) => ({
    id: s.id,
    name: s.name,
    plan: plans.find((p) => p.id === s.plan)?.name,
    status: s.subscription.status,
    startedAt: s.subscription.startedAt,
    endsAt: s.subscription.endsAt,
  }));

  const columns = [
    { key: 'name', header: 'Boutique', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'plan', header: 'Offre' },
    { key: 'status', header: 'Statut', render: (r) => (
      <Badge tone={r.status === 'active' ? 'success' : r.status === 'trial' ? 'info' : r.status === 'expired' ? 'danger' : 'warning'}>
        {r.status}
      </Badge>
    ) },
    { key: 'startedAt', header: 'Début', render: (r) => <span className="text-muted">{formatDate(r.startedAt)}</span> },
    { key: 'endsAt', header: 'Fin', render: (r) => <span className="text-muted">{formatDate(r.endsAt)}</span> },
    { key: 'actions', header: '', render: () => <Button variant="outline" size="sm">Gérer</Button> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Facturation</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Abonnements</h1>
        <p className="mt-1 text-body text-muted">État des abonnements de toutes les boutiques.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'trial', 'expired', 'suspended'].map((f) => (
          <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Tous' : f.charAt(0).toUpperCase() + f.slice(1)}
          </Pill>
        ))}
      </div>

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}

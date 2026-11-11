import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { merchants } from '../../data/platform.js';
import { Card, Badge } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { formatDate } from '../../lib/format.js';

export default function Merchants() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const rows = useMemo(() => merchants
    .filter((m) => status === 'all' || m.status === status)
    .filter((m) => [m.name, m.email, m.phone].some((v) => v.toLowerCase().includes(search.toLowerCase()))),
    [search, status]);

  const columns = [
    { key: 'name', header: 'Commerçant', render: (r) => (
      <Link to={`/platform/commercants/${r.id}`} className="block">
        <p className="font-medium hover:underline">{r.name}</p>
        <p className="text-caption text-muted">{r.email}</p>
      </Link>
    ) },
    { key: 'phone', header: 'Téléphone' },
    { key: 'stores', header: 'Boutiques', render: (r) => `${r.stores} boutique(s)` },
    { key: 'createdAt', header: 'Inscription', render: (r) => <span className="text-muted">{formatDate(r.createdAt)}</span> },
    { key: 'lastLogin', header: 'Dernière connexion', render: (r) => <span className="text-muted">{r.lastLogin ? formatDate(r.lastLogin) : '—'}</span> },
    { key: 'status', header: 'Statut', render: (r) => (
      <Badge tone={r.status === 'active' ? 'success' : r.status === 'suspended' ? 'danger' : 'warning'}>
        {r.status === 'active' ? 'Actif' : r.status === 'suspended' ? 'Suspendu' : 'En attente'}
      </Badge>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Utilisateurs</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Commerçants</h1>
        <p className="mt-1 text-body text-muted">Gérez l'ensemble des comptes commerçants.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, e-mail, téléphone…"
            className="h-10 flex-1 min-w-[220px] rounded-pill border border-hairline bg-canvas px-4 text-body-sm focus:outline-none focus:border-ink"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-pill border border-hairline bg-white px-4 text-body-sm">
            <option value="all">Tous statuts</option>
            <option value="active">Actifs</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendus</option>
          </select>
        </div>
      </Card>

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}

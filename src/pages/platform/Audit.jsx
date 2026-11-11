import { auditLogs } from '../../data/platform.js';
import { Card } from '../../components/ui/Card.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { formatDateTime } from '../../lib/format.js';
import { useState } from 'react';

export default function Audit() {
  const [search, setSearch] = useState('');
  const rows = auditLogs.filter((r) => [r.actor, r.action, r.target, r.reason].some((v) => v.toLowerCase().includes(search.toLowerCase())));
  const columns = [
    { key: 'at', header: 'Date', render: (r) => <span className="text-muted">{formatDateTime(r.at)}</span> },
    { key: 'actor', header: 'Auteur', render: (r) => <span className="font-medium">{r.actor}</span> },
    { key: 'action', header: 'Action' },
    { key: 'target', header: 'Cible' },
    { key: 'reason', header: 'Motif', render: (r) => <span className="text-muted">{r.reason}</span> },
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Traçabilité</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Journal d'activité</h1>
        <p className="mt-1 text-body text-muted">Toutes les actions sensibles effectuées sur la plateforme.</p>
      </div>
      <Card className="p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="h-10 w-full rounded-pill border border-hairline bg-canvas px-4 text-body-sm focus:outline-none focus:border-ink"
        />
      </Card>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}

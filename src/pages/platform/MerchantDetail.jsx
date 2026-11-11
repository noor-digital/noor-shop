import { Link, useParams } from 'react-router-dom';
import { merchants } from '../../data/platform.js';
import { demoStores } from '../../data/stores.js';
import { Card, Badge, SectionHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { formatDate, formatXof } from '../../lib/format.js';

export default function MerchantDetail() {
  const { merchantId } = useParams();
  const m = merchants.find((x) => x.id === merchantId);
  if (!m) return <EmptyState title="Commerçant introuvable" />;
  const stores = demoStores.slice(0, m.stores);

  return (
    <div className="space-y-6">
      <Link to="/platform/commercants" className="text-caption text-muted hover:text-ink">
        ← Tous les commerçants
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-ink text-white text-[18px] font-semibold tracking-tightest">
            {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 className="text-[28px] font-semibold tracking-tightest">{m.name}</h1>
            <p className="text-body-sm text-muted">{m.email} · {m.phone}</p>
            <div className="mt-2 flex gap-2">
              <Badge tone={m.status === 'active' ? 'success' : m.status === 'suspended' ? 'danger' : 'warning'}>
                {m.status === 'active' ? 'Actif' : m.status === 'suspended' ? 'Suspendu' : 'En attente'}
              </Badge>
              <span className="text-caption text-muted">Inscrit le {formatDate(m.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {m.status === 'active' ? (
            <Button variant="danger">Suspendre</Button>
          ) : (
            <Button>Réactiver</Button>
          )}
          <Button variant="outline">Réinitialiser le mot de passe</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Boutiques associées" />
          <ul className="divide-y divide-hairline/60">
            {stores.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <span className="h-10 w-10 flex items-center justify-center rounded-pill bg-canvas font-semibold">{s.logo}</span>
                <div className="flex-1 min-w-0">
                  <Link to={`/platform/boutiques/${s.id}`} className="font-medium hover:underline">{s.name}</Link>
                  <p className="text-caption text-muted">/{s.slug} · {s.stats.orders} commandes</p>
                </div>
                <Badge tone={s.status === 'active' ? 'success' : 'danger'}>
                  {s.status === 'active' ? 'Active' : 'Suspendue'}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionHeader title="Activité commerciale" />
          <dl className="space-y-3 text-body-sm">
            <div className="flex justify-between"><dt className="text-muted">Commandes totales</dt><dd className="font-medium">{stores.reduce((s, x) => s + x.stats.orders, 0)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Volume cumulé</dt><dd className="font-medium">{formatXof(stores.reduce((s, x) => s + x.stats.revenue, 0))}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Dernière connexion</dt><dd>{m.lastLogin ? formatDate(m.lastLogin) : '—'}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  );
}

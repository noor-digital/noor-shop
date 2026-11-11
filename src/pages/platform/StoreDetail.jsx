import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { demoStores } from '../../data/stores.js';
import { plans } from '../../data/plans.js';
import { Card, Badge, SectionHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ConfirmModal } from '../../components/ui/Modal.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { formatXof, formatDate } from '../../lib/format.js';
import { useStore } from '../../context/StoreContext.jsx';

export default function StoreDetail() {
  const { storeId } = useParams();
  const s = demoStores.find((x) => x.id === storeId);
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const { notify } = useStore();

  if (!s) return <EmptyState title="Boutique introuvable" />;
  const plan = plans.find((p) => p.id === s.plan);

  return (
    <div className="space-y-6">
      <Link to="/platform/boutiques" className="text-caption text-muted hover:text-ink">
        ← Toutes les boutiques
      </Link>

      <div className="relative overflow-hidden rounded-card bg-white border border-hairline">
        <div className="aspect-[16/5] bg-cover bg-center" style={{ backgroundImage: `url(${s.cover})` }} />
        <div className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="h-14 w-14 flex items-center justify-center rounded-pill bg-ink text-white text-[18px] font-semibold">{s.logo}</span>
            <div>
              <h1 className="text-[28px] font-semibold tracking-tightest">{s.name}</h1>
              <p className="text-body-sm text-muted">/{s.slug} · {s.city}</p>
              <div className="mt-2 flex gap-2">
                <Badge tone={s.status === 'active' ? 'success' : 'danger'}>
                  {s.status === 'active' ? 'Active' : 'Suspendue'}
                </Badge>
                <Badge tone="info">{plan?.name}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button to={`/boutique/${s.slug}`} variant="outline">Visiter</Button>
            {s.status === 'active' ? (
              <Button variant="danger" onClick={() => setConfirmSuspend(true)}>Suspendre</Button>
            ) : (
              <Button onClick={() => notify('Boutique réactivée', 'success')}>Réactiver</Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <p className="text-caption uppercase tracking-tight text-muted">Commandes</p>
          <p className="mt-2 text-[28px] font-semibold tracking-tightest">{s.stats.orders}</p>
          <p className="text-body-sm text-muted">Depuis la création</p>
        </Card>
        <Card>
          <p className="text-caption uppercase tracking-tight text-muted">CA cumulé</p>
          <p className="mt-2 text-[28px] font-semibold tracking-tightest">{formatXof(s.stats.revenue)}</p>
          <p className="text-body-sm text-muted">Commandes payées</p>
        </Card>
        <Card>
          <p className="text-caption uppercase tracking-tight text-muted">Produits</p>
          <p className="mt-2 text-[28px] font-semibold tracking-tightest">{s.stats.products}</p>
          <p className="text-body-sm text-muted">Au catalogue</p>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Abonnement" action={<Link to={`/platform/abonnements`} className="text-body-sm text-violet hover:underline">Gérer →</Link>} />
        <dl className="grid gap-3 sm:grid-cols-2 text-body-sm">
          <div><dt className="text-caption uppercase tracking-tight text-muted">Offre</dt><dd className="mt-1 font-medium">{plan?.name}</dd></div>
          <div><dt className="text-caption uppercase tracking-tight text-muted">Statut</dt><dd className="mt-1 font-medium">{s.subscription?.status}</dd></div>
          <div><dt className="text-caption uppercase tracking-tight text-muted">Début</dt><dd className="mt-1">{formatDate(s.subscription?.startedAt)}</dd></div>
          <div><dt className="text-caption uppercase tracking-tight text-muted">Fin</dt><dd className="mt-1">{formatDate(s.subscription?.endsAt)}</dd></div>
        </dl>
      </Card>

      <ConfirmModal
        open={confirmSuspend}
        onClose={() => setConfirmSuspend(false)}
        onConfirm={() => { setConfirmSuspend(false); notify('Boutique suspendue — action journalisée', 'success'); }}
        tone="danger"
        title="Suspendre cette boutique ?"
        description="La boutique ne sera plus visible publiquement et ne pourra plus recevoir de commandes. Les données sont conservées."
        confirmLabel="Suspendre"
      />
    </div>
  );
}

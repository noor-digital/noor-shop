import { useOutletContext } from 'react-router-dom';
import { plans } from '../../data/plans.js';
import { Card, Badge, SectionHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Alert } from '../../components/ui/EmptyState.jsx';
import { formatXof, formatDate } from '../../lib/format.js';

export default function Subscription() {
  const { activeStore } = useOutletContext();
  const current = plans.find((p) => p.id === activeStore.plan) || plans[0];
  const sub = activeStore.subscription;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Abonnement</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Offre & abonnement</h1>
        <p className="mt-1 text-body text-muted">Consultez votre offre actuelle et changez-la à tout moment.</p>
      </div>

      {sub?.status === 'trial' && (
        <Alert tone="warning" title="Essai en cours">
          Votre essai gratuit se termine le <strong>{formatDate(sub.endsAt)}</strong>. Activez un abonnement
          pour conserver votre accès sans interruption.
        </Alert>
      )}
      {sub?.status === 'expired' && (
        <Alert tone="danger" title="Abonnement expiré">
          Votre boutique n'est plus visible. Réactivez un abonnement pour reprendre la vente.
        </Alert>
      )}

      <Card>
        <SectionHeader title="Offre actuelle" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[22px] font-semibold tracking-tightest">{current.name}</p>
            <p className="text-body-sm text-muted">{current.tagline}</p>
            <div className="mt-3 flex items-center gap-2">
              <Badge tone={sub?.status === 'active' ? 'success' : sub?.status === 'trial' ? 'info' : 'danger'}>
                {sub?.status === 'active' ? 'Actif' : sub?.status === 'trial' ? 'Essai' : sub?.status === 'expired' ? 'Expiré' : sub?.status}
              </Badge>
              {sub?.endsAt && <span className="text-caption text-muted">Jusqu'au {formatDate(sub.endsAt)}</span>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[24px] font-semibold tracking-tightest">
              {current.price === 0 ? 'Gratuit' : formatXof(current.price)}
              {current.price > 0 && <span className="text-body text-muted">/mois</span>}
            </p>
            <Button variant="outline" className="mt-3">Gérer le paiement</Button>
          </div>
        </div>
      </Card>

      <SectionHeader title="Changer d'offre" subtitle="L'activation est manuelle pour le MVP." />
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id} className={p.id === current.id ? 'border-ink' : ''}>
            <div className="flex items-start justify-between">
              <p className="text-[18px] font-semibold tracking-tightest">{p.name}</p>
              {p.id === current.id && <Badge tone="info">Actuel</Badge>}
            </div>
            <p className="mt-3 text-[24px] font-semibold tracking-tightest">
              {p.price === 0 ? 'Gratuit' : formatXof(p.price)}
            </p>
            <ul className="mt-4 space-y-2 text-body-sm text-muted">
              {p.features.slice(0, 4).map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
            <Button
              variant={p.id === current.id ? 'ghost' : 'primary'}
              className="mt-5 w-full"
              disabled={p.id === current.id}
            >
              {p.id === current.id ? 'Offre actuelle' : "Passer à cette offre"}
            </Button>
          </Card>
        ))}
      </div>

      <Card>
        <SectionHeader title="Historique de facturation" />
        <ul className="divide-y divide-hairline/60 text-body-sm">
          {[
            { date: '2026-11-01', label: 'Abonnement Pro — Novembre', amount: 14900 },
            { date: '2026-10-01', label: 'Abonnement Pro — Octobre', amount: 14900 },
            { date: '2026-09-01', label: 'Abonnement Pro — Septembre', amount: 14900 },
          ].map((row) => (
            <li key={row.date} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{row.label}</p>
                <p className="text-caption text-muted">{formatDate(row.date)}</p>
              </div>
              <p className="font-medium">{formatXof(row.amount)}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

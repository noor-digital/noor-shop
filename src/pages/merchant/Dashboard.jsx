import { useOutletContext, Link } from 'react-router-dom';
import { Stat } from '../../components/ui/Stat.jsx';
import { Card, Badge, SectionHeader } from '../../components/ui/Card.jsx';
import { orders, orderStatuses } from '../../data/orders.js';
import { byStore } from '../../data/catalog.js';
import { formatXof, formatDate } from '../../lib/format.js';
import { Alert } from '../../components/ui/EmptyState.jsx';

export default function Dashboard() {
  const { activeStore } = useOutletContext();
  const storeOrders = orders.filter((o) => o.storeSlug === activeStore.slug);
  const products = byStore(activeStore.slug);
  const pending = storeOrders.filter((o) => o.status === 'pending').length;
  const confirmed = storeOrders.filter((o) => o.status === 'confirmed').length;
  const completed = storeOrders.filter((o) => o.status === 'completed');
  const revenue = completed.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">Tableau de bord</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">
            Bonjour, {activeStore.name}
          </h1>
          <p className="mt-1 text-body text-muted">Voici un aperçu de votre activité aujourd'hui.</p>
        </div>
        <div className="flex gap-2">
          <select className="rounded-pill border border-hairline bg-white px-4 py-2 text-body-sm">
            <option>Aujourd'hui</option>
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
            <option>Période personnalisée</option>
          </select>
        </div>
      </div>

      {activeStore.subscription?.status === 'trial' && (
        <Alert tone="warning" title="Essai en cours">
          Votre essai gratuit se termine le {formatDate(activeStore.subscription.endsAt)}.{' '}
          <Link to="/merchant/abonnement" className="underline">Activer un abonnement</Link>.
        </Alert>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Commandes" value={storeOrders.length} icon="✎" delta="+12 %" hint="vs semaine dernière" />
        <Stat label="En attente" value={pending} icon="◷" delta={pending > 0 ? `${pending} à traiter` : 'À jour'} />
        <Stat label="Chiffre d'affaires" value={formatXof(revenue)} icon="⌁" delta="+6 %" />
        <Stat label="Produits publiés" value={products.length} icon="◫" hint={`${outOfStock} en rupture`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card>
          <SectionHeader
            title="Évolution des commandes"
            subtitle="7 derniers jours — données de démonstration"
          />
          <Sparkline values={[3, 5, 2, 6, 4, 7, 9]} />
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'En préparation', value: storeOrders.filter(o => o.status === 'preparing').length, tone: 'info' },
              { label: 'Prêtes', value: storeOrders.filter(o => o.status === 'ready').length, tone: 'success' },
              { label: 'Terminées', value: completed.length, tone: 'muted' },
            ].map((b) => (
              <div key={b.label} className="rounded-card bg-canvas p-4">
                <p className="text-caption uppercase tracking-tight text-muted">{b.label}</p>
                <p className="mt-2 text-[22px] font-semibold tracking-tightest">{b.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Stocks à surveiller" />
          <ul className="space-y-3">
            {products
              .filter((p) => p.stock <= 5)
              .slice(0, 5)
              .map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 shrink-0 rounded-inner bg-cover bg-center"
                    style={{ backgroundImage: `url(${p.images[0]})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium truncate">{p.name}</p>
                    <p className="text-caption text-muted">{formatXof(p.price)}</p>
                  </div>
                  <Badge tone={p.stock === 0 ? 'danger' : 'warning'}>
                    {p.stock === 0 ? 'Rupture' : `${p.stock} restants`}
                  </Badge>
                </li>
              ))}
          </ul>
          <Link to="/merchant/stocks" className="mt-5 inline-block text-body-sm text-violet hover:underline">
            Gérer les stocks →
          </Link>
        </Card>
      </div>

      <Card>
        <SectionHeader
          title="Dernières commandes"
          action={
            <Link to="/merchant/commandes" className="text-body-sm text-violet hover:underline">
              Tout voir →
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="text-caption uppercase tracking-tight text-muted">
              <tr>
                <th className="pb-3 font-medium">Référence</th>
                <th className="pb-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Montant</th>
                <th className="pb-3 font-medium">Statut</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {storeOrders.slice(0, 5).map((o) => {
                const s = orderStatuses.find((x) => x.key === o.status);
                return (
                  <tr key={o.id} className="border-t border-hairline/60">
                    <td className="py-3">
                      <Link to={`/merchant/commandes/${o.id}`} className="text-ink hover:underline font-medium">
                        {o.id}
                      </Link>
                    </td>
                    <td className="py-3">{o.customer.name}</td>
                    <td className="py-3 font-medium">{formatXof(o.total)}</td>
                    <td className="py-3"><Badge tone={s.tone}>{s.label}</Badge></td>
                    <td className="py-3 text-muted">{formatDate(o.date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Sparkline({ values = [] }) {
  const max = Math.max(...values, 1);
  const w = 100;
  const h = 32;
  const step = w / (values.length - 1);
  const points = values.map((v, i) => `${(i * step).toFixed(2)},${(h - (v / max) * h).toFixed(2)}`).join(' ');
  return (
    <div className="mt-6 flex h-40 items-end gap-2">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-pill bg-violet/20"
          style={{ height: `${(v / max) * 100}%` }}
        >
          <div className="h-full rounded-t-pill bg-gradient-to-t from-violet to-violet-wash" style={{ opacity: 0.8 }} />
        </div>
      ))}
      <svg viewBox={`0 0 ${w} ${h}`} className="absolute pointer-events-none hidden">
        <polyline fill="none" stroke="#5433EB" strokeWidth="2" points={points} />
      </svg>
    </div>
  );
}

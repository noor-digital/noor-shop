import { useOutletContext } from 'react-router-dom';
import { orders } from '../../data/orders.js';
import { byStore } from '../../data/catalog.js';
import { Card, SectionHeader, Badge } from '../../components/ui/Card.jsx';
import { Stat } from '../../components/ui/Stat.jsx';
import { formatXof } from '../../lib/format.js';

export default function Analytics() {
  const { activeStore } = useOutletContext();
  const storeOrders = orders.filter((o) => o.storeSlug === activeStore.slug);
  const products = byStore(activeStore.slug);
  const revenue = storeOrders.filter(o => o.status === 'completed' && o.payment === 'paid').reduce((s, o) => s + o.total, 0);
  const aov = storeOrders.length ? Math.round(storeOrders.reduce((s, o) => s + o.total, 0) / storeOrders.length) : 0;

  const bars = [12, 18, 15, 22, 28, 24, 30];
  const bars2 = [120, 150, 110, 180, 220, 280, 310];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">Analyse</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Statistiques</h1>
          <p className="mt-1 text-body text-muted">Démonstration — données fictives.</p>
        </div>
        <select className="rounded-pill border border-hairline bg-white px-4 py-2 text-body-sm">
          <option>7 derniers jours</option>
          <option>30 derniers jours</option>
          <option>Personnalisé</option>
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Commandes" value={storeOrders.length} delta="+14 %" />
        <Stat label="Chiffre d'affaires" value={formatXof(revenue)} delta="+9 %" />
        <Stat label="Panier moyen" value={formatXof(aov)} delta="+3 %" />
        <Stat label="Produits actifs" value={products.length} hint={`${products.filter(p=>p.stock>0).length} en stock`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Commandes par jour" subtitle="7 derniers jours" />
          <BarChart values={bars} suffix=" cmd" />
        </Card>
        <Card>
          <SectionHeader title="Chiffre d'affaires" subtitle="En milliers de F CFA" />
          <BarChart values={bars2} />
        </Card>
      </div>

      <Card>
        <SectionHeader title="Produits les plus vendus" />
        <ul className="divide-y divide-hairline/60">
          {products.slice(0, 5).map((p, i) => (
            <li key={p.id} className="flex items-center gap-4 py-3">
              <span className="text-caption text-muted w-5">{i + 1}.</span>
              <div className="h-10 w-10 shrink-0 rounded-inner bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]})` }} />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-caption text-muted">{formatXof(p.price)}</p>
              </div>
              <Badge tone="muted">{Math.floor(Math.random() * 30) + 5} ventes</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function BarChart({ values, suffix = '' }) {
  const max = Math.max(...values);
  return (
    <div className="mt-6">
      <div className="flex h-44 items-end gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full rounded-t-pill bg-gradient-to-t from-violet to-violet-wash"
              style={{ height: `${(v / max) * 100}%` }}
            />
            <span className="text-caption text-muted">J{i + 1}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-caption text-muted">Max : {max}{suffix}</p>
    </div>
  );
}

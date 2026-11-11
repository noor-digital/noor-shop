import { Link } from 'react-router-dom';
import { platformStats, auditLogs } from '../../data/platform.js';
import { Stat } from '../../components/ui/Stat.jsx';
import { Card, SectionHeader, Badge } from '../../components/ui/Card.jsx';
import { formatXof, formatDateTime } from '../../lib/format.js';

export default function PlatformDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Vue d'ensemble</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Tableau de bord global</h1>
        <p className="mt-1 text-body text-muted">Supervision opérationnelle de la plateforme NOOR SHOP.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Commerçants" value={platformStats.merchants} icon="◎" delta="+8" hint="ce mois" />
        <Stat label="Boutiques actives" value={`${platformStats.activeStores} / ${platformStats.stores}`} icon="◫" delta="+12" />
        <Stat label="Essais en cours" value={platformStats.trials} icon="⌁" />
        <Stat label="GMV" value={formatXof(platformStats.gmv)} icon="✦" delta="+18 %" hint="7 derniers jours" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card>
          <SectionHeader title="Activité plateforme" subtitle="Commandes agrégées sur 14 jours" />
          <AreaChart />
        </Card>
        <Card>
          <SectionHeader title="État des abonnements" />
          <div className="space-y-4">
            {[
              { label: 'Actifs', value: platformStats.activeSubs, color: 'bg-emerald-500' },
              { label: 'Essais', value: platformStats.trials, color: 'bg-violet' },
              { label: 'Expirés', value: platformStats.expiredSubs, color: 'bg-red-500' },
              { label: 'Suspendus', value: platformStats.suspendedStores, color: 'bg-amber-500' },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-muted">{b.label}</span>
                  <span className="font-medium">{b.value}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-pill bg-canvas overflow-hidden">
                  <div className={`${b.color} h-full`} style={{ width: `${(b.value / platformStats.stores) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader
          title="Dernières actions sensibles"
          action={<Link to="/platform/journal" className="text-body-sm text-violet hover:underline">Voir le journal →</Link>}
        />
        <ul className="divide-y divide-hairline/60 text-body-sm">
          {auditLogs.slice(0, 4).map((log) => (
            <li key={log.id} className="flex items-start gap-3 py-3">
              <span className="mt-1 h-2 w-2 rounded-pill bg-violet shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">
                  {log.action} — <span className="text-ink">{log.target}</span>
                </p>
                <p className="text-caption text-muted">{log.actor} · {formatDateTime(log.at)}</p>
              </div>
              <Badge tone="muted">{log.reason}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function AreaChart() {
  const values = [12, 15, 10, 18, 22, 28, 24, 31, 35, 30, 42, 38, 45, 51];
  const max = Math.max(...values);
  return (
    <div className="mt-6">
      <div className="flex h-44 items-end gap-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex-1 rounded-t-pill bg-gradient-to-t from-violet to-violet-wash" style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-caption text-muted">
        <span>J-13</span>
        <span>Aujourd'hui</span>
      </div>
    </div>
  );
}

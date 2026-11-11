import { Link } from 'react-router-dom';
import { demoStores } from '../../data/stores.js';
import { Card, Badge } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { formatXof } from '../../lib/format.js';

export default function MerchantStores() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">Compte</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Mes boutiques</h1>
          <p className="mt-1 text-body text-muted">
            Sélectionnez une boutique pour la gérer, ou créez-en une nouvelle.
          </p>
        </div>
        <Button to="/merchant/boutiques/nouvelle">Nouvelle boutique</Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {demoStores.map((s) => (
          <Card key={s.id} padded={false} className="overflow-hidden">
            <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${s.cover})` }} />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-ink text-white text-body-sm font-semibold">
                    {s.logo}
                  </span>
                  <div>
                    <p className="font-semibold leading-none">{s.name}</p>
                    <p className="text-caption text-muted mt-1">/{s.slug}</p>
                  </div>
                </div>
                <Badge tone={s.status === 'active' ? 'success' : s.status === 'suspended' ? 'danger' : 'muted'}>
                  {s.status === 'active' ? 'Active' : s.status === 'suspended' ? 'Suspendue' : 'Brouillon'}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-body-sm">
                <div className="rounded-card bg-canvas py-2.5">
                  <p className="text-caption text-muted">Commandes</p>
                  <p className="font-semibold">{s.stats.orders}</p>
                </div>
                <div className="rounded-card bg-canvas py-2.5">
                  <p className="text-caption text-muted">Produits</p>
                  <p className="font-semibold">{s.stats.products}</p>
                </div>
                <div className="rounded-card bg-canvas py-2.5">
                  <p className="text-caption text-muted">CA</p>
                  <p className="font-semibold">{formatXof(s.stats.revenue)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button to="/merchant" variant="outline" className="flex-1">Ouvrir</Button>
                <Button to={`/boutique/${s.slug}`} variant="ghost" className="flex-1">Voir</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

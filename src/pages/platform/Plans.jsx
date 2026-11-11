import { useState } from 'react';
import { plans } from '../../data/plans.js';
import { Card, Badge, SectionHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { formatXof } from '../../lib/format.js';
import { useStore } from '../../context/StoreContext.jsx';

export default function Plans() {
  const [editing, setEditing] = useState(null);
  const { notify } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">Catalogue SaaS</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Offres</h1>
          <p className="mt-1 text-body text-muted">Configurez les offres, limites et fonctionnalités de la plateforme.</p>
        </div>
        <Button onClick={() => setEditing({})}>+ Nouvelle offre</Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id} className={p.highlight ? 'border-ink' : ''}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[20px] font-semibold tracking-tightest">{p.name}</p>
                <p className="text-body-sm text-muted">{p.tagline}</p>
              </div>
              {p.highlight && <Badge tone="info">Populaire</Badge>}
            </div>
            <p className="mt-4 text-[28px] font-semibold tracking-tightest">
              {p.price === 0 ? 'Gratuit' : formatXof(p.price)}
              {p.price > 0 && <span className="text-body text-muted">/mois</span>}
            </p>
            <ul className="mt-4 space-y-2 text-body-sm text-muted">
              {p.features.map((f) => <li key={f}>· {f}</li>)}
            </ul>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(p)}>Modifier</Button>
              <Button variant="ghost" className="flex-1">Désactiver</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Modifier ${editing.name}` : 'Nouvelle offre'}
        actions={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
            <Button onClick={() => { notify('Offre enregistrée', 'success'); setEditing(null); }}>
              Enregistrer
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Input label="Nom" defaultValue={editing?.name} />
          <Input label="Prix (F CFA)" type="number" defaultValue={editing?.price} />
          <Input label="Argumentaire" defaultValue={editing?.tagline} />
          <Input as="textarea" label="Fonctionnalités (une par ligne)" defaultValue={editing?.features?.join('\n')} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Boutiques max" defaultValue={editing?.limits?.stores} />
            <Input label="Produits max" defaultValue={editing?.limits?.products} />
            <Input label="Utilisateurs" defaultValue={editing?.limits?.users} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

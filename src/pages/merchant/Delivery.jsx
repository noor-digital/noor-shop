import { useState } from 'react';
import { Card, SectionHeader } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useStore } from '../../context/StoreContext.jsx';

export default function Delivery() {
  const [zones, setZones] = useState([
    { id: 'dakar', name: 'Dakar centre', fee: 2000, delay: '24h' },
    { id: 'banlieue', name: 'Banlieue dakaroise', fee: 3000, delay: '48h' },
    { id: 'thies', name: 'Thiès', fee: 4500, delay: '72h' },
  ]);
  const { notify } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Logistique</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Livraison & retrait</h1>
        <p className="mt-1 text-body text-muted">Définissez vos zones, tarifs et instructions.</p>
      </div>

      <Card>
        <SectionHeader title="Modes proposés" />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-card border border-hairline p-4 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-hairline" />
            <div>
              <p className="font-medium">Livraison</p>
              <p className="text-caption text-muted mt-1">
                Le client reçoit sa commande à l'adresse indiquée.
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 rounded-card border border-hairline p-4 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-hairline" />
            <div>
              <p className="font-medium">Retrait sur place</p>
              <p className="text-caption text-muted mt-1">Le client vient chercher sa commande.</p>
            </div>
          </label>
        </div>
      </Card>

      <Card>
        <SectionHeader
          title="Zones de livraison"
          subtitle="Les frais appliqués au moment de la commande sont figés dans la commande."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZones((z) => [...z, { id: Date.now().toString(), name: '', fee: 0, delay: '' }])}
            >
              + Ajouter une zone
            </Button>
          }
        />
        <div className="space-y-3">
          {zones.map((z, i) => (
            <div key={z.id} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] items-end rounded-card border border-hairline p-4">
              <Input label="Nom de la zone" defaultValue={z.name} placeholder="Dakar centre" />
              <Input label="Frais (F CFA)" type="number" defaultValue={z.fee} />
              <Input label="Délai indicatif" defaultValue={z.delay} placeholder="24h" />
              <Button variant="ghost" onClick={() => setZones((zs) => zs.filter((_, j) => j !== i))}>
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Instructions de retrait" />
        <Input as="textarea" placeholder="Horaires, adresse, point de repère, contact…" />
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => notify('Options de livraison enregistrées', 'success')}>Enregistrer</Button>
      </div>
    </div>
  );
}

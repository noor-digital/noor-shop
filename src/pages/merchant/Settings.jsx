import { useOutletContext } from 'react-router-dom';
import { Card, SectionHeader } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useStore } from '../../context/StoreContext.jsx';

export default function Settings() {
  const { activeStore } = useOutletContext();
  const { notify } = useStore();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Compte & boutique</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Paramètres</h1>
        <p className="mt-1 text-body text-muted">Compte utilisateur et paramètres de la boutique sélectionnée.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Mon compte" />
          <div className="space-y-4">
            <Input label="Nom complet" defaultValue="Aïssatou Diop" />
            <Input label="Adresse e-mail" defaultValue="aissatou@maam-couture.sn" type="email" />
            <Input label="Téléphone" defaultValue="+221 77 123 45 67" />
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={() => notify('Profil mis à jour', 'success')}>Enregistrer</Button>
            <Button variant="ghost">Modifier le mot de passe</Button>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Boutique active" />
          <div className="space-y-4">
            <Input label="Nom commercial" defaultValue={activeStore.name} />
            <Input label="Identifiant URL" defaultValue={activeStore.slug} hint={`noor.shop/${activeStore.slug}`} />
            <Input label="Téléphone boutique" defaultValue={activeStore.phone} />
            <Input label="Adresse" defaultValue={activeStore.address} />
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={() => notify('Boutique mise à jour', 'success')}>Enregistrer</Button>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Notifications" />
          <div className="space-y-3">
            {['Nouvelles commandes', 'Commandes annulées', 'Alerte stock faible', 'Fin d\'essai d\'abonnement'].map((n) => (
              <label key={n} className="flex items-center justify-between py-2">
                <span className="text-body-sm">{n}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-hairline" />
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Zone dangereuse" />
          <p className="text-body-sm text-muted">
            Désactiver ou supprimer votre boutique est irréversible. Vos commandes historiques seront conservées 90 jours.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline">Désactiver la boutique</Button>
            <Button variant="danger">Supprimer la boutique</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

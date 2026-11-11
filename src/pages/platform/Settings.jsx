import { Card, SectionHeader } from '../../components/ui/Card.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useStore } from '../../context/StoreContext.jsx';

export default function PlatformSettings() {
  const { notify } = useStore();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Plateforme</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Paramètres</h1>
        <p className="mt-1 text-body text-muted">Configuration générale de NOOR SHOP.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Général" />
          <div className="space-y-4">
            <Input label="Nom de la plateforme" defaultValue="NOOR SHOP" />
            <Input label="E-mail support" type="email" defaultValue="hello@noor.shop" />
            <Select label="Langue par défaut" defaultValue="fr">
              <option value="fr">Français</option>
              <option value="en">English</option>
            </Select>
            <Select label="Devise par défaut" defaultValue="XOF">
              <option value="XOF">Franc CFA (XOF)</option>
            </Select>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Essai & abonnements" />
          <div className="space-y-4">
            <Input label="Durée de l'essai (jours)" type="number" defaultValue={14} />
            <Input label="Période de grâce (jours)" type="number" defaultValue={7} />
            <label className="flex items-center justify-between py-2">
              <span className="text-body-sm">Activation manuelle des abonnements</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-hairline" />
            </label>
            <label className="flex items-center justify-between py-2">
              <span className="text-body-sm">Vérification obligatoire de l'e-mail</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-hairline" />
            </label>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Modération & sécurité" />
          <div className="space-y-4">
            <Input label="Mots réservés (slugs)" defaultValue="admin, api, platform, merchant, support" />
            <Input label="Taille maximale des images (Mo)" type="number" defaultValue={5} />
          </div>
        </Card>

        <Card>
          <SectionHeader title="Communications" />
          <div className="space-y-4">
            <Input label="Nom d'expéditeur e-mail" defaultValue="NOOR SHOP" />
            <Input label="Adresse d'expédition" type="email" defaultValue="no-reply@noor.shop" />
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => notify('Paramètres enregistrés', 'success')}>Enregistrer</Button>
      </div>
    </div>
  );
}

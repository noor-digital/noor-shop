import { useOutletContext, Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, SectionHeader } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useStore } from '../../context/StoreContext.jsx';

const templates = [
  { key: 'marble', name: 'Marble', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=70', desc: 'Lumineux, photo produit en vedette' },
  { key: 'editorial', name: 'Editorial', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=70', desc: 'Composition magazine avec catégories' },
  { key: 'gallery', name: 'Gallery', img: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=70', desc: 'Grilles généreuses, idéal artisanat' },
];

const palette = ['#171717', '#5433EB', '#8B5A2B', '#1E3A8A', '#047857', '#B45309', '#9333EA', '#DC2626'];

export default function Customization() {
  const { activeStore } = useOutletContext();
  const [template, setTemplate] = useState(activeStore.theme);
  const [color, setColor] = useState(activeStore.accent);
  const { notify } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-caption uppercase tracking-tight text-muted">Apparence</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Personnalisation</h1>
          <p className="mt-1 text-body text-muted">Adaptez l'identité visuelle de {activeStore.name}.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button to="/merchant/apercu" variant="outline">Aperçu</Button>
          <Button onClick={() => notify('Apparence enregistrée', 'success')}>Enregistrer</Button>
        </div>
      </div>

      <Card>
        <SectionHeader title="Modèle graphique" subtitle="Choisissez un modèle. Vos données restent intactes." />
        <div className="grid gap-5 md:grid-cols-3">
          {templates.map((t) => (
            <button
              key={t.key}
              onClick={() => setTemplate(t.key)}
              className={`text-left rounded-card border bg-white overflow-hidden transition ${
                template === t.key ? 'border-ink shadow-card' : 'border-hairline hover:border-ink'
              }`}
            >
              <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${t.img})` }} />
              <div className="p-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-caption text-muted">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Identité" />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Nom commercial" defaultValue={activeStore.name} />
          <Input label="Slug URL" defaultValue={activeStore.slug} hint={`noor.shop/${activeStore.slug}`} />
          <Input as="textarea" label="Description" defaultValue={activeStore.description} className="md:col-span-2" />
          <div>
            <p className="text-body-sm font-medium mb-2">Couleur principale</p>
            <div className="flex flex-wrap items-center gap-2">
              {palette.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-9 w-9 rounded-pill border transition ${color === c ? 'ring-2 ring-ink ring-offset-2' : 'border-hairline'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-body-sm font-medium mb-2">Logo</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded-pill bg-ink flex items-center justify-center text-white font-semibold">
                {activeStore.logo}
              </div>
              <Button variant="outline">Téléverser</Button>
              <Button variant="ghost">Retirer</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Sections de la page d'accueil" subtitle="Définissez l'ordre d'affichage." />
        <ul className="space-y-2">
          {['Bannière principale', 'Catégories vedettes', 'Nouveautés', 'Produits populaires', 'Section éditoriale'].map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-pill bg-canvas px-4 py-3 text-body-sm">
              <span className="text-muted">≡</span>
              <span className="flex-1">{s}</span>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={i < 4} className="h-4 w-4 rounded border-hairline" />
                <span className="text-caption text-muted">Afficher</span>
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionHeader title="Réseaux sociaux (facultatif)" />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Instagram" placeholder="@maboutique" defaultValue={activeStore.socials?.instagram} />
          <Input label="Facebook" placeholder="MaBoutiqueDakar" defaultValue={activeStore.socials?.facebook} />
        </div>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { slugify } from '../../lib/format.js';

const steps = [
  { key: 'identity', label: 'Identité' },
  { key: 'visual', label: 'Identité visuelle' },
  { key: 'template', label: 'Modèle' },
  { key: 'catalog', label: 'Premières catégories' },
  { key: 'delivery', label: 'Livraison' },
  { key: 'review', label: 'Aperçu' },
];

export default function StoreCreate() {
  const [stepIdx, setStepIdx] = useState(0);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('marble');
  const navigate = useNavigate();
  const progress = ((stepIdx + 1) / steps.length) * 100;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-caption uppercase tracking-tight text-muted">Création</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Nouvelle boutique</h1>
        <p className="mt-1 text-body text-muted">Nous vous guidons en {steps.length} étapes.</p>
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="h-1 w-full bg-canvas">
          <div className="h-full bg-violet transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-hairline p-5">
          {steps.map((s, i) => (
            <div
              key={s.key}
              className={`flex items-center gap-2 rounded-pill px-3 py-1.5 text-body-sm ${
                i === stepIdx ? 'bg-ink text-white' : i < stepIdx ? 'text-muted' : 'text-muted/60'
              }`}
            >
              <span className="h-5 w-5 flex items-center justify-center rounded-pill bg-white/20 text-caption">
                {i < stepIdx ? '✓' : i + 1}
              </span>
              {s.label}
            </div>
          ))}
        </div>

        <div className="p-6">
          {stepIdx === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Nom commercial" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Maam Couture" />
              <Input label="Identifiant URL" value={slugify(name)} readOnly hint={`noor.shop/${slugify(name) || 'ma-boutique'}`} />
              <Input as="textarea" label="Description" placeholder="Que vendez-vous ?" className="md:col-span-2" />
              <Input label="Téléphone boutique" placeholder="+221 77 000 00 00" />
              <Input label="Ville / zone" placeholder="Dakar" />
            </div>
          )}
          {stepIdx === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-body-sm font-medium mb-2">Logo</p>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-pill bg-canvas border border-hairline flex items-center justify-center text-muted">+</div>
                  <Button variant="outline">Téléverser</Button>
                </div>
              </div>
              <div>
                <p className="text-body-sm font-medium mb-2">Couverture</p>
                <div className="rounded-card bg-canvas border border-hairline aspect-[16/7] flex items-center justify-center text-muted">
                  Image de couverture (16/7)
                </div>
              </div>
              <div>
                <p className="text-body-sm font-medium mb-2">Couleur principale</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {['#171717', '#5433EB', '#8B5A2B', '#1E3A8A', '#047857', '#B45309'].map((c) => (
                    <button key={c} className="h-9 w-9 rounded-pill border border-hairline" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {stepIdx === 2 && (
            <div className="grid gap-5 md:grid-cols-3">
              {['marble', 'editorial', 'gallery'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`text-left rounded-card border bg-white p-0 overflow-hidden transition ${
                    template === t ? 'border-ink shadow-card' : 'border-hairline hover:border-ink'
                  }`}
                >
                  <div className="aspect-[4/3] bg-canvas p-3">
                    <div className="h-full w-full rounded-inner bg-cover bg-center" style={{
                      backgroundImage: `url(https://images.unsplash.com/photo-${
                        t === 'marble' ? '1483985988355-763728e1935b' : t === 'editorial' ? '1522337360788-8b13dee7a37e' : '1540574163026-643ea20ade25'
                      }?auto=format&fit=crop&w=900&q=70)`
                    }} />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold capitalize">{t}</p>
                    <p className="text-caption text-muted">
                      {t === 'marble' ? 'Lumineux, aéré, photo produit' : t === 'editorial' ? 'Composition magazine' : 'Grilles généreuses'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {stepIdx === 3 && (
            <div className="space-y-4">
              <p className="text-body text-muted">Créez vos premières catégories (vous pourrez en ajouter plus tard).</p>
              {[1, 2, 3].map((i) => (
                <Input key={i} label={`Catégorie ${i}`} placeholder={`Nom de la catégorie ${i}`} />
              ))}
            </div>
          )}
          {stepIdx === 4 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Modes proposés">
                <option>Livraison + Retrait</option>
                <option>Livraison uniquement</option>
                <option>Retrait uniquement</option>
              </Select>
              <Input label="Frais de livraison Dakar" placeholder="2 000" hint="En F CFA" />
              <Input label="Zones supplémentaires" placeholder="Banlieue, Thiès…" className="md:col-span-2" />
            </div>
          )}
          {stepIdx === 5 && (
            <div className="rounded-card bg-canvas p-6">
              <p className="text-caption uppercase tracking-tight text-muted">Prévisualisation</p>
              <h3 className="mt-2 text-[22px] font-semibold tracking-tightest">{name || 'Ma boutique'}</h3>
              <p className="text-body-sm text-muted">Modèle : {template} · URL : noor.shop/{slugify(name) || 'ma-boutique'}</p>
              <p className="mt-4 text-body text-muted">
                Vérifiez vos informations. Vous pourrez modifier tout cela à tout moment depuis les paramètres.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" disabled={stepIdx === 0} onClick={() => setStepIdx((s) => Math.max(0, s - 1))}>
              ← Précédent
            </Button>
            {stepIdx < steps.length - 1 ? (
              <Button onClick={() => setStepIdx((s) => s + 1)}>Suivant →</Button>
            ) : (
              <Button onClick={() => navigate('/merchant/boutiques')}>Publier ma boutique</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

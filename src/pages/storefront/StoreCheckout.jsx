import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { formatXof } from '../../lib/format.js';
import { Alert } from '../../components/ui/EmptyState.jsx';
import Image from '../../components/ui/Image.jsx';

const zones = [
  { id: 'dakar', name: 'Dakar centre', fee: 2000 },
  { id: 'banlieue', name: 'Banlieue dakaroise', fee: 3000 },
  { id: 'thies', name: 'Thiès', fee: 4500 },
];

export default function StoreCheckout() {
  const { store } = useOutletContext();
  const { cart, cartTotals, clearCart, notify } = useStore();
  const items = cart.storeSlug === store.slug ? cart.items : [];
  const [mode, setMode] = useState('delivery');
  const [zone, setZone] = useState('dakar');
  const navigate = useNavigate();

  const fee = mode === 'delivery' ? zones.find((z) => z.id === zone)?.fee || 0 : 0;
  const total = cartTotals.subtotal + fee;

  if (!items.length) {
    return (
      <section className="mx-auto max-w-page px-5 py-16">
        <Alert tone="warning" title="Panier vide">
          Ajoutez d'abord des articles pour passer commande.
        </Alert>
        <Link className="mt-6 inline-block text-violet hover:underline" to={`/boutique/${store.slug}/catalogue`}>
          ← Retour au catalogue
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-page px-5 py-10">
      <p className="text-caption uppercase tracking-tight text-muted">Commande</p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tightest">Finaliser votre commande</h1>

      <form
        className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]"
        onSubmit={(e) => {
          e.preventDefault();
          const token = Math.random().toString(36).slice(2, 10);
          clearCart();
          notify('Commande enregistrée', 'success');
          navigate(`/boutique/${store.slug}/confirmation/${token}`, {
            state: { mode, zone, total, items, fee },
          });
        }}
      >
        <div className="space-y-6">
          <Card>
            <h3 className="text-[18px] font-semibold tracking-tightest">Vos coordonnées</h3>
            <p className="mt-1 text-caption text-muted">
              Pas besoin de créer un compte. Nous utilisons ces infos uniquement pour cette commande.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="Nom complet" name="name" required placeholder="Awa Diop" />
              <Input label="Téléphone" name="phone" required placeholder="+221 77 000 00 00" />
              <Input label="E-mail (facultatif)" name="email" type="email" placeholder="facultatif" />
            </div>
          </Card>

          <Card>
            <h3 className="text-[18px] font-semibold tracking-tightest">Mode de réception</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label
                className={`cursor-pointer rounded-card border px-5 py-4 transition ${
                  mode === 'delivery' ? 'border-ink bg-canvas' : 'border-hairline bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  className="sr-only"
                  checked={mode === 'delivery'}
                  onChange={() => setMode('delivery')}
                />
                <p className="font-semibold">Livraison</p>
                <p className="mt-1 text-caption text-muted">Reçue chez vous sous 24–72h</p>
              </label>
              <label
                className={`cursor-pointer rounded-card border px-5 py-4 transition ${
                  mode === 'pickup' ? 'border-ink bg-canvas' : 'border-hairline bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  className="sr-only"
                  checked={mode === 'pickup'}
                  onChange={() => setMode('pickup')}
                />
                <p className="font-semibold">Retrait sur place</p>
                <p className="mt-1 text-caption text-muted">À {store.address}</p>
              </label>
            </div>

            {mode === 'delivery' && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Select label="Zone" value={zone} onChange={(e) => setZone(e.target.value)} name="zone">
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — {formatXof(z.fee)}
                    </option>
                  ))}
                </Select>
                <Input label="Adresse de livraison" name="address" required placeholder="Quartier, rue, repère" />
              </div>
            )}

            <Input as="textarea" label="Instructions (facultatif)" name="notes" className="mt-4" placeholder="Horaire préféré, repère, etc." />
          </Card>

          <Alert tone="info" title="Paiement à la livraison ou au retrait">
            Aucun paiement en ligne automatisé n'est intégré au MVP. Le règlement s'effectue à la
            réception de votre commande, en espèces ou par mobile money.
          </Alert>
        </div>

        <aside>
          <Card>
            <h3 className="text-[18px] font-semibold tracking-tightest">Récapitulatif</h3>
            <ul className="mt-5 space-y-3">
              {items.map((it) => (
                <li key={`${it.productId}-${it.variantKey}`} className="flex items-start gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-inner bg-canvas">
                    <Image src={it.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-medium truncate">{it.name}</p>
                    <p className="text-caption text-muted">{it.variantLabel} · ×{it.quantity}</p>
                  </div>
                  <p className="text-body-sm font-medium">{formatXof(it.price * it.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-hairline pt-4 text-body-sm">
              <div className="flex justify-between"><dt className="text-muted">Sous-total</dt><dd>{formatXof(cartTotals.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Frais</dt><dd>{formatXof(fee)}</dd></div>
              <div className="flex justify-between text-body font-semibold text-ink pt-2 border-t border-hairline">
                <dt>Total</dt><dd>{formatXof(total)}</dd>
              </div>
            </dl>
            <Button type="submit" size="lg" className="mt-5 w-full">
              Confirmer la commande
            </Button>
          </Card>
        </aside>
      </form>
    </section>
  );
}

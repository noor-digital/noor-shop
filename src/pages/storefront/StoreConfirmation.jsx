import { Link, useOutletContext, useParams, useLocation } from 'react-router-dom';
import { formatXof } from '../../lib/format.js';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import Image from '../../components/ui/Image.jsx';

export default function StoreConfirmation() {
  const { store } = useOutletContext();
  const { token } = useParams();
  const { state } = useLocation();
  const ref = `NS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  return (
    <section className="mx-auto max-w-page px-5 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-pill bg-emerald-100 text-emerald-700 text-3xl">
          ✓
        </div>
        <h1 className="mt-6 text-[32px] font-semibold tracking-tightest">Merci pour votre commande !</h1>
        <p className="mt-3 text-body text-muted">
          Votre commande a bien été enregistrée auprès de <strong className="text-ink">{store.name}</strong>.
          Vous recevrez une confirmation par téléphone dans les plus brefs délais.
        </p>
      </div>

      <Card className="mx-auto mt-10 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption uppercase tracking-tight text-muted">Référence</p>
            <p className="mt-1 text-[22px] font-semibold tracking-tightest">{ref}</p>
            <p className="text-caption text-muted">Token privé : {token}</p>
          </div>
          <div className="text-right">
            <p className="text-caption uppercase tracking-tight text-muted">Montant total</p>
            <p className="mt-1 text-[22px] font-semibold tracking-tightest">
              {state?.total ? formatXof(state.total) : '—'}
            </p>
            <p className="text-caption text-muted">Paiement à la {state?.mode === 'pickup' ? 'remise' : 'livraison'}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-hairline pt-6">
          <p className="text-caption uppercase tracking-tight text-muted">Articles</p>
          <ul className="mt-3 space-y-3">
            {(state?.items || []).map((it) => (
              <li key={`${it.productId}-${it.variantKey}`} className="flex items-center gap-3 text-body-sm">
                <div className="h-10 w-10 overflow-hidden rounded-inner bg-canvas">
                  <Image src={it.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-caption text-muted">{it.variantLabel} · ×{it.quantity}</p>
                </div>
                <p className="font-medium">{formatXof(it.price * it.quantity)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 border-t border-hairline pt-6">
          <div>
            <p className="text-caption uppercase tracking-tight text-muted">Contact boutique</p>
            <p className="mt-1">{store.phone}</p>
            <p className="text-body-sm text-muted">{store.address}</p>
          </div>
          <div>
            <p className="text-caption uppercase tracking-tight text-muted">Besoin d'aide ?</p>
            <p className="mt-1 text-body-sm text-muted">
              Appelez directement {store.name} pour toute question concernant votre commande.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-8 flex flex-col items-center gap-2">
        <Button to={`/boutique/${store.slug}`} variant="outline">
          Continuer à explorer la boutique
        </Button>
        <p className="text-caption text-muted">
          Conservez votre token privé ({token}) pour consulter votre commande.
        </p>
      </div>
    </section>
  );
}

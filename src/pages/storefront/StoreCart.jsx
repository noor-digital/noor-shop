import { Link, useOutletContext } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { formatXof } from '../../lib/format.js';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Card } from '../../components/ui/Card.jsx';

export default function StoreCart() {
  const { store } = useOutletContext();
  const { cart, cartTotals, updateQuantity, removeItem } = useStore();
  const items = cart.storeSlug === store.slug ? cart.items : [];
  const estimatedShipping = items.length ? 2000 : 0;
  const total = cartTotals.subtotal + estimatedShipping;

  return (
    <section className="mx-auto max-w-page px-5 py-12">
      <p className="text-caption uppercase tracking-tight text-muted">Panier</p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tightest">Votre panier</h1>

      {items.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon="◌"
          title="Votre panier est vide"
          description="Parcourez le catalogue pour y ajouter vos premiers articles."
          action={<Button to={`/boutique/${store.slug}/catalogue`}>Voir le catalogue</Button>}
        />
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            {items.map((item) => (
              <Card
                key={`${item.productId}-${item.variantKey}`}
                padded={false}
                className="flex items-center gap-4 p-3"
              >
                <div
                  className="h-24 w-24 shrink-0 rounded-inner bg-canvas bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-caption text-muted">{item.variantLabel}</p>
                  <p className="mt-1 text-body-sm text-ink">{formatXof(item.price)} / unité</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-pill border border-hairline bg-white">
                    <button
                      className="h-9 w-9 text-lg"
                      onClick={() => updateQuantity(item.productId, item.variantKey, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-body-sm font-medium">{item.quantity}</span>
                    <button
                      className="h-9 w-9 text-lg"
                      onClick={() => updateQuantity(item.productId, item.variantKey, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="hidden sm:block w-24 text-right font-semibold text-ink">
                    {formatXof(item.price * item.quantity)}
                  </div>
                  <button
                    className="h-9 w-9 flex items-center justify-center rounded-pill text-muted hover:text-danger hover:bg-canvas"
                    onClick={() => removeItem(item.productId, item.variantKey)}
                    aria-label="Retirer"
                  >
                    ×
                  </button>
                </div>
              </Card>
            ))}
            <div className="pt-4">
              <Link to={`/boutique/${store.slug}/catalogue`} className="text-body-sm text-violet hover:underline">
                ← Continuer mes achats
              </Link>
            </div>
          </div>

          <Card>
            <h3 className="text-[18px] font-semibold tracking-tightest">Résumé</h3>
            <dl className="mt-5 space-y-3 text-body-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Sous-total ({cartTotals.itemCount} article{cartTotals.itemCount > 1 ? 's' : ''})</dt>
                <dd className="font-medium">{formatXof(cartTotals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Frais estimés</dt>
                <dd className="font-medium">{formatXof(estimatedShipping)}</dd>
              </div>
              <div className="border-t border-hairline pt-3 flex justify-between text-body">
                <dt className="font-semibold text-ink">Total estimé</dt>
                <dd className="font-semibold text-ink">{formatXof(total)}</dd>
              </div>
            </dl>
            <Button to={`/boutique/${store.slug}/commande`} className="mt-5 w-full" size="lg">
              Passer à la commande
            </Button>
            <p className="mt-3 text-caption text-muted text-center">
              Un panier ne peut contenir que des articles d'une seule boutique.
            </p>
          </Card>
        </div>
      )}
    </section>
  );
}

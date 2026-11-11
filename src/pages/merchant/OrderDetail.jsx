import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { orders, orderStatuses, paymentStatuses } from '../../data/orders.js';
import { Card, Badge, SectionHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { formatXof, formatDateTime } from '../../lib/format.js';
import { ConfirmModal } from '../../components/ui/Modal.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export default function OrderDetail() {
  const { orderId } = useParams();
  const order = orders.find((o) => o.id === orderId);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { notify } = useStore();

  if (!order) {
    return (
      <EmptyState
        title="Commande introuvable"
        description="Cette commande n'existe pas ou a été supprimée."
        action={<Button to="/merchant/commandes" variant="outline">Retour</Button>}
      />
    );
  }

  const s = orderStatuses.find((x) => x.key === order.status);
  const p = paymentStatuses.find((x) => x.key === order.payment);
  const sub = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/merchant/commandes" className="text-caption text-muted hover:text-ink">
            ← Toutes les commandes
          </Link>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Commande {order.id}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge tone={s.tone}>{s.label}</Badge>
            <Badge tone={p.tone}>{p.label}</Badge>
            <span className="text-caption text-muted">{formatDateTime(order.date)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">Imprimer</Button>
          <Button variant="danger" onClick={() => setConfirmCancel(true)}>Annuler</Button>
          <Button onClick={() => notify('Statut mis à jour', 'success')}>Marquer comme confirmée</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <Card>
            <SectionHeader title="Articles commandés" />
            <ul className="divide-y divide-hairline/60">
              {order.items.map((it) => (
                <li key={it.productId + it.variant} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-caption text-muted">{it.variant} · ×{it.quantity}</p>
                  </div>
                  <p className="font-medium">{formatXof(it.price * it.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-hairline pt-4 text-body-sm">
              <div className="flex justify-between"><dt className="text-muted">Sous-total</dt><dd>{formatXof(sub)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Frais de livraison</dt><dd>{formatXof(order.delivery)}</dd></div>
              <div className="flex justify-between text-body font-semibold pt-2 border-t border-hairline">
                <dt>Total</dt><dd>{formatXof(order.total)}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <SectionHeader title="Historique" />
            <ul className="space-y-3 text-body-sm">
              {(order.history.length ? order.history : [
                { at: order.date, from: null, to: order.status, by: 'Système' },
              ]).map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-pill bg-violet" aria-hidden />
                  <div>
                    <p className="text-ink">
                      {h.from ? `De ${orderStatuses.find(x=>x.key===h.from)?.label || '-'} à ` : 'Création — '}
                      <strong>{orderStatuses.find(x=>x.key===h.to)?.label || h.to}</strong>
                    </p>
                    <p className="text-caption text-muted">{formatDateTime(h.at)} · {h.by}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <SectionHeader title="Client" />
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-body-sm text-muted">{order.customer.phone}</p>
            {order.customer.address && <p className="text-body-sm text-muted mt-1">{order.customer.address}</p>}
          </Card>
          <Card>
            <SectionHeader title="Mode de réception" />
            <p className="text-body-sm">{order.mode === 'delivery' ? 'Livraison' : 'Retrait sur place'}</p>
            {order.instructions && (
              <p className="mt-3 text-body-sm text-muted">« {order.instructions} »</p>
            )}
          </Card>
          <Card>
            <SectionHeader title="Paiement" />
            <p className="text-body-sm">
              <Badge tone={p.tone}>{p.label}</Badge>
            </p>
            {order.payment !== 'paid' && (
              <Button variant="outline" size="sm" className="mt-3" onClick={() => notify('Commande marquée comme payée', 'success')}>
                Marquer comme payé
              </Button>
            )}
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => { setConfirmCancel(false); notify('Commande annulée', 'success'); }}
        tone="danger"
        title="Annuler cette commande ?"
        description="Les stocks réservés seront libérés. Cette action est tracée dans l'historique."
        confirmLabel="Oui, annuler"
      />
    </div>
  );
}

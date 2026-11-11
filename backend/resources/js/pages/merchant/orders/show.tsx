import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Item = { id: number; product_name: string; variant_label: string | null; unit_price_xof: number; quantity: number; line_total_xof: number };
type History = { id: number; from_status: string | null; to_status: string; actor_type: string; actor_name: string | null; note: string | null; happened_at: string };
type Order = {
    id: number;
    reference: string;
    status: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    delivery_mode: string;
    delivery_address: string | null;
    delivery_fee_xof: number;
    delivery_zone: { id: number; name: string; fee_xof: number } | null;
    subtotal_xof: number;
    total_xof: number;
    notes: string | null;
    created_at: string;
    items: Item[];
    history: History[];
    allowed_transitions: string[];
};
type Props = { currentStore: { id: number; name: string }; order: Order };

const statusLabel: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    preparing: 'En préparation',
    ready: 'Prête',
    completed: 'Terminée',
    cancelled: 'Annulée',
};
const formatXof = (v: number) => `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;

export default function OrderShow({ currentStore, order }: Props) {
    const { props } = usePage<{ flash?: { success?: string }; errors: Record<string, string> }>();
    const [note, setNote] = useState('');

    function transition(to: string) {
        if (to === 'cancelled' && !confirm('Annuler cette commande ? Le stock sera libéré.')) return;
        router.post(`/merchant/orders/${order.id}/transition`, { to, note }, {
            preserveScroll: true,
            onSuccess: () => setNote(''),
        });
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Commerçant', href: '/merchant' },
        { title: 'Commandes', href: '/merchant/orders' },
        { title: order.reference, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Commande ${order.reference}`} />
            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-500">Boutique · {currentStore.name}</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{order.reference}</h1>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">{statusLabel[order.status] ?? order.status}</span>
                </div>

                {props.flash?.success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{props.flash.success}</div>}
                {props.errors?.transition && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{props.errors.transition}</div>}

                <section className="rounded-xl border border-neutral-200 bg-white p-5">
                    <h2 className="text-lg font-semibold">Articles</h2>
                    <table className="mt-3 w-full text-sm">
                        <thead className="text-left text-xs uppercase tracking-wider text-neutral-500">
                            <tr><th className="py-2">Produit</th><th className="py-2">Prix unit.</th><th className="py-2">Qté</th><th className="py-2 text-right">Total</th></tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {order.items.map((it) => (
                                <tr key={it.id}>
                                    <td className="py-2">
                                        <div className="font-medium">{it.product_name}</div>
                                        {it.variant_label && <div className="text-xs text-neutral-500">{it.variant_label}</div>}
                                    </td>
                                    <td className="py-2">{formatXof(it.unit_price_xof)}</td>
                                    <td className="py-2">×{it.quantity}</td>
                                    <td className="py-2 text-right font-medium">{formatXof(it.line_total_xof)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <dl className="mt-4 space-y-1 border-t border-neutral-100 pt-3 text-sm">
                        <div className="flex justify-between"><dt className="text-neutral-500">Sous-total</dt><dd>{formatXof(order.subtotal_xof)}</dd></div>
                        <div className="flex justify-between"><dt className="text-neutral-500">Livraison</dt><dd>{formatXof(order.delivery_fee_xof)}</dd></div>
                        <div className="flex justify-between border-t border-neutral-100 pt-2 text-base font-semibold"><dt>Total</dt><dd>{formatXof(order.total_xof)}</dd></div>
                    </dl>
                </section>

                <section className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200 bg-white p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Client</h3>
                        <p className="mt-2 font-medium">{order.customer_name}</p>
                        <p className="text-sm text-neutral-600">{order.customer_phone}</p>
                        {order.customer_email && <p className="text-sm text-neutral-600">{order.customer_email}</p>}
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Livraison</h3>
                        <p className="mt-2 font-medium">{order.delivery_mode === 'delivery' ? 'Livraison' : 'Retrait sur place'}</p>
                        {order.delivery_zone && <p className="text-sm text-neutral-600">{order.delivery_zone.name}</p>}
                        {order.delivery_address && <p className="text-sm text-neutral-600">{order.delivery_address}</p>}
                    </div>
                </section>

                {order.allowed_transitions.length > 0 && (
                    <section className="rounded-xl border border-neutral-200 bg-white p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Faire évoluer la commande</h3>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            placeholder="Note (facultatif)"
                            className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                        />
                        <div className="mt-3 flex flex-wrap gap-2">
                            {order.allowed_transitions.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => transition(t)}
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${t === 'cancelled' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                                >
                                    {statusLabel[t] ?? t}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                <section className="rounded-xl border border-neutral-200 bg-white p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Historique</h3>
                    <ul className="mt-3 space-y-2 text-sm">
                        {order.history.map((h) => (
                            <li key={h.id} className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neutral-400" />
                                <div>
                                    <p className="font-medium">
                                        {h.from_status ? `${statusLabel[h.from_status]} → ` : ''}{statusLabel[h.to_status] ?? h.to_status}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {h.actor_name ?? h.actor_type} · {h.happened_at.slice(0, 16).replace('T', ' ')}
                                    </p>
                                    {h.note && <p className="text-xs text-neutral-600">« {h.note} »</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </AppLayout>
    );
}

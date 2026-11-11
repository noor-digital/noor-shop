import { Head } from '@inertiajs/react';

type Item = { product_name: string; variant_label: string | null; unit_price_xof: number; quantity: number; line_total_xof: number };
type Props = {
    store: { id: number; slug: string; name: string; accent_color: string };
    order: {
        reference: string;
        status: string;
        customer_name: string;
        customer_phone: string;
        delivery_mode: string;
        delivery_address: string | null;
        delivery_zone: { id: number; name: string; fee_xof: number } | null;
        delivery_fee_xof: number;
        subtotal_xof: number;
        total_xof: number;
        items: Item[];
    };
};

const formatXof = (v: number) => `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;

export default function Confirmation({ store, order }: Props) {
    return (
        <>
            <Head title={`Commande ${order.reference}`} />
            <div className="min-h-screen bg-[#F2F4F5] px-4 py-10">
                <div className="mx-auto max-w-2xl space-y-6">
                    <div className="rounded-2xl bg-white p-8 shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                            <span className="text-2xl text-emerald-600">✓</span>
                        </div>
                        <h1 className="mt-4 text-center text-2xl font-semibold tracking-tight">Merci pour votre commande !</h1>
                        <p className="mt-2 text-center text-sm text-neutral-600">
                            Votre commande a bien été enregistrée auprès de <strong>{store.name}</strong>.
                            Vous recevrez une confirmation par téléphone dans les plus brefs délais.
                        </p>

                        <div className="mt-6 rounded-xl border border-neutral-200 p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-neutral-500">Référence</p>
                                    <p className="mt-1 text-xl font-semibold tracking-tight">{order.reference}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs uppercase tracking-wider text-neutral-500">Total</p>
                                    <p className="mt-1 text-xl font-semibold tracking-tight">{formatXof(order.total_xof)}</p>
                                    <p className="text-xs text-neutral-500">Paiement {order.delivery_mode === 'delivery' ? 'à la livraison' : 'au retrait'}</p>
                                </div>
                            </div>
                            <table className="mt-5 w-full text-sm">
                                <tbody className="divide-y divide-neutral-100">
                                    {order.items.map((it, i) => (
                                        <tr key={i}>
                                            <td className="py-2">
                                                <div className="font-medium">{it.product_name}</div>
                                                <div className="text-xs text-neutral-500">
                                                    {it.variant_label ? `${it.variant_label} · ` : ''}×{it.quantity}
                                                </div>
                                            </td>
                                            <td className="py-2 text-right">{formatXof(it.line_total_xof)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <dl className="mt-4 space-y-1 border-t border-neutral-100 pt-3 text-sm">
                                <div className="flex justify-between"><dt className="text-neutral-500">Sous-total</dt><dd>{formatXof(order.subtotal_xof)}</dd></div>
                                <div className="flex justify-between"><dt className="text-neutral-500">Livraison</dt><dd>{formatXof(order.delivery_fee_xof)}</dd></div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

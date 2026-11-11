import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Commerçant', href: '/merchant' },
    { title: 'Commandes', href: '/merchant/orders' },
];

type Row = {
    id: number;
    reference: string;
    status: string;
    customer_name: string;
    customer_phone: string;
    total_xof: number;
    delivery_mode: string;
    created_at: string;
};

type Props = {
    currentStore: { id: number; name: string };
    orders: { data: Row[]; current_page: number; last_page: number };
    filterStatus: string;
    statuses: string[];
};

const statusLabel: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    preparing: 'En préparation',
    ready: 'Prête',
    completed: 'Terminée',
    cancelled: 'Annulée',
};

function formatXof(v: number): string {
    return `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;
}

export default function OrdersIndex({ currentStore, orders, filterStatus, statuses }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Commandes" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Boutique · {currentStore.name}</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Commandes</h1>
                </div>

                {props.flash?.success && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                        {props.flash.success}
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => router.get('/merchant/orders')}
                        className={`rounded-full px-3 py-1 text-xs ${filterStatus === '' ? 'bg-neutral-900 text-white' : 'border border-neutral-300'}`}
                    >
                        Toutes
                    </button>
                    {statuses.map((s) => (
                        <button
                            key={s}
                            onClick={() => router.get('/merchant/orders', { status: s })}
                            className={`rounded-full px-3 py-1 text-xs ${filterStatus === s ? 'bg-neutral-900 text-white' : 'border border-neutral-300'}`}
                        >
                            {statusLabel[s] ?? s}
                        </button>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                            <tr>
                                <th className="px-4 py-3">Référence</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Mode</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                                        Aucune commande.
                                    </td>
                                </tr>
                            )}
                            {orders.data.map((o) => (
                                <tr key={o.id} className="bg-white">
                                    <td className="px-4 py-3 font-medium">
                                        <Link href={`/merchant/orders/${o.id}`} className="text-indigo-600 hover:underline">
                                            {o.reference}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>{o.customer_name}</div>
                                        <div className="text-xs text-neutral-500">{o.customer_phone}</div>
                                    </td>
                                    <td className="px-4 py-3 font-semibold">{formatXof(o.total_xof)}</td>
                                    <td className="px-4 py-3 text-neutral-500">{o.delivery_mode === 'delivery' ? 'Livraison' : 'Retrait'}</td>
                                    <td className="px-4 py-3">{statusLabel[o.status] ?? o.status}</td>
                                    <td className="px-4 py-3 text-neutral-500">{o.created_at?.slice(0, 10)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

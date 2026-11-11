import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Commerçant', href: '/merchant' },
    { title: 'Clients', href: '/merchant/customers' },
];

type Customer = { id: number; name: string; phone: string; email: string | null; orders_count: number; total_spent_xof: number; last_order_at: string | null };
type Props = { currentStore: { id: number; name: string }; customers: { data: Customer[] } };

const formatXof = (v: number) => `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;

export default function CustomersIndex({ currentStore, customers }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Boutique · {currentStore.name}</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Clients</h1>
                </div>
                <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                            <tr>
                                <th className="px-4 py-3">Nom</th>
                                <th className="px-4 py-3">Téléphone</th>
                                <th className="px-4 py-3">E-mail</th>
                                <th className="px-4 py-3">Commandes</th>
                                <th className="px-4 py-3">Total dépensé</th>
                                <th className="px-4 py-3">Dernière commande</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {customers.data.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">Aucun client pour le moment.</td></tr>
                            )}
                            {customers.data.map((c) => (
                                <tr key={c.id} className="bg-white">
                                    <td className="px-4 py-3 font-medium">{c.name}</td>
                                    <td className="px-4 py-3">{c.phone}</td>
                                    <td className="px-4 py-3 text-neutral-500">{c.email ?? '—'}</td>
                                    <td className="px-4 py-3">{c.orders_count}</td>
                                    <td className="px-4 py-3">{formatXof(c.total_spent_xof)}</td>
                                    <td className="px-4 py-3 text-neutral-500">{c.last_order_at?.slice(0, 10) ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

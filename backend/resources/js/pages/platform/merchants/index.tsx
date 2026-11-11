import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administration', href: '/platform' },
    { title: 'Commerçants', href: '/platform/merchants' },
];

type Merchant = {
    id: number; name: string; email: string; phone: string | null; stores_count: number;
    active_subscription: { status: string; trial_ends_at: string | null; ends_at: string | null } | null;
    created_at: string;
};
type Props = { merchants: { data: Merchant[]; current_page: number; last_page: number } };

export default function MerchantsIndex({ merchants }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Commerçants" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">Commerçants</h1>
                <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                            <tr>
                                <th className="px-4 py-3">Nom</th>
                                <th className="px-4 py-3">E-mail</th>
                                <th className="px-4 py-3">Boutiques</th>
                                <th className="px-4 py-3">Abonnement</th>
                                <th className="px-4 py-3">Inscrit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {merchants.data.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-neutral-500">Aucun commerçant.</td></tr>}
                            {merchants.data.map((m) => (
                                <tr key={m.id} className="bg-white">
                                    <td className="px-4 py-3"><Link href={`/platform/merchants/${m.id}`} className="font-medium text-indigo-600 hover:underline">{m.name}</Link></td>
                                    <td className="px-4 py-3">{m.email}</td>
                                    <td className="px-4 py-3">{m.stores_count}</td>
                                    <td className="px-4 py-3">{m.active_subscription?.status ?? '—'}</td>
                                    <td className="px-4 py-3 text-neutral-500">{m.created_at?.slice(0, 10)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

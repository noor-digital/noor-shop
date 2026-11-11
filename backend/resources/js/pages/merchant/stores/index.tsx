import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Merchant', href: '/merchant' },
    { title: 'Boutiques', href: '/merchant/stores' },
];

type Store = {
    id: number;
    slug: string;
    name: string;
    theme: string;
    status: string;
    created_at: string;
};

type Props = { stores: Store[] };

export default function MerchantStoresIndex({ stores }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes boutiques" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">Mes boutiques</h1>
                <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500 dark:bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3">Nom</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Modèle</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3">Créée</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {stores.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                                        Aucune boutique pour le moment.
                                    </td>
                                </tr>
                            )}
                            {stores.map((s) => (
                                <tr key={s.id} className="bg-white dark:bg-neutral-950">
                                    <td className="px-4 py-3 font-medium">{s.name}</td>
                                    <td className="px-4 py-3 text-neutral-500">/{s.slug}</td>
                                    <td className="px-4 py-3">{s.theme}</td>
                                    <td className="px-4 py-3">{s.status}</td>
                                    <td className="px-4 py-3 text-neutral-500">
                                        {s.created_at?.slice(0, 10)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

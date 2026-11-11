import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Platform', href: '/platform' },
    { title: 'Dashboard', href: '/platform' },
];

type Props = {
    stats: {
        merchants: number;
        stores: number;
        active_stores: number;
        active_subscriptions: number;
    };
};

export default function PlatformDashboard({ stats }: Props) {
    const cards = [
        { label: 'Commerçants', value: stats.merchants },
        { label: 'Boutiques', value: stats.stores },
        { label: 'Boutiques actives', value: stats.active_stores },
        { label: 'Abonnements actifs', value: stats.active_subscriptions },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administration" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Administration</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Tableau de bord</h1>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((c) => (
                        <div
                            key={c.label}
                            className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <p className="text-xs uppercase tracking-wider text-neutral-500">{c.label}</p>
                            <p className="mt-2 text-3xl font-semibold tracking-tight">{c.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

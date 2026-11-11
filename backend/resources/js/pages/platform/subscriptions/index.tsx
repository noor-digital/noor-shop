import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administration', href: '/platform' },
    { title: 'Abonnements', href: '/platform/subscriptions' },
];

type Row = {
    id: number; status: string;
    user: { name: string; email: string } | null;
    plan: { slug: string; name: string; price_xof: number } | null;
    trial_ends_at: string | null; started_at: string | null; ends_at: string | null; grace_ends_at: string | null;
};
type Props = { subscriptions: { data: Row[]; current_page: number; last_page: number } };

export default function SubscriptionsIndex({ subscriptions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Abonnements" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">Abonnements</h1>
                <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                            <tr>
                                <th className="px-4 py-3">Commerçant</th>
                                <th className="px-4 py-3">Offre</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3">Essai / fin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {subscriptions.data.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-neutral-500">Aucun abonnement.</td></tr>}
                            {subscriptions.data.map((s) => (
                                <tr key={s.id} className="bg-white">
                                    <td className="px-4 py-3">{s.user?.name ?? '—'} <span className="text-xs text-neutral-500">{s.user?.email}</span></td>
                                    <td className="px-4 py-3">{s.plan?.name ?? '—'}</td>
                                    <td className="px-4 py-3">{s.status}</td>
                                    <td className="px-4 py-3 text-xs text-neutral-500">
                                        {s.trial_ends_at && <>essai {s.trial_ends_at.slice(0,10)} · </>}
                                        {s.ends_at && <>fin {s.ends_at.slice(0,10)} · </>}
                                        {s.grace_ends_at && <>grâce {s.grace_ends_at.slice(0,10)}</>}
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

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administration', href: '/platform' },
    { title: "Journal d'audit", href: '/platform/audit' },
];

type Log = {
    id: number;
    action: string;
    actor_name: string | null;
    target_type: string | null;
    target_id: number | null;
    target_label: string | null;
    reason: string | null;
    ip_address: string | null;
    happened_at: string;
};
type Props = { logs: { data: Log[]; current_page: number; last_page: number } };

export default function AuditIndex({ logs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Journal d'audit" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Administration</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Journal d'audit</h1>
                </div>
                <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Acteur</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Cible</th>
                                <th className="px-4 py-3">Motif</th>
                                <th className="px-4 py-3">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {logs.data.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-6 text-center text-neutral-500">Aucune entrée.</td></tr>
                            )}
                            {logs.data.map((l) => (
                                <tr key={l.id} className="bg-white align-top">
                                    <td className="px-4 py-3 text-neutral-500">{l.happened_at.slice(0, 19).replace('T', ' ')}</td>
                                    <td className="px-4 py-3">{l.actor_name ?? '—'}</td>
                                    <td className="px-4 py-3 font-medium">{l.action}</td>
                                    <td className="px-4 py-3">{l.target_type} {l.target_label ? `· ${l.target_label}` : ''}</td>
                                    <td className="px-4 py-3 text-neutral-500">{l.reason ?? '—'}</td>
                                    <td className="px-4 py-3 text-neutral-500">{l.ip_address ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

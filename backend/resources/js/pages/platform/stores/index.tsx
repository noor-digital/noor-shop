import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administration', href: '/platform' },
    { title: 'Boutiques', href: '/platform/stores' },
];

type Store = {
    id: number;
    slug: string;
    name: string;
    status: string;
    deleted_at: string | null;
    owner: { id: number; name: string; email: string } | null;
    created_at: string;
};

type Props = { stores: { data: Store[] } };

export default function PlatformStoresIndex({ stores }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const [confirming, setConfirming] = useState<Store | null>(null);
    const [reason, setReason] = useState('');

    function suspend() {
        if (!confirming) return;
        router.post(`/platform/stores/${confirming.id}/suspend`, { reason }, {
            preserveScroll: true,
            onSuccess: () => { setConfirming(null); setReason(''); },
        });
    }

    function reactivate(s: Store) {
        router.post(`/platform/stores/${s.id}/reactivate`, {}, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Boutiques" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Administration</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Boutiques</h1>
                </div>

                {props.flash?.success && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{props.flash.success}</div>
                )}

                <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                            <tr>
                                <th className="px-4 py-3">Boutique</th>
                                <th className="px-4 py-3">Propriétaire</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {stores.data.map((s) => (
                                <tr key={s.id} className="bg-white">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{s.name}</div>
                                        <div className="text-xs text-neutral-500">/{s.slug}</div>
                                    </td>
                                    <td className="px-4 py-3">{s.owner?.name ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {s.status === 'active' ? 'Active' : 'Suspendue'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {s.status === 'active' ? (
                                            <button onClick={() => setConfirming(s)} className="text-red-600 hover:underline">Suspendre</button>
                                        ) : (
                                            <button onClick={() => reactivate(s)} className="text-emerald-600 hover:underline">Réactiver</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {confirming && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6">
                            <h2 className="text-lg font-semibold">Suspendre « {confirming.name} »</h2>
                            <p className="text-sm text-neutral-600">La boutique deviendra invisible pour les clients ; les commerçants gardent l'accès à leurs données.</p>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                placeholder="Motif (obligatoire — enregistré dans le journal)"
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setConfirming(null)} className="rounded-md border border-neutral-300 px-4 py-2 text-sm">Annuler</button>
                                <button onClick={suspend} disabled={reason.length < 3} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Suspendre</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

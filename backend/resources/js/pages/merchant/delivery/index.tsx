import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Commerçant', href: '/merchant' },
    { title: 'Livraison', href: '/merchant/delivery' },
];

type Zone = { id: number; name: string; fee_xof: number; eta: string | null; is_active: boolean; sort_order: number };
type Props = { currentStore: { id: number; name: string }; zones: Zone[] };

const formatXof = (v: number) => `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;

export default function DeliveryIndex({ currentStore, zones }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const create = useForm({ name: '', fee_xof: 0, eta: '', is_active: true, sort_order: 0 });
    const [editing, setEditing] = useState<Zone | null>(null);
    const edit = useForm({ name: '', fee_xof: 0, eta: '', is_active: true, sort_order: 0 });

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        create.post('/merchant/delivery', {
            preserveScroll: true,
            onSuccess: () => create.reset(),
        });
    }

    function openEdit(z: Zone) {
        setEditing(z);
        edit.setData({ name: z.name, fee_xof: z.fee_xof, eta: z.eta ?? '', is_active: z.is_active, sort_order: z.sort_order });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editing) return;
        edit.put(`/merchant/delivery/${editing.id}`, { preserveScroll: true, onSuccess: () => setEditing(null) });
    }

    function remove(z: Zone) {
        if (!confirm(`Supprimer la zone « ${z.name} » ?`)) return;
        router.delete(`/merchant/delivery/${z.id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Zones de livraison" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Boutique · {currentStore.name}</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Zones de livraison</h1>
                </div>

                {props.flash?.success && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{props.flash.success}</div>
                )}

                <form onSubmit={submitCreate} className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:grid-cols-[1fr_120px_120px_auto]">
                    <input value={create.data.name} onChange={(e) => create.setData('name', e.target.value)} placeholder="Nom de la zone" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" required />
                    <input type="number" min={0} value={create.data.fee_xof} onChange={(e) => create.setData('fee_xof', Number(e.target.value))} placeholder="Frais F CFA" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" required />
                    <input value={create.data.eta} onChange={(e) => create.setData('eta', e.target.value)} placeholder="Délai (24-72h)" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                    <button type="submit" disabled={create.processing} className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Ajouter</button>
                </form>

                <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
                            <tr><th className="px-4 py-3">Nom</th><th className="px-4 py-3">Frais</th><th className="px-4 py-3">Délai</th><th className="px-4 py-3">Actif</th><th className="px-4 py-3 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {zones.length === 0 && (<tr><td colSpan={5} className="px-4 py-6 text-center text-neutral-500">Aucune zone. Ajoutez votre première zone ci-dessus.</td></tr>)}
                            {zones.map((z) => (
                                <tr key={z.id} className="bg-white">
                                    <td className="px-4 py-3 font-medium">{z.name}</td>
                                    <td className="px-4 py-3">{formatXof(z.fee_xof)}</td>
                                    <td className="px-4 py-3 text-neutral-500">{z.eta ?? '—'}</td>
                                    <td className="px-4 py-3">{z.is_active ? 'Oui' : 'Non'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => openEdit(z)} className="mr-3 text-indigo-600 hover:underline">Modifier</button>
                                        <button onClick={() => remove(z)} className="text-red-600 hover:underline">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <form onSubmit={submitEdit} className="w-full max-w-md space-y-4 rounded-xl bg-white p-6">
                            <h2 className="text-lg font-semibold">Modifier la zone</h2>
                            <input value={edit.data.name} onChange={(e) => edit.setData('name', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" required />
                            <input type="number" min={0} value={edit.data.fee_xof} onChange={(e) => edit.setData('fee_xof', Number(e.target.value))} className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" required />
                            <input value={edit.data.eta} onChange={(e) => edit.setData('eta', e.target.value)} placeholder="Délai" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.data.is_active} onChange={(e) => edit.setData('is_active', e.target.checked)} /> Zone active</label>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-neutral-300 px-4 py-2 text-sm">Annuler</button>
                                <button type="submit" disabled={edit.processing} className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

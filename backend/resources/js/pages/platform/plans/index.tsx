import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administration', href: '/platform' },
    { title: 'Offres', href: '/platform/plans' },
];

type Plan = {
    id: number; slug: string; name: string; tagline: string | null; price_xof: number;
    max_stores: number | null; max_products: number | null; max_users: number | null;
    features: string[] | null; is_active: boolean; is_highlighted: boolean; sort_order: number;
};
type Props = { plans: Plan[] };

const formatXof = (v: number) => `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;

export default function PlansIndex({ plans }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const [editing, setEditing] = useState<Plan | null>(null);
    const form = useForm<Record<string, unknown>>({});

    function openEdit(p: Plan) {
        setEditing(p);
        form.setData({
            name: p.name, tagline: p.tagline ?? '', price_xof: p.price_xof,
            max_stores: p.max_stores, max_products: p.max_products, max_users: p.max_users,
            features: (p.features ?? []).join('\n'),
            is_active: p.is_active, is_highlighted: p.is_highlighted, sort_order: p.sort_order,
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editing) return;
        const data = form.data as Record<string, unknown>;
        const payload = { ...data, features: (data.features as string).split('\n').map((l) => l.trim()).filter(Boolean) };
        router.put(`/platform/plans/${editing.id}`, payload, { preserveScroll: true, onSuccess: () => setEditing(null) });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offres" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">Offres SaaS</h1>
                {props.flash?.success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{props.flash.success}</div>}
                <div className="grid gap-4 sm:grid-cols-3">
                    {plans.map((p) => (
                        <div key={p.id} className="rounded-xl border border-neutral-200 bg-white p-5">
                            <p className="text-xs uppercase tracking-wider text-neutral-500">{p.slug}</p>
                            <h2 className="mt-1 text-lg font-semibold">{p.name}</h2>
                            <p className="mt-2 text-2xl font-semibold">{p.price_xof === 0 ? 'Gratuit' : formatXof(p.price_xof)}</p>
                            {p.tagline && <p className="mt-1 text-sm text-neutral-600">{p.tagline}</p>}
                            <ul className="mt-3 space-y-1 text-xs text-neutral-500">
                                <li>Boutiques max : {p.max_stores ?? 'illimité'}</li>
                                <li>Produits max : {p.max_products ?? 'illimité'}</li>
                                <li>Utilisateurs max : {p.max_users ?? 'illimité'}</li>
                            </ul>
                            <button onClick={() => openEdit(p)} className="mt-4 rounded-md border border-neutral-300 px-3 py-1.5 text-sm">Modifier</button>
                        </div>
                    ))}
                </div>

                {editing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <form onSubmit={submitEdit} className="w-full max-w-lg space-y-3 rounded-xl bg-white p-6">
                            <h2 className="text-lg font-semibold">Modifier l'offre {editing.name}</h2>
                            <input value={form.data.name as string} onChange={(e) => form.setData('name', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" required />
                            <input value={form.data.tagline as string} onChange={(e) => form.setData('tagline', e.target.value)} placeholder="Argumentaire" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                            <input type="number" min={0} value={form.data.price_xof as number} onChange={(e) => form.setData('price_xof', Number(e.target.value))} placeholder="Prix F CFA" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                            <div className="grid grid-cols-3 gap-2">
                                <input type="number" min={1} value={(form.data.max_stores as number | null) ?? ''} onChange={(e) => form.setData('max_stores', e.target.value ? Number(e.target.value) : null)} placeholder="Boutiques" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                                <input type="number" min={1} value={(form.data.max_products as number | null) ?? ''} onChange={(e) => form.setData('max_products', e.target.value ? Number(e.target.value) : null)} placeholder="Produits" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                                <input type="number" min={1} value={(form.data.max_users as number | null) ?? ''} onChange={(e) => form.setData('max_users', e.target.value ? Number(e.target.value) : null)} placeholder="Utilisateurs" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                            </div>
                            <textarea value={form.data.features as string} onChange={(e) => form.setData('features', e.target.value)} rows={5} placeholder="Une fonctionnalité par ligne" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} /> Actif</label>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.data.is_highlighted} onChange={(e) => form.setData('is_highlighted', e.target.checked)} /> Populaire</label>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-neutral-300 px-4 py-2 text-sm">Annuler</button>
                                <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

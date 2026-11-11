import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

type StoreDraft = { id?: number; slug?: string; name?: string; description?: string; theme?: string; accent_color?: string; logo_text?: string; phone?: string; city?: string; address?: string };
type Props = { store: StoreDraft | null; themes: string[] };

export default function StoreForm({ store, themes }: Props) {
    const isEdit = !!store?.id;
    const form = useForm({
        name: store?.name ?? '',
        slug: store?.slug ?? '',
        description: store?.description ?? '',
        theme: store?.theme ?? 'marble',
        accent_color: store?.accent_color ?? '#5433EB',
        logo_text: store?.logo_text ?? '',
        phone: store?.phone ?? '',
        city: store?.city ?? '',
        address: store?.address ?? '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Commerçant', href: '/merchant' },
        { title: 'Boutiques', href: '/merchant/stores' },
        { title: isEdit ? 'Modifier' : 'Nouvelle', href: '#' },
    ];

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) form.put(`/merchant/stores/${store!.id}`);
        else form.post('/merchant/stores');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? `Modifier ${store?.name}` : 'Nouvelle boutique'} />
            <form onSubmit={submit} className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? `Modifier « ${store?.name} »` : 'Nouvelle boutique'}</h1>

                <label className="flex flex-col gap-1 text-sm">Nom
                    <input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required className="rounded-md border border-neutral-300 px-3 py-2" />
                    {form.errors.name && <span className="text-xs text-red-600">{form.errors.name}</span>}
                </label>
                <label className="flex flex-col gap-1 text-sm">Slug (facultatif)
                    <input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} placeholder="auto" className="rounded-md border border-neutral-300 px-3 py-2" />
                    {form.errors.slug && <span className="text-xs text-red-600">{form.errors.slug}</span>}
                </label>
                <label className="flex flex-col gap-1 text-sm">Description
                    <textarea value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} rows={3} className="rounded-md border border-neutral-300 px-3 py-2" />
                </label>
                <label className="flex flex-col gap-1 text-sm">Modèle graphique
                    <select value={form.data.theme} onChange={(e) => form.setData('theme', e.target.value)} className="rounded-md border border-neutral-300 px-3 py-2">
                        {themes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </label>
                <label className="flex flex-col gap-1 text-sm">Couleur principale
                    <input type="color" value={form.data.accent_color} onChange={(e) => form.setData('accent_color', e.target.value)} className="h-10 w-20 rounded-md border border-neutral-300" />
                </label>
                <label className="flex flex-col gap-1 text-sm">Logo texte (2-4 lettres)
                    <input value={form.data.logo_text} onChange={(e) => form.setData('logo_text', e.target.value)} maxLength={4} className="w-24 rounded-md border border-neutral-300 px-3 py-2" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm">Téléphone
                        <input value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} className="rounded-md border border-neutral-300 px-3 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">Ville
                        <input value={form.data.city} onChange={(e) => form.setData('city', e.target.value)} className="rounded-md border border-neutral-300 px-3 py-2" />
                    </label>
                </div>
                <label className="flex flex-col gap-1 text-sm">Adresse
                    <input value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} className="rounded-md border border-neutral-300 px-3 py-2" />
                </label>

                {(form.errors as { subscription?: string }).subscription && (
                    <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        {(form.errors as { subscription?: string }).subscription}
                    </div>
                )}

                <div className="flex justify-end">
                    <button type="submit" disabled={form.processing} className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                        {isEdit ? 'Enregistrer' : 'Créer la boutique'}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

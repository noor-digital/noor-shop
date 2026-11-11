import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

type Props = {
    currentStore: { id: number; slug: string; name: string; theme: string; accent_color: string };
    settings: {
        home_sections: string[];
        home_sections_enabled: string[];
        instagram_handle: string | null;
        facebook_handle: string | null;
        whatsapp_number: string | null;
        seo_title: string | null;
        seo_description: string | null;
    };
    availableSections: string[];
};

export default function StoreSettingsPage({ currentStore, settings, availableSections }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const form = useForm({
        home_sections: settings.home_sections,
        home_sections_enabled: settings.home_sections_enabled,
        instagram_handle: settings.instagram_handle ?? '',
        facebook_handle: settings.facebook_handle ?? '',
        whatsapp_number: settings.whatsapp_number ?? '',
        seo_title: settings.seo_title ?? '',
        seo_description: settings.seo_description ?? '',
    });

    function toggleSection(key: string) {
        const next = form.data.home_sections_enabled.includes(key)
            ? form.data.home_sections_enabled.filter((k) => k !== key)
            : [...form.data.home_sections_enabled, key];
        form.setData('home_sections_enabled', next);
    }

    function submit(e: React.FormEvent) { e.preventDefault(); form.put('/merchant/settings'); }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Commerçant', href: '/merchant' },
        { title: 'Paramètres boutique', href: '/merchant/settings' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Paramètres — ${currentStore.name}`} />
            <form onSubmit={submit} className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Boutique · {currentStore.name}</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Paramètres de la boutique</h1>
                </div>
                {props.flash?.success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{props.flash.success}</div>}

                <section className="rounded-xl border border-neutral-200 bg-white p-5">
                    <h2 className="text-lg font-semibold">Sections de la page d'accueil</h2>
                    <ul className="mt-3 space-y-2">
                        {availableSections.map((s) => (
                            <li key={s} className="flex items-center gap-3">
                                <input type="checkbox" checked={form.data.home_sections_enabled.includes(s)} onChange={() => toggleSection(s)} />
                                <span className="text-sm">{s}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="rounded-xl border border-neutral-200 bg-white p-5 grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm">Instagram
                        <input value={form.data.instagram_handle} onChange={(e) => form.setData('instagram_handle', e.target.value)} placeholder="@mamaison" className="rounded-md border border-neutral-300 px-3 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">Facebook
                        <input value={form.data.facebook_handle} onChange={(e) => form.setData('facebook_handle', e.target.value)} className="rounded-md border border-neutral-300 px-3 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm sm:col-span-2">WhatsApp
                        <input value={form.data.whatsapp_number} onChange={(e) => form.setData('whatsapp_number', e.target.value)} placeholder="+221…" className="rounded-md border border-neutral-300 px-3 py-2" />
                    </label>
                </section>

                <section className="rounded-xl border border-neutral-200 bg-white p-5">
                    <h2 className="text-lg font-semibold">SEO</h2>
                    <label className="mt-3 flex flex-col gap-1 text-sm">Titre
                        <input value={form.data.seo_title} onChange={(e) => form.setData('seo_title', e.target.value)} className="rounded-md border border-neutral-300 px-3 py-2" />
                    </label>
                    <label className="mt-3 flex flex-col gap-1 text-sm">Description
                        <textarea value={form.data.seo_description} onChange={(e) => form.setData('seo_description', e.target.value)} rows={3} className="rounded-md border border-neutral-300 px-3 py-2" />
                    </label>
                </section>

                <div className="flex justify-end">
                    <button type="submit" disabled={form.processing} className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Enregistrer</button>
                </div>
            </form>
        </AppLayout>
    );
}

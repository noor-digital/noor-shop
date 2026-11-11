import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Commerçant', href: '/merchant' },
    { title: 'Catégories', href: '/merchant/categories' },
];

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    products_count: number;
    created_at: string;
};

type Props = {
    currentStore: { id: number; name: string; slug: string };
    categories: Category[];
};

type FlashBag = { success?: string } & Record<string, unknown>;

export default function CategoriesIndex({ currentStore, categories }: Props) {
    const { props } = usePage<{ flash: FlashBag }>();
    const flashSuccess = props.flash?.success;
    const [editing, setEditing] = useState<Category | null>(null);

    const createForm = useForm({ name: '', slug: '', description: '', sort_order: 0 });
    const editForm = useForm({ name: '', slug: '', description: '', sort_order: 0 });

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/merchant/categories', {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    }

    function openEdit(c: Category) {
        setEditing(c);
        editForm.setData({
            name: c.name,
            slug: c.slug,
            description: c.description ?? '',
            sort_order: c.sort_order,
        });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editing) return;
        editForm.put(`/merchant/categories/${editing.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        });
    }

    function remove(c: Category) {
        if (!confirm(`Supprimer la catégorie « ${c.name} » ?`)) return;
        router.delete(`/merchant/categories/${c.id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catégories" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                        Boutique active · {currentStore.name}
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Catégories</h1>
                </div>

                {flashSuccess && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
                        {flashSuccess}
                    </div>
                )}

                <form
                    onSubmit={submitCreate}
                    className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-[1fr_1fr_auto]"
                >
                    <div>
                        <label className="mb-1 block text-xs font-medium">Nom</label>
                        <input
                            type="text"
                            value={createForm.data.name}
                            onChange={(e) => createForm.setData('name', e.target.value)}
                            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                            required
                        />
                        {createForm.errors.name && (
                            <p className="mt-1 text-xs text-red-600">{createForm.errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium">Slug (facultatif)</label>
                        <input
                            type="text"
                            value={createForm.data.slug}
                            onChange={(e) => createForm.setData('slug', e.target.value)}
                            placeholder="auto"
                            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                        />
                        {createForm.errors.slug && (
                            <p className="mt-1 text-xs text-red-600">{createForm.errors.slug}</p>
                        )}
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                        >
                            Ajouter
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500 dark:bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3">Nom</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Produits</th>
                                <th className="px-4 py-3">Ordre</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                                        Aucune catégorie. Créez-en une avec le formulaire ci-dessus.
                                    </td>
                                </tr>
                            )}
                            {categories.map((c) => (
                                <tr key={c.id} className="bg-white dark:bg-neutral-950">
                                    <td className="px-4 py-3 font-medium">{c.name}</td>
                                    <td className="px-4 py-3 text-neutral-500">/{c.slug}</td>
                                    <td className="px-4 py-3">{c.products_count}</td>
                                    <td className="px-4 py-3">{c.sort_order}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(c)}
                                            className="mr-3 text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => remove(c)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <form
                            onSubmit={submitEdit}
                            className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 dark:bg-neutral-900"
                        >
                            <h2 className="text-lg font-semibold">Modifier la catégorie</h2>
                            <div>
                                <label className="mb-1 block text-xs font-medium">Nom</label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="mt-1 text-xs text-red-600">{editForm.errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium">Slug</label>
                                <input
                                    type="text"
                                    value={editForm.data.slug}
                                    onChange={(e) => editForm.setData('slug', e.target.value)}
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                                />
                                {editForm.errors.slug && (
                                    <p className="mt-1 text-xs text-red-600">{editForm.errors.slug}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium">Description</label>
                                <textarea
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

type Category = { id: number; name: string };
type ProductForEdit = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price_xof: number;
    promo_price_xof: number | null;
    stock: number;
    status: string;
    category_id: number | null;
    images: { id: number; url: string; alt_text: string | null }[];
};

type Props = {
    currentStore: { id: number; name: string; slug: string };
    categories: Category[];
    product: ProductForEdit | null;
    statuses: string[];
};

const statusLabel: Record<string, string> = {
    draft: 'Brouillon',
    published: 'Publié',
    archived: 'Archivé',
};

export default function ProductForm({ currentStore, categories, product, statuses }: Props) {
    const isEdit = product !== null;

    const form = useForm({
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        description: product?.description ?? '',
        price_xof: product?.price_xof ?? 0,
        promo_price_xof: product?.promo_price_xof ?? '',
        stock: product?.stock ?? 0,
        status: product?.status ?? 'draft',
        category_id: product?.category_id ?? '',
        images: [] as File[],
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Commerçant', href: '/merchant' },
        { title: 'Produits', href: '/merchant/products' },
        { title: isEdit ? 'Modifier' : 'Nouveau', href: '#' },
    ];

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            // Laravel accepts form-data POST with _method=PUT when there are files.
            form.post(`/merchant/products/${product!.id}`, {
                forceFormData: true,
                _method: 'put',
            } as unknown as Parameters<typeof form.post>[1]);
        } else {
            form.post('/merchant/products', { forceFormData: true });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? `Modifier · ${product!.name}` : 'Nouveau produit'} />
            <form onSubmit={submit} className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                        Boutique active · {currentStore.name}
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        {isEdit ? `Modifier « ${product!.name} »` : 'Nouveau produit'}
                    </h1>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium">Nom</label>
                            <input
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                                required
                            />
                            {form.errors.name && <p className="mt-1 text-xs text-red-600">{form.errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium">Catégorie</label>
                            <select
                                value={form.data.category_id}
                                onChange={(e) =>
                                    form.setData('category_id', e.target.value ? Number(e.target.value) : '')
                                }
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                            >
                                <option value="">Aucune</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {form.errors.category_id && (
                                <p className="mt-1 text-xs text-red-600">{form.errors.category_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium">Statut</label>
                            <select
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value)}
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                            >
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {statusLabel[s] ?? s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium">Prix (F CFA)</label>
                            <input
                                type="number"
                                min={0}
                                value={form.data.price_xof}
                                onChange={(e) => form.setData('price_xof', Number(e.target.value))}
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                                required
                            />
                            {form.errors.price_xof && (
                                <p className="mt-1 text-xs text-red-600">{form.errors.price_xof}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium">Prix promo (F CFA, facultatif)</label>
                            <input
                                type="number"
                                min={0}
                                value={form.data.promo_price_xof}
                                onChange={(e) =>
                                    form.setData('promo_price_xof', e.target.value === '' ? '' : Number(e.target.value))
                                }
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                            />
                            {form.errors.promo_price_xof && (
                                <p className="mt-1 text-xs text-red-600">{form.errors.promo_price_xof}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium">Stock</label>
                            <input
                                type="number"
                                min={0}
                                value={form.data.stock}
                                onChange={(e) => form.setData('stock', Number(e.target.value))}
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium">Description</label>
                            <textarea
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                rows={5}
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium">
                                Images ({product?.images?.length ?? 0} existantes · jpg/png/webp, max 5 Mo)
                            </label>
                            {product?.images && product.images.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {product.images.map((img) => (
                                        <img
                                            key={img.id}
                                            src={img.url}
                                            alt={img.alt_text ?? ''}
                                            className="h-20 w-20 rounded-md object-cover"
                                        />
                                    ))}
                                </div>
                            )}
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => form.setData('images', Array.from(e.target.files ?? []))}
                                className="block w-full text-sm"
                            />
                            {form.errors.images && (
                                <p className="mt-1 text-xs text-red-600">{form.errors.images}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                    >
                        {isEdit ? 'Enregistrer' : 'Créer le produit'}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

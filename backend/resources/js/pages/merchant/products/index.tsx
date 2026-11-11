import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Commerçant', href: '/merchant' },
    { title: 'Produits', href: '/merchant/products' },
];

type Product = {
    id: number;
    name: string;
    slug: string;
    price_xof: number;
    promo_price_xof: number | null;
    stock: number;
    status: string;
    category: { id: number; name: string } | null;
    image: string | null;
};

type PageProps = {
    currentStore: { id: number; name: string; slug: string };
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
    };
};

type FlashBag = { success?: string } & Record<string, unknown>;

function formatXof(v: number | null | undefined): string {
    if (v == null) return '—';
    return `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;
}

const statusLabel: Record<string, string> = {
    draft: 'Brouillon',
    published: 'Publié',
    archived: 'Archivé',
};

export default function ProductsIndex({ currentStore, products }: PageProps) {
    const { props } = usePage<{ flash: FlashBag }>();
    const flashSuccess = props.flash?.success;

    function remove(p: Product) {
        if (!confirm(`Supprimer le produit « ${p.name} » ?`)) return;
        router.delete(`/merchant/products/${p.id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produits" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-500">
                            Boutique active · {currentStore.name}
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Produits</h1>
                    </div>
                    <Link
                        href="/merchant/products/create"
                        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                    >
                        + Nouveau produit
                    </Link>
                </div>

                {flashSuccess && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
                        {flashSuccess}
                    </div>
                )}

                <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500 dark:bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3">Nom</th>
                                <th className="px-4 py-3">Catégorie</th>
                                <th className="px-4 py-3">Prix</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                                        Aucun produit. Créez votre premier produit avec le bouton ci-dessus.
                                    </td>
                                </tr>
                            )}
                            {products.data.map((p) => (
                                <tr key={p.id} className="bg-white dark:bg-neutral-950">
                                    <td className="px-4 py-3 font-medium">{p.name}</td>
                                    <td className="px-4 py-3 text-neutral-500">{p.category?.name ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        {p.promo_price_xof ? (
                                            <>
                                                <span className="font-semibold">{formatXof(p.promo_price_xof)}</span>
                                                <span className="ml-2 text-xs text-neutral-500 line-through">
                                                    {formatXof(p.price_xof)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-semibold">{formatXof(p.price_xof)}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{p.stock}</td>
                                    <td className="px-4 py-3">{statusLabel[p.status] ?? p.status}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/merchant/products/${p.id}/edit`}
                                            className="mr-3 text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            Modifier
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => remove(p)}
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

                {products.last_page > 1 && (
                    <p className="text-xs text-neutral-500">
                        Page {products.current_page} / {products.last_page}
                    </p>
                )}
            </div>
        </AppLayout>
    );
}

import { Head, Link } from '@inertiajs/react';

type Store = { id: number; slug: string; name: string; logo_text: string | null };
type Product = {
    id: number; slug: string; name: string;
    price_xof: number; promo_price_xof: number | null; effective_price_xof: number;
    in_stock: boolean; image: string | null;
    category: { name: string; slug: string } | null;
};
type Props = { store: Store; products: { data: Product[]; current_page: number; last_page: number } };

const formatXof = (v: number) => `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;

export default function StorefrontCatalog({ store, products }: Props) {
    return (
        <>
            <Head title={`Catalogue — ${store.name}`} />
            <div className="min-h-screen bg-[#F2F4F5] text-[#171717]">
                <div className="bg-[#171717] py-2 text-center text-xs font-medium text-white">
                    Boutique de démonstration · {store.name} · Données fictives
                </div>
                <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
                    <Link href={`/boutique/${store.slug}`} className="font-semibold">{store.name}</Link>
                    <Link href={`/boutique/${store.slug}/commande`} className="rounded-full bg-[#171717] px-4 py-2 text-sm text-white">
                        Panier
                    </Link>
                </header>

                <section className="mx-auto max-w-6xl px-5 py-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Catalogue</h1>
                    <p className="mt-2 text-sm text-neutral-600">
                        {products.data.length} produit{products.data.length > 1 ? 's' : ''} publié{products.data.length > 1 ? 's' : ''} affiché{products.data.length > 1 ? 's' : ''}
                    </p>
                </section>

                <section className="mx-auto max-w-6xl px-5 pb-10">
                    {products.data.length === 0 ? (
                        <p className="text-sm text-neutral-500">Aucun produit disponible.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {products.data.map((p) => (
                                <Link key={p.id} href={`/boutique/${store.slug}/produit/${p.slug}`} className="group block rounded-2xl bg-white p-2 shadow-sm transition hover:-translate-y-1">
                                    <div className="aspect-square overflow-hidden rounded-xl bg-neutral-100">
                                        {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : null}
                                    </div>
                                    <div className="px-2 pt-3 pb-2">
                                        <p className="text-sm font-semibold leading-tight">{p.name}</p>
                                        {p.category && <p className="text-xs text-neutral-500">{p.category.name}</p>}
                                        <div className="mt-1.5 flex items-baseline gap-2">
                                            {p.promo_price_xof ? (
                                                <>
                                                    <span className="font-semibold">{formatXof(p.promo_price_xof)}</span>
                                                    <span className="text-xs text-neutral-500 line-through">{formatXof(p.price_xof)}</span>
                                                </>
                                            ) : (
                                                <span className="font-semibold">{formatXof(p.price_xof)}</span>
                                            )}
                                        </div>
                                        {!p.in_stock && <p className="mt-1 text-xs text-red-600">Rupture</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {products.last_page > 1 && (
                        <p className="mt-6 text-xs text-neutral-500">
                            Page {products.current_page} / {products.last_page}
                        </p>
                    )}
                </section>
            </div>
        </>
    );
}

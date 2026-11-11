import { Head, Link } from '@inertiajs/react';

type StorePayload = { id: number; slug: string; name: string; description: string | null; accent_color: string; theme: string; logo_text: string | null };
type Category = { id: number; slug: string; name: string; image_path: string | null };
type Product = {
    id: number; slug: string; name: string;
    price_xof: number; promo_price_xof: number | null; effective_price_xof: number;
    in_stock: boolean; rating: number | null; reviews_count: number;
    image: string | null; category: { name: string; slug: string } | null;
};
type Props = { store: StorePayload; categories: Category[]; featured: Product[] };

const formatXof = (v: number) => `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;

export default function StorefrontHome({ store, categories, featured }: Props) {
    return (
        <>
            <Head title={store.name} />
            <div className="min-h-screen bg-[#F2F4F5] text-[#171717]">
                <div className="bg-[#171717] py-2 text-center text-xs font-medium text-white">
                    Boutique de démonstration · {store.name} · Données fictives
                </div>
                <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
                    <Link href={`/boutique/${store.slug}`} className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] text-sm font-semibold text-white">
                            {store.logo_text ?? store.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="leading-tight">
                            <p className="text-base font-semibold">{store.name}</p>
                            <p className="text-xs text-neutral-500">Boutique · Dakar</p>
                        </div>
                    </Link>
                    <nav className="flex items-center gap-5 text-sm">
                        <Link href={`/boutique/${store.slug}/catalogue`} className="hover:underline">Catalogue</Link>
                        <Link href={`/boutique/${store.slug}/commande`} className="rounded-full bg-[#171717] px-4 py-2 text-white hover:bg-neutral-800">
                            Panier
                        </Link>
                    </nav>
                </header>

                <section className="mx-auto max-w-6xl px-5 py-10">
                    <h1 className="text-3xl font-semibold tracking-tight">{store.name}</h1>
                    {store.description && <p className="mt-3 max-w-2xl text-neutral-600">{store.description}</p>}
                </section>

                {categories.length > 0 && (
                    <section className="mx-auto max-w-6xl px-5 py-6">
                        <h2 className="mb-4 text-lg font-semibold">Catégories</h2>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((c) => (
                                <span key={c.id} className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm">
                                    {c.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                <section className="mx-auto max-w-6xl px-5 py-10">
                    <h2 className="mb-6 text-lg font-semibold">Nouveautés</h2>
                    {featured.length === 0 ? (
                        <p className="text-sm text-neutral-500">Aucun produit publié pour le moment.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {featured.map((p) => (
                                <Link key={p.id} href={`/boutique/${store.slug}/produit/${p.slug}`} className="group block rounded-2xl bg-white p-2 shadow-sm transition hover:-translate-y-1">
                                    <div className="aspect-square overflow-hidden rounded-xl bg-neutral-100">
                                        {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : null}
                                    </div>
                                    <div className="px-2 pt-3 pb-2">
                                        <p className="text-sm font-semibold leading-tight">{p.name}</p>
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
                </section>

                <footer className="mt-10 bg-[#171717] py-10 text-white">
                    <div className="mx-auto max-w-6xl px-5 text-sm text-neutral-400">
                        {store.name} — Propulsé par NOOR SHOP. Paiement à la livraison ou au retrait.
                    </div>
                </footer>
            </div>
        </>
    );
}

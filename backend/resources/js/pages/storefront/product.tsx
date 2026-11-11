import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type Store = { id: number; slug: string; name: string };
type Image = { id: number; url: string | null; alt_text: string | null };
type OptionValue = { option: string; value: string; hex_color: string | null };
type Variant = { id: number; sku: string | null; price_xof: number; stock: number; options: OptionValue[] };
type Props = {
    store: Store;
    product: {
        id: number;
        slug: string;
        name: string;
        description: string | null;
        price_xof: number;
        promo_price_xof: number | null;
        effective_price_xof: number;
        available_stock: number;
        category: { id: number; name: string; slug: string } | null;
        images: Image[];
        variants: Variant[];
    };
};

const formatXof = (v: number) => `${new Intl.NumberFormat('fr-FR').format(v)} F CFA`;

export default function StorefrontProduct({ store, product }: Props) {
    const [activeImage, setActiveImage] = useState<string | null>(product.images[0]?.url ?? null);
    const outOfStock = product.available_stock <= 0;

    return (
        <>
            <Head title={`${product.name} — ${store.name}`} />
            <div className="min-h-screen bg-[#F2F4F5] text-[#171717]">
                <div className="bg-[#171717] py-2 text-center text-xs font-medium text-white">
                    Boutique de démonstration · {store.name} · Données fictives
                </div>
                <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
                    <Link href={`/boutique/${store.slug}`} className="font-semibold">{store.name}</Link>
                    <nav className="flex items-center gap-4 text-sm">
                        <Link href={`/boutique/${store.slug}/catalogue`} className="hover:underline">Catalogue</Link>
                        <Link href={`/boutique/${store.slug}/commande`} className="rounded-full bg-[#171717] px-4 py-2 text-white">Panier</Link>
                    </nav>
                </header>

                <section className="mx-auto grid max-w-6xl gap-10 px-5 py-6 lg:grid-cols-2">
                    <div>
                        <div className="aspect-square overflow-hidden rounded-2xl bg-white">
                            {activeImage && <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />}
                        </div>
                        {product.images.length > 1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto">
                                {product.images.map((img) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => setActiveImage(img.url)}
                                        className={`h-20 w-20 overflow-hidden rounded-xl border ${activeImage === img.url ? 'border-[#171717]' : 'border-neutral-200'}`}
                                    >
                                        {img.url && <img src={img.url} alt="" className="h-full w-full object-cover" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        {product.category && <p className="text-xs uppercase tracking-wider text-neutral-500">{product.category.name}</p>}
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>

                        <div className="mt-4 flex items-baseline gap-3">
                            {product.promo_price_xof ? (
                                <>
                                    <span className="text-2xl font-semibold">{formatXof(product.promo_price_xof)}</span>
                                    <span className="text-neutral-500 line-through">{formatXof(product.price_xof)}</span>
                                </>
                            ) : (
                                <span className="text-2xl font-semibold">{formatXof(product.price_xof)}</span>
                            )}
                        </div>
                        {outOfStock && <p className="mt-2 text-sm font-medium text-red-600">Rupture de stock</p>}
                        {!outOfStock && product.available_stock <= 5 && (
                            <p className="mt-2 text-sm text-amber-600">Plus que {product.available_stock} en stock</p>
                        )}

                        {product.description && <p className="mt-6 text-sm text-neutral-700">{product.description}</p>}

                        {product.variants.length > 0 && (
                            <div className="mt-6">
                                <p className="mb-2 text-sm font-semibold">Variantes disponibles</p>
                                <ul className="space-y-1 text-sm">
                                    {product.variants.map((v) => (
                                        <li key={v.id} className="flex justify-between border-b border-neutral-200 py-2">
                                            <span>
                                                {v.options.map((o) => `${o.option}: ${o.value}`).join(' · ') || v.sku}
                                            </span>
                                            <span className="font-medium">
                                                {formatXof(v.price_xof)} {v.stock <= 0 && <span className="text-xs text-red-600">(indisp.)</span>}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-8">
                            <Link
                                href={`/boutique/${store.slug}/commande`}
                                className={`inline-flex items-center justify-center rounded-full px-6 py-3 font-medium text-white ${outOfStock ? 'cursor-not-allowed bg-neutral-400' : 'bg-[#171717] hover:bg-neutral-800'}`}
                            >
                                {outOfStock ? 'Indisponible' : 'Passer à la commande'}
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type Option = { name: string; values: { value: string; hex_color?: string | null }[] };
type Variant = { sku: string | null; price_xof: number | null; stock: number; is_default: boolean; option_values: string[] };
type Props = {
    currentStore: { id: number; name: string };
    product: { id: number; name: string; slug: string; price_xof: number };
    options: { id: number; name: string; values: { id: number; value: string; hex_color: string | null }[] }[];
    variants: { id: number; sku: string | null; price_xof: number | null; stock: number; is_default: boolean; option_values: string[] }[];
};

export default function VariantsEditor({ currentStore, product, options: existingOptions, variants: existingVariants }: Props) {
    const [options, setOptions] = useState<Option[]>(
        existingOptions.length > 0
            ? existingOptions.map((o) => ({ name: o.name, values: o.values.map((v) => ({ value: v.value, hex_color: v.hex_color })) }))
            : [{ name: 'Taille', values: [{ value: 'M' }] }],
    );
    const [variants, setVariants] = useState<Variant[]>(
        existingVariants.length > 0
            ? existingVariants.map((v) => ({ sku: v.sku, price_xof: v.price_xof, stock: v.stock, is_default: v.is_default, option_values: v.option_values }))
            : [{ sku: null, price_xof: null, stock: 0, is_default: true, option_values: ['M'] }],
    );

    const form = useForm<Record<string, unknown>>({ options: options as unknown as Record<string, unknown>, variants: variants as unknown as Record<string, unknown> });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        router.put(`/merchant/products/${product.id}/variants`, { options, variants }, {
            preserveScroll: true,
        });
    }

    function addOption() {
        setOptions([...options, { name: '', values: [{ value: '' }] }]);
    }
    function removeOption(i: number) {
        const next = options.filter((_, k) => k !== i);
        setOptions(next);
        setVariants(variants.map((v) => ({ ...v, option_values: v.option_values.filter((_, k) => k !== i) })));
    }
    function addValue(i: number) {
        const next = [...options];
        next[i].values.push({ value: '' });
        setOptions(next);
    }
    function removeValue(i: number, j: number) {
        const next = [...options];
        next[i].values = next[i].values.filter((_, k) => k !== j);
        setOptions(next);
    }
    function addVariant() {
        setVariants([...variants, { sku: null, price_xof: null, stock: 0, is_default: false, option_values: options.map((o) => o.values[0]?.value ?? '') }]);
    }
    function removeVariant(i: number) {
        setVariants(variants.filter((_, k) => k !== i));
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Commerçant', href: '/merchant' },
        { title: 'Produits', href: '/merchant/products' },
        { title: product.name, href: `/merchant/products/${product.id}/edit` },
        { title: 'Variantes', href: '#' },
    ];

    const errors = (form as unknown as { errors: Record<string, string> }).errors;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Variantes — ${product.name}`} />
            <form onSubmit={submit} className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Boutique · {currentStore.name}</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Options & variantes — {product.name}</h1>
                    <p className="mt-2 text-sm text-neutral-600">Définissez les options (ex. Taille, Couleur), leurs valeurs, puis les combinaisons disponibles. Chaque variante a son stock et son prix facultatif.</p>
                </div>

                <section className="rounded-xl border border-neutral-200 bg-white p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Options</h2>
                        <button type="button" onClick={addOption} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm">+ Option</button>
                    </div>
                    <div className="space-y-4">
                        {options.map((opt, i) => (
                            <div key={i} className="rounded-md border border-neutral-200 p-3">
                                <div className="flex gap-2">
                                    <input
                                        value={opt.name}
                                        onChange={(e) => { const n = [...options]; n[i].name = e.target.value; setOptions(n); }}
                                        placeholder="Nom (Taille, Couleur…)"
                                        className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                                        required
                                    />
                                    <button type="button" onClick={() => removeOption(i)} className="text-sm text-red-600">×</button>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {opt.values.map((val, j) => (
                                        <span key={j} className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm">
                                            <input
                                                value={val.value}
                                                onChange={(e) => { const n = [...options]; n[i].values[j].value = e.target.value; setOptions(n); }}
                                                placeholder="Valeur"
                                                className="w-20 bg-transparent outline-none"
                                                required
                                            />
                                            <input
                                                value={val.hex_color ?? ''}
                                                onChange={(e) => { const n = [...options]; n[i].values[j].hex_color = e.target.value || null; setOptions(n); }}
                                                placeholder="#000000"
                                                className="w-20 bg-transparent text-xs outline-none"
                                            />
                                            <button type="button" onClick={() => removeValue(i, j)} className="text-red-600">×</button>
                                        </span>
                                    ))}
                                    <button type="button" onClick={() => addValue(i)} className="rounded-full border border-dashed border-neutral-400 px-3 py-1.5 text-xs">+ valeur</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-xl border border-neutral-200 bg-white p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Variantes</h2>
                        <button type="button" onClick={addVariant} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm">+ Variante</button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs uppercase tracking-wider text-neutral-500">
                            <tr>
                                {options.map((o, i) => <th key={i} className="py-2">{o.name || '—'}</th>)}
                                <th className="py-2">SKU</th>
                                <th className="py-2">Prix (F CFA)</th>
                                <th className="py-2">Stock</th>
                                <th className="py-2">Défaut</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {variants.map((v, i) => (
                                <tr key={i}>
                                    {options.map((o, oi) => (
                                        <td key={oi} className="py-2 pr-2">
                                            <select
                                                value={v.option_values[oi] ?? ''}
                                                onChange={(e) => { const n = [...variants]; n[i].option_values[oi] = e.target.value; setVariants(n); }}
                                                className="w-full rounded-md border border-neutral-300 px-2 py-1 text-xs"
                                            >
                                                <option value="">—</option>
                                                {o.values.map((val, vi) => <option key={vi} value={val.value}>{val.value || '—'}</option>)}
                                            </select>
                                        </td>
                                    ))}
                                    <td className="py-2 pr-2"><input value={v.sku ?? ''} onChange={(e) => { const n = [...variants]; n[i].sku = e.target.value || null; setVariants(n); }} className="w-full rounded-md border border-neutral-300 px-2 py-1 text-xs" /></td>
                                    <td className="py-2 pr-2"><input type="number" min={0} value={v.price_xof ?? ''} onChange={(e) => { const n = [...variants]; n[i].price_xof = e.target.value === '' ? null : Number(e.target.value); setVariants(n); }} className="w-24 rounded-md border border-neutral-300 px-2 py-1 text-xs" /></td>
                                    <td className="py-2 pr-2"><input type="number" min={0} value={v.stock} onChange={(e) => { const n = [...variants]; n[i].stock = Number(e.target.value); setVariants(n); }} className="w-20 rounded-md border border-neutral-300 px-2 py-1 text-xs" required /></td>
                                    <td className="py-2 pr-2"><input type="checkbox" checked={v.is_default} onChange={(e) => { const n = variants.map((x, k) => ({ ...x, is_default: k === i ? e.target.checked : false })); setVariants(n); }} /></td>
                                    <td className="py-2"><button type="button" onClick={() => removeVariant(i)} className="text-red-600">×</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {errors && Object.keys(errors).length > 0 && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                        {Object.entries(errors).map(([k, v]) => (<div key={k}>· {v}</div>))}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">Enregistrer</button>
                </div>
            </form>
        </AppLayout>
    );
}

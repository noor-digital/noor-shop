import { Head } from '@inertiajs/react';

type Zone = { id: number; name: string; fee_xof: number; eta: string | null };
type Props = { store: { slug: string; name: string }; deliveryZones: Zone[] };

/**
 * Placeholder checkout page — the POST /boutique/{slug}/commande endpoint is
 * fully implemented. The final React UI reuses the prototype StoreCheckout
 * component; it will be ported in the dedicated UI integration phase.
 */
export default function Checkout({ store, deliveryZones }: Props) {
    return (
        <>
            <Head title={`Commande — ${store.name}`} />
            <div className="min-h-screen bg-[#F2F4F5] px-4 py-10">
                <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold tracking-tight">Checkout — {store.name}</h1>
                    <p className="mt-2 text-sm text-neutral-600">
                        Cette page est servie par Laravel/Inertia. L'UI finale sera portée depuis le prototype
                        (<code>src/pages/storefront/StoreCheckout.jsx</code>) lors de la phase d'intégration UI dédiée.
                    </p>
                    <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                        Zones de livraison disponibles
                    </h2>
                    <ul className="mt-3 divide-y divide-neutral-100 text-sm">
                        {deliveryZones.length === 0 ? (
                            <li className="py-3 text-neutral-500">Aucune zone configurée.</li>
                        ) : (
                            deliveryZones.map((z) => (
                                <li key={z.id} className="flex justify-between py-2">
                                    <span>{z.name} <span className="text-xs text-neutral-500">{z.eta ?? ''}</span></span>
                                    <span className="font-medium">{new Intl.NumberFormat('fr-FR').format(z.fee_xof)} F CFA</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
}

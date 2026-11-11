import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type Store = { id: number; slug: string; name: string; theme: string; status: string; created_at: string };
type Subscription = { id: number; status: string; plan: { slug: string; name: string; price_xof: number } | null; trial_ends_at: string | null; started_at: string | null; ends_at: string | null; grace_ends_at: string | null };
type Props = {
    merchant: {
        id: number; name: string; email: string; phone: string | null;
        email_verified_at: string | null; created_at: string;
        stores: Store[]; subscriptions: Subscription[];
    };
};

export default function MerchantShow({ merchant }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Administration', href: '/platform' },
        { title: 'Commerçants', href: '/platform/merchants' },
        { title: merchant.name, href: '#' },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={merchant.name} />
            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Commerçant</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">{merchant.name}</h1>
                    <p className="text-sm text-neutral-600">{merchant.email} {merchant.phone && `· ${merchant.phone}`}</p>
                    <p className="mt-1 text-xs text-neutral-500">Inscrit le {merchant.created_at?.slice(0, 10)} {merchant.email_verified_at ? '· e-mail vérifié' : '· e-mail non vérifié'}</p>
                </div>

                <section className="rounded-xl border border-neutral-200 bg-white p-5">
                    <h2 className="text-lg font-semibold">Boutiques ({merchant.stores.length})</h2>
                    <ul className="mt-3 divide-y divide-neutral-100 text-sm">
                        {merchant.stores.map((s) => (
                            <li key={s.id} className="flex justify-between py-2">
                                <span className="font-medium">{s.name} <span className="text-xs text-neutral-500">/{s.slug} · {s.theme}</span></span>
                                <span className={s.status === 'active' ? 'text-emerald-600' : 'text-red-600'}>{s.status}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="rounded-xl border border-neutral-200 bg-white p-5">
                    <h2 className="text-lg font-semibold">Abonnements</h2>
                    <ul className="mt-3 space-y-3 text-sm">
                        {merchant.subscriptions.length === 0 && <li className="text-neutral-500">Aucun abonnement.</li>}
                        {merchant.subscriptions.map((s) => (
                            <li key={s.id} className="rounded-md border border-neutral-100 bg-neutral-50 p-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">{s.plan?.name ?? 'Plan inconnu'}</span>
                                    <span className="rounded-full bg-white px-2 py-0.5 text-xs">{s.status}</span>
                                </div>
                                <div className="mt-1 text-xs text-neutral-500">
                                    {s.trial_ends_at && <>Essai jusqu'au {s.trial_ends_at.slice(0, 10)} · </>}
                                    {s.started_at && <>Débuté {s.started_at.slice(0, 10)} · </>}
                                    {s.ends_at && <>Fin {s.ends_at.slice(0, 10)} · </>}
                                    {s.grace_ends_at && <>Grâce jusqu'au {s.grace_ends_at.slice(0, 10)}</>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </AppLayout>
    );
}

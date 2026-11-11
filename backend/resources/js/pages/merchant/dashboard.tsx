import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Merchant', href: '/merchant' },
    { title: 'Dashboard', href: '/merchant' },
];

type Store = {
    id: number;
    slug: string;
    name: string;
    theme: string;
    status: string;
};

type Subscription = {
    status: string;
    plan_id: number;
    trial_ends_at: string | null;
    ends_at: string | null;
} | null;

type Props = {
    user: { name: string; email: string };
    stores: Store[];
    subscription: Subscription;
};

export default function MerchantDashboard({ user, stores, subscription }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Espace commerçant" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Espace commerçant</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        Bonjour, {user.name}
                    </h1>
                </div>

                <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="text-lg font-semibold">Mes boutiques</h2>
                    {stores.length === 0 ? (
                        <p className="mt-3 text-sm text-neutral-500">
                            Vous n&apos;avez pas encore créé de boutique.
                        </p>
                    ) : (
                        <ul className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
                            {stores.map((s) => (
                                <li key={s.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium">{s.name}</p>
                                        <p className="text-xs text-neutral-500">/{s.slug} · {s.theme}</p>
                                    </div>
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                                        {s.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Link
                        href="/merchant/stores"
                        className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                        Gérer mes boutiques →
                    </Link>
                </section>

                <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="text-lg font-semibold">Abonnement</h2>
                    {subscription ? (
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                            Statut : <span className="font-medium">{subscription.status}</span>
                            {subscription.trial_ends_at && (
                                <> · Essai jusqu&apos;au {subscription.trial_ends_at.slice(0, 10)}</>
                            )}
                        </p>
                    ) : (
                        <p className="mt-2 text-sm text-neutral-500">Aucun abonnement actif.</p>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}

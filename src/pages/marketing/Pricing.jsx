import { useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';
import { Card, Badge, SectionHeader } from '../../components/ui/Card.jsx';
import { plans, trialConfig } from '../../data/plans.js';
import { formatXof } from '../../lib/format.js';

const faqs = [
  { q: "Puis-je démarrer gratuitement ?", a: `Oui. L'essai gratuit dure ${trialConfig.durationDays} jours sans carte bancaire et sans engagement.` },
  { q: 'Comment fonctionnent les abonnements ?', a: "L'activation est manuelle pour le MVP. Un conseiller valide votre paiement et active votre offre." },
  { q: "Que se passe-t-il à la fin de l'essai ?", a: `Vous conservez votre accès pendant ${trialConfig.graceDays} jours. Au-delà, la boutique est suspendue jusqu'à activation d'un abonnement.` },
  { q: 'Puis-je changer de modèle graphique ?', a: 'Oui, à tout moment. Vos produits, catégories et commandes sont conservés.' },
  { q: 'Puis-je gérer plusieurs boutiques ?', a: "Oui, selon votre offre. L'offre Pro permet jusqu'à 3 boutiques, Business n'a pas de limite." },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  return (
    <div className="mx-auto max-w-page px-5 py-16">
      <div className="text-center mx-auto max-w-2xl">
        <p className="text-caption uppercase tracking-tight text-muted">Tarifs</p>
        <h1 className="mt-3 text-[40px] md:text-[52px] font-semibold tracking-tightest text-ink">
          Un prix clair, pour chaque étape de votre activité.
        </h1>
        <p className="mt-4 text-body-lg text-muted">
          Démarrez gratuitement. Passez à Pro pour développer. Business pour les commerçants multi-points.
        </p>

        <div className="mt-8 inline-flex items-center gap-1 rounded-pill border border-hairline bg-white p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`rounded-pill px-5 py-2 text-body-sm font-medium ${!annual ? 'bg-ink text-white' : 'text-muted'}`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`rounded-pill px-5 py-2 text-body-sm font-medium ${annual ? 'bg-ink text-white' : 'text-muted'}`}
          >
            Annuel · −2 mois
          </button>
        </div>
      </div>

      <section className="mt-16 grid gap-5 md:grid-cols-3">
        {plans.map((p) => {
          const price = annual ? Math.round(p.price * 10) : p.price;
          return (
            <Card key={p.id} className={p.highlight ? 'border-ink shadow-card' : ''}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-caption uppercase tracking-tight text-muted">Offre</p>
                  <h3 className="mt-1 text-[22px] font-semibold tracking-tightest">{p.name}</h3>
                </div>
                {p.highlight && <Badge tone="info">Populaire</Badge>}
              </div>
              <p className="mt-4 text-[32px] font-semibold tracking-tightest">
                {p.price === 0 ? 'Gratuit' : formatXof(price)}
                <span className="ml-1 text-body text-muted">/{annual ? 'an' : 'mois'}</span>
              </p>
              <p className="mt-2 text-body text-muted">{p.tagline}</p>
              <ul className="mt-6 space-y-2 text-body-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-ink">
                    <span className="mt-1 h-1.5 w-1.5 rounded-pill bg-violet shrink-0" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                to="/inscription"
                variant={p.highlight ? 'primary' : 'outline'}
                className="mt-6 w-full"
              >
                {p.cta}
              </Button>
            </Card>
          );
        })}
      </section>

      {/* Comparison table */}
      <SectionHeader title="Comparer les offres" subtitle="Les limites et fonctionnalités en un coup d'œil." className="mt-20" />
      <div className="overflow-hidden rounded-card border border-hairline bg-white overflow-x-auto">
        <table className="w-full text-left text-body-sm">
          <thead className="bg-canvas text-caption uppercase tracking-tight text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Fonctionnalité</th>
              {plans.map((p) => (
                <th key={p.id} className="px-5 py-3 font-medium">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Boutiques', (p) => String(p.limits.stores)],
              ['Produits', (p) => String(p.limits.products)],
              ['Utilisateurs', (p) => String(p.limits.users)],
              ['Modèles premium', (p) => (p.id === 'plan-decouverte' ? 'Standard' : '3 modèles')],
              ['Statistiques', (p) => (p.id === 'plan-decouverte' ? 'Basiques' : 'Détaillées')],
              ['Support', (p) => (p.id === 'plan-business' ? 'Dédié 7j/7' : p.id === 'plan-pro' ? 'Prioritaire 24h' : 'E-mail 48h')],
            ].map(([label, fn]) => (
              <tr key={label} className="border-t border-hairline/60">
                <td className="px-5 py-3 text-ink font-medium">{label}</td>
                {plans.map((p) => (
                  <td key={p.id} className="px-5 py-3 text-muted">{fn(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader title="Questions fréquentes" className="mt-20" />
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-card border border-hairline bg-white px-5 py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-medium">
              <span>{f.q}</span>
              <span className="text-muted group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-body text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

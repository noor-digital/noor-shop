import { Card, SectionHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function About() {
  return (
    <div className="mx-auto max-w-page px-5 py-16">
      <div className="text-center mx-auto max-w-2xl">
        <p className="text-caption uppercase tracking-tight text-muted">À propos</p>
        <h1 className="mt-3 text-[40px] md:text-[52px] font-semibold tracking-tightest text-ink">
          Construire l'infrastructure du commerce africain.
        </h1>
        <p className="mt-4 text-body-lg text-muted">
          NOOR SHOP est né à Dakar avec une conviction : chaque commerçant mérite un outil
          numérique à la hauteur de son travail.
        </p>
      </div>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { label: 'Fondation', value: '2026', text: 'Projet initié à Dakar.' },
          { label: 'Marché initial', value: 'Sénégal', text: 'Extension Afrique francophone.' },
          { label: 'Devise', value: 'XOF', text: 'Franc CFA, sans calcul monétaire flottant.' },
        ].map((b) => (
          <Card key={b.label}>
            <p className="text-caption uppercase tracking-tight text-muted">{b.label}</p>
            <p className="mt-2 text-[36px] font-semibold tracking-tightest">{b.value}</p>
            <p className="mt-2 text-body text-muted">{b.text}</p>
          </Card>
        ))}
      </section>

      <SectionHeader title="Nos principes" className="mt-20" />
      <div className="grid gap-5 md:grid-cols-2">
        {[
          { title: 'Mobile-first', text: 'Nos commerçants gèrent souvent leur activité depuis un téléphone. Tout est conçu dans cet ordre.' },
          { title: 'Un vrai produit SaaS', text: "Pas un template, mais une plateforme — pensée pour durer, évoluer, et s'intégrer dans le quotidien." },
          { title: 'Local avant tout', text: "F CFA, français, numéro sénégalais. Les habitudes commerciales d'ici, pas d'ailleurs." },
          { title: 'Simple, mais sérieux', text: "Interface épurée, règles commerciales rigoureuses. L'un ne doit pas effacer l'autre." },
        ].map((p) => (
          <Card key={p.title}>
            <h3 className="text-[18px] font-semibold tracking-tightest">{p.title}</h3>
            <p className="mt-2 text-body text-muted">{p.text}</p>
          </Card>
        ))}
      </div>

      <div className="mt-20 rounded-card bg-ink text-white p-10 text-center">
        <h2 className="text-[28px] md:text-[36px] font-semibold tracking-tightest">
          Rejoignez le mouvement.
        </h2>
        <p className="mt-3 text-body-lg text-white/70">
          Partagez vos besoins, suggestions ou retours.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/inscription" size="lg" className="bg-white text-ink hover:bg-white/90">
            Créer ma boutique
          </Button>
          <Button to="/contact" size="lg" variant="ghost" className="text-white hover:bg-white/10">
            Nous écrire
          </Button>
        </div>
      </div>
    </div>
  );
}

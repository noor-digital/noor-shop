import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import { Card, SectionHeader, Badge } from '../../components/ui/Card.jsx';
import { plans } from '../../data/plans.js';
import { formatXof } from '../../lib/format.js';

const features = [
  { icon: '✧', title: 'Trois modèles premium', desc: 'Choisissez un modèle moderne, modifiez vos couleurs et vos sections en quelques minutes.' },
  { icon: '◫', title: 'Catalogue, variantes, stocks', desc: 'Gérez produits, tailles, couleurs et stocks depuis une seule interface, pensée pour le mobile.' },
  { icon: '✎', title: 'Commandes centralisées', desc: 'Toutes vos commandes dans un espace unique, avec statuts, filtres et historique client.' },
  { icon: '⤷', title: 'Livraison & retrait', desc: 'Configurez vos zones de livraison, tarifs fixes, options de retrait auprès de votre boutique.' },
];

const trustedLogos = ['Maam Couture', 'Teranga Beauty', 'Baobab Home', 'Sahel & Style', 'Ndank Market', 'Jëkk Market'];

export default function Landing() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="violet-aura absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-page px-5 pt-16 pb-14 text-center">
          <Badge tone="info" className="mb-6 bg-white shadow-soft border border-hairline">
            <span className="h-1.5 w-1.5 rounded-pill bg-violet" />
            Nouveau · essai gratuit 14 jours
          </Badge>
          <h1 className="mx-auto max-w-3xl text-[36px] sm:text-[48px] md:text-[64px] font-semibold leading-[1.02] tracking-tightest text-ink">
            Lancez votre boutique en ligne,{' '}
            <span className="text-violet">simplement.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-muted">
            NOOR SHOP est la plateforme SaaS pensée pour les commerçants du Sénégal et d'Afrique
            francophone. Un catalogue professionnel, des commandes centralisées, en F CFA.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/inscription" size="lg">
              Créer ma boutique gratuitement
            </Button>
            <Button to="/boutique/maam-couture" variant="outline" size="lg">
              Voir une boutique de démo
            </Button>
          </div>
          <p className="mt-4 text-caption text-muted">Sans carte bancaire · Sans engagement</p>
        </div>

        {/* Floating product cards */}
        <div className="relative mx-auto max-w-page px-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {[
              { img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=70', name: 'Maam Couture', rating: '★★★★★ · 52' },
              { img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=70', name: 'Teranga Beauty', rating: '★★★★★ · 18' },
              { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=70', name: 'Baobab Home', rating: '★★★★☆ · 34' },
              { img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=70', name: 'Sahel Shoes', rating: '★★★★★ · 46' },
            ].map((c, i) => (
              <div
                key={c.name}
                className="rounded-card bg-white p-0 shadow-card translate-y-0"
                style={{ transform: `translateY(${i % 2 === 0 ? '-12px' : '12px'})` }}
              >
                <div className="p-2">
                  <div
                    className="aspect-square w-full rounded-inner bg-cover bg-center"
                    style={{ backgroundImage: `url(${c.img})` }}
                  />
                </div>
                <div className="px-3 pb-3">
                  <p className="text-body font-semibold tracking-tighter">{c.name}</p>
                  <p className="mt-1 text-caption text-muted">{c.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted strip */}
      <section className="mt-16 [overflow-x:clip] overflow-hidden">
        <p className="mb-5 text-center text-caption uppercase tracking-tight text-muted">
          Ils se lancent déjà avec NOOR SHOP
        </p>
        <div className="relative">
          <div className="flex gap-8 whitespace-nowrap animate-marquee opacity-70">
            {[...trustedLogos, ...trustedLogos].map((logo, i) => (
              <span key={i} className="text-[20px] font-semibold tracking-tightest text-ink/50">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto mt-24 max-w-page px-5">
        <SectionHeader
          title="Tout pour vendre, rien de superflu."
          subtitle="Chaque fonction a été pensée pour un commerçant au Sénégal, qui travaille depuis un téléphone."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="hover:border-ink transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-pill bg-violet-soft text-violet">
                {f.icon}
              </div>
              <h3 className="mt-5 text-[18px] font-semibold tracking-tightest">{f.title}</h3>
              <p className="mt-2 text-body text-muted">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-24 max-w-page px-5">
        <SectionHeader
          title="3 étapes pour vendre en ligne"
          subtitle="Un parcours guidé, de l'inscription à votre première commande."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { step: '01', title: 'Créez votre compte', text: 'Inscrivez-vous en moins de 2 minutes. Vérifiez votre e-mail et vous voilà parti.' },
            { step: '02', title: 'Configurez votre boutique', text: 'Logo, couleurs, modèle. Ajoutez vos premières catégories et produits.' },
            { step: '03', title: 'Publiez et vendez', text: 'Partagez votre lien. Recevez vos commandes, gérez vos stocks et vos clients.' },
          ].map((s) => (
            <Card key={s.step}>
              <span className="text-caption font-semibold text-violet">{s.step}</span>
              <h3 className="mt-3 text-[20px] font-semibold tracking-tightest">{s.title}</h3>
              <p className="mt-2 text-body text-muted">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Templates showcase */}
      <section className="mx-auto mt-24 max-w-page px-5">
        <SectionHeader
          title="Trois modèles de boutique"
          subtitle="Choisissez celui qui correspond à votre univers. Changez quand vous voulez, sans perdre vos données."
          action={<Link to="/boutique/maam-couture" className="text-body-sm text-violet hover:underline">Voir une démo →</Link>}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: 'Marble', desc: 'Lumineux, aéré, orienté photo produit. Idéal mode et beauté.', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=70', slug: 'maam-couture' },
            { name: 'Editorial', desc: 'Composition magazine, catégories en vedette, mise en avant éditoriale.', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=70', slug: 'teranga-beauty' },
            { name: 'Gallery', desc: 'Grilles généreuses, idéal artisanat, mobilier, décoration.', img: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=70', slug: 'baobab-home' },
          ].map((t) => (
            <Link key={t.name} to={`/boutique/${t.slug}`} className="group">
              <Card padded={false} className="overflow-hidden hover:border-ink transition">
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url(${t.img})` }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-semibold tracking-tightest">{t.name}</h3>
                    <Badge tone="info">Modèle</Badge>
                  </div>
                  <p className="mt-2 text-body text-muted">{t.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="mx-auto mt-24 max-w-page px-5">
        <SectionHeader
          title="Des offres claires, sans surprise."
          subtitle="Démarrez gratuitement, montez en puissance quand votre activité grandit."
          action={<Link to="/tarifs" className="text-body-sm text-violet hover:underline">Comparer →</Link>}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.id}
              className={p.highlight ? 'border-ink shadow-card' : ''}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-caption uppercase text-muted tracking-tight">Offre</p>
                  <h3 className="mt-1 text-[22px] font-semibold tracking-tightest">{p.name}</h3>
                </div>
                {p.highlight && <Badge tone="info">Populaire</Badge>}
              </div>
              <p className="mt-4 text-[28px] font-semibold tracking-tightest">
                {p.price === 0 ? 'Gratuit' : formatXof(p.price)}
                <span className="ml-1 text-body text-muted">/{p.period}</span>
              </p>
              <p className="mt-2 text-body text-muted">{p.tagline}</p>
              <ul className="mt-5 space-y-2 text-body-sm text-muted">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f}>· {f}</li>
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
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-page px-5">
        <div className="rounded-card bg-ink text-white px-6 py-14 md:px-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-[32px] md:text-[44px] font-semibold tracking-tightest">
                Prêt à vendre ?
              </h2>
              <p className="mt-3 text-body-lg text-white/70 max-w-md">
                Essayez NOOR SHOP gratuitement pendant 14 jours. Aucune carte bancaire requise.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Button to="/inscription" size="lg" className="bg-white text-ink hover:bg-white/90">
                Démarrer gratuitement
              </Button>
              <Button to="/contact" size="lg" variant="ghost" className="text-white hover:bg-white/10">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

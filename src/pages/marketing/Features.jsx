import { Card, SectionHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';

const blocks = [
  {
    title: 'Catalogue professionnel',
    text: 'Produits, catégories, variantes (tailles, couleurs), images, prix promotionnels. Statuts brouillon, publié, archivé.',
    points: ['Variantes multi-options', "Prix promotionnels", 'Statuts éditoriaux', 'Images multiples'],
  },
  {
    title: 'Stocks maîtrisés',
    text: 'Stocks suivis par variante, mouvements horodatés, alertes de stock faible, réservations à la commande.',
    points: ['Stock par variante', 'Historique des mouvements', 'Alertes stock faible', 'Réservation atomique'],
  },
  {
    title: 'Commandes centralisées',
    text: 'Toutes vos commandes dans une interface unique, avec statuts, filtres avancés et historique client.',
    points: ['6 statuts commerciaux', 'Historique horodaté', 'Filtres avancés', 'Détail imprimable'],
  },
  {
    title: 'Clients organisés',
    text: 'Fiche client par boutique, montant cumulé, nombre de commandes, dernière commande.',
    points: ['Fiches par boutique', 'Historique achats', 'Coordonnées sécurisées', 'Export possible'],
  },
  {
    title: 'Livraison & retrait',
    text: 'Zones de livraison avec tarifs fixes, options de retrait, instructions personnalisées.',
    points: ['Zones multiples', 'Tarifs fixes XOF', 'Option retrait', 'Frais recalculés serveur'],
  },
  {
    title: 'Trois modèles premium',
    text: 'Marble, Editorial, Gallery — adaptés aux différents univers commerciaux.',
    points: ['Marble — lumineux', 'Editorial — magazine', 'Gallery — grilles généreuses', 'Changement sans perte de données'],
  },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-page px-5 py-16">
      <div className="text-center mx-auto max-w-2xl">
        <p className="text-caption uppercase tracking-tight text-muted">Fonctionnalités</p>
        <h1 className="mt-3 text-[40px] md:text-[52px] font-semibold tracking-tightest text-ink">
          Tout ce qu'il faut pour vendre en ligne.
        </h1>
        <p className="mt-4 text-body-lg text-muted">
          NOOR SHOP couvre l'intégralité du parcours commerçant : création de catalogue,
          commandes, stocks, clients, livraison, personnalisation et analyse.
        </p>
      </div>

      <section className="mt-16 grid gap-5 md:grid-cols-2">
        {blocks.map((b) => (
          <Card key={b.title}>
            <h3 className="text-[20px] font-semibold tracking-tightest">{b.title}</h3>
            <p className="mt-2 text-body text-muted">{b.text}</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-body-sm">
              {b.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-ink">
                  <span className="h-1.5 w-1.5 rounded-pill bg-violet" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>

      <SectionHeader title="Sécurité et évolutivité" subtitle="Les fondamentaux techniques pour un SaaS sérieux." className="mt-20" />
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { title: 'Isolation des données', text: 'Chaque boutique est strictement isolée. Aucune donnée partagée entre commerçants.' },
          { title: 'Sécurité serveur', text: 'Hachage mots de passe, protection CSRF, validation serveur systématique, limitation des tentatives.' },
          { title: 'Mobile-first', text: 'Interface conçue pour le téléphone, avec contrôles tactiles et navigation adaptée.' },
        ].map((f) => (
          <Card key={f.title}>
            <h3 className="text-[18px] font-semibold tracking-tightest">{f.title}</h3>
            <p className="mt-2 text-body text-muted">{f.text}</p>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button to="/inscription" size="lg">
          Essayer NOOR SHOP gratuitement
        </Button>
      </div>
    </div>
  );
}

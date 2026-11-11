import { Link, useOutletContext } from 'react-router-dom';

export default function StoreCategories() {
  const { store, categories } = useOutletContext();
  return (
    <section className="mx-auto max-w-page px-5 py-12">
      <p className="text-caption uppercase tracking-tight text-muted">Explorer</p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tightest">Toutes les catégories</h1>
      <p className="mt-1 text-body text-muted">Parcourez toutes les catégories de {store.name}.</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/boutique/${store.slug}/categorie/${c.slug}`}
            className="group relative overflow-hidden rounded-card bg-white shadow-card"
          >
            <div
              className="aspect-[4/3] bg-cover bg-center transition duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${c.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent p-6 flex items-end">
              <div className="text-white">
                <p className="text-caption uppercase tracking-tight text-white/70">{c.count} produits</p>
                <h3 className="mt-1 text-[22px] font-semibold tracking-tightest">{c.icon} {c.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

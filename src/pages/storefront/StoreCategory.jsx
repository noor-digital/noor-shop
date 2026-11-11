import { useOutletContext, useParams, Link } from 'react-router-dom';
import { byStore } from '../../data/catalog.js';
import { ProductCard } from '../../components/commerce/ProductCard.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';

export default function StoreCategory() {
  const { store, categories } = useOutletContext();
  const { categorySlug } = useParams();
  const category = categories.find((c) => c.slug === categorySlug);
  const products = byStore(store.slug).filter((p) => p.categoryId === category?.id);

  if (!category) {
    return (
      <section className="mx-auto max-w-page px-5 py-12">
        <EmptyState
          title="Catégorie introuvable"
          description="Cette catégorie n'existe pas ou a été supprimée."
          action={<Link to={`/boutique/${store.slug}/categories`} className="text-violet underline">Retour</Link>}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-page px-5 py-12">
      <nav className="text-caption text-muted">
        <Link to={`/boutique/${store.slug}`} className="hover:text-ink">Accueil</Link>
        <span className="mx-2">/</span>
        <Link to={`/boutique/${store.slug}/categories`} className="hover:text-ink">Catégories</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{category.name}</span>
      </nav>
      <h1 className="mt-4 text-[32px] font-semibold tracking-tightest">{category.icon} {category.name}</h1>
      <p className="mt-1 text-body text-muted">{products.length} produits dans cette catégorie</p>

      <div className="mt-10">
        {products.length === 0 ? (
          <EmptyState title="Aucun produit" description="Cette catégorie ne contient pas encore de produit publié." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} storeSlug={store.slug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

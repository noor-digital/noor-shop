import { useOutletContext, useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { findProduct, byStore } from '../../data/catalog.js';
import { ProductCard } from '../../components/commerce/ProductCard.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Card.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { formatXof } from '../../lib/format.js';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import Image from '../../components/ui/Image.jsx';

export default function StoreProduct() {
  const { store } = useOutletContext();
  const { productSlug } = useParams();
  const product = findProduct(store.slug, productSlug);
  const { addToCart } = useStore();
  const [size, setSize] = useState(product?.sizes?.[0] || '');
  const [color, setColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.images?.[0]);

  if (!product) {
    return (
      <section className="mx-auto max-w-page px-5 py-20">
        <EmptyState
          title="Produit introuvable"
          description="Ce produit a été retiré ou n'existe pas."
          action={<Link to={`/boutique/${store.slug}/catalogue`} className="text-violet underline">Retour au catalogue</Link>}
        />
      </section>
    );
  }

  const outOfStock = product.stock === 0;
  const effectivePrice = product.promoPrice || product.price;
  const related = byStore(store.slug).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <section className="mx-auto max-w-page px-5 py-10">
      <nav className="text-caption text-muted">
        <Link to={`/boutique/${store.slug}`} className="hover:text-ink">Accueil</Link>
        <span className="mx-2">/</span>
        <Link to={`/boutique/${store.slug}/catalogue`} className="hover:text-ink">Catalogue</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="rounded-card bg-white shadow-card p-2">
            <div className="aspect-square overflow-hidden rounded-inner bg-canvas">
              <Image src={mainImage} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {product.images.map((img) => (
                <button
                  key={img}
                  onClick={() => setMainImage(img)}
                  className={`shrink-0 h-20 w-20 overflow-hidden rounded-inner border ${mainImage === img ? 'border-ink' : 'border-hairline'}`}
                >
                  <Image src={img} className="h-full w-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            {product.promoPrice && <Badge tone="dark">Promo</Badge>}
            {outOfStock && <Badge tone="danger">Rupture</Badge>}
            {!outOfStock && product.stock <= 5 && <Badge tone="warning">Stock faible</Badge>}
          </div>
          <h1 className="mt-3 text-[32px] font-semibold tracking-tightest">{product.name}</h1>
          <p className="mt-2 text-body-sm text-muted">★ {product.rating} · {product.reviews} avis</p>

          <div className="mt-6 flex items-baseline gap-3">
            {product.promoPrice ? (
              <>
                <span className="text-[28px] font-semibold tracking-tightest">{formatXof(product.promoPrice)}</span>
                <span className="text-body text-muted line-through">{formatXof(product.price)}</span>
              </>
            ) : (
              <span className="text-[28px] font-semibold tracking-tightest">{formatXof(product.price)}</span>
            )}
          </div>

          <p className="mt-6 text-body text-muted leading-relaxed">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-body-sm font-medium">Taille</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-pill border px-4 py-2 text-body-sm font-medium transition ${
                      size === s ? 'border-ink bg-ink text-white' : 'border-hairline bg-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-body-sm font-medium">Couleur</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-9 w-9 rounded-pill border transition ${
                      color === c ? 'ring-2 ring-ink ring-offset-2' : 'border-hairline'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Couleur ${c}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-pill border border-hairline bg-white">
              <button
                className="h-11 w-11 text-lg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="w-8 text-center text-body font-medium">{quantity}</span>
              <button className="h-11 w-11 text-lg" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
            <Button
              disabled={outOfStock}
              onClick={() =>
                addToCart(store.slug, {
                  productId: product.id,
                  productSlug: product.slug,
                  name: product.name,
                  image: product.images[0],
                  price: effectivePrice,
                  variantKey: `${size || '-'}|${color || '-'}`,
                  variantLabel: [size, color].filter(Boolean).join(' · ') || 'Standard',
                  quantity,
                })
              }
              className="flex-1"
              size="lg"
            >
              {outOfStock ? 'Indisponible' : 'Ajouter au panier'}
            </Button>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 text-caption text-muted">
            <li className="rounded-pill bg-canvas px-4 py-2 border border-hairline">✓ Livraison Dakar 24–48h</li>
            <li className="rounded-pill bg-canvas px-4 py-2 border border-hairline">✓ Retrait gratuit</li>
            <li className="rounded-pill bg-canvas px-4 py-2 border border-hairline">✓ Paiement livraison</li>
            <li className="rounded-pill bg-canvas px-4 py-2 border border-hairline">✓ Pièce authentique</li>
          </ul>
        </div>
      </div>

      {/* Related */}
      <div className="mt-16">
        <h2 className="mb-6 text-[22px] font-semibold tracking-tightest">Vous aimerez aussi</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} storeSlug={store.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { formatXof } from '../../lib/format.js';
import { Badge } from '../ui/Card.jsx';
import Image from '../ui/Image.jsx';

export function ProductCard({ product, storeSlug }) {
  const outOfStock = product.stock === 0;
  const hasPromo = product.promoPrice && product.promoPrice < product.price;
  return (
    <Link
      to={`/boutique/${storeSlug}/produit/${product.slug}`}
      className="group block"
    >
      <div className="rounded-card bg-white shadow-card p-2 transition group-hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden rounded-inner bg-canvas">
          <Image
            src={product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
              <span className="rounded-pill bg-white px-3 py-1 text-caption font-medium">Rupture</span>
            </div>
          )}
          {hasPromo && !outOfStock && (
            <Badge tone="dark" className="absolute left-3 top-3">Promo</Badge>
          )}
        </div>
        <div className="px-2 pt-3 pb-2">
          <p className="text-[14px] font-semibold tracking-tightish text-ink leading-tight">
            {product.name}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {hasPromo ? (
              <>
                <span className="text-body text-ink font-medium">{formatXof(product.promoPrice)}</span>
                <span className="text-caption text-muted line-through">{formatXof(product.price)}</span>
              </>
            ) : (
              <span className="text-body text-ink font-medium">{formatXof(product.price)}</span>
            )}
          </div>
          <p className="mt-1 text-caption text-muted">★ {product.rating} · {product.reviews} avis</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

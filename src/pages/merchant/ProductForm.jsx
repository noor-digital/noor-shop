import { useOutletContext, useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { byStore, categoriesForStore } from '../../data/catalog.js';
import { Card } from '../../components/ui/Card.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ConfirmModal } from '../../components/ui/Modal.jsx';
import { useStore } from '../../context/StoreContext.jsx';

export default function ProductForm({ mode = 'create' }) {
  const { activeStore } = useOutletContext();
  const { productId } = useParams();
  const navigate = useNavigate();
  const { notify } = useStore();
  const product = mode === 'edit' ? byStore(activeStore.slug).find((p) => p.id === productId) : null;
  const cats = categoriesForStore(activeStore.slug);
  const [variants, setVariants] = useState(() => {
    if (!product) return [{ size: '', color: '', stock: 0, price: '' }];
    return product.sizes.flatMap((s) =>
      (product.colors.length ? product.colors : ['-']).map((c) => ({
        size: s,
        color: c === '-' ? '' : c,
        stock: Math.floor(product.stock / (product.sizes.length || 1)),
        price: '',
      })),
    );
  });
  const [confirmArchive, setConfirmArchive] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">
            {mode === 'create' ? 'Nouveau produit' : 'Modification'}
          </p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">
            {product?.name || 'Créer un produit'}
          </h1>
        </div>
        <div className="flex gap-2">
          {mode === 'edit' && (
            <Button variant="danger" onClick={() => setConfirmArchive(true)}>
              Archiver
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/merchant/produits')}>Annuler</Button>
          <Button onClick={() => { notify('Produit enregistré', 'success'); navigate('/merchant/produits'); }}>
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <Card>
            <h3 className="text-[16px] font-semibold tracking-tightest">Informations</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input label="Nom du produit" defaultValue={product?.name} placeholder="Boubou wax Linguère" />
              <Input label="Slug URL" defaultValue={product?.slug} placeholder="boubou-wax-linguere" />
              <Input as="textarea" label="Description" className="md:col-span-2" defaultValue={product?.description} />
              <Select label="Catégorie" defaultValue={product?.categoryId}>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
              <Select label="Statut" defaultValue={product?.status}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </Select>
            </div>
          </Card>

          <Card>
            <h3 className="text-[16px] font-semibold tracking-tightest">Prix</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input label="Prix (F CFA)" type="number" defaultValue={product?.price} />
              <Input label="Prix promotionnel (facultatif)" type="number" defaultValue={product?.promoPrice} />
            </div>
          </Card>

          <Card>
            <h3 className="text-[16px] font-semibold tracking-tightest">Variantes</h3>
            <p className="mt-1 text-caption text-muted">Tailles, couleurs, stocks par variante.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead className="text-caption uppercase tracking-tight text-muted">
                  <tr>
                    <th className="pb-2 font-medium">Taille</th>
                    <th className="pb-2 font-medium">Couleur</th>
                    <th className="pb-2 font-medium">Stock</th>
                    <th className="pb-2 font-medium">Prix spécifique</th>
                    <th className="pb-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={i} className="border-t border-hairline/60">
                      <td className="py-2 pr-2">
                        <input
                          value={v.size}
                          onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, size: e.target.value } : x))}
                          placeholder="S / M / L"
                          className="h-9 w-24 rounded-pill border border-hairline bg-white px-3 text-body-sm"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input value={v.color} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, color: e.target.value } : x))} placeholder="Noir, blanc…" className="h-9 w-32 rounded-pill border border-hairline bg-white px-3 text-body-sm" />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" value={v.stock} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, stock: e.target.value } : x))} className="h-9 w-20 rounded-pill border border-hairline bg-white px-3 text-body-sm" />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" value={v.price} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} placeholder="Hérite du produit" className="h-9 w-32 rounded-pill border border-hairline bg-white px-3 text-body-sm" />
                      </td>
                      <td className="py-2">
                        <button onClick={() => setVariants((vs) => vs.filter((_, j) => j !== i))} className="h-8 w-8 rounded-pill text-muted hover:bg-canvas">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setVariants((vs) => [...vs, { size: '', color: '', stock: 0, price: '' }])}
            >
              + Ajouter une variante
            </Button>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <h3 className="text-[16px] font-semibold tracking-tightest">Images</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(product?.images || []).map((img) => (
                <div key={img} className="aspect-square overflow-hidden rounded-inner bg-canvas">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
              <button className="aspect-square flex items-center justify-center rounded-inner bg-canvas border border-dashed border-hairline text-muted hover:border-ink">
                +
              </button>
            </div>
            <p className="mt-3 text-caption text-muted">
              Formats acceptés : JPG, PNG, WEBP. Taille max 5 Mo par image.
            </p>
          </Card>

          <Card>
            <h3 className="text-[16px] font-semibold tracking-tightest">Aperçu rapide</h3>
            <div className="mt-4 rounded-card bg-white shadow-card p-2">
              <div className="aspect-square overflow-hidden rounded-inner bg-canvas">
                {product?.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="p-3">
                <p className="font-semibold text-body">{product?.name || 'Nom du produit'}</p>
                <p className="text-body-sm text-muted">{product?.price ? `${product.price} F CFA` : 'Prix'}</p>
              </div>
            </div>
            <Link to={product ? `/boutique/${activeStore.slug}/produit/${product.slug}` : '#'} className="mt-3 inline-block text-body-sm text-violet hover:underline">
              Voir dans la boutique →
            </Link>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        onConfirm={() => { setConfirmArchive(false); notify('Produit archivé', 'success'); navigate('/merchant/produits'); }}
        tone="danger"
        title="Archiver ce produit ?"
        description="Le produit ne sera plus visible dans la boutique publique. Ses informations historiques (commandes passées) restent disponibles."
        confirmLabel="Archiver"
      />
    </div>
  );
}

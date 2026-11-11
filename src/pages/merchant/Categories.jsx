import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { categoriesForStore } from '../../data/catalog.js';
import { Card, Badge } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { useStore } from '../../context/StoreContext.jsx';

export default function Categories() {
  const { activeStore } = useOutletContext();
  const list = categoriesForStore(activeStore.slug);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const { notify } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">Organisation</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Catégories</h1>
          <p className="mt-1 text-body text-muted">{list.length} catégorie(s) pour {activeStore.name}.</p>
        </div>
        <Button onClick={() => setCreating(true)}>+ Nouvelle catégorie</Button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Aucune catégorie"
          description="Créez une première catégorie pour organiser vos produits."
          action={<Button onClick={() => setCreating(true)}>+ Créer une catégorie</Button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Card key={c.id} padded={false} className="overflow-hidden">
              <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${c.image})` }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{c.icon} {c.name}</p>
                    <p className="text-caption text-muted">/{c.slug}</p>
                  </div>
                  <Badge tone="info">{c.count} produits</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditing(c)}>
                    Modifier
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    Désactiver
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editing || creating}
        onClose={() => { setEditing(null); setCreating(false); }}
        title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        actions={
          <>
            <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Annuler</Button>
            <Button onClick={() => { notify('Catégorie enregistrée', 'success'); setEditing(null); setCreating(false); }}>
              Enregistrer
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Nom de la catégorie" defaultValue={editing?.name} placeholder="Vêtements" />
          <Input label="Slug" defaultValue={editing?.slug} placeholder="vetements" />
          <Input as="textarea" label="Description (facultatif)" placeholder="À propos de la catégorie" />
          <label className="flex items-center gap-2 text-body-sm">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-hairline" />
            Catégorie active
          </label>
        </div>
      </Modal>
    </div>
  );
}

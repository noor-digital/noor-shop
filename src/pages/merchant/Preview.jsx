import { Link, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

export default function Preview() {
  const { activeStore } = useOutletContext();
  const [device, setDevice] = useState('desktop');

  const widths = { mobile: 'w-[380px]', tablet: 'w-[768px]', desktop: 'w-full' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">Aperçu</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tightest">Prévisualisation</h1>
          <p className="mt-1 text-body text-muted">Voyez votre boutique telle que vos clients la verront.</p>
        </div>
        <div className="flex gap-2">
          <Button to={`/boutique/${activeStore.slug}`} variant="outline">Ouvrir dans un onglet</Button>
          <Button to="/merchant/personnalisation">Modifier</Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {Object.keys(widths).map((d) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={`rounded-pill px-4 py-2 text-body-sm font-medium transition ${
              device === d ? 'bg-ink text-white' : 'bg-white border border-hairline text-muted'
            }`}
          >
            {d === 'mobile' ? '📱 Mobile' : d === 'tablet' ? '📐 Tablette' : '🖥️ Desktop'}
          </button>
        ))}
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="flex items-center justify-center bg-canvas p-4 sm:p-8">
          <div className={`${widths[device]} max-w-full transition-all`}>
            <div className="rounded-card overflow-hidden border border-hairline bg-white">
              <iframe
                src={`/boutique/${activeStore.slug}`}
                className="h-[720px] w-full"
                title="Aperçu boutique"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

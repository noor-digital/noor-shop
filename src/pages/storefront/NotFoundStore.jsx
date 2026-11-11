import { Link } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function NotFoundStore({ slug, suspended = false }) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <header className="mx-auto w-full max-w-page px-5 py-6">
        <Link to="/"><Logo /></Link>
      </header>
      <main className="flex-1 flex items-center">
        <div className="mx-auto max-w-lg px-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-pill bg-white shadow-soft text-3xl text-muted">
            {suspended ? '⏸' : '?'}
          </div>
          <h1 className="mt-6 text-[32px] font-semibold tracking-tightest">
            {suspended ? 'Boutique temporairement suspendue' : 'Boutique introuvable'}
          </h1>
          <p className="mt-3 text-body text-muted">
            {suspended
              ? `La boutique /${slug} n'est actuellement pas disponible. Son propriétaire a été notifié.`
              : `Aucune boutique n'est associée à l'adresse /${slug}. Vérifiez l'orthographe ou contactez le commerçant.`}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button to="/">Découvrir NOOR SHOP</Button>
            <Button to="/boutique/maam-couture" variant="outline">
              Voir une boutique de démo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

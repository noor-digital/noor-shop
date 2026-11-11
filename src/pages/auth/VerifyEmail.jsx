import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';

export default function VerifyEmail() {
  return (
    <div className="mx-auto w-full max-w-md text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-violet-soft text-violet text-2xl">
        ✉
      </div>
      <h1 className="mt-6 text-[32px] font-semibold tracking-tightest">Vérifiez votre e-mail</h1>
      <p className="mt-2 text-body text-muted">
        Nous venons de vous envoyer un lien de confirmation. Cliquez dessus pour activer votre compte.
      </p>

      <div className="mt-8 rounded-card bg-canvas p-5 text-left text-body-sm">
        <p className="font-semibold text-ink">Vous ne recevez pas le message ?</p>
        <ul className="mt-2 space-y-1 text-muted">
          <li>· Vérifiez votre dossier Spam</li>
          <li>· Confirmez l'orthographe de votre adresse</li>
          <li>· Patientez quelques minutes</li>
        </ul>
      </div>

      <Button variant="outline" className="mt-8 w-full" size="lg">
        Renvoyer le lien de vérification
      </Button>

      <p className="mt-6 text-body-sm text-muted">
        <Link to="/merchant" className="text-violet hover:underline">
          Simuler la vérification et aller à l'espace commerçant →
        </Link>
      </p>
    </div>
  );
}

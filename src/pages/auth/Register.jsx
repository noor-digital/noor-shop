import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function Register() {
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-caption uppercase tracking-tight text-muted">Essai gratuit 14 jours</p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tightest">Créez votre compte.</h1>
      <p className="mt-2 text-body text-muted">
        Démarrez votre boutique en quelques minutes. Sans carte bancaire.
      </p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!agree) return;
          navigate('/verifier-email');
        }}
      >
        <Input label="Nom complet" name="name" placeholder="Awa Diop" required />
        <Input label="E-mail professionnel" name="email" type="email" placeholder="awa@monshop.sn" required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Mot de passe" name="password" type="password" placeholder="8+ caractères" required />
          <Input label="Confirmation" name="confirm" type="password" placeholder="Répétez" required />
        </div>

        <label className="flex items-start gap-3 text-body-sm text-muted">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-hairline"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>
            J'accepte les{' '}
            <a className="text-violet hover:underline" href="#">conditions d'utilisation</a> et la
            {' '}<a className="text-violet hover:underline" href="#">politique de confidentialité</a>.
          </span>
        </label>

        <Button type="submit" className="w-full" size="lg" disabled={!agree}>
          Créer mon compte
        </Button>
      </form>

      <p className="mt-6 text-center text-body-sm text-muted">
        Déjà inscrit ?{' '}
        <Link to="/connexion" className="text-violet hover:underline">Se connecter</Link>
      </p>
    </div>
  );
}

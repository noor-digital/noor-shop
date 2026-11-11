import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-caption uppercase tracking-tight text-muted">Mot de passe</p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tightest">Mot de passe oublié ?</h1>
      <p className="mt-2 text-body text-muted">
        Entrez votre e-mail. Nous vous enverrons un lien pour choisir un nouveau mot de passe.
      </p>

      {sent ? (
        <div className="mt-8 rounded-card border border-hairline bg-canvas p-5 text-body-sm text-ink">
          <p className="font-semibold">E-mail envoyé.</p>
          <p className="mt-1 text-muted">
            Si un compte existe pour cette adresse, vous recevrez un lien dans quelques minutes.
          </p>
        </div>
      ) : (
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <Input label="E-mail du compte" name="email" type="email" required placeholder="vous@monshop.sn" />
          <Button type="submit" className="w-full" size="lg">Recevoir le lien de réinitialisation</Button>
        </form>
      )}

      <p className="mt-6 text-center text-body-sm text-muted">
        <Link to="/connexion" className="text-violet hover:underline">← Retour à la connexion</Link>
      </p>
    </div>
  );
}

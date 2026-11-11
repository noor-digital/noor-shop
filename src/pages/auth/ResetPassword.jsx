import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function ResetPassword() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-caption uppercase tracking-tight text-muted">Réinitialisation</p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tightest">Nouveau mot de passe</h1>
      <p className="mt-2 text-body text-muted">Choisissez un mot de passe d'au moins 8 caractères.</p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/connexion');
        }}
      >
        <Input label="Nouveau mot de passe" name="password" type="password" required />
        <Input label="Confirmation" name="confirm" type="password" required />
        <ul className="text-caption text-muted space-y-1">
          <li>· Au moins 8 caractères</li>
          <li>· Au moins une majuscule et un chiffre</li>
        </ul>
        <Button type="submit" className="w-full" size="lg">Enregistrer</Button>
      </form>

      <p className="mt-6 text-center text-body-sm text-muted">
        <Link to="/connexion" className="text-violet hover:underline">← Retour à la connexion</Link>
      </p>
    </div>
  );
}

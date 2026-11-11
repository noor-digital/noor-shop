import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-caption uppercase tracking-tight text-muted">Espace commerçant</p>
      <h1 className="mt-2 text-[32px] font-semibold tracking-tightest">Bon retour.</h1>
      <p className="mt-2 text-body text-muted">Connectez-vous pour gérer votre boutique.</p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/merchant');
        }}
      >
        <Input label="Adresse e-mail" name="email" type="email" placeholder="vous@monshop.sn" required />
        <Input
          label="Mot de passe"
          name="password"
          type="password"
          placeholder="Minimum 8 caractères"
          required
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-body-sm text-muted">
            <input type="checkbox" className="h-4 w-4 rounded border-hairline" />
            Rester connecté
          </label>
          <Link to="/mot-de-passe-oublie" className="text-body-sm text-violet hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg">Se connecter</Button>
      </form>

      <div className="mt-8 flex items-center gap-4 text-caption text-muted">
        <span className="flex-1 h-px bg-hairline" />
        <span>ou</span>
        <span className="flex-1 h-px bg-hairline" />
      </div>

      <Button to="/inscription" variant="outline" className="mt-6 w-full" size="lg">
        Créer un compte commerçant
      </Button>

      <p className="mt-10 text-caption text-muted text-center">
        Démo : utilisez n'importe quel e-mail et mot de passe pour explorer l'interface.
      </p>
    </div>
  );
}

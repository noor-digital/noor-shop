import { useState } from 'react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-page px-5 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">Contact</p>
          <h1 className="mt-3 text-[40px] md:text-[48px] font-semibold tracking-tightest">
            Parlons de votre projet.
          </h1>
          <p className="mt-4 text-body-lg text-muted max-w-md">
            Que vous ouvriez votre première boutique ou que vous migriez un commerce existant,
            nous sommes là pour vous accompagner.
          </p>

          <div className="mt-10 space-y-4 text-body text-ink">
            <div>
              <p className="text-caption uppercase tracking-tight text-muted">Dakar</p>
              <p>SICAP Liberté 6, Dakar, Sénégal</p>
            </div>
            <div>
              <p className="text-caption uppercase tracking-tight text-muted">E-mail</p>
              <p>hello@noor.shop</p>
            </div>
            <div>
              <p className="text-caption uppercase tracking-tight text-muted">Téléphone</p>
              <p>+221 77 000 00 00</p>
            </div>
          </div>
        </div>

        <Card>
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-pill bg-emerald-50 text-emerald-600 text-xl">
                ✓
              </div>
              <h3 className="mt-4 text-[20px] font-semibold tracking-tightest">Message envoyé</h3>
              <p className="mt-2 text-body text-muted">Nous revenons vers vous sous 24 heures ouvrées.</p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                <Input label="Prénom" name="firstName" placeholder="Awa" required />
                <Input label="Nom" name="lastName" placeholder="Diop" required />
              </div>
              <Input label="E-mail" name="email" type="email" placeholder="awa@monshop.sn" required />
              <Input label="Téléphone" name="phone" placeholder="+221 77 000 00 00" />
              <Input as="textarea" label="Votre message" name="message" placeholder="Parlez-nous de votre activité…" required />
              <Button type="submit" className="w-full">Envoyer le message</Button>
              <p className="text-caption text-muted text-center">
                En envoyant, vous acceptez nos conditions d'utilisation.
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRICE_EUR = 35;

const CE_CONTINE = [
  '5 lecții practice',
  'Exerciții aplicate + caiet PDF',
  'Acces online imediat, pe viață',
];

export default function PlataPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !acceptedTerms || isLoading) return;

    setIsLoading(true);
    setError(null);

    const res = await fetch('/api/paynet/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: 'relatia360_conflicte',
        amount: PRICE_EUR,
        currency: 'EUR',
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
      }),
    });

    const json = await res.json();

    if (json.error) {
      setError(json.details || json.error || 'Nu s-a putut genera link-ul de plată. Te rugăm să încerci din nou.');
      setIsLoading(false);
      return;
    }

    if (json.ok && json.paynet_redirect_action && json.paynet_redirect_params) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = json.paynet_redirect_action;
      Object.entries(json.paynet_redirect_params as Record<string, string>).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } else if (json.ok && json.payment_url) {
      window.location.assign(json.payment_url);
    } else if (json.ok && json.payment_id && json.redirect_base) {
      window.location.assign(`${json.redirect_base}?operation=${json.payment_id}&Lang=ro`);
    } else {
      setError(json.details || json.error || 'Nu s-a putut genera link-ul de plată.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: 'linear-gradient(to bottom, #f5ede3, #ebdfce)' }}>
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2 text-center uppercase"
            style={{ color: '#1F2933', letterSpacing: '-0.02em', lineHeight: '1.1' }}
          >
            Plată curs
          </h1>
          <p className="text-center mb-8" style={{ color: '#6B7280' }}>
            RELAȚIA 360 – De la conflict la conectare
          </p>

          <div
            className="rounded-2xl p-6 md:p-8 space-y-6"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Preț */}
            <div className="text-center pb-4 border-b" style={{ borderColor: '#e5d9c8' }}>
              <p className="text-3xl font-bold" style={{ color: '#1F2933' }}>
                {PRICE_EUR} EUR
              </p>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                Preț unic • Acces pe viață
              </p>
            </div>

            {/* Ce conține programul */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: '#1F2933' }}>
                Ce conține programul
              </p>
              <ul className="space-y-1.5 text-sm" style={{ color: '#6B7280' }}>
                {CE_CONTINE.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: '#E56B6F' }}>✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="name" className="sr-only">Nume și prenume</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border text-black text-sm"
                    style={{ borderColor: '#e5d9c8', backgroundColor: '#faf8f5' }}
                    placeholder="Nume prenume"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border text-black text-sm"
                    style={{ borderColor: '#e5d9c8', backgroundColor: '#faf8f5' }}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Telefon</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border text-black text-sm"
                    style={{ borderColor: '#e5d9c8', backgroundColor: '#faf8f5' }}
                    placeholder="Telefon"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 rounded"
                />
                <label htmlFor="terms" className="text-sm" style={{ color: '#6B7280' }}>
                  Am citit și accept{' '}
                  <Link href="/termeni" className="underline hover:opacity-80" style={{ color: '#1F2933' }}>
                    Termenii și Condițiile
                  </Link>
                  .
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!acceptedTerms || isLoading}
                className="w-full py-4 rounded-xl text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)',
                  boxShadow: '0 4px 12px rgba(229, 107, 111, 0.4)',
                }}
              >
                {isLoading ? 'Se pregătește plata...' : `Merg la plată (${PRICE_EUR} EUR)`}
              </button>
            </form>

            <p className="text-center text-xs" style={{ color: '#6B7280' }}>
              După ce apeși butonul, vei fi dus la pagina securizată de plată Paynet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

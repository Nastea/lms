'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRICE_EUR = 35;

const CE_CONTINE = [
  '5 lecții video practice',
  'Exerciții aplicate + caiet PDF',
  'Acces online imediat, pentru 6 luni',
];

export default function PlataPage() {
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !acceptedTerms || isLoading) return;

    setIsLoading(true);
    setError(null);

    const res = await fetch('/api/paynet/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: 'relatia360_conflicte',
        amount: PRICE_EUR,
        currency: 'EUR',
        customer_email: email.trim(),
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
    <div
      className="min-h-screen w-full overflow-x-hidden md:h-screen md:min-h-0 md:overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #f5ede3, #ebdfce)' }}
    >
      <section className="py-10 md:py-0 md:h-full md:min-h-0 md:flex md:flex-col">
        <div className="mx-auto max-w-5xl flex-1 px-4 sm:px-6 md:flex md:min-h-0">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 md:min-h-0 md:flex-1">
            {/* Coloana stânga: imagine full height pe desktop */}
            <div className="relative flex flex-col md:h-full md:min-h-0">
              <div className="overflow-hidden rounded-2xl shadow-lg md:absolute md:inset-0 md:rounded-l-2xl" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                <img
                  src="/api/img/IMG_0646.JPG"
                  alt="Lilia Dubița - RELAȚIA 360"
                  className="h-auto w-full object-cover md:h-full md:object-cover"
                />
              </div>
            </div>

            {/* Coloana dreapta: titlu + formular */}
            <div className="flex flex-col justify-center md:h-full md:py-8 md:pl-12">
              <h1
                className="text-2xl font-bold uppercase tracking-tight text-[#1F2933] md:text-3xl"
                style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}
              >
                Plată curs
              </h1>
              <p className="mt-2 text-lg text-[#6B7280]">
                RELAȚIA 360 – De la conflict la conectare
              </p>
              <div
                className="mt-6 rounded-2xl p-6 md:p-8 shadow-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
            {/* Preț */}
            <div className="text-center pb-5 border-b" style={{ borderColor: '#e5d9c8' }}>
              <p className="text-3xl font-bold text-[#1F2933]">
                {PRICE_EUR} EUR
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">
                Preț unic • Acces pentru 6 luni
              </p>
            </div>

            {/* Ce conține */}
            <div className="py-5 border-b" style={{ borderColor: '#e5d9c8' }}>
              <p className="mb-3 text-sm font-semibold text-[#1F2933]">
                Ce primești
              </p>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                {CE_CONTINE.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#E56B6F]">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form: doar email */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#1F2933]">
                  Adresă de email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 text-black"
                  style={{ borderColor: '#e5d9c8', backgroundColor: '#faf8f5' }}
                  placeholder="email@exemplu.com"
                />
                <p className="mt-1 text-xs text-[#6B7280]">
                  La acest email vei primi link-ul de acces la curs după plată.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 rounded"
                />
                <label htmlFor="terms" className="text-sm text-[#6B7280]">
                  Am citit și accept{' '}
                  <Link href="/termeni" className="underline hover:opacity-80" style={{ color: '#1F2933' }}>
                    Termenii și Condițiile
                  </Link>
                  .
                </label>
              </div>

              {error && (
                <div className="rounded-lg p-3 text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!acceptedTerms || !email.trim() || isLoading}
                className="w-full rounded-xl py-4 text-base font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)',
                  boxShadow: '0 4px 12px rgba(229, 107, 111, 0.4)',
                }}
              >
                {isLoading ? 'Se pregătește plata...' : `Merg la plată (${PRICE_EUR} EUR)`}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-[#6B7280]">
              Plată securizată prin Paynet. După ce apeși butonul, vei fi redirecționat către pagina de plată.
            </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

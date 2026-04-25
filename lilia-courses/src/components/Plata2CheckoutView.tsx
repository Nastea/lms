'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRODUCT_ID = 'relatia360_plata2_1leu';
const AMOUNT_MDL = 1;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function Plata2CheckoutView() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serif = { fontFamily: 'var(--font-heading), Georgia, serif' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();
    const ph = phone.trim();
    if (!fn || !ln || !em || !ph || !acceptedTerms || isLoading) return;
    if (!isValidEmail(em)) {
      setError('Introdu o adresă de email validă.');
      return;
    }
    const phoneDigits = ph.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      setError('Introdu un număr de telefon valid (minim 8 cifre).');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await fetch('/api/paynet/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: PRODUCT_ID,
        amount: AMOUNT_MDL,
        currency: 'MDL',
        customer_first_name: fn,
        customer_last_name: ln,
        customer_email: em.toLowerCase(),
        customer_phone: ph,
      }),
    });

    const json = await res.json();

    if (json.error) {
      setError(json.details || json.error || 'Nu s-a putut genera link-ul de plată. Te rugăm să încerci din nou.');
      setIsLoading(false);
      return;
    }

    if (json.ok && json.payment_url) {
      window.location.assign(json.payment_url);
    } else if (json.ok && json.paynet_redirect_action && json.paynet_redirect_params) {
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
    } else if (json.ok && json.payment_id && json.redirect_base) {
      window.location.assign(`${json.redirect_base}?operation=${json.payment_id}&Lang=ro`);
    } else {
      setError(json.details || json.error || 'Nu s-a putut genera link-ul de plată.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden text-[#2A1F18]" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Keep dark background visible in mobile safe-area/status bar zone */}
      <div style={{ height: 'env(safe-area-inset-top)', backgroundColor: '#1F2933' }} />

      <header className="flex items-center justify-center px-4 py-[18px] sm:px-8" style={{ backgroundColor: '#1F2933' }}>
        <div className="text-[20px] font-medium tracking-wide text-[#EFE8DF]" style={serif}>
          Lilia Dubița <span className="text-[#B89880]">·</span> Relația{' '}
          <span style={{ color: '#E56B6F' }}>360</span>
        </div>
      </header>

      <div className="px-4 pb-8 pt-0 text-center sm:px-8" style={{ backgroundColor: '#1F2933' }}>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#B89880]">Pagină de plată (test)</p>
        <h1
          className="mx-auto max-w-2xl text-[clamp(24px,4.5vw,36px)] font-medium leading-[1.2] italic text-[#F5EEE6]"
          style={serif}
        >
          Plată <strong className="font-semibold not-italic text-white">1 leu</strong> (MDL)
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-[#B89880]">
          Această pagină este accesibilă doar cu parola primită. Suma afișată este 1 MDL.
        </p>
      </div>

      <main className="mx-auto w-full max-w-[520px] flex-1 px-4 py-12 sm:px-6 md:py-14">
        <div className="overflow-hidden rounded-xl border bg-white shadow-[0_4px_32px_rgba(61,43,31,0.08)]" style={{ borderColor: '#DDD4C4' }}>
          <div className="px-7 pb-6 pt-7 text-center" style={{ backgroundColor: '#1F2933' }}>
            <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#B89880]">Sumă de plată</div>
            <div className="mt-2 flex items-baseline justify-center gap-2">
              <span className="text-[52px] font-semibold leading-none text-white" style={serif}>
                1
              </span>
              <span className="text-2xl font-normal text-[#B89880]">MDL</span>
            </div>
            <p className="mt-2 text-xs tracking-wide text-[#B89880]">Un singur pas — apoi Paynet</p>
          </div>

          <div className="px-7 pb-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="plata2-firstName" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6B5245]">
                    Prenume
                  </label>
                  <input
                    id="plata2-firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    maxLength={80}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#2A1F18] outline-none transition-colors focus:border-[#E56B6F] focus:bg-white"
                    style={{ borderColor: '#DDD4C4', backgroundColor: '#FAF7F2' }}
                    placeholder="Prenume"
                  />
                </div>
                <div>
                  <label htmlFor="plata2-lastName" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6B5245]">
                    Nume
                  </label>
                  <input
                    id="plata2-lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    maxLength={80}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#2A1F18] outline-none transition-colors focus:border-[#E56B6F] focus:bg-white"
                    style={{ borderColor: '#DDD4C4', backgroundColor: '#FAF7F2' }}
                    placeholder="Nume"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="plata2-email" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6B5245]">
                  Adresă de email
                </label>
                <input
                  id="plata2-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#2A1F18] outline-none transition-colors focus:border-[#E56B6F] focus:bg-white"
                  style={{ borderColor: '#DDD4C4', backgroundColor: '#FAF7F2' }}
                  placeholder="adresa@email.com"
                />
                <p className="mt-1.5 text-[11px] text-[#9C7E6F]">Confirmarea plății poate fi trimisă la acest email.</p>
              </div>
              <div>
                <label htmlFor="plata2-phone" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6B5245]">
                  Telefon
                </label>
                <input
                  id="plata2-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#2A1F18] outline-none transition-colors focus:border-[#E56B6F] focus:bg-white"
                  style={{ borderColor: '#DDD4C4', backgroundColor: '#FAF7F2' }}
                  placeholder="ex. 069123456 sau +37369123456"
                />
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  id="plata2-terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#E56B6F]"
                />
                <label htmlFor="plata2-terms" className="cursor-pointer text-xs leading-relaxed text-[#9C7E6F]">
                  Am citit și accept{' '}
                  <Link href="/termeni" className="text-[#E56B6F] no-underline hover:underline">
                    Termenii și Condițiile
                  </Link>{' '}
                  și{' '}
                  <Link href="/confidentialitate" className="text-[#E56B6F] no-underline hover:underline">
                    Politica de Confidențialitate
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
                disabled={
                  !firstName.trim() ||
                  !lastName.trim() ||
                  !email.trim() ||
                  !phone.trim() ||
                  !acceptedTerms ||
                  isLoading
                }
                className="w-full rounded-lg py-4 text-[15px] font-medium tracking-wide text-white transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: '#E56B6F' }}
              >
                {isLoading ? 'Se pregătește plata...' : 'Merg la plată (1 MDL)'}
              </button>

              <div className="flex items-center justify-center gap-2 pt-1 text-xs text-[#9C7E6F]">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Plată securizată prin Paynet
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="mt-auto px-4 py-7 text-center sm:px-8" style={{ backgroundColor: '#1F2933' }}>
        <p className="mb-3 text-xs leading-relaxed text-[#B89880]">
          Danex Prim SRL · mun. Chișinău, sec. Buiucani, str. Calea Ieșilor, 11
          <br />
          Tel: 067102290 · danexprim@liliadubita.md
        </p>
        <div className="mb-4 flex flex-wrap justify-center gap-5">
          <Link href="/termeni" className="text-xs text-[#9C8070] hover:text-[#B89880]">
            Termeni și Condiții
          </Link>
          <Link href="/confidentialitate" className="text-xs text-[#9C8070] hover:text-[#B89880]">
            Politică de Confidențialitate
          </Link>
        </div>
        <p className="text-[11px]" style={{ color: '#6D5549' }}>
          © {new Date().getFullYear()} Danex Prim SRL. Toate drepturile rezervate.
        </p>
      </footer>
    </div>
  );
}

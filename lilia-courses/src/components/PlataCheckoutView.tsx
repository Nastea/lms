'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { COURSE_PRICE } from '@/lib/coursePrice';

const CE_CONTINE = [
  '5 lecții video practice',
  'Exerciții aplicate + caiet PDF',
  'Acces online imediat',
  'Acces nelimitat pentru 6 luni',
] as const;

const BENEFITS = [
  {
    title: 'Înțelegi tiparul vostru de comunicare',
    desc: 'Identifici de ce apare același conflict, și ce îl hrănește cu adevărat.',
    path: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z',
  },
  {
    title: 'Exprimi nevoile fără reproș sau presiune',
    desc: 'Înveți formule de comunicare care apropie, nu declanșează defensivă.',
    path: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  },
  {
    title: 'Rămâi prezent(ă) în conflict, fără să te pierzi',
    desc: 'Înveți cum să nu reacționezi din impuls emoțional și să nu regreți după.',
    path: 'M4.5 12.5l5 5 10-10',
  },
  {
    title: 'Transformi comunicarea zilnică în conexiune',
    desc: 'Înveți cum să mențineți căldura, cooperarea și chiar pasiunea prin cuvinte.',
    path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  },
] as const;

function IconBenefit({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="#E56B6F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="#3A8C5A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1,6 4,10 11,2" />
    </svg>
  );
}

export default function PlataCheckoutView() {
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceDisplay = useMemo(() => {
    const parts = COURSE_PRICE.label.trim().split(/\s+/);
    if (parts.length >= 2) {
      return { amount: parts[0], currency: parts.slice(1).join(' ') };
    }
    return { amount: COURSE_PRICE.label, currency: '' };
  }, []);

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
        amount: COURSE_PRICE.amount,
        currency: COURSE_PRICE.currency,
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

  const serif = { fontFamily: 'var(--font-heading), Georgia, serif' };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden text-[#2A1F18]" style={{ backgroundColor: '#FAF7F2' }}>
      {/* HEADER */}
      <header className="flex items-center justify-center px-4 py-[18px] sm:px-8" style={{ backgroundColor: '#1F2933' }}>
        <div className="text-[20px] font-medium tracking-wide text-[#EFE8DF]" style={serif}>
          Lilia Dubița <span className="text-[#B89880]">·</span> Relația{' '}
          <span style={{ color: '#E56B6F' }}>360</span>
        </div>
      </header>

      {/* HERO STRIP */}
      <div className="px-4 pb-10 pt-0 text-center sm:px-8" style={{ backgroundColor: '#1F2933' }}>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#B89880]">Finalizează comanda</p>
        <h1
          className="mx-auto max-w-2xl text-[clamp(28px,5vw,42px)] font-medium leading-[1.2] italic text-[#F5EEE6]"
          style={serif}
        >
          Ești la un pas de <strong className="font-semibold not-italic text-white">o comunicare</strong>
          <br />
          care conectează, nu divide
        </h1>
      </div>

      {/* STATS BAR */}
      <div
        className="flex flex-wrap justify-center gap-8 border-y px-4 py-6 sm:gap-12"
        style={{ backgroundColor: '#F0EBE1', borderColor: '#DDD4C4' }}
      >
        {[
          { num: '3.000+', label: 'cupluri îndrumate' },
          { num: '13', label: 'ani de practică privată' },
          { num: '5', label: 'lecții practice aplicate' },
          { num: '6 luni', label: 'acces nelimitat' },
        ].map((s) => (
          <div key={s.label} className="min-w-[120px] text-center">
            <div className="text-[30px] font-semibold leading-none text-[#1F2933]" style={serif}>
              {s.num}
            </div>
            <div className="mt-1 text-xs tracking-wide text-[#9C7E6F]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <main className="mx-auto grid w-full max-w-[1040px] flex-1 grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-12 md:py-14">
        {/* LEFT: sales */}
        <div className="order-2 md:order-1">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#E56B6F]">De ce merită</p>
          <h2 className="mb-5 text-[clamp(22px,3.5vw,30px)] font-medium leading-snug text-[#3D2B1F]" style={serif}>
            Nu vei primi sfaturi generice.
            <br />
            Vei înțelege ce se întâmplă <em className="not-italic text-[#6B5245]">în relația ta.</em>
          </h2>
          <p className="mb-8 border-b pb-8 text-[15px] leading-[1.75] text-[#6B5245]" style={{ borderColor: '#DDD4C4' }}>
            Cei mai mulți oameni știu că „trebuie să comunice mai bine”. Dar știind nu se schimbă nimic. Acest curs îți arată exact
            de ce apar conflictele repetate și îți oferă instrumente concrete — pe care le aplici chiar din prima lecție.
          </p>

          <ul className="mb-0 flex flex-col gap-4">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-3.5">
                <div
                  className="mt-0.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(229, 107, 111, 0.12)' }}
                >
                  <IconBenefit path={b.path} />
                </div>
                <div>
                  <p className="mb-0.5 text-sm font-medium text-[#3D2B1F]">{b.title}</p>
                  <p className="text-[13px] leading-relaxed text-[#9C7E6F]">{b.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: checkout */}
        <div className="order-1 md:order-2 md:sticky md:top-6 md:self-start">
          <div className="overflow-hidden rounded-xl border bg-white shadow-[0_4px_32px_rgba(61,43,31,0.08)]" style={{ borderColor: '#DDD4C4' }}>
            <div className="px-7 pb-6 pt-7 text-center" style={{ backgroundColor: '#1F2933' }}>
              <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#B89880]">Mini-curs practic</div>
              <div className="mb-1 text-[22px] font-semibold leading-snug text-white" style={serif}>
                Relația 360
              </div>
              <div className="text-sm italic text-[#B89880]" style={serif}>
                De la conflict la conectare
              </div>
              <div className="mt-5 flex items-baseline justify-center gap-1">
                {priceDisplay.currency ? (
                  <>
                    <span className="mr-1 text-2xl font-normal text-[#B89880]">{priceDisplay.currency}</span>
                    <span className="text-[52px] font-semibold leading-none text-white" style={serif}>
                      {priceDisplay.amount}
                    </span>
                  </>
                ) : (
                  <span className="text-[52px] font-semibold leading-none text-white" style={serif}>
                    {COURSE_PRICE.label}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs tracking-wide text-[#B89880]">Preț unic · Acces pentru 6 luni</p>
            </div>

            <div className="px-7 pb-6 pt-6">
              <p className="mb-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9C7E6F]">Ce primești</p>
              <ul className="mb-6 flex flex-col gap-2.5 border-b pb-6" style={{ borderColor: '#F0EBE1' }}>
                {CE_CONTINE.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[#6B5245]">
                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#EAF5EE]">
                      <IconCheck />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6B5245]">
                    Adresă de email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#2A1F18] outline-none transition-colors focus:border-[#E56B6F] focus:bg-white"
                    style={{ borderColor: '#DDD4C4', backgroundColor: '#FAF7F2' }}
                    placeholder="adresa@email.com"
                  />
                  <p className="mt-1.5 text-[11px] text-[#9C7E6F]">La acest email vei primi link-ul de acces după plată.</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#E56B6F]"
                  />
                  <label htmlFor="terms" className="cursor-pointer text-xs leading-relaxed text-[#9C7E6F]">
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
                  disabled={!acceptedTerms || !email.trim() || isLoading}
                  className="w-full rounded-lg py-4 text-[15px] font-medium tracking-wide text-white transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: '#E56B6F' }}
                >
                  {isLoading ? 'Se pregătește plata...' : `Merg la plată → ${COURSE_PRICE.label}`}
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

            <div className="flex gap-3 border-t px-7 py-4" style={{ backgroundColor: '#F0EBE1', borderColor: '#DDD4C4' }}>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white"
                style={{ borderColor: '#DDD4C4' }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#E56B6F" strokeWidth={1.8}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p className="mb-0.5 text-[13px] font-medium text-[#3D2B1F]">Conținut creat de un psiholog cu 13 ani experiență</p>
                <p className="text-xs leading-relaxed text-[#9C7E6F]">
                  Lilia Dubița a lucrat cu peste 3.000 de cupluri în terapie individuală. Tot ce înveți în acest curs vine direct din
                  practică reală, nu din teorie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
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
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="rounded-md border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#EFE8DF]">
            VISA
          </span>
          <span className="rounded-md border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#EFE8DF]">
            Paynet
          </span>
        </div>
        <p className="text-[11px]" style={{ color: '#6D5549' }}>
          © {new Date().getFullYear()} Danex Prim SRL. Toate drepturile rezervate.
        </p>
      </footer>
    </div>
  );
}

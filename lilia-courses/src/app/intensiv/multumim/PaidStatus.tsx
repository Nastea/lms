'use client';

import { useEffect, useState } from 'react';
import { INTENSIV } from '@/lib/intensiv';

type State = 'checking' | 'paid' | 'pending' | 'missing';

/** Urmărește statusul comenzii (?order=) până devine `paid`, apoi arată grupul de Telegram. */
export default function PaidStatus({ orderId }: { orderId: string | null }) {
  const [state, setState] = useState<State>(orderId ? 'checking' : 'missing');

  useEffect(() => {
    if (!orderId) return;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      tries += 1;
      try {
        const res = await fetch(`/api/orders/status?order=${encodeURIComponent(orderId)}`, { cache: 'no-store' });
        const json = await res.json();
        if (json.status === 'paid') {
          setState('paid');
          return;
        }
      } catch {
        // retry below
      }
      // Paynet trimite cumpărătorul aici și când plata nu a trecut. După ~30 s fără
      // confirmare arătăm „nu a fost confirmată”, dar mai verificăm încă ~5 minute.
      if (tries === 10) setState('pending');
      if (tries >= 70) return;
      timer = setTimeout(poll, tries < 10 ? 3000 : 5000);
    };
    poll();
    return () => clearTimeout(timer);
  }, [orderId]);

  if (state === 'paid') {
    return (
      <>
        <h1 className="ix-cover-title">
          <span>Ești înscris</span>
          <span>la intensiv</span>
        </h1>
        <p className="ix-cover-by">Plata a fost confirmată. Ne vedem pe 7 noiembrie.</p>
        <p className="ix-cover-sub">
          Intră acum în grupul de Telegram al participanților. Acolo primești caietul de lucru și
          reminder-ele. Linkul de Zoom și toate detaliile ți le-am trimis și pe email.
        </p>
        <a href={INTENSIV.telegramGroupUrl} className="ix-btn ix-btn-big" target="_blank" rel="noopener noreferrer">
          Intră în grupul de Telegram
        </a>
        <p className="ix-cover-line">
          {INTENSIV.dateText} <i className="ix-diamond" aria-hidden /> {INTENSIV.timeText}
        </p>
      </>
    );
  }

  if (state === 'pending' || state === 'missing') {
    return (
      <>
        <h1 className="ix-cover-title">
          <span>Plata nu a fost</span>
          <span>confirmată</span>
        </h1>
        <p className="ix-cover-sub">
          {state === 'missing'
            ? 'Nu am găsit comanda ta în link.'
            : 'Nu am primit confirmarea plății de la bancă.'}{' '}
          Dacă plata nu a trecut, poți încerca din nou.
        </p>
        <a href="/intensiv#inscriere" className="ix-btn ix-btn-big">
          Încearcă din nou
        </a>
        <p className="ix-cover-sub">
          Dacă banii au fost retrași, nu plăti a doua oară: confirmarea poate întârzia câteva minute și
          vine pe email. Scrie-ne la <a href="mailto:danexprim@liliadubita.md">danexprim@liliadubita.md</a>{' '}
          sau sună la 067 102 290.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="ix-cover-title">
        <span>Confirmăm</span>
        <span>plata…</span>
      </h1>
      <p className="ix-cover-sub">Durează câteva secunde. Nu închide pagina.</p>
    </>
  );
}

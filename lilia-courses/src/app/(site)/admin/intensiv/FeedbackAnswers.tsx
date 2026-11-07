'use client';

import { useCallback, useEffect, useState } from 'react';

type Row = {
  created_at: string;
  name: string | null;
  email: string;
  usefulness: number | null;
  takeaway: string | null;
  improve: string | null;
  topics: string | null;
  bonus_sent_at: string | null;
};

/** Răspunsurile la feedback, actualizate singure la 30 de secunde. */
export default function FeedbackAnswers() {
  const [data, setData] = useState<{ rows: Row[]; average: number | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/intensiv-feedback', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Eroare ${res.status}`);
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la încărcare');
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const t = setInterval(load, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [load]);

  return (
    <section className="space-y-4 mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Feedback</h2>
          <p className="text-sm opacity-60 mt-1">
            Formularul: <a className="underline" href="/intensiv/feedback" target="_blank">liliadubita.md/intensiv/feedback</a>
          </p>
        </div>
        <a href="/api/admin/intensiv-feedback?format=csv" className="rounded-xl bg-white text-black px-4 py-2 font-medium">
          Descarcă feedback (CSV)
        </a>
      </div>
      {error && <p className="rounded-xl bg-red-500/15 text-red-300 p-4">{error}</p>}
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="rounded-xl bg-white/5 p-5">
              <p className="text-sm opacity-60">Răspunsuri</p>
              <p className="text-4xl font-semibold mt-1">{data.rows.length}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <p className="text-sm opacity-60">Nota medie (1–10)</p>
              <p className="text-4xl font-semibold mt-1">{data.average ?? '—'}</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.rows.length === 0 && <p className="opacity-60">Încă nu sunt răspunsuri.</p>}
            {data.rows.map((r) => (
              <article key={r.email} className="rounded-xl bg-white/5 p-5 space-y-2 text-sm">
                <p className="opacity-60">
                  <strong className="opacity-100 text-base">{r.usefulness}/10</strong> · {r.name || r.email} · {r.email} ·{' '}
                  {new Date(r.created_at).toLocaleString('ro-RO', { timeZone: 'Europe/Chisinau', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  {' · bonus '}{r.bonus_sent_at ? 'trimis' : 'netrimis'}
                </p>
                <p><span className="opacity-60">Ce i-a plăcut / folosit: </span>{r.takeaway}</p>
                <p><span className="opacity-60">Ce putem face mai bine: </span>{r.improve}</p>
                <p><span className="opacity-60">Teme pentru workshopuri: </span>{r.topics}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

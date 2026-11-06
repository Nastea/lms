'use client';

import { useState } from 'react';

type Failure = { email: string; error?: string };

/** Butoanele pentru reminderul de dinaintea intensivului: test către mine, apoi către toți. */
export default function ReminderSender({ total }: { total: number }) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<Failure[]>([]);

  const post = async (body: object) => {
    const res = await fetch('/api/admin/intensiv-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `Eroare ${res.status}`);
    return json;
  };

  const sendTest = async () => {
    setBusy(true);
    setStatus('Se trimite testul…');
    try {
      const r = await post({ mode: 'test' });
      setStatus(r.ok ? `Test trimis la ${r.to}. Verifică inboxul.` : `Testul nu a plecat: ${r.error}`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Eroare');
    }
    setBusy(false);
  };

  const sendAll = async () => {
    if (!window.confirm(`Trimit reminderul cu noul link de Zoom tuturor celor ${total} participanți?`)) return;
    setBusy(true);
    setFailed([]);
    let offset = 0;
    let sent = 0;
    const fails: Failure[] = [];
    try {
      for (;;) {
        const r = await post({ mode: 'all', offset });
        sent += r.sent;
        fails.push(...r.failed);
        setStatus(`Trimise ${sent} din ${r.total}…`);
        offset = r.next;
        if (r.done) {
          setStatus(`Gata: trimise ${sent} din ${r.total}.${fails.length ? ` ${fails.length} nu au plecat (vezi mai jos).` : ''}`);
          break;
        }
      }
    } catch (e) {
      setStatus(`Oprit după ${sent} emailuri: ${e instanceof Error ? e.message : 'eroare'}. Poți apăsa din nou; cine a primit deja nu primește a doua oară.`);
    }
    setFailed(fails);
    setBusy(false);
  };

  return (
    <div className="rounded-xl bg-white/5 p-5 space-y-3">
      <p className="font-semibold">Reminder pentru astăzi: noul link de Zoom + caietul atașat</p>
      <div className="flex flex-wrap gap-3">
        <button onClick={sendTest} disabled={busy} className="rounded-xl border border-white/30 px-4 py-2 disabled:opacity-40">
          Trimite-mi un test
        </button>
        <button onClick={sendAll} disabled={busy} className="rounded-xl bg-white text-black px-4 py-2 font-medium disabled:opacity-40">
          Trimite tuturor ({total})
        </button>
      </div>
      {status && <p className="text-sm">{status}</p>}
      {failed.length > 0 && (
        <ul className="text-sm text-red-300 space-y-1">
          {failed.map((f) => (
            <li key={f.email}>{f.email}: {f.error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

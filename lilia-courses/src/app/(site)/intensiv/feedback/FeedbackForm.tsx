'use client';

import { useState } from 'react';

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function FeedbackForm() {
  const [email, setEmail] = useState('');
  const [usefulness, setUsefulness] = useState<number | null>(null);
  const [takeaway, setTakeaway] = useState('');
  const [improve, setImprove] = useState('');
  const [topics, setTopics] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ bonusSent: boolean } | null>(null);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const formOk = emailOk && usefulness !== null && takeaway.trim() !== '' && improve.trim() !== '' && topics.trim() !== '';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOk || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/intensiv/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), usefulness, takeaway, improve, topics }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'A apărut o eroare. Încearcă din nou.');
      setDone({ bonusSent: !!json.bonusSent });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare. Încearcă din nou.');
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="ix-fb-done" role="status">
        <p className="ix-cover-by">Mulțumesc din suflet! ❤️</p>
        <p className="ix-cover-sub">
          {done.bonusSent
            ? `Caietul bonus e pe drum spre ${email.trim()}. Dacă nu-l vezi în câteva minute, uită-te și în Spam sau Promoții.`
            : 'Răspunsul tău a ajuns la mine. Îți trimit caietul bonus pe email în curând.'}
        </p>
      </div>
    );
  }

  return (
    <form className="ix-form ix-fb-form" onSubmit={submit} noValidate>
      <fieldset className="ix-fb-q">
        <legend>
          <b>1.</b> Cât de util a fost intensivul pentru tine?
        </legend>
        <div className="ix-fb-scale" role="radiogroup" aria-label="De la 1 (deloc) la 10 (foarte util)">
          {SCALE.map((n) => (
            <label key={n} className={usefulness === n ? 'is-on' : undefined}>
              <input type="radio" name="usefulness" value={n} checked={usefulness === n} onChange={() => setUsefulness(n)} />
              <span>{n}</span>
            </label>
          ))}
        </div>
        <p className="ix-fb-ends"><span>1 · deloc</span><span>10 · foarte util</span></p>
      </fieldset>

      <label className="ix-fb-q">
        <span><b>2.</b> Ce ți-a plăcut? Ce ți-a folosit?</span>
        <textarea value={takeaway} onChange={(e) => setTakeaway(e.target.value)} rows={4} maxLength={4000} required />
      </label>

      <label className="ix-fb-q">
        <span><b>3.</b> Ce aș putea face mai bine data viitoare?</span>
        <textarea value={improve} onChange={(e) => setImprove(e.target.value)} rows={4} maxLength={4000} required />
      </label>

      <label className="ix-fb-q">
        <span><b>4.</b> Pe ce temă ți-ar plăcea să lucrăm împreună la următoarele workshopuri?</span>
        <textarea value={topics} onChange={(e) => setTopics(e.target.value)} rows={3} maxLength={4000} required />
      </label>

      <label className="ix-fb-q">
        <span>Emailul cu care te-ai înscris (aici îți trimit caietul bonus)</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </label>

      {error && <p className="ix-form-error" role="alert">{error}</p>}
      <button type="submit" className="ix-btn ix-btn-wide" disabled={!formOk || busy}>
        {busy ? 'Se trimite…' : formOk ? 'Trimite și primește caietul bonus' : 'Răspunde la toate cele 4 întrebări'}
      </button>
    </form>
  );
}

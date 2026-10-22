'use client';

import { useState } from 'react';
import Link from 'next/link';
import { INTENSIV } from '@/lib/intensiv';

export default function SignupForm({ label }: { label: string }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneOk = phone.replace(/\D/g, '').replace(/^373/, '').length >= 8;
  const formOk =
    firstName.trim() !== '' && lastName.trim() !== '' && emailOk && phoneOk && acceptedTerms;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOk || isLoading) return;
    setIsLoading(true);
    setError(null);
    const err = await startCheckout({
      first: firstName.trim(),
      last: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    if (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  return (
    <form className="ix-form" onSubmit={submit} noValidate>
      <div className="ix-form-row">
        <label>
          <span>Prenume</span>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required />
        </label>
        <label>
          <span>Nume</span>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required />
        </label>
      </div>
      <label>
        <span>Email (aici primești linkurile)</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </label>
      <label>
        <span>Telefon</span>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="069123456" required />
      </label>
      <label className="ix-check">
        <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
        <span>
          Am citit și accept <Link href="/termeni" target="_blank">Termenii și Condițiile</Link> și{' '}
          <Link href="/confidentialitate" target="_blank">Politica de Confidențialitate</Link>.
        </span>
      </label>
      {error && <p className="ix-form-error" role="alert">{error}</p>}
      <button type="submit" className="ix-btn ix-btn-wide" disabled={!formOk || isLoading}>
        {isLoading ? 'Se procesează…' : formOk ? label : 'Completează datele ca să continui'}
      </button>
      <p className="ix-form-note">
        Plată securizată cu cardul, prin Paynet. După plată primești pe email linkul spre grupul
        participanților, unde vin caietul și linkul de Zoom.
      </p>
    </form>
  );
}

/** Creează comanda la /api/paynet/create (suma o impune serverul) și trimite browserul la Paynet. */
async function startCheckout(c: { first: string; last: string; email: string; phone: string }): Promise<string | null> {
  try {
    const res = await fetch('/api/paynet/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: INTENSIV.productId,
        amount: INTENSIV.amount,
        currency: 'MDL',
        customer_first_name: c.first,
        customer_last_name: c.last,
        customer_email: c.email,
        customer_phone: c.phone,
      }),
    });
    const json = await res.json();
    if (!json.error && json.paynet_redirect_action && json.paynet_redirect_params) {
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
      return null;
    }
    return json.details || json.error || 'Nu s-a putut genera link-ul de plată. Te rugăm să încerci din nou.';
  } catch {
    return 'A apărut o eroare de rețea. Te rugăm să încerci din nou.';
  }
}

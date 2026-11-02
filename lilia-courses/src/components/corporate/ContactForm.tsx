"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { contact, company } from "@/content/corporate";
import { leadSchema } from "@/lib/corporateLead";
import { PREFILL_EVENT, type Prefill } from "./prefill";

type Values = {
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  participants: string;
  intent: string;
  challenge: string;
  consent: boolean;
  website: string;
};
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent" | "failed" | "unavailable";

const empty: Values = { name: "", company: "", position: "", email: "", phone: "", participants: "", intent: "", challenge: "", consent: false, website: "" };

export default function ContactForm() {
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    const onPrefill = (e: Event) => {
      const { text, intent } = (e as CustomEvent<Prefill>).detail;
      setV((cur) => ({ ...cur, challenge: text || cur.challenge, intent: intent ?? cur.intent }));
      setErrors((cur) => ({ ...cur, challenge: undefined }));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const validate = (vals: Values): Errors => {
    const r = leadSchema.safeParse({ ...vals, startedAt: startedAt.current || 1 });
    if (r.success) return {};
    return Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])) as Errors;
  };

  const set = <K extends keyof Values>(k: K, value: Values[K]) => {
    setV((cur) => ({ ...cur, [k]: value }));
    if (errors[k]) setErrors((cur) => ({ ...cur, [k]: validate({ ...v, [k]: value })[k] }));
  };
  const blur = (k: keyof Values) => setErrors((cur) => ({ ...cur, [k]: validate(v)[k] }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    const first = (Object.keys(errs) as (keyof Values)[]).find((k) => errs[k]);
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/corporate-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, startedAt: startedAt.current }),
      });
      if (res.ok) return setStatus("sent");
      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.fields) {
        setErrors(data.fields);
        return setStatus("idle");
      }
      setStatus(res.status === 503 ? "unavailable" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div className="form-status ok" role="status">
        <p>Mulțumim, am primit solicitarea.</p>
        <p>Vă contactăm pentru a stabili o primă discuție. Dacă doriți să adăugați ceva, scrieți-ne la {company.email}.</p>
      </div>
    );
  }

  const field = (k: keyof Values, label: string, input: React.ReactNode, optional = false) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>
        {label} {optional && <i>(opțional)</i>}
      </label>
      {input}
      {errors[k] && (
        <p className="err" id={`e-${k}`}>
          {errors[k]}
        </p>
      )}
    </div>
  );
  const common = (k: keyof Values) => ({
    id: `f-${k}`,
    name: k,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `e-${k}` : undefined,
    onBlur: () => blur(k),
  });

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="row">
        {field("name", "Nume și prenume", <input {...common("name")} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} />)}
        {field("company", "Companie", <input {...common("company")} autoComplete="organization" value={v.company} onChange={(e) => set("company", e.target.value)} />)}
      </div>
      <div className="row">
        {field("position", "Funcție", <input {...common("position")} autoComplete="organization-title" value={v.position} onChange={(e) => set("position", e.target.value)} />, true)}
        {field("participants", "Număr aproximativ de participanți", (
          <select {...common("participants")} value={v.participants} onChange={(e) => set("participants", e.target.value)}>
            <option value="">Alegeți</option>
            {contact.participants.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        ), true)}
      </div>
      {field("intent", "Știți deja ce tip de intervenție doriți?", (
        <select {...common("intent")} value={v.intent} onChange={(e) => set("intent", e.target.value)}>
          <option value="">Alegeți</option>
          {contact.intents.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      ), true)}
      <div className="row">
        {field("email", "Email", <input {...common("email")} type="email" autoComplete="email" inputMode="email" value={v.email} onChange={(e) => set("email", e.target.value)} />)}
        {field("phone", "Telefon", <input {...common("phone")} type="tel" autoComplete="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} />, true)}
      </div>
      {field("challenge", "Ce observați în echipă?", (
        <textarea {...common("challenge")} value={v.challenge} onChange={(e) => set("challenge", e.target.value)}
          placeholder="De exemplu: managerii noi evită feedbackul, iar între vânzări și logistică apar des neînțelegeri." />
      ))}
      <p className="hint">Vă rugăm să nu includeți aici date personale despre angajați. Detaliile le discutăm direct.</p>

      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Nu completați acest câmp</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div className="field">
        <label className="consent" htmlFor="f-consent">
          <input {...common("consent")} className="check" type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} />
          <span>
            Sunt de acord ca datele din acest formular să fie folosite pentru a fi contactat(ă) în legătură cu solicitarea mea. Detalii în{" "}
            <Link href="/confidentialitate#formular-corporate">Politica de confidențialitate</Link>.
          </span>
        </label>
        {errors.consent && <p className="err" id="e-consent">{errors.consent}</p>}
      </div>

      {status === "failed" && (
        <div className="form-status fail" role="alert">
          <p>Solicitarea nu a putut fi trimisă. Verificați conexiunea și încercați din nou, sau scrieți-ne la {company.email}.</p>
        </div>
      )}
      {status === "unavailable" && (
        <div className="form-status fail" role="alert">
          <p>Formularul nu funcționează momentan. Scrieți-ne la {company.email} sau sunați la {company.phone}.</p>
        </div>
      )}

      <div>
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Se trimite…" : "Trimite solicitarea"}
        </button>
      </div>
    </form>
  );
}

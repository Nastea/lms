import { NextResponse } from "next/server";
import { leadSchema, MIN_FILL_MS, type Lead } from "@/lib/corporateLead";

// Solicitări din formularul de pe pagina principală corporate → email către Lilia (Resend).
// Necesită RESEND_API_KEY și CORPORATE_LEADS_TO; expeditor CORPORATE_LEADS_FROM sau RESEND_FROM.
// Nu trimitem email automat vizitatorului: un formular public care trimite emailuri
// la adrese introduse de oricine poate fi folosit pentru spam.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Limită per instanță (best-effort pe serverless); honeypot-ul și timpul minim filtrează restul.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function emailHtml(l: Lead) {
  const rows: [string, string][] = [
    ["Nume", l.name],
    ["Companie", l.company],
    ["Funcție", l.position || "—"],
    ["Email", l.email],
    ["Telefon", l.phone || "—"],
    ["Participanți", l.participants || "—"],
    ["Tip de intervenție", l.intent || "—"],
  ];
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#2a1d17">
<h2 style="font-size:18px">Solicitare nouă: discuție inițială</h2>
<table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#5f5047">${k}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`)
    .join("")}</table>
<h3 style="font-size:16px;margin-top:20px">Ce observă în echipă</h3>
<p style="white-space:pre-wrap">${esc(l.challenge)}</p>
<p style="color:#5f5047;font-size:13px">Trimis din formularul de pe liliadubita.md. Răspundeți direct la acest email pentru a-i scrie solicitantului.</p>
</div>`;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
    // Honeypot completat: răspundem ca la succes, fără să trimitem nimic.
    if ("website" in fields) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "validation", fields }, { status: 422 });
  }
  const lead = parsed.data;
  if (Date.now() - lead.startedAt < MIN_FILL_MS) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CORPORATE_LEADS_TO;
  if (!apiKey || !to) {
    console.error("CORPORATE_LEAD_NOT_CONFIGURED", { hasKey: !!apiKey, hasTo: !!to });
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CORPORATE_LEADS_FROM || process.env.RESEND_FROM || "Lilia Dubița <noreply@liliadubita.md>",
      to: to.split(",").map((s) => s.trim()),
      reply_to: lead.email,
      subject: `Discuție inițială: ${lead.company}`,
      html: emailHtml(lead),
    }),
  });
  if (!res.ok) {
    console.error("CORPORATE_LEAD_SEND_FAILED", { status: res.status, body: await res.text() });
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  console.log("CORPORATE_LEAD_SENT", { company: lead.company });
  return NextResponse.json({ ok: true });
}

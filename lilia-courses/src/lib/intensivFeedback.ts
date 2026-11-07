import fs from 'fs';
import { createHmac, timingSafeEqual } from 'crypto';
import path from 'path';

/**
 * Feedback după intensiv (/intensiv/feedback). Cine răspunde primește pe email
 * caietul bonus, `private/caiet-bonus.pdf`. Doar participanții plătiți primesc bonusul.
 */
export const FEEDBACK = {
  bonusFile: 'caiet-bonus.pdf',
  bonusFilename: 'Mai aproape de tine - Ghid practic - Lilia Dubita.pdf',
  pageUrl: 'https://www.liliadubita.md/intensiv/feedback',
  from: () => process.env.CREDENTIALS_EMAIL_FROM || process.env.RESEND_FROM || 'Lilia Dubița <noreply@liliadubita.md>',
  replyTo: 'danexprim@liliadubita.md',
};

const wrap = (inner: string) => `<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;background:#f3f2ef;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#1f2b33;">
  <div style="background:#ffffff;padding:28px 24px;">${inner}</div>
  <p style="margin:16px 0 0;font-size:12px;color:#5b646c;text-align:center;">Ai primit acest email pentru că ai participat la intensivul „Am un plan pentru viața mea”. Întrebări: danexprim@liliadubita.md · 067 102 290</p>
</div></body></html>`;

/** Emailul cu bonusul, trimis după ce cineva completează formularul. */
export const BONUS_EMAIL = {
  subject: 'Mulțumesc pentru feedback! Ghidul „Mai aproape de tine” e atașat',
  html: (firstName: string) =>
    wrap(`
    <p style="margin:0 0 16px;">${firstName ? `Bună, ${escapeHtml(firstName)}!` : 'Bună!'}</p>
    <p style="margin:0 0 16px;">Îți mulțumesc că ai găsit timp să-mi scrii cum a fost la intensiv. Citesc fiecare răspuns și mă ajută mult.</p>
    <p style="margin:0 0 16px;">📒 Așa cum am promis, îți trimit <strong>ghidul practic „Mai aproape de tine”</strong>, atașat la acest email. Am adunat în el exercițiile mele preferate pentru cunoașterea de sine și creșterea iubirii de sine. Îl poți printa sau completa pe ecran, cum îți e mai comod.</p>
    <p style="margin:0;">Cu drag,<br>Lilia Dubița</p>`),
};

/** Emailul care îi invită pe participanți să completeze formularul. */
export const INVITE_EMAIL = {
  key: 'intensiv-feedback-invite-1',
  subject: '4 întrebări despre intensiv și un cadou pentru tine',
  html: wrap(`
    <p style="margin:0 0 16px;">Bună!</p>
    <p style="margin:0 0 16px;">Îți mulțumesc că ai fost alături de mine la intensivul „Am un plan pentru viața mea”.</p>
    <p style="margin:0 0 20px;">Aș vrea să aflu cum a fost pentru tine. Sunt doar <strong>4 întrebări</strong>, durează cam 3 minute. Ca mulțumire, după ce răspunzi îți trimit pe email <strong>ghidul practic „Mai aproape de tine”</strong>, cu exercițiile mele preferate pentru creșterea iubirii de sine.</p>
    <p style="margin:0 0 20px;">
      <a href="${FEEDBACK.pageUrl}" style="display:inline-block;background:#0d6b75;color:#ffffff;text-decoration:none;font-weight:bold;font-size:18px;padding:14px 28px;">Răspunde la 4 întrebări</a>
    </p>
    <p style="margin:0 0 16px;font-size:14px;">Folosește adresa de email cu care te-ai înscris, ca ghidul să ajungă la tine.</p>
    <p style="margin:0;">Cu drag,<br>Lilia Dubița</p>`),
};

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Linkul de descărcare a ghidului, semnat pentru un email (doar cine a răspuns îl primește). */
function sign(email: string) {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev').update(`feedback-bonus:${email}`).digest('base64url');
}
export function bonusToken(email: string) {
  return `${Buffer.from(email).toString('base64url')}.${sign(email)}`;
}
/** Întoarce emailul dacă tokenul e valid, altfel null. */
export function verifyBonusToken(token: string): string | null {
  const [e, sig] = token.split('.');
  if (!e || !sig) return null;
  const email = Buffer.from(e, 'base64url').toString();
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(email));
  return a.length === b.length && timingSafeEqual(a, b) ? email : null;
}

export function bonusPdf(): Buffer | null {
  for (const p of [
    path.join(process.cwd(), 'private', FEEDBACK.bonusFile),
    path.join(process.cwd(), 'lilia-courses', 'private', FEEDBACK.bonusFile),
  ]) {
    try {
      return fs.readFileSync(p);
    } catch {
      // try next location
    }
  }
  return null;
}

function bonusAttachment(): { filename: string; content: string } | null {
  const pdf = bonusPdf();
  return pdf ? { filename: FEEDBACK.bonusFilename, content: pdf.toString('base64') } : null;
}

async function resend(body: object, idempotencyKey: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY not set' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({ from: FEEDBACK.from(), reply_to: FEEDBACK.replyTo, ...body }),
    });
    if (!res.ok) return { ok: false, error: `${res.status} ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/** Trimite caietul bonus. Nu aruncă. */
export async function sendBonus(to: string, firstName: string) {
  const attachment = bonusAttachment();
  if (!attachment) return { ok: false, error: 'bonus PDF missing' };
  return resend(
    { to, subject: BONUS_EMAIL.subject, html: BONUS_EMAIL.html(firstName), attachments: [attachment] },
    `intensiv-feedback-bonus/${to.toLowerCase()}`,
  );
}

/** Înregistrările intensivului: fiecare parte are linkul și codul ei. */
export const RECORDINGS = [
  {
    label: 'Partea 1',
    time: '10:00–12:00',
    url: 'https://us06web.zoom.us/rec/share/I90aau4wL8AatiFn_D9XEPhWpV_6Sbu5GrVCG_0dml1f-x5CBne6BC88Sockor_t.WQ0gJr9nelKI-T2w',
    code: '0+vY6%Hp',
  },
  {
    label: 'Partea 2',
    time: '13:00–16:00',
    url: 'https://us06web.zoom.us/rec/share/IRKG2Q8TxG2rJmKzUn_T1RqFwih_rwc2vt5VImz9P1nslJDBVdnueDY0O24YavL1.a8PEMSD7TQ361xyo',
    code: '9F?i9Jf$',
  },
];

const recordingBox = (r: (typeof RECORDINGS)[number]) => `
    <div style="background:#e1e9ea;padding:20px;margin:0 0 12px;">
      <p style="margin:0 0 12px;font-size:18px;"><strong>${r.label}</strong> <span style="color:#5b646c;font-size:15px;">(${r.time})</span></p>
      <p style="margin:0 0 14px;">
        <a href="${r.url}" style="display:inline-block;background:#0d6b75;color:#ffffff;text-decoration:none;font-weight:bold;font-size:17px;padding:12px 24px;">Deschide ${r.label.toLowerCase()}</a>
      </p>
      <p style="margin:0;">Codul pentru ${r.label.toLowerCase()}: <span style="display:inline-block;background:#ffffff;padding:4px 10px;font-family:'Courier New',Courier,monospace;font-size:20px;font-weight:bold;letter-spacing:1px;">${escapeHtml(r.code)}</span></p>
    </div>`;

/** Emailul de după intensiv: cele două înregistrări (cu coduri) + linkul la feedback. */
export const RECORDINGS_EMAIL = {
  key: 'intensiv-recordings-1',
  subject: 'Înregistrarea intensivului „Am un plan pentru viața mea”',
  html: wrap(`
    <p style="margin:0 0 16px;">Bună!</p>
    <p style="margin:0 0 16px;">Îți mulțumesc că ai fost alături de mine la intensivul „Am un plan pentru viața mea”. Așa cum am promis, îți trimit înregistrarea. E împărțită în <strong>două părți</strong>.</p>
    <p style="margin:0 0 20px;padding:14px 16px;border-left:4px solid #0d6b75;background:#f3f2ef;"><strong>Important: accesul este cu cod, iar fiecare parte are codul ei.</strong> Când deschizi linkul, Zoom îți cere codul. Copiază-l exact, cu tot cu semne și litere mari sau mici.</p>
    ${RECORDINGS.map(recordingBox).join('')}
    <p style="margin:24px 0 12px;"><strong>Și o rugăminte:</strong> spune-mi cum a fost pentru tine. Sunt doar 4 întrebări, durează cam 3 minute. Ca mulțumire, primești cadou <strong>ghidul practic „Mai aproape de tine”</strong>, cu exercițiile mele preferate pentru creșterea iubirii de sine.</p>
    <p style="margin:0 0 12px;">
      <a href="${FEEDBACK.pageUrl}" style="display:inline-block;background:#1f2b33;color:#ffffff;text-decoration:none;font-weight:bold;font-size:17px;padding:12px 24px;">Răspunde și primește ghidul</a>
    </p>
    <p style="margin:0 0 20px;font-size:14px;">Folosește adresa de email cu care te-ai înscris, ca ghidul să ajungă la tine.</p>
    <p style="margin:0;">Cu drag,<br>Lilia Dubița</p>`),
};

/** Trimite emailul cu înregistrările unei adrese. Nu aruncă. */
export async function sendRecordings(to: string) {
  return resend({ to, subject: RECORDINGS_EMAIL.subject, html: RECORDINGS_EMAIL.html }, `${RECORDINGS_EMAIL.key}/${to.toLowerCase()}`);
}

/** Trimite invitația la feedback unei adrese. Nu aruncă. */
export async function sendInvite(to: string) {
  return resend({ to, subject: INVITE_EMAIL.subject, html: INVITE_EMAIL.html }, `${INVITE_EMAIL.key}/${to.toLowerCase()}`);
}

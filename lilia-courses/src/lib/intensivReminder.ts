import fs from 'fs';
import path from 'path';

/**
 * Reminderul trimis participanților cu o zi înainte de intensiv (7 noiembrie).
 * Punctul central: noul link de Zoom. Caietul de lucru e atașat.
 */
export const REMINDER = {
  /** Cheie stabilă: Resend nu trimite de două ori același reminder aceleiași adrese (24 h). */
  key: 'intensiv-reminder-7nov-azi',
  subject: 'Linkul de Zoom pentru astăzi s-a schimbat',
  html: `<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;background:#f3f2ef;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#1f2b33;">
  <div style="background:#ffffff;padding:28px 24px;">
    <p style="margin:0 0 16px;">Bună!</p>
    <p style="margin:0 0 20px;">Astăzi, <strong>sâmbătă, 7 noiembrie, la 10:00</strong>, ne vedem la intensivul „Am un plan pentru viața mea”.</p>

    <div style="background:#e1e9ea;padding:20px;margin:0 0 20px;">
      <p style="margin:0 0 12px;font-size:18px;"><strong>Important: linkul de Zoom s-a schimbat.</strong> Intră astăzi pe acesta:</p>
      <p style="margin:0 0 12px;">
        <a href="https://us06web.zoom.us/j/4115981166?pwd=nbw3LzzQW1rkiwaK5Y8SG5tczaGVza.1" style="display:inline-block;background:#0d6b75;color:#ffffff;text-decoration:none;font-weight:bold;font-size:18px;padding:14px 28px;">Intră pe Zoom</a>
      </p>
      <p style="margin:0 0 10px;font-size:13px;word-break:break-all;"><a href="https://us06web.zoom.us/j/4115981166?pwd=nbw3LzzQW1rkiwaK5Y8SG5tczaGVza.1" style="color:#0d6b75;">https://us06web.zoom.us/j/4115981166?pwd=nbw3LzzQW1rkiwaK5Y8SG5tczaGVza.1</a></p>
      <p style="margin:0;font-size:14px;">Linkul din emailul de confirmare <strong>nu mai e valabil</strong>. Îl publicăm și în grupul de Telegram la 09:30.</p>
    </div>

    <p style="margin:0 0 12px;">Ca să folosim timpul la maximum:</p>
    <p style="margin:0 0 12px;">📒 <strong>Caietul de lucru, printat.</strong> E atașat la acest email. Te rog să-l imprimi, vom lucra direct în el. Ia și un pix.</p>
    <p style="margin:0 0 12px;">💻 <strong>Zoom.</strong> Verifică înainte de 10:00 că îl ai instalat.</p>
    <p style="margin:0 0 4px;">⏰ <strong>Programul:</strong></p>
    <p style="margin:0 0 16px;">10:00–12:00 · prima parte<br>12:00–13:00 · pauză<br>13:00–16:00 · a doua parte</p>
    <p style="margin:0 0 16px;">Va fi interactiv: teorie, exerciții, discuții și întrebări. Dacă nu poți participa live, intensivul va fi înregistrat, iar înregistrarea va apărea în <a href="https://t.me/+bOjSEN9TGAEyYTVi" style="color:#0d6b75;">grupul de Telegram</a>.</p>
    <p style="margin:0;">Abia aștept să ne vedem! ❤️<br>Lilia Dubița</p>
  </div>
  <p style="margin:16px 0 0;font-size:12px;color:#5b646c;text-align:center;">Ai primit acest email pentru că te-ai înscris la intensivul „Am un plan pentru viața mea”. Întrebări: danexprim@liliadubita.md · 067 102 290</p>
</div>
</body></html>`,
};

function workbook(): { filename: string; content: string } | null {
  for (const p of [
    path.join(process.cwd(), 'private', 'caiet-intensiv.pdf'),
    path.join(process.cwd(), 'lilia-courses', 'private', 'caiet-intensiv.pdf'),
  ]) {
    try {
      return { filename: 'Caiet de lucru - Am un plan pentru viata mea.pdf', content: fs.readFileSync(p).toString('base64') };
    } catch {
      // try next location
    }
  }
  return null;
}

/** Trimite reminderul unei singure adrese. Nu aruncă; întoarce rezultatul. */
export async function sendReminder(to: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY not set' };
  const attachment = workbook();
  if (!attachment) return { ok: false, error: 'workbook PDF missing' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `${REMINDER.key}/${to.toLowerCase()}`,
      },
      body: JSON.stringify({
        from: process.env.CREDENTIALS_EMAIL_FROM || process.env.RESEND_FROM || 'Lilia Dubița <noreply@liliadubita.md>',
        to,
        reply_to: 'danexprim@liliadubita.md',
        subject: REMINDER.subject,
        html: REMINDER.html,
        attachments: [attachment],
      }),
    });
    if (!res.ok) return { ok: false, error: `${res.status} ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

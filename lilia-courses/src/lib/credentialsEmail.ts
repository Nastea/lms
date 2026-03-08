/**
 * Sends "credentials" email after payment: login link, email, temporary password,
 * and optional "change password" link. Uses Resend.
 * Requires RESEND_API_KEY and CREDENTIALS_EMAIL_FROM (e.g. "Lilia Dubița Cursuri <cursuri@liliadubita.md>").
 */

import { randomBytes } from 'crypto';

const PASSWORD_CHARS = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Generates a random password (e.g. 12 chars) for new users. */
export function generateTemporaryPassword(length = 12): string {
  const bytes = randomBytes(length);
  let s = '';
  for (let i = 0; i < length; i++) s += PASSWORD_CHARS[bytes[i]! % PASSWORD_CHARS.length];
  return s;
}

function getFrom(): string {
  return process.env.CREDENTIALS_EMAIL_FROM || 'Lilia Dubița Cursuri <cursuri@liliadubita.md>';
}

function getLoginUrl(): string {
  const base = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.liliadubita.md').replace(/\/$/, '');
  return `${base}/login`;
}

export type CredentialsEmailParams = {
  to: string;
  /** Temporary password (only for new users) */
  temporaryPassword?: string;
  /** Link to set new password (recovery link). If not provided, we still send login + password. */
  changePasswordLink?: string;
};

export async function sendCredentialsEmail(params: CredentialsEmailParams): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY not set' };
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);
  const loginUrl = getLoginUrl();

  const hasPassword = !!params.temporaryPassword;
  const hasChangeLink = !!params.changePasswordLink;

  const subject = hasPassword
    ? 'Acces la cursul RELAȚIA 360 – date de autentificare'
    : 'Acces la cursul RELAȚIA 360 – resetează parola';

  const body = hasPassword
    ? `
<p>Bună ziua,</p>
<p>Ai achiziționat accesul la cursul <strong>De la conflict la conectare</strong> (RELAȚIA 360).</p>
<p><strong>Date de autentificare:</strong></p>
<ul>
  <li><strong>Link:</strong> <a href="${loginUrl}">${loginUrl}</a></li>
  <li><strong>Email:</strong> ${params.to}</li>
  <li><strong>Parolă temporară:</strong> ${params.temporaryPassword}</li>
</ul>
<p>Te rugăm să te autentifici și, dacă dorești, să îți schimbi parola (link mai jos).</p>
${hasChangeLink ? `<p><a href="${params.changePasswordLink}">Schimbă parola</a></p>` : ''}
<p>Dacă nu ai făcut tu această înscriere, poți ignora acest email.</p>
<p>Cu drag,<br>Echipa Lilia Dubița</p>
`.trim()
    : `
<p>Bună ziua,</p>
<p>Ai achiziționat accesul la cursul <strong>De la conflict la conectare</strong> (RELAȚIA 360). Ai deja un cont.</p>
<p>Poți reseta parola aici pentru a te autentifica:</p>
${hasChangeLink ? `<p><a href="${params.changePasswordLink}">Resetează parola</a></p>` : `<p><a href="${loginUrl}">${loginUrl}</a> – folosește „Ai uitat parola?”</p>`}
<p>Cu drag,<br>Echipa Lilia Dubița</p>
`.trim();

  const { data, error } = await resend.emails.send({
    from: getFrom(),
    to: params.to,
    subject,
    html: body,
  });

  if (error) {
    console.error('Resend send error:', error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

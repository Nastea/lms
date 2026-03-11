/**
 * Post-payment email: Telegram bot link + support fallback. No signup/login/password.
 * Uses Resend. Requires RESEND_API_KEY.
 *
 * To send to real customer emails you must verify your domain in Resend (Domains).
 * Until then, use CREDENTIALS_EMAIL_FROM unset to send from Resend's address (may have limits).
 */

function getFrom(): string {
  // Custom from (requires verified domain in Resend). Fallback: Resend's address so API accepts the request.
  return (
    process.env.CREDENTIALS_EMAIL_FROM ||
    process.env.RESEND_FROM ||
    'Lilia Dubița Cursuri <onboarding@resend.dev>'
  );
}

function getSupportUrl(): string {
  const url = process.env.SUPPORT_URL || process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/$/, '');
  return 'https://www.liliadubita.md';
}

export type PostPaymentEmailParams = {
  to: string;
  telegramDeepLink: string;
  /** Optional; defaults to SUPPORT_URL or site URL */
  supportUrl?: string;
};

export async function sendPostPaymentTelegramEmail(
  params: PostPaymentEmailParams,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY not set' };
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);
  const supportUrl = params.supportUrl ?? getSupportUrl();

  const subject = 'Acces la cursul RELAȚIA 360 – deschide în Telegram';

  const html = `
<p>Bună ziua,</p>
<p>Ai achiziționat accesul la cursul <strong>De la conflict la conectare</strong> (RELAȚIA 360).</p>
<p>Deschide linkul de mai jos în Telegram pentru a primi accesul la lecții:</p>
<p><a href="${params.telegramDeepLink}" style="font-weight:600;">Deschide în Telegram</a></p>
<p>Link: ${params.telegramDeepLink}</p>
<p>Întrebări sau probleme? Contactează-ne: <a href="${supportUrl}">${supportUrl}</a></p>
<p>Cu drag,<br>Echipa Lilia Dubița</p>
`.trim();

  const from = getFrom();
  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject,
    html,
  });

  if (error) {
    const errMsg = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message?: string }).message
      : String(error);
    console.error('Post-payment email FAILED:', {
      to: params.to,
      from,
      error: errMsg,
      full: error,
    });
    return { ok: false, error: errMsg };
  }
  console.log('Post-payment email sent:', { to: params.to, id: data?.id });
  return { ok: true };
}

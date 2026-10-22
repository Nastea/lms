import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { INTENSIV } from '@/lib/intensiv';

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function emailHtml(firstName: string): string {
  const zoom = INTENSIV.zoomUrl
    ? `<p><strong>2. Păstrează linkul de Zoom</strong><br><a href="${INTENSIV.zoomUrl}">${INTENSIV.zoomUrl}</a></p>`
    : '<p><strong>2. Linkul de Zoom</strong><br>Îl publicăm în grupul participanților înainte de intensiv.</p>';
  return `
<p>Bună${firstName ? `, ${escapeHtml(firstName)}` : ''}!</p>
<p>Plata a fost confirmată și ești înscris la intensivul <strong>„Am un plan pentru viața mea"</strong>.</p>
<p><strong>Când:</strong> ${INTENSIV.dateText}, ${INTENSIV.timeText}<br><strong>Unde:</strong> online, pe Zoom</p>
<p><strong>1. Intră în grupul de Telegram al participanților</strong><br>
Acolo primești caietul de lucru, anunțurile și reminder-ele.<br>
<a href="${INTENSIV.telegramGroupUrl}">${INTENSIV.telegramGroupUrl}</a></p>
${zoom}
<p>Ai întrebări? Scrie-ne la <a href="mailto:danexprim@liliadubita.md">danexprim@liliadubita.md</a> sau sună la 067 102 290.</p>
<p>Cu drag,<br>Lilia Dubița</p>
`.trim();
}

/**
 * Trimite emailul de confirmare pentru o comandă plătită a intensivului.
 * Idempotent: cheia `paid-email/<id>` (aceeași cheie ca în relatia-360-landing) la Resend + `invite_sent_at` pe comandă.
 * Nu aruncă niciodată — o eroare de email nu strică plata.
 */
export async function sendIntensivPaidEmail(orderId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, status, product_id, customer_email, customer_name, invite_sent_at')
      .eq('id', orderId)
      .single();
    if (error || !order) return { ok: false, error: 'order not found' };
    if (order.product_id !== INTENSIV.productId || order.status !== 'paid') return { ok: false, error: 'not a paid intensive order' };
    if (order.invite_sent_at) return { ok: true };
    const to = (order.customer_email || '').trim();
    if (!to) return { ok: false, error: 'no customer email' };

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return { ok: false, error: 'RESEND_API_KEY not set' };

    const firstName = (order.customer_name || '').trim().split(/\s+/)[0] || '';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `paid-email/${order.id}`,
      },
      body: JSON.stringify({
        from:
          process.env.CREDENTIALS_EMAIL_FROM ||
          process.env.RESEND_FROM ||
          'Lilia Dubița <noreply@liliadubita.md>',
        to,
        subject: 'Ești înscris la intensivul „Am un plan pentru viața mea"',
        html: emailHtml(firstName),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('INTENSIV_EMAIL_FAILED', { orderId, status: res.status, body });
      return { ok: false, error: body };
    }
    await supabaseAdmin.from('orders').update({ invite_sent_at: new Date().toISOString() }).eq('id', order.id);
    console.log('INTENSIV_EMAIL_SENT', { orderId });
    return { ok: true };
  } catch (e) {
    console.error('INTENSIV_EMAIL_ERROR', { orderId, e });
    return { ok: false, error: String(e) };
  }
}

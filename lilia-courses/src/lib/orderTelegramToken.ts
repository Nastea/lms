import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { generateTelegramAccessToken } from '@/lib/telegramAccessToken';

/**
 * When an order is marked paid, ensure it has a telegram_access_token.
 * Idempotent: if token already set, does nothing. Call from:
 * - Paynet callback (on Paid)
 * - confirm-test (markOrderPaid)
 * - RunPay webhook (on Settled)
 * - /api/orders/access (when returning token for thank-you page)
 * Also inserts into telegram_access_tokens for SmartSender POST /api/verify-telegram-access.
 */
export async function ensureOrderHasTelegramToken(orderId: string): Promise<{
  ok: boolean;
  token?: string;
  error?: string;
}> {
  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('id, status, telegram_access_token')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) {
    return { ok: false, error: 'Order not found' };
  }

  if (order.status !== 'paid') {
    return { ok: false, error: 'Order not paid' };
  }

  if (order.telegram_access_token) {
    return { ok: true, token: order.telegram_access_token };
  }

  const token = generateTelegramAccessToken();
  const now = new Date().toISOString();

  const { error: updateError } = await supabaseAdmin
    .from('orders')
    .update({
      telegram_access_token: token,
      telegram_access_token_created_at: now,
      updated_at: now,
    })
    .eq('id', orderId)
    .is('telegram_access_token', null); // only set if still null (race-safe)

  if (updateError) {
    const { data: updated } = await supabaseAdmin
      .from('orders')
      .select('telegram_access_token')
      .eq('id', orderId)
      .single();
    if (updated?.telegram_access_token) {
      return { ok: true, token: updated.telegram_access_token };
    }
    return { ok: false, error: updateError.message };
  }

  // DEPRECATED: SmartSender no longer uses telegram_access_tokens; onboarding via deep link only.
  // const email = (order as { customer_email?: string | null }).customer_email?.trim();
  // const productId = (order as { product_id?: string }).product_id;
  // if (email && productId) {
  //   const expiresAt = new Date();
  //   expiresAt.setDate(expiresAt.getDate() + TELEGRAM_TOKEN_VALIDITY_DAYS);
  //   const { error: insertErr } = await supabaseAdmin.from('telegram_access_tokens').insert({ ... });
  // }

  return { ok: true, token };
}

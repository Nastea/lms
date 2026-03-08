import { NextResponse } from 'next/server';

const LOG_PREFIX = '[verify-telegram-access]';

/**
 * @deprecated Telegram token verification removed. SmartSender now uses deep links
 * (PAID_CONFLICT, SOURCE_PAYMENT_PAGE, TG_PAID_ONBOARDING_SUCCESS). This endpoint
 * is disabled: always returns access_granted: "false". Do not delete yet.
 */
export async function POST(req: Request) {
  console.warn(LOG_PREFIX, 'DEPRECATED: endpoint disabled; SmartSender uses deep links only');
  try {
    await req.json(); // consume body so request is valid
  } catch {
    // ignore parse errors
  }
  return NextResponse.json(
    { access_granted: 'false' },
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}

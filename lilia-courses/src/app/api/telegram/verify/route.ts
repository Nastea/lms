import { NextResponse } from 'next/server';
import {
  verifyAccessTokenAndBind,
  verifyResultToVerdict,
} from '@/lib/telegramVerify';

/**
 * GET /api/telegram/verify
 *
 * Query params:
 * - token: telegram_access_token (from thank-you page / email link)
 * - telegramUserId: Telegram numeric user ID
 * - username: optional Telegram username
 *
 * Returns (Smart Sender–friendly):
 * - valid, paid, used, product_id, access_granted
 * - ok, productId (success) or reason (failure)
 * Rate limit: 5 attempts per 10 min per user. Token: single-use (first bind).
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const telegramUserIdRaw = searchParams.get('telegramUserId');
    const username = searchParams.get('username');

    if (!token) {
      const verdict = verifyResultToVerdict({ ok: false, reason: 'BAD_FORMAT' });
      return NextResponse.json(
        { ok: false, reason: 'BAD_FORMAT', error: 'Missing token parameter', ...verdict },
        { status: 400 }
      );
    }

    if (!telegramUserIdRaw) {
      const verdict = verifyResultToVerdict({ ok: false, reason: 'BAD_FORMAT' });
      return NextResponse.json(
        {
          ok: false,
          reason: 'BAD_FORMAT',
          error: 'Missing telegramUserId parameter',
          ...verdict,
        },
        { status: 400 }
      );
    }

    const telegramUserId = Number(telegramUserIdRaw);
    if (!Number.isFinite(telegramUserId) || telegramUserId <= 0) {
      const verdict = verifyResultToVerdict({ ok: false, reason: 'BAD_FORMAT' });
      return NextResponse.json(
        {
          ok: false,
          reason: 'BAD_FORMAT',
          error: 'Invalid telegramUserId parameter',
          ...verdict,
        },
        { status: 400 }
      );
    }

    const result = await verifyAccessTokenAndBind({
      token,
      telegramUserId,
      username: username ?? null,
    });

    const verdict = verifyResultToVerdict(result);

    if (result.ok) {
      return NextResponse.json({
        ok: true,
        productId: result.productId,
        ...verdict,
      });
    }

    let status = 400;
    switch (result.reason) {
      case 'NOT_FOUND':
      case 'TOKEN_USED_BY_OTHER':
      case 'TOKEN_EXPIRED':
        status = 404;
        break;
      case 'NOT_PAID':
        status = 403;
        break;
      case 'BLOCKED':
      case 'RATE_LIMIT':
        status = 429;
        break;
      case 'INTERNAL_ERROR':
        status = 500;
        break;
      case 'BAD_FORMAT':
      default:
        status = 400;
        break;
    }

    return NextResponse.json(
      {
        ok: false,
        reason: result.reason,
        ...verdict,
      },
      { status }
    );
  } catch (error) {
    console.error('TELEGRAM_VERIFY_ROUTE_ERROR', String(error));
    const verdict = verifyResultToVerdict({ ok: false, reason: 'INTERNAL_ERROR' });
    return NextResponse.json(
      {
        ok: false,
        reason: 'INTERNAL_ERROR',
        error: 'Internal server error',
        ...verdict,
      },
      { status: 500 }
    );
  }
}


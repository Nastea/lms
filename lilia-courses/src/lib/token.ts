import { createHash } from 'crypto';

/**
 * Checks if a string looks like a plausible Telegram token.
 * Supports: tg_<alphanumeric> (e.g. tg_a82ks91) or legacy URL-safe tokens.
 */
export function isLikelyToken(text: string): boolean {
  const candidate = text.trim();
  if (candidate.startsWith('tg_')) {
    return /^tg_[a-z0-9]{8,32}$/.test(candidate);
  }
  return /^[A-Za-z0-9_-]{24,128}$/.test(candidate);
}

/**
 * Extract token from a Telegram message text.
 * @deprecated Telegram token verification removed; SmartSender uses deep links only. Kept for reference.
 * Supports: "/start tg_xxxxx", "/start access_<token>", plain token.
 */
export function extractTokenFromText(text: string): string | null {
  const trimmed = text.trim();

  if (trimmed.startsWith('/start')) {
    const parts = trimmed.split(/\s+/);
    if (parts.length > 1) {
      const payload = parts[1];
      if (payload.startsWith('tg_')) return isLikelyToken(payload) ? payload : null;
      if (payload.startsWith('access_')) {
        const token = payload.slice('access_'.length);
        return isLikelyToken(token) ? token : null;
      }
    }
    return null;
  }

  return isLikelyToken(trimmed) ? trimmed : null;
}

/**
 * Returns a SHA-256 hash of the token (hex-encoded).
 * Used instead of storing raw tokens where possible.
 */
export function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}



import { randomBytes } from 'crypto';

const PREFIX = 'tg_';
/** Length of random part after tg_ (alphanumeric lowercase) */
const RANDOM_LENGTH = 14;

/**
 * Generates a secure random token for Telegram deep link.
 * Format: tg_<random> (e.g. tg_a82ks91, tg_4kds82jss) so Smart Sender can detect it.
 * Single-use, bound to order; link: https://t.me/<bot>?start=tg_xxxxx
 */
export function generateTelegramAccessToken(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = randomBytes(RANDOM_LENGTH);
  let suffix = '';
  for (let i = 0; i < RANDOM_LENGTH; i++) suffix += chars[bytes[i]! % chars.length];
  return PREFIX + suffix;
}

/** Token valid for 90 days from creation (if not yet used). */
export const TELEGRAM_TOKEN_VALIDITY_DAYS = 90;

export function isTelegramTokenExpired(createdAt: string | null): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const expiry = new Date(created);
  expiry.setDate(expiry.getDate() + TELEGRAM_TOKEN_VALIDITY_DAYS);
  return new Date() > expiry;
}

/**
 * Link Telegram pentru lista de așteptare / lansare.
 * Setează în `.env` / Vercel: NEXT_PUBLIC_WAITLIST_BOT_URL=https://t.me/...?start=...
 */
export const WAITLIST_BOT_URL =
  process.env.NEXT_PUBLIC_WAITLIST_BOT_URL?.trim() ||
  "https://t.me/liliadubita_bot?start=ZGw6MzIxMDk0";

/** URL public către lecția gratuită (pentru copy în bot / docs). */
export const FREE_LESSON_PAGE_URL =
  process.env.NEXT_PUBLIC_FREE_LESSON_URL?.trim() ||
  "https://www.liliadubita.md/curs/lectia-0";

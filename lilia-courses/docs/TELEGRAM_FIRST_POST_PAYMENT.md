# Flow post-plată Telegram-first

După refactorizare, flow-ul nu mai creează cont (signup/invite) și este centrat pe Telegram / Smart Sender.

## Flux

1. Utilizatorul introduce email și ajunge la checkout (Paynet sau alt provider).
2. După confirmarea plății, backend-ul marchează comanda ca `paid`.
3. Backend-ul generează un **telegram_access_token** unic, random (32 bytes, base64url), salvat în `orders.telegram_access_token`.
4. Pe pagina de thank-you (/multumim) se afișează un buton mare către botul Telegram. Toate tokenurile încep cu prefixul **tg_** (ex.: tg_a82ks91, tg_rel360_239xx) ca Smart Sender să le detecteze ușor. Link: `https://t.me/liliadubita_bot?start=tg_xxxxx` (numele botului se configurează prin TELEGRAM_BOT_USERNAME).
5. Smart Sender (sau botul) face request la backend pentru validare: `GET /api/telegram/verify?token=...&telegramUserId=...&username=...`.
6. Backend răspunde cu verdict: `valid`, `paid`, `used`, `product_id`, `access_granted`.
7. Dacă tokenul este valid și plata confirmată: backend marchează tokenul ca utilizat (leagă de `telegram_user_id`), scrie în `telegram_access`, returnează succes.
8. Emailul post-plată conține doar link către Telegram + fallback suport (fără link signup/parolă).

## Schema DB

- **orders**: coloane noi (migrare `supabase-telegram-access-token.sql`):
  - `telegram_access_token` TEXT UNIQUE NULL – generat la confirmarea plății
  - `telegram_access_token_created_at` TIMESTAMPTZ NULL – pentru expirare (ex. 90 zile)
- Comportament: token single-use (primul utilizator care îl validează se leagă de contul Telegram).

## Endpoint-uri

| Endpoint | Rol |
|----------|-----|
| `GET /api/orders/access?order=<uuid>` | Returnează `access_token` (telegram token) doar pentru comenzi plătite. Folosit de thank-you pentru linkul Telegram. |
| `GET /api/telegram/verify?token=...&telegramUserId=...&username=...` | Validare token din Telegram/Smart Sender. Răspuns: `ok`, `valid`, `paid`, `used`, `product_id`, `access_granted`, `reason`. |
| `POST /api/orders/send-telegram-email` | Body: `{ orderId }`. Trimite email cu link Telegram + suport. Idempotent (invite_sent_at). |

## Securitate

- Token: 32 bytes random, base64url.
- Expirare: opțional 90 zile de la `telegram_access_token_created_at` (în `telegramVerify`).
- Single-use: primul bind câștigă; al doilea utilizator primește `TOKEN_USED_BY_OTHER`.
- Rate limit: 5 încercări / 10 min / telegram_user_id (telegram_token_attempts).
- Audit: înregistrări în `telegram_token_attempts` (success, reason).

## Smart Sender

Backend-ul este sursa de adevăr pentru: payment status, validitatea tokenului, drepturile de acces.  
Răspuns verify conține: `valid`, `paid`, `used`, `product_id`, `access_granted`.  
Dacă `access_granted === true`, Smart Sender poate continua onboarding-ul și livrarea lecțiilor.

## Ce nu mai există în acest flow

- Creare user + parolă după plată.
- Link signup / reset parolă în emailul post-plată.
- Apeluri către `send-invite` (invitație LMS) din thank-you.

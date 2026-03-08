# POST /api/verify-telegram-access (SmartSender)

Endpoint folosit de SmartSender când un utilizator deschide botul Telegram cu un token.

## Request

- **Method:** POST  
- **URL:** `https://liliadubita.md/api/verify-telegram-access`  
- **Content-Type:** application/json  

**Body example:**

```json
{
  "access_token": "/start tg_abc123",
  "platform": "telegram"
}
```

Câmpul `access_token` poate fi:
- `"/start tg_abc123"` → server extrage `tg_abc123`
- `"tg_abc123"` → folosit ca atare

## Response (mereu HTTP 200, JSON)

**Success (token valid, nefolosit, neexpirat):**

```json
{
  "access_granted": "true",
  "product_id": "conflict_course",
  "email": "user@email.com"
}
```

**Failure (token invalid / expirat / deja folosit):**

```json
{
  "access_granted": "false"
}
```

Numele câmpurilor (`access_granted`, `product_id`, `email`) sunt fixe pentru maparea în variabile SmartSender.

## Tabel: telegram_access_tokens

Rulezi migrarea în Supabase → SQL Editor:

- Fișier: `supabase-telegram-access-tokens-table.sql`

Structură: `id`, `token` (UNIQUE), `product_id`, `email`, `used`, `expires_at`, `created_at`.

Tabelul se completează automat când se generează un token pentru o comandă plătită (din Paynet callback, confirm-test, RunPay webhook etc.). Pentru comenzi plătite trebuie să existe `customer_email` și `product_id` pe order.

## Deploy

1. Rulezi SQL-ul pentru `telegram_access_tokens` în Supabase.
2. Faci deploy la aplicația Next.js (Vercel sau alt host).
3. În SmartSender configurezi Webhook / Request la:
   - URL: `https://liliadubita.md/api/verify-telegram-access`
   - Method: POST  
   - Body JSON: `{ "access_token": "<token_from_start>", "platform": "telegram" }`
4. Mapezi răspunsul: `access_granted`, `product_id`, `email`.

## Logging

- Token primit (prezență + valoare curățată truncată).
- Token lipsă/invalid.
- Token negăsit sau expirat sau deja folosit.
- Succes: „Telegram access granted for token tg_xxxx” + product_id, email.

---

## Test cu curl

**Token cu prefix `/start` (cum trimite SmartSender):**

```bash
curl -s -X POST https://liliadubita.md/api/verify-telegram-access \
  -H "Content-Type: application/json" \
  -d '{"access_token": "/start tg_9sdf82", "platform": "telegram"}'
```

**Doar token (fără `/start`):**

```bash
curl -s -X POST https://liliadubita.md/api/verify-telegram-access \
  -H "Content-Type: application/json" \
  -d '{"access_token": "tg_9sdf82", "platform": "telegram"}'
```

**Token invalid (răspuns așteptat: access_granted false):**

```bash
curl -s -X POST https://liliadubita.md/api/verify-telegram-access \
  -H "Content-Type: application/json" \
  -d '{"access_token": "tg_invalid123", "platform": "telegram"}'
```

**Local (dev):**

```bash
curl -s -X POST http://localhost:3000/api/verify-telegram-access \
  -H "Content-Type: application/json" \
  -d '{"access_token": "/start tg_abc123", "platform": "telegram"}'
```

Răspuns așteptat la succes: `{"access_granted":"true","product_id":"...","email":"..."}`.  
La eșec: `{"access_granted":"false"}`.

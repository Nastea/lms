# Plan implementare: Funnel cu bot înainte de plată

Scop: **toate căile către plată să treacă prin bot** (Telegram / SmartSender). Pe platformă nu mai punem link direct la `/plata` din landing sau din lecția gratuită — punem link către bot; botul oferă apoi butonul de checkout.

---

## Principiu

- **Înainte:** Landing / Lecție gratuită → buton → `/plata` (direct).
- **După:** Landing / Lecție gratuită → buton → **bot** → bot oferă checkout → utilizatorul ajunge la `/plata` (din bot).

Platforma păstrează pagina `/plata` și flow-ul de callback + email după plată; doar **sursele de trafic** către plată se schimbă (toate prin bot).

---

## 1. Configurare: URL bot (obligatoriu)

Introducem o variabilă de mediu pentru link-ul către bot (Telegram sau SmartSender).

| Env var | Exemplu | Folosire |
|--------|---------|----------|
| `FUNNEL_BOT_URL` | `https://t.me/Relatia360Bot` sau link SmartSender | Toate CTA-urile „Cumpără” / „Finalizează plata” din site |

- Dacă `FUNNEL_BOT_URL` este setat → toate linkurile de cumpărare din listă mai jos merg la acest URL (deschid în tab nou unde e cazul).
- Dacă nu e setat → putem păstra fallback la `/plata` pentru compatibilitate (opțional) sau afișăm un mesaj „Contactează-ne pentru acces”.

**Fișier:**  
- Creare helper/constantă (ex. `src/lib/funnel.ts` sau în `src/app/api/config/route.ts`) care citește `process.env.FUNNEL_BOT_URL` și exportă URL-ul pentru bot (sau fallback).

---

## 2. Locuri de modificat pe platformă

Toate următoarele trebuie să pointeze la **URL bot** (din env), nu la `/plata`.

### 2.1 Landing – `/conflicte` (pagina principală)

| Locație | Ce e acum | Ce trebuie |
|--------|-----------|------------|
| Hero (mobile) – buton „Vreau acces la curs” | `href="/plata"` | `href={FUNNEL_BOT_URL}` (external) |
| Hero (desktop) – buton „Vreau acces la curs” | `href="/plata"` | `href={FUNNEL_BOT_URL}` |
| Secțiunea finală – „EȘTI GATA SĂ SCHIMBI…” – buton „Vreau cursul…” | `href="/plata"` | `href={FUNNEL_BOT_URL}` |

- Linkurile către bot: `target="_blank"` și `rel="noopener noreferrer"`.
- Textul butoanelor rămâne la fel; doar destinația se schimbă.

**Fișier:** `src/app/conflicte/page.tsx` (3 înlocuiri).

---

### 2.2 Lecția gratuită publică – `/curs/lectia-0`

| Locație | Ce e acum | Ce trebuie |
|--------|-----------|------------|
| CTA sub video – „Cumpără cursul →” | `href="/plata"` | `href={FUNNEL_BOT_URL}` (external) |

**Fișier:** `src/app/curs/lectia-0/page.tsx` (1 înlocuire).

---

### 2.3 Redirect `/inscriere`

| Ce e acum | Ce trebuie |
|-----------|------------|
| `redirect('/plata')` | Redirect la `FUNNEL_BOT_URL` (302). Dacă nu e setat, puteți păstra redirect la `/plata` sau la `/conflicte`. |

**Fișier:** `src/app/inscriere/page.tsx`.

---

### 2.4 Pagina de signup – `/signup`

| Locație | Ce e acum | Ce trebuie |
|--------|-----------|------------|
| Link „achiziționezi cursul” / „plata” | `href="/plata"` | `href={FUNNEL_BOT_URL}` (external), sau text explicativ „contactează-ne / mergi la bot”. |

**Fișier:** `src/app/signup/page.tsx`.

---

### 2.5 Paywall (lecții blocate în app)

| Componentă | Ce e acum | Ce trebuie |
|------------|-----------|------------|
| `PaywallBanner` | `paymentUrl = "/plata"` | `paymentUrl = FUNNEL_BOT_URL` (sau prop primit de la parent) |
| Apeluri la `PaywallBanner` | Implicit `/plata` | Transmit URL din env (sau helper) |

**Fișier:** `src/components/PaywallBanner.tsx` + pagina unde e folosit (ex. `src/app/app/lesson/[lessonId]/page.tsx`).

---

### 2.6 Sidebar lecții – lecții blocate

| Locație | Ce e acum | Ce trebuie |
|--------|-----------|------------|
| Lecții blocate (lacăt) – click duce la | `href="/plata"` | `href={FUNNEL_BOT_URL}` (external) |

**Fișier:** `src/components/LessonSidebar.tsx`.

---

### 2.7 CTA după prima lecție (în app, fără entitlement)

Dacă există bloc CTA „Finalizează plata pentru acces complet” pe pagina primei lecții (pentru user fără entitlement):

| Ce e acum | Ce trebuie |
|-----------|------------|
| Link la `/plata` | Link la `FUNNEL_BOT_URL` (external) |

**Fișier:** `src/app/app/lesson/[lessonId]/page.tsx` (dacă acel bloc există).

---

### 2.8 AuthErrorBanner (link invitație nouă)

| Locație | Ce e acum | Ce trebuie |
|--------|-----------|------------|
| „solicită o nouă invitație după plată” | `href="/plata"` | Opțional: `href={FUNNEL_BOT_URL}` sau păstrați `/plata` dacă vreți cumpărători existenți să poată re-plăti din site. |

**Fișier:** `src/components/AuthErrorBanner.tsx`.

---

## 3. Ce rămâne neschimbat

- **Pagina `/plata`** – rămâne; botul va trimite utilizatorii aici (ex. buton „Plătește pe site” în Telegram deja folosește `siteUrl/plata`).
- **Callback-ul de plată** – backend-ul primește notificarea, actualizează order, creează entitlement (LMS).
- **Email după plată** – flow-ul existent (invite Supabase + email cu link către platformă) rămâne.
- **Telegram webhook** – poate continua să ofere `url: ${siteUrl}/plata` pentru checkout.

---

## 4. Rezumat pași implementare

1. **Env**  
   - Adaugă în Vercel (și `.env.local`) variabila:  
     `FUNNEL_BOT_URL=https://t.me/Relatia360Bot` (sau URL SmartSender).

2. **Helper / config**  
   - Un singur loc care citește `FUNNEL_BOT_URL` și îl expune (ex. `getFunnelBotUrl()` sau din API config).  
   - Componentele și paginile îl folosesc peste tot în loc de stringul `/plata` pentru CTA-uri de cumpărare.

3. **Înlocuiri în UI**  
   - Landing (`conflicte`): 3 linkuri → bot.  
   - Lecția 0: 1 link → bot.  
   - `inscriere`: redirect → bot.  
   - `signup`: 1 link → bot.  
   - `PaywallBanner`: folosește URL bot.  
   - `LessonSidebar`: lecții blocate → bot.  
   - CTA prima lecție (dacă există) și opțional `AuthErrorBanner` → bot.

4. **Testare**  
   - De pe landing și de pe lecția 0, butoanele deschid botul (Telegram/SmartSender), nu `/plata` direct.  
   - Din bot, butonul de plată duce la `/plata` și flow-ul până la email merge ca înainte.

---

## 5. Fluxuri după implementare (recapitulare)

- **Flux 1 – Cumpără direct:**  
  Landing → „Vreau acces la curs” → **bot** → bot oferă checkout → `/plata` → plată → callback → LMS + email.

- **Flux 2 – Lecție gratuită:**  
  Landing → „Lecția gratuită” → `/curs/lectia-0` → „Cumpără cursul” → **bot** → checkout → plată → callback → LMS + email.

- **Flux 3 – Din app (fără entitlement):**  
  Prima lecție / lecții blocate → „Finalizează plata” / click pe lecție blocată → **bot** → checkout → plată → callback → LMS + email.

Toate intrările în funnelul de plată trec prin bot; platforma rămâne punctul unic de checkout și de acordare acces după plată.

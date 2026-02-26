# Integrare landing RELAȚIA 360 în LMS

Landing-ul din proiectul **relatia-360-landing** a fost integrat în acest repo (LMS = repo principal).

## Comportament

- **Pagina principală (`/`)** redirecționează la **`/conflicte`** (pagina cursului RELAȚIA 360 – De la conflict la conectare).
- **`/conflicte`** – landing-ul cursului (hero, CTA, FAQ, link către plată).
- **`/plata`** – pagina de plată (Paynet); după plată utilizatorul ajunge la `/multumim` sau `/plata/success`.
- **`/multumim`**, **`/plata/success`** – mulțumire + link Telegram.
- **`/termeni`**, **`/confidentialitate`** – pagini legale.
- **`/plan`** – pagina Plan (din landing).
- **`/mock/runpay`** – flux mock RunPay (pentru testare fără Paynet).
- **LMS** (cursuri, lecții, admin) rămâne la **`/app`**, **`/admin`**, **`/login`**.

## Imagini

Dacă în **relatia-360-landing** aveai imagini în `public/images/` (ex.: `hero.jpg`, `mobile hero 2.png`, `paynet.png`, `IMG_0646.JPG`), copiază-le în acest proiect:

```bash
cp -R /path/to/relatia-360-landing/public/images/* ./public/images/
```

Fără aceste fișiere, pe `/conflicte` și în footer imaginile vor fi 404; poți adăuga placeholder-uri sau să lași așa până copiezi asset-urile.

## Variabile de mediu

Păstrează în `.env.local` (sau Vercel) toate variabilele folosite de landing:

- **Supabase**: `SUPABASE_URL` sau `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Paynet** (dacă folosești): `PAYNET_ENV`, `PAYNET_API_HOST_TEST`, `PAYNET_PORTAL_HOST_TEST`, `PAYNET_USERNAME`, `PAYNET_PASSWORD`, `PAYNET_MERCHANT_CODE`, `PAYNET_SALE_AREA_CODE`, `PAYNET_CALLBACK_URL`, `PAYNET_NOTIFY_SECRET_KEY_TEST` (sau echivalentele LIVE)
- **Telegram**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_ADMIN_KEY`
- **Site**: `SITE_URL` (ex.: `https://liliadubita.md`)

## Legătura curs → LMS

Din `/conflicte`, butonul „Vreau acces la curs” duce la `/plata`. După plată și verificare în Telegram, utilizatorul poate fi direcționat către conținutul cursului. Pentru a le da acces la **LMS** (lecții în browser), poți adăuga pe `/multumim` sau în Telegram un link către **`/app`** (după autentificare) sau către un curs concret, ex. **`/app/course/<courseId>`**.

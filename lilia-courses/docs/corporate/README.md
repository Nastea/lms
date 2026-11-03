# Pagina principală corporate — livrare

„Lilia Dubița | Psihologie aplicată în business”, pagina de la `/` pe liliadubita.md. Site pentru companii: traininguri gândite de un psiholog, pornind de la înțelegerea echipei (Modelul B).

Ramura: `corporate-home`. Istoricul fazelor 1–5 (discovery, direcții, arhitectură, Modelul B) e în `relatia-360-landing/docs/lilia-corporate/`.

| Document | Ce conține |
|---|---|
| Acest fișier | structura codului, instalare, editare conținut, deploy, îmbunătățiri viitoare |
| [design-system.md](design-system.md) | tokeni, tipografie, componente, mișcare, accesibilitate |
| [content-verification.md](content-verification.md) | ce e confirmat, ce e ascuns până la validare, asset-uri lipsă |
| [testing.md](testing.md) | auditul din Faza 6: Lighthouse, axe, tastatură, responsive |

## 1. Structura codului

```
src/app/layout.tsx                    root minimal: <html>, globals.css, metadataBase
src/app/(corporate)/layout.tsx        fonturile Newsreader + Archivo, wrapper .corp
src/app/(corporate)/page.tsx          pagina: capitolele, metadata, JSON-LD
src/app/(corporate)/corporate.css     toate stilurile, scoped sub .corp
src/app/(site)/layout.tsx             site-ul de cursuri: fond negru, fonturile lui, Footer
src/app/(site)/...                    toate rutele existente ale LMS, neschimbate
src/app/api/corporate-contact/route.ts  primirea formularului, trimitere prin Resend
src/app/robots.ts, sitemap.ts         SEO
src/content/corporate.ts              TOT textul paginii, cu status de verificare
src/lib/corporateLead.ts              schema zod a formularului (mesaje în română)
src/components/corporate/
  StagePhoto.tsx                      fotografia sticky din dreapta, se schimbă pe capitol
  ChallengeExplorer.tsx               „Ce se întâmplă în echipa dumneavoastră?”
  ContactForm.tsx                     formularul, validare la blur și la trimitere
  PrefillLink.tsx, prefill.ts         butoane care precompletează formularul
public/images/corporate/              fotografiile (WebP) + lilia-sacou.jpg pentru OG
```

Grupurile de rute `(corporate)` și `(site)` nu apar în URL. Toate adresele existente (`/conflicte`, `/intensiv`, `/app`, `/admin` etc.) au rămas la fel.

## 2. Instalare locală

```bash
npm install
npm run dev
```

- Pagina e la `http://localhost:3000/`.
- Ca să vedeți și textele încă neconfirmate (marcate `[DE VERIFICAT]`), adăugați în `.env.local`: `NEXT_PUBLIC_SHOW_PENDING=1`.
- Build local: `npx next build --webpack`. Cu Turbopack, build-ul local eșuează doar pe acest Mac, din cauza `~/Apps/package-lock.json` (rădăcina e detectată greșit). Vercel nu e afectat.

## 3. Cum se editează conținutul

Tot textul e în `src/content/corporate.ts`. Nu e nevoie să atingeți componentele.

- Fiecare afirmație care trebuie confirmată are `status: 'confirmat' | 'de-verificat'`.
- În producție, tot ce e `de-verificat` e **ascuns automat**. Când Lilia confirmă un text, schimbați statusul în `'confirmat'` și apare.
- Secțiunile „Organizații”, „Studii de caz” și lista de acreditări apar doar când au cel puțin un element confirmat.
- Regula din brief: nu se publică testimoniale, rezultate, clienți, certificări sau cifre fără confirmare. Vezi [content-verification.md](content-verification.md).

**Fotografiile:** se înlocuiesc în `public/images/corporate/`, păstrând numele fișierelor, sau se schimbă căile în `page.tsx` (lista `frames` pentru desktop și benzile `<figure className="band">` pentru telefon). Conversie recomandată:

```bash
cwebp -q 78 -resize 1400 0 original.jpg -o lilia-nume.webp
```

## 4. Deploy (Vercel, proiectul LMS existent)

| Variabilă | Obligatorie | Rol |
|---|---|---|
| `RESEND_API_KEY` | da (există deja) | trimiterea emailului |
| `CORPORATE_LEADS_TO` | **da, nu e setată încă** | adresa care primește solicitările companiilor |
| `CORPORATE_LEADS_FROM` | nu | expeditor; implicit `RESEND_FROM` sau `noreply@liliadubita.md` |
| `NEXT_PUBLIC_SHOW_PENDING` | nu, **nu se setează în producție** | arată textele neconfirmate |

Fără `CORPORATE_LEADS_TO`, formularul răspunde „nu funcționează momentan” și afișează emailul și telefonul. Nu se pierde nimic în tăcere.

Pași:
1. Setați `CORPORATE_LEADS_TO` în Vercel (Production + Preview).
2. Publicați ramura `corporate-home` și verificați preview-ul Vercel.
3. Trimiteți un formular de test pe preview și confirmați că emailul ajunge, cu Reply-To pe adresa celui care a scris.
4. Merge în `main`. Vercel publică automat.
5. După publicare: verificați `/`, `/conflicte`, `/intensiv`, `/login`, `/robots.txt`, `/sitemap.xml`. Trimiteți sitemap-ul în Google Search Console.

**Protecții ale formularului:** câmp capcană (honeypot), minimum 3 secunde de completare, limită de 5 trimiteri la 10 minute pe IP (în memorie, pe instanță), validare zod pe server. Vizitatorul nu primește email automat, ca formularul să nu poată fi folosit pentru spam.

**Middleware:** `/images/`, `/robots.txt` și `/sitemap.xml` sunt publice. Înainte, `/images/*` redirecționa spre `/login` și pe site-ul live.

## 5. Ce s-a testat

Rezumat (detalii în [testing.md](testing.md)):

- **Lighthouse pe build de producție:**
  - mobil: performanță 88, accesibilitate 100, bune practici 100, SEO 100;
  - desktop: 99 / 100 / 100 / 100.
- **axe-core:** 0 încălcări WCAG 2.2 AA la 390 și la 1440 px.
- **Tastatură:** ordine logică, focus vizibil, „Sari la conținut” primul.
- **Lățimi 320–1920 px:** fără scroll orizontal, ținte de minimum 24 px.
- **Formular:**
  - erori în română, focus pe primul câmp greșit;
  - API: 422 la date invalide, honeypot acceptat în tăcere, 503 fără configurare;
  - precompletarea din „Provocări” funcționează.
- **Site-ul de cursuri:** fondul negru, footer-ul și fonturile proprii rămân neschimbate.

**Netestat încă:** trimiterea reală a emailului (lipsește `CORPORATE_LEADS_TO`) și preview-ul Vercel.

## 6. Îmbunătățiri recomandate

În ordinea impactului:

1. **Validarea conținutului cu Lilia:** cauzele și întrebările din „Provocări”, FAQ, etapele procesului, acreditările, clienții. Fără ele, pagina e corectă, dar mai săracă decât poate fi.
2. **Fotografii reale din training** (cu acordul participanților) și originalele ședinței foto la rezoluție mare.
3. **Studiul de caz HiSky,** după feedback verificat și permisiune.
4. **Limită de trimiteri persistentă** (Upstash/Vercel KV) în locul celei din memorie, dacă apare spam.
5. **Salvarea solicitărilor în Supabase** (tabel `corporate_leads`), pe lângă email, ca să nu depindă totul de inbox.
6. **Imagini responsive:** activarea optimizării Vercel doar pentru `/images/corporate` sau variante mobile separate (LCP mobil 3,9 s → sub 2,5 s).
7. **Analytics fără cookie-uri** (Vercel Analytics / Plausible): clicuri pe CTA, situații alese, formulare trimise.
8. **Versiune în rusă,** dacă publicul o cere. Structura de conținut permite asta.
9. **Pagini separate per program** (`/traininguri/...`) pentru SEO, când există texte validate.

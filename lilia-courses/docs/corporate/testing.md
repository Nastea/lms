# Faza 6 — Audit vizual și tehnic

Data: 3 noiembrie 2026. Ramura `corporate-home` din LMS, commit `55e3d73`.

## Cum am testat

| Verificare | Instrument | Unde |
|---|---|---|
| Accesibilitate automată | axe-core (WCAG 2.0/2.1/2.2 A+AA + best practices) | 390 px și 1440 px |
| Accesibilitate, SEO, performanță | Lighthouse 12, build de producție (`next build --webpack` + `next start`) | mobil (4G simulat) și desktop |
| Tastatură | 45 de apăsări Tab, verificare ordine și focus vizibil | 1440 px |
| Responsive | scroll orizontal, ținte tactile, mărimi de font | 320, 390, 768, 1024, 1440, 1920 px |
| Vizual | capturi pe fiecare capitol, desktop și telefon | 1440 și 390 px |
| Regresie site cursuri | `/conflicte`: fonturi Inter + DM Serif încărcate corect | dev |

## Rezultate

| | Înainte | După |
|---|---|---|
| Lighthouse mobil: performanță / accesibilitate / bune practici / SEO | 81 / 100 / 100 / 85 | **88 / 100 / 100 / 100** |
| Lighthouse desktop | 98 / 100 / 100 / 83 | **99 / 100 / 100 / 100** |
| LCP mobil (4G simulat) | 5,2 s | **3,9 s** |
| Greutate pagină mobil | 756 KB | **570 KB** |
| Încălcări axe | 0 | 0 |
| Scroll orizontal (320–1920 px) | niciunul | niciunul |
| CLS | 0 | 0 |

## Ce am reparat

1. **Fonturi inutile pe pagina principală.** Layout-ul de bază al LMS preîncărca Geist, Geist Mono, DM Serif și Inter (~400 KB) pe orice pagină. Le-am mutat în layout-ul `(site)`, al cursurilor. Pagina corporate încarcă acum doar Newsreader și Archivo.
2. **Imagini.** Toate fotografiile sunt WebP (596 KB → 280 KB). `lilia-sacou.jpg` rămâne pentru previzualizarea pe rețele (OG). Fotografia din erou are `fetchPriority="high"`; e același fișier pe telefon și pe desktop, deci se descarcă o singură dată.
3. **SEO.** `robots.txt` și `sitemap.xml` redirecționau spre `/login` (și pe producție). Acum există și sunt publice. `metadataBase` = `https://liliadubita.md`, deci adresa canonică e validă.
4. **Ținte tactile.** Linkurile din meniu (22 px) și din footer (20 px) au acum minimum 24 px înălțime (WCAG 2.5.8).
5. **Tipografie.** Titlurile de nivel 3 (programe, formate, FAQ, numerotare) foloseau patru mărimi fixe (20/22/24 px). Le înlocuiește un singur token fluid, `--step-h3`.

## Ce am verificat și e în regulă

- Ordinea titlurilor: un singur H1, H2 pe capitole, H3/H4 în ordine.
- Tastatura: „Sari la conținut” e primul, toate controalele au contur de focus (câmpurile din formular îl marchează prin bordură verde și fundal).
- Formular: erori în română, legate cu `aria-describedby`, focus pe primul câmp greșit.
- `prefers-reduced-motion`: tranzițiile sunt oprite.
- Diacritice: ș, ț cu virgulă, subsetul latin-ext încărcat.

## Rămâne deschis (acceptat sau pentru mai târziu)

| Punct | De ce rămâne | Ce ar ajuta |
|---|---|---|
| LCP mobil 3,9 s în testul 4G simulat | Fonturile Newsreader (axa opsz, ~220 KB) concurează cu fotografia. Pe o conexiune reală e sub 2 s. | Variantă mobilă mai mică a fotografiei din erou sau renunțarea la axa `opsz` |
| Imaginile nu au `srcset` | `images.unoptimized: true` e setat global în LMS | Activarea optimizării Next/Vercel doar pentru `/images/corporate` |
| ~46 KB JavaScript nefolosit, 12 KB polyfill-uri | Vin din bundle-ul comun al LMS | Separare la nivel de proiect, nu de pagină |
| Fotografiile sunt provizorii | Hotărâre a clientei | Originale la rezoluție mare, fotografii reale din training |
| Titlul eroului pe 3 rânduri (4 pe telefon) | Text ales de clientă | — |
| Build local cu Turbopack eșuează | `~/Apps/package-lock.json` face ca rădăcina să fie detectată greșit; Vercel nu e afectat | Ștergerea lock-ului din `~/Apps` sau `turbopack.root` |

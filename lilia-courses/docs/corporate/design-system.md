# Sistemul de design — direcția A „Masa de discuție”

Sursa unică: tokenii de la începutul `src/app/(corporate)/corporate.css`. Totul e scoped sub `.corp`, deci nu atinge site-ul de cursuri (Tailwind, fond negru).

## Principiul

Pagina e o masă de discuție. Lilia stă de o parte și rămâne prezentă pe tot parcursul: fotografia sticky se schimbă pe capitol. Vizitatorul citește de cealaltă parte despre propria echipă.

Sistemul servește lizibilitatea coloanei de citit:
- o singură măsură de text;
- fără ornamente;
- o singură culoare de acțiune.

## Culoare

| Token | Valoare | Rol | Contrast |
|---|---|---|---|
| `--paper` | #E6E3DC | fondul paginii | — |
| `--paper-2` | #DAD6CE | note, panouri, hover | — |
| `--paper-3` | #CFCAC0 | fundal sub fotografii, placeholder | ink 10,0:1 |
| `--ink` | #2A1D17 | textul de citit | 12,7:1 |
| `--ink-2` | #5F5047 | text secundar | 6,0:1 (5,3 pe paper-2) |
| `--action` | #3F6634 | butoane, focus, cifrele etapelor | text alb 6,6:1 · pe paper 5,2:1 |
| `--action-press` | #345629 | hover / apăsat | text alb 8,4:1 |
| `--error` | #9B2C1F | erori, marcajul [DE VERIFICAT] | 5,9:1 |

Reguli:
- Verdele apare doar pe ce se poate apăsa și pe cifrele etapelor.
- Fără gradiente.
- Fără umbre pe elementele în repaus. Excepția e meniul mobil, care plutește.

## Tipografie

Familii:
- **Newsreader** (`--font-display`) pentru titluri, citate și cifre. Folosește axa de mărime optică, greutate 350–400, tracking între −0,01 și −0,025em.
- **Archivo** (`--font-text`) pentru text, în greutățile 400 și 600.

Ambele încarcă subsetul `latin-ext`, deci ș și ț se afișează cu virgulă dedesubt.

| Token | Interval | Folosit pentru |
|---|---|---|
| `--step-small` | 13–14 px | note, etichete, meniu |
| `--step-body` | 17–19 px | text, butoane, H3 sans |
| `--step-lead` | 19–24 px | subtitluri, întrebări, limite |
| `--step-h3` | 20–24 px | titluri serif de program, format, FAQ |
| `--step-h2` | 32–48 px | titlurile capitolelor |
| `--step-h1` | 36–56 px | eroul |

Măsura textului este `--measure: 34em`. Singura excepție de mărime e numele mare din footer (`clamp(3rem, 1rem + 8vw, 9rem)`).

## Spațiu și grilă

- Scara de spațiere: `--s-1` … `--s-10` = 4, 8, 12, 16, 24, 32, 48, 64, 96 și 128 px.
- Marginea laterală: `--gutter`, între 20 și 72 px.
- Spațiul dintre capitole: `--section-gap`, între 96 și 160 px.
- **Desktop (>820 px):** scena are coloana de citit 52% și fotografia 48%. Fotografia e `sticky`, cu `height: 100svh`.
- **Între 821 și 1240 px:** al patrulea link din meniu e ascuns, ca bara să încapă.
- **Telefon (≤820 px):** o singură coloană cu margine de 20 px. Fiecare capitol principal începe cu banda lui foto. Meniul e un `<details>` nativ.

## Componente

| Componentă | Specificație |
|---|---|
| Bară | sticky, 72 px; wordmark, 4 linkuri, butonul mic „Discuție” |
| Buton principal | dreptunghi `--action`, text alb 600, padding 20×26 px; hover `--action-press`; apăsat `scale(0.97)`; pe telefon ocupă toată lățimea |
| Link secundar | text 600, subliniat |
| Explorarea provocărilor | listă de radio-uri native (22 px, eticheta face ținta mai mare) + panou pe `--paper-2`: cauze posibile, întrebări, „Răspunsuri posibile” (linkuri spre zone), notă „nu este un diagnostic”, buton de precompletare |
| Etape | `<ol>` cu cifră serif în `--action`; fiecare etapă are „Întrebăm” și un bloc `dl` pe `--paper-2` |
| Limite | listă serif la mărimea lead, cu liniuță |
| Zone și programe | `<details>` native: titlul zonei, apoi programele (titlu serif `--step-h3`, „Pentru…”, Nevoia / Ce dezvoltăm / Rezultatul, nota „ce nu rezolvă un training”) |
| Tabel formate | tabel real pe desktop; pe telefon, rândurile devin blocuri |
| Notă | fond `--paper-2`, text small |
| Câmp formular | bordură 2 px ink, colțuri drepte, eticheta deasupra; focus: bordură action + fundal mai deschis; eroarea dedesubt în `--error` |
| Placeholder foto | fond `--paper-3`, text explicit „(se adaugă)”; niciodată o imagine de stoc prezentată ca training real |
| Marcaj neconfirmat | `[DE VERIFICAT]` roșu, chenar punctat; apare doar cu `NEXT_PUBLIC_SHOW_PENDING=1` |

## Fotografie

Reguli:
- Culoare naturală, fără filtre, colțuri drepte.
- Fișiere WebP de până la 1400 px pe latura lungă.

| Capitol | Fotografie | Fișier |
|---|---|---|
| Erou, Provocări | costum crem, pe scaun | `lilia-crem.webp` |
| Cum lucrăm, Limite | sacou negru, la masa de lucru | `lilia-birou.webp` |
| Intervenții | din profil, ascultând | `lilia-profil.webp` |
| Metoda, Calea directă, Studii de caz | pe scenă, cu grupul | `lilia-scena.webp` |
| Despre, Organizații, FAQ | sacou negru, pe fotoliu | `lilia-sacou.webp` (decupată 7% jos, clasa `crop-strip`) |
| Contact | pe canapea | `lilia-canapea.webp` |

Pe desktop, fotografiile din scena sticky sunt decorative (`alt=""`). Benzile de pe telefon au text alternativ descriptiv.

## Mișcare

- **Curbe:**
  - intrări: `--ease-out` = `cubic-bezier(0.23, 1, 0.32, 1)`;
  - schimbarea fotografiei: `--ease-in-out` = `cubic-bezier(0.77, 0, 0.175, 1)`.
- **Durate:**
  - `--dur-fast` 160 ms: hover, apăsare;
  - `--dur-base` 280 ms: deschiderea unui program;
  - `--dur-slow` 600 ms: crossfade-ul fotografiei;
  - eșalonare de 80 ms.
- **Proprietăți animate:** doar `transform` și `opacity`.
- **`prefers-reduced-motion`:** dispar tranzițiile și scroll-ul animat.

## Accesibilitate

- Primul element focusabil e linkul „Sari la conținut”.
- Focus vizibil: contur de 2 px în `--action`, cu offset de 3 px.
- Controalele sunt native: radio, `<details>`, `<select>`, `<label>` legat de câmp.
- Erorile din formular sunt legate prin `aria-describedby`, iar `aria-invalid` e setat. La trimitere, focusul merge pe primul câmp greșit.
- Ținte de minimum 24 px.
- Contrast AA peste tot (vezi tabelul de culori).
- Testat cu axe: 0 încălcări (vezi [testing.md](testing.md)).

import Image from 'next/image';
import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import { INTENSIV } from '@/lib/intensiv';
import SignupForm from './SignupForm';
import Reveal from './Reveal';
import './intensiv.css';

/* =============================================================================
 *  Intensiv „Am un plan pentru viața mea" — landing.
 *  Ideea: pagina este caietul de lucru al intensivului. Coperta = primul ecran,
 *  fiecare secțiune = încă o foaie din caiet, footer-ul = coperta din spate.
 *  Conceptul: GPS personal — 6 module, un traseu, un plan scris pe 60 de zile.
 *  Prețul, data și linkurile vin din lib/intensiv.ts (INTENSIV).
 * ========================================================================== */

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--ix-font',
});



export const metadata: Metadata = {
  title: 'Am un plan pentru viața mea — intensiv online cu Lilia Dubița',
  description:
    '7 noiembrie, online. 5 ore de lucru practic, 6 module și planul tău scris pentru următoarele 60 de zile. Caiet de lucru inclus.',
};

// Cele 6 module, cu titlurile și descrierile Liliei (din materialul de promovare).
// `exercise` = exercițiul din caietul de lucru.
const MODULES = [
  {
    title: 'GPS-ul vieții mele: unde mă aflu acum?',
    text: 'Ne uităm la viața ta așa cum e acum: relații, muncă, sănătate, cum te simți. Vezi ce merge deja bine, ce te apasă și unde merită să-ți pui atenția în următoarele 60 de zile.',
    exercise: 'Coordonatele mele GPS',
  },
  {
    title: 'Ce mă ține pe loc?',
    text: 'Uneori știi foarte bine ce vrei și totuși nu te miști. Afli ce te oprește pe tine (amânarea, perfecționismul, vocea critică din cap, oboseala) și ce poți face concret cu asta.',
    exercise: 'Piatra din drumul meu',
  },
  {
    title: 'Îmi construiesc traseul: priorități și planificare',
    text: 'Transformăm „aș vrea” în câteva obiective clare și realiste. Le împărțim în pași mici și le punem în calendar, ca să nu rămână doar pe hârtie.',
    exercise: 'Din patru cadrane în calendar',
  },
  {
    title: 'Motivația mea: combustibilul pentru drum',
    text: 'Ne întrebăm de ce vrei, de fapt, schimbarea asta. Când știi răspunsul, îți e mai ușor să mergi mai departe și în zilele în care nu prea ai chef.',
    exercise: 'Destinația mea',
  },
  {
    title: 'Ritmul meu: disciplină, fiziologie și recuperare',
    text: 'Un plan bun ține cont de energia ta, de somn și de odihnă. Afli ce te încarcă și ce te stoarce și îți faci un ritm pe care chiar îl poți duce, fără să te epuizezi.',
    exercise: 'Ritmul meu de funcționare',
  },
  {
    title: 'Planul meu de 60 de zile: de la idei la acțiune',
    text: 'Punem totul cap la cap. Alegi ce contează cu adevărat pentru tine și scrii planul pe 60 de zile: ce faci, până când și după ce îți dai seama că avansezi.',
    exercise: 'Contractul meu cu mine',
  },
] as const;

// Metoda SIFA — firul roșu al intensivului.
const SIFA = [
  { letter: 'S', word: 'Scenariu', q: 'Ce repet?' },
  { letter: 'I', word: 'Intenție', q: 'Ce vreau?' },
  { letter: 'F', word: 'Focus', q: 'Unde îmi pun energia?' },
  { letter: 'A', word: 'Acțiune', q: 'Ce fac concret?' },
] as const;

const SHEETS = [
  {
    title: 'Planul pe 60 de zile',
    text: 'Nu o listă de dorințe, ci pași mici pe care îi scrii tu, cu mâna ta. Știi ce faci mâine, săptămâna viitoare și peste o lună.',
    photo: '/api/img/IMG_0650.JPG',
    alt: 'Lilia Dubița citind, așezată pe podea printre caiete și foi deschise',
    pos: 'center 40%',
    tone: 'paper',
  },
  {
    title: 'Caietul de lucru',
    text: 'Șapte pagini pe care le primești pe email imediat după plată. Le printezi, le ai lângă tine și le completăm împreună, pe rând.',
    photo: '/api/img/462581361_1836053763900029_7874199193613626130_n.jpg',
    alt: 'Lilia Dubița într-un costum crem, pe un scaun',
    pos: 'center 25%',
    tone: 'frost',
  },
  {
    title: 'Ceva ce folosești a doua zi',
    text: 'Pleci cu exerciții pe care le poți relua oricând, nu cu slide-uri pe care le uiți într-un folder. A doua zi știi deja ce ai de făcut.',
    photo: '/api/img/IMG_0651.JPG',
    alt: 'Lilia Dubița lângă o ușă de lemn, în costum închis',
    pos: 'center 30%',
    tone: 'ink',
  },
] as const;


export default function IntensivPage() {
  const price = INTENSIV.label;
  const later = INTENSIV.laterLabel;

  return (
    <div className={`ix ${archivo.variable}`}>
      <Reveal />

      <div className="ix-sheet-main">
        {/* ── Coperta ─────────────────────────────────────────────────── */}
        <header className="ix-hero">
          <nav className="ix-nav" aria-label="Navigare">
            <a href="#top" className="ix-mono" aria-label="Lilia Dubița">LD</a>
            <div className="ix-nav-links">
              <a href="#module">Modulele</a>
              <a href="#ce-primesti">Ce primești</a>
              <a href="#intrebari">Întrebări</a>
            </div>
            <a href="#inscriere" className="ix-btn">Mă înscriu</a>
          </nav>

          <div className="ix-cover" id="top">
            <i className="ix-notch ix-notch-tl" aria-hidden />
            <i className="ix-notch ix-notch-tr" aria-hidden />
            <div className="ix-cover-text">
              <h1 className="ix-cover-title">
                <span>Am un plan</span>
                <span>pentru viața mea</span>
              </h1>
              <p className="ix-cover-by">Intensiv online cu Lilia Dubița, psiholog</p>
              <p className="ix-cover-line">
                Sâmbătă, 7 noiembrie <i className="ix-diamond" aria-hidden /> online, pe Zoom{' '}
                <i className="ix-diamond" aria-hidden /> cu caiet de lucru
              </p>
              <p className="ix-cover-sub">
                Nu trebuie să-ți schimbi toată viața într-o singură zi. Dar poți crea un plan care să
                schimbe următoarele 60 de zile.
              </p>
              <a href="#inscriere" className="ix-btn ix-btn-big">
                Mă preînscriu — {price}
              </a>
            </div>
            <div className="ix-cover-photo">
              <Image
                src="/api/img/462581361_1836053763900029_7874199193613626130_n.jpg"
                alt="Lilia Dubița, psiholog, într-un costum crem"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 45vw"
              />
            </div>
          </div>
        </header>

        {/* ── Foaia 1: cinci ore, un plan ─────────────────────────────── */}
        <section className="ix-intro" data-reveal>
          <div className="ix-intro-top">
            <h2 className="ix-h">Cinci ore. Un plan.</h2>
            <p className="ix-intro-note">
              Poate ai multe în cap și nu știi de unde să începi. Sau știi ce vrei, dar tot amâni. În
              cele cinci ore nu notăm teorie: ne uităm împreună la viața ta așa cum e acum și pleci cu
              un plan scris de mâna ta, pe care chiar îl poți urma.
            </p>
          </div>
          <dl className="ix-facts">
            <div><dt>7 noiembrie</dt><dd>sâmbătă, de la 10 la 16</dd></div>
            <div><dt>5 ore</dt><dd>cu o oră de pauză la prânz</dd></div>
            <div><dt>6 module</dt><dd>de la unde ești la ce faci mâine</dd></div>
            <div><dt>{price}</dt><dd>{later ? `acum, la preînscriere, apoi ${later}` : 'cu tot cu caiet'}</dd></div>
          </dl>
        </section>

        {/* ── Modulele: traseul GPS ───────────────────────────────────── */}
        <section className="ix-modules" id="module">
          <div className="ix-modules-head" data-reveal>
            <h2 className="ix-h">Șase module, un traseu</h2>
            <p className="ix-modules-note">
              E ca la un GPS: ca să ajungi undeva, trebuie să știi întâi unde ești. Apoi vedem ce te
              încurcă, alegem drumul, găsim ce te motivează și un ritm pe care îl poți ține. Ne ghidăm
              după patru întrebări simple.
            </p>
          </div>
          <dl className="ix-sifa" data-reveal aria-label="Metoda SIFA">
            {SIFA.map((x) => (
              <div key={x.letter}>
                <dt><span className="ix-sifa-letter">{x.letter}</span>{x.word}</dt>
                <dd>{x.q}</dd>
              </div>
            ))}
          </dl>
          <ol className="ix-modules-list">
            {MODULES.map((m) => (
              <li key={m.title} className="ix-module" data-reveal>
                <h3>{m.title}</h3>
                <p className="ix-module-out">{m.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Ce primești ──────────────────────────────────── */}
        <section className="ix-stack" id="ce-primesti">
          <h2 className="ix-h ix-stack-h" data-reveal>Ce iei cu tine</h2>
          {SHEETS.map((s) => (
            <article key={s.title} className={`ix-stack-sheet ix-tone-${s.tone}`}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="ix-stack-photo">
                <Image src={s.photo} alt={s.alt} fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectPosition: s.pos }} />
              </div>
            </article>
          ))}
        </section>

        {/* ── Preț + înscriere ────────────────────────────────────────── */}
        <section className="ix-price" id="inscriere">
          <div className="ix-price-head" data-reveal>
            <h2 className="ix-h">Înscrierea</h2>
            <Image
              src="/api/img/IMG_0646.JPG"
              alt="Lilia Dubița pe o canapea, în costum gri"
              width={829}
              height={1280}
              className="ix-price-photo"
              sizes="(max-width: 760px) 60vw, 22vw"
            />
          </div>
          <div className="ix-price-body" data-reveal>
            <div className="ix-menu">
              <p className="ix-menu-group">Intensivul + caietul de lucru</p>
              <div className="ix-menu-row" data-current="">
                <div>
                  <p className="ix-menu-name">Preînscriere</p>
                  <p className="ix-menu-desc">
                    Prețul de acum, cât sunt deschise preînscrierile
                  </p>
                </div>
                <p className="ix-menu-price">{price}</p>
              </div>
              {later && (
                <div className="ix-menu-row">
                  <div>
                    <p className="ix-menu-name">După închiderea preînscrierilor</p>
                    <p className="ix-menu-desc">Același intensiv, doar mai târziu</p>
                  </div>
                  <p className="ix-menu-price">{later}</p>
                </div>
              )}
            </div>
            <SignupForm label={`Plătesc ${price} și mă înscriu`} />
          </div>
        </section>

        {/* ── Întrebări ───────────────────────────────────────────────── */}
        <section className="ix-faq" id="intrebari">
          <div className="ix-faq-col" data-reveal>
            <h2 className="ix-h">Întrebări</h2>
            <ul className="ix-faq-facts">
              <li>Sâmbătă, 7 noiembrie 2026</li>
              <li>10:00–12:00 · prima parte</li>
              <li>12:00–13:00 · pauză de o oră</li>
              <li>13:00–16:00 · a doua parte</li>
              <li>Online, pe Zoom</li>
              <li>Linkurile vin pe email și în Telegram</li>
            </ul>
            <details>
              <summary>Ce am nevoie să pregătesc?</summary>
              <p>Doar caietul, printat. Îl primești pe email imediat după plată și are 7 pagini A4. Ia și un pix și încearcă să-ți păstrezi ziua liberă, fără alte treburi pe fundal.</p>
            </details>
            <details>
              <summary>Pentru cine e intensivul?</summary>
              <p>Pentru tine, dacă simți că amâni lucruri importante, că te învârți în cerc sau că ai nevoie de puțină ordine în viață. Nu trebuie să vii cu nimic pregătit: pornim de unde ești acum.</p>
            </details>
            <details>
              <summary>Cum primesc linkul de Zoom?</summary>
              <p>Imediat după plată îți vine un email cu linkul de Zoom, caietul și linkul spre grupul de Telegram. Le găsești și în grup înainte de 7 noiembrie.</p>
            </details>
            <details>
              <summary>Nu am primit emailul. Ce fac?</summary>
              <p>Uită-te și în Spam sau Promoții. Dacă nici acolo nu e, scrie-ne la danexprim@liliadubita.md sau sună la 067 102 290 și te ajutăm.</p>
            </details>
            <a href="#inscriere" className="ix-btn">Mă înscriu — {price}</a>
          </div>
          <div className="ix-faq-photos">
            <Image
              src="/api/img/462576124_1542539003296328_8932070267725812252_n.jpg"
              alt="Lilia Dubița într-un costum alb, pe o canapea"
              width={1280}
              height={1862}
              className="ix-faq-tall"
              sizes="(max-width: 760px) 100vw, 45vw"
            />
            <Image
              src="/api/img/hero.jpg"
              alt="Portret Lilia Dubița"
              width={600}
              height={600}
              className="ix-faq-square"
              sizes="(max-width: 760px) 40vw, 15vw"
            />
          </div>
        </section>
      </div>

      {/* ── Coperta din spate ─────────────────────────────────────────── */}
      <footer className="ix-back">
        <svg className="ix-back-edge" viewBox="0 0 1200 50" preserveAspectRatio="none" aria-hidden>
          <path d={`M0 50 ${Array.from({ length: 12 }, (_, i) => `L${i * 100} 50 A50 50 0 0 1 ${i * 100 + 100} 50`).join(' ')} L1200 50 Z`} />
        </svg>
        <div className="ix-back-panel">
          <div>
            <p className="ix-back-sign">Ne vedem pe 7 noiembrie</p>
            <p>Pune-ți deoparte ziua, printează caietul și ia un pix. De restul ne ocupăm împreună.</p>
          </div>
          <div className="ix-back-address">
            <a href="mailto:danexprim@liliadubita.md">danexprim@liliadubita.md</a>
            <a href="tel:067102290">067 102 290</a>
            <a href="https://www.liliadubita.md">liliadubita.md</a>
          </div>
          <div className="ix-back-imprint">
            <p>© {new Date().getFullYear()} Danex Prim SRL · mun. Chișinău, sec. Buiucani, str. Calea Ieșilor 11</p>
            <nav aria-label="Informații legale">
              <a href="/termeni">Termeni și Condiții</a>
              <a href="/confidentialitate">Politică de Confidențialitate</a>
            </nav>
            <p className="ix-back-pay">
              Plată cu Visa sau Mastercard prin
              <Image src="/api/img/paynet.png" alt="Paynet" width={32} height={32} />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  about, approach, boundaries, brand, caseStudies, company, contact, CTA, directPath, faq, formats, hero,
  interventions, method, organizations, programs, showPending, visible, zones, type Status,
} from "@/content/corporate";
import { teamTest } from "@/content/teamTest";
import ChallengeExplorer from "@/components/corporate/ChallengeExplorer";
import ContactForm from "@/components/corporate/ContactForm";
import CorporateFooter from "@/components/corporate/CorporateFooter";
import PrefillLink from "@/components/corporate/PrefillLink";
import StagePhoto, { type Frame } from "@/components/corporate/StagePhoto";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.liliadubita.md";
const DESCRIPTION =
  "Lilia Dubița, psiholog: traininguri gândite pentru compania dumneavoastră, după ce înțelegem ce se întâmplă în echipă. Comunicare, conflicte, leadership, stres, relația cu clientul.";

export const metadata: Metadata = {
  title: `${brand.name} | ${brand.tagline}`,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ro_MD",
    url: SITE,
    siteName: brand.name,
    title: hero.title,
    description: hero.lead,
    images: [{ url: "/images/corporate/lilia-sacou.jpg", width: 1256, height: 863, alt: "Lilia Dubița" }],
  },
};

const frames: Frame[] = [
  { key: "portret", src: "/images/corporate/lilia-crem.webp", position: "50% 25%" },
  { key: "profil", src: "/images/corporate/lilia-profil.webp", position: "30% 40%" },
  { key: "birou", src: "/images/corporate/lilia-birou.webp", position: "45% 30%" },
  { key: "scena", src: "/images/corporate/lilia-scena.webp", position: "55% 60%" },
  { key: "om", src: "/images/corporate/lilia-sacou.webp", position: "80% 30%", crop: true },
  { key: "canapea", src: "/images/corporate/lilia-canapea.webp", position: "50% 45%" },
];

// Afirmațiile neconfirmate apar doar în previzualizare, marcate.
const pending = (s: Status) => (s === "de-verificat" ? "pending" : undefined);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${brand.name} · ${brand.tagline}`,
  description: DESCRIPTION,
  url: SITE,
  image: `${SITE}/images/corporate/lilia-sacou.jpg`,
  telephone: company.phone,
  email: company.email,
  address: { "@type": "PostalAddress", streetAddress: "str. Calea Ieșilor, 11", addressLocality: "Chișinău", addressCountry: "MD" },
  founder: { "@type": "Person", name: brand.name, jobTitle: "Psiholog" },
  knowsAbout: zones.map((z) => z.title),
};

const NAV = [
  ["#provocari", "Provocări"],
  ["#cum-lucram", "Cum lucrăm"],
  ["#interventii", "Intervenții"],
  ["#despre", "Despre"],
] as const;

export default function CorporateHome() {
  const orgs = organizations.filter((o) => visible(o.status));
  const cases = caseStudies.filter((c) => visible(c.status));
  const questions = faq.filter((f) => visible(f.status));
  // O listă cu un singur titlu (doar „Psiholog”) nu adaugă nimic față de bio.
  const creds = about.credentials.filter((c) => visible(c.status));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a className="skip" href="#continut">Sari la conținut</a>
      <div className="stage">
        <div className="read">
          <header className="bar">
            <Link className="mark" href="/"><b>{brand.name}</b><span>{brand.tagline}</span></Link>
            <nav className="nav" aria-label="Principal">
              {NAV.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
              <a href="#contact" className="talk">Discuție</a>
            </nav>
            <details className="menu">
              <summary>Meniu</summary>
              <nav className="nav" aria-label="Principal, telefon">
                {NAV.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
                <a href="#contact">Discuție inițială</a>
              </nav>
            </details>
          </header>

          <main id="continut">
            {/* 1. Erou */}
            <section className="hero" data-photo="portret">
              <figure className="band">
                <Image src="/images/corporate/lilia-crem.webp" alt="Lilia Dubița, într-un costum crem, așezată pe un scaun" fill sizes="100vw" priority fetchPriority="high" style={{ objectPosition: "50% 20%" }} />
              </figure>
              <h1 className="rise">{hero.title}</h1>
              <p className="lead rise">{hero.lead}</p>
              <div className="actions rise">
                <a className="btn" href="#contact">{CTA}</a>
                <a className="link" href="#cum-lucram">{hero.secondaryCta}</a>
              </div>
              <p className="topics rise">{hero.who}</p>
            </section>

            {/* 2. Provocări: explorarea */}
            <section className="chapter" id="provocari" data-photo="portret">
              <h2>Ce se întâmplă în echipa dumneavoastră?</h2>
              <p className="intro">Aceeași problemă poate avea cauze foarte diferite. Alegeți situația cea mai apropiată și vedeți ce am încerca să înțelegem împreună.</p>
              <ChallengeExplorer />
              {visible(teamTest.status) && (
                <p className="hint">Nu sunteți sigur? <Link className="link" href={`/teste/${teamTest.slug}`}>Faceți testul de 3 minute „{teamTest.title}”</Link></p>
              )}
            </section>

            {/* 3. Cum lucrăm: capitolul central */}
            <section className="chapter" id="cum-lucram" data-photo="birou">
              <figure className="band">
                <Image src="/images/corporate/lilia-birou.webp" alt="Lilia Dubița, în sacou negru, sprijinită de o masă de lucru, lângă fereastră" fill sizes="100vw" style={{ objectPosition: "45% 25%" }} />
              </figure>
              <h2>{approach.title}</h2>
              <p className="intro">{approach.intro}</p>
              <ol className="steps">
                {approach.stages.map((st) => (
                  <li key={st.title}>
                    <div>
                      <h3>{st.title}</h3>
                      <p>{st.text}</p>
                      {st.ask.length > 0 && <ul className="questions">{st.ask.map((q) => <li key={q}>{q}</li>)}</ul>}
                      {st.items.filter((it) => visible(it.status)).length > 0 && (
                        <dl className="stage-items">
                          {st.items.filter((it) => visible(it.status)).map((it) => (
                            <div key={it.label} className={pending(it.status)}><dt>{it.label}</dt><dd>{it.text}</dd></div>
                          ))}
                        </dl>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* 4. Limitele trainingului */}
            <section className="chapter" id="limite" data-photo="birou">
              <h2>{boundaries.title}</h2>
              <p className="intro">{boundaries.intro}</p>
              <ul className="limits">{boundaries.examples.map((e) => <li key={e}>{e}</li>)}</ul>
              <p className="close">{boundaries.close}</p>
            </section>

            {/* 5. Intervenții: competențe pe zone */}
            <section className="chapter" id="interventii" data-photo="profil">
              <figure className="band">
                <Image src="/images/corporate/lilia-profil.webp" alt="Lilia Dubița, din profil, ascultând" fill sizes="100vw" style={{ objectPosition: "30% 35%" }} />
              </figure>
              <h2>{interventions.title}</h2>
              <p className="intro">{interventions.intro}</p>
              <div className="programs">
                {zones.map((z) => (
                  <details key={z.id} id={`zona-${z.id}`}>
                    <summary><div><h3>{z.title}</h3><span>{z.observe}</span></div></summary>
                    <div className="program-body">
                      {z.programs.map((id) => {
                        const p = programs.find((x) => x.id === id)!;
                        return (
                          <div key={p.id} className="program">
                            <h4>{p.title}</h4>
                            <p className="for">Pentru {p.audience}</p>
                            <p><b>Ce dezvoltăm:</b> {p.develops.join(", ")}.</p>
                            <p><b>Rezultatul urmărit:</b> {p.outcome}</p>
                            {p.care && <p className="care">{p.care}</p>}
                          </div>
                        );
                      })}
                      <p className="limit"><b>Ce nu rezolvă un training aici:</b> {z.limit}</p>
                    </div>
                  </details>
                ))}
              </div>
              <p className="custom">{interventions.customTopics}</p>
            </section>

            {/* 6. Metoda */}
            <section className="chapter" id="metoda" data-photo="scena">
              <figure className="band">
                <Image src="/images/corporate/lilia-scena.webp" alt="Lilia Dubița vorbind cu microfonul în fața unui grup de participanți" fill sizes="100vw" style={{ objectPosition: "55% 72%" }} />
              </figure>
              <h2>{method.title}</h2>
              <p className="intro">{method.intro}</p>
              <ol className="steps compact">
                {method.sequence.map((s) => <li key={s.title}><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}
              </ol>
              {visible(method.ratio.status) && <p className={`ratio ${pending(method.ratio.status) ?? ""}`}>{method.ratio.text}</p>}
              <p className="sources">{method.sources}</p>
            </section>

            {/* 7. Calea directă + formate */}
            <section className="chapter" id="training-direct" data-photo="scena">
              <h2>{directPath.title}</h2>
              <p className="intro">{directPath.intro}</p>
              <ul className="direct-list">{programs.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
              <table className="formats">
                <caption className="sr-only">Formate de intervenție</caption>
                <thead><tr><th scope="col">Format</th><th scope="col">Durată</th><th scope="col">Potrivit pentru</th></tr></thead>
                <tbody>{formats.map((f) => <tr key={f.name}><td>{f.name}</td><td>{f.duration}</td><td>{f.fit}</td></tr>)}</tbody>
              </table>
              <div className="after-formats">
                <PrefillLink prefill={{ text: "Ne interesează un training pe tema: ", intent: "Un training pe o temă anume" }}>{directPath.cta}</PrefillLink>
              </div>
            </section>

            {/* 8. Credibilitate */}
            <section className="chapter" id="despre" data-photo="om">
              <figure className="band crop-strip">
                <Image src="/images/corporate/lilia-sacou.webp" alt="Lilia Dubița, zâmbind, în sacou negru, pe un fotoliu din piele" fill sizes="100vw" style={{ objectPosition: "62% 30%" }} />
              </figure>
              <h2>{about.title}</h2>
              <p className="statement">{about.why}</p>
              <div className="bio">
                {about.bio.filter((b) => visible(b.status)).map((b) => <p key={b.text} className={pending(b.status)}>{b.text}</p>)}
              </div>
              {creds.length > 1 && (
                <ul className="creds">
                  {creds.map((c) => <li key={c.text}><span className={pending(c.status)}>{c.text}</span></li>)}
                </ul>
              )}
            </section>

            {orgs.length > 0 && (
              <section className="chapter" id="organizatii" data-photo="om">
                <h2>Organizații cu care am lucrat</h2>
                <ul className="orgs">{orgs.map((o) => <li key={o.name} className={pending(o.status)}>{o.name}</li>)}</ul>
              </section>
            )}

            {cases.length > 0 && (
              <section className="chapter" id="studii-de-caz" data-photo="scena">
                <h2>Studii de caz</h2>
                {cases.map((c) => (
                  <article key={c.client} className={`case ${pending(c.status) ?? ""}`}>
                    <h3>{c.client}: {c.title}</h3>
                    <dl className="case">
                      <div><dt>Context</dt><dd>{c.context}</dd></div>
                      <div><dt>Ce am înțeles</dt><dd>{c.understood}</dd></div>
                      <div><dt>Intervenția</dt><dd>{c.intervention}</dd></div>
                      <div><dt>Metode</dt><dd>{c.methods}</dd></div>
                      <div><dt>Ce s-a observat</dt><dd className={c.results ? undefined : "waiting"}>{c.results ?? "În curs de colectare."}</dd></div>
                    </dl>
                  </article>
                ))}
              </section>
            )}

            {questions.length > 0 && (
              <section className="chapter" id="intrebari" data-photo="om">
                <h2>Întrebări frecvente</h2>
                <div className="programs faq">
                  {questions.map((f) => (
                    <details key={f.q} className={pending(f.status)}>
                      <summary><div><h3>{f.q}</h3></div></summary>
                      <div className="program-body"><p>{f.a}</p></div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* 9. Contact */}
            <section className="chapter contact-end" id="contact" data-photo="canapea">
              <figure className="band">
                <Image src="/images/corporate/lilia-canapea.webp" alt="Lilia Dubița, pe o canapea, într-un birou cu lumină caldă" fill sizes="100vw" style={{ objectPosition: "45% 35%" }} />
              </figure>
              <h2>{contact.title}</h2>
              <p className="intro">{contact.intro}</p>
              <ol className="next">
                {contact.next.filter((n) => visible(n.status)).map((n) => <li key={n.text}>{n.text}</li>)}
              </ol>
              <ContactForm />
            </section>
          </main>
        </div>
        <StagePhoto frames={frames} />
      </div>

      <CorporateFooter />
    </>
  );
}

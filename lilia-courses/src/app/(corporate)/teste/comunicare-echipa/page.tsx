import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand, contact, visible } from "@/content/corporate";
import { teamTest } from "@/content/teamTest";
import ContactForm from "@/components/corporate/ContactForm";
import CorporateFooter from "@/components/corporate/CorporateFooter";
import StagePhoto, { type Frame } from "@/components/corporate/StagePhoto";
import TeamTest from "@/components/corporate/TeamTest";

export const metadata: Metadata = {
  title: `${teamTest.title} | ${brand.name}`,
  description: "Test de 3 minute pentru manageri și HR: unde funcționează comunicarea în echipă și unde merită atenție.",
  alternates: { canonical: `/teste/${teamTest.slug}` },
  openGraph: {
    type: "website",
    locale: "ro_MD",
    title: teamTest.title,
    description: "Test de 3 minute pentru manageri și HR.",
    images: [{ url: "/images/corporate/lilia-sacou.jpg", width: 1256, height: 863, alt: "Lilia Dubița" }],
  },
};

const frames: Frame[] = [
  { key: "test", src: "/images/corporate/lilia-profil.webp", position: "30% 40%" },
  { key: "contact", src: "/images/corporate/lilia-canapea.webp", position: "50% 45%" },
];

export default function TeamTestPage() {
  if (!visible(teamTest.status)) notFound();

  return (
    <>
      <a className="skip" href="#continut">Sari la conținut</a>
      <div className="stage">
        <div className="read">
          <header className="bar">
            <Link className="mark" href="/"><b>{brand.name}</b><span>{brand.tagline}</span></Link>
            <nav className="nav nav-test" aria-label="Principal">
              <Link href="/">Pagina principală</Link>
              <a href="#contact" className="talk">Discuție</a>
            </nav>
          </header>

          <main id="continut">
            <section className="hero test-hero" data-photo="test">
              <figure className="band">
                <Image src="/images/corporate/lilia-profil.webp" alt="Lilia Dubița, din profil, ascultând" fill sizes="100vw" priority style={{ objectPosition: "30% 35%" }} />
              </figure>
              <p className={`kicker ${teamTest.status === "de-verificat" ? "pending" : ""}`}>Test pentru manageri și HR · 3 minute</p>
              <h1>{teamTest.title}</h1>
              <TeamTest />
            </section>

            <section className="chapter contact-end" id="contact" data-photo="contact">
              <h2>{contact.title}</h2>
              <p className="intro">Spuneți-ne ce ați observat. Dacă ați făcut testul, rezultatul e deja trecut mai jos.</p>
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

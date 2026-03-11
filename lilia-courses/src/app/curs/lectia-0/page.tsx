import Link from "next/link";
import { getFirstLessonPublicData } from "@/lib/lesson-zero-public";
import { notFound } from "next/navigation";
import { getFunnelBotUrl } from "@/lib/funnel";
import { COURSE_PRICE } from "@/lib/coursePrice";

const COURSE_ID =
  process.env.PAYMENT_COURSE_ID || "6b8bc0bf-d5b9-4914-b980-b728199d809b";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lecția 1 – RELAȚIA 360 | De la conflict la conectare",
  description:
    "Lecție gratuită: de ce aceleași conflicte revin în relație și ce se întâmplă în comunicare. Continuă cu programul complet.",
};

const PROGRAM_INCLUDE = [
  "5 lecții video practice",
  "explicații clare despre dinamica conflictelor",
  "exerciții aplicate pentru relația ta",
  "caiet PDF de lucru",
  "acces online imediat",
  "acces pentru 6 luni",
];

/**
 * Pagina lecției gratuite: hero, video, clarificare, program complet, ofertă, CTA către bot.
 * Mai scurtă decât landingul principal; livrare lecție, claritate, tranziție spre program, CTA bot.
 */
export default async function LessonZeroPublicPage() {
  const data = await getFirstLessonPublicData(COURSE_ID);
  if (!data) notFound();

  const botUrl = getFunnelBotUrl();

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(to bottom, #f5ede3, #ebdfce)",
        color: "#1F2933",
      }}
    >
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* SECTION 1 — HERO */}
        <section className="pb-8 md:pb-12">
          <h1
            className="text-center text-2xl font-bold uppercase leading-tight text-[#1F2933] md:text-3xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Lecția 1 din programul „Relația 360”
          </h1>
          <p className="mt-4 text-center text-lg leading-relaxed text-[#1F2933]">
            În această lecție vei înțelege de ce aceleași conflicte revin în relație și ce se întâmplă, de fapt, în comunicare atunci când simți că nu mai ajungeți unul la altul.
          </p>
          <p className="mt-4 text-center text-[#6B7280]">
            Privește lecția până la capăt.
            <br />
            După ea poți continua cu programul complet „Relația 360 – De la conflict la conectare”.
          </p>
        </section>

        {/* SECTION 2 — VIDEO */}
        <section className="py-8 md:py-12">
          <h2 className="text-xl font-bold text-[#1F2933] md:text-2xl">
            Lecția 1 – {data.title}
          </h2>
          <p className="mt-2 text-[#6B7280]">
            Aceasta este prima lecție din mini-cursul „Relația 360”.
            <br />
            În această lecție vei observa mai clar tiparul în care intrați ca relație și de ce unele conflicte se repetă fără să ducă la apropiere.
          </p>
          {data.video_url ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-xl">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={data.video_url}
                  title={data.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-black/10 bg-white/80 p-8 text-center text-[#6B7280]">
              Video indisponibil momentan.
            </div>
          )}
        </section>

        {/* SECTION 3 — CLARIFICARE */}
        <section className="py-8 md:py-12">
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2 className="text-xl font-bold text-[#1F2933] md:text-2xl">
              Ce se întâmplă, de fapt, în conflict
            </h2>
            <p className="mt-4 leading-relaxed text-[#6B7280]">
              În relație, conflictul nu apare doar din ceea ce se spune.
              <br /><br />
              De cele mai multe ori apare din felul în care fiecare intră în conversație:
              din tensiuni nespuse, nevoi neexprimate și tipare de comunicare care s-au format între voi în timp.
              <br /><br />
              Această lecție aduce claritate asupra acestor mecanisme.
            </p>
          </div>
        </section>

        {/* SECTION 4 — PROGRAMUL COMPLET */}
        <section className="py-8 md:py-12">
          <h2 className="text-xl font-bold text-[#1F2933] md:text-2xl">
            Programul complet „Relația 360 – De la conflict la conectare”
          </h2>
          <p className="mt-3 text-[#6B7280]">
            Programul merge mai departe și îți arată cum să transformi aceste tipare de comunicare.
          </p>
          <p className="mt-2 text-sm font-semibold text-[#1F2933]">Include:</p>
          <ul className="mt-2 space-y-1.5 text-[#6B7280]">
            {PROGRAM_INCLUDE.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-[#E56B6F]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* SECTION 5 — OFERTĂ */}
        <section className="py-8 md:py-12">
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2 className="text-xl font-bold text-[#1F2933] md:text-2xl">
              Acces la programul complet
            </h2>
            <p className="mt-4 leading-relaxed text-[#6B7280]">
              Pentru următoarele 24 de ore, accesul la program este disponibil la prețul special de <strong className="text-[#1F2933]">{COURSE_PRICE.label}</strong>.
              <br /><br />
              După această perioadă, programul va avea un preț mai mare.
              <br /><br />
              După înscriere primești acces imediat la curs și poți începe prima lecție.
            </p>
          </div>
        </section>

        {/* SECTION 6 — CTA FINAL */}
        <section className="py-10 md:py-14">
          <h2 className="text-center text-xl font-bold text-[#1F2933] md:text-2xl">
            Continuă cu programul complet
          </h2>
          <div className="mt-6 flex justify-center">
            <a
              href={botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-white transition hover:opacity-95"
              style={{
                background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
                boxShadow: "0 4px 12px rgba(229, 107, 111, 0.4)",
              }}
            >
              Intră în program
            </a>
          </div>
          <p className="mt-3 text-center text-sm text-[#6B7280]">
            Vei fi dus în Telegram pentru pașii următori.
          </p>
        </section>

        <p className="pb-12 text-center text-sm text-[#6B7280]">
          <Link href="/conflicte" className="underline hover:no-underline">
            ← Înapoi la prezentarea cursului
          </Link>
        </p>
      </div>
    </div>
  );
}

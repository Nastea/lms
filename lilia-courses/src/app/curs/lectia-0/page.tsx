import Link from "next/link";
import { getFirstLessonPublicData } from "@/lib/lesson-zero-public";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { notFound } from "next/navigation";
import { getFunnelBotUrl } from "@/lib/funnel";

const COURSE_ID =
  process.env.PAYMENT_COURSE_ID || "6b8bc0bf-d5b9-4914-b980-b728199d809b";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lecția 0 – RELAȚIA 360 | De la conflict la conectare",
  description:
    "Lecție gratuită de introducere. Descoperă cum să transformi conflictele în conectare.",
};

const sectionStyle = "py-12 md:py-16";
const cardStyle =
  "rounded-2xl p-6 shadow-lg border border-black/5 bg-white";
const headingStyle =
  "text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#1F2933] mb-6 text-center";

/**
 * Lecția 0: video + descriere + mini landing (ce primește, pentru cine, ce rezolvă, preț, CTA).
 * Butonul de plată duce la botul Telegram (funnel).
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
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Badge + titlu */}
        <p className="mb-2 text-center text-sm font-medium uppercase tracking-wide text-[#6B7280]">
          Lecție gratuită
        </p>
        <h1
          className="text-center text-3xl font-bold uppercase leading-tight text-[#1F2933] md:text-4xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {data.course_title}
        </h1>
        <p className="mt-2 text-center text-xl font-semibold text-[#1F2933]">
          {data.title}
        </p>

        {/* Video */}
        {data.video_url && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-xl">
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
        )}

        {/* Descriere lecție (text vizibil pe fundal deschis) */}
        {data.body_md && (
          <article className="mt-8 space-y-6 rounded-2xl border border-black/5 bg-white/90 p-6 shadow-sm md:p-8">
            <MarkdownRenderer content={data.body_md} theme="light" />
          </article>
        )}

        {/* ---------- Mini landing ---------- */}

        {/* Ce primește */}
        <section className={sectionStyle}>
          <h2 className={headingStyle}>Ce primește</h2>
          <ul className="space-y-3 text-[#1F2933]">
            {[
              "5 lecții practice, ușor de parcurs",
              "Exerciții aplicate, nu doar teorie",
              "Caiet practic PDF",
              "Acces online imediat",
              "Acces pe viață",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-[#E56B6F]">✔</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Pentru cine este */}
        <section className={sectionStyle}>
          <h2 className={headingStyle}>Pentru cine este</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={cardStyle}>
              <h3 className="mb-3 font-semibold text-[#1F2933]">Este pentru:</h3>
              <ul className="space-y-2 text-[#6B7280] text-sm">
                {[
                  "cei care își doresc o relație sănătoasă",
                  "cei în relație cu tensiuni în comunicare",
                  "cei care vor să crească împreună",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#E56B6F]">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={cardStyle}>
              <h3 className="mb-3 font-semibold text-[#1F2933]">NU este pentru:</h3>
              <ul className="space-y-2 text-[#6B7280] text-sm">
                {[
                  "cei care vor să-și schimbe partenerul",
                  "cei care caută vinovați",
                  "cei care vor doar „dreptate”",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#6B7280]">✖</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Ce problemă rezolvă */}
        <section className={sectionStyle}>
          <h2 className={headingStyle}>Ce problemă rezolvă</h2>
          <p className="mb-4 text-center text-[#6B7280]">
            Nu te învață ce să spui „corect”. Te învață cum să comunici astfel încât mesajul tău să fie auzit și primit.
          </p>
          <ul className="mx-auto max-w-2xl space-y-2 text-[#1F2933]">
            {[
              "cum să exprimi nevoile fără presiune",
              "cum să asculți fără să te pierzi pe tine",
              "cum să transformați conflictele în conectare",
              "cum să transmiteți iubirea prin comunicare matură",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E56B6F]/20 text-sm font-semibold text-[#E56B6F]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Preț + CTA */}
        <section className={sectionStyle}>
          <div className={`${cardStyle} text-center`}>
            <p className="text-3xl font-bold text-[#1F2933]">19€</p>
            <p className="mt-1 text-[#6B7280]">acces la tot cursul, pe viață</p>
            <a
              href={botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:opacity-95"
              style={{
                background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
                boxShadow: "0 4px 12px rgba(229, 107, 111, 0.4)",
              }}
            >
              Vreau cursul – plătesc 19€
            </a>
            <p className="mt-3 text-xs text-[#6B7280]">
              Vei fi dus în Telegram pentru finalizarea plății.
            </p>
          </div>
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

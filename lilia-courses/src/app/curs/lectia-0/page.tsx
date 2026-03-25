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
    "9 tehnici practice pentru o comunicare mai bună în cuplu. Lecție gratuită din programul Relația 360.",
};

// Video-ul pentru lecția gratuită (ignoram `data.video_url` ca să se poată actualiza rapid UI-ul).
const FREE_LESSON_VIDEO_SRC = "https://www.youtube.com/embed/Dl4nWskUuTs";

const PROGRAM_FEATURES = [
  "5 lecții video practice",
  "Explicații clare despre dinamica conflictelor",
  "Exerciții aplicate pentru relația ta",
  "Caiet PDF de lucru",
  "Acces online imediat",
  "Acces pentru 6 luni",
] as const;

const TECHNIQUE_GROUPS = [
  {
    num: 1,
    title: "Tehnici calde — care vă apropie emoțional",
    items: [
      { n: 1, name: "Recunoștința sinceră" },
      { n: 2, name: "Ascultarea activă" },
      { n: 3, name: "A fi prezentă" },
    ],
  },
  {
    num: 2,
    title: "Tehnici de compromis — când fiecare are propria opinie",
    items: [
      { n: 4, name: "Spune „Eu” în loc de „Tu”" },
      { n: 5, name: "Tehnica „NOI”" },
      { n: 6, name: "Viziunea feminină și masculină" },
    ],
  },
  {
    num: 3,
    title: "Tehnici pentru conflicte — când tensiunea escaladează",
    items: [
      { n: 7, name: "Pauza" },
      { n: 8, name: "Întrebări de concretizare" },
      { n: 9, name: "Întrebări închise" },
    ],
  },
] as const;

export default async function LessonZeroPublicPage() {
  const data = await getFirstLessonPublicData(COURSE_ID);
  if (!data) notFound();

  const botUrl = getFunnelBotUrl();

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden text-[#2C2118]"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      {/* Top banner */}
      <div
        className="px-4 py-2.5 text-center text-[13px] font-medium tracking-wide text-white"
        style={{ backgroundColor: "#C2735A" }}
      >
        ⏳ Ofertă specială disponibilă pentru următoarele 24 de ore – {COURSE_PRICE.label}
      </div>

      {/* Header */}
      <header
        className="flex items-center justify-between gap-4 border-b px-4 py-5 sm:px-8"
        style={{ borderColor: "#E0D5C8", backgroundColor: "#FAF7F2" }}
      >
        <div
          className="text-[22px] italic"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          Relația <span style={{ color: "#C2735A", fontStyle: "normal" }}>360</span>
        </div>
        <Link
          href="/conflicte"
          className="flex items-center gap-1.5 text-[13px] text-[#8C7A6A] transition-colors hover:text-[#C2735A]"
        >
          ← Înapoi la prezentarea cursului
        </Link>
      </header>

      {/* Hero */}
      <section
        className="border-b px-4 pb-14 pt-12 text-center sm:px-8"
        style={{
          borderColor: "#E0D5C8",
          backgroundColor: "#F0E9DC",
        }}
      >
        <div
          className="mx-auto mb-6 inline-block rounded-full border px-4 py-1.5 text-[12px] font-medium uppercase tracking-widest text-[#8C7A6A]"
          style={{
            backgroundColor: "#fff",
            borderColor: "#E0D5C8",
          }}
        >
          Lecția 1 din programul „Relația 360”
        </div>
        <h1
          className="mx-auto mb-5 max-w-[700px] text-[clamp(28px,5vw,48px)] leading-[1.2]"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          9 tehnici practice pentru o comunicare{" "}
          <em className="italic" style={{ color: "#C2735A" }}>
            mai bună
          </em>{" "}
          în cuplu
        </h1>
        <p className="mx-auto max-w-[560px] text-base leading-relaxed text-[#5C4A38]">
          Descoperă tehnicile pe care le poți folosi chiar astăzi — ușor de implementat, cu rezultat imediat vizibil în relația ta.
        </p>
      </section>

      <main className="mx-auto max-w-[760px] px-4 pb-20 pt-12 sm:px-6">
        {/* Video */}
        {FREE_LESSON_VIDEO_SRC ? (
          <div
            className="mb-12 overflow-hidden rounded-xl shadow-lg"
            style={{ boxShadow: "0 12px 40px rgba(44, 33, 24, 0.12)" }}
          >
            <div className="aspect-video bg-[#2C2118]">
              <iframe
                className="h-full w-full"
                src={FREE_LESSON_VIDEO_SRC}
                title={data.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div
            className="mb-12 flex aspect-video items-center justify-center rounded-xl text-[#8C7A6A]"
            style={{ backgroundColor: "#2C2118" }}
          >
            Video indisponibil momentan.
          </div>
        )}

        {/* About this lesson */}
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#C2735A]">
          Despre această lecție
        </p>
        <h2
          className="mb-4 text-[26px] leading-snug"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          Ce vei învăța în Lecția 1
        </h2>
        <p className="mb-10 text-[15px] leading-[1.75] text-[#5C4A38]">
          Mulți dintre noi am ajuns în situația în care o discuție simplă din cuplu s-a transformat în tensiune, agitație și conflict. Sau invers — te blochezi, nu știi cum să-ți exprimi gândurile, și asta deteriorează relația. În această lecție vei descoperi{" "}
          <strong className="text-[#2C2118]">9 tehnici practice</strong>, grupate în 3 categorii, de la cele mai simple la cele mai complexe — ca să poți aplica imediat ce ai nevoie.
        </p>

        {/* Techniques — titles only, no descriptions */}
        <div className="mb-12">
          {TECHNIQUE_GROUPS.map((group) => (
            <div key={group.num} className="mb-8 last:mb-0">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] text-white"
                  style={{
                    backgroundColor: "#C2735A",
                    fontFamily: "var(--font-heading), Georgia, serif",
                  }}
                >
                  {group.num}
                </div>
                <h3
                  className="text-[19px] leading-snug text-[#2C2118]"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  {group.title}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {group.items.map((t) => (
                  <div
                    key={t.n}
                    className="rounded-[10px] border bg-white px-[18px] py-5"
                    style={{ borderColor: "#E0D5C8" }}
                  >
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[#C2735A]">
                      Tehnica {t.n}
                    </p>
                    <p
                      className="text-base text-[#2C2118]"
                      style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                    >
                      {t.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Author note */}
        <div
          className="mb-12 flex gap-5 rounded-xl border p-7"
          style={{
            backgroundColor: "#F0E9DC",
            borderColor: "#E0D5C8",
          }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl text-white"
            style={{
              backgroundColor: "#C2735A",
              fontFamily: "var(--font-heading), Georgia, serif",
            }}
          >
            L
          </div>
          <p className="text-sm leading-[1.7] text-[#5C4A38]">
            <strong className="text-[#2C2118]">Dubița Lilia</strong> — psiholog și psihoterapeut pentru relații de cuplu. În urma a 8 ani de practică terapeutică în cabinet, lucrând cu diverse cupluri și diverse forme de comunicare, am identificat lucrurile esențiale pe care le poate face fiecare cuplu ca să se simtă conectat și în iubire profundă.{" "}
            <em className="text-[#2C2118]">Orice conflict poate ajunge la conexiune.</em>
          </p>
        </div>

        <hr className="mb-12 border-0 border-t" style={{ borderColor: "#E0D5C8" }} />

        {/* Program CTA block */}
        <div
          className="mb-12 rounded-2xl px-7 py-10 text-white sm:px-9"
          style={{ backgroundColor: "#2C2118" }}
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#E8A48E]">
            Pasul următor
          </p>
          <h2
            className="mb-4 text-2xl leading-snug text-white"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Programul complet „Relația 360 – De la conflict la conectare”
          </h2>
          <p className="mb-7 text-[15px] leading-relaxed text-white/70">
            Programul merge mai departe și îți arată cum să transformi aceste tipare de comunicare în conexiune autentică. Fiecare lecție construiește pe ce ai învățat în lecția anterioară.
          </p>

          <ul className="mb-9 grid list-none grid-cols-1 gap-2.5 sm:grid-cols-2">
            {PROGRAM_FEATURES.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-[14px] leading-snug text-white/85"
              >
                <span className="mt-0.5 shrink-0 text-[12px] text-[#E8A48E]">✦</span>
                {item}
              </li>
            ))}
          </ul>

          <div
            className="rounded-xl border px-6 py-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            <div className="mb-1 flex flex-wrap items-baseline gap-3">
              <span
                className="text-4xl text-white"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                {COURSE_PRICE.label}
              </span>
              <span className="text-[13px] text-white/55">acces complet · 6 luni</span>
            </div>
            <p className="mb-5 text-[13px] text-[#E8A48E]">
              ⏳ Preț special disponibil pentru următoarele 24 de ore
            </p>
            <a
              href={botUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg py-4 text-center text-base font-medium text-white transition hover:-translate-y-px"
              style={{ backgroundColor: "#C2735A" }}
            >
              Intră în program →
            </a>
            <p className="mt-2.5 text-center text-[12px] text-white/45">
              Vei fi dus în Telegram pentru pașii următori
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/conflicte" className="text-sm text-[#8C7A6A] transition-colors hover:text-[#C2735A]">
            ← Înapoi la prezentarea cursului
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white px-4 py-9 text-center sm:px-8" style={{ borderColor: "#E0D5C8" }}>
        <div
          className="mb-3 text-lg italic text-[#2C2118]"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          Relația 360
        </div>
        <div className="mb-4 text-[13px] leading-relaxed text-[#8C7A6A]">
          Danex Prim SRL
          <br />
          mun. Chișinău, sec. Buiucani, str. Calea Ieșilor, 11
          <br />
          Tel: 067102290 · danexprim@liliadubita.md
        </div>
        <div className="mb-5 flex flex-wrap justify-center gap-5">
          <Link href="/termeni" className="text-xs text-[#8C7A6A] hover:text-[#C2735A]">
            Termeni și Condiții
          </Link>
          <Link href="/confidentialitate" className="text-xs text-[#8C7A6A] hover:text-[#C2735A]">
            Politică de Confidențialitate
          </Link>
        </div>
        <div className="mb-5 flex justify-center gap-2">
          <span className="rounded bg-[#1A1F71] px-2.5 py-1 text-[11px] font-bold italic tracking-wide text-white">
            VISA
          </span>
        </div>
        <p className="text-xs" style={{ color: "#E0D5C8" }}>
          © {new Date().getFullYear()} Danex Prim SRL. Toate drepturile rezervate.
        </p>
      </footer>
    </div>
  );
}

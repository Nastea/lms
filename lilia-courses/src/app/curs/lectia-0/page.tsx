import Link from "next/link";
import { getFirstLessonPublicData } from "@/lib/lesson-zero-public";
import { notFound } from "next/navigation";
import { WAITLIST_BOT_URL } from "@/lib/waitlistBotUrl";

const COURSE_ID =
  process.env.PAYMENT_COURSE_ID || "6b8bc0bf-d5b9-4914-b980-b728199d809b";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lecția 1 – RELAȚIA 360 | De la conflict la conectare",
  description:
    "Intră pe lista de așteptare pentru detaliile lansării. Înscrierile se deschid pe 3 aprilie (doar 2 zile). Materiale practice pentru comunicare în cuplu.",
};

// Video-ul pentru lecția gratuită (ignoram `data.video_url` ca să se poată actualiza rapid UI-ul).
const FREE_LESSON_VIDEO_SRC = "https://www.youtube.com/embed/Dl4nWskUuTs";

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
        Înscrierile se deschid pe 3 aprilie și vor fi deschise doar 2 zile. Intră pe lista de așteptare în Telegram.
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
          Lista de așteptare
        </div>
        <h1
          className="mx-auto mb-5 max-w-[700px] text-[clamp(28px,5vw,48px)] leading-[1.2]"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          Intră pe lista de așteptare pentru a primi detaliile lansării
        </h1>
        <p className="mx-auto max-w-[560px] text-base leading-relaxed text-[#5C4A38]">
          Înscrierile se deschid pe 3 aprilie și vor fi deschise doar 2 zile. Intră în Telegram ca să primești prima toate detaliile.
        </p>
      </section>

      <main className="mx-auto max-w-[760px] px-4 pb-20 pt-12 sm:px-6">
        <p className="mb-4 text-center text-[13px] leading-relaxed text-[#8C7A6A]">
          Mai jos găsești lecția de lucru ca material video — detaliile despre lansare le primești pe lista de așteptare.
        </p>
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

        {/* CTA principal — listă de așteptare */}
        <div className="mb-8 flex justify-center">
          <a
            href={WAITLIST_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-10 py-3.5 text-base font-semibold text-white transition hover:opacity-95 active:scale-[0.99]"
            style={{
              backgroundColor: "#C2735A",
              boxShadow: "0 4px 14px rgba(194, 115, 90, 0.35)",
            }}
          >
            Intră
          </a>
        </div>

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

        {/* Program CTA block — listă de așteptare */}
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
            Intră pe lista de așteptare
          </h2>
          <p className="mb-8 text-[15px] leading-relaxed text-white/75">
            Înscrierile pentru programul „Relația 360 – De la conflict la conectare” se deschid pe{" "}
            <strong className="text-white/95">3 aprilie</strong>, iar vânzările vor fi deschise doar{" "}
            <strong className="text-white/95">2 zile</strong>. În Telegram primești toate detaliile despre lansare.
          </p>
          <a
            href={WAITLIST_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg py-4 text-center text-base font-medium text-white transition hover:-translate-y-px"
            style={{ backgroundColor: "#C2735A" }}
          >
            Intră
          </a>
          <p className="mt-3 text-center text-[12px] text-white/45">
            Deschide linkul în Telegram pentru lista de așteptare
          </p>
        </div>

        <div className="text-center">
          <Link href="/conflicte" className="text-sm text-[#8C7A6A] transition-colors hover:text-[#C2735A]">
            ← Înapoi la prezentarea cursului
          </Link>
        </div>
      </main>
    </div>
  );
}

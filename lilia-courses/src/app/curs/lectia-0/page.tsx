import Link from "next/link";
import { getFirstLessonPublicData } from "@/lib/lesson-zero-public";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { notFound } from "next/navigation";

const COURSE_ID =
  process.env.PAYMENT_COURSE_ID || "6b8bc0bf-d5b9-4914-b980-b728199d809b";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lecția 0 – RELAȚIA 360 | De la conflict la conectare",
  description:
    "Lecție gratuită de introducere. Descoperă cum să transformi conflictele în conectare.",
};

/**
 * Public Lesson 0 (lead magnet). No auth required.
 * Video, positioning, CTA to purchase full course.
 */
export default async function LessonZeroPublicPage() {
  const data = await getFirstLessonPublicData(COURSE_ID);
  if (!data) notFound();

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(to bottom, #f5ede3, #ebdfce)",
        color: "#1F2933",
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-wide text-[#6B7280]">
          Lecție gratuită
        </p>
        <h1
          className="text-center text-3xl font-bold uppercase leading-tight md:text-4xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {data.course_title}
        </h1>
        <p className="mt-2 text-center text-xl font-semibold text-[#1F2933]">
          {data.title}
        </p>

        {data.video_url && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-xl">
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

        {data.body_md && (
          <article className="prose-content mt-10 space-y-6 rounded-2xl border border-black/5 bg-white/80 p-6 shadow-sm md:p-8">
            <MarkdownRenderer content={data.body_md} />
          </article>
        )}

        {/* CTA: Buy full course */}
        <div className="mt-12 rounded-2xl border-2 border-[#E56B6F]/30 bg-white/90 p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold text-[#1F2933]">
            Îți place ce ai văzut? Accesează cursul complet
          </h2>
          <p className="mt-2 text-[#6B7280]">
            Toate lecțiile, materiale și suport pentru a transforma conflictele în
            conectare.
          </p>
          <Link
            href="/inscriere"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:opacity-95"
            style={{
              background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
              boxShadow: "0 4px 12px rgba(229, 107, 111, 0.4)",
            }}
          >
            Cumpără cursul →
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-[#6B7280]">
          <Link href="/conflicte" className="underline hover:no-underline">
            ← Înapoi la prezentarea cursului
          </Link>
        </p>
      </div>
    </div>
  );
}

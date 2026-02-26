import { Suspense } from "react";
import { AccesCursForm } from "./AccesCursForm";
import { getFirstLessonUrl } from "@/lib/first-lesson";

export const dynamic = "force-dynamic";

const brand = {
  bg: "linear-gradient(to bottom, #f5ede3, #ebdfce)",
  textMuted: "#6B7280",
};

// Fallback: Relatia 360 course ID dacă PAYMENT_COURSE_ID nu e setat în env (ex. Vercel)
const DEFAULT_COURSE_ID = "6b8bc0bf-d5b9-4914-b980-b728199d809b";

/**
 * /acces-curs — signup for "first lesson free" of a course.
 * Course: ?course=UUID or env PAYMENT_COURSE_ID or default Relatia 360.
 * After signup we redirect to the first lesson of that course.
 */
export default async function AccesCursPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const params = await searchParams;
  const courseId =
    params.course || process.env.PAYMENT_COURSE_ID || DEFAULT_COURSE_ID;
  let firstLessonUrl: string | null = null;
  try {
    if (process.env.FIRST_LESSON_ID?.trim()) {
      firstLessonUrl = `/app/lesson/${process.env.FIRST_LESSON_ID.trim()}`;
      console.log("[acces-curs] firstLessonUrl from FIRST_LESSON_ID env:", firstLessonUrl);
    } else if (courseId) {
      firstLessonUrl = await getFirstLessonUrl(courseId);
      console.log("[acces-curs] courseId:", courseId, "firstLessonUrl:", firstLessonUrl);
    } else {
      console.log("[acces-curs] no courseId, firstLessonUrl stays null");
    }
  } catch (e) {
    console.error("[acces-curs] getFirstLessonUrl error:", e);
  }
  const debug = params.debug === "1" || params.debug === "true";

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: brand.bg }}>
          <span style={{ color: brand.textMuted }}>Se încarcă...</span>
        </div>
      }
    >
      <AccesCursForm
        firstLessonUrl={firstLessonUrl}
        courseTitle="RELAȚIA 360"
        backHref="/conflicte"
        debug={debug}
        debugInfo={
          debug
            ? { courseId, firstLessonUrl, envSet: !!process.env.PAYMENT_COURSE_ID }
            : undefined
        }
      />
    </Suspense>
  );
}

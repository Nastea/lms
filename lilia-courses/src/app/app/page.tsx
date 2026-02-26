import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";
import { syncEntitlementsFromOrders } from "@/lib/sync-entitlements";

export default async function AppHome() {
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user!;

  // Grant entitlements from paid orders (e.g. after payment, when user logs in)
  await syncEntitlementsFromOrders(user);

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();
  const isAdmin = profile?.is_admin ?? false;

  const { data: entitlements } = await supabase
    .from("entitlements")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  const entitledCourseIds = new Set((entitlements ?? []).map((e) => e.course_id));
  const courseIds = Array.from(entitledCourseIds);

  // Published courses (with new RLS we can read courses that have lessons)
  let { data: publishedCourses } = await supabase
    .from("courses")
    .select("id,title,description,cover_url")
    .eq("is_published", true);

  // Fallback: if no published courses, show any course that has lessons (so "Lecția 1 gratuită" still appears)
  if (!publishedCourses?.length) {
    const { data: coursesWithLessons } = await supabase
      .from("courses")
      .select("id,title,description,cover_url");
    publishedCourses = coursesWithLessons ?? [];
  }

  const allDisplayCourses = publishedCourses ?? [];
  const freePreviewCourseIds = allDisplayCourses
    .map((c) => c.id)
    .filter((id) => !entitledCourseIds.has(id));

  // First lesson id per course for "free preview" cards (RPC)
  let firstLessonByCourse = new Map<string, string>();
  if (freePreviewCourseIds.length > 0) {
    const { data: firstLessons } = await supabase.rpc("get_first_lesson_ids", {
      p_course_ids: freePreviewCourseIds,
    });
    (firstLessons ?? []).forEach(
      (row: { course_id: string; first_lesson_id: string }) => {
        firstLessonByCourse.set(row.course_id, row.first_lesson_id);
      }
    );
  }

  // Get all lessons for entitled courses (for progress)
  const { data: allLessons } = await supabase
    .from("lesson_full")
    .select("id,course_id")
    .in("course_id", courseIds.length ? courseIds : ["00000000-0000-0000-0000-000000000000"]);

  const lessonIds = (allLessons ?? []).map((l) => l.id);
  const { data: completedProgress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .not("completed_at", "is", null)
    .in("lesson_id", lessonIds.length ? lessonIds : ["00000000-0000-0000-0000-000000000000"]);

  const completedLessonIds = new Set((completedProgress ?? []).map((p) => p.lesson_id));
  const progressByCourse = new Map<string, { total: number; completed: number }>();

  (allLessons ?? []).forEach((lesson) => {
    const existing = progressByCourse.get(lesson.course_id) || { total: 0, completed: 0 };
    existing.total += 1;
    if (completedLessonIds.has(lesson.id)) {
      existing.completed += 1;
    }
    progressByCourse.set(lesson.course_id, existing);
  });

  const hasAnyCards = allDisplayCourses.length > 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cursurile mele</h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 transition"
            >
              Administrator
            </Link>
          )}
          <form action="/auth/logout" method="post">
            <button className="text-sm opacity-80 hover:opacity-100">Deconectare</button>
          </form>
        </div>
      </div>

      {!hasAnyCards ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-medium">Încă nu ai cursuri disponibile</div>
          <p className="text-sm opacity-80 mt-1">
            Cursurile publicate vor apărea aici. Poți începe cu lecția gratuită sau după ce achiziționezi accesul.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {allDisplayCourses.map((c) => {
            const progress = progressByCourse.get(c.id) || { total: 0, completed: 0 };
            const freeFirstLessonId = firstLessonByCourse.get(c.id) ?? null;
            return (
              <CourseCard
                key={c.id}
                courseId={c.id}
                title={c.title}
                coverUrl={c.cover_url}
                progress={progress}
                freeFirstLessonId={entitledCourseIds.has(c.id) ? null : freeFirstLessonId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}


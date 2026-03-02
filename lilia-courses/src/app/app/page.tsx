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

  // Only show courses the user has purchased (entitled)
  let displayCourses: Array<{ id: string; title: string; description: string | null; cover_url: string | null }> = [];
  if (courseIds.length > 0) {
    const { data: entitledCourses } = await supabase
      .from("courses")
      .select("id,title,description,cover_url")
      .in("id", courseIds)
      .eq("is_published", true);
    displayCourses = entitledCourses ?? [];
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

  const hasAnyCards = displayCourses.length > 0;

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
            După ce achiziționezi un curs, acesta va apărea aici. Poți începe cu{" "}
            <Link href="/curs/lectia-0" className="underline hover:no-underline">
              lecția gratuită
            </Link>{" "}
            pe site sau achiziționa accesul la curs.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {displayCourses.map((c) => {
            const progress = progressByCourse.get(c.id) || { total: 0, completed: 0 };
            return (
              <CourseCard
                key={c.id}
                courseId={c.id}
                title={c.title}
                coverUrl={c.cover_url}
                progress={progress}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}


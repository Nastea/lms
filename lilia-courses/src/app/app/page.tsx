import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import CourseCard from "@/components/CourseCard";
import { syncEntitlementsFromOrders } from "@/lib/sync-entitlements";

// /app is publicly accessible; shows all published courses. Logged-in users see progress and admin link.
export default async function AppHome() {
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user ?? null;

  if (user) {
    await syncEntitlementsFromOrders(user);
  }

  let isAdmin = false;
  let progressByCourse = new Map<string, { total: number; completed: number }>();

  const { data: displayCourses } = await supabaseAdmin
    .from("courses")
    .select("id,title,description,cover_url")
    .eq("is_published", true);

  const courses = displayCourses ?? [];
  const courseIds = courses.map((c) => c.id);

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .maybeSingle();
    isAdmin = profile?.is_admin ?? false;

    const { data: allLessons } = await supabaseAdmin
      .from("lesson_full")
      .select("id,course_id")
      .in("course_id", courseIds.length ? courseIds : ["00000000-0000-0000-0000-000000000000"]);
    const lessonIds = (allLessons ?? []).map((l) => l.id);
    // Progress = "reached" = lessons the user has opened (has progress row)
    const { data: reachedProgress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds.length ? lessonIds : ["00000000-0000-0000-0000-000000000000"]);
    const reachedLessonIds = new Set((reachedProgress ?? []).map((p) => p.lesson_id));
    (allLessons ?? []).forEach((lesson) => {
      const existing = progressByCourse.get(lesson.course_id) || { total: 0, completed: 0 };
      existing.total += 1;
      if (reachedLessonIds.has(lesson.id)) existing.completed += 1;
      progressByCourse.set(lesson.course_id, existing);
    });
  } else {
    courses.forEach((c) => progressByCourse.set(c.id, { total: 0, completed: 0 }));
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cursuri</h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 transition"
            >
              Administrator
            </Link>
          )}
          {user && (
            <form action="/auth/logout" method="post">
              <button className="text-sm opacity-80 hover:opacity-100">Deconectare</button>
            </form>
          )}
          {!user && (
            <Link href="/login" className="text-sm opacity-80 hover:opacity-100">Autentificare</Link>
          )}
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-medium">Niciun curs disponibil momentan</div>
          <p className="text-sm opacity-80 mt-1">
            <Link href="/curs/lectia-0" className="underline hover:no-underline">Lecția gratuită</Link> pe site.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              courseId={c.id}
              title={c.title}
              coverUrl={c.cover_url}
              progress={progressByCourse.get(c.id) || { total: 0, completed: 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

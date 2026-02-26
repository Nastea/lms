import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Returns the first lesson ID for a course (by module sort_order, then lesson sort_order).
 * Uses direct table queries (no RPC) so it works even if get_first_lesson_id isn't deployed.
 */
export async function getFirstLessonId(courseId: string): Promise<string | null> {
  if (!courseId) {
    console.log("[first-lesson] getFirstLessonId: no courseId");
    return null;
  }

  const { data: modules, error: modErr } = await supabaseAdmin
    .from("modules")
    .select("id")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true })
    .limit(1);

  if (modErr) {
    console.error("[first-lesson] modules error:", modErr.message, modErr.code);
    return null;
  }
  if (!modules?.length) {
    console.log("[first-lesson] no modules for course:", courseId);
    return null;
  }

  const firstModuleId = modules[0].id;
  const { data: lessons, error: lesErr } = await supabaseAdmin
    .from("lessons")
    .select("id")
    .eq("module_id", firstModuleId)
    .order("sort_order", { ascending: true })
    .limit(1);

  if (lesErr) {
    console.error("[first-lesson] lessons error:", lesErr.message, lesErr.code);
    return null;
  }
  if (!lessons?.length) {
    console.log("[first-lesson] no lessons for module:", firstModuleId);
    return null;
  }

  const lessonId = lessons[0].id;
  console.log("[first-lesson] first lesson id:", lessonId);
  return lessonId;
}

/**
 * Returns the URL to redirect to after signup for this course (/app/lesson/[id]).
 * Uses FIRST_LESSON_ID env if set (reliable fallback when RPC fails or isn't deployed).
 */
export async function getFirstLessonUrl(courseId: string): Promise<string | null> {
  const fromEnv = process.env.FIRST_LESSON_ID;
  if (fromEnv && fromEnv.trim()) {
    return `/app/lesson/${fromEnv.trim()}`;
  }
  const lessonId = await getFirstLessonId(courseId);
  return lessonId ? `/app/lesson/${lessonId}` : null;
}

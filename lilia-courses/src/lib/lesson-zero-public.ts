import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type LessonZeroPublicData = {
  id: string;
  title: string;
  video_url: string | null;
  body_md: string | null;
  course_title: string;
};

/**
 * Returns the first lesson (by sort order) of a course for public display (lead magnet).
 * Uses admin client so no auth is required. Used by /curs/lectia-0.
 */
export async function getFirstLessonPublicData(
  courseId: string
): Promise<LessonZeroPublicData | null> {
  if (!courseId) return null;

  const { data: modules, error: modErr } = await supabaseAdmin
    .from("modules")
    .select("id")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true })
    .limit(1);

  if (modErr || !modules?.length) return null;

  const { data: lessons, error: lesErr } = await supabaseAdmin
    .from("lessons")
    .select("id, title, video_url, body_md")
    .eq("module_id", modules[0].id)
    .order("sort_order", { ascending: true })
    .limit(1);

  if (lesErr || !lessons?.length) return null;

  const lesson = lessons[0];
  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("title")
    .eq("id", courseId)
    .single();

  return {
    id: lesson.id,
    title: lesson.title,
    video_url: lesson.video_url ?? null,
    body_md: lesson.body_md ?? null,
    course_title: course?.title ?? "Curs",
  };
}

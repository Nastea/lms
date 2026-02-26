import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditLessonUI from "./ui";

export default async function EditLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const supabase = await supabaseServer();

  // Query lessons table directly (admins have write access via "for all" policy which includes SELECT)
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (lessonError || !lesson) {
    redirect("/admin");
  }

  // Get module info
  const { data: module } = await supabase
    .from("modules")
    .select("id, title, course_id")
    .eq("id", lesson.module_id)
    .single();

  if (!module) {
    redirect("/admin");
  }

  // Get course info
  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", module.course_id)
    .single();

  if (!course) {
    redirect("/admin");
  }

  // Format lesson data to match what EditLessonUI expects (same structure as lesson_full view)
  const lessonData = {
    ...lesson,
    course_id: module.course_id,
    module_id: lesson.module_id,
    course_title: course.title,
    module_title: module.title,
  };

  return <EditLessonUI lesson={lessonData} />;
}


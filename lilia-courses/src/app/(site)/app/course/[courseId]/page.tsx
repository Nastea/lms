import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import LessonListItem from "@/components/LessonListItem";

// Course page is publicly accessible (no login required).
export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user ?? null;

  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("id,title,description")
    .eq("id", courseId)
    .single();

  const { data: modules } = await supabaseAdmin
    .from("modules")
    .select("id,title,sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  const moduleIds = (modules ?? []).map((m) => m.id);

  const { data: lessons } = await supabaseAdmin
    .from("lessons")
    .select("id,module_id,title,sort_order,type")
    .in("module_id", moduleIds.length ? moduleIds : ["00000000-0000-0000-0000-000000000000"])
    .order("sort_order", { ascending: true });

  const lessonIds = (lessons ?? []).map((l) => l.id);
  let progress: { lesson_id: string; last_seen_at: string | null }[] = [];
  if (user) {
    const { data: progressData } = await supabase
      .from("lesson_progress")
      .select("lesson_id,last_seen_at")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds.length ? lessonIds : ["00000000-0000-0000-0000-000000000000"]);
    progress = progressData ?? [];
  }

  // Progress = "reached" = lessons the user has opened (has progress row)
  const reachedLessonIds = new Set(progress.map((p) => p.lesson_id));
  const totalLessons = lessons?.length ?? 0;
  const completedCount = progress.length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Determine next lesson and current lesson
  let nextLessonId: string | null = null;
  let currentLessonId: string | null = null;
  
  if (progress && progress.length > 0) {
    const latestProgress = progress.reduce((latest, current) => {
      const latestTime = latest.last_seen_at;
      const currentTime = current.last_seen_at;
      return currentTime && (!latestTime || currentTime > latestTime) ? current : latest;
    });
    
    if (latestProgress) {
      currentLessonId = latestProgress.lesson_id;
    }
  }
  
  // If no progress, pick first lesson by sort_order
  if (!currentLessonId && lessons && lessons.length > 0) {
    // Sort lessons by module sort_order, then lesson sort_order
    const sortedLessons = [...lessons].sort((a, b) => {
      const moduleA = modules?.find(m => m.id === a.module_id);
      const moduleB = modules?.find(m => m.id === b.module_id);
      const moduleOrder = (moduleA?.sort_order ?? 0) - (moduleB?.sort_order ?? 0);
      if (moduleOrder !== 0) return moduleOrder;
      return a.sort_order - b.sort_order;
    });
    currentLessonId = sortedLessons[0]?.id || null;
  }

  // Find next lesson after current
  if (currentLessonId && lessons && modules) {
    const sortedLessons = [...lessons].sort((a, b) => {
      const moduleA = modules.find(m => m.id === a.module_id);
      const moduleB = modules.find(m => m.id === b.module_id);
      const moduleOrder = (moduleA?.sort_order ?? 0) - (moduleB?.sort_order ?? 0);
      if (moduleOrder !== 0) return moduleOrder;
      return a.sort_order - b.sort_order;
    });
    const currentIndex = sortedLessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex >= 0 && currentIndex < sortedLessons.length - 1) {
      nextLessonId = sortedLessons[currentIndex + 1].id;
    }
  }

  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.liliadubita.md").replace(/\/$/, "");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/app" className="text-sm opacity-80 hover:opacity-100">← Înapoi</Link>

      <div className="mt-3">
        <h1 className="text-2xl font-semibold">{course?.title}</h1>
        <p className="text-sm opacity-80 mt-1">{course?.description}</p>
        {totalLessons > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-400">
                {completedCount}/{totalLessons} lecții finalizate
              </span>
              <span className="text-base font-bold text-white">{percentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 transition-all duration-500 shadow-lg shadow-green-400/30"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {(modules ?? []).map((m) => (
          <div key={m.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="font-semibold">{m.title}</div>
            <div className="mt-3 space-y-2">
              {(lessons ?? [])
                .filter((l) => l.module_id === m.id)
                .map((l) => {
                  const isCompleted = reachedLessonIds.has(l.id);
                  const isCurrent = l.id === currentLessonId;
                  const lessonUrl = `${baseUrl}/app/lesson/${l.id}`;
                  return (
                    <LessonListItem
                      key={l.id}
                      lessonId={l.id}
                      title={l.title}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      lessonUrl={lessonUrl}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


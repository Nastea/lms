import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import LessonPageWrapper from "@/components/LessonPageWrapper";
import CompleteButton from "@/components/CompleteButton";
import LessonSidebar from "@/components/LessonSidebar";
import PaywallBanner from "@/components/PaywallBanner";
import { notFound } from "next/navigation";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user!;

  // Paywall: first lesson is free; rest require entitlement
  const { data: paywallRows } = await supabase.rpc("get_lesson_paywall_info", {
    p_lesson_id: lessonId,
  });
  const paywallInfo = paywallRows?.[0] as { course_id: string; course_title: string; is_first_lesson: boolean } | undefined;
  if (!paywallInfo) {
    notFound();
  }
  const hasEntitlement =
    (await supabase
      .from("entitlements")
      .select("course_id")
      .eq("user_id", user.id)
      .eq("course_id", paywallInfo.course_id)
      .eq("status", "active")
      .maybeSingle()).data != null;
  if (!paywallInfo.is_first_lesson && !hasEntitlement) {
    return (
      <LessonPageWrapper>
        <div className="max-w-2xl mx-auto py-16 px-6">
          <Link href="/app" className="text-sm opacity-80 hover:opacity-100">← Înapoi la cursuri</Link>
          <div className="mt-8">
            <PaywallBanner courseTitle={paywallInfo.course_title} />
          </div>
        </div>
      </LessonPageWrapper>
    );
  }

  // Update last_seen_at on every view (server-side)
  await supabase
    .from("lesson_progress")
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      last_seen_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,lesson_id",
    });

  const { data: lesson } = await supabase
    .from("lesson_full")
    .select("*")
    .eq("id", lessonId)
    .single();

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const isDone = !!progress?.completed_at;

  // Fetch all lessons in the course for sidebar
  let sidebarLessons: Array<{ id: string; title: string; module_title: string; isCompleted: boolean }> = [];
  let courseProgress = { total: 0, completed: 0 };
  let nextLessonId: string | null = null;

  if (lesson?.course_id) {
    // Get course info
    const { data: course } = await supabase
      .from("courses")
      .select("id,title")
      .eq("id", lesson.course_id)
      .single();

    // Get modules
    const { data: modules } = await supabase
      .from("modules")
      .select("id,title,sort_order")
      .eq("course_id", lesson.course_id)
      .order("sort_order", { ascending: true });

    const moduleIds = (modules ?? []).map((m) => m.id);
    
    // Get all lessons
    const { data: allLessons } = await supabase
      .from("lessons")
      .select("id,module_id,title,sort_order")
      .in("module_id", moduleIds.length ? moduleIds : ["00000000-0000-0000-0000-000000000000"])
      .order("sort_order", { ascending: true });

    // Get all progress for this course
    const lessonIds = (allLessons ?? []).map((l) => l.id);
    const { data: allProgress } = await supabase
      .from("lesson_progress")
      .select("lesson_id,completed_at")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds.length ? lessonIds : ["00000000-0000-0000-0000-000000000000"]);

    const completedMap = new Map(
      (allProgress ?? []).map((p) => [p.lesson_id, !!p.completed_at])
    );

    // Calculate progress
    courseProgress = {
      total: allLessons?.length ?? 0,
      completed: (allProgress ?? []).filter((p) => p.completed_at !== null).length,
    };

    if (allLessons && modules) {
      // Sort lessons by module sort_order, then lesson sort_order
      const sortedLessons = [...allLessons].sort((a, b) => {
        const moduleA = modules.find((m) => m.id === a.module_id);
        const moduleB = modules.find((m) => m.id === b.module_id);
        const moduleOrder = (moduleA?.sort_order ?? 0) - (moduleB?.sort_order ?? 0);
        if (moduleOrder !== 0) return moduleOrder;
        return a.sort_order - b.sort_order;
      });

      // Build sidebar lessons list
      sidebarLessons = sortedLessons.map((l) => {
        const module = modules.find((m) => m.id === l.module_id);
        return {
          id: l.id,
          title: l.title,
          module_title: module?.title ?? "",
          isCompleted: completedMap.get(l.id) ?? false,
        };
      });

      // Find next lesson
      const currentIndex = sortedLessons.findIndex((l) => l.id === lessonId);
      if (currentIndex >= 0 && currentIndex < sortedLessons.length - 1) {
        nextLessonId = sortedLessons[currentIndex + 1].id;
      }
    }
  }

  return (
    <LessonPageWrapper>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        {lesson?.course_id && (
          <LessonSidebar
            courseId={lesson.course_id}
            courseTitle={lesson.course_title ?? ""}
            currentLessonId={lessonId}
            progress={courseProgress}
            lessons={sidebarLessons}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto py-12 px-6 lg:px-12 space-y-8">
            <header className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-white">{lesson?.title}</h1>
              <div className="text-sm opacity-60 font-medium">
                {lesson?.course_title} • {lesson?.module_title}
              </div>
            </header>

            {lesson?.video_url && (
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl shadow-black/20">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={lesson.video_url}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {lesson?.body_md && (
              <article className="prose-content space-y-6">
                <MarkdownRenderer content={lesson.body_md} />
              </article>
            )}

            {lesson?.pdf_url && (
              <div className="rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <div className="text-base font-semibold text-white">Document PDF</div>
                      <div className="text-sm text-blue-300/90 mt-1">
                        Informații importante pentru lecție
                      </div>
                    </div>
                    <div className="text-sm opacity-75 leading-relaxed">
                      Deschide PDF-ul pentru a accesa materialele suplimentare și informațiile esențiale ale acestei lecții.
                    </div>
                    <a
                      href={lesson.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-500 text-white px-4 py-2 text-sm font-medium hover:bg-blue-400 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Deschide PDF
                    </a>
                  </div>
                </div>
              </div>
            )}

            <CompleteButton lessonId={lessonId} isDone={isDone} nextLessonId={nextLessonId} />
          </div>
        </main>
      </div>
    </LessonPageWrapper>
  );
}


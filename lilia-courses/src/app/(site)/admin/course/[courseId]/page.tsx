import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import StudentManager from "@/components/admin/StudentManager";
import CourseEditForm from "@/components/admin/CourseEditForm";
import ModuleTitleEditor from "@/components/admin/ModuleTitleEditor";

export default async function AdminCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const supabase = await supabaseServer();

  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (courseErr) {
    console.error("Course query error:", courseErr);
    redirect("/admin");
  }

  if (!course) {
    redirect("/admin");
  }

  const { data: modules } = await supabase
    .from("modules")
    .select("id,title,sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  const moduleIds = (modules ?? []).map((m) => m.id);

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id,module_id,title,sort_order,type")
    .in("module_id", moduleIds.length ? moduleIds : ["00000000-0000-0000-0000-000000000000"])
    .order("sort_order", { ascending: true });

  // Get existing entitlements for this course
  const { data: entitlements } = await supabase
    .from("entitlements")
    .select("user_id, status")
    .eq("course_id", courseId);

  // Get user emails (we'll show user_id if email not available)
  const entitlementData = (entitlements ?? []).map(e => ({
    user_id: e.user_id,
    user_email: undefined as string | undefined,
    status: e.status,
  }));


  async function addModule(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    const sort_order = Number(formData.get("sort_order") || 10);
    const courseIdParam = String(formData.get("course_id") || "");

    if (!title) return;

    const supabase = await supabaseServer();
    const { error } = await supabase
      .from("modules")
      .insert({ course_id: courseIdParam, title, sort_order });

    if (error) throw new Error(error.message);
  }

  async function deleteModule(formData: FormData) {
    "use server";
    const module_id = String(formData.get("module_id") || "");
    const supabase = await supabaseServer();
    const { error } = await supabase.from("modules").delete().eq("id", module_id);
    if (error) throw new Error(error.message);
  }

  async function moveModule(formData: FormData) {
    "use server";
    const module_id = String(formData.get("module_id") || "");
    const direction = String(formData.get("direction") || ""); // "up" or "down"
    const courseIdParam = String(formData.get("course_id") || "");

    const supabase = await supabaseServer();

    // Get all modules for this course, ordered
    const { data: allModules } = await supabase
      .from("modules")
      .select("id,sort_order")
      .eq("course_id", courseIdParam)
      .order("sort_order", { ascending: true });

    if (!allModules || allModules.length < 2) return;

    const currentIndex = allModules.findIndex((m) => m.id === module_id);
    if (currentIndex === -1) return;

    // Determine target index
    let targetIndex: number;
    if (direction === "up") {
      if (currentIndex === 0) return; // Already at top
      targetIndex = currentIndex - 1;
    } else {
      if (currentIndex === allModules.length - 1) return; // Already at bottom
      targetIndex = currentIndex + 1;
    }

    const current = allModules[currentIndex];
    const target = allModules[targetIndex];

    // Swap sort_order values using a temporary high value to avoid duplicates
    const tempValue = 999999;
    
    // Set current to temp
    await supabase
      .from("modules")
      .update({ sort_order: tempValue })
      .eq("id", current.id);

    // Set target to current's original value
    await supabase
      .from("modules")
      .update({ sort_order: current.sort_order })
      .eq("id", target.id);

    // Set current to target's original value
    await supabase
      .from("modules")
      .update({ sort_order: target.sort_order })
      .eq("id", current.id);

    revalidatePath(`/admin/course/${courseIdParam}`);
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm opacity-80 hover:opacity-100">← Înapoi</Link>
        <h1 className="text-2xl font-semibold mt-2">Editează curs</h1>
      </div>

      {/* Course settings */}
      <CourseEditForm
        courseId={courseId}
        initialTitle={course.title}
        initialDescription={course.description ?? ""}
        initialCoverUrl={course.cover_url}
        initialIsPublished={course.is_published}
      />

      {/* Student Management */}
      <StudentManager courseId={courseId} existingEntitlements={entitlementData} />

      {/* Add module */}
      <form action={addModule} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
        <input type="hidden" name="course_id" value={courseId} />
        <div className="text-sm font-semibold opacity-90">Adaugă modul</div>
        <input
          name="title"
          className="w-full rounded-xl bg-black/20 border border-white/10 p-3"
          placeholder="Titlul modulului"
          required
        />
        <input
          name="sort_order"
          type="number"
          defaultValue={10}
          className="w-40 rounded-xl bg-black/20 border border-white/10 p-3"
        />
        <button className="rounded-xl bg-white text-black px-4 py-2 font-medium">
          Adaugă modul
        </button>
      </form>

      {/* Modules list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Module</div>
        </div>

        {(modules ?? []).map((m, moduleIndex) => (
          <div key={m.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <ModuleTitleEditor
                moduleId={m.id}
                courseId={courseId}
                initialTitle={m.title}
              />

              <div className="flex items-center gap-2">
                {/* Module ordering controls */}
                <form action={moveModule} className="flex gap-1">
                  <input type="hidden" name="module_id" value={m.id} />
                  <input type="hidden" name="course_id" value={courseId} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={moduleIndex === 0}
                    className="text-xs rounded border border-white/10 bg-black/20 px-2 py-1 hover:bg-black/30 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mută sus"
                  >
                    ↑
                  </button>
                </form>
                <form action={moveModule} className="flex gap-1">
                  <input type="hidden" name="module_id" value={m.id} />
                  <input type="hidden" name="course_id" value={courseId} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={moduleIndex === (modules?.length ?? 0) - 1}
                    className="text-xs rounded border border-white/10 bg-black/20 px-2 py-1 hover:bg-black/30 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mută jos"
                  >
                    ↓
                  </button>
                </form>

                <Link
                  href={`/admin/course/${courseId}/module/${m.id}/new-lesson`}
                  className="text-sm rounded-xl border border-white/10 bg-black/20 px-3 py-2 hover:bg-black/10"
                >
                  + Lecție
                </Link>

                <form action={deleteModule}>
                  <input type="hidden" name="module_id" value={m.id} />
                  <button className="text-sm opacity-80 hover:opacity-100">
                    Șterge
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {(lessons ?? [])
                .filter((l) => l.module_id === m.id)
                .map((l) => (
                  <Link
                    key={l.id}
                    href={`/admin/lesson/${l.id}`}
                    className="block rounded-xl border border-white/10 bg-black/20 px-4 py-3 hover:opacity-80 transition"
                  >
                    <div className="text-sm font-medium">{l.title}</div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewCoursePage() {
  async function createCourse(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!title) return;

    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("courses")
      .insert({ title, description, is_published: false })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    redirect(`/admin/course/${data.id}`);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Curs nou</h1>

      <form action={createCourse} className="mt-6 space-y-3">
        <input
          name="title"
          className="w-full rounded-xl bg-black/20 border border-white/10 p-3"
          placeholder="Titlul cursului"
          required
        />
        <textarea
          name="description"
          className="w-full rounded-xl bg-black/20 border border-white/10 p-3 min-h-[120px]"
          placeholder="Descriere scurtă"
        />
        <button className="rounded-xl bg-white text-black px-4 py-3 font-medium">
          Creează curs
        </button>
      </form>
    </div>
  );
}


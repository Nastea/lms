import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import CourseCardAdmin from "@/components/admin/CourseCardAdmin";

export default async function AdminHome() {
  const supabase = await supabaseServer();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id,title,description,is_published,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin courses query error:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cursuri</h1>
        <Link
          href="/admin/new"
          className="rounded-xl bg-white text-black px-4 py-2 font-medium"
        >
          + Curs nou
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {(courses ?? []).map((c) => (
          <CourseCardAdmin
            key={c.id}
            courseId={c.id}
            title={c.title}
            description={c.description || ""}
            isPublished={c.is_published}
          />
        ))}
      </div>
    </div>
  );
}


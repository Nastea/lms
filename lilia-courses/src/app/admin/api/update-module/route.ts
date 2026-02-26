import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const { ok: isAdmin } = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const moduleId = String(formData.get("module_id") || "");
    const title = String(formData.get("title") || "").trim();
    const courseId = String(formData.get("course_id") || "");

    if (!moduleId || !title) {
      return NextResponse.json({ error: "Module ID and title are required" }, { status: 400 });
    }

    const supabase = await supabaseServer();
    const { error } = await supabase
      .from("modules")
      .update({ title })
      .eq("id", moduleId);

    if (error) {
      console.error("Error updating module:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath(`/admin/course/${courseId}`);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Unexpected error updating module:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}


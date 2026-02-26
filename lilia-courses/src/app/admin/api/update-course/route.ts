import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const is_published = formData.get("is_published") === "on";
    const cover_url = String(formData.get("cover_url") || "").trim() || null;
    const courseId = String(formData.get("course_id") || "");

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const supabase = await supabaseServer();
    const { error } = await supabase
      .from("courses")
      .update({ title, description, is_published, cover_url })
      .eq("id", courseId);

    if (error) {
      console.error("Error updating course:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath(`/admin/course/${courseId}`);
    revalidatePath("/app");
    
    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    return NextResponse.redirect(new URL(`/admin/course/${courseId}`, base));
  } catch (e: any) {
    console.error("Unexpected error updating course:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}


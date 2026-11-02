import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const lesson_id = String(form.get("lesson_id") || "");

    if (!lesson_id) {
      console.error("No lesson_id provided");
      const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
      return NextResponse.redirect(new URL("/app", base));
    }

    const supabase = await supabaseServer();
    const { data: userRes, error: authError } = await supabase.auth.getUser();
    const user = userRes?.user;

    if (authError || !user) {
      console.error("Auth error:", authError);
      const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
      return NextResponse.redirect(new URL("/login", base));
    }

    const { error: upsertError } = await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id,
      completed_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,lesson_id",
    });

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      // Still redirect but log the error
    }

    // Get course_id for revalidation
    const { data: lessonData } = await supabase
      .from("lesson_full")
      .select("course_id")
      .eq("id", lesson_id)
      .single();

    // Revalidate the lesson page to show updated completion status
    revalidatePath(`/app/lesson/${lesson_id}`);
    if (lessonData?.course_id) {
      revalidatePath(`/app/course/${lessonData.course_id}`);
    }

    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    return NextResponse.redirect(new URL(`/app/lesson/${lesson_id}`, base));
  } catch (error) {
    console.error("Progress complete route error:", error);
    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    return NextResponse.redirect(new URL("/app", base));
  }
}


import { NextRequest, NextResponse } from "next/server";
import { getFirstLessonId } from "@/lib/first-lesson";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function resolveFirstLessonId(courseId: string | null | undefined): Promise<string | null> {
  const fromEnv = process.env.FIRST_LESSON_ID?.trim();
  if (fromEnv) {
    const { data, error } = await supabaseAdmin
      .from("lessons")
      .select("id")
      .eq("id", fromEnv)
      .maybeSingle();
    if (!error && data?.id) return data.id;
    console.warn("[first-lesson] FIRST_LESSON_ID not found in DB, falling back to course lookup:", fromEnv);
  }
  if (!courseId) return null;
  return getFirstLessonId(courseId);
}

/**
 * GET /api/first-lesson?course=UUID
 * Returns the first lesson ID for the course.
 * If no course param, uses PAYMENT_COURSE_ID from env (default course).
 */
export async function GET(req: NextRequest) {
  const courseId =
    req.nextUrl.searchParams.get("course") || process.env.PAYMENT_COURSE_ID;
  const firstLessonId = await resolveFirstLessonId(courseId);
  return NextResponse.json({ firstLessonId });
}

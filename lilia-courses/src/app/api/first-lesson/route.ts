import { NextRequest, NextResponse } from "next/server";
import { getFirstLessonId } from "@/lib/first-lesson";

/**
 * GET /api/first-lesson?course=UUID
 * Returns the first lesson ID for the course.
 * If no course param, uses PAYMENT_COURSE_ID from env (default course).
 */
export async function GET(req: NextRequest) {
  const fromEnv = process.env.FIRST_LESSON_ID;
  if (fromEnv && fromEnv.trim()) {
    return NextResponse.json({ firstLessonId: fromEnv.trim() });
  }
  const courseId =
    req.nextUrl.searchParams.get("course") || process.env.PAYMENT_COURSE_ID;
  if (!courseId) {
    return NextResponse.json({ firstLessonId: null }, { status: 200 });
  }
  const firstLessonId = await getFirstLessonId(courseId);
  return NextResponse.json({ firstLessonId });
}

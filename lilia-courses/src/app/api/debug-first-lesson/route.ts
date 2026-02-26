import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getFirstLessonId } from "@/lib/first-lesson";

/**
 * GET /api/debug-first-lesson?course=UUID
 * Returns courseId, firstLessonId, firstLessonUrl, raw RPC response and env for debugging.
 * Remove or restrict in production.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const courseId =
    url.searchParams.get("course") ||
    process.env.PAYMENT_COURSE_ID ||
    "6b8bc0bf-d5b9-4914-b980-b728199d809b";

  const { data: rawRpcData, error: rpcError } = await supabaseAdmin.rpc(
    "get_first_lesson_id",
    { p_course_id: courseId }
  );

  const firstLessonId = await getFirstLessonId(courseId);
  const firstLessonUrl = firstLessonId ? `/app/lesson/${firstLessonId}` : null;

  return NextResponse.json({
    courseId,
    firstLessonId,
    firstLessonUrl,
    rawRpc: {
      data: rawRpcData,
      dataType: typeof rawRpcData,
      isArray: Array.isArray(rawRpcData),
      error: rpcError?.message ?? null,
    },
    env: {
      PAYMENT_COURSE_ID: process.env.PAYMENT_COURSE_ID
        ? `${process.env.PAYMENT_COURSE_ID.slice(0, 8)}...`
        : "not set",
    },
  });
}

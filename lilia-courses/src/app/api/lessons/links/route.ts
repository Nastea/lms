import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * GET /api/lessons/links
 * Returns all lesson links (for SmartSender, sharing, etc.).
 * Only includes lessons from published courses.
 */
export async function GET() {
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.liliadubita.md").replace(/\/$/, "");

  const { data: publishedCourseIds } = await supabaseAdmin
    .from("courses")
    .select("id")
    .eq("is_published", true);

  const courseIds = (publishedCourseIds ?? []).map((c) => c.id);
  if (courseIds.length === 0) {
    return NextResponse.json({ siteUrl: baseUrl, lessons: [] });
  }

  const { data: lessons } = await supabaseAdmin
    .from("lesson_full")
    .select("id, title, course_title, module_title, course_id, sort_order")
    .in("course_id", courseIds)
    .order("course_id")
    .order("sort_order", { ascending: true });

  const list = (lessons ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    courseTitle: l.course_title ?? "",
    moduleTitle: l.module_title ?? "",
    url: `${baseUrl}/app/lesson/${l.id}`,
  }));

  return NextResponse.json({ siteUrl: baseUrl, lessons: list });
}

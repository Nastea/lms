import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const MIMES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".heic": "image/heic",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segs = (await params).path;
  if (!segs?.length) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }
  const requestedPath = path.join(IMAGES_DIR, ...segs);
  const normalized = path.normalize(requestedPath);
  if (!normalized.startsWith(IMAGES_DIR)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const ext = path.extname(normalized).toLowerCase();
  const contentType = MIMES[ext] || "application/octet-stream";

  try {
    const buf = fs.readFileSync(normalized);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") {
      return new NextResponse(null, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

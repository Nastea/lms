"use client";

import { useState } from "react";
import CoverImageUploader from "./CoverImageUploader";

type Props = {
  courseId: string;
  initialTitle: string;
  initialDescription: string;
  initialCoverUrl: string | null;
  initialIsPublished: boolean;
};

export default function CourseEditForm({
  courseId,
  initialTitle,
  initialDescription,
  initialCoverUrl,
  initialIsPublished,
}: Props) {
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl || "");

  return (
    <form action="/admin/api/update-course" method="POST" className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
      <input type="hidden" name="course_id" value={courseId} />
      <input type="hidden" name="cover_url" value={coverUrl} />
      
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold opacity-90">Setări curs</div>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-70">
            {initialIsPublished ? "Publicat" : "Ciornă"}
          </span>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input name="is_published" type="checkbox" defaultChecked={initialIsPublished} />
            <span>Publică</span>
          </label>
        </div>
      </div>
      
      <input
        name="title"
        defaultValue={initialTitle}
        className="w-full rounded-xl bg-black/20 border border-white/10 p-3"
      />
      
      <textarea
        name="description"
        defaultValue={initialDescription ?? ""}
        className="w-full rounded-xl bg-black/20 border border-white/10 p-3 min-h-[120px]"
      />
      
      <CoverImageUploader courseId={courseId} value={coverUrl} onChange={setCoverUrl} />
      
      <button className="rounded-xl bg-white text-black px-4 py-2 font-medium">
        Salvează modificările
      </button>
    </form>
  );
}


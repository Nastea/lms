"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  courseId: string;
  title: string;
  description: string;
  isPublished: boolean;
};

export default function CourseCardAdmin({ courseId, title, description, isPublished }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = confirm(
      `Ești sigur că vrei să ștergi cursul "${title}"?\n\nAceastă acțiune va șterge permanent cursul, toate modulele și lecțiile asociate.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/admin/api/delete-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Eroare la ștergere");
      }

      router.refresh();
    } catch (error: any) {
      alert(`Eroare: ${error.message || "Nu s-a putut șterge cursul"}`);
      setIsDeleting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition relative group">
      <Link href={`/admin/course/${courseId}`} className="block">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold">{title}</div>
            <div className="text-xs opacity-70 mt-1">
              {isPublished ? "publicat" : "ciornă"}
            </div>
            <p className="text-sm opacity-80 mt-1 line-clamp-2">{description}</p>
          </div>
        </div>
      </Link>
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 disabled:opacity-50"
        title="Șterge curs"
      >
        {isDeleting ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>
    </div>
  );
}


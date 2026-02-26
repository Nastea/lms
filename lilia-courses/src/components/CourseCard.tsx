"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type CourseCardProps = {
  courseId: string;
  title: string;
  coverUrl: string | null;
  progress: { total: number; completed: number };
  /** When set, card links to this lesson (first free lesson) instead of course and shows free CTA */
  freeFirstLessonId?: string | null;
};

export default function CourseCard({ courseId, title, coverUrl, progress, freeFirstLessonId }: CourseCardProps) {
  const [imageError, setImageError] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const hasCover = coverUrl && coverUrl.trim() !== "";
  const showPlaceholder = !hasCover || imageError;
  const isFreePreview = !!freeFirstLessonId;

  const percentage = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  // Animate progress bar on mount
  useEffect(() => {
    if (percentage > 0) {
      const timer = setTimeout(() => {
        setProgressWidth(percentage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [percentage]);

  const href = isFreePreview && freeFirstLessonId
    ? `/app/lesson/${freeFirstLessonId}`
    : `/app/course/${courseId}`;

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
    >
      {/* Image section with 16:9 ratio */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        {hasCover && !imageError ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : null}
        
        {/* Elegant placeholder (shown when no cover or image fails) */}
        {showPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Title overlaid on image (bottom-left) */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-semibold text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>

      {/* Progress section below image */}
      <div className="p-5 space-y-3">
        {progress.total > 0 ? (
          <>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 transition-all duration-1000 ease-out"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            
            {/* Percentage text */}
            <div className="text-sm font-medium text-white/90">
              {percentage}% finalizat
            </div>
          </>
        ) : isFreePreview ? (
          <div className="text-sm font-medium text-amber-300/90">Lecția 1 gratuită →</div>
        ) : (
          <div className="text-sm text-white/60">Începe cursul</div>
        )}
      </div>
    </Link>
  );
}


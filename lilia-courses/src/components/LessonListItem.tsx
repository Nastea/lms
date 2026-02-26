"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Props = {
  lessonId: string;
  title: string;
  isCompleted: boolean;
  isCurrent?: boolean;
};

export default function LessonListItem({ lessonId, title, isCompleted, isCurrent = false }: Props) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => setShowBadge(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  return (
    <Link
      href={`/app/lesson/${lessonId}`}
      className={`block rounded-xl border px-4 py-3 transition-all duration-300 ${
        isCurrent
          ? "border-blue-400/50 bg-blue-500/10 shadow-md shadow-blue-500/10"
          : "border-white/10 bg-black/20 hover:bg-black/30 hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-medium">{title}</div>
        {isCompleted && (
          <span
            className={`text-xs text-green-400 font-medium transition-opacity duration-500 ${
              showBadge ? "opacity-100" : "opacity-0"
            }`}
          >
            Finalizat ✓
          </span>
        )}
      </div>
    </Link>
  );
}


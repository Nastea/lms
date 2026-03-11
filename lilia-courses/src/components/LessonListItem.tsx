"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Props = {
  lessonId: string;
  title: string;
  isCompleted: boolean;
  isCurrent?: boolean;
  /** Full URL to this lesson (e.g. for copy link). When set, shown under the title. */
  lessonUrl?: string;
};

export default function LessonListItem({ lessonId, title, isCompleted, isCurrent = false, lessonUrl }: Props) {
  const [showBadge, setShowBadge] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => setShowBadge(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (lessonUrl) {
      navigator.clipboard.writeText(lessonUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-all duration-300 ${
        isCurrent
          ? "border-blue-400/50 bg-blue-500/10 shadow-md shadow-blue-500/10"
          : "border-white/10 bg-black/20 hover:bg-black/30 hover:border-white/20"
      }`}
    >
      <Link href={`/app/lesson/${lessonId}`} className="block">
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
      {lessonUrl && (
        <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/50 truncate max-w-full" title={lessonUrl}>
            {lessonUrl}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-xs text-white/60 hover:text-white underline shrink-0"
          >
            {copied ? "Copiat!" : "Copiază link"}
          </button>
        </div>
      )}
    </div>
  );
}


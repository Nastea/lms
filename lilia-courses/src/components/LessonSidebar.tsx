"use client";

import Link from "next/link";
import { useState } from "react";

type Lesson = {
  id: string;
  title: string;
  module_title: string;
  isCompleted: boolean;
};

type Props = {
  courseId: string;
  courseTitle: string;
  currentLessonId: string;
  progress: { total: number; completed: number };
  lessons: Lesson[];
  /** Lesson IDs that are locked (no entitlement); show lock and link to /plata */
  lockedLessonIds?: string[];
};

export default function LessonSidebar({
  courseId,
  courseTitle,
  currentLessonId,
  progress,
  lessons,
  lockedLessonIds = [],
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  // Group lessons by module
  const lessonsByModule = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.module_title]) {
      acc[lesson.module_title] = [];
    }
    acc[lesson.module_title].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-80 bg-black/95 border-r border-white/10
          z-40 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 space-y-6">
          {/* Course title and progress */}
          <div className="space-y-3">
            <Link
              href={`/app/course/${courseId}`}
              className="block text-lg font-semibold text-white hover:text-white/80 transition-colors"
            >
              {courseTitle}
            </Link>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">{progress.completed}/{progress.total} lecții</span>
                <span className="text-white font-medium">{percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lessons list grouped by module */}
          <nav className="space-y-4">
            {Object.entries(lessonsByModule).map(([moduleTitle, moduleLessons]) => (
              <div key={moduleTitle} className="space-y-2">
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wider px-2">
                  {moduleTitle}
                </div>
                <div className="space-y-1">
                  {moduleLessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isLocked = lockedLessonIds.includes(lesson.id);
                    if (isLocked) {
                      return (
                        <Link
                          key={lesson.id}
                          href="/plata"
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 rounded-lg text-sm transition-all duration-200 text-white/50 hover:text-white/70 hover:bg-white/5"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-white/40 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                            <span className="truncate">{lesson.title}</span>
                          </div>
                        </Link>
                      );
                    }
                    return (
                      <Link
                        key={lesson.id}
                        href={`/app/lesson/${lesson.id}`}
                        onClick={() => setIsOpen(false)}
                        className={`
                          block px-3 py-2 rounded-lg text-sm transition-all duration-200
                          ${isCurrent
                            ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-medium"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          {lesson.isCompleted && (
                            <svg
                              className="w-4 h-4 text-green-400 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  lessonId: string;
  isDone: boolean;
  nextLessonId: string | null;
};

export default function CompleteButton({ lessonId, isDone, nextLessonId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (isDone || isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch("/app/api/progress/complete", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 800);
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 pt-4">
      <form action="/app/api/progress/complete" method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="lesson_id" value={lessonId} />
        <button
          type="submit"
          disabled={isDone || isSubmitting || showSuccess}
          className={`w-full rounded-xl py-4 px-6 font-semibold text-base transition-all duration-300 ${
            isDone || showSuccess
              ? "bg-green-500/20 border-2 border-green-400/40 text-green-300 cursor-default"
              : "bg-white text-black hover:bg-white/95 shadow-lg hover:shadow-xl active:scale-[0.98]"
          } ${showSuccess ? "scale-105" : ""}`}
        >
          {isDone || showSuccess ? (
            <span className="flex items-center justify-center gap-2">
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${showSuccess ? "scale-110 animate-pulse" : ""}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Lecție finalizată
            </span>
          ) : isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Se salvează...
            </span>
          ) : (
            "Marchează ca finalizat"
          )}
        </button>
      </form>

      {(isDone || showSuccess) && nextLessonId && (
        <Link
          href={`/app/lesson/${nextLessonId}`}
          className="block w-full rounded-xl bg-white text-black py-4 px-6 font-semibold text-base text-center hover:bg-white/95 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Următoarea lecție →
        </Link>
      )}
    </div>
  );
}


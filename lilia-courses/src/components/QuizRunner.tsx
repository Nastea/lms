"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { QuizDefinition, ResultKey } from "@/lib/quiz/types";
import { calculateResult } from "@/lib/quiz/result";

type QuizRunnerProps = {
  quiz: QuizDefinition;
  telegramQuizBotBase: string;
};

const TOTAL = 7;

export default function QuizRunner({ quiz, telegramQuizBotBase }: QuizRunnerProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<ResultKey | null>(null);

  const currentAnswer = step < answers.length ? answers[step] : undefined;
  const isLastQuestion = step === TOTAL - 1;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = optionIndex;

        // Advance immediately on click
        if (step === TOTAL - 1) {
          const allAnswers = [...next];
          const result = calculateResult(allAnswers);
          setFinalResult(result);
          setCompleted(true);
        } else {
          setStep(step + 1);
        }

        return next;
      });
    },
    [step]
  );

  if (completed && finalResult) {
    const result = finalResult;
    const telegramStart = `quiz_${quiz.shortId}_${result}`;
    const telegramUrl = `${telegramQuizBotBase}?start=${encodeURIComponent(telegramStart)}`;

    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-8 md:p-10 text-center shadow-xl"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#1F2933" }}>
            Rezultatul tău este gata
          </h2>
          <p className="text-base opacity-90 mb-6" style={{ color: "#6B7280" }}>
            Primește-l acum, imediat, pe Telegram.
          </p>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all hover:opacity-95 active:scale-[0.98] mb-4"
            style={{
              background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
              color: "#FFFFFF",
              boxShadow: "0 4px 16px rgba(229, 107, 111, 0.4)",
            }}
          >
            Primește rezultatul pe Telegram
          </a>

          <Link
            href={`/quiz/${quiz.slug}`}
            className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: "#1F2933" }}
          >
            Refă quiz-ul
          </Link>
        </div>
      </div>
    );
  }

  const question = quiz.questions[step];
  if (!question) return null;

  const progressLabel = `${step + 1}/${TOTAL}`;
  const isFirstStep = step === 0;

  return (
    <div
      className="min-h-dvh w-full flex flex-col px-4 py-6 md:py-8"
      style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce)" }}
    >
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center">
        <Link
          href="/quiz"
          className="text-sm opacity-70 hover:opacity-100 mb-4 inline-block"
          style={{ color: "#1F2933" }}
        >
          ← Înapoi la quiz-uri
        </Link>

        {/* Header: quiz title + intro (outside question card) */}
        <header className="mb-4">
          <h1
            className="text-xl font-semibold mb-1"
            style={{ color: "#1F2933" }}
          >
            {quiz.title}
          </h1>
          <p className="text-sm opacity-80" style={{ color: "#6B7280" }}>
            {quiz.intro}
          </p>
        </header>

        <div
          className="rounded-2xl p-5 md:p-6 flex flex-col"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium opacity-70" style={{ color: "#6B7280" }}>
              {progressLabel}
            </p>
          </div>

          <h2
            className="text-base md:text-lg font-semibold mb-3 leading-snug"
            style={{ color: "#1F2933" }}
          >
            {question.question}
          </h2>

          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = currentAnswer === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(index)}
                  className="w-full text-left rounded-xl py-3 px-4 transition-all duration-200 border-2 text-sm md:text-base"
                  style={{
                    backgroundColor: isSelected ? "rgba(229, 107, 111, 0.12)" : "#faf8f5",
                    borderColor: isSelected ? "#E56B6F" : "#e5d9c8",
                    color: "#1F2933",
                  }}
                >
                  <span className="font-medium">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

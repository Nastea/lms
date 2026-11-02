import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuizBySlug } from "@/lib/quiz/data";
import QuizRunner from "@/components/QuizRunner";

type Props = { params: Promise<{ slug: string }> };

const TELEGRAM_QUIZ_BOT_BASE =
  process.env.TELEGRAM_QUIZ_BOT_BASE ||
  process.env.NEXT_PUBLIC_TELEGRAM_QUIZ_BOT_BASE ||
  "https://t.me/liliadubita_bot";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);
  if (!quiz) return { title: "Quiz | Lilia Dubița" };
  return {
    title: `${quiz.title} | Quiz-uri de relație | Lilia Dubița`,
    description: quiz.description,
  };
}

export default async function QuizSlugPage({ params }: Props) {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);

  if (!quiz) notFound();

  if (!quiz.ready) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-8 text-center"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <h1 className="text-xl font-semibold mb-2" style={{ color: "#1F2933" }}>
            {quiz.title}
          </h1>
          <p className="text-sm opacity-80 mb-6" style={{ color: "#6B7280" }}>
            Acest quiz va fi disponibil în curând.
          </p>
          <Link
            href="/quiz"
            className="inline-block rounded-xl py-3 px-6 font-semibold text-white transition-all hover:opacity-95"
            style={{
              background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
            }}
          >
            Înapoi la quiz-uri
          </Link>
        </div>
      </div>
    );
  }

  return <QuizRunner quiz={quiz} telegramQuizBotBase={TELEGRAM_QUIZ_BOT_BASE} />;
}

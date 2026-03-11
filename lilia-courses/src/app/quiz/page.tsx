import Link from "next/link";
import { getAllQuizzes } from "@/lib/quiz/data";

export const metadata = {
  title: "Quiz-uri de relație | Lilia Dubița",
  description:
    "Alege quiz-ul care îți arată ce se întâmplă, de fapt, în relația voastră.",
};

export default function QuizHubPage() {
  const quizzes = getAllQuizzes();

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "linear-gradient(to bottom, #f5ede3, #ebdfce)" }}
    >
      <section className="py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 max-w-5xl w-full">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4"
            style={{ color: "#1F2933", letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Quiz-uri de relație
          </h1>
          <p
            className="text-center text-lg opacity-90 max-w-xl mx-auto mb-12"
            style={{ color: "#1F2933" }}
          >
            Alege quiz-ul care îți arată ce se întâmplă, de fapt, în relația voastră.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="h-full rounded-2xl p-5 md:p-6 transition-shadow hover:shadow-lg flex flex-col justify-between"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F2933" }}>
                  {quiz.title}
                </h2>
                <p className="text-sm opacity-80 mb-5" style={{ color: "#6B7280" }}>
                  {quiz.description}
                </p>
                {quiz.ready ? (
                  <Link
                    href={`/quiz/${quiz.slug}`}
                    className="inline-block rounded-xl py-3 px-6 font-semibold text-base transition-all hover:opacity-95 active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #E56B6F 0%, #D84A4E 100%)",
                      color: "#FFFFFF",
                      boxShadow: "0 4px 12px rgba(229, 107, 111, 0.35)",
                    }}
                  >
                    Începe quiz-ul
                  </Link>
                ) : (
                  <span
                    className="inline-block rounded-xl py-3 px-6 font-medium text-sm opacity-70"
                    style={{ color: "#6B7280", backgroundColor: "#f3f4f6" }}
                  >
                    În curând
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

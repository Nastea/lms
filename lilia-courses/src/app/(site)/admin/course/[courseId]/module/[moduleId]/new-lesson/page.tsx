import NewLessonForm from "./ui";

export default async function NewLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { courseId, moduleId } = await params;
  return <NewLessonForm courseId={courseId} moduleId={moduleId} />;
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  moduleId: string;
  courseId: string;
  initialTitle: string;
};

export default function ModuleTitleEditor({ moduleId, courseId, initialTitle }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim() === initialTitle || !title.trim()) {
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("module_id", moduleId);
    formData.append("course_id", courseId);
    formData.append("title", title.trim());

    try {
      const response = await fetch("/admin/api/update-module", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Eroare: ${error.error || "Eroare necunoscută"}`);
        setTitle(initialTitle); // Revert on error
      }
    } catch (error) {
      console.error("Error updating module:", error);
      alert("A apărut o eroare la actualizarea titlului.");
      setTitle(initialTitle); // Revert on error
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBlur() {
    if (title.trim() !== initialTitle && title.trim()) {
      const form = document.getElementById(`module-form-${moduleId}`) as HTMLFormElement;
      form?.requestSubmit();
    }
  }

  return (
    <form
      id={`module-form-${moduleId}`}
      onSubmit={handleSubmit}
      className="flex-1"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        disabled={isSubmitting}
        className="w-full rounded-xl bg-black/20 border border-white/10 p-2 font-semibold text-base disabled:opacity-60"
      />
    </form>
  );
}


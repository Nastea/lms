"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PdfUploader from "@/components/admin/PdfUploader";
import { supabaseBrowser } from "@/lib/supabase/client";
import { normalizeVideoUrl, wasUrlConverted } from "@/lib/video-url";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function NewLessonForm({ courseId, moduleId }: { courseId: string; moduleId: string }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [sortOrder, setSortOrder] = useState(10);
  const [type, setType] = useState("text");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [urlConverted, setUrlConverted] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  async function createLesson() {
    setErr(null);
    setBusy(true);
    setUrlConverted(false);

    try {
      if (!title.trim()) throw new Error("Titlul este obligatoriu");

      // Normalize video URL on save
      let normalizedVideoUrl = videoUrl.trim();
      if (normalizedVideoUrl) {
        const original = normalizedVideoUrl;
        normalizedVideoUrl = normalizeVideoUrl(normalizedVideoUrl);
        if (wasUrlConverted(original, normalizedVideoUrl)) {
          setUrlConverted(true);
          setVideoUrl(normalizedVideoUrl);
        }
      }

      const supabase = supabaseBrowser();
      const { error } = await supabase.from("lessons").insert({
        module_id: moduleId,
        title: title.trim(),
        sort_order: sortOrder,
        type,
        video_url: normalizedVideoUrl || null,
        pdf_url: pdfUrl.trim() || null,
        body_md: body.trim() || null,
      });

      if (error) throw error;

      router.push(`/admin/course/${courseId}`);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Eroare la crearea lecției");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <a className="text-sm opacity-80 hover:opacity-100" href={`/admin/course/${courseId}`}>
        ← Înapoi
      </a>
      <h1 className="text-2xl font-semibold">Lecție nouă</h1>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
        <input
          className="w-full rounded-xl bg-black/20 border border-white/10 p-3"
          placeholder="Titlul lecției"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex gap-3">
          <div className="w-40">
            <label className="block text-xs font-medium opacity-70 mb-1.5">
              Număr de ordine
            </label>
            <input
              type="number"
              className="w-full rounded-xl bg-black/20 border border-white/10 p-3"
              placeholder="10"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              min="1"
            />
            <div className="text-xs opacity-60 mt-1">
              Ordinea în modul
            </div>
          </div>
          <select
            className="flex-1 rounded-xl bg-black/20 border border-white/10 p-3"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="video">video</option>
            <option value="text">text</option>
          </select>
        </div>

        <div>
          <input
            className="w-full rounded-xl bg-black/20 border border-white/10 p-3"
            placeholder="URL video (YouTube sau Vimeo - se convertește automat)"
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setUrlConverted(false);
            }}
          />
          {urlConverted && (
            <div className="mt-1 text-xs text-green-400 opacity-80">
              ✓ Convertit în link embed
            </div>
          )}
        </div>

        <PdfUploader
          courseId={courseId}
          moduleId={moduleId}
          value={pdfUrl}
          onChange={setPdfUrl}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium opacity-90">Textul lecției (Markdown)</label>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="text-xs rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 hover:bg-black/30 transition"
            >
              {previewMode ? "Editează" : "Preview"}
            </button>
          </div>
          {previewMode ? (
            <div className="w-full rounded-xl bg-black/20 border border-white/10 p-5 min-h-[220px]">
              {body.trim() ? (
                <MarkdownRenderer content={body} />
              ) : (
                <div className="text-sm opacity-50 italic">Preview-ul va apărea aici...</div>
              )}
            </div>
          ) : (
            <textarea
              className="w-full rounded-xl bg-black/20 border border-white/10 p-3 min-h-[220px] font-mono text-sm"
              placeholder="Scrie textul lecției în Markdown..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          )}
        </div>

        {err && <div className="text-sm text-red-300">{err}</div>}

        <button
          onClick={createLesson}
          disabled={busy}
          className="rounded-xl bg-white text-black px-4 py-3 font-medium disabled:opacity-60"
        >
          {busy ? "Se creează..." : "Creează lecție"}
        </button>

        <div className="text-xs opacity-70">
          Acceptă link-uri normale YouTube/Vimeo (se convertește automat la salvare)
        </div>
      </div>
    </div>
  );
}


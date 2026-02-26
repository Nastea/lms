"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Props = {
  courseId: string;
  value: string;
  onChange: (url: string) => void;
};

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

export default function CoverImageUploader({ courseId, value, onChange }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setErr(null);
    setBusy(true);

    try {
      const supabase = supabaseBrowser();

      // Validate image type
      if (!file.type.startsWith("image/")) {
        throw new Error("Fișierul trebuie să fie o imagine");
      }

      const ext = file.name.split(".").pop() || "jpg";
      const base = safeName(file.name.replace(/\.[^/.]+$/, "")) || "cover";
      const id = (globalThis.crypto?.randomUUID?.() ?? String(Date.now())).replace(/[^a-z0-9-]/gi, "");
      const path = `${courseId}/${base}-${id}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("course-covers")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        });

      if (upErr) throw upErr;

      const { data } = supabase.storage.from("course-covers").getPublicUrl(path);
      if (!data?.publicUrl) throw new Error("Nu s-a returnat URL public");

      onChange(data.publicUrl);
      setFile(null);
    } catch (e: any) {
      setErr(e?.message ?? "Eroare la încărcare");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
      <div className="text-sm font-semibold opacity-90">Imagine copertă</div>
      <div className="text-xs opacity-70">
        Raport de aspect recomandat: <strong>16:9</strong> (ex: 1920x1080px)
      </div>

      <input
        className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm"
        placeholder="URL imagine (se completează automat după încărcare)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        <button
          type="button"
          onClick={upload}
          disabled={!file || busy}
          className="rounded-xl bg-white text-black px-4 py-2 font-medium disabled:opacity-60"
        >
          {busy ? "Se încarcă..." : "Încarcă imagine"}
        </button>
      </div>

      {err && <div className="text-sm text-red-300">{err}</div>}

      {!!value && (
        <div className="space-y-2">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/30">
            <img
              src={value}
              alt="Preview copertă"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
          <a
            className="text-sm opacity-80 hover:opacity-100"
            href={value}
            target="_blank"
            rel="noreferrer"
          >
            Deschide imaginea curentă →
          </a>
        </div>
      )}
    </div>
  );
}


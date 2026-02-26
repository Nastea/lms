"use client";

type Props = {
  courseId: string;
  moduleId: string;
  value: string;
  onChange: (url: string) => void;
};

export default function PdfUploader({ value, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
      <div className="text-sm font-semibold opacity-90">PDF</div>

      <input
        className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm"
        placeholder="Link PDF (Google Drive sau alt serviciu)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="text-xs opacity-70 space-y-1">
        <div>💡 <strong>Google Drive:</strong> Partajează fișierul ca "Oricine cu link-ul" și copiază link-ul</div>
        <div>Format recomandat: <code className="bg-black/30 px-1 rounded">https://drive.google.com/file/d/FILE_ID/view</code></div>
      </div>

      {!!value && (
        <div className="space-y-2">
          <a 
            className="text-sm opacity-80 hover:opacity-100 underline block" 
            href={value} 
            target="_blank" 
            rel="noreferrer"
          >
            Testează link-ul PDF →
          </a>
          <div className="text-xs opacity-60">
            Asigură-te că link-ul este accesibil public sau partajat corect
          </div>
        </div>
      )}
    </div>
  );
}


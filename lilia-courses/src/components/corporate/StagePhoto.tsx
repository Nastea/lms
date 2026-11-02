"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Frame =
  | { key: string; src: string; position?: string; crop?: boolean }
  | { key: string; placeholder: string };

// Jumătatea dreaptă a scenei: rămâne pe ecran și schimbă imaginea după capitolul citit.
// Capitolele se marchează cu data-photo="<key>". Pe telefon e ascunsă (fiecare capitol are banda lui).
export default function StagePhoto({ frames }: { frames: Frame[] }) {
  const [active, setActive] = useState(frames[0].key);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.photo!)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-photo]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="stage-photo" aria-hidden="true">
      {frames.map((f, i) =>
        "placeholder" in f ? (
          <div key={f.key} className={`frame placeholder${active === f.key ? " is-on" : ""}`}>
            <span>{f.placeholder}</span>
          </div>
        ) : (
          <div key={f.key} className={`frame${f.crop ? " crop-strip" : ""}${active === f.key ? " is-on" : ""}`}>
            <Image src={f.src} alt="" fill sizes="48vw" priority={i === 0} style={{ objectPosition: f.position }} />
          </div>
        ),
      )}
    </div>
  );
}

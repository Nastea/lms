"use client";

import { useRef, useState } from "react";
import { CTA, explorerNote, situations, visible } from "@/content/corporate";
import { prefillContact } from "./prefill";

// Explorarea unei situații: ce poate sta în spate → ce am clarifica → ce ține de organizare.
// Nu evaluează nimic; deschide discuția. Cauzele și întrebările apar doar după validarea Liliei.
export default function ChallengeExplorer() {
  const [pick, setPick] = useState<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const choose = (i: number) => {
    setPick(i);
    if (window.matchMedia("(max-width: 820px)").matches) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }));
    }
  };

  const s = pick === null ? null : situations[pick];
  const detailed = s ? visible(s.status) : false;

  return (
    <div className="explorer">
      <fieldset className="situations">
        <legend className="sr-only">Alegeți situația cea mai apropiată</legend>
        {situations.map((x, i) => (
          <label key={x.text} className={pick === i ? "is-on" : undefined}>
            <input type="radio" name="situatie" id={`situatie-${i}`} checked={pick === i} onChange={() => choose(i)} />
            <span>{x.text}</span>
          </label>
        ))}
      </fieldset>

      <div className="explore-panel" ref={panel} aria-live="polite">
        {!s ? (
          <p className="explore-empty">Alegeți situația care seamănă cel mai mult cu ce trăiți acum.</p>
        ) : (
          <>
            {detailed && (
              <div className={`explore-part ${s.status === "de-verificat" ? "pending" : ""}`}>
                <h3>Ce poate sta în spate</h3>
                <ul>{s.causes.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            )}
            {detailed && (
              <div className="explore-part">
                <h3>Ce am clarifica împreună</h3>
                <ul className="questions">{s.questions.map((q) => <li key={q}>{q}</li>)}</ul>
              </div>
            )}
            {detailed && (
              <div className="explore-part">
                <h3>Ce poate schimba managementul</h3>
                <p>{s.organisational}</p>
              </div>
            )}
            <p className="explore-note">{explorerNote}</p>
            <a className="btn" href="#contact" onClick={() => prefillContact({ text: s.text, intent: "Nu încă, vrem să înțelegem situația" })}>
              Discutăm despre această situație
            </a>
          </>
        )}
      </div>
      <p className="hint">
        Altă situație? <a href="#contact" className="link" onClick={() => prefillContact({ text: "" })}>{CTA}</a>
      </p>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { dimensions, level, scoreTest, statements, teamTest, type DimensionId } from "@/content/teamTest";
import { prefillContact } from "./prefill";

type Step = "intro" | number | "result";

// Testul: o afirmație pe ecran, alegerea trece automat mai departe; rezultatul se calculează local, nu se trimite nicăieri.
export default function TeamTest() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const advance = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (step !== "intro") heading.current?.focus({ preventScroll: true });
    return () => clearTimeout(advance.current);
  }, [step]);

  const answer = (i: number, v: number) => {
    const next = [...answers];
    next[i] = v;
    setAnswers(next);
    clearTimeout(advance.current);
    advance.current = setTimeout(() => setStep(i + 1 < statements.length ? i + 1 : "result"), 260);
  };

  const restart = () => {
    setAnswers([]);
    setStep("intro");
  };

  const share = async () => {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) await navigator.share({ title: teamTest.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      /* distribuirea anulată */
    }
  };

  if (step === "intro") {
    return (
      <div className="test">
        <p className="lead">{teamTest.intro}</p>
        <p className="note">{teamTest.note}</p>
        <button className="btn" type="button" onClick={() => setStep(0)}>Începeți testul</button>
      </div>
    );
  }

  if (step === "result") {
    const { scores, profile } = scoreTest(answers);
    const summary = (Object.keys(dimensions) as DimensionId[]).map((d) => `${dimensions[d]}: ${scores[d]}/12`).join("; ");
    return (
      <div className="test test-result">
        <p className="kicker">Rezultatul dumneavoastră</p>
        <h2 ref={heading} tabIndex={-1}>{profile.title}</h2>

        <ul className="bars" aria-label="Scorurile pe dimensiuni">
          {(Object.keys(dimensions) as DimensionId[]).map((d) => (
            <li key={d}>
              <div className="bar-label"><span>{dimensions[d]}</span><span className="muted">{level(scores[d])} · {scores[d]}/12</span></div>
              <div className="bar-track" aria-hidden="true"><div className="bar-fill" style={{ width: `${((scores[d] - 3) / 9) * 100}%` }} /></div>
            </li>
          ))}
        </ul>

        <dl className="result-parts">
          <dt>Ce se vede</dt>
          <dd>{profile.seen}</dd>
          {profile.behind && (<><dt>Ce poate sta în spate</dt><dd>{profile.behind}</dd></>)}
          <dt>{profile.know.label}</dt>
          <dd>{profile.know.text}</dd>
        </dl>

        <div className="ask-team">
          <p className="kicker">O întrebare pentru echipă, săptămâna aceasta</p>
          <p className="ask-q">„{profile.question}”</p>
        </div>

        <p className="muted">Programe legate: {profile.programs.join(" · ")}</p>
        <p className="note">{teamTest.note}</p>

        <div className="test-actions">
          <a className="btn" href="#contact" onClick={() => prefillContact({
            text: `Am făcut testul „${teamTest.title}”. Rezultat: ${profile.title}. ${summary}.`,
            intent: "Nu încă, vrem să înțelegem situația",
          })}>Discutăm despre rezultatul echipei</a>
          <button type="button" className="link-btn" onClick={share}>{copied ? "Link copiat" : "Trimiteți testul unui coleg"}</button>
          <button type="button" className="link-btn" onClick={restart}>Refaceți testul</button>
        </div>
      </div>
    );
  }

  const i = step;
  const s = statements[i];
  return (
    <div className="test">
      <div className="progress" aria-hidden="true"><div style={{ width: `${(i / statements.length) * 100}%` }} /></div>
      <p className="kicker">Afirmația {i + 1} din {statements.length}</p>
      {i === 0 && <p className="muted">{teamTest.instruction}</p>}
      <fieldset className="scale">
        <legend><h2 ref={heading} tabIndex={-1} className="q">{s.text}</h2></legend>
        {teamTest.scale.map((label, v) => (
          <label key={label} className={answers[i] === v ? "is-on" : undefined}>
            <input type="radio" name={`q-${i}`} checked={answers[i] === v} onChange={() => answer(i, v)} onClick={() => answers[i] === v && answer(i, v)} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <div className="test-nav">
        {i > 0 && <button type="button" className="link-btn" onClick={() => setStep(i - 1)}>Înapoi</button>}
        {answers[i] !== undefined && i + 1 < statements.length && (
          <button type="button" className="link-btn" onClick={() => setStep(i + 1)}>Mai departe</button>
        )}
      </div>
    </div>
  );
}

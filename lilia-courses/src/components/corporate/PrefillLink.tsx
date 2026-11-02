"use client";

import { prefillContact, type Prefill } from "./prefill";

export default function PrefillLink({ prefill, children, className = "btn" }: { prefill: Prefill; children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href="#contact" onClick={() => prefillContact(prefill)}>
      {children}
    </a>
  );
}

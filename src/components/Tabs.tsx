"use client";
import { useId, useState } from "react";

// All panels are server-rendered; inactive ones are hidden, so crawlers see everything.
export default function Tabs({
  labels,
  children,
  variant = "pill",
}: {
  labels: string[];
  children: React.ReactNode[];
  variant?: "pill" | "underline";
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setActive((a) => (a + 1) % labels.length);
    if (e.key === "ArrowLeft") setActive((a) => (a - 1 + labels.length) % labels.length);
  };
  return (
    <div>
      <div role="tablist" onKeyDown={onKey} className={variant === "pill" ? "flex flex-wrap gap-2.5" : "flex flex-wrap gap-x-8 gap-y-2 border-b border-line"}>
        {labels.map((l, i) => {
          const on = i === active;
          const cls =
            variant === "pill"
              ? `rounded-full border px-5 py-2.5 text-[15px] font-medium transition-colors ${on ? "border-mark bg-mark text-ink" : "border-line bg-panel text-muted hover:text-text"}`
              : `-mb-px border-b-2 pb-3 text-[16px] font-medium transition-colors ${on ? "border-mark text-text" : "border-transparent text-muted hover:text-text"}`;
          return (
            <button key={l} role="tab" id={`${id}-t${i}`} aria-selected={on} aria-controls={`${id}-p${i}`} tabIndex={on ? 0 : -1} onClick={() => setActive(i)} className={cls}>
              {l}
            </button>
          );
        })}
      </div>
      {children.map((c, i) => (
        <div key={i} role="tabpanel" id={`${id}-p${i}`} aria-labelledby={`${id}-t${i}`} hidden={i !== active} className="pt-8">
          {c}
        </div>
      ))}
    </div>
  );
}

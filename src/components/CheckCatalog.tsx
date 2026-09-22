import Link from "next/link";
import { catalog } from "@/lib/checker";

/** Counts and names come from the engine itself, so they can never overstate it. */
export default function CheckCatalog() {
  const c = catalog();
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {c.groups.map((g) => (
          <div key={g.name} className="card flex h-full flex-col p-7">
            <p className="font-mono text-[13px] font-bold text-mark">{g.checks.length} checks</p>
            <h3 className="mt-3 text-[20px] font-bold leading-snug">{g.name}</h3>
            <p className="mt-2.5 text-[15.5px] text-muted">{g.blurb}</p>
            <ul className="mt-5 space-y-2 border-t border-line pt-5 text-[14.5px] text-muted">
              {g.checks.slice(0, 3).map((k) => (
                <li key={k.id} className="flex gap-2.5"><span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-link" />{k.label}</li>
              ))}
              <li className="pl-4 font-mono text-[13px] text-muted">and {g.checks.length - 3} more</li>
            </ul>
          </div>
        ))}
      </div>
      <details className="faq mt-8 border-t border-line">
        <summary>See the full list of all {c.total} checks</summary>
        <div className="grid gap-x-10 gap-y-8 pb-8 md:grid-cols-2">
          {c.groups.map((g) => (
            <div key={g.name}>
              <p className="eyebrow">{g.name}</p>
              <ol className="mt-3 space-y-1.5 text-[15px] text-muted">
                {g.checks.map((k) => (
                  <li key={k.id} className="flex gap-3">
                    <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-line" />
                    <span>{k.label}{k.free && <span className="ml-2 rounded bg-mark px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-ink">Free</span>}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="pb-6 text-[15px] text-muted">The {c.free} checks marked free run on every report at no cost. <Link className="text-link underline underline-offset-4 hover:text-mark" href="/pricing">One payment</Link> unlocks the rest, forever.</p>
      </details>
    </div>
  );
}

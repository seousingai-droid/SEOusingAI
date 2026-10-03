"use client";
import { useState } from "react";

/** The $5,000 rule: age × repair cost. A rule of thumb, shown as one. */
export default function Calculator() {
  const [age, setAge] = useState(12);
  const [cost, setCost] = useState(450);
  const score = age * cost;
  const replace = score > 5000;
  return (
    <div className="plate p-7 md:p-9">
      <p className="label text-copper">The $5,000 rule</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="font-semibold">System age (years)</span>
          <input type="number" min={1} max={40} value={age} onChange={(e) => setAge(Math.max(0, Number(e.target.value)))} className="mt-2 w-full rounded-md border border-ink/25 bg-white px-4 py-3 text-[1.1rem] font-semibold" />
        </label>
        <label className="block">
          <span className="font-semibold">Repair quote ($)</span>
          <input type="number" min={0} step={25} value={cost} onChange={(e) => setCost(Math.max(0, Number(e.target.value)))} className="mt-2 w-full rounded-md border border-ink/25 bg-white px-4 py-3 text-[1.1rem] font-semibold" />
        </label>
      </div>
      <div className={`mt-6 rounded-md p-5 ${replace ? "bg-copper text-white" : "bg-frost"}`} aria-live="polite">
        <p className="label text-[0.66rem] opacity-80">{age} × ${cost.toLocaleString("en-US")} = {score.toLocaleString("en-US")}</p>
        <p className="display mt-2 text-[1.5rem]">{replace ? "Consider replacing" : "Repairing usually makes sense"}</p>
        <p className="mt-2 opacity-85">{replace ? "Over 5,000, a new, more efficient system often costs less over the next few years than repairs and higher bills." : "Under 5,000, a repair is usually the better value, unless the system has one of the warning signs on this page."}</p>
      </div>
    </div>
  );
}

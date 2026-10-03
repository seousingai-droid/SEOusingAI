"use client";
import { useState } from "react";
import { services } from "@/data/hvac";
import { business, telHref } from "@/data/business";

const urgencies = ["Today: it is not working", "This week", "Planning ahead"];

/** Three short steps instead of one long form: what you need, when, and how to reach you. */
export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [urgency, setUrgency] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="plate p-8" role="status">
        <p className="label text-coolant">Request received</p>
        <h2 className="display mt-3 text-[1.6rem]">We will call you within 15 minutes</h2>
        <p className="mt-3 text-muted">During opening hours. If your AC is out and it is urgent, call <a href={telHref} className="link font-semibold">{business.phone}</a>.</p>
        <p className="label mt-6 text-[0.6rem] text-muted">Demo: on a live site this request is emailed to the company and sent to the owner by text.</p>
      </div>
    );
  }

  const choice = (value: string, current: string, set: (v: string) => void) => (
    <button key={value} type="button" onClick={() => { set(value); setStep(step + 1); }}
      className={`rounded-md border px-4 py-3.5 text-left font-semibold transition-colors ${current === value ? "border-copper bg-copper/10" : "border-ink/20 bg-white hover:border-ink"}`}>{value}</button>
  );

  return (
    <form className="plate p-7 md:p-9" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <div className="flex items-center justify-between">
        <p className="label text-copper">Book a visit</p>
        <p className="label text-[0.66rem] text-muted">Step {step + 1} of 3</p>
      </div>
      <div className="mt-3 h-1 rounded-full bg-line"><div className="h-1 rounded-full bg-copper transition-all" style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>

      {step === 0 && (
        <fieldset className="mt-7">
          <legend className="display text-[1.4rem]">What do you need?</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{[...services.map((s) => s.name), "Maintenance plan", "Something else"].map((v) => choice(v, service, setService))}</div>
        </fieldset>
      )}
      {step === 1 && (
        <fieldset className="mt-7">
          <legend className="display text-[1.4rem]">How soon?</legend>
          <div className="mt-5 grid gap-3">{urgencies.map((v) => choice(v, urgency, setUrgency))}</div>
          <button type="button" onClick={() => setStep(0)} className="link mt-5 text-[0.95rem]">Back</button>
        </fieldset>
      )}
      {step === 2 && (
        <fieldset className="mt-7">
          <legend className="display text-[1.4rem]">How do we reach you?</legend>
          <p className="mt-2 text-[0.95rem] text-muted">{service} · {urgency}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="font-semibold">Name</span><input required name="name" autoComplete="name" className="mt-1.5 w-full rounded-md border border-ink/25 bg-white px-4 py-3" /></label>
            <label className="block"><span className="font-semibold">Phone</span><input required name="phone" type="tel" autoComplete="tel" className="mt-1.5 w-full rounded-md border border-ink/25 bg-white px-4 py-3" /></label>
            <label className="block sm:col-span-2"><span className="font-semibold">Address or ZIP code</span><input required name="address" autoComplete="street-address" className="mt-1.5 w-full rounded-md border border-ink/25 bg-white px-4 py-3" /></label>
            <label className="block sm:col-span-2"><span className="font-semibold">Anything we should know? <span className="font-normal text-muted">(optional)</span></span><textarea name="notes" rows={3} className="mt-1.5 w-full rounded-md border border-ink/25 bg-white px-4 py-3" /></label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-copper">Request a visit</button>
            <button type="button" onClick={() => setStep(1)} className="link text-[0.95rem]">Back</button>
          </div>
        </fieldset>
      )}
    </form>
  );
}

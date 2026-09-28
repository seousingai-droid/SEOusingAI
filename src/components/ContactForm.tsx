"use client";
import { useEffect, useRef, useState } from "react";
import { NEEDS, BUDGETS } from "@/lib/contact";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "error"; message: string; field?: string };

/** The contact form. Sends to /api/contact; if sending is not possible, points to email instead. */
export default function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  // When the form appeared: messages sent within a couple of seconds are bots.
  const started = useRef(0);
  useEffect(() => { started.current = Date.now(); }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, started: started.current }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) return setState({ kind: "sent", name: String(data.name || "").split(" ")[0] });
      if (out.error === "setup" || out.error === "send") {
        return setState({ kind: "error", message: `Our form could not send just now. Please email us at ${email} and we will reply the same way.` });
      }
      setState({ kind: "error", message: out.error || "Something went wrong. Please try again.", field: out.field });
    } catch {
      setState({ kind: "error", message: `No connection. Please try again, or email ${email}.` });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="card p-8 text-center sm:p-10" role="status">
        <span aria-hidden className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf text-white">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
        </span>
        <h2 className="h-md mt-5">Thanks{state.name ? `, ${state.name}` : ""}. Message received.</h2>
        <p className="mt-3 text-muted">We reply within one business day, from {email}. If it is about your website, we will usually take a first look before we answer.</p>
      </div>
    );
  }

  const bad = (f: string) => state.kind === "error" && state.field === f;
  const field = (f: string) => `field ${bad(f) ? "!border-coral" : ""}`;
  return (
    <form onSubmit={submit} className="card p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="lbl" htmlFor="c-name">Your name *</label>
          <input id="c-name" name="name" required maxLength={100} autoComplete="name" className={field("name")} aria-invalid={bad("name")} />
        </div>
        <div>
          <label className="lbl" htmlFor="c-email">Email *</label>
          <input id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" className={field("email")} aria-invalid={bad("email")} />
        </div>
        <div className="sm:col-span-2">
          <label className="lbl" htmlFor="c-website">Your website</label>
          <input id="c-website" name="website" type="text" inputMode="url" maxLength={200} placeholder="yourbusiness.com" className="field" />
        </div>
        <div>
          <label className="lbl" htmlFor="c-need">What do you need?</label>
          <select id="c-need" name="need" className="field" defaultValue={NEEDS[0]}>
            {NEEDS.map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="lbl" htmlFor="c-budget">Budget</label>
          <select id="c-budget" name="budget" className="field" defaultValue={BUDGETS[0]}>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="lbl" htmlFor="c-message">Your message *</label>
          <textarea id="c-message" name="message" required minLength={10} maxLength={5000} rows={6} className={`${field("message")} resize-y`} aria-invalid={bad("message")}
            placeholder="What does your business do, where are your customers, and what would you like to change?" />
        </div>
        {/* Hidden from people, tempting to bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="c-company">Company URL</label>
          <input id="c-company" name="company_url" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      {state.kind === "error" && <p role="alert" className="mt-5 rounded-xl border border-coral/40 bg-[#fff0ed] px-4 py-3 text-[15px] text-[#b3321f]">{state.message}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state.kind === "sending"} className="btn btn-primary disabled:opacity-60">
          {state.kind === "sending" ? "Sending…" : <>Send message <span aria-hidden>→</span></>}
        </button>
        <p className="text-[13.5px] text-muted">We reply within one business day. No newsletter, no spam.</p>
      </div>
    </form>
  );
}

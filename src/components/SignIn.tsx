"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Session = { email: string; plan: "free" | "life" };
type Step = "email" | "code";

/** The gate in front of the checker: email, then the code we send to confirm it. */
export default function SignIn({ onSignedIn, website = "" }: { onSignedIn: (s: Session) => void; website?: string }) {
  const [tab, setTab] = useState<"free" | "key">("free");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(""); const [code, setCode] = useState(""); const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [note, setNote] = useState("");
  const codeBox = useRef<HTMLInputElement>(null);

  useEffect(() => { if (step === "code") codeBox.current?.focus(); }, [step]);

  const post = async (path: string, body: object) => {
    setBusy(true); setError("");
    try {
      const res = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      return await res.json();
    } catch { setError("Could not reach the server. Check your connection and try again."); return null; }
    finally { setBusy(false); }
  };

  const start = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = await post("/api/auth/signin", { email, website });
    if (!d) return;
    if (d.ok && d.sent) { setStep("code"); setNote(`We sent a 6-digit code to ${d.email}. It expires in 10 minutes.`); return; }
    if (d.ok && d.session) { onSignedIn(d.session); return; }   // provider not configured yet
    setError(d.error ?? "Something went wrong. Please try again.");
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = await post("/api/auth/verify", { code });
    if (!d) return;
    if (d.ok) { onSignedIn(d.session); return; }
    setError(d.error ?? "That code is not right.");
    setCode(""); codeBox.current?.focus();
    if (!d.retry) { setStep("email"); setNote(""); }
  };

  const resend = async () => {
    const d = await post("/api/auth/signin", { email, website });
    if (d?.ok) { setNote(`We sent a new code to ${email}.`); setError(""); setCode(""); }
    else setError(d?.error ?? "Could not send another code.");
  };

  return (
    <div className="card overflow-hidden">
      <div role="tablist" aria-label="Sign in" className="flex border-b border-line">
        {([["free", "Free account"], ["key", "I have a key"]] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setError(""); }}
            className={`flex-1 px-5 py-4 text-[16px] font-medium transition-colors ${tab === id ? "bg-panel2 text-text" : "text-muted hover:text-text"}`}>{label}</button>
        ))}
      </div>

      <div className="p-7 sm:p-9">
        {tab === "key" ? (
          <>
            <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold">Sign in with your key</h2>
            <p className="mt-3 max-w-xl text-muted">Paste the licence key from your purchase email to unlock all 94 results and your dashboard.</p>
            <form onSubmit={async (e) => { e.preventDefault(); const d = await post("/api/auth/key", { key, email }); if (d?.ok) onSignedIn(d.session); else setError(d?.error ?? "That key is not valid."); }} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="signin-key" className="sr-only">Your licence key</label>
              <input id="signin-key" className="field font-mono sm:flex-1" placeholder="SUAI-XXXX-XXXX-XXXX-XXXX-XXXX" value={key} onChange={(e) => setKey(e.target.value)} autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
              <button className="btn btn-primary shrink-0 disabled:opacity-60" disabled={busy || key.length < 20}>{busy ? "Checking…" : "Unlock"}</button>
            </form>
            <p className="mt-4 text-[14.5px] text-muted">No key yet? <Link className="text-link underline underline-offset-4 hover:text-mark" href="/pricing">See what lifetime access includes</Link>.</p>
          </>
        ) : step === "email" ? (
          <>
            <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold">Sign in to check your website</h2>
            <p className="mt-3 max-w-xl text-muted">Enter your email and we will send you a 6-digit code. No password to remember, no card.</p>
            <form onSubmit={start} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="signin-email" className="sr-only">Your email address</label>
              <input id="signin-email" type="email" required autoComplete="email" className="field sm:flex-1" placeholder="you@yourbusiness.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn btn-primary shrink-0 disabled:opacity-60" disabled={busy || email.length < 6}>{busy ? "Sending…" : "Send me a code"} {!busy && <span aria-hidden>→</span>}</button>
            </form>
            <p className="mt-4 text-[14.5px] text-muted">We use your email to keep you signed in and to send occasional guides. Unsubscribe any time. See our <Link className="text-link underline underline-offset-4 hover:text-mark" href="/privacy">privacy policy</Link>.</p>
          </>
        ) : (
          <>
            <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold">Check your email</h2>
            <p className="mt-3 max-w-xl text-muted" aria-live="polite">{note}</p>
            <form onSubmit={confirm} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="signin-code" className="sr-only">The 6-digit code from your email</label>
              <input ref={codeBox} id="signin-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" maxLength={6}
                className="field text-center font-mono text-[26px] tracking-[0.4em] sm:flex-1" placeholder="000000"
                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} />
              <button className="btn btn-primary shrink-0 disabled:opacity-60" disabled={busy || code.length !== 6}>{busy ? "Checking…" : "Confirm"}</button>
            </form>
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14.5px] text-muted">
              <span>The email also has a one-click link.</span>
              <button type="button" onClick={resend} disabled={busy} className="text-link underline underline-offset-4 hover:text-mark disabled:opacity-50">Send another code</button>
              <button type="button" onClick={() => { setStep("email"); setError(""); setNote(""); setCode(""); }} className="text-link underline underline-offset-4 hover:text-mark">Use a different email</button>
            </p>
          </>
        )}
        {error && <p role="alert" className="mt-5 rounded-xl border border-[#e5484d]/50 bg-[#e5484d]/10 px-4 py-3 text-[15.5px]">{error}</p>}
      </div>
    </div>
  );
}

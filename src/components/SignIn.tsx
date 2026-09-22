"use client";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";

export type Session = { email: string; plan: "free" | "life" };

/** The gate in front of the checker. Email for a free account, or a key for lifetime access. */
export default function SignIn({ onSignedIn, website = "" }: { onSignedIn: (s: Session) => void; website?: string }) {
  const [tab, setTab] = useState<"free" | "key">("free");
  const [email, setEmail] = useState(""); const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");

  const post = async (path: string, body: object) => {
    setBusy(true); setError("");
    try {
      const res = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const d = await res.json();
      if (d.ok) onSignedIn(d.session); else setError(d.error ?? "Something went wrong. Please try again.");
    } catch { setError("Could not reach the server. Check your connection and try again."); }
    finally { setBusy(false); }
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
        {tab === "free" ? (
          <>
            <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold">Sign in to check your website</h2>
            <p className="mt-3 max-w-xl text-muted">Enter your email to create a free account. You get {site.checklist.freeChecks} results on every check, your audits saved, and no charge.</p>
            <form onSubmit={(e) => { e.preventDefault(); post("/api/auth/signin", { email, website }); }} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="signin-email" className="sr-only">Your email address</label>
              <input id="signin-email" type="email" required autoComplete="email" className="field sm:flex-1" placeholder="you@yourbusiness.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn btn-primary shrink-0 disabled:opacity-60" disabled={busy || email.length < 6}>{busy ? "Signing in…" : "Sign in free"} {!busy && <span aria-hidden>→</span>}</button>
            </form>
            <p className="mt-4 text-[14.5px] text-muted">No password to remember and no card. We use your email to keep you signed in and to send occasional guides. Unsubscribe any time. See our <Link className="text-link underline underline-offset-4 hover:text-mark" href="/privacy">privacy policy</Link>.</p>
          </>
        ) : (
          <>
            <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold">Sign in with your key</h2>
            <p className="mt-3 max-w-xl text-muted">Paste the licence key from your purchase email to unlock all 94 results and your dashboard.</p>
            <form onSubmit={(e) => { e.preventDefault(); post("/api/auth/key", { key, email }); }} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="signin-key" className="sr-only">Your licence key</label>
              <input id="signin-key" className="field font-mono sm:flex-1" placeholder="SUAI-XXXX-XXXX-XXXX-XXXX-XXXX" value={key} onChange={(e) => setKey(e.target.value)} autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
              <button className="btn btn-primary shrink-0 disabled:opacity-60" disabled={busy || key.length < 20}>{busy ? "Checking…" : "Unlock"}</button>
            </form>
            <p className="mt-4 text-[14.5px] text-muted">No key yet? <Link className="text-link underline underline-offset-4 hover:text-mark" href="/pricing">See what lifetime access includes</Link>.</p>
          </>
        )}
        {error && <p role="alert" className="mt-5 rounded-xl border border-[#e5484d]/50 bg-[#e5484d]/10 px-4 py-3 text-[15.5px]">{error}</p>}
      </div>
    </div>
  );
}

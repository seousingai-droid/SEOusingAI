"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import SignIn, { type Session } from "@/components/SignIn";
import { site } from "@/lib/site";

export default function SignInPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    const id = setTimeout(async () => {
      let found: Session | null = null;
      try { found = (await (await fetch("/api/auth/me")).json()).session ?? null; } catch { /* offline */ }
      if (!live) return;
      setSession(found); setReady(true);
    }, 0);
    return () => { live = false; clearTimeout(id); };
  }, []);

  const go = (s: Session) => {
    const next = new URLSearchParams(window.location.search).get("next");
    const safe = next && next.startsWith("/") && !next.startsWith("//") ? next : s.plan === "life" ? "/dashboard" : "/tools/seo-checklist";
    window.location.href = safe;
  };

  const flag = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("expired") ? "expired" : "";

  if (!ready) return <div className="card p-7 text-muted">Loading…</div>;

  if (session) {
    return (
      <div className="card p-7 sm:p-9">
        <p className="eyebrow">Already signed in</p>
        <h2 className="mt-3 text-[clamp(22px,2.6vw,28px)] font-bold">You are signed in as {session.email}</h2>
        <p className="mt-3 text-muted">{session.plan === "life" ? "You have lifetime access to all 94 results." : `Your free account shows ${site.checklist.freeChecks} results on every check.`}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/tools/seo-checklist" className="btn btn-primary">Check a website <span aria-hidden>→</span></Link>
          {session.plan === "life"
            ? <Link href="/dashboard" className="btn btn-ghost">My dashboard</Link>
            : <Link href="/pricing" className="btn btn-ghost">Get lifetime access</Link>}
          <button type="button" onClick={async () => { await fetch("/api/auth/signout", { method: "POST" }); setSession(null); }} className="btn btn-ghost">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {flag === "expired" && <p role="alert" className="card mb-5 border-mark/60 px-5 py-4 text-[15.5px]">That sign-in link has expired. Enter your email below and we will send a fresh code.</p>}
      <SignIn onSignedIn={go} />
    </div>
  );
}

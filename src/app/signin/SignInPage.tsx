"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import SignIn, { type Session } from "@/components/SignIn";
import { tools } from "@/lib/site";

export default function SignInPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let live = true;
    const id = setTimeout(async () => {
      setExpired(!!new URLSearchParams(window.location.search).get("expired"));
      let found: Session | null = null;
      try { found = (await (await fetch("/api/auth/me")).json()).session ?? null; } catch { /* offline */ }
      if (!live) return;
      setSession(found); setReady(true);
    }, 0);
    return () => { live = false; clearTimeout(id); };
  }, []);

  // Only ever return to a page on this site.
  const go = () => {
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : "/tools";
  };

  if (!ready) return <div className="card p-7 text-muted">Loading…</div>;

  if (session) {
    return (
      <div className="card p-7 sm:p-9">
        <p className="eyebrow">Signed in</p>
        <h2 className="mt-3 break-all text-[clamp(22px,2.6vw,28px)] font-bold">{session.email}</h2>
        <p className="mt-3 text-muted">You have access to every free tool. Pick one to start.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="card card-hover p-4 text-[15px] font-medium">{t.name} <span className="text-mark">→</span></Link>
          ))}
        </div>
        <button type="button" onClick={async () => { await fetch("/api/auth/signout", { method: "POST" }); setSession(null); }}
          className="mt-6 text-[15px] text-link underline underline-offset-4 hover:text-mark">Sign out</button>
      </div>
    );
  }

  return (
    <div>
      {expired && <p role="alert" className="card mb-5 border-mark/60 px-5 py-4 text-[15.5px]">That sign-in link has expired. Enter your email below and we will send a fresh code.</p>}
      <SignIn onSignedIn={go} />
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import SignIn, { type Session } from "./SignIn";

/**
 * Shows the tool to signed-in visitors and a quick sign-up to everyone else.
 * Only the interactive part is gated: the explanation around it stays in the
 * page for readers and search engines.
 */
export default function ToolGate({ name, children }: { name: string; children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    let live = true;
    const id = setTimeout(async () => {
      let s: Session | null = null;
      try { s = (await (await fetch("/api/auth/me")).json()).session ?? null; } catch { /* offline */ }
      if (live) setState(s ? "in" : "out");
    }, 0);
    return () => { live = false; clearTimeout(id); };
  }, []);

  if (state === "loading") return <div className="card h-[320px] animate-pulse" aria-label="Loading" />;
  if (state === "in") return <>{children}</>;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <SignIn onSignedIn={() => setState("in")}
        title={`Create a free account to use the ${name}`}
        blurb="Enter your email and we send you a 6-digit code. It takes about twenty seconds, needs no password, and unlocks every free tool on the site." />
      <div className="card p-7">
        <p className="eyebrow">Why we ask</p>
        <p className="mt-3 text-[15.5px] leading-relaxed">The tools are free and stay free. Your email lets us send you the occasional guide, and tell you when we add a new tool.</p>
        <p className="mt-3 text-[14.5px] text-muted">No spam, no card, and you can unsubscribe from any email in one click.</p>
      </div>
    </div>
  );
}

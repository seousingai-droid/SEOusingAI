"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Shows a dashboard link only to people who have unlocked the tool. */
export default function MemberLink({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let live = true;
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (live) setOn(d.session?.plan === "life"); }).catch(() => {});
    return () => { live = false; };
  }, []);
  if (!on) return null;
  return <Link href="/dashboard" className={className}>My dashboard</Link>;
}

import { NextResponse } from "next/server";
import { cleanEmail, cookieOptions, COOKIE, recordLead, sign } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown = {};
  try { body = await req.json(); } catch { /* handled below */ }
  const email = cleanEmail((body as { email?: string }).email);
  if (!email) return NextResponse.json({ ok: false, error: "Enter a valid email address, like you@yourbusiness.com." }, { status: 400 });
  const token = sign({ email, plan: "free", since: Date.now() });
  if (!token) return NextResponse.json({ ok: false, error: "Sign-in is not set up on this server yet." }, { status: 503 });
  await recordLead(email, { website: String((body as { website?: string }).website ?? "").slice(0, 200) });
  const res = NextResponse.json({ ok: true, session: { email, plan: "free" } });
  res.cookies.set(COOKIE, token, cookieOptions);
  return res;
}

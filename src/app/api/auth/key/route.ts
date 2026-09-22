import { NextResponse } from "next/server";
import { verifyKey } from "@/lib/license";
import { cleanEmail, cookieOptions, COOKIE, sign, verify } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown = {};
  try { body = await req.json(); } catch { /* handled below */ }
  const key = String((body as { key?: string }).key ?? "");
  if (!process.env.LICENSE_SECRET) return NextResponse.json({ ok: false, error: "Key checking is not set up on this server yet." }, { status: 503 });
  if (!verifyKey(key)) return NextResponse.json({ ok: false, error: "That key is not valid. Check for typos, or paste it exactly as it appears in your purchase email." }, { status: 400 });
  // Keep the email from an existing session, or take one supplied alongside the key.
  const existing = verify(req.headers.get("cookie")?.match(/suai_session=([^;]+)/)?.[1]);
  const email = existing?.email ?? cleanEmail((body as { email?: string }).email) ?? "member";
  const token = sign({ email, plan: "life", since: Date.now() });
  if (!token) return NextResponse.json({ ok: false, error: "Sign-in is not set up on this server yet." }, { status: 503 });
  const res = NextResponse.json({ ok: true, session: { email, plan: "life" } });
  res.cookies.set(COOKIE, token, cookieOptions);
  return res;
}

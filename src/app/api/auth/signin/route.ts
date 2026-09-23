import { NextResponse } from "next/server";
import { cleanEmail, cookieOptions, COOKIE, recordLead, sign } from "@/lib/session";
import { mailReady, sendCode } from "@/lib/mail";
import { magicToken, newCode, PENDING, pendingCookie, sealPending } from "@/lib/verify";
import { abs } from "@/lib/site";

export const runtime = "nodejs";

// Light throttle so one address cannot be used to send a stream of emails.
const recent = new Map<string, number[]>();
function tooOften(key: string, max: number) {
  const now = Date.now(); const list = (recent.get(key) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now); recent.set(key, list); if (recent.size > 5000) recent.clear();
  return list.length > max;
}

export async function POST(req: Request) {
  let body: unknown = {};
  try { body = await req.json(); } catch { /* handled below */ }
  const email = cleanEmail((body as { email?: string }).email);
  if (!email) return NextResponse.json({ ok: false, error: "Enter a valid email address, like you@yourbusiness.com." }, { status: 400 });

  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (tooOften(`e:${email}`, 5) || tooOften(`i:${ip}`, 15)) {
    return NextResponse.json({ ok: false, error: "Too many sign-in emails just now. Please wait a few minutes." }, { status: 429 });
  }

  // Until an email provider is configured, confirmation cannot happen. Say so
  // rather than pretending a code was sent.
  if (!mailReady()) {
    const token = sign({ email, plan: "free", since: Date.now() });
    if (!token) return NextResponse.json({ ok: false, error: "Sign-in is not set up on this server yet." }, { status: 503 });
    await recordLead(email, { verified: false });
    const res = NextResponse.json({ ok: true, verified: false, session: { email, plan: "free" } });
    res.cookies.set(COOKIE, token, cookieOptions);
    return res;
  }

  const code = newCode();
  const pending = sealPending(email, code);
  const magic = magicToken(email);
  if (!pending || !magic) return NextResponse.json({ ok: false, error: "Sign-in is not set up on this server yet." }, { status: 503 });

  const sent = await sendCode(email, code, abs(`/api/auth/magic?t=${encodeURIComponent(magic)}`));
  if (!sent.ok) return NextResponse.json({ ok: false, error: sent.error, setup: sent.setup ?? false }, { status: 502 });

  const res = NextResponse.json({ ok: true, sent: true, email });
  res.cookies.set(PENDING, pending, pendingCookie);
  return res;
}

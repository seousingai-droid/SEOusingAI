import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Sign-in without a database.
 *
 * A session is a signed cookie holding the person's email and plan. Nothing is
 * stored on our side, so there are no passwords to leak and no account table to
 * maintain. When a database is added later, this file is the only place that
 * needs to know about it.
 */
export const COOKIE = "suai_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Session = { email: string; plan: string; since: number; sites?: string[] };

const secret = () => process.env.AUTH_SECRET || process.env.LICENSE_SECRET || "";
const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const unb64 = (s: string) => Buffer.from(s, "base64url").toString("utf8");
const mac = (body: string, key: string) => createHmac("sha256", key).update(body).digest("base64url");

export function sign(session: Session): string | null {
  const key = secret(); if (!key) return null;
  const body = b64(JSON.stringify(session));
  return `${body}.${mac(body, key)}`;
}

export function verify(token: string | undefined): Session | null {
  const key = secret(); if (!key || !token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(mac(body, key)), got = Buffer.from(sig);
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
  try {
    const s = JSON.parse(unb64(body)) as Session;
    if (!s.email || typeof s.plan !== "string") return null;
    if (s.plan === "life") s.plan = "basic"; // keys issued before plans existed
    if (Date.now() - s.since > MAX_AGE * 1000) return null;
    return s;
  } catch { return null; }
}

export async function currentSession(): Promise<Session | null> {
  return verify((await cookies()).get(COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production",
  path: "/", maxAge: MAX_AGE,
};

/** Accepts the shapes people actually type, and rejects the rest. */
export function cleanEmail(input: unknown): string | null {
  const email = String(input ?? "").trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  if (!/^[^\s@,;:<>()[\]\\]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(email)) return null;
  return email;
}

/**
 * Sends a new sign-up to whatever list tool is configured, so the email is not
 * lost. Set LEAD_WEBHOOK_URL to a Kit, Mailchimp, Zapier, or Formspree endpoint.
 * Failures never block the person signing in.
 */
export async function recordLead(email: string, extra: Record<string, unknown> = {}) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000);
    await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, source: "seousingai.com", at: new Date().toISOString(), ...extra }), signal: ctl.signal });
    clearTimeout(t);
  } catch { /* the person is already signed in; losing the webhook is not their problem */ }
}

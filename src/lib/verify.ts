import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

/**
 * Email confirmation without a database.
 *
 * A pending sign-in is a short-lived signed cookie holding the email, a hash of
 * the six-digit code, an expiry, and an attempt counter. The code itself is only
 * ever in the person's inbox, so a stolen cookie proves nothing.
 *
 * The counter here is held by the client, so someone determined could replay an
 * early copy of the cookie to buy more guesses. That is why the verify route
 * also limits attempts per address on the server. Both are needed: this one
 * gives an honest "2 tries left" message, that one actually stops brute force.
 */
export const PENDING = "suai_pending";
const LIFETIME_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

type Pending = { email: string; hash: string; expires: number; tries: number };

const secret = () => process.env.AUTH_SECRET || process.env.LICENSE_SECRET || "";
const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const unb64 = (s: string) => Buffer.from(s, "base64url").toString("utf8");
const mac = (body: string, key: string) => createHmac("sha256", key).update(body).digest("base64url");
const hashCode = (code: string, email: string, key: string) => mac(`${email}:${code}`, key);

export const newCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

export function sealPending(email: string, code: string, tries = 0): string | null {
  const key = secret(); if (!key) return null;
  const body = b64(JSON.stringify({ email, hash: hashCode(code, email, key), expires: Date.now() + LIFETIME_MS, tries } satisfies Pending));
  return `${body}.${mac(body, key)}`;
}

function openPending(token: string | undefined): Pending | null {
  const key = secret(); if (!key || !token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const want = Buffer.from(mac(body, key)), got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const p = JSON.parse(unb64(body)) as Pending;
    if (!p.email || !p.hash || Date.now() > p.expires) return null;
    return p;
  } catch { return null; }
}

export type CheckResult =
  | { ok: true; email: string }
  | { ok: false; error: string; retry: boolean; cookie?: string };

/** Confirms a typed code. Returns a refreshed cookie while attempts remain. */
export function checkCode(token: string | undefined, typed: string): CheckResult {
  const key = secret(); if (!key) return { ok: false, error: "Sign-in is not set up on this server yet.", retry: false };
  const p = openPending(token);
  if (!p) return { ok: false, error: "That code has expired. Ask for a new one.", retry: false };
  if (p.tries >= MAX_ATTEMPTS) return { ok: false, error: "Too many wrong codes. Ask for a new one.", retry: false };

  const clean = typed.replace(/\D/g, "");
  const want = Buffer.from(p.hash), got = Buffer.from(hashCode(clean, p.email, key));
  if (clean.length === 6 && want.length === got.length && timingSafeEqual(want, got)) return { ok: true, email: p.email };

  const left = MAX_ATTEMPTS - p.tries - 1;
  if (left <= 0) return { ok: false, error: "Too many wrong codes. Ask for a new one.", retry: false };
  const body = b64(JSON.stringify({ ...p, tries: p.tries + 1 } satisfies Pending));
  return { ok: false, error: `That code is not right. ${left} ${left === 1 ? "try" : "tries"} left.`, retry: true, cookie: `${body}.${mac(body, key)}` };
}

/** A one-click link that works even when the email is opened on another device. */
export function magicToken(email: string): string | null {
  const key = secret(); if (!key) return null;
  const body = b64(JSON.stringify({ email, expires: Date.now() + LIFETIME_MS }));
  return `${body}.${mac(body, key)}`;
}

export function openMagic(token: string | undefined): string | null {
  const key = secret(); if (!key || !token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const want = Buffer.from(mac(body, key)), got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const { email, expires } = JSON.parse(unb64(body)) as { email: string; expires: number };
    return email && Date.now() < expires ? email : null;
  } catch { return null; }
}

export const pendingCookie = {
  httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production",
  path: "/", maxAge: Math.floor(LIFETIME_MS / 1000),
};

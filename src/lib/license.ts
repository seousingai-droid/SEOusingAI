import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// Lifetime keys are signed, not stored: SUAI-XXXX-XXXX-XXXX-XXXX-XXXX.
// 12 random characters plus an 8-character signature made with LICENSE_SECRET.
// No database is needed to verify one. Keep LICENSE_SECRET private and never change it,
// or every key issued so far stops working.
const ALPHA = "ABCDEFGHJKMNPQRSTVWXYZ23456789"; // no I, L, O, U, 0, 1: easy to read aloud
const BODY = 12, SIG = 8;

const toAlpha = (buf: Buffer, n: number) => Array.from(buf.subarray(0, n), (b) => ALPHA[b % ALPHA.length]).join("");
const sign = (body: string, secret: string) => toAlpha(createHmac("sha256", secret).update(body).digest(), SIG);
export const format = (raw: string) => "SUAI-" + raw.match(/.{1,4}/g)!.join("-");
export const normalize = (input: string) => input.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^SUAI/, "");

export function issueKey(secret: string) {
  const body = toAlpha(randomBytes(BODY), BODY);
  return format(body + sign(body, secret));
}

export function verifyKey(input: string, secret = process.env.LICENSE_SECRET ?? "") {
  if (!secret) return false;
  const raw = normalize(input);
  if (raw.length !== BODY + SIG) return false;
  const a = Buffer.from(sign(raw.slice(0, BODY), secret)), b = Buffer.from(raw.slice(BODY));
  return a.length === b.length && timingSafeEqual(a, b);
}

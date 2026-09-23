import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// Lifetime keys are signed, not stored: SUAI-XXXX-XXXX-XXXX-XXXX-XXXX.
// 12 random characters plus an 8-character signature made with LICENSE_SECRET.
// No database is needed to verify one. Keep LICENSE_SECRET private and never change it,
// or every key issued so far stops working.
const ALPHA = "ABCDEFGHJKMNPQRSTVWXYZ23456789"; // no I, L, O, U, 0, 1: easy to read aloud
const RANDOM = 11, SIG = 8;
const BODY = RANDOM + 1; // the last body character is the plan

// The plan letter is covered by the signature, so it cannot be edited upwards.
const TIER_CHAR: Record<string, string> = { basic: "B", standard: "S", premium: "P" };
const CHAR_TIER: Record<string, "basic" | "standard" | "premium"> = { B: "basic", S: "standard", P: "premium" };

const toAlpha = (buf: Buffer, n: number) => Array.from(buf.subarray(0, n), (b) => ALPHA[b % ALPHA.length]).join("");
const sign = (body: string, secret: string) => toAlpha(createHmac("sha256", secret).update(body).digest(), SIG);
export const format = (raw: string) => "SUAI-" + raw.match(/.{1,4}/g)!.join("-");
export const normalize = (input: string) => input.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^SUAI/, "");

export function issueKey(secret: string, tier: "basic" | "standard" | "premium" = "basic") {
  const body = toAlpha(randomBytes(RANDOM), RANDOM) + TIER_CHAR[tier];
  return format(body + sign(body, secret));
}

/** Returns the plan the key was issued for, or null if it is not a real key. */
export function readKey(input: string, secret = process.env.LICENSE_SECRET ?? ""): "basic" | "standard" | "premium" | null {
  if (!secret) return null;
  const raw = normalize(input);
  if (raw.length !== BODY + SIG) return null;
  const a = Buffer.from(sign(raw.slice(0, BODY), secret)), b = Buffer.from(raw.slice(BODY));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return CHAR_TIER[raw[RANDOM]] ?? null;
}

export const verifyKey = (input: string, secret = process.env.LICENSE_SECRET ?? "") => readKey(input, secret) !== null;

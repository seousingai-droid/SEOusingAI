#!/usr/bin/env node
// Prints new lifetime keys. Usage: node scripts/issue-license.mjs 3
// Reads LICENSE_SECRET from the environment or from .env.local.
import { readFileSync } from "node:fs";
import { createHmac, randomBytes } from "node:crypto";

let secret = process.env.LICENSE_SECRET;
if (!secret) { try { secret = readFileSync(".env.local", "utf8").match(/^LICENSE_SECRET=(.+)$/m)?.[1]?.trim(); } catch {} }
if (!secret) { console.error("LICENSE_SECRET is not set. Add it to .env.local (and to your host's environment variables)."); process.exit(1); }

const ALPHA = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
const toAlpha = (buf, n) => Array.from(buf.subarray(0, n), (b) => ALPHA[b % ALPHA.length]).join("");
const n = Math.max(1, Math.min(100, Number(process.argv[2] ?? 1)));
for (let i = 0; i < n; i++) {
  const body = toAlpha(randomBytes(12), 12);
  const sig = toAlpha(createHmac("sha256", secret).update(body).digest(), 8);
  console.log("SUAI-" + (body + sig).match(/.{1,4}/g).join("-"));
}

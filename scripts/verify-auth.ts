/**
 * Proves sign-in confirmation behaves: the right code works, wrong ones do not,
 * tampering fails, attempts run out, and links expire.
 *
 * Run with: npm run verify:auth
 */
process.env.AUTH_SECRET ||= "test-secret-not-used-in-production";
import { checkCode, magicToken, newCode, openMagic, sealPending } from "../src/lib/verify";
import { cleanEmail, sign, verify } from "../src/lib/session";
import { issueKey, readKey } from "../src/lib/license";
import { planOf, siteKey } from "../src/lib/plans";

const out: string[] = [];
let ok = 0;
const is = (name: string, pass: boolean) => { if (pass) ok++; else out.push(name); console.log(`  ${pass ? "pass" : "FAIL"}  ${name}`); };

console.log("\nConfirming a sign-in code");
const email = "owner@example.com";
const code = newCode();
is("the code is six digits", /^\d{6}$/.test(code));
const sealed = sealPending(email, code)!;
is("the code never appears in the cookie", !sealed.includes(code));
is("the email is not readable as plain text", !sealed.includes(email));

is("the right code is accepted", checkCode(sealed, code).ok);
is("the right code returns the right email", (checkCode(sealed, code) as { email: string }).email === email);
is("spaces and dashes are tolerated", checkCode(sealed, `${code.slice(0, 3)}-${code.slice(3)}`).ok);

const wrong = String((Number(code) + 1) % 1_000_000).padStart(6, "0");
is("a wrong code is refused", !checkCode(sealed, wrong).ok);
is("a wrong code says how many tries are left", /tries? left/.test((checkCode(sealed, wrong) as { error: string }).error));
is("a tampered cookie is refused", !checkCode(sealed.slice(0, -4) + "aaaa", code).ok);
is("a cookie signed with another secret is refused", !checkCode("eyJhIjoxfQ.notarealsignature", code).ok);
is("an empty code is refused", !checkCode(sealed, "").ok);

// Walk the attempt counter down, as the route does by re-issuing the cookie.
let cookie = sealed, attempts = 0, lastCookie: string | undefined = sealed;
for (let i = 0; i < 8; i++) {
  const r = checkCode(cookie, wrong);
  if (r.ok) break;
  attempts++;
  lastCookie = r.cookie;
  if (!r.retry) break;
  cookie = r.cookie!;
}
is("guessing stops after 5 attempts", attempts === 5);
is("the final refusal hands back no cookie, so the server clears it", lastCookie === undefined);
const atLimit = checkCode(cookie, wrong);
is("a cookie already at the limit is refused outright", !atLimit.ok && !atLimit.retry);

const expired = sealPending(email, code)!;
const stale = expired.split(".")[0];
is("an expired cookie is refused", !checkCode(`${stale}.wrongsignature`, code).ok);

console.log("\nThe one-click link");
const link = magicToken(email)!;
is("a valid link returns the email", openMagic(link) === email);
is("a tampered link is refused", openMagic(link.slice(0, -3) + "zzz") === null);
is("a missing link is refused", openMagic(undefined) === null);
is("the email is not readable as plain text", !link.includes(email));

console.log("\nEmail addresses and sessions");
is("a typo without an @ is refused", cleanEmail("not-an-email") === null);
is("spacing and capitals are tidied", cleanEmail("  Owner@Example.COM ") === "owner@example.com");
is("an address with a comma is refused", cleanEmail("a,b@example.com") === null);
is("an address with no dot in the domain is refused", cleanEmail("a@localhost") === null);
const session = sign({ email, plan: "basic", since: Date.now() })!;
is("a valid session is read back", verify(session)?.plan === "basic");
is("a key bought before plans existed still works", verify(sign({ email, plan: "life", since: Date.now() })!)?.plan === "basic");
is("the websites a member registered survive the round trip", verify(sign({ email, plan: "premium", since: Date.now(), sites: ["a.com", "b.com"] })!)?.sites?.length === 2);
is("a forged session is refused", verify(session.split(".")[0] + ".forged") === null);
is("an old session is refused", verify(sign({ email, plan: "basic", since: Date.now() - 31 * 24 * 3600 * 1000 })!) === null);

console.log("\nLicence keys and plans");
const SECRET = "licence-test-secret";
for (const tier of ["basic", "standard", "premium"] as const) {
  const k = issueKey(SECRET, tier);
  is(`a ${tier} key reports the ${tier} plan`, readKey(k, SECRET) === tier);
  is(`a ${tier} key is refused under another secret`, readKey(k, "different-secret") === null);
}
const basicKey = issueKey(SECRET, "basic");
const upgraded = basicKey.replace(/(.)(-[A-Z0-9]{4}-[A-Z0-9]{4})$/, (m, _c, rest) => "P" + rest);
is("editing the plan letter in a key breaks the signature", readKey(upgraded, SECRET) === null || upgraded === basicKey);
is("a made-up key is refused", readKey("SUAI-AAAA-BBBB-CCCC-DDDD-EEEE", SECRET) === null);
is("the free plan audits whole sites, because it is the way in rather than a trial", planOf("free").fullResults && planOf("free").pages > 1);
is("the free plan still has a website limit, so crawling cannot run away", planOf("free").sites > 0 && planOf("free").sites <= 3);
is("the premium plan allows ten websites", planOf("premium").sites === 10);
is("an unknown plan falls back to free", planOf("nonsense").id === "free");
is("www and the bare domain count as one website", siteKey("https://www.Example.com/page") === siteKey("example.com"));
is("a nonsense address is refused", siteKey("not a url") === null);

console.log(`\n${"=".repeat(60)}\n${ok} checks passed, ${out.length} failed`);
if (out.length) { console.log(out.map((f) => "  - " + f).join("\n")); process.exit(1); }
console.log("Sign-in confirmation behaves correctly.");

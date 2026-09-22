import { site } from "./site";

/**
 * Sends the confirmation email through Resend.
 *
 * Set RESEND_API_KEY and MAIL_FROM to switch confirmation on. Until then the
 * site says so plainly rather than pretending an email was sent.
 */
export const mailReady = () => !!process.env.RESEND_API_KEY;

const escape = (s: string) => s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);

export async function sendCode(to: string, code: string, link: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Email sending is not set up on this server yet." };
  const from = process.env.MAIL_FROM || `${site.name} <onboarding@resend.dev>`;

  const html = `<!doctype html><html><body style="margin:0;background:#f4f5f8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f8;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden">
  <tr><td style="background:#0a0f1f;padding:24px 28px;color:#ffffff;font-size:18px;font-weight:700">SEO<span style="color:#97a3c7">using</span>AI</td></tr>
  <tr><td style="padding:32px 28px 8px;color:#0a0f1f;font-size:20px;font-weight:700">Your sign-in code</td></tr>
  <tr><td style="padding:0 28px;color:#4a5568;font-size:15px;line-height:1.6">Enter this code to finish signing in. It expires in 10 minutes.</td></tr>
  <tr><td align="center" style="padding:24px 28px">
    <div style="display:inline-block;background:#ffd84d;color:#0a0f1f;font-size:34px;font-weight:700;letter-spacing:8px;padding:16px 26px;border-radius:12px;font-family:ui-monospace,Menlo,Consolas,monospace">${escape(code)}</div>
  </td></tr>
  <tr><td align="center" style="padding:0 28px 28px">
    <a href="${escape(link)}" style="display:inline-block;background:#0a0f1f;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;border-radius:10px">Or sign in with one click</a>
  </td></tr>
  <tr><td style="padding:0 28px 28px;color:#8a94a6;font-size:13px;line-height:1.6;border-top:1px solid #eceef2;padding-top:20px">If you did not ask to sign in to ${escape(site.domain)}, ignore this email. Nobody can use the code without it.</td></tr>
</table>
</td></tr></table></body></html>`;

  const textBody = `Your sign-in code for ${site.domain} is ${code}\n\nIt expires in 10 minutes.\nOr sign in with one click: ${link}\n\nIf you did not ask to sign in, ignore this email.`;

  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 10000);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to, subject: `${code} is your sign-in code`, html, text: textBody }),
      signal: ctl.signal,
    });
    clearTimeout(t);
    if (res.ok) return { ok: true };
    const detail = await res.text();
    console.error("Resend refused the email:", res.status, detail.slice(0, 300));
    return { ok: false, error: "We could not send the email just now. Please try again in a moment." };
  } catch {
    return { ok: false, error: "We could not send the email just now. Please try again in a moment." };
  }
}

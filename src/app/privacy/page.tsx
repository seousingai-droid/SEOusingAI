import { pageMeta } from "@/lib/meta";
import Simple from "@/components/Simple";
import { site } from "@/lib/site";
export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "What data SEO Using AI collects, what it does not collect, and your choices.",
  path: "/privacy",
});
export default function Page() {
  return (
    <Simple name="Privacy policy" href="/privacy" eyebrow="Legal" title="Privacy policy">
      <p>Last updated September 20, 2026.</p>
      <h2>What do we collect?</h2>
      <p>This site has no accounts and no comment system. Most of the free tools run entirely in your browser, and what you type into them is never sent to our servers. The SEO Checklist Checker is the exception: the website address you enter is sent to our server so it can open that page and check it. We do not store the address or the report. If you unlock the tool, your licence key, your saved audit history, and the jobs you tick off are stored in your own browser only. We never receive a copy, and you can export or erase all of it from your dashboard at any time.</p>
      <p>Our hosting provider keeps standard server logs, such as IP address, browser type, and pages requested, for security and reliability. If we add privacy-friendly analytics, this page will be updated before it goes live.</p>
      <h2>What happens when you sign in?</h2>
      <p>The website checker asks for an email address so it can save your audits and keep you signed in. We store that email in a signed cookie in your browser, which is how we recognise you on your next visit. If you ask us to, we also add it to our email list so we can send occasional guides, and you can unsubscribe from any of them. We do not sell or share it.</p>
      <p>You can sign out at any time, which deletes the cookie. Your saved audit history and the jobs you tick off stay in your own browser and can be exported or erased from your dashboard.</p>

      <h2>Do we use cookies?</h2>
      <p>The site sets one cookie, and only after you sign in: it holds your email address and whether you have lifetime access. There are no advertising or tracking cookies. If you click an affiliate link, the destination site may set its own cookies under its own privacy policy.</p>
      <h2>What happens when you book a call?</h2>
      <p>Calls are booked through Google Calendar and held on Google Meet. The name, email address, and notes you enter are handled by Google under its privacy policy and are used only to arrange and hold the call.</p>
      <h2>What happens when you email us?</h2>
      <p>If you email us, we use your address and message only to reply. We do not sell or share personal information.</p>
      <h2>What are your rights?</h2>
      <p>Depending on where you live, including California and the European Union, you may have the right to access or delete personal information we hold about you. Email <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond.</p>
    </Simple>
  );
}

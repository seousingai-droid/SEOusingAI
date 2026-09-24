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
      <p>The free tools ask you to create an account with your email address. That is the only personal information we ask for. What you type into the tools themselves runs in your browser and is never sent to us.</p>
      <p>Our hosting provider keeps standard server logs, such as IP address, browser type, and pages requested, for security and reliability. If we add privacy-friendly analytics, this page will be updated before it goes live.</p>

      <h2>Do we use cookies?</h2>
      <p>The site sets one cookie, and only after you sign in: it holds your email address so you stay signed in. There are no advertising or tracking cookies. If you click an affiliate link, the destination site may set its own cookies under its own privacy policy.</p>

      <h2>What happens when you sign up?</h2>
      <p>We send a six-digit code to confirm the address is yours. If you agree, we add it to our email list for the occasional guide, and every email has a one-click unsubscribe. We do not sell or share it. You can sign out at any time, which deletes the cookie.</p>

      <h2>What happens when you book a call?</h2>
      <p>Calls are booked through Google Calendar and held on Google Meet. The name, email address, and notes you enter are handled by Google under its privacy policy, and are used only to arrange and hold the call.</p>

      <h2>What happens when you email us?</h2>
      <p>If you email us, we use your address and message only to reply. We do not sell or share personal information.</p>
      <h2>What are your rights?</h2>
      <p>Depending on where you live, including California and the European Union, you may have the right to access or delete personal information we hold about you. Email <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond.</p>
    </Simple>
  );
}

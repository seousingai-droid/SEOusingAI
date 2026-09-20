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
      <p>This site has no accounts and no comment system. The free tools run in your browser, and what you type into them is not sent to or stored on our servers.</p>
      <p>Our hosting provider keeps standard server logs, such as IP address, browser type, and pages requested, for security and reliability. If we add privacy-friendly analytics, this page will be updated before it goes live.</p>
      <h2>Do we use cookies?</h2>
      <p>The site itself does not set advertising or tracking cookies. If you click an affiliate link, the destination site may set its own cookies under its own privacy policy.</p>
      <h2>What happens when you book a call?</h2>
      <p>Calls are booked through Google Calendar and held on Google Meet. The name, email address, and notes you enter are handled by Google under its privacy policy and are used only to arrange and hold the call.</p>
      <h2>What happens when you email us?</h2>
      <p>If you email us, we use your address and message only to reply. We do not sell or share personal information.</p>
      <h2>What are your rights?</h2>
      <p>Depending on where you live, including California and the European Union, you may have the right to access or delete personal information we hold about you. Email <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond.</p>
    </Simple>
  );
}

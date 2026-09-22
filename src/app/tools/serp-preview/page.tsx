import { pageMeta } from "@/lib/meta";
import ToolShell from "@/components/ToolShell";
import Tool from "./Tool";

export const metadata = pageMeta({
  title: "SERP Snippet Preview and Length Checker",
  description: "Preview how your title tag and meta description look in Google. A free SERP snippet preview with live length checks, running in your browser.",
  path: "/tools/serp-preview",
});

export default function Page() {
  return (
    <ToolShell
      slug="serp-preview" name="SERP Snippet Preview"
      title={<>SERP snippet preview and <span className="hl">length checker</span></>}
      lede="Type a title tag and meta description to see how they are likely to appear in Google. Runs in your browser."
      how={[
        { h: "How long should a title tag be?", p: "A title tag should be about 60 characters or fewer. Google cuts titles by pixel width, so 60 characters is a safe guide that keeps most titles fully visible on desktop and mobile. Put the main keyword near the front and give a reason to click." },
        { h: "How long should a meta description be?", p: "A meta description should be about 155 characters or fewer. Write it as a preview of the answer, not a list of keywords. Google may rewrite it to match the query, but a clear description is used more often than a vague one." },
        { h: "How do you write snippets with AI?", p: "Ask an AI model for eight title variants under 60 characters and five descriptions under 155, then paste the best ones here. Prompt structures are in our guide to prompts for SEO." },
      ]}
      faqs={[
        { q: "Is the SERP preview exact?", a: "The SERP preview is a close approximation. Google measures snippet length in pixels, varies layouts by device, and sometimes rewrites titles and descriptions, so use the preview as a guide." },
        { q: "Does this tool store what I type?", a: "No. The SERP Snippet Preview runs entirely in your browser. Nothing you type is sent to or stored on a server." },
      ]}
    >
      <Tool />
    </ToolShell>
  );
}

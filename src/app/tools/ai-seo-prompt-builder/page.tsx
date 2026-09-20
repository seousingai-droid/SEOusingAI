import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Tool from "./Tool";

export const metadata: Metadata = {
  title: "AI SEO Prompt Builder (Free Generator)",
  description: "Build structured SEO prompts for ChatGPT, Claude, or Gemini. Keyword research, briefs, meta tags, audits, and schema. Free, no signup.",
  alternates: { canonical: "/tools/ai-seo-prompt-builder" },
};

export default function Page() {
  return (
    <ToolShell
      slug="ai-seo-prompt-builder" name="AI SEO Prompt Builder"
      title={<>AI SEO prompt builder for <span className="hl">usable output</span></>}
      lede="Pick a task, describe your site, and copy a prompt with the five parts that make AI output worth using."
      how={[
        { h: "What does the AI SEO Prompt Builder do?", p: "The AI SEO Prompt Builder assembles a structured prompt with a role, your context, a slot for source material, rules against invented data, and a required output format. Those five parts are what separate useful SEO output from generic filler." },
        { h: "Why does the prompt ask for source material?", p: "The prompt asks for source material because a model without your data can only return the average of what it has read. Pasting competitor headings, your draft, or a Search Console export is the single biggest improvement you can make." },
        { h: "Which AI model should you use it with?", p: "You can use these prompts with ChatGPT, Claude, Gemini, or any general AI model. They rely on clear instructions, not on features of one product." },
      ]}
      faqs={[
        { q: "Does this tool call an AI model?", a: "No. The AI SEO Prompt Builder only builds the prompt text in your browser. You paste it into the AI model of your choice." },
        { q: "Will the rules stop the AI from inventing facts?", a: "The rules reduce invented facts but do not eliminate them. Always verify statistics, prices, and quotes against a primary source before publishing." },
      ]}
    >
      <Tool />
    </ToolShell>
  );
}

import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

// AI crawlers are allowed on purpose: being retrievable is the point of this site.
const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...aiBots.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: abs("/sitemap.xml"),
    host: abs("/"),
  };
}

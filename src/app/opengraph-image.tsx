import { ImageResponse } from "next/og";

export const alt = "SEO Using AI: get found on Google and recommended by AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0f1f", color: "#e9edf9", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <svg width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#ffd84d" /><circle cx="26" cy="34" r="13.5" fill="none" stroke="#0a0f1f" strokeWidth="6" /><path d="M36.5 44.5 47 55" stroke="#0a0f1f" strokeWidth="7" strokeLinecap="round" /><circle cx="45" cy="18" r="13.5" fill="#ffd84d" /><path d="M45 6.5C45 14 49 18 56.5 18C49 18 45 22 45 29.5C45 22 41 18 33.5 18C41 18 45 14 45 6.5Z" fill="#0a0f1f" /></svg>
          SEOusingAI
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 78, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>SEO using AI: get found on Google</span>
          <span style={{ display: "flex", marginTop: 12 }}>and get&nbsp;<span style={{ background: "#ffd84d", color: "#0a0f1f", padding: "0 16px", borderRadius: 10 }}>recommended by AI</span></span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#97a3c7" }}>Free guides, prompts, and tools · seousingai.com</div>
      </div>
    ),
    size
  );
}

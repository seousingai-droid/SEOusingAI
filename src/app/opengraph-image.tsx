import { ImageResponse } from "next/og";

export const alt = "SEO Using AI: rank on Google and get cited by AI answers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0f1f", color: "#e9edf9", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 14, background: "#ffd84d", color: "#0a0f1f", fontSize: 26 }}>[1]</div>
          SEOusingAI
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 78, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>SEO using AI: rank on Google</span>
          <span style={{ display: "flex", marginTop: 12 }}>and get&nbsp;<span style={{ background: "#ffd84d", color: "#0a0f1f", padding: "0 16px", borderRadius: 10 }}>cited by AI answers</span></span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#97a3c7" }}>Free guides, prompts, and tools · seousingai.com</div>
      </div>
    ),
    size
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ProfitPath — Free AI Tools for Creators & Side Hustlers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 40%, #991b1b 100%)",
          fontFamily: "Arial, sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "#fbbf24", display: "flex" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 16 }}>
          <span style={{ fontSize: 72, fontWeight: 900, color: "#ffffff" }}>Profit</span>
          <span style={{ fontSize: 72, fontWeight: 900, color: "#fbbf24" }}>Path</span>
        </div>

        {/* Tagline */}
        <p style={{ fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.9)", margin: 0, marginBottom: 40 }}>
          Free AI Tools for Creators &amp; Side Hustlers
        </p>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "10px 24px", fontSize: 18, fontWeight: 600 }}>
            🔥 Viral Video Planner
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "10px 24px", fontSize: 18, fontWeight: 600 }}>
            🎬 YouTube Tools
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "10px 24px", fontSize: 18, fontWeight: 600 }}>
            🤖 AI Prompts
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "10px 24px", fontSize: 18, fontWeight: 600 }}>
            💰 Income Tools
          </div>
        </div>

        {/* URL */}
        <p style={{ position: "absolute", bottom: 28, fontSize: 18, color: "rgba(255,255,255,0.5)", margin: 0 }}>
          profitpath.online
        </p>
      </div>
    ),
    { ...size }
  );
}

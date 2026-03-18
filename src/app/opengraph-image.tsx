import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ProfitPath — Free AI Tools for Creators";
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
          background: "linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ef4444" }} />
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 20 }}>
          <span style={{ fontSize: 72, fontWeight: 800, color: "#ef4444" }}>Profit</span>
          <span style={{ fontSize: 72, fontWeight: 800, color: "#1f2937" }}>Path</span>
        </div>
        <div style={{ fontSize: 36, color: "#4b5563", marginBottom: 24, textAlign: "center" }}>
          Free AI Tools for Creators & Side Hustlers
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
          {["Viral Videos", "YouTube Titles", "AI Prompts", "Income Calculator"].map((t) => (
            <div
              key={t}
              style={{
                background: "white",
                borderRadius: 12,
                padding: "8px 20px",
                fontSize: 18,
                color: "#6b7280",
                border: "1px solid #e5e7eb",
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 20, color: "#9ca3af" }}>profitpath.online</div>
      </div>
    ),
    { ...size }
  );
}

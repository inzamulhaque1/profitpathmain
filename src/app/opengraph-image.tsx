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
          background: "linear-gradient(135deg, #fff5f5 0%, #fee2e2 50%, #fecaca 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "linear-gradient(90deg, #ef4444, #dc2626)" }} />

        {/* Logo text */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
          <span style={{ fontSize: 80, fontWeight: 900, color: "#ef4444", letterSpacing: -2 }}>Profit</span>
          <span style={{ fontSize: 80, fontWeight: 900, color: "#1f2937", letterSpacing: -2 }}>Path</span>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 32, color: "#4b5563", marginBottom: 32, textAlign: "center", fontWeight: 500 }}>
          Free AI Tools for Creators & Side Hustlers
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 12, marginBottom: 48 }}>
          {[
            { icon: "🔥", text: "Viral Videos" },
            { icon: "🎬", text: "YouTube Titles" },
            { icon: "🤖", text: "AI Prompts" },
            { icon: "💰", text: "Income Calculator" },
          ].map((t) => (
            <div
              key={t.text}
              style={{
                background: "white",
                borderRadius: 50,
                padding: "10px 24px",
                fontSize: 18,
                color: "#374151",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <span>{t.icon}</span>
              <span style={{ fontWeight: 600 }}>{t.text}</span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{ fontSize: 20, color: "#9ca3af", fontWeight: 500 }}>profitpath.online</div>

        {/* Bottom accent */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #ef4444, #f97316)" }} />
      </div>
    ),
    { ...size }
  );
}

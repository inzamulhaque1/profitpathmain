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
          background: "linear-gradient(145deg, #ffffff 0%, #fff1f0 30%, #ffe0de 60%, #ffc9c5 100%)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Red accent top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ef4444" }} />

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(239,68,68,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(239,68,68,0.06)" }} />
        <div style={{ position: "absolute", top: 200, right: 100, width: 120, height: 120, borderRadius: "50%", background: "rgba(249,115,22,0.06)" }} />

        {/* Left content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 60px 60px 70px" }}>
          {/* Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#ef4444", letterSpacing: 2, textTransform: "uppercase" }}>
              100% Free — No Signup Required
            </span>
          </div>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.1 }}>
              AI Tools That Help
            </span>
            <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, display: "flex" }}>
              <span style={{ color: "#1a1a1a" }}>You </span>
              <span style={{ color: "#ef4444", marginLeft: 12 }}>Create & Earn</span>
            </span>
          </div>

          {/* Features */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
            {[
              { icon: "🔥", text: "Viral Videos" },
              { icon: "🎬", text: "YouTube Titles" },
              { icon: "🤖", text: "AI Prompts" },
              { icon: "💰", text: "Income Tools" },
            ].map((f) => (
              <div
                key={f.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "white",
                  border: "1px solid rgba(239,68,68,0.15)",
                  borderRadius: 8,
                  padding: "6px 14px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#374151",
                  boxShadow: "0 1px 3px rgba(239,68,68,0.06)",
                }}
              >
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 20 }}>
            {["No Credit Card", "AI-Powered", "Instant Results"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
                <span style={{ color: "#ef4444", fontSize: 14 }}>✓</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — mock card */}
        <div style={{ width: 420, display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 50 }}>
          <div
            style={{
              width: 340,
              background: "white",
              borderRadius: 20,
              border: "2px solid rgba(239,68,68,0.15)",
              boxShadow: "0 20px 60px rgba(239,68,68,0.12), 0 4px 20px rgba(0,0,0,0.04)",
              padding: 28,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Clip header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ef4444", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>1</div>
                <span style={{ fontSize: 13, color: "#9ca3af" }}>~10s</span>
              </div>
              <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#ef4444" }}>Clip 1 of 5</div>
            </div>

            {/* Script */}
            <div style={{ background: "#fffbeb", borderRadius: 10, padding: 14, marginBottom: 12, borderLeft: "3px solid #f59e0b" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#92400e", margin: 0, marginBottom: 4 }}>Script</p>
              <p style={{ fontSize: 11, color: "#78716c", margin: 0, lineHeight: 1.4 }}>
                &quot;POV: you&apos;re ketchup... and the human just brought home hot sauce.&quot;
              </p>
            </div>

            {/* Visual Prompt */}
            <div style={{ background: "#fef2f2", borderRadius: 10, padding: 14, marginBottom: 16, borderLeft: "3px solid #ef4444" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#991b1b", margin: 0, marginBottom: 4 }}>Visual Prompt</p>
              <p style={{ fontSize: 11, color: "#78716c", margin: 0, lineHeight: 1.4 }}>
                Pixar-style fridge interior. Round cartoon ketchup with smug face...
              </p>
            </div>

            {/* Platform tags */}
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ background: "#fef2f2", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#ef4444" }}>YouTube</div>
              <div style={{ background: "#f0fdf4", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#16a34a" }}>TikTok</div>
              <div style={{ background: "#faf5ff", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#9333ea" }}>Instagram</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #ef4444, #f97316, #ef4444)" }} />

        {/* Logo bottom left */}
        <div style={{ position: "absolute", bottom: 20, left: 70, display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#ef4444" }}>Profit</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#1f2937" }}>Path</span>
          <span style={{ fontSize: 14, color: "#9ca3af", marginLeft: 12 }}>profitpath.online</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

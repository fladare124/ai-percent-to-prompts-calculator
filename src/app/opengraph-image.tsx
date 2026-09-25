import { ImageResponse } from "next/og";

export const alt = "Choose where to deploy an app built with AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "58px 68px", color: "#f8fafc", background: "radial-gradient(circle at 82% 15%, #155e75 0, #101923 36%, #090d14 78%)", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 15, background: "#0e7490", color: "#ecfeff", fontSize: 24, fontWeight: 700 }}>P→</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
            <span>PROMPT TO PRODUCTION</span>
            <span style={{ marginTop: 5, color: "#67e8f9", fontSize: 13 }}>A PRACTICAL AI APP LAUNCH FINDER</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ color: "#67e8f9", fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>FROM GENERATED CODE TO LIVE APP</div>
            <div style={{ marginTop: 20, fontSize: 58, lineHeight: 1.08, fontWeight: 700 }}>Where should you deploy it?</div>
            <div style={{ marginTop: 22, color: "#cbd5e1", fontSize: 23 }}>Choose by framework, backend needs and commercial use.</div>
          </div>
          <div style={{ width: 330, display: "flex", flexDirection: "column", padding: 22, border: "1px solid #334155", borderRadius: 22, background: "rgba(15, 23, 42, 0.72)" }}>
            {[["Vercel", "Next.js · previews"], ["Hostinger", "Managed Node.js"], ["DigitalOcean", "App services · containers"]].map(([name, detail], index) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 13, marginTop: index === 0 ? 0 : 16, padding: "12px 14px", border: "1px solid #334155", borderRadius: 12, background: "rgba(30, 41, 59, 0.72)" }}>
                <span style={{ width: 27, height: 27, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14, background: "#155e75", color: "#a5f3fc", fontSize: 14, fontWeight: 700 }}>{index + 1}</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 17, fontWeight: 700 }}>{name}</span>
                  <span style={{ marginTop: 4, color: "#94a3b8", fontSize: 13 }}>{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #334155", paddingTop: 18, color: "#94a3b8", fontSize: 16 }}>
          <span>Hosting finder · deployment guides · plan requirements</span>
          <span style={{ color: "#67e8f9", fontWeight: 700 }}>percenttoprompts.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

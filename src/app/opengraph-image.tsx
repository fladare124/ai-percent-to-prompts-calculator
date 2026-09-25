import { ImageResponse } from "next/og";

export const alt = "AI app deployment checker and launch guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "58px 68px", color: "#0f172a", background: "radial-gradient(circle at 88% 6%, #cffafe 0, #f5f8fc 40%, #ffffff 80%)", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, background: "#0f172a", color: "#67e8f9", fontSize: 22, fontWeight: 700 }}>P→</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
            <span>PROMPT TO PRODUCTION</span>
            <span style={{ marginTop: 5, color: "#0e7490", fontSize: 13 }}>AI APP LAUNCH HELP</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 42 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ color: "#0e7490", fontSize: 17, fontWeight: 700, letterSpacing: 2 }}>FROM PREVIEW TO PRODUCTION</div>
            <div style={{ marginTop: 18, fontSize: 52, lineHeight: 1.08, fontWeight: 700 }}>Fix an AI app deployment error and get ready to launch.</div>
            <div style={{ marginTop: 20, color: "#475569", fontSize: 22 }}>Private log checks · hosting finder · Lovable, Bolt, Vercel and more.</div>
          </div>
          <div style={{ width: 325, display: "flex", flexDirection: "column", gap: 13, padding: 19, border: "1px solid #cbd5e1", borderRadius: 22, background: "rgba(255, 255, 255, 0.88)" }}>
            {[["01", "Paste the build error"], ["02", "Get first checks"], ["03", "Choose a host"], ["04", "Launch with confidence"]].map(([number, label]) => (
              <div key={number} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 13px", border: "1px solid #e2e8f0", borderRadius: 13, background: "#f8fafc" }}>
                <span style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 17, background: "#cffafe", color: "#0f172a", fontSize: 14, fontWeight: 700 }}>{number}</span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #cbd5e1", paddingTop: 18, color: "#64748b", fontSize: 16 }}>
          <span>No account · No upload · Your log stays in your browser</span>
          <span style={{ color: "#0e7490", fontWeight: 700 }}>percenttoprompts.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

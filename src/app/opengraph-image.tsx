import { ImageResponse } from "next/og";

export const alt = "Private Etsy listing CSV checker for titles and tags";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "58px 66px",
          color: "#1c1917",
          background: "linear-gradient(125deg, #f7f6f0 0%, #f7f6f0 62%, #dbe8da 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 15, background: "#064e3b", color: "#d1fae5", fontSize: 22, fontWeight: 700 }}>P%</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
            <span>LISTING CHECKUP</span>
            <span style={{ marginTop: 4, color: "#047857", fontSize: 13 }}>BY PERCENT TO PROMPTS</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 52 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ color: "#047857", fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>FREE · PRIVATE IN YOUR BROWSER</div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 18, fontSize: 58, lineHeight: 1.04, fontWeight: 700, letterSpacing: -2 }}>
              <span>Check your Etsy</span>
              <span>listing CSV.</span>
            </div>
            <div style={{ display: "flex", marginTop: 22, maxWidth: 620, color: "#57534e", fontSize: 22, lineHeight: 1.35 }}>
              Review titles and tags in your active shop export. No login or upload.
            </div>
          </div>

          <div style={{ width: 340, display: "flex", flexDirection: "column", padding: 25, border: "1px solid #d6d3d1", borderRadius: 22, background: "#ffffff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#44403c", fontSize: 16 }}>
              <span>Example report</span>
              <span style={{ color: "#047857", fontWeight: 700 }}>01 / 03</span>
            </div>
            {[
              ["Titles", "Clarity & repeats"],
              ["Tags", "13 slots · 20 chars"],
              ["Privacy", "File stays local"],
            ].map(([name, detail]) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", marginTop: 14, padding: "13px 14px", border: "1px solid #e7e5e4", borderRadius: 12, background: "#f7f6f0" }}>
                <span style={{ fontSize: 17, fontWeight: 700 }}>{name}</span>
                <span style={{ marginTop: 4, color: "#78716c", fontSize: 13 }}>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #d6d3d1", paddingTop: 18, color: "#78716c", fontSize: 16 }}>
          <span>CSV audit · Title checks · Tag checks</span>
          <span style={{ color: "#047857", fontWeight: 700 }}>percenttoprompts.com</span>
        </div>
      </div>
    ),
    size,
  );
}

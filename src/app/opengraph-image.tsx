import { ImageResponse } from "next/og";

export const alt = "Free Etsy seller tools for listing titles, tags, sales and stock";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "58px 68px", color: "#1c1917", background: "radial-gradient(circle at 88% 6%, #d1fae5 0, #f7f6f0 40%, #fafaf9 80%)", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, background: "#064e3b", color: "#d1fae5", fontSize: 22, fontWeight: 700 }}>LC</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
            <span>LISTING CHECKUP</span>
            <span style={{ marginTop: 5, color: "#047857", fontSize: 13 }}>FREE ETSY SELLER TOOLS</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 42 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ color: "#047857", fontSize: 17, fontWeight: 700, letterSpacing: 2 }}>ETSY SELLER WORKFLOW</div>
            <div style={{ marginTop: 18, fontSize: 52, lineHeight: 1.08, fontWeight: 700 }}>Review titles, tags, sales and stock from your shop data.</div>
            <div style={{ marginTop: 20, color: "#57534e", fontSize: 22 }}>Free, private, and no Etsy login required.</div>
          </div>
          <div style={{ width: 325, display: "flex", flexDirection: "column", gap: 13, padding: 19, border: "1px solid #d6d3d1", borderRadius: 22, background: "rgba(255, 255, 255, 0.88)" }}>
            {[["01", "Shop CSV audit"], ["02", "Title checker"], ["03", "Sales and restock"], ["04", "Fee and profit"]].map(([number, label]) => (
              <div key={number} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 13px", border: "1px solid #e7e5e4", borderRadius: 13, background: "#fafaf9" }}>
                <span style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 17, background: "#d1fae5", color: "#064e3b", fontSize: 14, fontWeight: 700 }}>{number}</span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #d6d3d1", paddingTop: 18, color: "#78716c", fontSize: 16 }}>
          <span>No Etsy login · Your shop export stays in your browser</span>
          <span style={{ color: "#065f46", fontWeight: 700 }}>percenttoprompts.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const alt =
  "Compare AI coding subscriptions by workflow and monthly budget";
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
          padding: "54px 64px",
          color: "#f8fafc",
          background:
            "radial-gradient(circle at 82% 15%, #164e63 0, #101923 34%, #090d14 76%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 14,
              background: "#0e7490",
              color: "#ecfeff",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            AI
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            <span>AI PLAN FINDER</span>
            <span style={{ marginTop: 5, color: "#67e8f9", fontSize: 13 }}>
              INDEPENDENT PLAN COMPARISON
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                color: "#a5f3fc",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              CHOOSE BY WORKFLOW AND BUDGET
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 18,
                fontSize: 62,
                lineHeight: 1.06,
                fontWeight: 700,
                letterSpacing: -2,
              }}
            >
              <span>Find your AI</span>
              <span>coding plan.</span>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                maxWidth: 635,
                color: "#cbd5e1",
                fontSize: 22,
                lineHeight: 1.35,
              }}
            >
              Compare Claude Code, Codex, Cursor and GitHub Copilot with a
              practical shortlist for your work.
            </div>
          </div>

          <div
            style={{
              width: 330,
              display: "flex",
              flexDirection: "column",
              padding: 24,
              border: "1px solid #334155",
              borderRadius: 20,
              background: "rgba(15, 23, 42, 0.9)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#cbd5e1",
                fontSize: 16,
              }}
            >
              <span>Compare your options</span>
              <span style={{ color: "#67e8f9", fontWeight: 700 }}>01 / 04</span>
            </div>
            {[
              ["Claude Code", "Terminal workflows"],
              ["Codex", "ChatGPT + coding"],
              ["Cursor", "AI editor + agents"],
              ["GitHub Copilot", "IDE + GitHub"],
            ].map(([name, detail]) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 14,
                  padding: "12px 14px",
                  border: "1px solid #334155",
                  borderRadius: 12,
                  background: "rgba(30, 41, 59, 0.7)",
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 700 }}>{name}</span>
                <span style={{ marginTop: 4, color: "#94a3b8", fontSize: 13 }}>
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #334155",
            paddingTop: 18,
            color: "#94a3b8",
            fontSize: 16,
          }}
        >
          <span>Workflow fit · usage model · monthly budget</span>
          <span style={{ color: "#67e8f9", fontWeight: 700 }}>
            percenttoprompts.com
          </span>
        </div>
      </div>
    ),
    size,
  );
}

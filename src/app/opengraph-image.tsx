import { ImageResponse } from "next/og";

export const alt =
  "Percent to Prompts estimates remaining AI tasks and messages from usage percentages";
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
            "radial-gradient(circle at 84% 18%, #164e63 0, #101923 34%, #090d14 76%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              background: "#0e7490",
              color: "#ecfeff",
              fontSize: 27,
              fontWeight: 700,
            }}
          >
            %
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: 2.2,
            }}
          >
            <span>PERCENT TO PROMPTS</span>
            <span style={{ marginTop: 5, color: "#67e8f9", fontSize: 14 }}>
              FREE AI USAGE ESTIMATOR
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                color: "#a5f3fc",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              TURN YOUR USAGE METER INTO A PLAN
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 18,
                fontSize: 67,
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: -2.5,
              }}
            >
              <span>How much AI</span>
              <span>usage is left?</span>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                maxWidth: 650,
                color: "#cbd5e1",
                fontSize: 23,
                lineHeight: 1.35,
              }}
            >
              Estimate prompts, messages and coding tasks from your own usage
              readings. No sign-in or account connection.
            </div>
          </div>

          <div
            style={{
              width: 335,
              display: "flex",
              flexDirection: "column",
              padding: 26,
              border: "1px solid #334155",
              borderRadius: 20,
              background: "rgba(15, 23, 42, 0.9)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#cbd5e1", fontSize: 17 }}>
                Example reading
              </span>
              <span
                style={{
                  color: "#67e8f9",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                ESTIMATE ONLY
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginTop: 24,
              }}
            >
              <span style={{ fontSize: 57, fontWeight: 700 }}>64%</span>
              <span style={{ color: "#94a3b8", fontSize: 18 }}>remaining</span>
            </div>
            <div
              style={{
                display: "flex",
                height: 13,
                marginTop: 17,
                overflow: "hidden",
                borderRadius: 999,
                background: "#334155",
              }}
            >
              <div
                style={{
                  width: "64%",
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #22d3ee, #67e8f9)",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 21,
                color: "#e2e8f0",
                fontSize: 19,
                lineHeight: 1.35,
              }}
            >
              Compare two readings to estimate your own usage pace.
            </div>
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
            fontSize: 17,
          }}
        >
          <span>ChatGPT · Claude · Codex · Gemini · Cursor · more</span>
          <span style={{ color: "#67e8f9", fontWeight: 700 }}>
            percenttoprompts.com
          </span>
        </div>
      </div>
    ),
    size,
  );
}

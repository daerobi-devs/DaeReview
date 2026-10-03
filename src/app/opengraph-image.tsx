import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DaeReview — Logo Resmi & Portal Ulasan Terpercaya";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle Outer Frame */}
        <div
          style={{
            position: "absolute",
            top: "28px",
            bottom: "28px",
            left: "28px",
            right: "28px",
            border: "1px solid #e2e8f0",
            borderRadius: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            background: "#ffffff",
          }}
        >
          {/* Official DaeReview Vector Logo Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "170px",
              height: "170px",
              borderRadius: "42px",
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
            }}
          >
            <svg
              viewBox="0 0 48 48"
              width="116"
              height="116"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Stylized 'D' Shape */}
              <path
                d="M8 8H24C32.8366 8 40 15.1634 40 24C40 32.8366 32.8366 40 24 40H8V8Z"
                stroke="#0f172a"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Integrated Clean Checkmark */}
              <path
                d="M16 24.5L22.5 31L34 16"
                stroke="#0f172a"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Vibrant Coral Accent Dot */}
              <circle cx="28.5" cy="27" r="3.2" fill="#f97316" />
            </svg>
          </div>

          {/* Typography: Brand Wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "88px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0f172a",
              lineHeight: 1,
            }}
          >
            <span>Dae</span>
            <span style={{ color: "#334155", fontWeight: 700 }}>Review</span>
            <span
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#f97316",
                marginLeft: "8px",
                marginBottom: "20px",
              }}
            />
          </div>

          {/* Clean Subtitle */}
          <div
            style={{
              fontSize: "26px",
              fontWeight: 600,
              color: "#64748b",
              letterSpacing: "0.02em",
            }}
          >
            Ulasan Teruji &amp; Panduan Belanja Cerdas
          </div>

          {/* Official Domain Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 24px",
              borderRadius: "9999px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
              fontWeight: 700,
              color: "#475569",
              letterSpacing: "0.04em",
              textTransform: "lowercase",
            }}
          >
            daereview.daeroom.my.id
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DaeReview — Panduan Belanja Cerdas & Kabar Tren Terpercaya";
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
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #090e1a 0%, #0f172a 50%, #1e293b 100%)",
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Glow ambient background accent */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%)",
          }}
        />

        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 20px",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#fb923c",
              textTransform: "uppercase",
            }}
          >
            <span>●</span>
            <span>Jurnalisme & Ulasan Produk Terpercaya</span>
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#94a3b8",
            }}
          >
            daereview.daeroom.my.id
          </div>
        </div>

        {/* Center Main Brand Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                fontSize: "72px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Dae</span>
              <span style={{ color: "#f97316" }}>Review</span>
            </div>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#f97316",
                marginTop: "30px",
              }}
            />
          </div>

          <div
            style={{
              fontSize: "34px",
              fontWeight: 700,
              lineHeight: 1.3,
              color: "#f1f5f9",
              maxWidth: "960px",
            }}
          >
            Panduan Belanja Cerdas, Riset Spesifikasi Jujur &amp; Kabar Tren Terkini
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 400,
              color: "#94a3b8",
              lineHeight: 1.5,
              maxWidth: "880px",
            }}
          >
            Standar Editorial Independen • Audit Ulasan Pembeli Riil • Bebas Rating Bintang Palsu
          </div>
        </div>

        {/* Bottom Verification Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#cbd5e1" }}>
            <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
            <span>Audit Hardware</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#cbd5e1" }}>
            <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
            <span>Perbandingan Harga Riil</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#cbd5e1" }}>
            <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
            <span>Fakta vs Mitos</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#cbd5e1" }}>
            <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
            <span>Komisi Transparan Tanpa Biaya Tambahan</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

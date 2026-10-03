import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kabar & Tren Belanja Terkini — DaeReview",
  description:
    "Laporan mendalam isu teknologi, bocoran harga gadget, uji fakta vs mitos, dan analisis tren belanja cerdas di Indonesia.",
  alternates: {
    canonical: "https://daereview.daeroom.my.id/berita",
  },
  openGraph: {
    title: "Kabar & Tren Belanja Terkini — DaeReview",
    description:
      "Laporan mendalam isu teknologi, bocoran harga gadget, uji fakta vs mitos, dan analisis tren belanja cerdas di Indonesia.",
    url: "https://daereview.daeroom.my.id/berita",
    siteName: "DaeReview",
    locale: "id_ID",
    type: "website",
  },
};

export default function BeritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

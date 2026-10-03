import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pencarian Ulasan Produk & Berita — DaeReview",
  description:
    "Cari panduan belanja teruji, spesifikasi produk, perbandingan harga, dan berita teknologi di DaeReview.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

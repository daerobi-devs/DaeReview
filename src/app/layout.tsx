import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleTags from "@/components/GoogleTags";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daereview.daeroom.my.id"),
  applicationName: "DaeReview",
  publisher: "DaeReview",
  title: "DaeReview — Panduan Belanja Cerdas & Kabar Tren Terpercaya",
  description:
    "Portal ulasan produk independen, perbandingan spesifikasi gadget, audio TWS, smart home, dan kabar tren teknologi harian terpercaya di Indonesia.",
  keywords: [
    "review produk",
    "rekomendasi tws murah",
    "keyboard mekanikal terbaik",
    "smart home indonesia",
    "diskon shopee",
    "promo tokopedia",
    "daeroom",
    "daereview"
  ],
  authors: [{ name: "DaeReview Editorial Team" }],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    title: "DaeReview — Ulasan Jujur & Panduan Belanja Terpercaya",
    description:
      "Riset spesifikasi mendalam, perbandingan harga akurat, dan ulasan teruji pembeli riil di e-commerce Indonesia.",
    url: "https://daereview.daeroom.my.id",
    siteName: "DaeReview",
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg" },
    ],
    shortcut: ["/icon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DaeReview — Panduan Belanja Cerdas & Ulasan Produk Terpercaya",
    description:
      "Ulasan jujur produk terlaris dan kabar tren teknologi harian di Indonesia.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "_5BNDxoJkGkVL-YfDLstufxHtU9pfpI_YYVncEmX6H4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">
        <GoogleTags />
        {children}
      </body>
    </html>
  );
}

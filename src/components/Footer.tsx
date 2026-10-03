import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm">
      {/* Upper Footer: Brand & Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <Logo size="md" showTagline={true} />
          <p className="text-xs text-slate-500 leading-relaxed">
            Portal panduan belanja cerdas, perbandingan spesifikasi gadget, dan kabar tren teknologi harian terpercaya di Indonesia.
          </p>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
            Kategori Ulasan
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/#panduan" className="hover:text-slate-950 transition-colors">
                Gadget & Meja Kerja
              </Link>
            </li>
            <li>
              <Link href="/#panduan" className="hover:text-slate-950 transition-colors">
                Audio, TWS & Headphone
              </Link>
            </li>
            <li>
              <Link href="/#panduan" className="hover:text-slate-950 transition-colors">
                Smart Home & Elektronik
              </Link>
            </li>
            <li>
              <Link href="/#panduan" className="hover:text-slate-950 transition-colors">
                Peralatan Rumah & Dapur
              </Link>
            </li>
          </ul>
        </div>

        {/* Editorial & Trust Column */}
        <div>
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
            Standar & Legalitas
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/pedoman-editorial" className="text-slate-600 hover:text-slate-950 transition-colors">
                Pedoman Editorial & Afiliasi
              </Link>
            </li>
            <li>
              <Link href="/kebijakan-privasi" className="text-slate-600 hover:text-slate-950 transition-colors">
                Kebijakan Privasi (UU PDP)
              </Link>
            </li>
            <li>
              <Link href="/syarat-ketentuan" className="text-slate-600 hover:text-slate-950 transition-colors">
                Syarat & Ketentuan Layanan
              </Link>
            </li>
            <li>
              <Link href="/berita" className="text-slate-600 hover:text-slate-950 transition-colors">
                Kabar & Tren Belanja
              </Link>
            </li>
          </ul>
        </div>

        {/* Disclaimer / Transparency Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <Link href="/pedoman-editorial" className="hover:underline">
              Keterbukaan Afiliasi
            </Link>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            DaeReview didukung oleh pembaca. Saat kamu membeli barang melalui tautan di situs kami, kami dapat memperoleh komisi afiliasi tanpa biaya tambahan untukmu. Kami tidak menerima bayaran untuk mengubah skor ulasan produk.
          </p>
        </div>
      </div>

      {/* Bottom Footer: Copyright */}
      <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} <span className="font-bold text-slate-800">DaeReview</span> — Bagian dari ekosistem{" "}
            <a
              href="https://daeroom.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-900 hover:text-orange-600 underline underline-offset-2 transition-colors"
            >
              daeroom.my.id
            </a>
            .
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dibuat dengan dedikasi untuk konsumen cerdas Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

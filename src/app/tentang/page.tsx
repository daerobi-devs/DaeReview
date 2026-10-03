import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  ChevronRight,
  Award,
  CheckCircle2,
  Users,
  Compass,
  Cpu,
  TrendingUp,
  Search,
  Scale
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami — Profil Redaksi & Standar Pengujian DaeReview",
  description:
    "Mengenal DaeReview: media panduan belanja cerdas, audit teknologi independen, dan kabar tren terpercaya di Indonesia.",
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <Header />

      <main className="flex-1 pb-20">
        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
            <nav className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">Tentang DaeReview</span>
            </nav>
          </div>
        </div>

        {/* Content Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PROFIL MEDIA &amp; DEKLARASI INDEPENDENSI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tentang DaeReview
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Media panduan belanja cerdas, riset gadget objektif, dan rujukan teknologi independen bagian dari ekosistem <strong>daeroom.my.id</strong>.
          </p>
        </header>

        {/* Article Body */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 prose prose-slate max-w-none text-slate-700 space-y-10 text-sm sm:text-base leading-relaxed">
          {/* Section 1: Siapa Kami */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-orange-600" />
              Siapa Kami &amp; Mengapa DaeReview Lahir
            </h2>
            <p>
              Di era membanjirnya produk murah dan algoritma marketplace yang penuh dengan ulasan bintang lima bayaran, konsumen Indonesia semakin kesulitan membedakan mana barang yang benar-benar berkualitas dan mana barang yang sekadar menang promosi iklan.
            </p>
            <p>
              <strong>DaeReview (daereview.daeroom.my.id)</strong> didirikan dengan misi tunggal: <em>Menjadi pemandu belanja paling jujur dan berimbang bagi masyarakat Indonesia.</em> Kami tidak memuji barang hanya karena diberi sampel gratis, dan kami tidak merekomendasikan produk yang kami sendiri tidak sudi membelinya dengan uang pribadi.
            </p>
          </section>

          {/* Section 2: Formula 4 Lapis Pengujian */}
          <section className="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-blue-900" />
              Formula 4 Lapis Riset &amp; Verifikasi Redaksi
            </h2>
            <p className="text-slate-600">
              Setiap panduan belanja dan perbandingan produk di DaeReview melewati proses kurasi berbasis data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider">Lapis 1</div>
                <div className="font-bold text-slate-900 text-sm">Audit Spesifikasi Teknis</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Membedah klaim pemasaran pabrikan (kapasitas baterai riil, sertifikasi IPX, material bodi, dan dukungan pembaruan sistem).
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider">Lapis 2</div>
                <div className="font-bold text-slate-900 text-sm">Penyaringan Ulasan Pembeli Nyata</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengaudit keluhan bintang 1 sampai 3 di e-commerce Indonesia (Shopee, Tokopedia, TikTok Shop) untuk mendeteksi cacat tersembunyi.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider">Lapis 3</div>
                <div className="font-bold text-slate-900 text-sm">Konsensus Komunitas Teknologi</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Memvalidasi temuan dengan pakar industri, forum audio/keyboard antusias, dan pengujian durabilitas jangka panjang.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider">Lapis 4</div>
                <div className="font-bold text-slate-900 text-sm">Value-for-Money Ratio</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menghitung rasio kualitas dibanding harga pasar riil, agar pembaca mendapatkan barang terbaik sesuai alokasi dana mereka.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: 3 Prinsip Tegas Jurnalisme Kami */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-6 h-6 text-emerald-600" />
              3 Prinsip Tegas Jurnalisme DaeReview
            </h2>
            <ul className="space-y-3 pl-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Nol Bintang Palsu:</strong> Kami tidak pernah menggunakan sistem rating bintang yang bisa dimanipulasi. Kami menggunakan skor angka objektif berdasarkan rubrik terukur (1.0 - 5.0).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Wajib Mencantumkan "The Catch" (Kelemahan):</strong> Tidak ada barang elektronik yang sempurna di dunia ini. Setiap ulasan kami wajib memuat poin kekurangan secara transparan.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Keterbukaan Afiliasi:</strong> Kami didukung oleh tautan afiliasi resmi. Jika Anda membeli lewat tautan kami, kami dapat menerima komisi kecil dari marketplace tanpa menambah biaya sepeser pun pada harga barang Anda.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 4: Tim & Naungan Ekosistem */}
          <section className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-slate-800" />
              Tim Redaksi &amp; Ekosistem
            </h2>
            <p>
              DaeReview dikelola oleh tim editorial teknologi yang berdedikasi dan bernaung di bawah payung ekosistem digital <strong>Daeroom Media Network</strong> (<a href="https://daeroom.my.id" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">daeroom.my.id</a>).
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/pedoman-editorial"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <span>Baca Pedoman Editorial Lengkap</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <span>Hubungi Redaksi</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}

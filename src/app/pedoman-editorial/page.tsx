import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, ShieldCheck, ChevronRight, Award, CheckCircle2, HeartHandshake, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedoman Editorial & Keterbukaan Afiliasi — DaeReview",
  description:
    "Standar independensi riset, metodologi pengujian produk, dan keterbukaan komisi afiliasi resmi DaeReview.",
};

export default function PedomanEditorialPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <Header />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
            <nav className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">Pedoman Editorial & Afiliasi</span>
            </nav>
          </div>
        </div>

        {/* Content Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>STANDAR KEJUJURAN & TRANSPARANSI RISET</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pedoman Editorial & Keterbukaan Afiliasi
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Bagaimana tim DaeReview memilih, menguji, dan menyajikan ulasan produk secara jujur dan objektif bagi konsumen Indonesia.
          </p>
        </header>

        {/* Article Body */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 prose prose-slate max-w-none text-slate-700 space-y-8 text-sm sm:text-base leading-relaxed">
          {/* Section 1: Janji Independensi */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
              Janji Independensi Redaksi
            </h2>
            <p>
              Prinsip nomor satu di DaeReview sangat sederhana: <strong>Kepercayaan pembaca adalah segalanya</strong>. Tim redaksi kami tidak pernah dan tidak akan pernah menerima imbalan uang dari merek mana pun untuk memberikan ulasan positif palsu pada produk yang kualitasnya buruk.
            </p>
            <p>
              Jika sebuah produk memiliki kekurangan fisik, baterai yang boros, atau bodi yang ringkih, kami wajib menuliskannya secara gamblang pada poin <strong>Kekurangan</strong> di setiap artikel ulasan.
            </p>
          </section>

          {/* Section 2: Transparansi Komisi Afiliasi */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
              Keterbukaan Komisi Afiliasi (Affiliate Disclosure)
            </h2>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <HeartHandshake className="w-5 h-5 text-orange-600" />
                Bagaimana DaeReview Menghasilkan Pendapatan?
              </div>
              <p className="text-slate-600 leading-relaxed">
                DaeReview berpartisipasi dalam program kemitraan afiliasi resmi marketplace terkemuka Indonesia (seperti <strong>Shopee Affiliate</strong> dan <strong>Tokopedia Affiliate</strong>). Ketika Anda mengklik tautan belanja di web kami dan melakukan transaksi pembelian, kami dapat memperoleh komisi persentase kecil dari pihak marketplace.
              </p>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Penting: Komisi ini dibayarkan langsung oleh marketplace dan TIDAK MENAMBAH biaya sepeser pun pada harga belanjaan Anda.</span>
              </div>
              <p className="text-slate-500 text-xs">
                Pendapatan komisi ini kami investasikan kembali untuk membiayai operasional server berkecepatan tinggi, perangkat riset pengujian, dan pengembangan fitur situs demi kemudahan Anda.
              </p>
            </div>
          </section>

          {/* Section 3: Formula 4 Lapisan Kurasi */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
              Formula Kurasi Produk 4 Lapisan
            </h2>
            <p>
              Tidak semua barang laris layak direkomendasikan. Sebelum sebuah produk masuk ke dalam panduan belanja DaeReview, produk tersebut harus lolos saringan 4 filter ketat kami:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">Filter 1</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Toko Resmi & Garansi Jelas</h3>
                <p className="text-xs text-slate-600">Diprioritaskan berasal dari Official Store / Shopee Mall dengan jaminan garansi distributor resmi anti barang palsu (KW).</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">Filter 2</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Volume Penjualan Riil</h3>
                <p className="text-xs text-slate-600">Telah terjual minimal 1.000+ unit dengan rating toko rata-rata minimal 4.8 dari skala 5 bintang kepuasan pembeli.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">Filter 3</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Analisis Komplain Pembeli</h3>
                <p className="text-xs text-slate-600">Menyaring 100 review riil pembeli untuk mendeteksi komplain berulang (seperti baterai bocor atau kendala pengiriman).</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">Filter 4</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Price-to-Value Ratio</h3>
                <p className="text-xs text-slate-600">Memastikan fitur dan durabilitas yang didapat benar-benar sepadan dengan uang yang Anda keluarkan.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Koreksi dan Umpan Balik */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Koreksi & Masukan dari Pembaca</h2>
            <p className="text-sm text-slate-600">
              Jika Anda menemukan kekeliruan data spesifikasi teknis atau link harga toko yang sudah tidak aktif pada salah satu artikel kami, kami sangat mengapresiasi koreksi Anda. Hubungi tim kurasi kami di{" "}
              <a href="mailto:redaksi@daeroom.my.id" className="text-orange-600 font-bold hover:underline">
                redaksi@daeroom.my.id
              </a>.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Send,
  Building,
  HelpCircle,
  FileCheck
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak Redaksi & Hak Jawab — DaeReview",
  description:
    "Hubungi tim redaksi DaeReview untuk koreksi berita, hak jawab jurnalisme, pengiriman sampel uji coba produk, dan kemitraan resmi.",
};

export default function KontakPage() {
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
              <span className="text-slate-900 font-bold">Kontak &amp; Hak Jawab</span>
            </nav>
          </div>
        </div>

        {/* Content Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>SALURAN KOMUNIKASI RESMI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Redaksi DaeReview
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Punya masukan, menemukan data yang perlu dikoreksi, atau ingin mengirimkan unit produk untuk diuji? Kami siap mendengar.
          </p>
        </header>

        {/* Contact Grid */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Redaksi & Hak Jawab */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Koreksi Berita &amp; Hak Jawab</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kami menjunjung tinggi akurasi data. Jika ada kutipan keliru, spesifikasi yang tidak tepat, atau pihak yang ingin menyampaikan hak koreksi:
              </p>
              <div className="pt-2">
                <span className="text-xs text-slate-500 block font-medium">Email Khusus Editorial:</span>
                <a
                  href="mailto:redaksi@daeroom.my.id"
                  className="text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline"
                >
                  redaksi@daeroom.my.id
                </a>
              </div>
            </div>

            {/* Box 2: Pengujian Unit Produk & Kemitraan */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Pengiriman Sampel Uji &amp; Brand</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Untuk brand / produsen yang ingin mengirimkan sampel hardware untuk diuji mandiri oleh tim lab kami (dengan ketentuan hasil ulasan tetap 100% independen):
              </p>
              <div className="pt-2">
                <span className="text-xs text-slate-500 block font-medium">Email Kerjasama Lab:</span>
                <a
                  href="mailto:kerjasama@daeroom.my.id"
                  className="text-sm font-bold text-orange-600 hover:text-orange-800 hover:underline"
                >
                  kerjasama@daeroom.my.id
                </a>
              </div>
            </div>
          </div>

          {/* Ketentuan Uji Sampel */}
          <section className="p-6 rounded-2xl bg-amber-50/80 border-l-4 border-amber-500 space-y-2">
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
              ⚠️ Catatan Penting untuk Produsen &amp; Agensi
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              DaeReview menerima unit ulasan tanpa ikatan promosi. Pengiriman barang <strong>tidak menjamin</strong> bahwa produk akan diulas positif. Seluruh kekurangan, kelemahan sistem, dan perbandingan harga dengan kompetitor akan tetap dipublikasikan secara jujur demi melindungi pembaca kami.
            </p>
          </section>

          {/* Informasi Organisasi & Legalitas */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-slate-800" />
              Identitas Penerbit
            </h2>
            <div className="text-sm text-slate-600 space-y-1 leading-relaxed">
              <p><strong>Penerbit:</strong> Daeroom Media Network</p>
              <p><strong>Situs Utama:</strong> <a href="https://daeroom.my.id" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">daeroom.my.id</a></p>
              <p><strong>Wilayah Operasional:</strong> Indonesia</p>
              <p><strong>Jam Kerja Redaksi:</strong> Senin – Jumat, 09:00 – 18:00 WIB</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

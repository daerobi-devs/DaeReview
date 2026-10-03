import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, ChevronRight, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — DaeReview",
  description:
    "Kebijakan privasi resmi DaeReview mengenai perlindungan data pribadi, cookies afiliasi, dan kepatuhan UU PDP Indonesia.",
};

export default function KebijakanPrivasiPage() {
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
              <span className="text-slate-900 font-bold">Kebijakan Privasi</span>
            </nav>
          </div>
        </div>

        {/* Content Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>PERLINDUNGAN DATA PENGGUNA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Terakhir diperbarui: 3 Oktober 2026. Berlaku untuk seluruh pengunjung situs{" "}
            <strong className="text-slate-900">daereview.daeroom.my.id</strong>.
          </p>
        </header>

        {/* Legal Body Text */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 prose prose-slate max-w-none text-slate-700 space-y-8 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
              Komitmen Perlindungan Privasi
            </h2>
            <p>
              DaeReview (bagian dari ekosistem <strong>daeroom.my.id</strong>) menghormati dan berkomitmen penuh untuk melindungi privasi setiap pengunjung. Kebijakan ini merinci bagaimana kami menghimpun, mengelola, serta melindungi informasi saat Anda mengakses dan membaca ulasan di portal kami, sesuai dengan ketentuan <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
              Informasi yang Kami Kumpulkan
            </h2>
            <p>
              Kami mengumpulkan informasi secara terbatas semata-mata untuk meningkatkan kenyamanan dan relevansi pengalaman membaca Anda:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
              <li>
                <strong>Data Log Teknis:</strong> Alamat Protokol Internet (IP address), jenis peramban (browser), sistem operasi, waktu kunjungan, dan halaman ulasan yang dibuka.
              </li>
              <li>
                <strong>Riwayat Pencarian Lokal:</strong> Kata kunci yang Anda masukkan pada bilah pencarian internal kami (seperti &quot;TWS&quot; atau &quot;Keyboard&quot;) untuk menampilkan hasil rekomendasi yang akurat.
              </li>
              <li>
                <strong>Data Kontak Sukarela:</strong> Alamat email jika Anda secara sukarela mendaftarkan diri pada program buletin diskon dan rilis artikel baru.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
              Penggunaan Cookies & Tautan Afiliasi Marketplace
            </h2>
            <p>
              Situs ini menggunakan teknologi <em>cookies</em> untuk mengenali sesi kunjungan Anda. Ketika Anda mengeklik tombol keluar menuju mitra marketplace kami (seperti <strong>Shopee Indonesia</strong> dan <strong>Tokopedia</strong>):
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transparansi Cookie Afiliasi:
              </div>
              <p className="text-slate-600">
                Marketplace terkait akan menempatkan <em>affiliate tracking cookie</em> pada peramban Anda untuk mencatat rujukan belanja. Cookie ini tidak mengumpulkan nama, nomor rekening, kata sandi, atau data identitas pribadi Anda, melainkan hanya kode acak pelacak rujukan penjualan.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Anda berhak menonaktifkan cookies kapan saja melalui pengaturan peramban (browser settings) Anda tanpa kehilangan akses untuk membaca seluruh artikel di DaeReview.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">4</span>
              Keamanan Data & Pihak Ketiga
            </h2>
            <p>
              DaeReview <strong>tidak pernah dan tidak akan pernah menjual, menyewakan, atau memperdagangkan data pribadi pengunjung kepada pihak ketiga mana pun</strong>. Server kami diamankan dengan enkripsi SSL/TLS 256-bit standar industri.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-bold">5</span>
              Hak Anda sebagai Pengguna
            </h2>
            <p>
              Berdasarkan hukum yang berlaku, Anda memiliki hak untuk meminta informasi terkait data yang tersimpan, meminta perbaikan, atau meminta penghapusan email Anda dari basis data buletin kami kapan pun dengan menghubungi saluran resmi kami.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Hubungi Kami</h2>
            <p className="text-sm text-slate-600">
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi tim redaksi kami melalui surel resmi di:{" "}
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
